import { Icons } from "@/components/icons";
import Link from "next/link";
import { MessageSquare, Instagram, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          {/* Logo + descripción */}
          <div className="flex flex-col gap-3">
            <Icons.logo className="h-10 w-16 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Distribuidores de repuestos originales en Guatire, Miranda. Enviamos a toda Venezuela.
            </p>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">Navegación</h3>
            <Link href="/parts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Catálogo de Repuestos</Link>
            <Link href="/brands" className="text-sm text-muted-foreground hover:text-primary transition-colors">Marcas</Link>
            <Link href="/envios" className="text-sm text-muted-foreground hover:text-primary transition-colors">Envíos y Entregas</Link>
            <Link href="/quienes-somos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Quiénes Somos</Link>
            <Link href="/politicas" className="text-sm text-muted-foreground hover:text-primary transition-colors">Políticas</Link>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">Contacto</h3>
            <a href="https://wa.me/584120177075" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              +58 412-0177075
            </a>
            <a href="https://wa.me/584123269600" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              +58 412-3269600
            </a>
            <a href="mailto:soporte@granrepuestos.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4 flex-shrink-0" />
              soporte@granrepuestos.com
            </a>
            <a href="https://www.instagram.com/granrepuesto.ve" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-4 w-4 flex-shrink-0" />
              @granrepuesto.ve
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              Guatire, Miranda, Venezuela
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GranRepuestos. Todos los derechos reservados.</p>
          <p>Repuestos originales · Cero imitaciones · Cero chino</p>
        </div>
      </div>
    </footer>
  );
}

