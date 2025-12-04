
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Part, Brand, Category, VehicleBrand, VehicleModel } from "@/lib/types";
import { getCategories, getVehicleBrands, getVehicleModels, sanitizeImageUrls } from "@/lib/data";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Info, Share2 } from "lucide-react";
import AddToCartButton from "./add-to-cart-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import ShareButton from "./share-button";

interface PartDetailsDialogProps {
  partId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PartDetailContent({ part, brand, category, vehicleBrands, vehicleModels }: { part: Part, brand: Brand, category: Category | null, vehicleBrands: VehicleBrand[], vehicleModels: VehicleModel[]}) {
  
  const getBrandName = (brandId: string) => vehicleBrands.find(b => b.id === brandId)?.name || brandId;
  const getModelName = (modelId: string) => vehicleModels.find(m => m.id === modelId)?.name || modelId;

  const compatibilityInfo = (() => {
    const info = {
      brands: new Set<string>(),
      models: new Set<string>(),
      years: new Set<string>(),
    };

    if (part.vehicleBrandIds) {
      part.vehicleBrandIds.forEach(brandId => {
        info.brands.add(getBrandName(brandId));
      });
    }
    
    if (part.vehicleModelIds) {
      part.vehicleModelIds.forEach(modelId => {
          info.models.add(getModelName(modelId));
      })
    }

    if (part.vehicleCompatibility) {
      part.vehicleCompatibility.forEach(comp => {
        if(comp.brandId) info.brands.add(getBrandName(comp.brandId));
        if(comp.modelId) info.models.add(getModelName(comp.modelId));
        if(comp.yearRange) info.years.add(comp.yearRange);
      });
    }

    return {
      brands: Array.from(info.brands).join(', ') || '-',
      models: Array.from(info.models).join(', ') || 'Varios',
      years: Array.from(info.years).join(', ') || 'Consultar',
    };
  })();

  const safeImageUrls = sanitizeImageUrls(part.imageUrls);
  const fullPart = { ...part, brand, category };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="pr-10">{part.name}</DialogTitle>
        <DialogDescription>
          SKU: {part.sku}
        </DialogDescription>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4">
        <div>
           <Carousel className="w-full">
            <CarouselContent>
              {safeImageUrls.length > 0 ? safeImageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative bg-card rounded-lg overflow-hidden border">
                    <Image
                      src={url}
                      alt={`${part.name} - vista ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      data-ai-hint="auto part"
                    />
                  </div>
                </CarouselItem>
              )) : (
                <CarouselItem>
                  <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
                    <Info className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {safeImageUrls.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>
        <div className="flex flex-col">
           <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-primary">${part.price.toFixed(2)}</p>
              <p className={part.stock > 0 ? "text-green-600 mt-1" : "text-red-600 mt-1"}>
                {part.stock > 0 ? `${part.stock} en stock` : "Agotado"}
              </p>
            </div>
             <div className="flex items-center gap-2">
                <AddToCartButton part={fullPart as Part} size="lg" />
            </div>
          </div>

           <div className="mt-6">
            <h3 className="text-lg font-bold tracking-tight">Detalles Técnicos</h3>
              <Table className="mt-2">
                  <TableBody>
                   <TableRow>
                      <TableCell className="font-medium">Marca</TableCell>
                      <TableCell>
                         {brand?.websiteUrl ? (
                           <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{brand.name}</a>
                          ) : (
                            <span>{brand?.name || '-'}</span>
                          )}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell className="font-medium">Categoría</TableCell>
                      <TableCell>{category?.name || '-'}</TableCell>
                  </TableRow>
                   <TableRow>
                      <TableCell className="font-medium">Marca Vehículo</TableCell>
                      <TableCell>{compatibilityInfo.brands}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell className="font-medium">Modelos</TableCell>
                      <TableCell>{compatibilityInfo.models}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell className="font-medium">Año</TableCell>
                      <TableCell>{compatibilityInfo.years}</TableCell>
                  </TableRow>
                   {part.description && (
                     <TableRow>
                      <TableCell colSpan={2}>{part.description}</TableCell>
                    </TableRow>
                   )}
                  </TableBody>
              </Table>
            </div>
             <div className="mt-auto pt-4 flex flex-col gap-4">
              <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>¿No estás seguro?</AlertTitle>
                  <AlertDescription>
                      <p>Si tienes dudas sobre la compatibilidad, contáctanos antes de comprar.</p>
                  </AlertDescription>
              </Alert>
               <div className="flex items-center gap-2">
                <ShareButton 
                    title={part.name}
                    text={`Mira este repuesto: ${part.name}`}
                    url={`/parts?part=${part.id}`}
                  />
                  <Link href="/politicas" className="text-sm text-muted-foreground hover:underline">
                    Ver políticas de devolución
                  </Link>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}


function PartDetailLoading() {
  return (
    <>
      <DialogHeader>
        <DialogTitle><Skeleton className="h-6 w-3/4" /></DialogTitle>
        <DialogDescription><Skeleton className="h-4 w-1/4" /></DialogDescription>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2 pt-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-2/3" />
            </div>
             <div className="pt-8">
                <Skeleton className="h-12 w-full" />
             </div>
        </div>
      </div>
    </>
  )
}

export function PartDetailsDialog({ partId, open, onOpenChange }: PartDetailsDialogProps) {
  const firestore = useFirestore();

  const partRef = useMemoFirebase(() => {
    if (!firestore || !partId) return null;
    return doc(firestore, 'parts', partId);
  }, [firestore, partId]);
  const { data: part, isLoading: isPartLoading } = useDoc<Part>(partRef);

  const brandRef = useMemoFirebase(() => {
    if (!firestore || !part?.brandId) return null;
    return doc(firestore, 'brands', part.brandId);
  }, [firestore, part]);
  const { data: brand, isLoading: isBrandLoading } = useDoc<Brand>(brandRef);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  
  useEffect(() => {
      setCategories(getCategories());
      setVehicleBrands(getVehicleBrands());
      setVehicleModels(getVehicleModels());
  }, []);

  const category = useMemo(() => {
    if (!part || categories.length === 0) return null;
    return categories.find(c => c.id === part.categoryId) || null;
  }, [part, categories]);
  
  const isLoading = isPartLoading || (part && isBrandLoading);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        {isLoading ? (
          <PartDetailLoading />
        ) : part && brand ? (
          <PartDetailContent part={part} brand={brand} category={category} vehicleBrands={vehicleBrands} vehicleModels={vehicleModels} />
        ) : (
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              No se pudo cargar la información del repuesto.
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}

    