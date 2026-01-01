// components/ProductCard.tsx

"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    images: string[];
    attributes: { key: string; value: any }[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const imageUrl =
    product.images[0] ||
    "https://res.cloudinary.com/dloy6thsv/image/upload/v1763573811/appleID_idxspf.avif";

  const optimizedImageUrl = imageUrl.includes("cloudinary.com")
    ? imageUrl.replace(
        "/upload/",
        "/upload/w_350,c_limit,q_auto:low,f_auto,dpr_auto/"
      )
    : imageUrl;

  const fullSizeImageUrl = imageUrl.includes("cloudinary.com")
    ? imageUrl.replace("/upload/", "/upload/w_1200,q_auto,f_auto/")
    : imageUrl;

  // Función para resetear el estado después de agregar al carrito
  const resetAddedState = () => {
    setIsAdded(false);
    setIsLoading(false);
  };

  // Effect para limpiar el timeout
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isAdded) {
      timer = setTimeout(() => {
        resetAddedState();
      }, 700);
    }

    // Limpieza del timeout
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isAdded]); // Solo se ejecuta cuando isAdded cambia

  const handleAddToCart = () => {
    setIsLoading(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coin: product.coin,
      priceWithMargin: product.priceWithMargin,
      image: optimizedImageUrl,
      clientPhone: product.client_phone || "",
    });

    setIsAdded(true);
    // El timeout se maneja en el useEffect
  };

  return (
    <>
      <Card className="product-card bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
        {/* Contenedor de imagen con lupa */}
        <div className="relative w-full pt-[100%] bg-gray-100">
          <Image
            src={optimizedImageUrl}
            alt={product.name}
            fill
            className="object-cover cursor-pointer"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhESMIAAAAABJRU5ErkJggg=="
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://res.cloudinary.com/dloy6thsv/image/upload/v1763573811/appleID_idxspf.avif";
            }}
            onClick={() => setIsImageModalOpen(true)}
          />

          {/* Ícono de lupa */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageModalOpen(true);
            }}
            className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Ampliar imagen"
          >
            <Search className="h-6 w-6 text-gray-700" />
          </button>
        </div>

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
          <p className="text-xm  text-gray-700 px-2 py-0.5 mb-2">
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

      {/* Modal de imagen ampliada */}
      <AnimatePresence>
        {isImageModalOpen && (
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
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-10 right-0 text-white bg-black/50 p-2 rounded-full hover:bg-black"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>
              <Image
                src={fullSizeImageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="max-h-[90vh] w-auto object-contain rounded-lg shadow-2xl"
                priority={true}
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
