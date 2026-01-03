// components/ProductCard.tsx
"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
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
    client_phone: string;
    link_images: { links: string[] };
    images: string[];
    attributes: { key: string; value: any }[];
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

  // Función para optimizar URLs
  const getOptimizedUrl = (url: string) => {
    return url.includes("cloudinary.com") ? url : url;
  };

  const getFullSizeUrl = (url: string) => {
    return url.includes("cloudinary.com") ? url : url;
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
      clientPhone: product.client_phone || "",
    });
    setIsAdded(true);
  };

  return (
    <>
      <Card className="product-card bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
        <div className="relative w-full pt-[100%]">
          {mainImageUrl ? (
            <>
              <Image
                src={getOptimizedUrl(mainImageUrl)}
                alt={product.name}
                fill
                className="object-cover cursor-pointer"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhESMIAAAAABJRU5ErkJggg=="
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                onClick={openImageModal}
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
            <p className="text-black font-bold text-lg">
              ${((product.price * 10) / 100 + product.price).toFixed(2)}{" "}
              {product.coin}
            </p>
            {product.gender && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {product.gender}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 px-2 py-0.5 mb-2">
            {product.description}
          </p>

          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`w-full font-medium rounded-lg transition-colors ${
              isAdded
                ? "bg-green-500 hover:bg-green-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            } text-white h-11`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span> Agregando...
              </span>
            ) : isAdded ? (
              <span className="flex items-center justify-center">
                <Check className="mr-2 h-4 w-4" /> ¡Agregado!
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Plus className="mr-2 h-4 w-4" /> Agregar al carrito
              </span>
            )}
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
              <div className="relative">
                <Image
                  src={getFullSizeUrl(allImages[currentImageIndex])}
                  alt={`${product.name} - Imagen ${currentImageIndex + 1} de ${
                    allImages.length
                  }`}
                  width={800}
                  height={600}
                  className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
                  priority
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
                        src={getOptimizedUrl(img)}
                        alt={`Miniatura ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
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
