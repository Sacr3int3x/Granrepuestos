
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Package, Truck, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import AboutUsImage from "./QS.jpeg";

export const metadata: Metadata = {
  title: "Quiénes Somos | GranRepuestos — Tu Distribuidor de Repuestos en Guatire",
  description: "Conoce a GranRepuestos: distribuidores de repuestos originales en Guatire, Miranda. Más de 5 años de experiencia y reputación impecable en MercadoLibre Venezuela.",
};

const statItems = [
  { icon: Star, value: "+5 años", label: "de experiencia" },
  { icon: Package, value: "+500", label: "productos en catálogo" },
  { icon: Truck, value: "Todo el país", label: "envíos a Venezuela" },
  { icon: ShieldCheck, value: "100%", label: "repuestos originales" },
];

const MissionItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
    <span className="text-muted-foreground">{children}</span>
  </li>
);

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Hero */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden bg-card">
        <div className="absolute inset-0 z-0">
          <Image
            src={AboutUsImage}
            alt="Equipo de GranRepuestos en Guatire"
            fill
            className="object-cover"
            placeholder="blur"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-headline">
            Sobre GranRepuestos
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
            Tu aliado de confianza en repuestos automotrices en Venezuela.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statItems.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <stat.icon className="h-8 w-8 opacity-80" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia + Misión */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-4 text-primary">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-4">
                GranRepuestos nació hace más de 5 años en Guatire, Miranda, de la pasión por los automóviles y el compromiso de ofrecer repuestos originales a precios justos. Lo que empezó como un emprendimiento familiar se convirtió en un referente del sector automotriz en la región.
              </p>
              <p className="text-muted-foreground mb-4">
                Nuestra tienda física está ubicada en la <strong>Av. Principal de Castillejo, Guatire</strong>, donde atendemos personalmente a nuestros clientes. Además, contamos con un catálogo online para facilitar la búsqueda y cotización de repuestos desde cualquier parte del país.
              </p>
              <p className="text-muted-foreground">
                Somos vendedores verificados en <strong>MercadoLibre Venezuela</strong> con reputación impecable, lo que respalda nuestra trayectoria y seriedad en cada venta.
              </p>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Nuestra Misión</h3>
                  <ul className="space-y-4">
                    <MissionItem>
                      Ofrecer repuestos 100% originales y certificados de las marcas líderes del mercado. <strong>Cero imitaciones, Cero chino.</strong>
                    </MissionItem>
                    <MissionItem>
                      Brindar asesoría experta y personalizada por WhatsApp para que encuentres exactamente lo que tu vehículo necesita.
                    </MissionItem>
                    <MissionItem>
                      Garantizar una experiencia de compra fácil y segura, con envíos a toda Venezuela a través de MRW, Zoom y Tealca.
                    </MissionItem>
                    <MissionItem>
                      Mantener precios competitivos y ofrever un <strong>15% de descuento</strong> pagando con Binance Pay.
                    </MissionItem>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

