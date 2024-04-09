export function compactNumber(input: number | string, decimalPlaces: number = 2): string {
  const num = typeof input === "string" ? parseFloat(input) : input;

  if (isNaN(num)) return "-";
  else if (num === 0) return "0";

  if (num >= 1.0e12) {
    return (num / 1.0e9).toFixed(decimalPlaces) + "T";
  } else if (num >= 1.0e9) {
    return (num / 1.0e9).toFixed(decimalPlaces) + "B";
  } else if (num >= 1.0e6) {
    return (num / 1.0e6).toFixed(decimalPlaces) + "M";
  } else if (num >= 1.0e3) {
    return (num / 1.0e3).toFixed(decimalPlaces) + "K";
  } else if (num >= 1) {
    return num.toFixed(decimalPlaces);
  } else if (num >= 1e-1) {
    return num.toFixed(Math.max(3, decimalPlaces));
  } else if (num >= 1e-2) {
    return num.toFixed(Math.max(4, decimalPlaces));
  } else if (num >= 1e-3) {
    return num.toFixed(Math.max(5, decimalPlaces));
  } else if (num >= 1e-4) {
    return num.toFixed(Math.max(6, decimalPlaces));
  } else if (num >= 1e-5) {
    return num.toFixed(Math.max(7, decimalPlaces));
  }
  return "~0.0";
}
