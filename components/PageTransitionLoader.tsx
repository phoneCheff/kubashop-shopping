"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const currentOrigin = window.location.origin;
        const linkOrigin = new URL(link.href).origin;

        if (linkOrigin === currentOrigin) {
          setIsLoading(true);
          // También remover la clase de búsqueda si existe
          document.body.classList.remove("search-loading");
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  useEffect(() => {
    // Cuando la ruta cambia, remover la clase de búsqueda
    document.body.classList.remove("search-loading");
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 mb-4">
              <motion.div
                className="w-full h-full rounded-full border-3 border-solid"
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
