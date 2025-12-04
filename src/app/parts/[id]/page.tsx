
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import type { Part, Brand, Category, VehicleBrand, VehicleModel } from "@/lib/types";
import AddToCartButton from "../components/add-to-cart-button";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { getCategories, getVehicleBrands, getVehicleModels, sanitizeImageUrls } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

function PartDetailContent({ part, brands, categories, vehicleBrands, vehicleModels }: { part: Part; brands: Brand[]; categories: Category[], vehicleBrands: VehicleBrand[], vehicleModels: VehicleModel[] }) {
    const firestore = useFirestore();
    
    const brand = brands.find(b => b.id === part.brandId);
    const category = categories.find(c => c.id === part.categoryId);

    const fullPart = {
        ...part,
        brand: brand || { id: part.brandId, name: 'Unknown', logoUrl: ''},
        category: category || { id: part.categoryId, name: 'Unknown' }
    };

    const relatedPartsQuery = useMemoFirebase(() => {
        if (!firestore || !part.relatedPartIds || part.relatedPartIds.length === 0) return null;
        return query(collection(firestore, 'parts'), where('__name__', 'in', part.relatedPartIds));
    }, [firestore, part.relatedPartIds]);

    const { data: relatedParts } = useCollection<Part>(relatedPartsQuery);
    
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
          info.brands.add(getBrandName(comp.brandId));
          info.models.add(getModelName(comp.modelId));
          info.years.add(comp.yearRange);
        });
      }

      return {
        brands: Array.from(info.brands).join(', ') || 'N/A',
        models: Array.from(info.models).join(', ') || 'Varios',
        years: Array.from(info.years).join(', ') || 'Consultar',
      };
    })();


    return (
    <>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {fullPart.imageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative bg-card rounded-lg overflow-hidden border">
                    <Image
                      src={url}
                      alt={`${fullPart.name} - vista ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      data-ai-hint="auto part"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {fullPart.name}
          </h1>
          
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-primary">${fullPart.price.toFixed(2)}</p>
              <p className={fullPart.stock > 0 ? "text-green-600 mt-2" : "text-red-600 mt-2"}>
                {fullPart.stock > 0 ? `${fullPart.stock} en stock` : "Agotado"}
              </p>
            </div>
             <AddToCartButton part={fullPart} size="lg" className="h-14 w-14 rounded-full" />
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
                       {brand && brand.websiteUrl ? (
                         <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{fullPart.brand.name}</a>
                        ) : (
                          <span>{fullPart.brand.name}</span>
                        )}
                    </TableCell>
                </TableRow>
                
                <TableRow>
                    <TableCell className="font-medium">Código de parte</TableCell>
                    <TableCell>{fullPart.sku}</TableCell>
                </TableRow>
                {fullPart.specifications && Object.entries(fullPart.specifications).map(([key, value]) => (
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
                    <TableCell>{fullPart.category.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Descripción</TableCell>
                    <TableCell>{fullPart.description}</TableCell>
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


      {relatedParts && relatedParts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-center font-headline">Repuestos Relacionados</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedParts.map((relatedPart: Part) => (
              <a href={`/parts/${relatedPart.id}`} key={relatedPart.id} className="block group">
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                    <CardHeader className="p-0">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={sanitizeImageUrls(relatedPart.imageUrls)[0] || ''}
                          alt={relatedPart.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          data-ai-hint="auto part"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="text-lg font-semibold">{relatedPart.name}</h3>
                      {brands.find(b => b.id === relatedPart.brandId) && (
                          <p className="text-sm text-muted-foreground">{brands.find(b => b.id === relatedPart.brandId)?.name}</p>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between items-center">
                      <p className="text-lg font-bold text-primary">${relatedPart.price.toFixed(2)}</p>
                      <AddToCartButton part={{...relatedPart, brand: brands.find(b => b.id === relatedPart.brandId), category: categories.find(c => c.id === relatedPart.categoryId)}} />
                    </CardFooter>
                  </Card>
              </a>
            ))}
          </div>
        </div>
      )}
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

  const brandsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  const { data: brands, isLoading: areBrandsLoading } = useCollection<Brand>(brandsRef);

  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  
  useEffect(() => {
      setCategories(getCategories());
      setVehicleBrands(getVehicleBrands());
      setVehicleModels(getVehicleModels());
  }, []);

  const isLoading = isPartLoading || areBrandsLoading || categories.length === 0 || vehicleBrands.length === 0 || vehicleModels.length === 0;

  if (isLoading) {
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
    )
  }

  if (!part || !brands) {
    notFound();
  }

  const sanitizedPart = {
    ...part,
    imageUrls: sanitizeImageUrls(part.imageUrls),
  };

  return <PartDetailContent part={sanitizedPart} brands={brands} categories={categories} vehicleBrands={vehicleBrands} vehicleModels={vehicleModels} />;
}


export default function PartDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  
  if (!id) {
    // You can return a loading state or null here
    // while waiting for the router to be ready.
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
