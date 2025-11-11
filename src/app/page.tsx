
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
import { Mail, MessageSquare, MapPin } from "lucide-react";
import type { Part, Brand } from "@/lib/types";
import { useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


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
                    <Skeleton className="w-[120px] h-[50px]" />
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
        className="flex items-center justify-center [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {extendedBrands.map((brand, index) => (
          <li key={`${brand.id}-${index}`}>
            <Image src={brand.logoUrl} alt={brand.name} width={120} height={50} className="object-contain" />
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center justify-center [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true">
        {extendedBrands.map((brand, index) => (
          <li key={`${brand.id}-clone-${index}`}>
            <Image src={brand.logoUrl} alt={brand.name} width={120} height={50} className="object-contain" />
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
              {featuredParts.map((part: Part) => (
                <CarouselItem key={part.id} className="md:basis-1/2 lg:basis-1/4">
                   <div className="p-1">
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group h-full">
                      <CardHeader className="p-0">
                        <Link href={`/parts/${part.id}`}>
                          <div className="relative aspect-square w-full">
                            <Image
                              src={part.imageUrls[0]}
                              alt={part.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              data-ai-hint="auto part"
                            />
                          </div>
                        </Link>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <h3 className="text-lg font-semibold leading-tight">
                           <Link href={`/parts/${part.id}`}>{part.name}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{getBrandForPart(part)?.name || part.brandId}</p>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center mt-auto">
                        <p className="text-xl font-bold text-primary">${part.price.toFixed(2)}</p>
                        <AddToCartButton part={{...part, brand: getBrandForPart(part), category: {id: part.categoryId, name: ''}}} />
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10" />
          </Carousel>
    )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {heroImages.map((image) => (
              <CarouselItem key={image.id} className="h-full">
                <div className="relative h-full w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={image.imageHint}
                  />
                   <div className="absolute inset-0 bg-white/40" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute z-10 w-full h-full flex flex-col items-center justify-center text-center p-4">
          <div className="flex-grow flex flex-col items-center justify-center text-foreground" style={{ textShadow: '0 1px 10px rgba(255, 255, 255, 0.6)' }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg font-headline">
              GranRepuestos
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/90 drop-shadow-md">
              Encuentra el repuesto original adecuado para tu vehículo en nuestro catálogo.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/parts">Comprar Ahora</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-16 lg:py-24 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
              Marcas con las que trabajamos
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Solo ofrecemos repuestos de las marcas más confiables del mercado.
            </p>
          </div>
          <BrandsSection />
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 lg:py-24 bg-background">
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
      <section id="contact" className="py-16 lg:py-24 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Contáctanos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">WhatsApp</h3>
              <a href="https://wa.me/584141123707" target="_blank" rel="noopener noreferrer" className="text-muted-foreground mt-2 hover:underline">
                +58 414-1123707
              </a>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Correo Electrónico</h3>
              <p className="text-muted-foreground mt-2">
                <a href="mailto:info@granrepuestos.com" className="hover:underline">info@granrepuestos.com</a>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Ubicación</h3>
              <p className="text-muted-foreground mt-2">Guatire Edo. Miranda</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
