// components/NavBar.tsx
"use client";

import { useCart } from "@/components/CartProvider";
import { KSText, KubaShopText, LogoCart } from "@/components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Añade este import
import { useEffect, useState } from "react";
import { CATEGORIES } from "./NavBarData";
import { ProductSearch } from "./ProductSearch";

export function Navbar() {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Usar el hook de Next.js para obtener la ruta actual
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".categories-dropdown") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = CATEGORIES;

  const navLinks = [{ name: "Inicio", href: "/", icon: "🏠" }];

  return (
    <>
      {/* Navbar principal - consistente en todos los dispositivos */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : "bg-white/80 backdrop-blur-md py-3 border-b border-gray-100"
        } supports-[position:sticky]:sticky`} // Refuerza sticky
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-14">
            {/* Logo - siempre visible */}
            <div className="flex items-center gap-2 ">
              <Link href={"/"}>
                <LogoCart className="w-30  h-16 " />
              </Link>
              <Link href={"/"}>
                <KubaShopText className="h-8 md:h-10 hidden sm:block" />
              </Link>
              <Link href={"/"}>
                <KSText className="h-8 md:h-10 sm:hidden ml-8" />
              </Link>
            </div>

            {/* Navegación principal - desktop */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    pathname === link.href // Cambiado: usa pathname en lugar de window.location
                      ? "bg-blue-50 text-[#002A8F] shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.name}
                </Link>
              ))}

              {/* Dropdown de categorías en desktop */}
              <div className="relative categories-dropdown">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isCategoriesOpen ||
                    activeCategory ||
                    pathname?.startsWith("/category/") // También puedes verificar si estamos en una categoría
                      ? "bg-blue-50 text-[#002A8F] shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span>🛒</span>
                  <span className="ml-1 mr-1">Categorías</span>
                  {isCategoriesOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onMouseEnter={() => setActiveCategory(cat.slug)}
                          onMouseLeave={() => setActiveCategory(null)}
                          className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all ${
                            activeCategory === cat.slug ||
                            pathname === `/category/${cat.slug}`
                              ? `${cat.color} rounded-lg`
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="mr-3">{cat.icon}</span>
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
              <ProductSearch />
            </div>

            {/* Acciones de usuario - desktop y mobile */}
            <div className="flex items-center space-x-2">
              {/* Botón de carrito - visible en todos los tamaños */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                aria-label="Carrito de compras"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-800 group-hover:text-[#002A8F] transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-[#CF142B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block group-hover:text-[#002A8F] transition-colors">
                  Carrito
                </span>
              </Link>

              {/* Botón de menú móvil */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil desplegable - Drawer lateral */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="md:hidden fixed inset-0 z-40 bg-white shadow-xl"
          >
            {/* Header del drawer */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 px-1 mt-1">
              <ProductSearch onCloseMenu={() => setIsMenuOpen(false)} />
            </div>

            {/* Contenido del drawer */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-70px)]">
              {/* Categorías principales - destacadas */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
                  NUESTRAS CATEGORÍAS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${cat.color} ${cat.hoverColor} hover:scale-105 hover:shadow-lg`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {/* Para móviles: icono más grande */}
                      <div className="text-3xl mb-2 md:text-2xl">
                        {cat.icon}
                      </div>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enlaces de navegación */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
                  NAVEGACIÓN
                </h3>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors font-medium ${
                        pathname === link.href
                          ? "text-[#002A8F] bg-blue-50"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false); // Cerrar menú al hacer clic
                      }}
                    >
                      <span className="text-xl mr-3">{link.icon}</span>
                      <span className="text-lg">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Acciones adicionales */}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/cart"
                  className={`w-full block p-4 rounded-xl font-bold text-lg text-center transition-colors shadow-lg ${
                    pathname === "/cart"
                      ? "bg-gradient-to-r from-[#1E40AF] to-[#002A8F] text-white"
                      : "bg-gradient-to-r from-[#002A8F] via-[#1E40AF] to-[#002A8F] text-white hover:shadow-xl"
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false); // Cerrar menú al hacer clic
                  }}
                >
                  <div className="flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Ver carrito ({totalItems})</span>
                  </div>
                </Link>

                <div className="mt-4 text-center text-gray-500 text-sm">
                  <p>Compra fácil y seguro por WhatsApp</p>
                  <p className="font-medium mt-1 flex items-center justify-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Sin pagos en la web
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar menú móvil */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
