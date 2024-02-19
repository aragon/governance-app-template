export function formatLargeNumber(
  input: number | string,
  decimalPlaces: number = 2
): string {
  const num = typeof input === "string" ? parseFloat(input) : input;

  if (isNaN(num)) return "-";

  if (num >= 1.0e9) {
    return (num / 1.0e9).toFixed(decimalPlaces) + "B";
  } else if (num >= 1.0e6) {
    return (num / 1.0e6).toFixed(decimalPlaces) + "M";
  } else if (num >= 1.0e3) {
    return (num / 1.0e3).toFixed(decimalPlaces) + "K";
  } else {
    return num.toFixed(decimalPlaces);
  }
}
