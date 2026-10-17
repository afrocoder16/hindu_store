import { site } from '../config';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const OPEN_MIN = toMinutes(site.hours.open);
export const CLOSE_MIN = toMinutes(site.hours.close);

/** Minutes since midnight in the store's time zone. */
export function storeMinutesNow(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return get('hour') * 60 + get('minute');
}

export function formatClock(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 ? 'AM' : 'PM';
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function isOpenNow(now = new Date()): boolean {
  const m = storeMinutesNow(now);
  return m >= OPEN_MIN && m < CLOSE_MIN;
}

export interface Slot {
  value: string;
  label: string;
}

/** Pickup slots every 15 minutes, starting after the prep time. Rolls to tomorrow when closed. */
export function pickupSlots(now = new Date(), limit = 16): Slot[] {
  const current = storeMinutesNow(now);
  let day = 'Today';
  let start = Math.ceil((current + site.prepMinutes) / 15) * 15;
  if (start < OPEN_MIN) start = OPEN_MIN;
  if (start > CLOSE_MIN - 15) {
    day = 'Tomorrow';
    start = OPEN_MIN;
  }
  const slots: Slot[] = [];
  for (let t = start; t <= CLOSE_MIN - 15 && slots.length < limit; t += 15) {
    const label = `${day}, ${formatClock(t)}`;
    slots.push({ value: label, label });
  }
  return slots;
}
