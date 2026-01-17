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
    if (montoAdicional > 100) {
      montoAdicional = 100;
    }
  }

  // Precio antes del redondeo
  const precioIntermedio = basePrice + montoAdicional;

  // Redondear al múltiplo de 10 más cercano hacia arriba
  const precioFinal = Math.ceil(precioIntermedio / 10) * 10;

  return precioFinal;
}
