// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#002A8F] text-white font-medium rounded-lg hover:bg-[#001F5C] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
