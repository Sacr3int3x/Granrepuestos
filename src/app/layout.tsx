
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import CartProviderWrapper from "@/components/cart/cart-provider-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GranRepuestos",
  description: "¡Cero imitación, Cero chino! Repuestos originales para tu carro en Venezuela. Envíos a todo el país desde Guatire.",
  keywords: ["repuestos para carros", "repuestos en venezuela", "granrepuestos", "tienda de repuestos", "guatire", "caracas", "repuestos originales", "venta de repuestos guatire", "tienda de repuestos en guatire", "repuestos toyota guatire", "repuestos chevrolet guatire", "repuestos miranda"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'GranRepuestos — Repuestos Originales en Venezuela 🚗',
    description: 'Repuestos originales para tu carro. Envíos a toda Venezuela. ¡Cotiza ya por WhatsApp!',
    url: 'https://www.granrepuestos.com',
    siteName: 'GranRepuestos',
    images: [{ url: 'https://i.postimg.cc/8CLbC2vM/Logo-GR.png', width: 1200, height: 630, alt: 'GranRepuestos Logo' }],
    locale: 'es_VE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["AutoPartsStore", "LocalBusiness"],
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
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.4695,
      "longitude": -66.5432
    },
    "areaServed": [
      { "@type": "City", "name": "Guatire" },
      { "@type": "City", "name": "Caracas" },
      { "@type": "Country", "name": "Venezuela" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    "sameAs": ["https://www.instagram.com/granrepuesto.ve"]
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* El favicon y los meta tags se gestionan a través del objeto metadata */}
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
            <Toaster />
          </CartProviderWrapper>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
