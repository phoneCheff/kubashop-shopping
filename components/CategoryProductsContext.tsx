// components/CategoryProductsContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  coin: string;
  priceWithMargin: number;
  gender: string | null;
  custom_slug: string;
  link_images: { links: string[] };
};

type CategoryProductsContextType = {
  products: ProductType[] | null;
  setProducts: (products: ProductType[]) => void;
  getProductById: (id: string) => ProductType | undefined;
};

const CategoryProductsContext =
  createContext<CategoryProductsContextType | null>(null);

export function CategoryProductsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<ProductType[] | null>(null);

  const getProductById = (id: string) => {
    return products?.find((p) => p.id === id);
  };

  return (
    <CategoryProductsContext.Provider
      value={{ products, setProducts, getProductById }}
    >
      {children}
    </CategoryProductsContext.Provider>
  );
}

export const useCategoryProducts = () => {
  const context = useContext(CategoryProductsContext);
  if (!context) {
    throw new Error(
      "useCategoryProducts must be used within CategoryProductsProvider"
    );
  }
  return context;
};
