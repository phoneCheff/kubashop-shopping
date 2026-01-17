"use client";

import { calculateRoundedPrice } from "@/lib/priceUtils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  coin: string;
  priceWithMargin: number;
  image: string | null;
  custom_slug: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  myPhone: number;
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getWhatsAppLink: () => string;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const myPhone = 63115599;

  // Optimización: cargar desde localStorage solo en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCart = localStorage.getItem("kubashop-cart");
    if (savedCart) {
      try {
        // Parsear solo una vez y usar JSON.parse con reviver
        const parsed = JSON.parse(savedCart, (key, value) => {
          // Optimizar: convertir directamente con validación
          if (key === "priceWithMargin" && value === null) {
            return value * 1.1;
          }
          return value;
        });

        // Usar setItems directo sin transformación adicional
        setItems(parsed);
      } catch (e) {
        console.error("Error parsing cart from localStorage", e);
        setItems([]);
      }
    }
  }, []);

  // Optimización: debounce para guardar en localStorage
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem("kubashop-cart", JSON.stringify(items));
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [items]);

  // Optimización: useCallback para funciones estables
  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Actualizar directamente sin crear nuevo array completo
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return newItems;
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          priceWithMargin: calculateRoundedPrice(product.price, product.coin),
          image: product.image || null,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      // Crear nuevo array solo si hay cambios
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      // Optimización: actualizar solo el item necesario
      if (prev[index].quantity === quantity) return prev;

      const newItems = [...prev];
      newItems[index] = { ...newItems[index], quantity };
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Optimización: memoizar cálculos costosos
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => totalItems, [totalItems]);

  const getWhatsAppLink = useCallback(() => {
    if (items.length === 0) return "";

    // Optimización: usar Map en lugar de reduce para agrupación
    const productMap = new Map<string, CartItem[]>();

    items.forEach((item) => {
      const current = productMap.get(item.id) || [];
      productMap.set(item.id, [...current, item]);
    });

    // Optimización: calcular mensaje eficientemente
    let message = "¡Hola! Quisiera comprar:\n\n";
    let total = 0;

    productMap.forEach((products, productId) => {
      const product = products[0]; // Todos son el mismo producto
      const quantity = products.reduce((sum, p) => sum + p.quantity, 0);
      const productTotal = product.price * quantity;

      message += `• ${product.name} (x${quantity}) - $${productTotal.toFixed(
        2
      )}\n`;
      total += productTotal;
    });

    message += `\nTotal: $${total.toFixed(2)}`;

    return `https://wa.me/${myPhone}?text=${encodeURIComponent(message)}`;
  }, [items, myPhone]);

  // Optimización: memoizar el contexto completo
  const contextValue = useMemo(
    () => ({
      items,
      myPhone,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getWhatsAppLink,
    }),
    [
      items,
      myPhone,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getWhatsAppLink,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
