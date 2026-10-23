import type { Category, Product } from '@/lib/catalog';

/**
 * Picks the best image for a product card.
 * Most catalogue rows still carry a placehold.co placeholder (image_status = pending);
 * for those we fall back to the category's photo so cards never show a grey text box.
 */
export function productImageFor(p: Product, categories: Category[]): { src: string; isFallback: boolean } {
  const real = p.image && !p.image.includes('placehold.co') && p.imageStatus !== 'pending' && p.imageStatus !== 'not_found' && p.imageStatus !== 'failed';
  if (real) return { src: p.image, isFallback: false };
  const cat = categories.find(c => c.name === p.category);
  return { src: cat?.image || '/images/groceries.png', isFallback: true };
}

/** Soft tint for fallback cards, derived from the category colour. */
export function categoryTint(categories: Category[], name: string): string {
  return categories.find(c => c.name === name)?.color || '#0DA366';
}
