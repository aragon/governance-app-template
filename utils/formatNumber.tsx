export function formatLargeNumber(input: number | string, decimalPlaces: number = 2): string {
    const num = typeof input === 'string' ? parseFloat(input) : input;
  
    if (isNaN(num)) return "Invalid number";
  
    if (num >= 1.0e+9) {
      return (num / 1.0e+9).toFixed(decimalPlaces) + 'B';
    } else if (num >= 1.0e+6) {
      return (num / 1.0e+6).toFixed(decimalPlaces) + 'M';
    } else if (num >= 1.0e+3) {
      return (num / 1.0e+3).toFixed(decimalPlaces) + 'K';
    } else {
      return num.toFixed(decimalPlaces);
    }
  }