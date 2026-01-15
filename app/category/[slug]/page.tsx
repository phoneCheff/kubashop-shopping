// app/category/[slug]/page.tsx
import { CATEGORIES } from "@/components/NavBarData"; // Asegúrate de que esta ruta sea correcta
import { PriceFilter } from "@/components/PriceFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategoryPaginated } from "@/lib/products-cache";

export const revalidate = 21600; // 6 horas

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string; page?: string }>;
}

const PRODUCTS_PER_PAGE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const searchParamsObj = searchParams ? await searchParams : {};
  const sortOrder = (searchParamsObj.sort as "asc" | "desc" | "none") || "none";
  const page = parseInt(searchParamsObj.page || "1");

  try {
    // 1. Obtener información de la categoría desde CATEGORIES
    const categoryData = CATEGORIES.find((cat) => cat.slug === slug);

    if (!categoryData) {
      return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-[#CF142B]">
              Categoría no encontrada
            </p>
          </div>
        </div>
      );
    }

    // 2. Obtener productos PAGINADOS desde el caché
    const { products, totalProducts } = await getProductsByCategoryPaginated(
      slug,
      page,
      PRODUCTS_PER_PAGE
    );

    // 3. Ordenar productos si es necesario
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

    // Calcular total de páginas
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado con título y filtro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-[#002A8F] capitalize">
              {categoryData.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {totalProducts} producto
                {totalProducts !== 1 ? "s" : ""}
              </div>
              <PriceFilter currentSort={sortOrder} />
            </div>
          </div>

          {/* Indicador de orden actual */}
          {sortOrder !== "none" && (
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
              basePath={`/category/${slug}`}
              queryParams={{ sort: sortOrder }}
              sortOrder={sortOrder}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No hay productos en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error en categoría:", error);
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#CF142B]">
            Error al cargar la categoría. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }
}
