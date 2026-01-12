// app/search/page.tsx
import { ProductGrid } from "@/components/ProductGrid";
import { searchProducts } from "@/lib/products-cache";

export const revalidate = 21600; // 6 horas

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";

  if (!searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Buscar productos
            </h1>
            <p className="text-gray-600">
              Ingresa un término de búsqueda para encontrar productos
            </p>
          </div>
        </div>
      </div>
    );
  }

  try {
    // Usar la función de búsqueda desde el caché
    const products = await searchProducts(searchQuery);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#002A8F] mb-2">
              Resultados de búsqueda
            </h1>
            <p className="text-gray-600">
              {products.length === 0
                ? `No se encontraron productos para "${searchQuery}"`
                : `Se encontraron ${products.length} producto${
                    products.length !== 1 ? "s" : ""
                  } para "${searchQuery}"`}
            </p>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#CF142B]">
            Error al buscar productos. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }
}
