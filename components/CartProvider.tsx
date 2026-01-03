// components/CartProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  coin: string;
  priceWithMargin: number;
  image: string | null;
  custom_slug: string;
  quantity: number;
  clientPhone: string;
};

type CartContextType = {
  items: CartItem[];
  myPhone: number;
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    coin: string;
    priceWithMargin: number;
    custom_slug: string;
    image: string | null; // ✅ Corregido: ahora acepta null
    clientPhone: string;
  }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getWhatsAppLink: () => string;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const myPhone = 63115599;

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("kubashop-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart from localStorage", e);
        setItems([]);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("kubashop-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: {
    id: string;
    name: string;
    price: number;
    coin: string;
    priceWithMargin: number;
    custom_slug: string;
    image: string | null;
    clientPhone: string;
  }) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          image: product.image || null,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getWhatsAppLink = () => {
    if (items.length === 0) return "";

    // Agrupar productos por vendedor (phone)
    const vendors = items.reduce((acc, item) => {
      if (!acc[item.clientPhone]) {
        acc[item.clientPhone] = [];
      }
      acc[item.clientPhone].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // Crear mensaje para cada vendedor
    const messages = Object.entries(vendors).map(([phone, products]) => {
      const productList = products
        .map(
          (p) =>
            `• ${p.name} (x${p.quantity}) - $${(p.price * p.quantity).toFixed(
              2
            )}`
        )
        .join("\n");

      const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

      return {
        myPhone,
        message: `¡Hola! Quisiera comprar:\n\n${productList}\n\nTotal: $${total.toFixed(
          2
        )}`,
      };
    });

    // ✅ Corregido: eliminar espacios en la URL de WhatsApp
    return `https://wa.me/${messages[0].myPhone}?text=${encodeURIComponent(
      messages[0].message
    )}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        myPhone,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        getWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
