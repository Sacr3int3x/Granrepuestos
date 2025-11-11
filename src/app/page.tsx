
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
          <div className="mx-auto max-w-3xl text-center">
             <h2 className="text-3xl font-bold text-center tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Marcas de Confianza
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
              Nos asociamos con los mejores de la industria para ofrecerte repuestos fiables y de alta calidad.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {brands.map((brand) => (
              <div key={brand.id} className="flex justify-center">
                <Image
                  src={brand.logoUrl}
                  alt={`${brand.name} Logo`}
                  width={140}
                  height={70}
                  className="object-contain transition-transform duration-300 ease-in-out hover:scale-110 grayscale hover:grayscale-0"
                  data-ai-hint="brand logo"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
        <div className="container px-4 md:px-6">
           <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Productos Destacados
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
              Echa un vistazo a nuestros productos más populares y recomendados.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredParts.map((part: Part) => (
              <Card key={part.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="p-0">
                  <Link href={`/parts/${part.id}`} className="block relative aspect-square w-full">
                    <Image
                      src={part.imageUrls[0]}
                      alt={part.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      data-ai-hint="auto part"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold font-headline leading-tight">
                    <Link href={`/parts/${part.id}`}>{part.name}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{part.brand.name}</p>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                  <p className="text-lg font-bold text-primary">${part.price.toFixed(2)}</p>
                  <Button asChild variant="outline">
                    <Link href={`/parts/${part.id}`}>Ver</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
