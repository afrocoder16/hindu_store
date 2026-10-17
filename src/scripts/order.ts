import { site } from '../config';
import { isOpenNow, pickupSlots } from '../lib/hours';
import { cartTotal, clearCart, readCart, removeFromCart, setQty } from './cart';
import type { CartLine } from './cart';

type View = 'cart' | 'checkout' | 'done';

const q = <T extends HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;

const drawer = q<HTMLElement>('[data-drawer]');
const backdrop = q<HTMLElement>('[data-backdrop]');
const views = Object.fromEntries(
  (['cart', 'checkout', 'done'] as View[]).map((v) => [v, q<HTMLElement>(`[data-view="${v}"]`)]),
) as Record<View, HTMLElement>;
const form = views.checkout as HTMLFormElement;

const money = (n: number) => `${site.currency}${n.toFixed(2)}`;
const cashTag = site.cashTag.trim().replace(/^\$/, '');

let lastFocus: HTMLElement | null = null;

/* ---------- drawer open/close ---------- */

function show(view: View) {
  (Object.keys(views) as View[]).forEach((v) => (views[v].hidden = v !== view));
  q('.drawer-body', views[view]).scrollTop = 0;
}

function openDrawer(view: View = 'cart') {
  lastFocus = document.activeElement as HTMLElement | null;
  renderCart();
  show(view);
  drawer.dataset.open = 'true';
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.dataset.open = 'true';
  document.body.dataset.locked = 'true';
  q<HTMLButtonElement>('[data-close-cart]', drawer).focus();
}

function closeDrawer() {
  drawer.dataset.open = 'false';
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.dataset.open = 'false';
  delete document.body.dataset.locked;
  lastFocus?.focus();
}

document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  if (t.closest('[data-open-cart]')) openDrawer();
  else if (t.closest('[data-close-cart]')) closeDrawer();
});
backdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.dataset.open === 'true') closeDrawer();
});

/* ---------- step 1: cart ---------- */

function lineEl(l: CartLine) {
  const li = document.createElement('li');
  li.className = 'line';
  li.dataset.id = l.id;

  const img = document.createElement('img');
  img.src = l.image;
  img.alt = '';
  img.width = 64;
  img.height = 64;

  const info = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'line-name';
  name.textContent = l.name;
  const unit = document.createElement('div');
  unit.className = 'muted';
  unit.textContent = `${money(l.price)} each`;

  const controls = document.createElement('div');
  controls.className = 'line-controls';
  const qty = document.createElement('div');
  qty.className = 'qty';
  const mk = (txt: string, act: string, label: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = txt;
    b.dataset.act = act;
    b.setAttribute('aria-label', `${label} ${l.name}`);
    return b;
  };
  const num = document.createElement('input');
  num.type = 'number';
  num.min = '1';
  num.max = '99';
  num.value = String(l.qty);
  num.dataset.act = 'set';
  num.setAttribute('aria-label', `${l.name} quantity`);
  qty.append(mk('−', 'dec', 'Decrease'), num, mk('+', 'inc', 'Increase'));
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'linkish';
  remove.textContent = 'Remove';
  remove.dataset.act = 'remove';
  controls.append(qty, remove);
  info.append(name, unit, controls);

  const total = document.createElement('div');
  total.className = 'line-total';
  total.textContent = money(l.price * l.qty);

  li.append(img, info, total);
  return li;
}

function renderCart() {
  const lines = readCart();
  const hasItems = lines.length > 0;
  q('[data-empty]').hidden = hasItems;
  q('[data-cart-foot]').hidden = !hasItems;
  q('[data-lines]').replaceChildren(...lines.map(lineEl));
  q('[data-subtotal]').textContent = money(cartTotal(lines));
  if (views.checkout && !views.checkout.hidden) renderSummary();
}

q('[data-lines]').addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const act = t.dataset.act;
  const id = t.closest<HTMLElement>('.line')?.dataset.id;
  if (!act || !id) return;
  const line = readCart().find((l) => l.id === id);
  if (!line) return;
  if (act === 'inc') setQty(id, line.qty + 1);
  if (act === 'dec') (line.qty > 1 ? setQty(id, line.qty - 1) : removeFromCart(id));
  if (act === 'remove') removeFromCart(id);
});

q('[data-lines]').addEventListener('change', (e) => {
  const input = e.target as HTMLInputElement;
  const id = input.closest<HTMLElement>('.line')?.dataset.id;
  if (input.dataset.act === 'set' && id) setQty(id, Number(input.value));
});

window.addEventListener('cart:change', () => {
  if (drawer.dataset.open === 'true' && views.done.hidden) renderCart();
});

/* ---------- step 2: checkout ---------- */

const slotSelect = q<HTMLSelectElement>('[data-slot]');
const asapRadio = q<HTMLInputElement>('[data-when-asap]');

const field = (name: string) => form.elements.namedItem(name) as RadioNodeList | HTMLInputElement;
const radioValue = (name: string) => (field(name) as RadioNodeList).value;

function prepareCheckout() {
  const slots = pickupSlots();
  slotSelect.replaceChildren(
    ...slots.map((s) => {
      const o = document.createElement('option');
      o.value = s.value;
      o.textContent = s.label;
      return o;
    }),
  );
  const open = isOpenNow();
  asapRadio.disabled = !open;
  q('[data-asap-note]').textContent = open ? `About ${site.prepMinutes} min` : 'We are closed right now';
  if (!open) (form.querySelector('input[name="when"][value="later"]') as HTMLInputElement).checked = true;
  syncWhen();
  renderSummary();
}

function syncWhen() {
  slotSelect.hidden = radioValue('when') !== 'later';
}

