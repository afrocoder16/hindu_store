import type { ImageMetadata } from 'astro';
import type { CategoryId } from './products';

import mainDishes from '../assets/categories/main-dishes.png';
import snacks from '../assets/categories/snacks.png';
import drinks from '../assets/categories/drinks.png';
import desserts from '../assets/categories/desserts.png';

export interface Category {
  id: CategoryId;
  name: string;
  image: ImageMetadata;
}

export const categories: Category[] = [
  { id: 'main-dishes', name: 'Main Dishes', image: mainDishes },
  { id: 'snacks', name: 'Snacks', image: snacks },
  { id: 'drinks', name: 'Drinks', image: drinks },
  { id: 'desserts', name: 'Desserts', image: desserts },
];
