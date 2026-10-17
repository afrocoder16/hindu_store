export function formatPrice(amount: number, currency = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}
