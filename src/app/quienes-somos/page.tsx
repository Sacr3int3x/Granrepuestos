
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const aboutUsImage = PlaceHolderImages.find(img => img.id === 'about-us-hero');

const MissionItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
    <span className="text-muted-foreground">{children}</span>
  </li>
);

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden bg-card">
        {aboutUsImage && (
             <div className="absolute inset-0 z-0">
                <Image
                    src={aboutUsImage.imageUrl}
                    alt={aboutUsImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={aboutUsImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>
        )}
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-headline">
            Sobre GranRepuestos
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
            Tu aliado de confianza en el mundo de los repuestos automotrices.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-4 text-primary">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-4">
                Fundada en [Año], GranRepuestos nació de la pasión por los automóviles y el deseo de ofrecer una solución honesta y confiable para la adquisición de repuestos. Lo que comenzó como un pequeño emprendimiento familiar ha crecido hasta convertirse en un referente en el mercado, siempre manteniendo nuestros valores fundamentales.
              </p>
              <p className="text-muted-foreground">
                Con años de experiencia en el sector, nuestro equipo de expertos se dedica a seleccionar solo las mejores piezas de las marcas más reconocidas, garantizando calidad y durabilidad para tu vehículo.
              </p>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Nuestra Misión</h3>
                  <ul className="space-y-4">
                    <MissionItem>
                      Ofrecer un catálogo extenso y especializado de repuestos de alta calidad a precios competitivos.
                    </MissionItem>
                    <MissionItem>
                      Brindar una asesoría experta y personalizada para que encuentres exactamente lo que tu vehículo necesita.
                    </MissionItem>
                    <MissionItem>
                      Garantizar una experiencia de compra fácil, rápida y segura, con un servicio al cliente excepcional.
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
