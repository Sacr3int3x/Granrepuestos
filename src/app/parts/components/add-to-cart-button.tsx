
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Part } from "@/lib/types";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  part: Part;
  size?: "default" | "sm" | "lg" | "icon" | null;
  className?: string;
  showText?: boolean;
}

export default function AddToCartButton({ part, size = "sm", className, showText = false }: AddToCartButtonProps) {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const itemInCart = cartItems.find((item) => item.part.id === part.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart(part);
    toast({
      title: "¡Añadido al carrito!",
      description: `${part.name} ha sido añadido a tu carrito.`,
    });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (itemInCart) {
      updateQuantity(part.id, itemInCart.quantity + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (itemInCart) {
      if (itemInCart.quantity > 1) {
        updateQuantity(part.id, itemInCart.quantity - 1);
      } else {
        removeFromCart(part.id);
        toast({
          title: "Eliminado del carrito",
          description: `${part.name} ha sido eliminado.`,
          variant: "destructive",
        });
      }
    }
  };
  
  if (part.stock === 0) {
    return (
        <Button size={size || undefined} className={className} disabled>
            Agotado
        </Button>
    )
  }

  if (itemInCart) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrease}
          className="h-9 w-9 shrink-0"
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Quitar uno</span>
        </Button>
        <span className="text-sm font-medium w-6 text-center">{itemInCart.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrease}
          disabled={itemInCart.quantity >= part.stock}
          className="h-9 w-9 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Añadir uno</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      size={size || undefined}
      className={className}
      onClick={handleAddToCart}
      aria-label="Añadir al carrito"
    >
      <ShoppingCart className={showText ? "mr-2 h-4 w-4" : "h-5 w-5"} />
      {showText && <span>Añadir al Carrito</span>}
    </Button>
  );
}

