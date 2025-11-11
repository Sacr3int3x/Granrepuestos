
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
import { getFeaturedParts, getBrands } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Part } from "@/lib/types";

const heroImages = PlaceHolderImages.filter(img => img.id.startsWith("hero-"));

export default function Home() {
  const featuredParts = getFeaturedParts();
  const brands = getBrands();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center">
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
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
        <div className="absolute z-10 text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg font-headline">
            GranRepuestos
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
            Encuentra el repuesto adecuado para tu vehículo en nuestro extenso catálogo.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/parts">Comprar Ahora</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
