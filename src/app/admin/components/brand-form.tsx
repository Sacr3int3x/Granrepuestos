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
import type { Brand } from "@/lib/types";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  logoUrl: z.string().url("Debe ser una URL válida."),
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  onSubmit: (data: BrandFormValues) => void;
  brand?: Brand;
}

export function BrandForm({ onSubmit, brand }: BrandFormProps) {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: brand || {
      name: "",
      logoUrl: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">{brand ? "Guardar Cambios" : "Crear Marca"}</Button>
      </form>
    </Form>
  );
}
