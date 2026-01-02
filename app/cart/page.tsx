// app/cart/page.tsx
"use client";

import { useCart } from "@/components/CartProvider";
import NoImagePlaceholder from "@/components/NoImagePlaceholder"; // Ajusta la ruta si es necesario
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Smartphone, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, clearCart, myPhone } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Función para calcular precio con +10%
  const calculatePrice = (item: any) => {
    return item.price + (item.price * 10) / 100;
  };

  // 🧮 Agrupar por moneda (item.coin)
  const groupedByCoin = items.reduce((acc, item) => {
    const coin = item.coin || "USD";
    if (!acc[coin]) {
      acc[coin] = { items: [], subtotal: 0 };
    }
    const priceWithMargin = calculatePrice(item);
    const lineTotal = priceWithMargin * item.quantity;
    acc[coin].items.push({ ...item, priceWithMargin });
    acc[coin].subtotal += lineTotal;
    return acc;
  }, {} as Record<string, { items: typeof items; subtotal: number }>);

  // ✉️ Generar mensaje de WhatsApp con todas las monedas
  const generateWhatsAppMessage = () => {
    let message = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";

    Object.entries(groupedByCoin).forEach(([coin, group]) => {
      message += `--- Productos en ${coin} ---\n`;
      group.items.forEach((item) => {
        message += `- ${item.name} x${
          item.quantity
        } → ${item.priceWithMargin.toFixed(2)} ${coin}\n`;
      });
      message += `\nSubtotal en ${coin}: ${group.subtotal.toFixed(
        2
      )} ${coin}\n\n`;
    });

    message += "Gracias.";
    return `https://wa.me/${
      myPhone || "TU_NUMERO_DE_WHATSAPP"
    }?text=${encodeURIComponent(message)}`;
  };

  const whatsappLink = generateWhatsAppMessage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-6">
            Parece que no has agregado ningún producto aún. ¡Explora nuestras
            categorías y encuentra algo que te guste!
          </p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-lg shadow-md">
              Ir a inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    setIsLoading(true);
    clearCart();
    setTimeout(() => {
      window.location.href = whatsappLink;
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-center justify-center">
      <div className="container py-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-800 ml-2">Mi carrito</h1>
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-500 hover:bg-red-50 text-sm"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Vaciar todo
            </Button>
          )}
        </div>

        {/* 🔄 Mostrar cada grupo de moneda */}
        {Object.entries(groupedByCoin).map(([coin, group]) => (
          <Card
            key={coin}
            className="mb-5 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">Productos en {coin}</h2>
                <span className="text-emerald-700 font-bold text-xl">
                  {group.subtotal.toFixed(2)} {coin}
                </span>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="object-cover w-full h-full"
                          // Opcional: manejar error si quieres ocultar la imagen rota
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <NoImagePlaceholder />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 uppercase mt-2">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-emerald-700 font-bold text-sm">
                          {item.priceWithMargin.toFixed(2)} {coin} ×{" "}
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* Información de entrega */}
        <Card className="mb-5 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center">
              <Smartphone className="h-5 w-5 text-green-500 mr-2" />
              Información de entrega
            </h2>
            <p className="text-gray-600 text-sm">
              Al hacer clic en Enviar por WhatsApp, tu pedido se enviará al
              vendedor para coordinar:
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Confirmación del pedido</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Métodos de pago por moneda</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Entrega o recogida</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Botón de WhatsApp */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40 flex items-center justify-center">
          <div className="container">
            <Button
              onClick={handleWhatsAppClick}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span> Enviando
                  pedido...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Enviar por WhatsApp
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
