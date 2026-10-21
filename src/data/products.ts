import type { ImageMetadata } from 'astro';

import comboRice from '../assets/products/combo-rice.jpg';
import roastedChicken from '../assets/products/roasted-chicken.jpg';
import fishRice from '../assets/products/fish-rice.jpg';
import goatRice from '../assets/products/goat-rice.jpg';
import meatRice from '../assets/products/meat-rice.jpg';
import dalRice from '../assets/products/dal-rice.jpg';
import gyroSandwich from '../assets/products/gyro-sandwich.jpg';
import sambusa from '../assets/products/sambusa.jpg';
import bur from '../assets/products/bur.jpg';
import malawax from '../assets/products/malawax.jpg';
import friedDumplings from '../assets/products/fried-dumplings.jpg';
import wings from '../assets/products/wings.jpg';
import tea from '../assets/products/tea.jpg';

export type CategoryId = 'main-dishes' | 'snacks' | 'drinks' | 'desserts';

/** A size, or another choice the customer makes (a filling, soda or water). Each is its own cart line. */
export interface ProductSize {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Price in USD. For a product with `sizes`, this is the lowest price (shown as "from" when prices differ). */
  price: number;
  sizes?: ProductSize[];
  image: ImageMetadata;
  description: string;
}

/** One thing a customer can add to the cart: a whole product, or one size or choice of it. */
export interface Variant {
  id: string;
  name: string;
  label: string;
  price: number;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function variantsOf(p: Product): Variant[] {
  if (!p.sizes) return [{ id: p.id, name: p.name, label: '', price: p.price }];
  return p.sizes.map((s) => ({
    id: `${p.id}-${slug(s.label)}`,
    name: `${p.name} (${s.label})`,
    label: s.label,
    price: s.price,
  }));
}

/** True when the sizes or choices cost different amounts, so the price should read "from". */
export const priceVaries = (p: Product) => Boolean(p.sizes?.some((s) => s.price !== p.sizes![0].price));

// Names and prices come from the store. Descriptions are written from the photos.
// Only dishes the store sells are listed. A category with no dishes is hidden.
export const products: Product[] = [
  {
    id: 'combo-rice',
    name: 'Rice with Goat Meat, Fish & Chicken',
    category: 'main-dishes',
    price: 16,
    image: comboRice,
    description: 'Our big combination plate: goat meat, fried fish and chicken over spiced rice. Large size only.',
  },
  {
    id: 'roasted-chicken',
    name: 'Rice & Chicken',
    category: 'main-dishes',
    price: 12.5,
    sizes: [
      { label: 'Small', price: 12.5 },
      { label: 'Large', price: 16 },
    ],
    image: roastedChicken,
    description: 'Seasoned chicken served over spiced rice. Small comes with 2 pieces of chicken, Large with 3.',
  },
  {
    id: 'fish-rice',
    name: 'Rice & Tilapia Fish',
    category: 'main-dishes',
    price: 12.5,
    sizes: [
      { label: 'Small', price: 12.5 },
      { label: 'Large', price: 16 },
    ],
    image: fishRice,
    description: 'Crisp fried tilapia fillets on spiced rice with peas and fresh herbs. Large comes with 3 pieces of fish.',
  },
  {
    id: 'goat-rice',
    name: 'Rice & Goat Meat',
    category: 'main-dishes',
    price: 13,
    sizes: [
      { label: 'Small', price: 13 },
      { label: 'Large', price: 16 },
    ],
    image: goatRice,
    description: 'Goat meat with onions and peas over spiced rice.',
  },
  {
    id: 'meat-rice',
    name: 'Rice & Lamb Gyro',
    category: 'main-dishes',
    price: 12.5,
    sizes: [
      { label: 'Small', price: 12.5 },
      { label: 'Large', price: 16 },
    ],
    image: meatRice,
    description: 'Seasoned lamb gyro over fragrant rice, topped with peas and onion rings. Large comes with 5 pieces.',
  },
  {
    id: 'dal-rice',
    name: 'Rice, Veggie & Dal',
    category: 'main-dishes',
    price: 10,
    sizes: [
      { label: 'Small', price: 10 },
      { label: 'Large', price: 14 },
    ],
    image: dalRice,
    description: 'Spiced rice with vegetables, served with a bowl of dal, a golden lentil dish.',
  },
  {
    id: 'gyro-sandwich',
    name: 'Gyro Sandwich',
    category: 'main-dishes',
    price: 9.99,
    sizes: [
      { label: 'with Soda', price: 9.99 },
      { label: 'with Water', price: 9.99 },
    ],
    image: gyroSandwich,
    description: 'Gyro in warm flatbread with lettuce and peppers. Comes with a can of soda or a water.',
  },

  {
    id: 'sambusa',
    name: 'Sambusa',
    category: 'snacks',
    price: 1.99,
    sizes: [
      { label: 'Beef', price: 1.99 },
      { label: 'Chicken', price: 1.99 },
      { label: 'Veggie', price: 1.99 },
    ],
    image: sambusa,
    description: 'Crispy fried pastry triangles with a savory spiced filling. $1.99 per piece.',
  },
  {
    id: 'bur',
    name: 'Bur',
    category: 'snacks',
    price: 1.5,
    image: bur,
    description: 'Traditional Somali bread. $1.50 each.',
  },
  {
    id: 'malawax',
    name: 'Malawax',
    category: 'snacks',
    price: 1.5,
    image: malawax,
    description: 'Golden Somali pancakes, soft and lightly sweet. $1.50 each.',
  },
  {
    id: 'fried-dumplings',
    name: 'Bajiya (2 for $1)',
    category: 'snacks',
    price: 1,
    image: friedDumplings,
    description: 'Golden fried lentil fritters with a fresh green chutney. Two pieces for $1.00.',
  },
  {
    id: 'hot-wings',
    name: 'Hot Wings',
    category: 'snacks',
    price: 2.99,
    image: wings,
    description: 'Spicy chicken wings. Comes with 2 pieces.',
  },
  {
    id: 'wings',
    name: 'Wings',
    category: 'snacks',
    price: 2.99,
    image: wings,
    description: 'Chicken wings. Comes with 3 pieces.',
  },

  {
    id: 'tea',
    name: 'Chai Tea',
    category: 'drinks',
    price: 1.5,
    sizes: [
      { label: 'Small', price: 1.5 },
      { label: 'Medium', price: 2.5 },
      { label: 'Large', price: 3 },
    ],
    image: tea,
    description: 'Hot spiced chai, brewed the traditional way.',
  },
];
