import { site } from '../config';
import { CLOSE_MIN, OPEN_MIN, formatClock, isOpenNow } from '../lib/hours';
import { addToCart, cartCount, cartTotal, readCart, removeFromCart, setQty } from './cart';

const money = (n: number) => `${site.currency}${n.toFixed(2)}`;

/* ---------- live open/closed status ---------- */

function renderStatus() {
  const open = isOpenNow();
  const pill = document.querySelector<HTMLElement>('[data-status]');
  if (pill) {
    pill.dataset.open = String(open);
    pill.textContent = open ? `Open now, until ${formatClock(CLOSE_MIN)}` : `Closed now, opens ${formatClock(OPEN_MIN)}`;
  }
  document.querySelectorAll<HTMLElement>('[data-neon]').forEach((neon) => {
    neon.dataset.state = open ? 'open' : 'closed';
    const word = neon.querySelector('[data-neon-word]');
    const sub = neon.querySelector('[data-neon-sub]');
    if (word) word.textContent = open ? 'OPEN' : 'CLOSED';
    if (sub) sub.textContent = open ? `until ${formatClock(CLOSE_MIN)}` : `opens ${formatClock(OPEN_MIN)}`;
  });
}
renderStatus();
setInterval(renderStatus, 60_000);

/* ---------- scroll reveal ---------- */

const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

/* ---------- toast ---------- */

const toast = document.querySelector<HTMLElement>('[data-toast]');
let toastTimer: number | undefined;
function showToast(msg: string) {
  if (!toast) return;
  toast.textContent = msg;
  toast.dataset.show = 'true';
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toast.dataset.show = 'false'), 2200);
}

/* ---------- cart UI sync ---------- */

function renderCartUi() {
  const lines = readCart();
  const n = cartCount(lines);

  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
  });

  const bar = document.querySelector<HTMLElement>('[data-cartbar]');
  if (bar) {
    bar.hidden = n === 0;
    document.body.dataset.hasCart = String(n > 0);
    const c = bar.querySelector('[data-cartbar-count]');
    const t = bar.querySelector('[data-cartbar-total]');
    if (c) c.textContent = String(n);
    if (t) t.textContent = money(cartTotal(lines));
  }

  document.querySelectorAll<HTMLElement>('[data-add-area]').forEach((area) => {
    const qty = lines.find((l) => l.id === area.dataset.id)?.qty ?? 0;
    const btn = area.querySelector<HTMLElement>('[data-add]');
    const stepper = area.querySelector<HTMLElement>('[data-stepper]');
    if (btn) btn.hidden = qty > 0;
    if (stepper) {
      stepper.hidden = qty === 0;
      const label = stepper.querySelector('[data-qty]');
      if (label) label.textContent = String(qty);
    }
  });
}

function bump() {
  document.querySelectorAll<HTMLElement>('.icon-btn[data-open-cart]').forEach((el) => {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  const add = target.closest<HTMLButtonElement>('[data-add]');
  if (add) {
    const qtyInput = add.dataset.qtyInput ? document.querySelector<HTMLInputElement>(add.dataset.qtyInput) : null;
    const qty = qtyInput ? Number(qtyInput.value) || 1 : 1;
    addToCart(
      { id: add.dataset.id!, name: add.dataset.name!, price: Number(add.dataset.price), image: add.dataset.image! },
      qty,
    );
    showToast(`Added ${add.dataset.name}`);
    bump();
    return;
  }

  const step = target.closest<HTMLButtonElement>('[data-step][data-id]');
  if (step) {
    const id = step.dataset.id!;
    const line = readCart().find((l) => l.id === id);
    if (!line) return;
    const next = line.qty + Number(step.dataset.step);
    if (next < 1) removeFromCart(id);
    else setQty(id, next);
  }
});

window.addEventListener('cart:change', renderCartUi);
window.addEventListener('storage', renderCartUi);
renderCartUi();
