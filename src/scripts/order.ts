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
  const rows = o.lines.map((l) => `${l.qty} x ${l.name}`);
  const extras = [
    ...(o.tax > 0 ? [`Tax ${money(o.tax)}`] : []),
    ...(o.tip > 0 ? [`Tip ${money(o.tip)}`] : []),
  ];
  return [
    `${site.name.toUpperCase()} ORDER ${o.no}`,
    `${o.fulfillment}, ${o.when}`,
    '',
    ...rows,
    '',
    `Total ${money(o.total)}${extras.length ? ` (incl. ${extras.join(', ')})` : ''}`,
    `Pay: ${o.payment === 'cashapp' ? 'Cash App' : 'at the counter'}`,
    '',
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    ...(o.notes ? [`Notes: ${o.notes}`] : []),
  ].join('\n');
}

/** `?&body=` works on both iOS and Android messaging apps. */
const smsLink = (text: string) => `sms:${site.smsNumber}?&body=${encodeURIComponent(text)}`;

const isPhone = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

async function qrFor(img: HTMLImageElement, wrap: HTMLElement, data: string) {
  wrap.hidden = true;
  try {
    const QRCode = (await import('qrcode')).default;
    img.src = await QRCode.toDataURL(data, { margin: 1, width: 320, errorCorrectionLevel: 'M' });
    wrap.hidden = false;
  } catch (err) {
    // The buttons still work without the QR code.
    console.warn('QR code failed', err);
  }
}

async function showDone(o: Order, text: string) {
  q('[data-order-no]').textContent = o.no;
  q('[data-order-meta]').textContent = `${o.fulfillment}, ${o.when}. Total ${money(o.total)}.`;

  const sms = smsLink(text);
  q<HTMLAnchorElement>('[data-sms-link]').href = sms;
  q('[data-send-status]').textContent = isPhone()
    ? 'Your messages app should have opened. Press send to place the order.'
    : `Open this on your phone, or call us at ${site.phoneDisplay}.`;
  void qrFor(q<HTMLImageElement>('[data-sms-qr]'), q('[data-sms-qr-wrap]'), sms);

  const copyBtn = q<HTMLButtonElement>('[data-copy-order]');
  copyBtn.textContent = 'Copy order text';
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied. Paste it in a text to us.';
    } catch {
      copyBtn.textContent = 'Could not copy. Select the text from the QR step.';
    }
  };

  const cashBox = q('[data-cash-box]');
  cashBox.hidden = true;
  q('[data-cash-qr-wrap]').hidden = true;
  if (o.payment === 'cashapp' && cashTag) {
    q('[data-pay-title]').textContent = 'Pay with Cash App';
    q('[data-pay-line]').textContent = `Tap to open Cash App with ${money(o.total)} filled in (to $${cashTag}).`;
    const link = `https://cash.app/$${cashTag}/${o.total.toFixed(2)}`;
    q<HTMLAnchorElement>('[data-cash-link]').href = link;
    q('[data-cash-link]').textContent = `Pay ${money(o.total)} with Cash App`;
    q('[data-cash-note]').textContent = o.no;
    cashBox.hidden = false;
    void qrFor(q<HTMLImageElement>('[data-cash-qr]'), q('[data-cash-qr-wrap]'), link);
  } else {
    q('[data-pay-title]').textContent = 'Pay at the counter';
    q('[data-pay-line]').textContent = `Pay with cash or card when you ${o.fulfillment === 'Dine-in' ? 'order' : 'pick up'}. Tell us your order number, ${o.no}.`;
  }

  show('done');
  // On a phone, open the pre-filled text right away. Desktops show the QR code and buttons instead.
  if (isPhone()) window.location.href = sms;
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
  clearCart();
  form.reset();
  await showDone(order, text);
});

renderCart();
