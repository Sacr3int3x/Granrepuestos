"use client";

import { CartProvider } from "@/context/cart-context";
import CartSheet from "./cart-sheet";

export default function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
        {children}
        <CartSheet />
    </CartProvider>
  );
}
