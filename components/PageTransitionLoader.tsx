"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // ✅ CORREGIDO
  // Optimización: debounce para activar loader
  const handleLinkClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (link && link.href) {
      const currentOrigin = window.location.origin;
      const linkOrigin = new URL(link.href).origin;
      const currentPath = window.location.pathname + window.location.search;
      const linkPath = new URL(link.href).pathname + new URL(link.href).search;

      if (linkOrigin === currentOrigin && currentPath !== linkPath) {
        // Delay pequeño para evitar flash en navegación rápida
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsLoading(true);
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleLinkClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleLinkClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleLinkClick]);

  // Optimización: efecto de limpieza más eficiente
  useEffect(() => {
    setIsLoading(false);
    document.body.classList.remove("search-loading");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          style={{
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 mb-4">
              <motion.div
                className="absolute top-0 left-0 w-full h-full rounded-full border-3 border-solid"
                style={{
                  borderColor: "#002A8F transparent transparent transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            <p className="text-sm font-medium text-gray-600">Cargando...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
