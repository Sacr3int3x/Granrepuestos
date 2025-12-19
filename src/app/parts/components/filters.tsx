

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Category, Brand, VehicleBrand } from '@/lib/types';
import { Search, X } from 'lucide-react';
import { getVehicleModels } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


interface FiltersProps {
  categories: Category[];
  vehicleBrands: VehicleBrand[];
  isMobile?: boolean;
  onApply?: () => void;
}

export default function Filters({ categories, vehicleBrands, isMobile = false, onApply }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const firestore = useFirestore();
  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  const { data: brands } = useCollection<Brand>(brandsQuery);

  const [localState, setLocalState] = useState({
      query: searchParams.get('query') || '',
      brand: searchParams.get('brand') || 'all',
      category: searchParams.get('category') || 'all',
      vehicleBrand: searchParams.get('vehicleBrand') || 'all',
      vehicleModel: searchParams.get('vehicleModel') || 'all',
  });
  
  // Sync state with URL params
    useEffect(() => {
        setLocalState({
            query: searchParams.get('query') || '',
            brand: searchParams.get('brand') || 'all',
            category: searchParams.get('category') || 'all',
            vehicleBrand: searchParams.get('vehicleBrand') || 'all',
            vehicleModel: searchParams.get('vehicleModel') || 'all',
        });
    }, [searchParams]);

  const availableModels = useMemo(() => {
    if (!localState.vehicleBrand || localState.vehicleBrand === 'all') return [];
    return getVehicleModels(localState.vehicleBrand);
  }, [localState.vehicleBrand]);


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
      if (!params.has('page')) {
        params.set('page', '1');
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleStateChange = (key: string) => (value: string) => {
    const newState: any = { ...localState, [key]: value };
    if (key === 'vehicleBrand') {
        newState.vehicleModel = 'all'; // Reset model when brand changes
    }
    
    if (isMobile) {
      setLocalState(newState);
    } else {
      router.push(`${pathname}?${createQueryString(newState)}`);
    }
  };

  const handleApplyFilters = () => {
    router.push(`${pathname}?${createQueryString(localState)}`);
    if(onApply) onApply();
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    
    if (isMobile) {
        setLocalState(prev => ({...prev, query}));
    } else {
        router.push(pathname + '?' + createQueryString({ ...localState, query: query || undefined }));
    }
  };

  const clearFilters = () => {
      if (isMobile) {
        const clearedState = {
            query: '',
            brand: 'all',
            category: 'all',
            vehicleBrand: 'all',
            vehicleModel: 'all',
        };
        setLocalState(clearedState);
        router.push(pathname);
        if(onApply) onApply();
      } else {
        router.push(pathname);
      }
  };
  
  const hasActiveFilters = 
    (searchParams.get('brand') && searchParams.get('brand') !== 'all') ||
    (searchParams.get('category') && searchParams.get('category') !== 'all') ||
    (searchParams.get('vehicleBrand') && searchParams.get('vehicleBrand') !== 'all') ||
    (searchParams.get('vehicleModel') && searchParams.get('vehicleModel') !== 'all');

  if (isMobile) {
     return (
        <div className="space-y-4 p-1">
             <div className="space-y-4">
                <Select onValueChange={handleStateChange('brand')} value={localState.brand}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Marca del Repuesto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {brands?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={handleStateChange('category')} value={localState.category}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={handleStateChange('vehicleBrand')} value={localState.vehicleBrand}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Marca del Vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {vehicleBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select 
                    onValueChange={handleStateChange('vehicleModel')} 
                    value={localState.vehicleModel}
                    disabled={!localState.vehicleBrand || localState.vehicleBrand === 'all'}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Modelo del Vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los modelos</SelectItem>
                        {availableModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="sticky bottom-0 bg-background py-4 border-t border-border">
                <Button onClick={handleApplyFilters} className="w-full">Aplicar Filtros</Button>
                {hasActiveFilters && (
                    <div className="flex items-center justify-center pt-2">
                        <Button variant="ghost" onClick={clearFilters}>
                        <X className="w-4 h-4 mr-2" />
                        Limpiar filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                name="query"
                placeholder="Buscar por nombre, SKU, descripción..." 
                className="pl-10 h-11 text-base" 
                defaultValue={searchParams.get('query') || ''}
            />
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Select onValueChange={handleStateChange('brand')} value={localState.brand}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Marca del Repuesto" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands?.sort((a,b) => a.name.localeCompare(b.name)).map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={handleStateChange('category')} value={localState.category}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={handleStateChange('vehicleBrand')} value={localState.vehicleBrand}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Marca del Vehículo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {vehicleBrands.sort((a,b) => a.name.localeCompare(b.name)).map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select 
                onValueChange={handleStateChange('vehicleModel')} 
                value={localState.vehicleModel}
                disabled={!localState.vehicleBrand || localState.vehicleBrand === 'all'}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Modelo del Vehículo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los modelos</SelectItem>
                    {availableModels.sort((a,b) => a.name.localeCompare(b.name)).map((model) => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        
        {hasActiveFilters && (
             <div className="flex items-center justify-start pt-2">
                 <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
             </div>
        )}
    </div>
  );
}
