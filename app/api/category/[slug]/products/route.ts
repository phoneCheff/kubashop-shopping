// app/api/category/[slug]/products/route.ts
import { getProductsByCategoryPaginated } from "@/lib/products-cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Next.js 15+: params es una Promise, debemos esperarla
    const { slug } = await params;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "none";

    const { products, totalProducts } = await getProductsByCategoryPaginated(
      slug,
      page,
      limit
    );

    // Aplicar ordenamiento si es necesario
    let sortedProducts = [...products];
    if (sort !== "none") {
      sortedProducts = sortedProducts.sort((a, b) => {
        return sort === "asc" ? a.price - b.price : b.price - a.price;
      });
    }

    return NextResponse.json({
      success: true,
      products: sortedProducts,
      page,
      limit,
      total: totalProducts,
      hasMore: page * limit < totalProducts,
    });
  } catch (error) {
    console.error("Error en API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al obtener productos",
      },
      { status: 500 }
    );
  }
}

// También puedes agregar otros métodos HTTP si los necesitas
export async function POST() {
  return NextResponse.json(
    { success: false, error: "Método no permitido" },
    { status: 405 }
  );
}
