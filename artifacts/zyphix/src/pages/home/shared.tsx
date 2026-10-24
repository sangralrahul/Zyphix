import React, { useState } from 'react';
import { type Category } from '@/lib/catalog';

/* ────────────────────────────────────────────────────────────────────────────
   Shared bits for the zyphix.in home page sections.
──────────────────────────────────────────────────────────────────────────── */

export const PRODUCT_COUNT = '2,900+';
export const PARTNER_SITE = 'https://partner.zyphix.in';
export const ADVERTISE_SITE = 'https://advertise.zyphix.in';

export const NUM = { fontVariantNumeric: 'tabular-nums' } as const;

/** Lightweight: the landing page only needs categories (not the 3k-product list). */
export function useCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>([]);
  React.useEffect(() => {
    let alive = true;
    fetch('/api/categories', { headers: { accept: 'application/json' } })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Category[]) => { if (alive && Array.isArray(d) && d.length) setCats(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return cats;
}

/** Category names used inside static mock-ups (mirrors the live catalogue). */
export const CATEGORY_NAMES = [
  'Fruits & Veg', 'Dairy & Eggs', 'Snacks & Munchies', 'Atta, Rice & Dal', 'Bakery & Biscuits', 'Cold Drinks & Juices',
  'Tea & Coffee', 'Oils & Ghee', 'Masalas & Spices', 'Noodles & Pasta', 'Ready to Cook & Eat', 'Chocolates & Sweets',
  'Ice Creams', 'Breakfast & Soya', 'Dry Fruits & Nuts', 'Frozen Food', 'Personal Care', 'Beauty & Cosmetics',
  'Household', 'Pharmacy', 'Health & Wellness', 'Baby Care', 'Pet Care', 'Meat & Seafood', 'Paan Corner',
];

/** Soft gradient swatch standing in for a product image inside mock-ups (no photos). */
export const SWATCH: Record<string, string> = {
  gray: 'linear-gradient(135deg,#F3F4F6,#E5E7EB)',
  green: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
  amber: 'linear-gradient(135deg,#FEF3C7,#FCD34D)',
  red: 'linear-gradient(135deg,#FEE2E2,#FCA5A5)',
  blue: 'linear-gradient(135deg,#DBEAFE,#93C5FD)',
  purple: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)',
  orange: 'linear-gradient(135deg,#FFEDD5,#FDBA74)',
  pink: 'linear-gradient(135deg,#FCE7F3,#F9A8D4)',
  teal: 'linear-gradient(135deg,#CCFBF1,#5EEAD4)',
};

export function Swatch({ tone, className = '' }: { tone: keyof typeof SWATCH; className?: string }) {
  return <span aria-hidden className={`block shrink-0 rounded-lg ${className}`} style={{ background: SWATCH[tone] }} />;
}
