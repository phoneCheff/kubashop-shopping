// app/search/page.tsx
import { PriceFilter } from "@/components/PriceFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { searchProductsPaginated } from "@/lib/products-cache";

export const revalidate = 21600; // REDUCIDO a 1 hora (igual que categorías)

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 12;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";
  const sortOrder = (params.sort as "asc" | "desc" | "none") || "none";
  const page = parseInt(params.page || "1");

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
    // Usar la función de búsqueda PAGINADA desde el caché
    const { products, total } = await searchProductsPaginated(
      searchQuery,
      page,
      PRODUCTS_PER_PAGE
    );

    // Ordenar productos si es necesario
    let sortedProducts = [...products];
    if (sortOrder !== "none") {
      sortedProducts = sortedProducts.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado con título y filtro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#002A8F] mb-2">
                Resultados de búsqueda
              </h1>
              <p className="text-gray-600">
                {total === 0
                  ? `No se encontraron productos para "${searchQuery}"`
                  : `Se encontraron ${total} producto${
                      total !== 1 ? "s" : ""
                    } para "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {total > 0 && (
                <>
                  <div className="text-sm text-gray-600">
                    {total} producto
                    {total !== 1 ? "s" : ""}
                  </div>
                  <PriceFilter currentSort={sortOrder} />
                </>
              )}
            </div>
          </div>

          {/* Indicador de orden actual */}
          {sortOrder !== "none" && total > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              Ordenando por precio:{" "}
              <span className="font-medium text-[#002A8F]">
                {sortOrder === "asc" ? "Menor a Mayor" : "Mayor a Menor"}
              </span>
            </div>
          )}

          {/* Grid de productos */}
          {sortedProducts.length > 0 ? (
            <ProductGrid
              products={sortedProducts}
              currentPage={page}
              totalPages={totalPages}
              basePath="/search"
              queryParams={{ q: searchQuery, sort: sortOrder }}
              sortOrder={sortOrder}
            />
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
