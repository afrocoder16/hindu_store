import { priceVaries } from '../data/products';
import type { Product } from '../data/products';

export function formatPrice(amount: number, currency = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/** "$1.75", or "from $9.99" when the sizes cost different amounts. */
export function priceLabel(p: Product, currency = '$'): string {
  return `${priceVaries(p) ? 'from ' : ''}${formatPrice(p.price, currency)}`;
}
