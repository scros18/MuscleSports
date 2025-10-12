// Theme-based product loading system
// This file exports products based on the current theme

import { Product } from "@/types/product";
import { products as ordifyProducts } from './products';

// Function to load MuscleSports products from JSON files
export function getMuscleSportsProducts(): Product[] {
  try {
    // Load all product chunks (7 after deduplication and CBD removal)
    const products: Product[] = [];
    for (let i = 1; i <= 7; i++) {
      try {
        const chunk = require(`./products-chunk-${i}.json`);
        products.push(...chunk);
      } catch (e) {
        console.log(`Chunk ${i} not found, stopping...`);
        break;
      }
    }
    return products;
  } catch (error) {
    console.error('Failed to load MuscleSports products:', error);
    return [];
  }
}

// Export based on environment or theme
export const ordifyProductCatalog = ordifyProducts;
export const muscleSportsProductCatalog = getMuscleSportsProducts();

// Default export (Ordify)
export const products = ordifyProducts;
