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
import type { Brand } from "@/lib/types";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  logoUrl: z.string().url("Debe ser una URL válida."),
  heroImageUrl: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  countryOfOrigin: z.string().optional(),
  description: z.string().optional(),
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  onSubmit: (data: BrandFormValues) => void;
  brand?: Brand;
}

export function BrandForm({ onSubmit, brand }: BrandFormProps) {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: brand?.name || "",
      logoUrl: brand?.logoUrl || "",
      heroImageUrl: brand?.heroImageUrl || "",
      countryOfOrigin: brand?.countryOfOrigin || "",
      description: brand?.description || "",
      id: brand?.id || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Marca</FormLabel>
              <FormControl>
                <Input placeholder="Bosch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Logo</FormLabel>
              <FormControl>
                <Input placeholder="https://picsum.photos/seed/newbrand/150/80" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heroImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Imagen de Cabecera</FormLabel>
              <FormControl>
                <Input placeholder="https://picsum.photos/seed/newbrand-hero/1200/400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País de Origen</FormLabel>
              <FormControl>
                <Input placeholder="Alemania" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción de la Marca</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe la historia y valores de la marca..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{brand ? "Guardar Cambios" : "Crear Marca"}</Button>
      </form>
    </Form>
  );
}
