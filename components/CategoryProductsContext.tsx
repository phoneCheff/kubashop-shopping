"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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

  // Optimización: crear índice para búsqueda rápida
  const productIndex = useMemo(() => {
    if (!products) return new Map<string, ProductType>();

    const index = new Map<string, ProductType>();
    products.forEach((product) => {
      index.set(product.id, product);
    });
    return index;
  }, [products]);

  // Optimización: useCallback para función estable
  const getProductById = useCallback(
    (id: string) => {
      return productIndex.get(id);
    },
    [productIndex]
  );

  const contextValue = useMemo(
    () => ({
      products,
      setProducts,
      getProductById,
    }),
    [products, getProductById]
  );

  return (
    <CategoryProductsContext.Provider value={contextValue}>
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
