// Single place for brand, contact and ordering details.
// Brand name confirmed by the owner: "Hindi Store".
//
// TODO (confirm with the store): address, phone, email and hours below come from the storefront sign
// and public listings (Zabihah, Marshall Independent), not from the owner directly.
// Anything left empty is hidden on the site.
export const site = {
  name: 'Hindi Store',
  tagline: 'Quality cultural foods in downtown Marshall.',
  description: 'Hindi Store in Marshall, MN: groceries, deli, dine-in and carry-out. Order online for pickup.',
  address: '208 W Main St, Marshall, MN 56258',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Hindi+Store+208+W+Main+St+Marshall+MN',
  /** Digits as shown on the storefront sign: "call 929-3881". Area code 507 is assumed (Marshall). */
  phone: '507-929-3881',
  phoneDisplay: '(507) 929-3881',
  email: 'hindistore@hotmail.com',
  /** International format, digits only, e.g. "15075551234". When set, orders go to WhatsApp first. */
  whatsapp: '',
  currency: '$',
  timeZone: 'America/Chicago',
  /** 24h "HH:MM". Same hours every day for now. */
  hours: { open: '11:00', close: '21:00' },
  /** Sales tax added at checkout, e.g. 0.07375. Left at 0 until the store confirms the rate. */
  taxRate: 0,
  /** Minutes the kitchen needs before the earliest pickup. */
  prepMinutes: 20,
  /** Cash App $cashtag, with or without the "$". Leave empty to hide the Cash App option. */
  cashTag: '',
  /** The special shown in the "This week" section. `productId` must exist in data/products.ts. */
  special: {
    productId: 'fish-rice',
    label: 'Featured this week',
    title: 'Fried fish over spiced rice',
    text: 'Crisp fried fish fillets on fragrant rice with peas, peppers and fresh herbs. Cooked to order at our deli counter.',
  },
  credit: { name: 'midvora.', url: 'https://midvora.com' },
};
