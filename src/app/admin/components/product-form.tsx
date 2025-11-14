
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories, getVehicleBrands, getVehicleModels } from "@/lib/data";
import type { Part, Brand, VehicleBrand, VehicleModel } from "@/lib/types";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  brandId: z.string({ required_error: "Por favor selecciona una marca." }),
  categoryId: z.string({ required_error: "Por favor selecciona una categoría." }),
  imageUrls: z.string().min(1, "Se necesita al menos una URL de imagen.").transform((val) => {
    const htmlRegex = /<img[^>]+src="([^">]+)"/g;
    const matches = [...val.matchAll(htmlRegex)];
    if (matches.length > 0) {
        return matches.map(match => match[1].trim()).filter(Boolean);
    }
    const cleanedString = val.replace(/<br\s*\/?>/gi, ',');
    return cleanedString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  }),
  isFeatured: z.boolean().default(false),
  vehicleBrandId: z.string().optional(),
  vehicleModelId: z.string().optional(),
  vehicleCompatibility: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  part?: Part;
}

export function ProductForm({ onSubmit, part }: ProductFormProps) {
  const firestore = useFirestore();
  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  const { data: brands } = useCollection<Brand>(brandsQuery);
  const categories = getCategories();
  const vehicleBrands = getVehicleBrands();
  const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);

  const defaultValues: Partial<ProductFormValues> = part
    ? {
        ...part,
        description: part.description || "",
        imageUrls: Array.isArray(part.imageUrls) ? part.imageUrls.join(',\n') : (typeof part.imageUrls === 'string' ? part.imageUrls : ''),
        vehicleCompatibility: part.vehicleCompatibility && part.vehicleCompatibility.length > 0 ? part.vehicleCompatibility[0].yearRange : ''
      }
    : {
        name: "",
        sku: "",
        description: "",
        price: 0,
        stock: 0,
        brandId: "",
        categoryId: "",
        imageUrls: "",
        isFeatured: false,
        vehicleBrandId: "",
        vehicleModelId: "",
        vehicleCompatibility: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedVehicleBrand = form.watch("vehicleBrandId");

  useEffect(() => {
    if (selectedVehicleBrand) {
      setAvailableModels(getVehicleModels(selectedVehicleBrand));
      // Reset model if brand changes and current model is not compatible
      if(!getVehicleModels(selectedVehicleBrand).find(m => m.id === form.getValues("vehicleModelId"))) {
        form.setValue("vehicleModelId", "");
      }
    } else {
      setAvailableModels([]);
      form.setValue("vehicleModelId", "");
    }
  }, [selectedVehicleBrand, form]);

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem><FormLabel>SKU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Precio</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="brandId" render={({ field }) => (
            <FormItem>
            <FormLabel>Marca del Repuesto</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecciona una marca" /></SelectTrigger></FormControl>
                <SelectContent>{brands?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
            </FormItem>
        )}/>
        <FormField control={form.control} name="categoryId" render={({ field }) => (
            <FormItem>
            <FormLabel>Categoría</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger></FormControl>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
            </FormItem>
        )}/>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vehicleBrandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca del Vehículo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una marca de vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleModelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo del Vehículo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedVehicleBrand || availableModels.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un modelo de vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
          control={form.control}
          name="vehicleCompatibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año(s) de compatibilidad</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 2015-2020" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="imageUrls" render={({ field }) => (
            <FormItem>
                <FormLabel>URLs de Imágenes</FormLabel>
                <FormControl><Textarea rows={5} placeholder="Pegar URLs separadas por comas, saltos de línea o bloques de HTML." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>
        <FormField control={form.control} name="isFeatured" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>¿Producto destacado?</FormLabel>
                </div>
            </FormItem>
        )}/>
        <Button type="submit">{part ? "Guardar Cambios" : "Crear Repuesto"}</Button>
      </form>
    </Form>
  );
}
