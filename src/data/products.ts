import type { ImageMetadata } from 'astro';

import fishRice from '../assets/products/fish-rice.jpg';
import meatRice from '../assets/products/meat-rice.jpg';
import veggieRice from '../assets/products/veggie-rice.jpg';
import roastedChicken from '../assets/products/roasted-chicken.jpg';
import sambusa from '../assets/products/sambusa.jpg';
import friedDumplings from '../assets/products/fried-dumplings.jpg';
import mashMash from '../assets/products/mash-mash.jpg';
import sabaayad from '../assets/products/sabaayad.jpg';
import lassi from '../assets/products/lassi.jpg';
import sattu from '../assets/products/sattu.jpg';
import sugarcaneJuice from '../assets/products/sugarcane-juice.jpg';
import tea from '../assets/products/tea.jpg';
import watermelon from '../assets/products/watermelon.jpg';
import baklava from '../assets/products/baklava.jpg';
import basbousa from '../assets/products/basbousa.jpg';
import halwa from '../assets/products/halwa.jpg';

export type CategoryId = 'main-dishes' | 'snacks' | 'drinks' | 'desserts';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  /** Price in USD. TODO: placeholder values, the old database had no product rows. */
  price: number;
  image: ImageMetadata;
  description: string;
}

// TODO: confirm names, descriptions and prices with the owner. Names are inferred from the photos.
export const products: Product[] = [
  { id: 'fish-rice', name: 'Fried Fish with Rice', category: 'main-dishes', price: 12, image: fishRice, description: 'Crisp fried fish fillets on spiced rice with peas and fresh herbs.' },
  { id: 'meat-rice', name: 'Rice with Meat', category: 'main-dishes', price: 13, image: meatRice, description: 'Seasoned grilled meat over fragrant rice, topped with peas and onion rings.' },
  { id: 'veggie-rice', name: 'Veggie Rice', category: 'main-dishes', price: 9, image: veggieRice, description: 'Fluffy rice with mixed vegetables, a light and filling plate.' },
  { id: 'roasted-chicken', name: 'Herb Roasted Chicken', category: 'main-dishes', price: 12, image: roastedChicken, description: 'Chicken legs roasted with herbs until golden, served with rice.' },

  { id: 'sambusa', name: 'Sambusa', category: 'snacks', price: 5, image: sambusa, description: 'Crispy fried pastry triangles with a savory spiced filling.' },
  { id: 'fried-dumplings', name: 'Fried Dumplings', category: 'snacks', price: 5, image: friedDumplings, description: 'Golden fried bites served with a fresh green chutney.' },
  { id: 'mash-mash', name: 'Mash Mash', category: 'snacks', price: 4, image: mashMash, description: 'Light, lacy fried rounds with a soft, chewy center.' },
  { id: 'sabaayad', name: 'Sabaayad', category: 'snacks', price: 4, image: sabaayad, description: 'Flaky, layered flatbread cooked on the griddle.' },

  { id: 'lassi', name: 'Lassi', category: 'drinks', price: 4, image: lassi, description: 'Cool, creamy yogurt drink.' },
  { id: 'sattu', name: 'Sattu Drink', category: 'drinks', price: 3, image: sattu, description: 'Refreshing roasted-gram drink, a traditional summer cooler.' },
  { id: 'sugarcane-juice', name: 'Sugarcane Juice', category: 'drinks', price: 4, image: sugarcaneJuice, description: 'Freshly pressed sugarcane juice, served cold.' },
  { id: 'tea', name: 'Spiced Tea', category: 'drinks', price: 2, image: tea, description: 'Hot tea brewed the traditional way.' },
  { id: 'watermelon', name: 'Watermelon Juice', category: 'drinks', price: 4, image: watermelon, description: 'Fresh watermelon, blended and chilled.' },

  { id: 'baklava', name: 'Baklava', category: 'desserts', price: 5, image: baklava, description: 'Layers of flaky pastry, nuts and sweet syrup.' },
  { id: 'basbousa', name: 'Basbousa', category: 'desserts', price: 4, image: basbousa, description: 'Soft semolina cake soaked in syrup.' },
  { id: 'halwa', name: 'Halwa', category: 'desserts', price: 5, image: halwa, description: 'Rich sweet bites topped with crushed pistachio.' },
];
