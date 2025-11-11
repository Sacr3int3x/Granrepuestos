import Link from 'next/link';
import { getParts, getCategories, getBrands, getVehicleBrands, getVehicleModels } from '@/lib/data';
import type { Part } from '@/lib/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Suspense } from 'react';
import Filters from './components/filters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PARTS_PER_PAGE = 10;

export default function PartsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const vehicleBrand = typeof searchParams.vehicleBrand === 'string' ? searchParams.vehicleBrand : undefined;
  const vehicleModel = typeof searchParams.vehicleModel === 'string' ? searchParams.vehicleModel : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined;

  const allParts = getParts({ query, brand, category, minPrice, maxPrice, vehicleBrand, vehicleModel });
  const totalPages = Math.ceil(allParts.length / PARTS_PER_PAGE);
  const paginatedParts = allParts.slice((page - 1) * PARTS_PER_PAGE, page * PARTS_PER_PAGE);
  
  const categories = getCategories();
  const brands = getBrands();
  const vehicleBrands = getVehicleBrands();
  const vehicleModels = getVehicleModels();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        params.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      }
    });
    params.set('page', pageNumber.toString());
    return `/parts?${params.toString()}`;
  };

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
          <Suspense fallback={<div>Cargando filtros...</div>}>
            <Filters categories={categories} brands={brands} vehicleBrands={vehicleBrands} vehicleModels={vehicleModels} />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          {paginatedParts.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedParts.map((part: Part) => (
                    <TableRow key={part.id}>
                      <TableCell>
                        <Image
                          src={part.imageUrls[0]}
                          alt={part.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                          data-ai-hint="auto part"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>{part.brand.name}</TableCell>
                      <TableCell>{part.sku}</TableCell>
                      <TableCell className="text-right font-semibold">${part.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{part.stock}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/parts/${part.id}`}>Ver Detalles</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                      href={createPageURL(page - 1)}
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={createPageURL(i + 1)}
                        isActive={page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href={createPageURL(page + 1)} 
                      aria-disabled={page >= totalPages}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
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
