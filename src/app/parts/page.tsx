
'use client';

import Link from 'next/link';
import type { Part, Brand } from '@/lib/types';
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
import { Suspense, useMemo } from 'react';
import Filters from './components/filters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from "@/components/ui/card";
import AddToCartButton from './components/add-to-cart-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search, CalendarDays } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { getParts, getCategories, getVehicleBrands } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';


const PARTS_PER_PAGE = 15;

function PartsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const query = searchParams.get('query') || undefined;
  const brandFilter = searchParams.get('brand') || undefined;
  const categoryFilter = searchParams.get('category') || undefined;
  const vehicleBrand = searchParams.get('vehicleBrand') || undefined;
  const vehicleModel = searchParams.get('vehicleModel') || undefined;
  
  const firestore = useFirestore();
  const partsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'parts');
  }, [firestore]);
  const { data: allParts, isLoading: partsLoading } = useCollection<Part>(partsQuery);

  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  const { data: allBrands, isLoading: brandsLoading } = useCollection<Brand>(brandsQuery);

  const { filteredParts, totalPages, paginatedParts } = useMemo(() => {
    if (!allParts || !allBrands) {
        return { filteredParts: [], totalPages: 0, paginatedParts: [] };
    }
    const filtered = getParts(allParts, { query, brand: brandFilter, category: categoryFilter, vehicleBrand, vehicleModel });
    const total = Math.ceil(filtered.length / PARTS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * PARTS_PER_PAGE, page * PARTS_PER_PAGE);
    return { filteredParts: filtered, totalPages: total, paginatedParts: paginated };
  }, [allParts, allBrands, query, brandFilter, categoryFilter, vehicleBrand, vehicleModel, page]);


  const categories = getCategories();
  const vehicleBrands = getVehicleBrands();

  const createQueryString = (paramsToUpdate: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      // Reset page to 1 when filters change
      params.set('page', '1');
      return params.toString();
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    router.push(pathname + '?' + createQueryString({ query: query || undefined }));
  };

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/parts?${params.toString()}`;
  };

  const FilterComponent = () => (
    <Filters categories={categories} vehicleBrands={vehicleBrands} />
  )
  
  const getBrandForPart = (part: Part) => allBrands?.find(b => b.id === part.brandId);
  const getCategoryForPart = (part: Part) => categories.find(c => c.id === part.categoryId);

  const isLoading = partsLoading || brandsLoading;

  return (
    <div className="bg-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Repuestos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Encuentra la pieza perfecta para tu vehículo.
          </p>
        </div>
        
         <div className="lg:hidden mb-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              name="query"
              placeholder="Buscar por nombre o SKU..." 
              className="pl-10 pr-20" 
              defaultValue={searchParams.get('query') || ''}
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">Buscar</Button>
          </form>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar y Ordenar
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] flex flex-col">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto">
                <FilterComponent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1 hidden lg:block">
            <FilterComponent />
          </aside>

          <main className="lg:col-span-3">
            {isLoading ? (
               <div className="space-y-4">
                  <div className="md:hidden space-y-4">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
                  </div>
                  <div className="hidden md:block border rounded-lg">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
              </div>
            ) : paginatedParts.length > 0 ? (
              <div className="space-y-4">
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedParts.map((part: Part) => {
                      const brand = getBrandForPart(part);
                      const category = getCategoryForPart(part);
                      if (!brand || !category) return null;
                      const fullPart = {...part, brand, category};
                      const yearInfo = part.vehicleCompatibility?.map(vc => vc.yearRange).join(', ');
                      return (
                          <Link href={`/parts/${part.id}`} key={part.id} className="block group">
                              <Card className="overflow-hidden">
                                  <CardContent className="p-4 flex gap-4">
                                  {part.imageUrls && part.imageUrls[0] && part.imageUrls[0] !== '' ? (
                                    <Image
                                        src={part.imageUrls[0]}
                                        alt={part.name}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover"
                                        data-ai-hint="auto part"
                                    />
                                  ) : (
                                    <div className="h-20 w-20 bg-muted rounded-md flex-shrink-0" />
                                  )}
                                  <div className="flex-grow">
                                      <h3 className="font-medium">{part.name}</h3>
                                      <p className="text-sm text-muted-foreground">{brand?.name}</p>
                                      {yearInfo && <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><CalendarDays className="h-3 w-3" /> {yearInfo}</p>}
                                      <div className="flex items-center justify-between mt-2">
                                      <p className="font-semibold">${part.price.toFixed(2)}</p>
                                      <AddToCartButton part={fullPart} size="icon" />
                                      </div>
                                  </div>
                                  </CardContent>
                              </Card>
                          </Link>
                      )
                  })}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Año(s)</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedParts.map((part: Part) => {
                          const brand = getBrandForPart(part);
                          const category = getCategoryForPart(part);
                          if (!brand || !category) return null;
                          const fullPart = {...part, brand, category};
                          const yearInfo = part.vehicleCompatibility?.map(vc => vc.yearRange).join(', ');
                          return (
                          <TableRow key={part.id} className="relative cursor-pointer" onClick={() => router.push(`/parts/${part.id}`)}>
                              <TableCell>
                                {part.imageUrls && part.imageUrls[0] && part.imageUrls[0] !== '' ? (
                                    <Image
                                        src={part.imageUrls[0]}
                                        alt={part.name}
                                        width={60}
                                        height={60}
                                        className="rounded-md object-cover h-auto"
                                        data-ai-hint="auto part"
                                    />
                                  ) : (
                                    <div className="h-[60px] w-[60px] bg-muted rounded-md" />
                                  )}
                              </TableCell>
                              <TableCell className="font-medium">{part.name}</TableCell>
                              <TableCell>{brand?.name}</TableCell>
                              <TableCell>{yearInfo || 'N/A'}</TableCell>
                              <TableCell>{part.sku}</TableCell>
                              <TableCell className="text-right font-semibold">${part.price.toFixed(2)}</TableCell>
                              <TableCell className="text-center">{part.stock}</TableCell>
                              <TableCell className="text-right">
                              <div className='flex items-center justify-end gap-2' onClick={(e) => e.stopPropagation()}>
                                  <AddToCartButton part={fullPart} size="icon" />
                              </div>
                              </TableCell>
                          </TableRow>
                          )
                      })}
                    </TableBody>
                  </Table>
                </div>
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
    </div>
  );
}


export default function PartsPage() {
  return (
    <Suspense fallback={<div className="bg-white"><div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">Cargando...</div></div>}>
      <PartsPageContent />
    </Suspense>
  )
}
