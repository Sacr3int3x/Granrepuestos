import Link from 'next/link';
import { getParts, getCategories, getBrands } from '@/lib/data';
import type { Part } from '@/lib/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Suspense } from 'react';
import Filters from './components/filters';

const PARTS_PER_PAGE = 8;

export default function PartsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined;

  const allParts = getParts({ query, brand, category, minPrice, maxPrice });
  const totalPages = Math.ceil(allParts.length / PARTS_PER_PAGE);
  const paginatedParts = allParts.slice((page - 1) * PARTS_PER_PAGE, page * PARTS_PER_PAGE);
  
  const categories = getCategories();
  const brands = getBrands();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Repuestos
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Encuentra la pieza perfecta para tu vehículo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <Filters categories={categories} brands={brands} />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          {paginatedParts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedParts.map((part: Part) => (
                <Card key={part.id} className="flex flex-col overflow-hidden transition-shadow duration-300 shadow-md hover:shadow-xl">
                  <CardHeader className="p-0">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={part.imageUrls[0]}
                        alt={part.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        data-ai-hint="auto part"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-4">
                    <CardTitle className="mb-1 text-lg leading-tight font-headline">{part.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{part.brand.name}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-xl font-bold text-primary">${part.price.toFixed(2)}</p>
                    <Button asChild variant="outline">
                      <Link href={`/parts/${part.id}`}>Ver Detalles</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-lg">
              <h2 className="text-2xl font-semibold">No se encontraron resultados</h2>
              <p className="mt-2 text-muted-foreground">
                Intenta ajustar tus filtros o búsqueda.
              </p>
              <Button asChild className="mt-6" variant="default">
                <Link href="/parts">Limpiar Filtros</Link>
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href={page > 1 ? { pathname: '/parts', query: { ...searchParams, page: page - 1 } } : '#'}
                      aria-disabled={page <= 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={{ pathname: '/parts', query: { ...searchParams, page: i + 1 } }}
                        isActive={page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href={page < totalPages ? { pathname: '/parts', query: { ...searchParams, page: page + 1 } } : '#'} 
                      aria-disabled={page >= totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
