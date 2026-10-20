import type { Product } from '../data/products';

export function formatPrice(amount: number, currency = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/** "$1.75", or "from $9.99" when the product comes in sizes. */
export function priceLabel(p: Product, currency = '$'): string {
  return `${p.sizes ? 'from ' : ''}${formatPrice(p.price, currency)}`;
}
