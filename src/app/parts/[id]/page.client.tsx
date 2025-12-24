
"use client";

import Image from "next/image";
import type { Part, Brand, Category } from "@/lib/types";
import { getCategories, getVehicleBrands, getVehicleModels, sanitizeImageUrls } from "@/lib/data";
import AddToCartButton from "@/app/parts/components/add-to-cart-button";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Info, Truck, Wallet, PercentCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ShareButton from "../components/share-button";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import RelatedParts from "../components/related-parts";
import { Separator } from "@/components/ui/separator";

function PartDetailPageClient({ part, brand, category, relatedParts }: { part: Part; brand: Brand | null, category: Category | null, relatedParts: Part[] }) {
  
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { exchangeRate } = useCart();

  const staticData = useMemo(() => ({
      vehicleBrands: getVehicleBrands(),
      allVehicleModels: getVehicleModels(),
  }), []);

  const getBrandName = (brandId: string) => staticData.vehicleBrands.find(b => b.id === brandId)?.name || brandId;
  const getModelName = (modelId: string) => staticData.allVehicleModels.find(m => m.id === modelId)?.name || modelId;
  
  const safeImageUrls = sanitizeImageUrls(part.imageUrls);
  const fullPart = { ...part, brand: brand || undefined, category: category || undefined };

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api]);

  const onThumbClick = useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

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

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: part.name,
    image: safeImageUrls,
    description: part.description,
    sku: part.sku,
    brand: {
      '@type': 'Brand',
      name: brand?.name || 'N/A',
    },
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'EUR',
      price: part.price.toFixed(2),
      itemCondition: 'https://schema.org/NewCondition',
      availability: part.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
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
           <Carousel className="w-full" setApi={setApi}>
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
                      priority={index === 0}
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
                <CarouselPrevious className="left-2 hidden md:flex" />
                <CarouselNext className="right-2 hidden md:flex" />
              </>
            )}
          </Carousel>

          {safeImageUrls.length > 1 && (
             <div className="mt-4">
                <Carousel
                    opts={{
                    align: "start",
                    containScroll: "keepSnaps",
                    dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2">
                    {safeImageUrls.map((url, index) => (
                        <CarouselItem key={index} className="basis-1/4 lg:basis-1/5 pl-2">
                        <div
                            className={cn(
                            "aspect-square relative rounded-md overflow-hidden cursor-pointer border-2",
                            index === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-100 transition-opacity"
                            )}
                            onClick={() => onThumbClick(index)}
                        >
                            <Image
                            src={url}
                            alt={`Miniatura de ${part.name} - ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="10vw"
                            />
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
             </div>
          )}
        </div>
        <div className="flex flex-col">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{part.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">SKU: {part.sku}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {part.id}</p>
            </div>
           <div className="my-6">
                <div>
                  <p className="text-4xl font-bold text-primary">€{part.price.toFixed(2)}</p>
                  {exchangeRate > 0 && (
                    <p className="text-lg text-muted-foreground">
                      Aprox. Bs. {(part.price * exchangeRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                  <p className={cn("mt-1", part.stock > 0 ? "text-green-600" : "text-red-600")}>
                    {part.stock > 0 ? `${part.stock} en stock` : "Agotado"}
                  </p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 my-6">
                <AddToCartButton part={fullPart as Part} size="lg" showText={true}/>
                <ShareButton title={part.name} text={`Mira este repuesto: ${part.name}`} url={`/parts/${part.id}`} />
            </div>

            <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800 [&>svg]:text-amber-600">
                <PercentCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">¡Oferta Exclusiva!</AlertTitle>
                <AlertDescription>
                    Obtén un <strong>15% de descuento</strong> en tu compra total pagando con <strong>Binance Pay</strong>.
                </AlertDescription>
            </Alert>


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
             <div className="mt-auto pt-4 md:hidden">
              <div className="flex flex-col gap-4">
                <Alert>
                  <Wallet className="h-4 w-4" />
                  <AlertTitle>Métodos de Pago</AlertTitle>
                  <AlertDescription>
                    Aceptamos pagos a tasa BCV: Pago Móvil, Transferencias y Binance Pay.
                  </AlertDescription>
                </Alert>
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
        <footer className="hidden md:block mt-12 pt-8 border-t">
            <div className="grid md:grid-cols-2 gap-8">
                 <Alert>
                    <Wallet className="h-4 w-4" />
                    <AlertTitle>Métodos de Pago</AlertTitle>
                    <AlertDescription>
                    Aceptamos pagos a tasa BCV: Pago Móvil, Transferencias y Binance Pay.
                    </AlertDescription>
                </Alert>
                <Alert>
                    <Truck className="h-4 w-4" />
                    <AlertTitle>Envíos a Nivel Nacional</AlertTitle>
                    <AlertDescription>
                        Realizamos envíos a toda Venezuela a través de MRW, Zoom y Tealca (Cobro a Destino).
                    </AlertDescription>
                </Alert>
            </div>
             <div className="mt-4 text-center">
                <Link href="/politicas" className="text-sm text-muted-foreground hover:underline">
                    Ver políticas de compra y devolución
                </Link>
            </div>
        </footer>

       {relatedParts && relatedParts.length > 0 && (
            <div className="mt-16">
                <Separator />
                <RelatedParts parts={relatedParts} />
            </div>
       )}
    </div>
  );
}

export default PartDetailPageClient;
