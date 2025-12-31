"use client";

import { CartProvider } from "@/context/cart-context";
import CartButton from "./cart-button";
import CartSheet from "./cart-sheet";

export default function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
        {children}
        <CartButton />
        <CartSheet />
    </CartProvider>
  );
}
