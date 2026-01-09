"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductSearchProps {
  onCloseMenu?: () => void;
}

export function ProductSearch({ onCloseMenu }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Cerrar el menú lateral si estamos en móvil
    if (onCloseMenu) {
      onCloseMenu();
    }

    // Mostrar loader manualmente agregando una clase al body
    document.body.classList.add("search-loading");

    // Navegar a la página de resultados
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

    // Limpiar el campo de búsqueda
    setSearchQuery("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-10/12 sm:w-11/12 lg:w-full lg:max-w-md mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar productos por nombre..."
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002A8F]/20 focus:border-[#002A8F] bg-white shadow-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-3 py-2 bg-[#002A8F] text-white rounded-md hover:bg-[#001F5C] transition-colors"
        >
          {/* Icono: visible en mobile */}
          <Search className="h-4 w-4 sm:hidden" />

          {/* Texto: visible desde sm en adelante */}
          <span className="hidden sm:inline text-sm font-medium">Buscar</span>
        </button>
      </div>
    </form>
  );
}
