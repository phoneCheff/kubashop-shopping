// app/product/[id]/page.tsx
"use client";

import { useCart } from "@/components/CartProvider";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import { Button } from "@/components/ui/button";
import { calculateRoundedPrice } from "@/lib/priceUtils";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Info,
  Plus,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

// Optimizar parser con mejor rendimiento
function parseDescription(description: string): {
  features: Array<{ key: string; value: string }>;
  sections: Array<{
    type: "feature" | "text";
    content: string | { key: string; value: string };
  }>;
} {
  if (!description.trim()) {
    return { features: [], sections: [] };
  }

  const parts = description
    .split("*")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== "*");

  const features: Array<{ key: string; value: string }> = [];
  const sections: Array<{ type: "feature" | "text"; content: any }> = [];

  const featureRegex = /^([A-Za-záéíóúÁÉÍÓÚñÑüÜ\s\-]+):\s*(.+)$/;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const cleanPart = part.replace(/\s+/g, " ").trim();
    const match = cleanPart.match(featureRegex);

    if (match) {
      const [, key, value] = match;
      const feature = {
        key: key.trim(),
        value: value.trim(),
      };
      features.push(feature);
      sections.push({
        type: "feature",
        content: feature,
      });
    } else {
      sections.push({
        type: "text",
        content: cleanPart,
      });
    }
  }

  return { features, sections };
}

// Componentes optimizados pero con tu diseño original
const FeatureHighlight = ({
  features,
}: {
  features: Array<{ key: string; value: string }>;
}) => {
  if (features.length === 0) return null;

  const highlightedFeatures = [
    "RAM",
    "Almacenamiento",
    "Procesador",
    "Pantalla",
    "Batería",
    "Sistema",
    "Garantía",
    "Color",
    "Talla",
    "Material",
    "Estado",
    "Garantia",
    "Domicilio",
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl border border-blue-100 p-6 mb-6 shadow-sm">
      <div className="flex items-center mb-4">
        <Zap className="h-5 w-5 mr-2 text-[#002A8F]" />
        <h3 className="font-bold text-gray-900 text-lg">
          Características principales
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features
          .filter((feature) =>
            highlightedFeatures.some((hf) =>
              feature.key.toLowerCase().includes(hf.toLowerCase())
            )
          )
          .slice(0, 6)
          .map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 hover:border-[#002A8F] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#002A8F]/10 flex items-center justify-center mr-3">
                  <span className="text-[#002A8F] font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 capitalize">
                    {feature.key}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {feature.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const AllFeaturesTable = ({
  features,
}: {
  features: Array<{ key: string; value: string }>;
}) => {
  if (features.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border p-6 mb-6">
      <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
        <ChevronRight className="h-5 w-5 mr-2 text-[#002A8F]" />
        Especificaciones técnicas
      </h3>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-start py-3 ${
              index < features.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="w-2/5 md:w-1/3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#002A8F] mr-2"></div>
                <span className="font-semibold text-gray-800">
                  {feature.key}
                </span>
              </div>
            </div>
            <div className="w-3/5 md:w-2/3">
              <div className="text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                {feature.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormattedDescription = ({ description }: { description: string }) => {
  const { features, sections } = useMemo(
    () => parseDescription(description),
    [description]
  );

  if (!description.trim()) {
    return (
      <div className="bg-white rounded-lg border p-5">
        <p className="text-gray-500 italic">Sin descripción disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {features.length > 0 && <FeatureHighlight features={features} />}

      <div className="space-y-4">
        {sections.map((section, index) => {
          if (section.type === "feature") {
            const feature = section.content as { key: string; value: string };
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#002A8F]"
              >
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-[#002A8F]" />
                  <span className="font-bold text-gray-800 capitalize">
                    {feature.key}:
                  </span>
                  <span className="ml-2 text-gray-700">{feature.value}</span>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="bg-white rounded-lg border p-5">
                <div className="text-gray-700 leading-relaxed">
                  {section.content as string}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Mostrar loader por un mínimo de tiempo para evitar parpadeo
    const loadingTimeout = setTimeout(() => setIsLoading(false), 200);

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
      router.push("/");
    }

    return () => clearTimeout(loadingTimeout);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002A8F]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Producto no encontrado
      </div>
    );
  }

  const images = product.link_images?.links || [];
  const mainImage = images[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-[#002A8F] mb-6 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="sticky top-6">
              {mainImage ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <NoImagePlaceholder />
              )}

              {images.length > 1 && (
                <div className="flex gap-3 mt-6 overflow-x-auto pb-2 px-1 hide-scrollbar">
                  {images.slice(1).map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-white overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <Image
                        src={img}
                        alt={`Vista ${idx + 1} de ${product.name}`}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        loading={idx > 2 ? "lazy" : "eager"} // Cargar las primeras imágenes inmediatamente
                        unoptimized={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl">Precio:</p>
                      <p className="text-4xl font-bold text-[#002A8F]">
                        {calculateRoundedPrice(product.price, product.coin)}{" "}
                        {product.coin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-xl flex items-center">
                    <Info className="h-6 w-6 mr-3 text-[#002A8F]" />
                    Detalles del producto
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {images.length}{" "}
                    {images.length === 1 ? "imagen" : "imágenes"}
                  </span>
                </div>

                <FormattedDescription description={product.description} />
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-[#002A8F] via-[#1E40AF] to-[#002A8F] shadow-2xl hover:shadow-3xl hover:shadow-blue-300 text-white relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#1E40AF] to-[#002A8F] transition-opacity duration-300 ${
                    isAdded ? "opacity-100" : "opacity-0"
                  }`}
                ></div>

                <span
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isAdded ? "scale-110" : "scale-100"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="mr-3 h-6 w-6" />
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <Plus className="mr-3 h-6 w-6" />
                      Añadir al carrito
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
