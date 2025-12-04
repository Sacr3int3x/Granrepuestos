
"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Part, Brand, Category, VehicleBrand, VehicleModel } from "@/lib/types";
import AddToCartButton from "../components/add-to-cart-button";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { getCategories, getVehicleBrands, getVehicleModels, sanitizeImageUrls } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
      <div className="grid md:grid-cols-2 gap-12">
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {part.name}
          </h1>
          
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-primary">${part.price.toFixed(2)}</p>
              <p className={part.stock > 0 ? "text-green-600 mt-2" : "text-red-600 mt-2"}>
                {part.stock > 0 ? `${part.stock} en stock` : "Agotado"}
              </p>
            </div>
            <div className="flex items-center gap-2">
                <AddToCartButton part={fullPart as Part} size="lg" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Detalles Técnicos</h2>
        <Card className="mt-4">
            <Table>
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
                    <TableCell className="font-medium">Código de parte</TableCell>
                    <TableCell>{part.sku}</TableCell>
                </TableRow>
                {part.specifications && Object.entries(part.specifications).map(([key, value]) => (
                    <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{value}</TableCell>
                    </TableRow>
                ))}
                 <TableRow>
                    <TableCell className="font-medium">Marca del Vehículo</TableCell>
                    <TableCell>{compatibilityInfo.brands}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Modelos a los que aplica</TableCell>
                    <TableCell>{compatibilityInfo.models}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Año</TableCell>
                    <TableCell>{compatibilityInfo.years}</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Categoría</TableCell>
                    <TableCell>{category?.name || '-'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Descripción</TableCell>
                    <TableCell>{part.description || '-'}</TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </Card>
      </div>

      <div className="mt-12">
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Información Importante</AlertTitle>
            <AlertDescription>
                <p>Asegúrate de que este repuesto sea compatible con tu vehículo antes de comprar. Si tienes dudas, contáctanos.</p>
                <Link href="/politicas" className="font-semibold text-primary hover:underline mt-2 inline-block">
                Revisa nuestras políticas de envío y devolución
                </Link>
            </AlertDescription>
        </Alert>
      </div>
    </>
  );
}


function PartDetailClient({ partId }: { partId: string }) {
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
  
  const isLoading = isPartLoading || (part && (isBrandLoading || !brand || !category));

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-12">
          <div>
              <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
          </div>
      </div>
    )
  }

  if (!part || !brand) {
    notFound();
  }
  
  return <PartDetailContent part={part} brand={brand} category={category} vehicleBrands={vehicleBrands} vehicleModels={vehicleModels} />;
}


export default function PartDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  
  if (!id) {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
              <div>
                  <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
              <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-12 w-1/3" />
              </div>
          </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PartDetailClient partId={id} />
    </div>
  );
}
