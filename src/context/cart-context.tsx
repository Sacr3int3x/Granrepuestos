
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Part } from "@/lib/types";

export interface CartItem {
  part: Part;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (part: Part, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://ve.dolarapi.com/v1/euros');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array and we need the first entry for 'oficial'
        const officialRate = data.find((rate: any) => rate.casa === 'oficial');
        if (officialRate && officialRate.promedio) {
          setExchangeRate(officialRate.promedio);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        // Fallback or old value from localStorage will be used
      }
    };

    fetchExchangeRate();

    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (part: Part, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.part.id === part.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, part.stock) }
            : item
        );
      }
      return [...prevItems, { part, quantity: Math.min(quantity, part.stock) }];
    });
  };

  const removeFromCart = (partId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.part.id !== partId));
  };

  const updateQuantity = (partId: string, quantity: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.part.id === partId) {
          const newQuantity = Math.max(1, Math.min(quantity, item.part.stock));
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.part.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        exchangeRate,
        setExchangeRate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