function totals() {
  const subtotal = cartTotal();
  const tax = Math.round(subtotal * site.taxRate * 100) / 100;
  const tipPct = Number(radioValue('tip')) || 0;
  const tip = Math.round(subtotal * (tipPct / 100) * 100) / 100;
  return { subtotal, tax, tip, total: Math.round((subtotal + tax + tip) * 100) / 100 };
}

function renderSummary() {
  const t = totals();
  q('[data-s-subtotal]').textContent = money(t.subtotal);
  q('[data-tax-row]').hidden = t.tax <= 0;
  q('[data-s-tax]').textContent = money(t.tax);
  q('[data-tip-row]').hidden = t.tip <= 0;
  q('[data-s-tip]').textContent = money(t.tip);
  q('[data-s-total]').textContent = money(t.total);
  q('[data-place]').textContent = `Place order · ${money(t.total)}`;
}

q('[data-go-checkout]').addEventListener('click', () => {
  if (readCart().length === 0) return;
  show('checkout');
  prepareCheckout();
});
q('[data-back-cart]').addEventListener('click', () => show('cart'));
form.addEventListener('change', () => {
  syncWhen();
  renderSummary();
});

/* ---------- step 3: place order ---------- */

const ORDER_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function orderNumber() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return 'HS-' + Array.from(bytes, (b) => ORDER_CHARS[b % ORDER_CHARS.length]).join('');
}

interface Order {
  no: string;
  fulfillment: string;
  when: string;
  name: string;
  phone: string;
  notes: string;
  payment: 'counter' | 'cashapp';
  lines: CartLine[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

function orderText(o: Order) {
  const rows = o.lines.map((l) => `- ${l.qty} x ${l.name} (${money(l.price * l.qty)})`);
  return [
    `New order ${o.no} for ${site.name}`,
    '',
    `${o.fulfillment}, ${o.when}`,
    '',
    ...rows,
    '',
    `Subtotal: ${money(o.subtotal)}`,
    ...(o.tax > 0 ? [`Tax: ${money(o.tax)}`] : []),
    ...(o.tip > 0 ? [`Tip: ${money(o.tip)}`] : []),
    `Total: ${money(o.total)}`,
    `Payment: ${o.payment === 'cashapp' ? 'Cash App (customer will pay after ordering)' : 'Pay at the counter'}`,
    '',
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    ...(o.notes ? [`Notes: ${o.notes}`] : []),
  ].join('\n');
}

interface SendResult {
  status: string;
  /** True when the customer still has to send the order themselves and needs to see the text. */
  showText: boolean;
}

async function sendOrder(text: string, no: string): Promise<SendResult> {
  if (site.whatsapp) {
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    return { status: 'WhatsApp opened with your order. Send the message to finish placing it.', showText: true };
  }
  if (site.email) {
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`New order ${no}`)}&body=${encodeURIComponent(text)}`;
    return { status: 'Your email app opened with your order. Send the email to finish placing it.', showText: true };
  }
  try {
    await navigator.clipboard.writeText(text);
    return { status: `Your order is copied but not sent yet. Paste it into a message to us, or call ${site.phoneDisplay}.`, showText: true };
  } catch {
    return { status: `Your order has not been sent. Copy the details below and send them to us, or call ${site.phoneDisplay}.`, showText: true };
  }
}

async function showDone(o: Order, result: SendResult, text: string) {
  q('[data-order-no]').textContent = o.no;
  q('[data-order-meta]').textContent = `${o.fulfillment}, ${o.when}. Total ${money(o.total)}.`;
  const payLine = q('[data-pay-line]');
  const box = q('[data-cash-box]');
  box.hidden = true;

  if (o.payment === 'cashapp' && cashTag) {
    payLine.textContent = 'Last step: pay with Cash App so we can start your order.';
    const link = `https://cash.app/$${cashTag}/${o.total.toFixed(2)}`;
    q<HTMLAnchorElement>('[data-cash-link]').href = link;
    q('[data-cash-note]').textContent = o.no;
    const qr = q<HTMLImageElement>('[data-cash-qr]');
    qr.hidden = true;
    box.hidden = false;
    try {
      const QRCode = (await import('qrcode')).default;
      qr.src = await QRCode.toDataURL(link, { margin: 1, width: 352 });
      qr.hidden = false;
    } catch {
      // The button still works without the QR code.
    }
  } else {
    payLine.textContent = `Pay at the counter when you ${o.fulfillment === 'Dine-in' ? 'order' : 'pick up'}. Tell us your order number.`;
  }
  q('[data-send-status]').textContent = result.status;
  q('[data-order-text-wrap]').hidden = !result.showText;
  q<HTMLTextAreaElement>('[data-order-text]').value = text;
  show('done');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const lines = readCart();
  if (lines.length === 0) return;
  if (!form.reportValidity()) return;

  const fd = new FormData(form);
  const t = totals();
  const payment = fd.get('payment') === 'cashapp' && cashTag ? 'cashapp' : 'counter';
  const order: Order = {
    no: orderNumber(),
    fulfillment: String(fd.get('fulfillment')),
    when: fd.get('when') === 'later' ? String(fd.get('slot')) : `ASAP (about ${site.prepMinutes} min)`,
    name: String(fd.get('name')).trim(),
    phone: String(fd.get('phone')).trim(),
    notes: String(fd.get('notes') ?? '').trim(),
    payment,
    lines,
    ...t,
  };

  const text = orderText(order);
  const result = await sendOrder(text, order.no);
  clearCart();
  form.reset();
  await showDone(order, result, text);
});

renderCart();
