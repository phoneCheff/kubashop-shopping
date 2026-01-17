"use client";

import { useCart } from "@/components/CartProvider";
import { KSText, KubaShopText } from "@/components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES } from "./NavBarData";
import { ProductSearch } from "./ProductSearch";

// Optimización: mover datos estáticos fuera del componente
const NAV_LINKS = [{ name: "Inicio", href: "/", icon: "🏠" }];

export function Navbar() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const pathname = usePathname();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // ✅ CORREGIDO: valor inicial null

  // Optimización: memoizar cálculo de total items
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Optimización: debounce para scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(window.scrollY > 10);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Optimización: mejor manejo de click fuera
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

    // Usar evento capture para mejor performance
    document.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
  }, []);

  // Optimización: useCallback para handlers
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleCategories = useCallback(() => {
    setIsCategoriesOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Optimización: memoizar elementos JSX que no cambian frecuentemente
  const desktopNavLinks = useMemo(
    () =>
      NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            pathname === link.href
              ? "bg-blue-50 text-[#002A8F] shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          prefetch={false} // Optimización: no prefetchear rutas innecesarias
        >
          <span className="mr-1">{link.icon}</span>
          {link.name}
        </Link>
      )),
    [pathname]
  );

  const mobileCategories = useMemo(
    () =>
      CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${cat.color} ${cat.hoverColor} hover:scale-105 hover:shadow-lg`}
          onClick={closeMenu}
          prefetch={false}
        >
          <div className="text-3xl mb-2 md:text-2xl">{cat.icon}</div>
          <span className="font-medium text-sm">{cat.name}</span>
        </Link>
      )),
    [closeMenu]
  );

  const desktopCategories = useMemo(
    () =>
      CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          onMouseEnter={() => setActiveCategory(cat.slug)}
          onMouseLeave={() => setActiveCategory(null)}
          className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all ${
            activeCategory === cat.slug || pathname === `/category/${cat.slug}`
              ? `${cat.color} rounded-lg`
              : "text-gray-700 hover:bg-gray-50"
          }`}
          prefetch={false}
        >
          <span className="mr-3">{cat.icon}</span>
          {cat.name}
        </Link>
      )),
    [activeCategory, pathname]
  );

  return (
    <>
      {/* Navbar principal */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : "bg-white/80 backdrop-blur-md py-3 border-b border-gray-100"
        } supports-[position:sticky]:sticky`}
        style={{ transform: "translateZ(0)" }} // Hardware acceleration
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" aria-label="Logo Home page" prefetch={false}>
                <div className="relative w-20 h-20 md:w-20 md:h-20 flex-shrink-0">
                  <Image
                    src="/logo/logo.avif"
                    alt="KubaShop"
                    fill
                    sizes="(max-width: 768px) 48px, 56px"
                    priority={true}
                    className="object-contain"
                    quality={100}
                    style={{ transform: "translateZ(0)" }}
                  />
                </div>
                {/* <LogoCart className="w-30 h-16" /> */}
              </Link>
              <Link
                href="/"
                aria-label="Logo Home page"
                className="hidden sm:block"
                prefetch={false}
              >
                <KubaShopText className="h-8 md:h-10" />
              </Link>
              <Link
                href="/"
                aria-label="Logo Home page"
                className="sm:hidden ml-8"
                prefetch={false}
              >
                <KSText className="h-8 md:h-10 ml-8" />
              </Link>
            </div>

            {/* Navegación desktop */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {desktopNavLinks}

              {/* Dropdown de categorías desktop */}
              <div className="relative categories-dropdown">
                <button
                  onClick={toggleCategories}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isCategoriesOpen ||
                    activeCategory ||
                    pathname?.startsWith("/category/")
                      ? "bg-blue-50 text-[#002A8F] shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  aria-expanded={isCategoriesOpen}
                  aria-label="Categorías"
                >
                  <span>🛒</span>
                  <span className="ml-1 mr-1">Categorías</span>
                  {isCategoriesOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {desktopCategories}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
              <ProductSearch />
            </div>

            {/* Acciones de usuario */}
            <div className="flex items-center space-x-2">
              {/* Botón de carrito */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                aria-label="Carrito de compras"
                prefetch={false}
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-800 group-hover:text-[#002A8F] transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
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

              {/* Botón menú móvil */}
              <button
                onClick={toggleMenu}
                className="md:hidden mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMenuOpen}
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

      {/* Menú móvil */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="md:hidden fixed inset-y-0 right-0 w-full max-w-sm z-40 bg-white shadow-xl"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
                <button
                  onClick={closeMenu}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6 px-1 mt-1">
                <ProductSearch onCloseMenu={closeMenu} />
              </div>

              <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-70px)]">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
                    NUESTRAS CATEGORÍAS
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mobileCategories}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
                    NAVEGACIÓN
                  </h3>
                  <div className="space-y-2">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors font-medium ${
                          pathname === link.href
                            ? "text-[#002A8F] bg-blue-50"
                            : "text-gray-700"
                        }`}
                        onClick={closeMenu}
                        prefetch={false}
                      >
                        <span className="text-xl mr-3">{link.icon}</span>
                        <span className="text-lg">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href="/cart"
                    className={`w-full block p-4 rounded-xl font-bold text-lg text-center transition-colors shadow-lg ${
                      pathname === "/cart"
                        ? "bg-gradient-to-r from-[#1E40AF] to-[#002A8F] text-white"
                        : "bg-gradient-to-r from-[#002A8F] via-[#1E40AF] to-[#002A8F] text-white hover:shadow-xl"
                    }`}
                    onClick={closeMenu}
                    prefetch={false}
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

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black z-30 md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
