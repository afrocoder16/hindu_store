// Single place for brand and contact details.
// TODO: confirm the brand name. The old header said "Hindi Store" and the old footer said "Hini Store Marshall".
// Contact fields are left empty on purpose: the old site only had placeholder values.
// Anything left empty is hidden on the site; once `whatsapp` or `email` is set, checkout sends orders there.
export const site = {
  name: 'Hindi Store',
  tagline: 'Fresh, home-style dishes, snacks, drinks and sweets.',
  description: 'Order fresh rice dishes, sambusa, baklava, lassi and more from Hindi Store.',
  hours: '10am to 7pm',
  /** International format, digits only, e.g. "15551234567". */
  whatsapp: '',
  email: '',
  phone: '',
  address: '',
  currency: '$',
};
