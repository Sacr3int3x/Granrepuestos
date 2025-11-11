import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPartById, getRelatedParts } from "@/lib/data";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { Part } from "@/lib/types";

export default function PartDetailPage({ params }: { params: { id: string } }) {
  const part = getPartById(params.id);

  if (!part) {
    notFound();
  }

  const relatedParts = getRelatedParts(part);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {part.imageUrls.map((url, index) => (
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
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {part.name}
          </h1>
          <div className="mt-2 flex items-center gap-4">
             <Link href={`/parts?brand=${part.brand.id}`} className="text-lg text-muted-foreground hover:text-primary transition-colors">{part.brand.name}</Link>
             <Badge variant="secondary">{part.category.name}</Badge>
          </div>
          <p className="mt-6 text-base text-muted-foreground">{part.description}</p>
          
          <div className="mt-8">
            <p className="text-4xl font-bold text-primary">${part.price.toFixed(2)}</p>
            <p className={part.stock > 0 ? "text-green-600 mt-2" : "text-red-600 mt-2"}>
              {part.stock > 0 ? `${part.stock} en stock` : "Agotado"}
            </p>
          </div>

          <div className="mt-8">
            <Button size="lg" className="w-full" disabled={part.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Añadir al Carrito
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Detalles Técnicos</h2>
        <Card className="mt-4">
            <Table>
                <TableBody>
                <TableRow>
                    <TableCell className="font-medium">SKU</TableCell>
                    <TableCell>{part.sku}</TableCell>
                </TableRow>
                {Object.entries(part.specifications).map(([key, value]) => (
                    <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{value}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </Card>
      </div>

      {relatedParts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-center font-headline">Repuestos Relacionados</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedParts.map((relatedPart: Part) => (
              <Card key={relatedPart.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={relatedPart.imageUrls[0]}
                      alt={relatedPart.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      data-ai-hint="auto part"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold">{relatedPart.name}</h3>
                  <p className="text-sm text-muted-foreground">{relatedPart.brand.name}</p>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                  <p className="text-lg font-bold text-primary">${relatedPart.price.toFixed(2)}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/parts/${relatedPart.id}`}>Ver</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
