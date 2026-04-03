import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas de Compra, Devolución y Garantía | GranRepuestos",
  description: "Conoce nuestras políticas de devolución y garantía. Compramos con seguridad en GranRepuestos, distribuidores de repuestos originales en Guatire, Venezuela.",
  openGraph: {
    title: "Políticas de Compra | GranRepuestos",
    description: "Términos claros para una compra segura. Conoce nuestras políticas de devolución y garantía.",
  },
};


export default function PoliciesPage() {
  return (
    <div className="bg-background">
      <section className="relative w-full h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-card">
         <div className="absolute inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Documentos de políticas sobre un escritorio"
                fill
                className="object-cover"
                data-ai-hint="policy documents"
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-headline">
            Políticas de Compra
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
            Términos claros para una compra segura y satisfactoria.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <RotateCw className="h-10 w-10 text-primary" />
                <CardTitle>Políticas de Devolución</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Para solicitar una devolución, el repuesto debe estar en su empaque original, sin haber sido montado o utilizado.</p>
                <p className="font-semibold text-foreground">Importante: No realizamos devoluciones de dinero. Ofrecemos el cambio del producto por otra pieza de igual o mayor valor (cubriendo el cliente la diferencia).</p>
                <p>Las devoluciones solo se aceptan dentro de los 5 días continuos siguientes a la recepción del producto.</p>
                <p>No se aceptan devoluciones de partes eléctricas.</p>
                <p>El cliente es responsable de cubrir los costos de envío asociados a la devolución. En caso de error de nuestra parte, nosotros cubriremos los gastos.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <CardTitle>Garantías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Todos nuestros productos son de marcas reconocidas y cuentan con garantía por defectos de fábrica.</p>
                <p>La garantía no cubre daños por mala instalación, uso indebido o desgaste normal.</p>
                <p>Para procesar una garantía, es indispensable presentar la nota de entrega o factura de la compra.</p>
                <p>El proceso de garantía está sujeto a la revisión y aprobación por parte del fabricante o distribuidor de la marca.</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
