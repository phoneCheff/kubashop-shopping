"use client";

import { useCart } from "@/components/CartProvider";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import { Button } from "@/components/ui/button";
import { calculateRoundedPrice } from "@/lib/priceUtils";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  X,
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

// Función para parsear la descripción en features y secciones
function parseDescription(description: string) {
  if (!description.trim()) return { features: [], sections: [] };

  const parts = description
    .split("*")
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p !== "*");

  const features: Array<{ key: string; value: string }> = [];
  const sections: Array<{ type: "feature" | "text"; content: any }> = [];
  const featureRegex = /^([A-Za-záéíóúÁÉÍÓÚñÑüÜ\s\-]+):\s*(.+)$/;

  for (const part of parts) {
    const cleanPart = part.replace(/\s+/g, " ").trim();
    const match = cleanPart.match(featureRegex);
    if (match) {
      const [, key, value] = match;
      const feature = { key: key.trim(), value: value.trim() };
      features.push(feature);
      sections.push({ type: "feature", content: feature });
    } else {
      sections.push({ type: "text", content: cleanPart });
    }
  }
  return { features, sections };
}

// Componentes de UI
const FeatureHighlight = ({
  features,
}: {
  features: Array<{ key: string; value: string }>;
}) => {
  if (!features.length) return null;
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
          .filter((f) =>
            highlightedFeatures.some((hf) =>
              f.key.toLowerCase().includes(hf.toLowerCase())
            )
          )
          .slice(0, 6)
          .map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 hover:border-[#002A8F] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#002A8F]/10 flex items-center justify-center mr-3">
                  <span className="text-[#002A8F] font-bold text-sm">
                    {idx + 1}
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

{
  /*const AllFeaturesTable = ({
  features,
}: {
  features: Array<{ key: string; value: string }>;
}) => {
  if (!features.length) return null;
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
};*/
}

const FormattedDescription = ({ description }: { description: string }) => {
  const { features, sections } = useMemo(
    () => parseDescription(description),
    [description]
  );

  if (!description.trim())
    return (
      <div className="bg-white rounded-lg border p-5">
        <p className="text-gray-500 italic">Sin descripción disponible.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {features.length > 0 && <FeatureHighlight features={features} />}
      {/*<AllFeaturesTable features={features} /> */}
      <div className="space-y-4">
        {sections.map((section, idx) =>
          section.type === "feature" ? (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#002A8F]"
            >
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-[#002A8F]" />
                <span className="font-bold text-gray-800 capitalize">
                  {(section.content as { key: string }).key}:
                </span>
                <span className="ml-2 text-gray-700">
                  {(section.content as { value: string }).value}
                </span>
              </div>
            </div>
          ) : (
            <div key={idx} className="bg-white rounded-lg border p-5">
              <div className="text-gray-700 leading-relaxed">
                {section.content as string}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const stored = sessionStorage.getItem(`product_${id}`);
    if (stored) setProduct(JSON.parse(stored));
    else router.push("/");

    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
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
      quantity: 0,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const images = product?.link_images?.links || [];
  const mainImage = images[currentImageIndex];

  const nextImage = () =>
    setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  const prevImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002A8F]" />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Producto no encontrado
      </div>
    );

  const cloudinaryTransform = (
    url: string,
    {
      width,
      quality = "auto",
      crop = "fill",
    }: { width: number; quality?: string; crop?: string }
  ) => {
    if (!url.includes("cloudinary.com")) return url;

    return url.replace(
      "/upload/",
      `/upload/f_auto,q_${quality},c_${crop},w_${width}/`
    );
  };

  return (
    <>
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
            {/* IMÁGENES */}
            <div className="lg:w-1/2">
              <div className="sticky top-6">
                {mainImage ? (
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                    <Image
                      src={cloudinaryTransform(mainImage, { width: 700 })}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      priority
                      unoptimized
                      onClick={() => setIsImageModalOpen(true)}
                    />
                  </div>
                ) : (
                  <NoImagePlaceholder />
                )}

                {images.length > 1 && (
                  <div className="flex gap-3 mt-6 overflow-x-auto pb-2 px-1 hide-scrollbar">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 overflow-hidden transition-all ${
                          idx === currentImageIndex
                            ? "border-[#002A8F] scale-105"
                            : "border-white hover:scale-105"
                        }`}
                      >
                        <Image
                          src={cloudinaryTransform(img, {
                            width: 100,
                            quality: "60",
                          })}
                          alt={`Miniatura ${idx + 1}`}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="lg:w-1/2 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-[#002A8F] mb-6">
                {calculateRoundedPrice(product.price, product.coin)}{" "}
                {product.coin}
              </p>

              <FormattedDescription description={product.description} />

              <Button
                onClick={handleAddToCart}
                className="w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-[#002A8F] via-[#1E40AF] to-[#002A8F] shadow-2xl text-white relative overflow-hidden mt-6"
              >
                <span className="relative flex items-center justify-center">
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

      {/* MODAL CARRUSEL */}
      {isImageModalOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-full max-h-full w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white bg-black/50 p-2 rounded-full hover:bg-black z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <Image
              src={cloudinaryTransform(images[currentImageIndex], {
                width: 1200,
              })}
              alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
              width={1200}
              height={900}
              className="max-h-[80vh] mx-auto object-contain rounded-xl"
              unoptimized
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            <div className="text-center text-white mt-4 text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
