// components/ProductGrid.tsx
"use client";

import { ProductType } from "@/types/ProductType"; // 👈 importa el tipo
import { useState } from "react";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: ProductType[] }) {
  const [visibleCount, setVisibleCount] = useState(12); // Muestra 12 al inicio

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, products.length));
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-2 gap-6">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {visibleCount < products.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            Cargar más productos
          </button>
        </div>
      )}
    </>
  );
}
