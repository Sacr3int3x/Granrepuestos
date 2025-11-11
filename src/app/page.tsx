
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
import { getBrands } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const heroImages = PlaceHolderImages.filter(img => img.id.startsWith("hero-"));

export default function Home() {
  const brands = getBrands();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-screen flex items-center justify-center">
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
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute z-10 w-full h-full flex flex-col items-center justify-center text-center text-white p-4">
          <div className="flex-grow flex flex-col items-center justify-center">
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
          
          <div className="w-full pb-10">
            <div className="mx-auto max-w-6xl px-4">
              <p className="text-center text-sm font-semibold uppercase text-white/60 tracking-wider mb-6">
                Marcas con las que trabajamos
              </p>
              <div
                className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <ul
                  className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                  {brands.map((brand) => (
                    <li key={brand.id}>
                      <Image src={brand.logoUrl} alt={brand.name} width={120} height={50} className="object-contain" />
                    </li>
                  ))}
                </ul>
                <ul
                  className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
                  aria-hidden="true">
                  {brands.map((brand) => (
                    <li key={`${brand.id}-clone`}>
                      <Image src={brand.logoUrl} alt={brand.name} width={120} height={50} className="object-contain" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
