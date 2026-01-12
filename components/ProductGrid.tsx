// components/ProductGrid.tsx
"use client";

import { ProductType } from "@/types/ProductType";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductType[];
  currentPage: number;
  totalPages: number;
  basePath: string; // Nuevo: ruta base (/category/slug o /search)
  queryParams: Record<string, string>; // Nuevo: parámetros de consulta
  sortOrder: string;
}

export function ProductGrid({
  products,
  currentPage,
  totalPages,
  basePath,
  queryParams,
  sortOrder,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
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

    // Opcional: Scroll suave al inicio de los productos
    setTimeout(() => {
      const productsElement = document.getElementById("productos-grid");
      if (productsElement) {
        productsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;

                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
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
                );
              })}
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
}
