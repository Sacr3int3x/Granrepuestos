import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import CartProviderWrapper from "@/components/cart/cart-provider-wrapper";
import CartButton from "@/components/cart/cart-button";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GranRepuestos: Repuestos para Carros en Venezuela - Catálogo Online",
  description: "Encuentra repuestos originales y de calidad para tu carro en Venezuela. Catálogo online con envíos a nivel nacional desde Guatire. ¡Cotiza por WhatsApp!",
  keywords: ["repuestos para carros", "repuestos en venezuela", "granrepuestos", "tienda de repuestos", "guatire", "caracas", "repuestos originales"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": "GranRepuestos",
    "image": "https://i.postimg.cc/8CLbC2vM/Logo-GR.png",
    "url": "https://www.granrepuestos.com",
    "telephone": "+584120177075",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Principal de Castillejo",
      "addressLocality": "Guatire",
      "addressRegion": "Miranda",
      "postalCode": "1221",
      "addressCountry": "VE"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Guatire"
      },
      {
        "@type": "City",
        "name": "Caracas"
      },
       {
        "@type": "Country",
        "name": "Venezuela"
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.instagram.com/granrepuesto.ve"
    ]
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased", inter.variable)}>
        <FirebaseClientProvider>
            <CartProviderWrapper>
                <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1 animate-fade-in">{children}</main>
                    <Footer />
                </div>
                 <CartButton />
                <div className="fixed bottom-28 right-4 z-50">
                   <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700"
                    asChild
                   >
                     <a href="https://wa.me/584120177075" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
                       <MessageSquare className="h-6 w-6 text-white" />
                     </a>
                   </Button>
                </div>
            </CartProviderWrapper>
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
