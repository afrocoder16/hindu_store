import type { ImageMetadata } from 'astro';

import fishRice from '../assets/products/fish-rice.jpg';
import meatRice from '../assets/products/meat-rice.jpg';
import roastedChicken from '../assets/products/roasted-chicken.jpg';
import sambusa from '../assets/products/sambusa.jpg';
import friedDumplings from '../assets/products/fried-dumplings.jpg';
import tea from '../assets/products/tea.jpg';

export type CategoryId = 'main-dishes' | 'snacks' | 'drinks' | 'desserts';

export interface ProductSize {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Price in USD. For a product with `sizes`, this is the lowest size price (shown as "from"). */
  price: number;
  /** Sizes the customer picks from. Each size is added to the cart as its own line. */
  sizes?: ProductSize[];
  image: ImageMetadata;
  description: string;
}

/** One thing a customer can add to the cart: a whole product, or one size of it. */
export interface Variant {
  id: string;
  name: string;
  label: string;
  price: number;
}

export function variantsOf(p: Product): Variant[] {
  if (!p.sizes) return [{ id: p.id, name: p.name, label: '', price: p.price }];
  return p.sizes.map((s) => ({
    id: `${p.id}-${s.label.toLowerCase()}`,
    name: `${p.name} (${s.label})`,
    label: s.label,
    price: s.price,
  }));
}

// Names and prices come from the store's printed menu. Descriptions are written from the photos.
// Only dishes that are on that menu and have a photo are listed. A category with no dishes is hidden.
export const products: Product[] = [
  {
    id: 'fish-rice',
    name: 'Rice & Tilapia Fish',
    category: 'main-dishes',
    price: 9.99,
    sizes: [
      { label: 'Small', price: 9.99 },
      { label: 'Large', price: 11.99 },
    ],
    image: fishRice,
    description: 'Crisp fried tilapia fillets on spiced rice with peas and fresh herbs.',
  },
  {
    id: 'roasted-chicken',
    name: 'Rice & Chicken',
    category: 'main-dishes',
    price: 9.99,
    sizes: [
      { label: 'Small', price: 9.99 },
      { label: 'Large', price: 11.99 },
    ],
    image: roastedChicken,
    description: 'Seasoned chicken legs served over spiced rice.',
  },
  {
    id: 'meat-rice',
    name: 'Rice & Lamb Gyro',
    category: 'main-dishes',
    price: 9.5,
    sizes: [
      { label: 'Small', price: 9.5 },
      { label: 'Large', price: 10.99 },
    ],
    image: meatRice,
    description: 'Seasoned lamb gyro over fragrant rice, topped with peas and onion rings.',
  },

  {
    id: 'sambusa',
    name: 'Sambusa',
    category: 'snacks',
    price: 1.75,
    image: sambusa,
    description: 'Crispy fried pastry triangles with a savory spiced filling. Beef, chicken or veggie. Tell us your pick in the order notes.',
  },
  {
    id: 'fried-dumplings',
    name: 'Bajiya',
    category: 'snacks',
    price: 1,
    image: friedDumplings,
    description: 'Golden fried bites served with a fresh green chutney.',
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
