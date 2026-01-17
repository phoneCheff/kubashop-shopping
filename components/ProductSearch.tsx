"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useRef, useState } from "react";

interface ProductSearchProps {
  onCloseMenu?: () => void;
}

export const ProductSearch = memo(function ProductSearch({
  onCloseMenu,
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Optimización: useCallback para evitar recreación
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      // Cerrar el menú lateral si estamos en móvil
      onCloseMenu?.();

      // Mostrar loader manualmente
      document.body.classList.add("search-loading");

      // Navegar a la página de resultados
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);

      // Limpiar el campo de búsqueda
      setSearchQuery("");
    },
    [searchQuery, onCloseMenu, router]
  );

  // Optimización: handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleSearch}
      className="relative w-10/12 sm:w-11/12 lg:w-full lg:max-w-md mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos por nombre..."
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002A8F]/20 focus:border-[#002A8F] bg-white shadow-sm"
          aria-label="Buscar productos"
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-3 py-2 bg-[#002A8F] text-white rounded-md hover:bg-[#001F5C] transition-colors"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline text-sm font-medium">Buscar</span>
        </button>
      </div>
    </form>
  );
});
