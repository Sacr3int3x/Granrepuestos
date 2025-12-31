"use client";

import { CartProvider } from "@/context/cart-context";
import CartSheet from "./cart-sheet";
import CartButton from "./cart-button";

export default function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartButton />
      <CartSheet />
    </CartProvider>
  );
}
