// app/api/refresh-cache/route.ts
import { refreshProductsCache } from "@/lib/products-cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await refreshProductsCache();
    return NextResponse.json({
      success: true,
      message: "Cache de productos actualizado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al actualizar caché" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
