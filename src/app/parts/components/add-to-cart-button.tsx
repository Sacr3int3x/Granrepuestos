"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Part } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  part: Part;
  size?: "default" | "sm" | "lg" | "icon" | null;
  className?: string;
  showText?: boolean;
}

export default function AddToCartButton({ part, size = "sm", className, showText = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se disparen otros eventos de clic (como navegar a la página de detalles)
    e.preventDefault();
    
    addToCart(part);
    toast({
      title: "¡Añadido al carrito!",
      description: `${part.name} ha sido añadido a tu carrito.`,
    });
  };

  if (part.stock === 0) {
    return (
        <Button size={size || undefined} className={className} disabled>
            Agotado
        </Button>
    )
  }

  return (
    <Button
      size={size || undefined}
      className={className}
      onClick={handleAddToCart}
      aria-label="Añadir al carrito"
    >
      <ShoppingCart className={showText ? "mr-2 h-4 w-4" : "h-4 w-4"} />
      {showText && <span>Añadir al Carrito</span>}
    </Button>
  );
}
