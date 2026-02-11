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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    comision_fija: number;
  };
};

export const ProductCard = memo(
  function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null); // ✅ CORREGIDO

    // Optimización: memoizar datos derivados
    const allImages = useMemo(
      () => product.link_images?.links || [],
      [product.link_images?.links],
    );
    const mainImageUrl = useMemo(() => allImages[0] || null, [allImages]);

    // Optimización: memoizar transformación de Cloudinary
    const cloudinaryTransform = useCallback(
      (
        url: string,
        {
          width,
          quality = "auto",
          crop = "fill",
        }: { width: number; quality?: string; crop?: string },
      ) => {
        if (!url.includes("cloudinary.com")) return url;
        return url.replace(
          "/upload/",
          `/upload/q_${quality},c_${crop},w_${width}/`,
        );
      },
      [],
    );

    // Optimización: memoizar handlers
    const nextImage = useCallback(() => {
      setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1,
      );
    }, [allImages.length]);

    const prevImage = useCallback(() => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1,
      );
    }, [allImages.length]);

    const openImageModal = useCallback(() => {
      setCurrentImageIndex(0);
      setIsImageModalOpen(true);
    }, []);

    // Optimización: función única para reset
    const resetAddedState = useCallback(() => {
      setIsAdded(false);
      setIsLoading(false);
    }, []);

    // Optimización: manejo más eficiente del timer
    useEffect(() => {
      if (isAdded) {
        timerRef.current = setTimeout(resetAddedState, 700);
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }
    }, [isAdded, resetAddedState]);

    // Optimización: useCallback para handlers
    const handleAddToCart = useCallback(() => {
      setIsLoading(true);
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        coin: product.coin,
        priceWithMargin: product.priceWithMargin,
        image: mainImageUrl,
        custom_slug: product.custom_slug,
        quantity: 0,
        comision_fija: product.comision_fija,
      });
      setIsAdded(true);
    }, [addToCart, product, mainImageUrl]);

    // Optimización: memoizar precio calculado
    const calculatedPrice = useMemo(
      () =>
        calculateRoundedPrice(
          product.price,
          product.coin,
          product.comision_fija,
        ),
      [product.price, product.coin, product.comision_fija],
    );

    // Optimización: función única para ver detalles
    const handleViewDetails = useCallback(() => {
      sessionStorage.setItem(`product_${product.id}`, JSON.stringify(product));
      window.location.href = `/product/${product.id}`;
    }, [product]);

    // Optimización: memoizar componente del modal
    const ImageModal = useMemo(() => {
      if (!isImageModalOpen || allImages.length === 0) return null;

      const currentImage = allImages[currentImageIndex];
      const imageUrl = cloudinaryTransform(currentImage, {
        width: 1000,
        quality: "auto",
      });

      return (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
            style={{ transform: "translateZ(0)" }}
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
                  src={imageUrl}
                  alt={`${product.name} - Imagen ${currentImageIndex + 1} de ${
                    allImages.length
                  }`}
                  width={800}
                  height={600}
                  className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
                  priority
                  unoptimized
                />

                {/* Controles de navegación */}
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

                {/* Indicador de posición */}
                <div className="flex justify-center mt-4 space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
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

              {/* Miniaturas para muchas imágenes */}
              {allImages.length > 5 && (
                <div className="flex overflow-x-auto space-x-2 mt-4 py-2 scrollbar-thin">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-colors ${
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
        </AnimatePresence>
      );
    }, [
      isImageModalOpen,
      allImages,
      currentImageIndex,
      product.name,
      cloudinaryTransform,
      prevImage,
      nextImage,
    ]);

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
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target
                      .parentElement!.querySelector(".image-fallback")
                      ?.classList.remove("hidden");
                  }}
                  onClick={openImageModal}
                  unoptimized
                />
                {/* Fallback para imagen rota */}
                <div className="hidden image-fallback absolute inset-0">
                  <NoImagePlaceholder />
                </div>

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

          <div className="p-3">
            <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 uppercase">
              {product.name}
            </h3>

            <div className="flex justify-between items-center mb-2">
              <span className="text-[#002A8F] font-bold text-lg">
                {calculatedPrice} {product.coin}
              </span>
            </div>

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

        {ImageModal}
      </>
    );
  },
  (prev, next) => {
    // Optimización: shallow comparison para evitar re-renders innecesarios
    return (
      prev.product.id === next.product.id &&
      JSON.stringify(prev.product) === JSON.stringify(next.product)
    );
  },
);
