

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeaturedParts } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import AddToCartButton from "./parts/components/add-to-cart-button";
import { Mail, MessageSquare, MapPin, Instagram } from "lucide-react";
import type { Part, Brand } from "@/lib/types";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import HeroImage from "@/components/hero.jpeg";
import { Separator } from "@/components/ui/separator";


const heroImages = PlaceHolderImages.filter(img => img.id.startsWith("hero-"));

function BrandsSection() {
  const firestore = useFirestore();
  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  
  const { data: brands, isLoading } = useCollection<Brand>(brandsQuery);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
          <div className="w-full inline-flex flex-nowrap overflow-hidden">
             <ul className="flex items-center justify-center [&_li]:mx-8">
                {[...Array(6)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="w-[150px] h-[60px]" />
                  </li>
                ))}
             </ul>
          </div>
      </div>
    )
  }
  
  if (!brands || brands.length === 0) {
    return null; // Or a message indicating no brands found
  }

  // Duplicate brands for infinite scroll effect
  const extendedBrands = [...brands, ...brands];

  return (
    <div
      className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul
        className="flex items-center justify-center [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
        {extendedBrands.map((brand, index) => (
          <li key={`${brand.id}-${index}`}>
            <div className="relative h-[100px] w-[250px]">
              <Image src={brand.logoUrl} alt={brand.name} fill sizes="250px" className="object-contain" />
            </div>
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center justify-center [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true">
        {extendedBrands.map((brand, index) => (
          <li key={`${brand.id}-clone-${index}`}>
            <div className="relative h-[100px] w-[250px]">
                <Image src={brand.logoUrl} alt={brand.name} fill sizes="250px" className="object-contain" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


function FeaturedProductsSection() {
    const firestore = useFirestore();
    const brandsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'brands');
    }, [firestore]);
    const { data: brands, isLoading: brandsLoading } = useCollection<Brand>(brandsQuery);

    const partsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'parts'), where('isFeatured', '==', true));
    }, [firestore]);

    const { data: featuredParts, isLoading: partsLoading } = useCollection<Part>(partsQuery);
    
    const getBrandForPart = (part: Part) => brands?.find(b => b.id === part.brandId);

    const getCompatibilityYear = (part: Part): string => {
        if (part.vehicleCompatibility && part.vehicleCompatibility.length > 0) {
          const years = new Set(part.vehicleCompatibility.map(vc => vc.yearRange).filter(Boolean));
          if (years.size > 0) {
            return Array.from(years).join(', ');
          }
        }
        return 'Consultar';
    };

    if (partsLoading || brandsLoading) {
        return (
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                         <Card key={i}>
                            <CardHeader><Skeleton className="h-[200px] w-full" /></CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-2/5" />
                            </CardContent>
                             <CardFooter>
                                <Skeleton className="h-8 w-1/2" />
                            </CardFooter>
                         </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!featuredParts || featuredParts.length === 0) {
        return <div className="text-center text-muted-foreground">No hay productos destacados.</div>;
    }

    return (
        <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredParts.map((part: Part) => {
                const imageUrl = part.imageUrls?.[0];
                return (
                <CarouselItem key={part.id} className="md:basis-1/2 lg:basis-1/4">
                   <div className="p-1">
                    <Link href={`/parts/${part.id}`} className="block group">
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                        <CardHeader className="p-0">
                            <div className="relative aspect-square w-full">
                                {imageUrl ? (
                                    <Image
                                    src={imageUrl}
                                    alt={part.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    data-ai-hint="auto part"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                            <h3 className="text-lg font-semibold leading-tight">
                                {part.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{getBrandForPart(part)?.name || part.brandId}</p>
                            <p className="text-sm text-muted-foreground">Año: {getCompatibilityYear(part)}</p>
                        </CardContent>
                        <CardFooter className="p-4 flex justify-between items-center mt-auto">
                            <p className="text-xl font-bold text-primary">${part.price.toFixed(2)}</p>
                            <AddToCartButton part={{...part, brand: getBrandForPart(part), category: {id: part.categoryId, name: ''}}} />
                        </CardFooter>
                        </Card>
                    </Link>
                  </div>
                </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10" />
          </Carousel>
    )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image
                src={HeroImage}
                alt="Repuestos de automoviles"
                fill
                className="object-cover"
                quality={100}
                priority
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="absolute z-10 w-full h-full flex flex-col items-center justify-center text-center p-4">
          <div className="flex-grow flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg font-headline animate-fade-in-up [animation-delay:0.2s]">
              GranRepuestos
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md animate-fade-in-up [animation-delay:0.4s]">
              La fuente de repuestos para tu vehiculo, originales y de máxima calidad.
            </p>
            <Button asChild size="lg" className="mt-12 bg-primary text-primary-foreground hover:bg-primary/90 animate-fade-in-up [animation-delay:0.6s]">
              <Link href="/parts">Ver Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-16 lg:py-24 bg-card border-y animate-fade-in-up [animation-delay:0.8s]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
              Marcas con las que trabajamos
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Nuestro compromiso es la durabilidad y el rendimiento. Por eso, solo distribuimos repuestos originales y certificados de los fabricantes líderes a nivel mundial.
            </p>
             <p className="mt-4 text-xl font-bold text-primary">
              ¡Cero imitaciones, Cero Chino!
            </p>
          </div>
          <BrandsSection />
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 lg:py-24 bg-background animate-fade-in-up [animation-delay:1s]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Productos Destacados</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Los repuestos más populares y recomendados por nuestros clientes.
            </p>
          </div>
          <FeaturedProductsSection />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-card border-t animate-fade-in-up [animation-delay:1.2s]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Contáctanos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                  
                  <a href="https://wa.me/584120177075" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <MessageSquare className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                    <div>
                      <h3 className="text-lg font-semibold">WhatsApp</h3>
                      <p className="text-muted-foreground group-hover:underline">+58 412-0177075</p>
                    </div>
                  </a>

                  <Separator orientation="vertical" className="hidden md:block h-16" />
                  <Separator orientation="horizontal" className="md:hidden" />
                  
                  <a href="mailto:info@granrepuestos.com" className="flex items-center gap-4 group">
                    <Mail className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                    <div>
                      <h3 className="text-lg font-semibold">Correo Electrónico</h3>
                      <p className="text-muted-foreground group-hover:underline">info@granrepuestos.com</p>
                    </div>
                  </a>
                  
                  <Separator orientation="vertical" className="hidden md:block h-16" />
                  <Separator orientation="horizontal" className="md:hidden" />

                  <a href="https://www.instagram.com/granrepuesto.ve" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <Instagram className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                    <div>
                      <h3 className="text-lg font-semibold">Instagram</h3>
                      <p className="text-muted-foreground group-hover:underline">@granrepuesto.ve</p>
                    </div>
                  </a>
                  
                  <Separator orientation="vertical" className="hidden md:block h-16" />
                   <Separator orientation="horizontal" className="md:hidden" />

                  <div className="flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">Ubicación</h3>
                      <p className="text-muted-foreground">Guatire Edo. Miranda</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
