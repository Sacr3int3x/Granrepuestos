"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";

export default function CartButton() {
  const { cartItemCount, setIsCartOpen } = useCart();

  return (
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
  );
}
