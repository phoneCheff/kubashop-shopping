// lib/products-cache.ts
import { supabase } from "@/lib/supabase";
import { ProductType } from "@/types/ProductType";

// Cache en memoria (se resetea con cada deploy o recarga del servidor)
let productsCache: ProductType[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

export async function getAllActiveProducts(): Promise<ProductType[]> {
  const now = Date.now();

  // Si tenemos cache válida, la retornamos
  if (productsCache && now - cacheTimestamp < CACHE_DURATION) {
    console.log("📦 Usando productos desde caché");
    return productsCache;
  }

  console.log("🔄 Actualizando caché de productos desde Supabase");

  try {
    // Obtener todos los productos activos CON sus categorías
    const { data: productsData, error } = await supabase
      .from("products")
      .select(
        `
        *,
        products_category_lnk (
          categories (
            id,
            slug
          )
        )
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }

    // Mapear los productos con sus categorías
    const products: ProductType[] = productsData.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      priceWithMargin: product.priceWithMargin,
      coin: product.coin,
      gender: product.gender,
      client_phone: product.client_phone,
      link_images: product.link_images,
      custom_slug: product.custom_slug,
      categories:
        product.products_category_lnk?.map((lnk: any) => ({
          id: lnk.categories?.id,
          slug: lnk.categories?.slug,
        })) || [],
    }));

    // Actualizar cache
    productsCache = products;
    cacheTimestamp = now;

    return products;
  } catch (error) {
    console.error("Error en getAllActiveProducts:", error);
    // Si hay error pero tenemos cache antigua, la retornamos
    if (productsCache) {
      console.log("⚠️ Error al actualizar, usando caché antigua");
      return productsCache;
    }
    throw error;
  }
}

// Función para forzar actualización del caché
export async function refreshProductsCache(): Promise<void> {
  productsCache = null;
  cacheTimestamp = 0;
  await getAllActiveProducts();
}

// Función para obtener productos por categoría
export async function getProductsByCategory(
  slug: string
): Promise<ProductType[]> {
  const allProducts = await getAllActiveProducts();

  return allProducts.filter((product) =>
    product.categories?.some((category) => category.slug === slug)
  );
}

// Función para buscar productos
export async function searchProducts(query: string): Promise<ProductType[]> {
  const allProducts = await getAllActiveProducts();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return [];

  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description?.toLowerCase().includes(normalizedQuery)
  );
}

// Función para limpiar el caché manualmente
export function clearProductsCache(): void {
  productsCache = null;
  cacheTimestamp = 0;
}
