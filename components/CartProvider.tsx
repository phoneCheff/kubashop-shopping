"use client";

import { calculateRoundedPrice } from "@/lib/priceUtils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const [isInitialized, setIsInitialized] = useState(false);
  const myPhone = 63115599;
  const isSavingRef = useRef(false);

  // Cargar desde localStorage solo al inicio
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedCart = localStorage.getItem("kubashop-cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Validar que sea un array
        if (Array.isArray(parsed)) {
          // Asegurar que todos los items tengan los campos requeridos
          const validatedItems = parsed.map((item) => ({
            ...item,
            priceWithMargin:
              item.priceWithMargin ||
              calculateRoundedPrice(item.price, item.coin),
            image: item.image || null,
            quantity: item.quantity || 1,
          }));
          setItems(validatedItems);
        } else {
          console.warn("Cart data is not an array, resetting cart");
          localStorage.removeItem("kubashop-cart");
          setItems([]);
        }
      }
    } catch (e) {
      console.error("Error parsing cart from localStorage", e);
      localStorage.removeItem("kubashop-cart");
      setItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar en localStorage inmediatamente cuando cambien los items
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized || isSavingRef.current)
      return;

    isSavingRef.current = true;

    try {
      localStorage.setItem("kubashop-cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    } finally {
      isSavingRef.current = false;
    }
  }, [items, isInitialized]);

  // Sincronizar entre pestañas
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kubashop-cart") {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) {
              setItems(parsed);
            }
          } else {
            setItems([]);
          }
        } catch (error) {
          console.error("Error parsing cart from storage event", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
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
      const newItems = prev.filter((item) => item.id !== id);

      // Si el carrito queda vacío, limpiar localStorage inmediatamente
      if (newItems.length === 0 && typeof window !== "undefined") {
        localStorage.removeItem("kubashop-cart");
      }

      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      if (prev[index].quantity === quantity) return prev;

      const newItems = [...prev];
      newItems[index] = { ...newItems[index], quantity };
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    // Limpiar localStorage inmediatamente
    if (typeof window !== "undefined") {
      localStorage.removeItem("kubashop-cart");
      // Disparar evento para sincronizar otras pestañas
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "kubashop-cart",
          newValue: null,
          oldValue: JSON.stringify(items),
          storageArea: localStorage,
        }),
      );
    }

    // Limpiar el estado
    setItems([]);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => totalItems, [totalItems]);

  const getWhatsAppLink = useCallback(() => {
    if (items.length === 0) return "";

    const productMap = new Map<string, CartItem[]>();

    items.forEach((item) => {
      const current = productMap.get(item.id) || [];
      productMap.set(item.id, [...current, item]);
    });

    let message = "¡Hola! Quisiera comprar:\n\n";
    let total = 0;

    productMap.forEach((products, productId) => {
      const product = products[0];
      const quantity = products.reduce((sum, p) => sum + p.quantity, 0);
      const productTotal = product.price * quantity;

      message += `• ${product.name} (x${quantity}) - $${productTotal.toFixed(2)}\n`;
      total += productTotal;
    });

    message += `\nTotal: $${total.toFixed(2)}`;

    return `https://wa.me/${myPhone}?text=${encodeURIComponent(message)}`;
  }, [items, myPhone]);

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
    ],
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
