// components/PriceFilter.tsx
"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

type SortOrder = "asc" | "desc" | "none";

interface PriceFilterProps {
  onSortChange: (order: SortOrder) => void;
  currentSort: SortOrder;
}

export function PriceFilter({ onSortChange, currentSort }: PriceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (order: SortOrder) => {
    onSortChange(order);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-700">Ordenar por precio</span>
        {currentSort === "asc" ? (
          <ArrowUp className="h-4 w-4 text-[#002A8F]" />
        ) : currentSort === "desc" ? (
          <ArrowDown className="h-4 w-4 text-[#002A8F]" />
        ) : null}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
          <div className="py-1">
            <button
              onClick={() => handleSort("asc")}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 ${
                currentSort === "asc"
                  ? "bg-blue-50 text-[#002A8F]"
                  : "text-gray-700"
              }`}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Precio: Menor a Mayor
            </button>
            <button
              onClick={() => handleSort("desc")}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 ${
                currentSort === "desc"
                  ? "bg-blue-50 text-[#002A8F]"
                  : "text-gray-700"
              }`}
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Precio: Mayor a Menor
            </button>
            <button
              onClick={() => handleSort("none")}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 ${
                currentSort === "none"
                  ? "bg-blue-50 text-[#002A8F]"
                  : "text-gray-700"
              }`}
            >
              Sin orden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
