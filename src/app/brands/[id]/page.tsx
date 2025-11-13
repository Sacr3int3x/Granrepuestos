
"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import type { Part, Brand, Category } from "@/lib/types";
import { getCategories } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AddToCartButton from "@/app/parts/components/add-to-cart-button";
import { Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";


function BrandPageContent({ brand, parts, categories }: { brand: Brand, parts: Part[], categories: Category[] }) {
    const getCategoryForPart = (part: Part) => categories.find(c => c.id === part.categoryId);

    return (
        <div>
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
                                            <AddToCartButton part={fullPart} />
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


function BrandPageClient({ brandId }: { brandId: string }) {
    const firestore = useFirestore();

    const brandRef = useMemoFirebase(() => {
        if (!firestore || !brandId) return null;
        return doc(firestore, 'brands', brandId);
    }, [firestore, brandId]);
    const { data: brand, isLoading: isBrandLoading } = useDoc<Brand>(brandRef);

    const partsQuery = useMemoFirebase(() => {
        if (!firestore || !brandId) return null;
        return query(collection(firestore, 'parts'), where('brandId', '==', brandId));
    }, [firestore, brandId]);
    const { data: parts, isLoading: arePartsLoading } = useCollection<Part>(partsQuery);
    
    const categories = getCategories();

    if (isBrandLoading || arePartsLoading) {
        return (
            <div className="space-y-12">
                <Skeleton className="h-[40vh] w-full rounded-lg" />
                <div className="max-w-4xl mx-auto space-y-4 text-center">
                    <Skeleton className="h-8 w-1/3 mx-auto" />
                    <Skeleton className="h-5 w-1/5 mx-auto" />
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-5 w-1/2 mx-auto" />
                </div>
                 <div className="my-12"><Separator /></div>
                 <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="aspect-square w-full" /></CardHeader>
                            <CardContent className="p-4 space-y-2"><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-2/4" /></CardContent>
                            <CardFooter className="p-4"><Skeleton className="h-8 w-2/4" /></CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    
    if (!brand) {
        notFound();
    }
    
    const validParts = parts || [];

    return <BrandPageContent brand={brand} parts={validParts} categories={categories} />;
}


export default function BrandDetailPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : '';

    if (!id) {
        return (
           <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
             <div className="space-y-12">
                <Skeleton className="h-[40vh] w-full rounded-lg" />
             </div>
           </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <BrandPageClient brandId={id} />
        </div>
    );
}

