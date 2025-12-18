
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Part, Brand, Category } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AddToCartButton from "@/app/parts/components/add-to-cart-button";
import { Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BrandPageClientProps {
    brand: Brand;
    parts: Part[];
    categories: Category[];
}

export default function BrandPageClient({ brand, parts, categories }: BrandPageClientProps) {
    
    const getCategoryForPart = (part: Part) => {
      if (!part.categoryIds || part.categoryIds.length === 0) return undefined;
      return categories.find(c => c.id === part.categoryIds[0]);
    };

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <section className="relative w-full h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-card rounded-lg">
                {brand.heroImageUrl ? (
                    <>
                        <Image
                            src={brand.heroImageUrl}
                            alt={`Imagen de ${brand.name}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                            data-ai-hint="auto parts"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </>
                ) : <div className="absolute inset-0 bg-gradient-to-tr from-muted to-muted/50" />}
                
                <div className="relative z-10 text-center p-4">
                    <div className="max-w-xs mx-auto bg-black/30 backdrop-blur-sm p-4 rounded-lg">
                        <div className="relative h-20 w-48 mx-auto">
                             <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain" sizes="192px" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto py-12">
                 <div className="text-center">
                    {brand.countryOfOrigin && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                            <Globe className="h-5 w-5"/>
                            <span className="text-lg">{brand.countryOfOrigin}</span>
                        </div>
                    )}
                    <p className="text-lg text-muted-foreground">
                        {brand.description || `Explora todos los repuestos de la marca ${brand.name}.`}
                    </p>
                </div>
            </section>
            
            <Separator />

            <section className="py-12">
                <h2 className="text-3xl font-bold text-center mb-8 font-headline">Catálogo de {brand.name}</h2>
                {parts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {parts.map((part) => {
                            const category = getCategoryForPart(part);
                            const fullPart = { ...part, brand, category };
                            return (
                                <Link href={`/parts/${part.id}`} key={part.id} className="block group">
                                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-square w-full">
                                                <Image
                                                    src={part.imageUrls[0]}
                                                    alt={part.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    data-ai-hint="auto part"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 flex-grow">
                                            <h3 className="font-semibold">{part.name}</h3>
                                            <p className="text-sm text-muted-foreground">{brand.name}</p>
                                        </CardContent>
                                        <CardFooter className="p-4 flex justify-between items-center mt-auto">
                                            <p className="text-lg font-bold text-primary">${part.price.toFixed(2)}</p>
                                            <AddToCartButton part={fullPart as Part} />
                                        </CardFooter>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground bg-card rounded-lg">
                        <p>No hay repuestos disponibles para esta marca en este momento.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
