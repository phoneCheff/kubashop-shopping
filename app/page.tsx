// app/page.tsx (versión optimizada con tutorial de 8 visitas)
"use client";

import { CATEGORIES } from "@/components/NavBarData";
import { ProductSearch } from "@/components/ProductSearch";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Componente del Tutorial
function TutorialGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const steps = [
    {
      title: "¡Bienvenido a KubaShop!",
      description:
        "Te guiaremos paso a paso para que aprendas a usar nuestra tienda online.",
      image: "👋",
      target: null,
    },
    {
      title: "1. Explora categorías",
      description:
        "Navega por nuestras categorías para encontrar lo que necesitas.",
      image: "🛍️",
      target: "categorias",
    },
    {
      title: "2. Busca productos",
      description:
        "Utiliza la barra de busqueda para encontrar los que necesitas de forma rapida",
      image: "🔎",
      target: null,
    },
    {
      title: "3. Agrega productos al carrito",
      description:
        "Haz clic en 'Agregar al carrito' en cualquier producto que te interese.",
      image: "🛒",
      target: null,
    },
    {
      title: "4. Ver detalles del producto",
      description:
        "Haz clic en 'Ver más detalles' para ver especificaciones completas.",
      image: "🔍",
      target: null,
    },
    {
      title: "5. Revisa tu carrito",
      description:
        "Accede al carrito para ver todos los productos seleccionados.",
      image: "📋",
      target: null,
    },
    {
      title: "6. Envía tu pedido por WhatsApp",
      description:
        "Finaliza tu compra enviando el pedido directamente por WhatsApp.",
      image: "📱",
      target: null,
    },
  ];

  // Verificar y actualizar el contador de visitas
  useEffect(() => {
    const count = localStorage.getItem("kubashop_visit_count");
    const completed = localStorage.getItem("kubashop_tutorial_completed");

    let currentCount = count ? parseInt(count) : 0;
    const isCompleted = completed === "true";

    // Incrementar el contador
    currentCount += 1;
    localStorage.setItem("kubashop_visit_count", currentCount.toString());
    setVisitCount(currentCount);
    setTutorialCompleted(isCompleted);

    // Mostrar tutorial si:
    // 1. No está completado Y
    // 2. El contador es menor o igual a 8
    if (!isCompleted && currentCount <= 8) {
      const timer = setTimeout(() => {
        setIsTutorialOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsTutorialOpen(false);
    localStorage.setItem("kubashop_tutorial_completed", "true");
    setTutorialCompleted(true);
  };

  const scrollToTarget = (targetId: string | null) => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Efecto para scrollear al target cuando cambia el paso
  useEffect(() => {
    if (isTutorialOpen && steps[currentStep].target) {
      setTimeout(() => {
        scrollToTarget(steps[currentStep].target);
      }, 300);
    }
  }, [currentStep, isTutorialOpen]);

  return (
    <>
      {/* Botón flotante para reabrir tutorial */}
      <button
        onClick={() => setIsTutorialOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#002A8F] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label="Abrir tutorial"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {/* Modal del tutorial */}
      <AnimatePresence>
        {isTutorialOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => handleComplete()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Tutorial de KubaShop
                    </h3>
                    <p className="text-sm text-gray-500">
                      Paso {currentStep + 1} de {steps.length}
                    </p>
                  </div>
                  <button
                    onClick={handleComplete}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Cerrar tutorial"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="h-1 bg-gray-200 rounded-full mb-6">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                    }}
                    className="h-full bg-[#002A8F] rounded-full"
                  />
                </div>
              </div>

              {/* Contenido del paso actual */}
              <div className="p-6 pt-0">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {steps[currentStep].image}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {steps[currentStep].title}
                  </h4>
                  <p className="text-gray-600">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* Puntos indicadores */}
                <div className="flex justify-center space-x-2 mb-8">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep
                          ? "bg-[#002A8F] scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Ir al paso ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Botones de navegación */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="px-6"
                  >
                    Atrás
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="bg-[#002A8F] hover:bg-[#001F5C] px-6"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Completar
                      </>
                    ) : (
                      "Siguiente"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  const scrollToCategorias = () => {
    const element = document.getElementById("categorias");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <TutorialGuide />

      <div className="min-h-screen bg-gray-50">
        {/* Hero section */}
        {/* Hero section */}
        <section className="bg-gradient-to-r from-[#002A8F] to-[#1E40AF] py-12 px-4 text-center text-base">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              KubaShop
            </h1>
            <p className="text-blue-100 mb-6 text-lg">
              Productos de calidad al mejor precio
            </p>
            <ProductSearch />
          </div>
        </section>

        {/* Categorías */}
        <section id="categorias" className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">
              Categorías
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {CATEGORIES.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-[#002A8F]/20">
                    <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
                      <span className="text-[#002A8F] font-bold text-lg px-2 text-center">
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Guía rápida de uso */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ¿Cómo comprar en KubaShop?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border-l-4 border-[#002A8F]">
                <div className="text-3xl mb-4">1</div>
                <h3 className="font-bold text-lg mb-2 text-[#002A8F]">
                  Busca productos
                </h3>
                <p className="text-gray-600 text-sm">
                  Explora nuestras categorías y encuentra lo que necesitas
                </p>
              </div>

              <div className="text-center p-6 bg-red-50 rounded-xl border-l-4 border-[#CF142B]">
                <div className="text-3xl mb-4">2</div>
                <h3 className="font-bold text-lg mb-2 text-[#CF142B]">
                  Agrega al carrito
                </h3>
                <p className="text-gray-600 text-sm">
                  Selecciona productos y agrégalos a tu carrito de compras
                </p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl border-l-4 border-[#002A8F]">
                <div className="text-3xl mb-4">3</div>
                <h3 className="font-bold text-lg mb-2 text-[#002A8F]">
                  Envía por WhatsApp
                </h3>
                <p className="text-gray-600 text-sm">
                  Finaliza tu compra enviando el pedido por WhatsApp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Botón de acción principal */}
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto text-center">
            <Link href="/cart">
              <Button className="w-full bg-gradient-to-r from-[#002A8F] via-[#1E40AF] to-[#002A8F] text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                Ver mi carrito de compras
              </Button>
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              ¡Empieza tu compra ahora mismo!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
