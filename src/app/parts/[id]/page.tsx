
"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, getDoc, DocumentReference } from "firebase/firestore";
import type { Part, Brand, Category } from "@/lib/types";
import { getCategories, getVehicleBrands, getVehicleModels, sanitizeImageUrls } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import AddToCartButton from "@/app/parts/components/add-to-cart-button";
import { useEffect, useMemo, useState } from "react";
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
import { Info, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ShareButton from "../components/share-button";

function PartDetailLoading() {
  return (
     <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-2/3 mb-6" />
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-12 w-1/2 mt-6" />
                <div className="space-y-2 pt-6">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="pt-8 flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    </div>
  );
}

function PartDetailPageContent({ part, brand, category }: { part: Part; brand: Brand | null, category: Category | null }) {
  
  const staticData = useMemo(() => ({
      vehicleBrands: getVehicleBrands(),
      allVehicleModels: getVehicleModels(),
  }), []);

  const getBrandName = (brandId: string) => staticData.vehicleBrands.find(b => b.id === brandId)?.name || brandId;
  const getModelName = (modelId: string) => staticData.allVehicleModels.find(m => m.id === modelId)?.name || modelId;

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
    
    if (part.yearRange) {
        info.years.add(part.yearRange);
    }

    return {
      brands: Array.from(info.brands).join(', ') || '-',
      models: Array.from(info.models).join(', ') || 'Varios',
      years: Array.from(info.years).join(', ') || 'Consultar',
    };
  })();

  const safeImageUrls = sanitizeImageUrls(part.imageUrls);
  const fullPart = { ...part, brand: brand || undefined, category: category || undefined };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/">Inicio</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/parts">Repuestos</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {category && (
                    <>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/parts?category=${category.id}`}>{category.name}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    </>
                )}
                <BreadcrumbItem>
                <BreadcrumbPage>{part.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
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
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{part.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">SKU: {part.sku}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {part.id}</p>
            </div>
           <div className="my-6 flex justify-between items-center">
            <div>
              <p className="text-4xl font-bold text-primary">${part.price.toFixed(2)}</p>
              <p className={part.stock > 0 ? "text-green-600 mt-1" : "text-red-600 mt-1"}>
                {part.stock > 0 ? `${part.stock} en stock` : "Agotado"}
              </p>
            </div>
             <div className="flex items-center gap-2">
                <AddToCartButton part={fullPart as Part} size="lg" showText={true}/>
            </div>
          </div>

           <div className="mt-6">
            <h3 className="text-lg font-bold tracking-tight">Detalles Técnicos</h3>
              <Table className="mt-2">
                  <TableBody>
                   <TableRow>
                      <TableCell className="font-medium">Marca</TableCell>
                      <TableCell>
                         {brand ? (
                            brand.websiteUrl ? (
                             <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{brand.name}</a>
                            ) : (
                              <span>{brand.name}</span>
                            )
                          ) : (
                             <span className="text-muted-foreground">Marca no encontrada</span>
                          )}
                      </TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell className="font-medium">Categoría</TableCell>
                      <TableCell>{category?.name || 'No especificada'}</TableCell>
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
                       <TableCell colSpan={2} className="pt-4">
                         <div className="prose prose-sm text-muted-foreground max-w-none">
                            {part.description}
                         </div>
                        </TableCell>
                    </TableRow>
                   )}
                  </TableBody>
              </Table>
            </div>
             <div className="mt-auto pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                 <ShareButton title={part.name} text={`Mira este repuesto: ${part.name}`} url={`/parts/${part.id}`} />
              </div>
              <Alert>
                <Truck className="h-4 w-4" />
                <AlertTitle>Envíos a Nivel Nacional</AlertTitle>
                <AlertDescription>
                    Realizamos envíos a toda Venezuela a través de MRW, Zoom y Tealca (Cobro a Destino).
                </AlertDescription>
              </Alert>
               <div className="flex items-center gap-2">
                  <Link href="/politicas" className="text-sm text-muted-foreground hover:underline">
                    Ver políticas de compra y devolución
                  </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function PartDetailLoader({ partId }: { partId: string }) {
    const firestore = useFirestore();
    const [partData, setPartData] = useState<{ part: Part; brand: Brand | null; category: Category | null } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchPartAndRelatedData = async () => {
        if (!firestore) return;

        const partRef = doc(firestore, 'parts', partId);
        try {
          const partSnap = await getDoc(partRef);
          if (!partSnap.exists()) {
            notFound();
            return;
          }
          
          const part = { ...partSnap.data(), id: partSnap.id } as Part;
          
          let brandData: Brand | null = null;
          if (part.brandId) {
            const brandRef = doc(firestore, 'brands', part.brandId);
            const brandSnap = await getDoc(brandRef);
            if (brandSnap.exists()) {
              brandData = { ...brandSnap.data(), id: brandSnap.id } as Brand;
            }
          }
          
          let categoryData: Category | null = null;
          const allCategories = getCategories();
          if (part.categoryIds && part.categoryIds.length > 0) {
            categoryData = allCategories.find(c => c.id === part.categoryIds[0]) || null;
          }

          setPartData({ part, brand: brandData, category: categoryData });
        } catch (e) {
          console.error("Failed to fetch part details:", e);
          setError(e as Error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPartAndRelatedData();
    }, [partId, firestore]);

    if (isLoading) {
        return <PartDetailLoading />;
    }

    if (error || !partData) {
        notFound();
    }
    
    return <PartDetailPageContent part={partData.part} brand={partData.brand} category={partData.category} />;
}


export default function PartDetailPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : '';

    if (!id) {
        notFound();
    }
    
    return <PartDetailLoader partId={id} />;
}
