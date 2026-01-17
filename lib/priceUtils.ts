// lib/priceUtils.ts
export function calculateRoundedPrice(basePrice: number, coin: string): number {
  // Validaciones
  if (typeof basePrice !== "number" || basePrice < 0) {
    throw new Error("El precio base debe ser un número no negativo.");
  }

  const monedasValidas = ["CUP", "USD", "EUR"];
  if (!monedasValidas.includes(coin)) {
    throw new Error("La moneda debe ser CUP, USD o EUR.");
  }

  const porcentaje = 0.1; // 10%
  let montoAdicional = basePrice * porcentaje;

  // Aplicar límites según la moneda
  if (coin === "USD" || coin === "EUR") {
    if (montoAdicional > 30) {
      montoAdicional = 30;
    }
  } else if (coin === "CUP") {
    switch (true) {
      case basePrice < 500:
        montoAdicional = 50;
        break;
      case basePrice < 800 && basePrice > 500:
        montoAdicional = 100; // Ajusta este valor según necesites
        break;
      case basePrice < 1200 && basePrice > 800:
        montoAdicional = 150; // Ajusta este valor según necesites
        break;
      case basePrice < 2000 && basePrice > 1200:
        montoAdicional = 200; // Ajusta este valor según necesites
        break;
      case basePrice < 4000 && basePrice > 2000:
        montoAdicional = 500; // Ajusta este valor según necesites
        break;
      case basePrice < 8000 && basePrice > 4000:
        montoAdicional = 750; // Ajusta este valor según necesites
        break;
      case basePrice < 15000 && basePrice > 8000:
        montoAdicional = 1000; // Ajusta este valor según necesites
        break;
      case basePrice > 15000:
        montoAdicional = 2000; // Ajusta este valor según necesites
        break;
      default:
        montoAdicional = 200; // Valor por defecto para precios más altos
        break;
    }
  }

  // Precio antes del redondeo
  const precioIntermedio = basePrice + montoAdicional;

  // Redondear al múltiplo de 10 más cercano hacia arriba
  const precioFinal = Math.ceil(precioIntermedio / 10) * 10;

  return precioFinal;
}
