"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, CartItem } from "@/context/cart-context";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.part.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.part.id);
    toast({
      title: "Eliminado del carrito",
      description: `${item.part.name} ha sido eliminado.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.part.imageUrls[0]}
          alt={item.part.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm line-clamp-2">{item.part.name}</h3>
        <p className="text-sm text-muted-foreground">€{item.part.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="h-7 w-12 p-1 text-center"
            min="1"
            max={item.part.stock}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.part.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
