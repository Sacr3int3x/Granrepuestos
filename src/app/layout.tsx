import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import CartSheet from "@/components/cart/cart-sheet";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import CartProviderWrapper from "@/components/cart/cart-provider-wrapper";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GranRepuestos",
  description: "Tu tienda única para repuestos de calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased", inter.variable)}>
        <FirebaseClientProvider>
            <CartProviderWrapper>
                <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1 animate-fade-in">{children}</main>
                    <Footer />
                </div>
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
                <CartSheet />
            </CartProviderWrapper>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

    