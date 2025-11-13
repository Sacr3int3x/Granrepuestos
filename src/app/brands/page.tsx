
"use client";

import Image from "next/image";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Brand } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

function BrandsList() {
    const firestore = useFirestore();
    const brandsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'brands');
    }, [firestore]);
    const { data: brands, isLoading } = useCollection<Brand>(brandsQuery);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                    <Card key={i} className="flex flex-col items-center justify-center p-6 space-y-4">
                        <Skeleton className="h-16 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </Card>
                ))}
            </div>
        );
    }
    
    if (!brands || brands.length === 0) {
        return <p className="text-center text-muted-foreground">No se encontraron marcas.</p>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands.map((brand) => (
                <Link href={`/brands/${brand.id}`} key={brand.id} className="group">
                    <Card className="flex flex-col items-center justify-center p-6 h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                        <div className="relative h-16 w-28 mb-4">
                            <Image
                                src={brand.logoUrl}
                                alt={`${brand.name} logo`}
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                sizes="112px"
                            />
                        </div>
                        <h3 className="font-semibold text-center">{brand.name}</h3>
                        {brand.countryOfOrigin && (
                           <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                             <Globe className="h-3 w-3" />
                             <span>{brand.countryOfOrigin}</span>
                           </div>
                        )}
                    </Card>
                </Link>
            ))}
        </div>
    );
}


export default function BrandsPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
                    Nuestras Marcas
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explora el catálogo de repuestos de nuestras marcas aliadas, seleccionadas por su calidad, durabilidad y rendimiento garantizado.
                </p>
            </div>
            <BrandsList />
        </div>
    );
}
