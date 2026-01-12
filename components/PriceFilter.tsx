// components/PriceFilter.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PriceFilterProps {
  currentSort: "asc" | "desc" | "none";
}

export function PriceFilter({ currentSort }: PriceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: "asc" | "desc" | "none") => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "none") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // Usar router.push para navegación del lado del cliente
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as any)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002A8F] focus:border-transparent cursor-pointer"
      >
        <option value="none">Ordenar por precio</option>
        <option value="asc">Menor a Mayor</option>
        <option value="desc">Mayor a Menor</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
