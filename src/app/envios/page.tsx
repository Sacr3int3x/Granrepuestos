import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import ShippingHeroImage from "./fondoenvios.jpeg";

export default function ShippingPage() {
  return (
    <div className="bg-background">
      <section className="relative w-full h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-card">
         <div className="absolute inset-0 z-0">
            <Image
                src={ShippingHeroImage}
                alt="Paquetes listos para ser enviados"
                fill
                className="object-cover"
                placeholder="blur"
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-headline">
            Envíos y Entregas
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
            Recibe tus repuestos de forma rápida y segura.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-8">
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Truck className="h-10 w-10 text-primary" />
                <CardTitle>Envíos Nacionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Realizamos envíos a todo el territorio nacional a través de las principales empresas de encomiendas como **MRW, Zoom y Tealca**.</p>
                <p>Todos los envíos se realizan bajo la modalidad de **Cobro a Destino**. El costo será calculado e informado por la empresa de transporte al momento de procesar tu despacho.</p>
                <p>Una vez enviado tu pedido, te facilitaremos el número de guía para que puedas hacer seguimiento en tiempo real desde el portal de la empresa de transporte.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Clock className="h-10 w-10 text-primary" />
                <CardTitle>Tiempos de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Los pedidos son procesados y despachados en un lapso de 24 a 48 horas hábiles luego de confirmar tu pago.</p>
                <p>El tiempo de entrega estimado por parte de la empresa de transporte es de **2 a 5 días hábiles**, dependiendo de la ciudad de destino.</p>
                <p>No nos hacemos responsables por retrasos o inconvenientes causados directamente por la empresa de encomiendas, aunque te apoyaremos en el proceso de reclamo si es necesario.</p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Package className="h-10 w-10 text-primary" />
                <CardTitle>Empaque y Seguro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Nos aseguramos de que cada repuesto sea empacado cuidadosamente para proteger su integridad durante el traslado.</p>
                <p>Recomendamos a nuestros clientes solicitar que su envío viaje asegurado para proteger la inversión ante cualquier eventualidad o pérdida por parte del transportista.</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
