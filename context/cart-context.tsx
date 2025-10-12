"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate that parsedCart is an array and each item has required properties
        if (Array.isArray(parsedCart)) {
          const validItems = parsedCart.filter((item: any) =>
            item &&
            typeof item === 'object' &&
            item.id &&
            item.name &&
            typeof item.price === 'number' &&
            typeof item.quantity === 'number' &&
            item.quantity > 0
          );
          setItems(validItems as CartItem[]);
          if (validItems.length !== parsedCart.length) {
            console.warn("Some invalid cart items were removed during loading");
            localStorage.setItem("cart", JSON.stringify(validItems));
          }
        }
      } catch (error) {
        console.error("Failed to parse cart data from localStorage:", error);
        localStorage.removeItem("cart"); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    // Validate product has required properties
    if (!product.id || !product.name || typeof product.price !== 'number') {
      console.error("Invalid product data:", product);
      return;
    }

    // Allow multiple cart lines for same product if selectedFlavour differs
    setItems((currentItems) => {
      const prodAny: any = product;
      const flavour = prodAny.selectedFlavour || null;

      // try to find existing line with same product id and flavour
      const existingItem = currentItems.find((item) => item.id === product.id && (item as any).selectedFlavour === flavour);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id && (item as any).selectedFlavour === flavour
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // create a unique cartItemId so the UI can distinguish lines
      const cartItemId = `${product.id}-${flavour || 'default'}-${Date.now()}`;
      const newItem: CartItem = { ...product, quantity: 1, cartItemId, selectedFlavour: flavour || undefined } as CartItem;
      return [...currentItems, newItem];
    });
  };

  // remove by cartItemId if provided, else fallback to product id
  const removeFromCart = (productIdOrCartItemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.cartItemId !== productIdOrCartItemId && item.id !== productIdOrCartItemId)
    );
  };

  // update quantity by cartItemId if found, else by product id (first match)
  const updateQuantity = (productIdOrCartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productIdOrCartItemId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartItemId === productIdOrCartItemId || item.id === productIdOrCartItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
