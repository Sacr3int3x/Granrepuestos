
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeaturedParts, getBrands } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Part } from "@/lib/types";

const heroImages = PlaceHolderImages.filter(img => img.id.startsWith("hero-"));

export default function Home() {
  const featuredParts = getFeaturedParts();
  const brands = getBrands();
  const duplicatedBrands = [...brands, ...brands];
  const duplicatedFeaturedParts = [...featuredParts, ...featuredParts];

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
            Repuestos de Calidad, Precios Insuperables
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
            Encuentra el repuesto adecuado para tu vehículo en nuestro extenso catálogo.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/parts">Comprar Ahora</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Marcas de Confianza
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
            Nos asociamos con los mejores de la industria para ofrecerte repuestos fiables y de alta calidad.
          </p>
          <div
            className="w-full inline-flex flex-nowrap overflow-hidden mt-12"
          >
            <ul className="flex items-center justify-center [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
              {duplicatedBrands.map((brand, index) => (
                <li key={`${brand.id}-${index}`}>
                  <Image
                    src={brand.logoUrl}
                    alt={`${brand.name} Logo`}
                    width={150}
                    height={80}
                    className="object-contain transition-transform duration-300 ease-in-out hover:scale-110 grayscale hover:grayscale-0"
                    data-ai-hint="brand logo"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Productos Destacados
          </h2>
          <div
            className="w-full inline-flex flex-nowrap overflow-hidden mt-12"
          >
            <ul className="flex items-stretch justify-center [&>li]:mx-4 animate-infinite-scroll">
            {duplicatedFeaturedParts.map((part: Part, index) => (
              <li key={`${part.id}-${index}`} className="w-80 flex-shrink-0">
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={part.imageUrls[0]}
                        alt={part.name}
                        fill
                        className="object-cover"
                        sizes="320px"
                        data-ai-hint="auto part"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold font-headline">{part.name}</h3>
                    <p className="text-sm text-muted-foreground">{part.brand.name}</p>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">${part.price.toFixed(2)}</p>
                    <Button asChild variant="outline">
                      <Link href={`/parts/${part.id}`}>Ver</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
            </ul>
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/parts">Ver Todos los Repuestos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
