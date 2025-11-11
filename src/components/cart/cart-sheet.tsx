"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartItemCard from "./cart-item-card";
import { ShoppingCart, PackageX } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function CartSheet() {
  const { cartItems, cartTotal, isCartOpen, setIsCartOpen, cartItemCount } = useCart();

  return (
    <>
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Carrito de Compras ({cartItemCount})</SheetTitle>
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
            <SheetFooter className="p-6 sm:justify-between">
              <div className="text-lg font-semibold">
                <span>Subtotal: </span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/checkout">Proceder al Pago</Link>
              </Button>
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
            <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
            <p className="text-muted-foreground">
              ¡Añade algunos repuestos para empezar!
            </p>
            <Button asChild variant="outline" onClick={() => setIsCartOpen(false)}>
              <Link href="/parts">Ver Repuestos</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
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
