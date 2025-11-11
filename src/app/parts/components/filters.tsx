"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Category, Brand } from '@/lib/types';
import { Search, X } from 'lucide-react';

interface FiltersProps {
  categories: Category[];
  brands: Brand[];
}

export default function Filters({ categories, brands }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      // Reset page to 1 when filters change
      params.set('page', '1');
      return params.toString();
    },
    [searchParams]
  );
  
  const handleSelectChange = (key: string) => (value: string) => {
    router.push(pathname + '?' + createQueryString({ [key]: value === 'all' ? undefined : value }));
  };
  
  const handlePriceChange = (newPrice: number[]) => {
    router.push(pathname + '?' + createQueryString({ maxPrice: newPrice[0] }));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    router.push(pathname + '?' + createQueryString({ query: query || undefined }));
  };

  const clearFilters = () => {
    router.push(pathname);
  };
  
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 500;
  const hasFilters = !!(searchParams.get('query') || searchParams.get('brand') || searchParams.get('category') || searchParams.get('maxPrice'));


  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Filtros
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            name="query"
            placeholder="Buscar por nombre o SKU..." 
            className="pl-10" 
            defaultValue={searchParams.get('query') || ''}
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">Buscar</Button>
        </form>

        <div className="grid gap-2">
          <label className="font-medium">Marca</label>
          <Select onValueChange={handleSelectChange('brand')} defaultValue={searchParams.get('brand') || 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="font-medium">Categoría</label>
          <Select onValueChange={handleSelectChange('category')} defaultValue={searchParams.get('category') || 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
           <label htmlFor="price-range" className="font-medium">
            Rango de Precio: <span className="font-bold text-primary">${currentMaxPrice}</span>
          </label>
          <Slider
            id="price-range"
            max={500}
            step={10}
            defaultValue={[currentMaxPrice]}
            onValueCommit={handlePriceChange}
            aria-label="Price range slider"
          />
        </div>
      </CardContent>
    </Card>
  );
}
