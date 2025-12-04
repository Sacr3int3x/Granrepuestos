
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
import type { Part, Brand, VehicleBrand, VehicleModel, Category } from "@/lib/types";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ImageUpload from "@/components/image-upload";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  brandId: z.string({ required_error: "Por favor selecciona una marca." }),
  categoryId: z.string({ required_error: "Por favor selecciona una categoría." }),
  imageUrls: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  vehicleBrandIds: z.array(z.string()).optional(),
  vehicleModelIds: z.array(z.string()).optional(),
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [availableModels, setAvailableModels] = useState<VehicleModel[]>([]);

   useEffect(() => {
    setCategories(getCategories());
    setVehicleBrands(getVehicleBrands());
  }, []);

  const defaultValues: Partial<ProductFormValues> = part
    ? {
        ...part,
        description: part.description || "",
        imageUrls: Array.isArray(part.imageUrls) ? part.imageUrls.filter(u => typeof u === 'string') : [],
        vehicleCompatibility: (part.vehicleCompatibility && part.vehicleCompatibility.length > 0) ? part.vehicleCompatibility[0].yearRange : '',
        vehicleBrandIds: part.vehicleBrandIds || [],
        vehicleModelIds: part.vehicleModelIds || [],
      }
    : {
        name: "",
        sku: "",
        description: "",
        price: 0,
        stock: 0,
        brandId: "",
        categoryId: "",
        imageUrls: [],
        isFeatured: false,
        vehicleBrandIds: [],
        vehicleModelIds: [],
        vehicleCompatibility: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedVehicleBrands = form.watch("vehicleBrandIds");

  useEffect(() => {
    if (selectedVehicleBrands && selectedVehicleBrands.length > 0) {
      const models = getVehicleModels(selectedVehicleBrands);
      setAvailableModels(models);
      
      const currentModels = form.getValues("vehicleModelIds") || [];
      const validModels = currentModels.filter(modelId => models.some(m => m.id === modelId));
      form.setValue("vehicleModelIds", validModels);

    } else {
      setAvailableModels([]);
      form.setValue("vehicleModelIds", []);
    }
  }, [selectedVehicleBrands, form]);

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes del Repuesto</FormLabel>
              <FormControl>
                <ImageUpload 
                  value={field.value}
                  onChange={(urls) => field.onChange(urls)}
                  onRemove={(url) => field.onChange(field.value.filter(current => current !== url))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <SelectContent>{brands?.sort((a, b) => a.name.localeCompare(b.name)).map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
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
              name="vehicleBrandIds"
              render={() => (
                <FormItem>
                  <FormLabel>Marcas del Vehículo</FormLabel>
                    <Card className="p-2">
                      <ScrollArea className="h-40">
                        {vehicleBrands.map((brand) => (
                           <FormField
                            key={brand.id}
                            control={form.control}
                            name="vehicleBrandIds"
                            render={({ field }) => (
                                <FormItem key={brand.id} className="flex flex-row items-start space-x-3 space-y-0 p-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(brand.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), brand.id])
                                          : field.onChange(field.value?.filter((value) => value !== brand.id));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{brand.name}</FormLabel>
                                </FormItem>
                            )}
                          />
                        ))}
                      </ScrollArea>
                    </Card>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleModelIds"
              render={() => (
                <FormItem>
                  <FormLabel>Modelos del Vehículo</FormLabel>
                    <Card className="p-2">
                        <ScrollArea className="h-40">
                        {availableModels.length > 0 ? (
                            availableModels.map((model) => (
                            <FormField
                                key={model.id}
                                control={form.control}
                                name="vehicleModelIds"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={model.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 p-2"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(model.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), model.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== model.id
                                                )
                                                );
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {model.name}
                                    </FormLabel>
                                    </FormItem>
                                );
                                }}
                            />
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                {selectedVehicleBrands && selectedVehicleBrands.length > 0 ? "No hay modelos para esta marca." : "Selecciona una marca primero."}
                            </div>
                        )}
                        </ScrollArea>
                    </Card>
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
