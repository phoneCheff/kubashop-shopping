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
                    src={cloudinaryTransform(mainImage, { width: 600 })}
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
} ProductCard.tsx:// components/ProductCard.tsx
"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculateRoundedPrice } from "@/lib/priceUtils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import NoImagePlaceholder from "./NoImagePlaceholder";

type ProductCardProps = {
  product: {
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
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Nuevo estado para el índice actual

  // Obtener todas las imágenes del producto
  const allImages = product.link_images?.links || [];

  // URL de la imagen principal (primera imagen)
  const mainImageUrl = allImages[0] || null;

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

  // Función para cambiar de imagen en el carrusel
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  // Resetear el índice cuando se abre el modal
  const openImageModal = () => {
    setCurrentImageIndex(0);
    setIsImageModalOpen(true);
  };

  const resetAddedState = () => {
    setIsAdded(false);
    setIsLoading(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAdded) {
      timer = setTimeout(() => {
        resetAddedState();
      }, 700);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAdded]);

  const handleAddToCart = () => {
    setIsLoading(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coin: product.coin,
      priceWithMargin: product.priceWithMargin,
      image: mainImageUrl,
      custom_slug: product.custom_slug,
    });
    setIsAdded(true);
  };

  // Función para calcular precio con +10%

  const handleViewDetails = () => {
    // ✅ Guardar el producto completo en sessionStorage
    sessionStorage.setItem(`product_${product.id}`, JSON.stringify(product));
    // Luego navegar
    window.location.href = `/product/${product.id}`;
  };

  return (
    <>
      <Card className="product-card bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
        <div className="relative w-full pt-[100%]">
          {mainImageUrl ? (
            <>
              <Image
                src={cloudinaryTransform(mainImageUrl, { width: 400 })}
                alt={product.name}
                fill
                className="object-cover cursor-pointer border-b-1 border-gray-500"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhESMIAAAAABJRU5ErkJggg=="
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                onClick={openImageModal}
                unoptimized
              />

              {/* Indicador de múltiples imágenes */}
              {allImages.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {allImages.length} imágenes
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal();
                }}
                className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Ampliar imagen"
              >
                <Search className="h-6 w-6 text-gray-700" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0">
              <NoImagePlaceholder />
            </div>
          )}
        </div>

        {/* El resto del código de la tarjeta se mantiene igual */}
        <div className="p-3">
          <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 uppercase">
            {product.name}
          </h3>

          <div className="flex justify-between items-center mb-2">
            <span className="text-[#002A8F] font-bold text-lg">
              {product.price}-
              {calculateRoundedPrice(product.price, product.coin)}{" "}
              {product.coin}
            </span>
          </div>
          {/* 🆕 Botón: Ver más detalles */}
          <Button
            type="button"
            variant="outline"
            onClick={handleViewDetails}
            className="w-full mt-2 text-sm text-gray-500 hover:text-[#002A8F] font-medium flex items-center justify-center gap-1 transition-colors"
          >
            Ver más detalles
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`w-full mt-1 font-medium rounded-lg transition-colors relative overflow-hidden ${
              isAdded
                ? "bg-gradient-to-r from-[#1E40AF] to-[#002A8F]"
                : "bg-gradient-to-r from-[#002A8F] via-[#1E40AF] to-[#002A8F]"
            } text-white h-11 hover:shadow-lg`}
          >
            {isAdded && (
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            )}
            <span className="relative flex items-center justify-center">
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Agregando...
                </>
              ) : isAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> ¡Agregado!
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Agregar al carrito
                </>
              )}
            </span>
          </Button>
        </div>
      </Card>

      {/* Modal de imágenes ampliadas (carrusel) */}
      <AnimatePresence>
        {isImageModalOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-10 right-0 text-white bg-black/50 p-2 rounded-full hover:bg-black z-10"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Imagen principal del carrusel */}
              <div className="relative border-b-2 border-black">
                <Image
                  src={cloudinaryTransform(allImages[currentImageIndex], {
                    width: 1000,
                    quality: "auto",
                  })}
                  alt={`${product.name} - Imagen ${currentImageIndex + 1} de ${
                    allImages.length
                  }`}
                  width={800}
                  height={600}
                  className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
                  priority
                  unoptimized
                />

                {/* Controles de navegación (solo si hay más de 1 imagen) */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black transition-colors"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Indicador de posición (miniaturas o puntos) */}
                <div className="flex justify-center mt-4 space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-gray-500 hover:bg-gray-300"
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Contador de imágenes */}
                <div className="text-center text-white mt-2 text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Miniaturas de todas las imágenes (opcional, para muchos desplazamientos) */}
              {allImages.length > 5 && (
                <div className="flex overflow-x-auto space-x-2 mt-4 py-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                        index === currentImageIndex
                          ? "border-white"
                          : "border-transparent"
                      } overflow-hidden`}
                    >
                      <Image
                        src={cloudinaryTransform(img, {
                          width: 80,
                          quality: "60",
                        })}
                        alt={`Miniatura ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}