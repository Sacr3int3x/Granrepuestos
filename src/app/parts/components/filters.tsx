
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Category, Brand, VehicleBrand } from '@/lib/types';
import { Search, X } from 'lucide-react';
import { getVehicleModels } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


interface FiltersProps {
  categories: Category[];
  vehicleBrands: VehicleBrand[];
}

export default function Filters({ categories, vehicleBrands }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const firestore = useFirestore();
  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  const { data: brands } = useCollection<Brand>(brandsQuery);

  const selectedVehicleBrand = searchParams.get('vehicleBrand');
  
  const availableModels = useMemo(() => {
    if (!selectedVehicleBrand) return [];
    return getVehicleModels(selectedVehicleBrand);
  }, [selectedVehicleBrand]);


  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | undefined>) => {
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
    },
    [searchParams]
  );
  
  const handleBrandChange = (value: string) => {
    const newQueryString = createQueryString({ 
        vehicleBrand: value, 
        vehicleModel: undefined // Reset model when brand changes
    });
    router.push(`${pathname}?${newQueryString}`);
  };

  const handleModelChange = (value: string) => {
    router.push(`${pathname}?${createQueryString({ vehicleModel: value })}`);
  };

  const handleSelectChange = (key: string) => (value: string) => {
    router.push(pathname + '?' + createQueryString({ [key]: value }));
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
  
  const hasActiveFilters = searchParams.size > 0 && (searchParams.has('page') ? searchParams.size > 1 : true);


  return (
    <Card className="sticky top-20 shadow-none border-none lg:border lg:shadow-sm">
      <CardHeader className='hidden lg:flex'>
        <CardTitle className="flex items-center justify-between">
          Filtros
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-1 lg:p-6">
        <form onSubmit={handleSearch} className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            name="query"
            placeholder="Buscar por nombre o SKU..." 
            className="pl-10 pr-20" 
            defaultValue={searchParams.get('query') || ''}
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">Buscar</Button>
        </form>

        <div className="grid gap-2">
          <label className="font-medium">Marca del Repuesto</label>
          <Select onValueChange={handleSelectChange('brand')} defaultValue={searchParams.get('brand') || 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands?.map((brand) => (
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
          <label className="font-medium">Marca del Vehículo</label>
          <Select onValueChange={handleBrandChange} defaultValue={searchParams.get('vehicleBrand') || 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {vehicleBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="font-medium">Modelo del Vehículo</label>
          <Select 
            onValueChange={handleModelChange} 
            defaultValue={searchParams.get('vehicleModel') || 'all'}
            disabled={!selectedVehicleBrand}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los modelos</SelectItem>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
      </CardContent>
    </Card>
  );
}
