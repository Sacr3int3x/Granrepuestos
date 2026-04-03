
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
import { ShoppingCart, PackageX, Mail, MessageSquare, DollarSign } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import Image from "next/image";

export default function CartSheet() {
  const { cartItems, cartTotal, isCartOpen, setIsCartOpen, cartItemCount } = useCart();

  const binanceDiscount = 0.15;
  const discountedTotal = cartTotal * (1 - binanceDiscount);

  const generateQuoteMessage = (format: 'whatsapp' | 'email' | 'binance') => {
    let message = `¡Hola GranRepuestos! Quisiera solicitar una cotización para los siguientes repuestos:\n\n`;

    if (format === 'binance') {
      message = `¡Hola GranRepuestos! Quiero pagar mi orden con *Binance Pay* y aplicar el *descuento del 15%*.\n\n*Detalles del Pedido:*\n`;
    }
    
    cartItems.forEach(item => {
      const subtotal = (item.part.price * item.quantity).toFixed(2);
      message += `• ${item.part.name}\n  SKU: ${item.part.sku} | Cantidad: ${item.quantity} | $${item.part.price.toFixed(2)} c/u | Subtotal: $${subtotal}\n\n`;
    });
    
    message += `*Subtotal: $${cartTotal.toFixed(2)}*\n`;
    
    if (format === 'binance') {
        message += `*Descuento Binance (15%): -$${(cartTotal * binanceDiscount).toFixed(2)}*\n`;
        message += `*TOTAL A PAGAR: $${discountedTotal.toFixed(2)}*\n\n`;
        message += `Por favor, envíame el enlace de pago de Binance. ¡Gracias!`;
    } else {
        message += `\nQuedo a la espera de su respuesta. ¡Gracias! 😊`;
    }


    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/584120177075?text=${generateQuoteMessage('whatsapp')}`;
  const emailUrl = `mailto:soporte@granrepuestos.com?subject=Solicitud%20de%20Cotización%20de%20Repuestos&body=${generateQuoteMessage('email')}`;
  const binanceUrl = `https://wa.me/584120177075?text=${generateQuoteMessage('binance')}`;


  const handleSheetClose = () => setIsCartOpen(false);

  return (
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
            <SheetFooter className="p-6 flex flex-col gap-4">
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-medium text-foreground">${cartTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-amber-600">
                    <span>Descuento Binance (15%):</span>
                    <span className="font-medium">-${(cartTotal * binanceDiscount).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                    <span>Total con Binance:</span>
                    <span>${discountedTotal.toFixed(2)}</span>
                </div>
               </div>
               <div className="flex flex-col gap-3 pt-4">
                <p className="text-sm text-center text-muted-foreground">Selecciona tu método de pago o cotización:</p>

                <Button asChild size="lg" onClick={handleSheetClose} className="bg-[#FCD535] hover:bg-[#FCD535]/90 text-slate-800 font-bold shadow-md h-12">
                    <a href={binanceUrl} target="_blank" rel="noopener noreferrer">
                       <DollarSign className="mr-2 h-5 w-5"/>
                       Pagar con Binance (15% OFF)
                    </a>
                </Button>

                <Button asChild size="lg" onClick={handleSheetClose} className="bg-green-600 hover:bg-green-700 h-12">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Solicitar por WhatsApp
                    </a>
                </Button>
                <Button asChild size="lg" variant="outline" onClick={handleSheetClose} className="h-12">
                    <a href={emailUrl} target="_blank" rel="noopener noreferrer">
                      <Mail className="mr-2 h-5 w-5" />
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
  );
}
