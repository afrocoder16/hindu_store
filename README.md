# Hindi Store

Website for Hindi Store, a grocery and deli in downtown Marshall, MN. Built with [Astro](https://astro.build).

## Commands

| Command           | Action                                    |
| :---------------- | :---------------------------------------- |
| `npm install`     | Install dependencies                      |
| `npm run dev`     | Start the dev server at `localhost:4321`  |
| `npm run build`   | Build the static site to `./dist/`        |
| `npm run preview` | Preview the production build locally      |

## Where things live

- `src/config.ts`: name, address, phone, hours, tax rate, **Cash App `$cashtag`**, text-order number, weekly special
- `src/data/products.ts`: the menu (names, prices, descriptions, photos)
- `src/pages/index.astro`: the one-page site (hero, special, menu, story, visit)
- `src/components/CartDrawer.astro` + `src/scripts/order.ts`: cart, checkout, pay at the counter / Cash App
- `legacy/`: the original PHP/MySQL site, kept for reference
- `archive/`: original images not used by the new site

## Ordering

Checkout builds a compact order message with an order number (like `HS-4K2Q`) and opens a pre-filled text to the store number in `src/config.ts` (`smsNumber`). On a phone the messages app opens right away; on a computer a QR code lets the customer send it from their phone. Cash App opens a pre-filled payment link for `cashTag` (plus a QR code on desktop). Cash App cannot confirm payment back to the site, so staff match payments to order numbers. Verified online payments need a processor such as Square or Stripe plus a small server function.
