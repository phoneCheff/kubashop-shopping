// app/layout.tsx (agregar el proveedor)
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KubaShop ",
  description: "Tienda online con productos de diferentes vendedores",
  icons: {
    icon: "/icon.ico", // ← apunta a tu archivo
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Favicon clásico */}
        <link rel="icon" href="/icon.ico" sizes="any" />
        {/* Favicon SVG (opcional, moderno) */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="32x32"
        />
        {/* Theme color (opcional) */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-title" content="KubaShop" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
