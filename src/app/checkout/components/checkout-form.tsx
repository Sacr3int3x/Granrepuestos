"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formSchema = z.object({
  customerEmail: z.string().email({ message: "Por favor, introduce un correo válido." }),
  referenceNumber: z.string().min(4, { message: "La referencia debe tener al menos 4 dígitos." }),
  bank: z.string().min(2, { message: "Por favor, indica el banco." }),
  phone: z.string().min(10, { message: "El número de teléfono no es válido." }),
  idNumber: z.string().min(6, { message: "La cédula o RIF no es válido." }),
  amount: z.coerce.number().positive({ message: "El monto debe ser mayor a cero." }),
  paymentDate: z.date({ required_error: "Debes seleccionar una fecha." }),
});

export type PaymentFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  totalAmount: number;
  isLoading: boolean;
}

export function CheckoutForm({ onSubmit, totalAmount, isLoading }: CheckoutFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerEmail: "",
      referenceNumber: "",
      bank: "",
      phone: "",
      idNumber: "",
      amount: totalAmount,
      paymentDate: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                <Input type="email" placeholder="tu@correo.com" {...field} />
                </FormControl>
                <FormDescription>Recibirás las actualizaciones de tu orden en este correo.</FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nro. de Referencia</FormLabel>
                  <FormControl>
                    <Input placeholder="000123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Pago</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banco Emisor</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mercantil" {...field} />
              </FormControl>
               <FormDescription>El banco desde el cual realizaste el pago.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono Pagador</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="04121234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cédula / RIF</FormLabel>
                  <FormControl>
                    <Input placeholder="V-12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Pagado (Euros)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormDescription>Monto exacto en Euros (€) que transferiste.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Reportar Pago y Finalizar Orden"}
        </Button>
      </form>
    </Form>
  );
}
