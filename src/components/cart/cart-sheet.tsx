
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartItemCard from "./cart-item-card";
import { ShoppingCart, PackageX, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function CartSheet() {
  const { cartItems, cartTotal, isCartOpen, setIsCartOpen, cartItemCount } = useCart();

  const generateQuoteMessage = (format: 'whatsapp' | 'email') => {
    let message = `¡Hola! Quisiera solicitar una cotización para los siguientes repuestos:\n\n`;
    
    cartItems.forEach(item => {
      message += `- ${item.part.name} (Cantidad: ${item.quantity}) - €${(item.part.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal: €${cartTotal.toFixed(2)}*\n\n`;
    message += `Quedo a la espera de su respuesta. ¡Gracias!`;

    if (format === 'whatsapp') {
      return encodeURIComponent(message);
    }
    
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/584120177075?text=${generateQuoteMessage('whatsapp')}`;
  const emailUrl = `mailto:soporte@granrepuestos.com?subject=Solicitud%20de%20Cotización%20de%20Repuestos&body=${generateQuoteMessage('email')}`;

  const handleSheetClose = () => setIsCartOpen(false);

  return (
    <>
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-full flex-col pr-0 sm:max-w-lg"
      >
        <SheetHeader className="px-6">
          <SheetTitle>Carrito de Compras ({cartItemCount})</SheetTitle>
           {cartItems.length === 0 && (
             <SheetDescription>
                Tu carrito está vacío. ¡Añade algunos repuestos para empezar!
             </SheetDescription>
           )}
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-4 p-6 pr-4">
                    {cartItems.map((item) => (
                        <CartItemCard key={item.part.id} item={item} />
                    ))}
                </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 flex flex-col gap-4 text-center sm:text-left">
              <div className="text-lg font-semibold w-full flex justify-between items-center">
                <span>Subtotal:</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
               <div className="flex flex-col gap-3">
                <p className="text-sm text-center text-muted-foreground">Solicita tu cotización por el medio de tu preferencia:</p>
                <Button asChild size="lg" onClick={handleSheetClose}>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Solicitar por WhatsApp
                    </a>
                </Button>
                <Button asChild size="lg" variant="outline" onClick={handleSheetClose}>
                    <a href={emailUrl} target="_blank" rel="noopener noreferrer">
                      <Mail className="mr-2 h-4 w-4" />
                      Solicitar por Correo
                    </a>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div
              className="rounded-full border-4 border-dashed border-muted-foreground/30 bg-muted p-6"
              aria-hidden="true"
            >
              <PackageX className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <Button asChild variant="outline" onClick={() => setIsCartOpen(false)}>
              <Link href="/parts">Ver Repuestos</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
      <div className="fixed bottom-8 right-4 z-50">
        <Button
          size="icon"
          className="relative h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsCartOpen(true)}
          aria-label="Abrir carrito"
        >
          <ShoppingCart className="h-6 w-6" />
           {cartItemCount > 0 && (
              <Badge 
                variant="destructive"
                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full"
              >
                {cartItemCount}
              </Badge>
            )}
        </Button>
      </div>
    </>
  );
}
