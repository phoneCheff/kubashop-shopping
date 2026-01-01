// app/page.tsx (versión optimizada, sin Supabase en home)
"use client";

import { CATEGORIES } from "@/components/NavBarData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const scrollToCategorias = () => {
    const element = document.getElementById("categorias");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 py-12 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            KubaShop
          </h1>
          <p className="text-purple-100 mb-6 text-lg">
            Productos de calidad al mejor precio
          </p>
          <Button
            variant="secondary"
            className="bg-white text-purple-700 font-bold px-6 py-3 hover:bg-purple-50"
            onClick={scrollToCategorias}
          >
            Ver categorías <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                    <span className="text-purple-700 font-bold text-lg px-2 text-center">
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

      {/* Sección de beneficios */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ¿Cómo funciona?
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                1. Selecciona tus productos
              </h3>
              <p className="text-gray-600">
                Navega por categorías y agrega al carrito lo que necesites
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">2. Revisa tu carrito</h3>
              <p className="text-gray-600">
                Verifica los productos y el total antes de contactar por
                WhatsApp
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                3. Contacta por WhatsApp
              </h3>
              <p className="text-gray-600">
                Envía tu pedido directamente a nosotros y coordina pago y
                entrega
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
