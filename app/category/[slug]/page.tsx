// app/category/[slug]/page.tsx

import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import { ProductType } from "@/types/ProductType";

export const revalidate = 21600;

// ✅ CORREGIDO: Filtra slugs válidos
export async function generateStaticParams() {
  const { data: categories } = await supabase.from("categories").select("slug");

  // Filtra: solo slugs que existan, no sean null, ni string vacío
  const validSlugs = (categories || [])
    .map((cat: any) => cat.slug)
    .filter((slug): slug is string => Boolean(slug));

  return validSlugs.map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    console.error("Slug inválido:", slug);
    return <div className="p-8 text-center">Categoría no válida</div>;
  }

  console.log(
    `[FETCH] Cargando categoría "${slug}" a las ${new Date().toISOString()}`
  );

  /* 1️⃣ Categoría */
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (categoryError || !category) {
    console.error("Error al cargar categoría:", categoryError);
    return <div className="p-8 text-center">Categoría no encontrada</div>;
  }

  /* 2️⃣ Productos por categoría */
  const { data: productsData, error } = await supabase
    .from("products_category_lnk")
    .select(
      `
      products (
        id,
        name,
        description,
        price,
        coin,
        gender,
        is_active,
        link_images,
        custom_slug
      )
    `
    )
    .eq("category_id", category.id)
    .eq("products.is_active", true);

  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-8 text-center">Error al cargar productos</div>;
  }

  if (!productsData || productsData.length === 0) {
    return <div className="p-8 text-center">No hay productos</div>;
  }

  /* 3️⃣ Normalización */
  const products: ProductType[] = productsData
    .map((row: any) => {
      const product = row.products;

      // 🔥 Protección: omitir si el producto es null
      if (!product) {
        return null;
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        priceWithMargin: product.priceWithMargin,
        coin: product.coin,
        gender: product.gender,
        link_images: product.link_images,
        custom_slug: product.custom_slug,
      };
    })
    .filter((p): p is ProductType => p !== null); // 👈 Filtra los nulos y mantiene el tipado

  /* 4️⃣ Render */
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">{category.name}</h1>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
