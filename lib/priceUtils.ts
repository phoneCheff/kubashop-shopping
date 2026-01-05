// lib/priceUtils.ts
export function calculateRoundedPrice(basePrice: number): number {
  const withMargin = basePrice * 1.1;
  const roundedPrice = Math.round(withMargin); // ✅ ahora usamos redondeo, no floor
  const lastDigit = roundedPrice % 10;

  if (lastDigit <= 4) {
    return roundedPrice - lastDigit + 5;
  } else {
    return roundedPrice - lastDigit + 10;
  }
}
