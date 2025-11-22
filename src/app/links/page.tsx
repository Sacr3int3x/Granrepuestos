"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Globe, MessageSquare } from "lucide-react";

export default function LinksPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        <Icons.logo className="h-24 w-48 text-primary" />
        <div className="space-y-1">
            <h1 className="text-2xl font-bold font-headline">GranRepuestos</h1>
            <p className="text-muted-foreground">Tu aliado de confianza en repuestos.</p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-xs space-y-4">
        <Button asChild size="lg" className="w-full h-14 text-base">
          <Link href="/">
            <Globe className="mr-3 h-5 w-5" />
            Ver Catálogo y Tienda
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full h-14 text-base bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:text-green-800">
          <a href="https://wa.me/584120177075" target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-3 h-5 w-5" />
            Consultas por WhatsApp
          </a>
        </Button>
      </div>

       <div className="absolute bottom-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} GranRepuestos.</p>
        </div>
    </div>
  );
}
