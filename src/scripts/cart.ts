export interface CartLine {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

// Bump the version when menu ids or prices change, so old saved carts are dropped.
const KEY = 'hindi-store-cart-v2';
const MAX_QTY = 99;

export function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Storage can be blocked (private mode); the cart just won't persist.
  }
  window.dispatchEvent(new CustomEvent('cart:change', { detail: lines }));
}

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n) || 1));

export function addToCart(item: Omit<CartLine, 'qty'>, qty = 1) {
  const lines = readCart();
  const existing = lines.find((l) => l.id === item.id);
  if (existing) existing.qty = clampQty(existing.qty + qty);
  else lines.push({ ...item, qty: clampQty(qty) });
  writeCart(lines);
}

export function setQty(id: string, qty: number) {
  writeCart(readCart().map((l) => (l.id === id ? { ...l, qty: clampQty(qty) } : l)));
}

export function removeFromCart(id: string) {
  writeCart(readCart().filter((l) => l.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export const cartCount = (lines = readCart()) => lines.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (lines = readCart()) => lines.reduce((n, l) => n + l.qty * l.price, 0);
