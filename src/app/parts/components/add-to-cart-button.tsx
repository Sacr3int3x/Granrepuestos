
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Part } from "@/lib/types";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  part: Part;
  size?: "default" | "sm" | "lg" | "icon" | null;
  className?: string;
  showText?: boolean;
}

export default function AddToCartButton({ part, size = "sm", className, showText = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    
    addToCart(part);
    toast({
      title: "¡Añadido al carrito!",
      description: `${part.name} ha sido añadido a tu carrito.`,
    });
    
    setIsAdded(true);
  };

  useEffect(() => {
    if (!isAdded) return;

    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, [isAdded]);

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
      className={cn(
        className,
        isAdded && "bg-green-600 hover:bg-green-700 text-white"
      )}
      onClick={handleAddToCart}
      disabled={isAdded}
      aria-label="Añadir al carrito"
    >
      {isAdded ? (
        <>
          <Check className={showText ? "mr-2 h-4 w-4" : "h-5 w-5"} />
          {showText && <span>Añadido</span>}
        </>
      ) : (
        <>
          <ShoppingCart className={showText ? "mr-2 h-4 w-4" : "h-5 w-5"} />
          {showText && <span>Añadir al Carrito</span>}
        </>
      )}
    </Button>
  );
}
