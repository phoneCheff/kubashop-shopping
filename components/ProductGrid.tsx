"use client";

import { ProductType } from "@/types/ProductType";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductType[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams: Record<string, string>;
  sortOrder: string;
}

export const ProductGrid = memo(function ProductGrid({
  products,
  currentPage,
  totalPages,
  basePath,
  queryParams,
  sortOrder,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Optimización: useCallback para handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      // Mantener todos los parámetros actuales
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      // Actualizar página
      params.set("page", newPage.toString());

      // Navegar a la nueva URL
      router.push(`${basePath}?${params.toString()}`, { scroll: false });

      // Scroll suave al inicio
      const productsElement = document.getElementById("productos-grid");
      if (productsElement) {
        setTimeout(() => {
          productsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
    [basePath, queryParams, router, searchParams]
  );

  // Optimización: memoizar números de página visibles
  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const pageCount = Math.min(5, totalPages);
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <>
      {/* Grid de productos con ID para scroll */}
      <div
        id="productos-grid"
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-2 gap-6"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          {/* Información de página */}
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages} • {products.length} productos
            mostrados
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            {/* Indicadores de página */}
            <div className="flex gap-1">
              {visiblePageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#002A8F] text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </>
  );
});
