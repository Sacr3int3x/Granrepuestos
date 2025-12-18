

'use client';

import type { Part, Brand, VehicleBrand, Category } from '@/lib/types';
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
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import AddToCartButton from './components/add-to-cart-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { getParts, getCategories, getVehicleBrands, sanitizeImageUrls } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import Link from 'next/link';


const PARTS_PER_PAGE = 16;

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

  const categories = useMemo(() => getCategories(), []);
  const vehicleBrands = useMemo(() => getVehicleBrands(), []);

  const getCompatibilityBrand = (part: Part): string => {
    if (!part.vehicleBrandIds || part.vehicleBrandIds.length === 0) {
      return 'Varios';
    }
    const brandNames = part.vehicleBrandIds.map(id => {
      const brand = vehicleBrands.find(b => b.id === id);
      return brand ? brand.name : id;
    });

    return brandNames.join(', ');
  };

  const getCompatibilityYear = (part: Part): string => {
    if (part.yearRange) {
        return part.yearRange;
    }
    return 'Consultar';
  };

  const { filteredParts, totalPages, paginatedParts } = useMemo(() => {
    if (!allParts || !allBrands) {
        return { filteredParts: [], totalPages: 0, paginatedParts: [] };
    }
    
    const sanitizedParts = allParts.map(part => {
      return { ...part, imageUrls: sanitizeImageUrls(part.imageUrls) };
    });

    const filtered = getParts(sanitizedParts, { query, brand: brandFilter, category: categoryFilter, vehicleBrand, vehicleModel });
    
    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    const total = Math.ceil(sorted.length / PARTS_PER_PAGE);
    const paginated = sorted.slice((page - 1) * PARTS_PER_PAGE, page * PARTS_PER_PAGE);
    return { filteredParts: sorted, totalPages: total, paginatedParts: paginated };
  }, [allParts, allBrands, query, brandFilter, categoryFilter, vehicleBrand, vehicleModel, page]);


  const createQueryString = (paramsToUpdate: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
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
  
  const getBrandForPart = (part: Part): Brand | undefined => allBrands?.find(b => b.id === part.brandId);
  const getCategoryForPart = (part: Part): Category | undefined => categories.find(c => c.id === (part.categoryIds && part.categoryIds[0]));

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
            <SheetContent side="left" className="max-h-[80vh] flex flex-col">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto">
                <FilterComponent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <aside className="lg:col-span-2 hidden lg:block">
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                           <CardHeader className="p-0"><Skeleton className="aspect-square w-full" /></CardHeader>
                           <CardContent className="p-3 space-y-2">
                             <Skeleton className="h-4 w-4/5" />
                             <Skeleton className="h-4 w-2/5" />
                             <Skeleton className="h-4 w-3/5" />
                           </CardContent>
                           <CardFooter className="p-3">
                             <Skeleton className="h-8 w-1/2" />
                           </CardFooter>
                        </Card>
                      ))}
                  </div>
              </div>
            ) : paginatedParts.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {paginatedParts.map((part: Part) => {
                      const brand = getBrandForPart(part);
                      const category = getCategoryForPart(part);
                      if (!brand || !category) return null;
                      
                      const fullPart = {...part, brand, category };
                      const firstImage = (part.imageUrls && part.imageUrls.length > 0) ? part.imageUrls[0] : null;
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
                                    <div className="h-full w-full bg-muted flex items-center justify-center">
                                        <Search className="h-8 w-8 text-muted-foreground"/>
                                    </div>
                                    )}
                                </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow min-h-[140px]">
                                <h3 className="text-base font-semibold leading-tight line-clamp-2">
                                    {part.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">{brand.name}</p>
                                <p className="text-sm text-muted-foreground">Vehículo: {getCompatibilityBrand(part)}</p>
                                <p className="text-sm text-muted-foreground">Año: {getCompatibilityYear(part)}</p>
                                </CardContent>
                            <CardFooter className="p-4 flex justify-between items-center mt-auto">
                                <p className="text-lg font-bold text-primary">${part.price.toFixed(2)}</p>
                                <AddToCartButton part={fullPart} size="icon" />
                            </CardFooter>
                         </Card>
                        </Link>
                      )
                  })}
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
                   <PaginationContent className="gap-0.5">
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
