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
  X,
} from "lucide-react";
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
    if (stored) {
      setProduct(JSON.parse(stored));
    } else {
      router.push("/");
    }

    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002A8F]" />
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
  const currentImage = images[currentImageIndex];

  const nextImage = () =>
    setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const prevImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coin: product.coin,
      priceWithMargin: product.priceWithMargin,
      image: images[0] || null,
      custom_slug: product.custom_slug,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-[#002A8F] mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* IMÁGENES */}
            <div className="lg:w-1/2">
              {currentImage ? (
                <>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border shadow-xl">
                    <Image
                      src={cloudinaryTransform(currentImage, { width: 700 })}
                      alt={product.name}
                      fill
                      className="object-cover cursor-pointer hover:scale-105 transition-transform"
                      unoptimized
                      priority
                      onClick={() => setIsImageModalOpen(true)}
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="flex gap-3 mt-5 overflow-x-auto">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
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
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NoImagePlaceholder />
              )}
            </div>

            {/* INFO */}
            <div className="lg:w-1/2 bg-white rounded-3xl p-8 shadow-xl">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <p className="text-4xl font-bold text-[#002A8F] mb-6">
                {calculateRoundedPrice(product.price, product.coin)}{" "}
                {product.coin}
              </p>

              <Button
                onClick={handleAddToCart}
                className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-[#002A8F] to-[#1E40AF]"
              >
                {isAdded ? (
                  <>
                    <Check className="mr-2" /> Agregado
                  </>
                ) : (
                  <>
                    <Plus className="mr-2" /> Añadir al carrito
                  </>
                )}
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
            className="relative max-w-5xl w-full"
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
            <Image
              src={cloudinaryTransform(images[currentImageIndex], {
                width: 1200,
              })}
              alt="Imagen ampliada"
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
