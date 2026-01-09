// app/category/[slug]/page.tsx
"use client";

import { PriceFilter } from "@/components/PriceFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import { ProductType } from "@/types/ProductType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<{ id: string; name: string } | null>(
    null
  );
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Obtener categoría
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name")
          .eq("slug", slug)
          .single();

        if (categoryError || !categoryData) {
          throw new Error("Categoría no encontrada");
        }

        setCategory(categoryData);

        // 2. Obtener productos
        const { data: productsData, error: productsError } = await supabase
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
          .eq("category_id", categoryData.id)
          .eq("products.is_active", true);

        if (productsError) {
          throw productsError;
        }

        if (productsData) {
          const mappedProducts: ProductType[] = productsData
            .map((row: any) => {
              const product = row.products;
              if (!product) return null;

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
            .filter((p): p is ProductType => p !== null);

          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Función para ordenar productos
  useEffect(() => {
    if (sortOrder === "none") {
      setFilteredProducts(products);
    } else {
      const sorted = [...products].sort((a, b) => {
        if (sortOrder === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
      setFilteredProducts(sorted);
    }
  }, [sortOrder, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#002A8F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#CF142B]">Categoría no encontrada</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#002A8F] mb-6 capitalize">
            {category.name}
          </h1>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay productos en esta categoría
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado con título y filtro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#002A8F] capitalize">
            {category.name}
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
            <PriceFilter onSortChange={setSortOrder} currentSort={sortOrder} />
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
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
