
"use client"

import { useMemo } from 'react';
import type { Part, Brand, Category } from '@/lib/types';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import { sanitizeImageUrls } from '@/lib/data';
import AddToCartButton from './add-to-cart-button';

interface RelatedPartsProps {
  parts: Part[];
}

export default function RelatedParts({ parts }: RelatedPartsProps) {
  const firestore = useFirestore();
  
  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  const { data: allBrands, isLoading: brandsLoading } = useCollection<Brand>(brandsQuery);

  const getBrandForPart = (part: Part): Brand | undefined => allBrands?.find(b => b.id === part.brandId);

  const getCompatibilityYear = (part: Part): string => {
    return part.yearRange || 'Consultar';
  };

  if (!parts || parts.length === 0) {
    return null;
  }
  
  if (brandsLoading) {
      return (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Repuestos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Card key={i}><CardHeader className="p-0 aspect-square bg-muted rounded-t-lg" /><CardContent className="p-4 bg-muted h-24 rounded-b-lg" /></Card>)}
            </div>
          </div>
      )
  }


  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Repuestos Relacionados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {parts.map((part) => {
          const brand = getBrandForPart(part);
          const fullPart = { ...part, brand };
          const firstImage = sanitizeImageUrls(part.imageUrls)[0];

          return (
            <Link href={`/parts/${part.id}`} key={part.id} className="block group">
              <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="p-0">
                  <div className="relative aspect-square w-full">
                    {firstImage ? (
                      <Image
                        src={firstImage}
                        alt={part.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        data-ai-hint="auto part"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-base font-semibold leading-tight line-clamp-2">{part.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{brand?.name || ''}</p>
                  <p className="text-sm text-muted-foreground">Año: {getCompatibilityYear(part)}</p>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center mt-auto">
                    <div>
                        <p className="text-lg font-bold text-primary">€{part.price.toFixed(2)}</p>
                    </div>
                  <AddToCartButton part={fullPart as Part} size="icon" />
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
