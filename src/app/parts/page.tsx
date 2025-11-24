

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
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Suspense, useMemo } from 'react';
import Filters from './components/filters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import AddToCartButton from './components/add-to-cart-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search, X } from 'lucide-react';
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

  const getCompatibilityYear = (part: Part): string => {
    if (part.vehicleCompatibility && part.vehicleCompatibility.length > 0) {
      const years = new Set(part.vehicleCompatibility.map(vc => vc.yearRange).filter(Boolean));
      if (years.size > 0) {
        return Array.from(years).join(', ');
      }
    }
    return 'Consultar';
  };

  const { filteredParts, totalPages, paginatedParts } = useMemo(() => {
    if (!allParts || !allBrands) {
        return { filteredParts: [], totalPages: 0, paginatedParts: [] };
    }
    
    // Sanitize image URLs right after fetching
    const sanitizedParts = allParts.map(part => {
      let urls: string[] = [];
      if (typeof part.imageUrls === 'string') {
        const htmlString = part.imageUrls;
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = imgRegex.exec(htmlString)) !== null) {
            urls.push(match[1].trim());
        }
      } else if (Array.isArray(part.imageUrls)) {
        urls = part.imageUrls.filter(url => typeof url === 'string' && url.startsWith('http'));
      }
      return { ...part, imageUrls: urls };
    });

    const filtered = getParts(sanitizedParts, { query, brand: brandFilter, category: categoryFilter, vehicleBrand, vehicleModel });
    
    // Sort alphabetically by name
    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    const total = Math.ceil(sorted.length / PARTS_PER_PAGE);
    const paginated = sorted.slice((page - 1) * PARTS_PER_PAGE, page * PARTS_PER_PAGE);
    return { filteredParts: sorted, totalPages: total, paginatedParts: paginated };
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

  const clearFilters = () => {
    router.push(pathname);
  };
  
    const generatePagination = () => {
        if (totalPages <= 1) return [];

        const SIBLING_COUNT = 1;
        const totalPageNumbers = SIBLING_COUNT + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(page - SIBLING_COUNT, 1);
        const rightSiblingIndex = Math.min(page + SIBLING_COUNT, totalPages);
        
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * SIBLING_COUNT;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * SIBLING_COUNT;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
        return [];
    };


  const FilterComponent = () => (
    <Filters categories={categories} vehicleBrands={vehicleBrands} />
  )
  
  const getBrandForPart = (part: Part) => allBrands?.find(b => b.id === part.brandId);
  const getCategoryForPart = (part: Part) => categories.find(c => c.id === part.categoryId);

  const isLoading = partsLoading || brandsLoading;

  const hasActiveFilters = searchParams.size > 0 && (searchParams.has('page') ? searchParams.size > 1 : true);


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
              <Button variant="outline" className="w-full relative">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar y Ordenar
                 {hasActiveFilters && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                 )}
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
            {hasActiveFilters && !isLoading && (
              <div className="mb-4 flex items-center justify-between bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredParts.length} resultados filtrados.
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpiar Filtros
                </Button>
              </div>
            )}
            {isLoading ? (
               <div className="space-y-4">
                  <div className="md:hidden grid grid-cols-2 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                           <CardHeader className="p-0"><Skeleton className="h-32 w-full" /></CardHeader>
                           <CardContent className="p-3 space-y-2">
                             <Skeleton className="h-4 w-4/5" />
                             <Skeleton className="h-4 w-2/5" />
                           </CardContent>
                           <CardFooter className="p-3">
                             <Skeleton className="h-8 w-1/2" />
                           </CardFooter>
                        </Card>
                      ))}
                  </div>
                  <div className="hidden md:block border rounded-lg">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
              </div>
            ) : paginatedParts.length > 0 ? (
              <div className="space-y-4">
                {/* Mobile View - Cards */}
                <div className="md:hidden grid grid-cols-2 gap-4">
                  {paginatedParts.map((part: Part) => {
                      const brand = getBrandForPart(part);
                      const category = getCategoryForPart(part);
                      if (!brand || !category) return null;
                      const fullPart = {...part, brand, category};
                      const isValidImage = Array.isArray(part.imageUrls) && part.imageUrls.length > 0 && typeof part.imageUrls[0] === 'string' && part.imageUrls[0].startsWith('http');
                      return (
                          <Link href={`/parts/${part.id}`} key={part.id} className="block group">
                              <Card className="overflow-hidden flex flex-col h-full">
                                  <CardHeader className="p-0">
                                      <div className='relative w-full aspect-square'>
                                        {isValidImage ? (
                                          <Image
                                              src={part.imageUrls[0]}
                                              alt={part.name}
                                              fill
                                              className="object-cover group-hover:scale-105 transition-transform"
                                              sizes="(max-width: 767px) 50vw, 25vw"
                                              data-ai-hint="auto part"
                                          />
                                        ) : (
                                          <div className="h-full w-full bg-muted flex items-center justify-center">
                                            <Search className="h-8 w-8 text-muted-foreground"/>
                                          </div>
                                        )}
                                      </div>
                                  </CardHeader>
                                  <CardContent className="p-3 flex-grow flex flex-col">
                                      <h3 className="font-medium line-clamp-2 text-sm">{part.name}</h3>
                                      <p className="text-xs text-muted-foreground">{brand?.name}</p>
                                      <p className="text-xs text-muted-foreground">Año: {getCompatibilityYear(part)}</p>
                                  </CardContent>
                                  <CardFooter className="p-3 flex items-center justify-between mt-auto">
                                    <p className="font-semibold text-base">${part.price.toFixed(2)}</p>
                                    <AddToCartButton part={fullPart} size="icon" />
                                  </CardFooter>
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
                        <TableHead className="w-[120px]">Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Año</TableHead>
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
                          const isValidImage = Array.isArray(part.imageUrls) && part.imageUrls.length > 0 && typeof part.imageUrls[0] === 'string' && part.imageUrls[0].startsWith('http');
                          return (
                          <TableRow key={part.id}>
                              <TableCell>
                                <Link href={`/parts/${part.id}`}>
                                  <div className="relative w-[100px] h-[75px]">
                                    {isValidImage ? (
                                        <Image
                                            src={part.imageUrls[0]}
                                            alt={part.name}
                                            fill
                                            className="rounded-md object-cover"
                                            sizes="100px"
                                            data-ai-hint="auto part"
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-muted rounded-md" />
                                      )}
                                  </div>
                                </Link>
                              </TableCell>
                              <TableCell className="font-medium"><Link href={`/parts/${part.id}`}>{part.name}</Link></TableCell>
                              <TableCell><Link href={`/parts/${part.id}`}>{brand?.name}</Link></TableCell>
                              <TableCell><Link href={`/parts/${part.id}`}>{getCompatibilityYear(part)}</Link></TableCell>
                              <TableCell><Link href={`/parts/${part.id}`}>{part.sku}</Link></TableCell>
                              <TableCell className="text-right font-semibold"><Link href={`/parts/${part.id}`}>${part.price.toFixed(2)}</Link></TableCell>
                              <TableCell className="text-center"><Link href={`/parts/${part.id}`}>{part.stock}</Link></TableCell>
      
                              <TableCell className="text-right">
                              <div className='flex items-center justify-end gap-2'>
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
                <Button onClick={clearFilters} className="mt-6" variant="default">
                  Limpiar Filtros
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
                     {generatePagination().map((pageNumber, index) => (
                       <PaginationItem key={index}>
                         {typeof pageNumber === 'string' ? (
                           <PaginationEllipsis />
                         ) : (
                           <PaginationLink
                             href={createPageURL(pageNumber)}
                             isActive={page === pageNumber}
                           >
                             {pageNumber}
                           </PaginationLink>
                         )}
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
