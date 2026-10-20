// Single place for brand, contact and ordering details.
//
// TODO (confirm with the store): the address and hours come from public listings (Zabihah,
// Marshall Independent). The phone numbers and Cash App tag were given by the owner's team.
// Anything left empty is hidden on the site.
export const site = {
  name: 'Hindi Store',
  tagline: 'Quality cultural foods in downtown Marshall.',
  description: 'Hindi Store in Marshall, MN: groceries, deli, dine-in and carry-out. Order ahead by text and pay with Cash App.',
  address: '208 W Main St, Marshall, MN 56258',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Hindi+Store+208+W+Main+St+Marshall+MN',
  mapEmbedUrl: 'https://www.google.com/maps?q=208+W+Main+St,+Marshall,+MN+56258&output=embed',
  /**
   * Where the "Give us a review" button goes. This opens the store's Google Maps page, where customers
   * tap "Write a review". Swap in the store's direct review link when the owner has it.
   */
  reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Hindi+Store+208+W+Main+St+Marshall+MN',
  /** Store landline. "Call us" dials it. It cannot receive texts. */
  phone: '507-929-3881',
  phoneDisplay: '(507) 929-3881',
  /** Cell number that receives text orders. E.164 format used for sms: links. */
  smsNumber: '+15075912088',
  smsDisplay: '(507) 591-2088',
  email: '',
  currency: '$',
  timeZone: 'America/Chicago',
  /** 24h "HH:MM". Same hours every day for now. */
  hours: { open: '10:00', close: '21:00' },
  /** Sales tax added at checkout, e.g. 0.07375. Left at 0 until the store confirms the rate. */
  taxRate: 0,
  /** Minutes the kitchen needs before the earliest pickup. */
  prepMinutes: 20,
  /** Cash App $cashtag, with or without the "$". Leave empty to hide the Cash App option. */
  cashTag: 'sadiasalah11',
  /** The plate shown in the featured section. `productId` must exist in data/products.ts. */
  special: {
    productId: 'fish-rice',
    label: "This week's plate",
    title: 'Tilapia fish over spiced rice',
    text: 'Crisp fried tilapia fillets on fragrant rice with peas, peppers and fresh herbs. Cooked to order at our deli counter.',
  },
  credit: { name: 'midvora.', url: 'https://midvora.com' },
};
