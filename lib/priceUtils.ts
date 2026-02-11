// lib/priceUtils.ts
export function calculateRoundedPrice(
  basePrice: number,
  coin: string,
  comision: number,
): number {
  // --- Validación de basePrice ---
  if (
    typeof basePrice !== "number" ||
    Number.isNaN(basePrice) ||
    !Number.isFinite(basePrice) ||
    basePrice < 0
  ) {
    throw new Error(
      "El precio base debe ser un número válido no negativo (no NaN, no infinito).",
    );
  }

  // --- Validación de comision ---
  if (
    typeof comision !== "number" ||
    Number.isNaN(comision) ||
    !Number.isFinite(comision) ||
    comision < 0
  ) {
    throw new Error(
      "La comisión debe ser un número válido no negativo (no NaN, no infinito).",
    );
  }

  // --- Validación de moneda ---
  const monedasValidas = ["CUP", "USD", "EUR"];
  if (!monedasValidas.includes(coin)) {
    throw new Error("La moneda debe ser CUP, USD o EUR.");
  }

  // --- Si hay comisión, se aplica descuento directo y se omite el redondeo ---
  if (comision !== 0) {
    const precioIntermedio = basePrice - comision / 2;
    // Redondear al múltiplo de 10 más cercano hacia arriba
    const precioFinal = Math.ceil(precioIntermedio / 10) * 10;

    return precioFinal;
  }

  // --- Sin comisión: se calcula el 10% y se aplican límites por moneda ---
  const porcentaje = 0.1; // 10%
  let montoAdicional = basePrice * porcentaje;

  // Límites según moneda
  if (coin === "USD" || coin === "EUR") {
    if (montoAdicional > 10) {
      montoAdicional = 10;
    }
  } else if (coin === "CUP") {
    switch (true) {
      case basePrice < 500:
        montoAdicional = 50;
        break;
      case basePrice < 800 && basePrice > 500:
        montoAdicional = 100;
        break;
      case basePrice < 1200 && basePrice > 800:
        montoAdicional = 150;
        break;
      case basePrice < 2000 && basePrice > 1200:
        montoAdicional = 200;
        break;
      case basePrice < 4000 && basePrice > 2000:
        montoAdicional = 500;
        break;
      case basePrice < 8000 && basePrice > 4000:
        montoAdicional = 750;
        break;
      case basePrice < 15000 && basePrice > 8000:
        montoAdicional = 1000;
        break;
      case basePrice > 15000:
        montoAdicional = 2000;
        break;
      default:
        montoAdicional = 200; // valor por defecto
        break;
    }
  }

  // Precio antes del redondeo
  const precioIntermedio = basePrice + montoAdicional;

  // Redondear al múltiplo de 10 más cercano hacia arriba
  const precioFinal = Math.ceil(precioIntermedio / 10) * 10;

  return precioFinal;
}
