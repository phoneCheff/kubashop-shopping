// app/product/[id]/page.tsx
"use client";

import { useCart } from "@/components/CartProvider";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Plus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  coin: string;
  priceWithMargin: number;
  gender: string | null;
  custom_slug: string;
  link_images: { links: string[] };
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    // ✅ Recuperar desde sessionStorage
    const stored = sessionStorage.getItem(`product_${id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product;
        setProduct(parsed);
      } catch (e) {
        console.error("Error parsing product from sessionStorage", e);
        router.push("/");
      }
    } else {
      // Si no hay datos, redirigir (porque no queremos fetch)
      router.push("/");
    }
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coin: product.coin,
      priceWithMargin: product.priceWithMargin,
      image: product.link_images?.links?.[0] || null,
      custom_slug: product.custom_slug,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  const images = product.link_images?.links || [];
  const mainImage = images[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-xl border"
              />
            ) : (
              <NoImagePlaceholder />
            )}

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-16 h-16 rounded border overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Extra ${idx}`}
                      width={64}
                      height={64}
                      className="object-cover"
                      loading="eager"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-emerald-700 mb-4">
              {(() => {
                const priceWithMargin = product.price * 1.1; // +10%
                const roundedPrice = Math.round(priceWithMargin); // redondear a entero
                const lastDigit = roundedPrice % 10;
                const finalPrice =
                  lastDigit <= 4
                    ? roundedPrice - lastDigit + 5
                    : roundedPrice - lastDigit + 10;
                return `${finalPrice} ${product.coin}`;
              })()}
            </p>
            <div className="prose prose-gray max-w-none mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Descripción</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || "Sin descripción disponible."}
              </p>
            </div>
            <Button
              onClick={handleAddToCart}
              className={`w-full h-12 font-medium ${
                isAdded
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white`}
            >
              {isAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> ¡Agregado!
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Agregar al carrito
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
