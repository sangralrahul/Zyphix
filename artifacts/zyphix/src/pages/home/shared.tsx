import React, { useState } from 'react';
import { num } from '@/lib/format';
import { type Category } from '@/lib/catalog';
import { PHOTOS, landscape, type Photo } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   Shared bits for the zyphix.in home page sections (cinematic build).
──────────────────────────────────────────────────────────────────────────── */

/** Bundled catalogue holds 2,946 SKUs (src/data/mockData.ts) — rounded down, never inflated. */
export const PRODUCT_COUNT_N = 2900;
export const PRODUCT_COUNT = `${num(PRODUCT_COUNT_N)}+`;

export const NOW_SITE = 'https://now.zyphix.in';
export const EATS_SITE = 'https://eats.zyphix.in';
export const BOOK_SITE = 'https://book.zyphix.in';
export const PARTNER_SITE = 'https://partner.zyphix.in';
export const ADVERTISE_SITE = 'https://advertise.zyphix.in';
export const SUPPORT_SITE = 'https://support.zyphix.in';

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

/** Category names used when the API is unreachable (mirrors the live catalogue). */
export const CATEGORY_NAMES = [
  'Fruits & Veg', 'Dairy & Eggs', 'Snacks & Munchies', 'Atta, Rice & Dal', 'Bakery & Biscuits', 'Cold Drinks & Juices',
  'Tea & Coffee', 'Oils & Ghee', 'Masalas & Spices', 'Noodles & Pasta', 'Ready to Cook & Eat', 'Chocolates & Sweets',
  'Ice Creams', 'Breakfast & Soya', 'Dry Fruits & Nuts', 'Frozen Food', 'Personal Care', 'Beauty & Cosmetics',
  'Household', 'Pharmacy', 'Health & Wellness', 'Baby Care', 'Pet Care', 'Meat & Seafood', 'Paan Corner',
];

/** One proof line with a lucide icon — used by every product chapter. */
export function Proof({ icon, children, light = false }: { icon: React.ReactNode; children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${light ? 'bg-white/[.06] text-emerald-300 ring-1 ring-white/10' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'}`}>{icon}</span>
      <span className={`text-[15.5px] font-medium tracking-[-0.01em] ${light ? 'text-white/85' : 'text-gray-800'}`}>{children}</span>
    </div>
  );
}

/** Caption pinned to the bottom-left of a photo/video tile. */
export function TileLabel({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0) 0%, rgba(5,8,14,.72) 100%)' }}>
      <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">{title}</p>
      {meta && <p className="mt-0.5 text-[12.5px] text-white/65">{meta}</p>}
    </div>
  );
}

/** Display headline: Geist at tight tracking, balanced, capped at ~18ch. Accepts <Accent> children. */
export function Display({ children, light = false, size = 'lg', as: Tag = 'h2', className = '' }: { children: React.ReactNode; light?: boolean; size?: 'xl' | 'lg' | 'md'; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  const s = size === 'xl' ? 'text-[44px] leading-[1] sm:text-[64px] md:text-[80px]'
    : size === 'lg' ? 'text-[36px] leading-[1.04] sm:text-[46px] md:text-[56px]'
    : 'text-[28px] leading-[1.08] sm:text-[34px] md:text-[44px]';
  return <Tag className={`max-w-[18ch] text-balance font-semibold tracking-[-0.04em] ${s} ${light ? 'text-white' : 'text-gray-900'} ${className}`}>{children}</Tag>;
}

/**
 * The eight aisles shown on the home gallery, each with the photo that actually
 * shows that aisle (no doorstep bags standing in for bread).
 */
export const AISLES: Array<{ name: string; match: RegExp; photo: Photo }> = [
  { name: 'Fruits & Veg', match: /fruit|veg/i, photo: landscape('produce', 0) },
  { name: 'Dairy & Eggs', match: /dairy|egg/i, photo: landscape('dairy', 1) },
  { name: 'Snacks & Munchies', match: /snack|munch/i, photo: landscape('snacks', 0) },
  { name: 'Cold Drinks & Juices', match: /drink|juice/i, photo: landscape('snacks', 1) },
  { name: 'Tea & Coffee', match: /tea|coffee/i, photo: landscape('chai', 1) },
  { name: 'Masalas & Spices', match: /masala|spice/i, photo: landscape('spices', 4) },
  { name: 'Dry Fruits & Nuts', match: /dry fruit|nut/i, photo: PHOTOS.dairy[3] },
  { name: 'Household', match: /household|clean/i, photo: landscape('cleaning', 1) },
];

/** Live category name for an aisle when the API has it (falls back to the curated label). */
export function aisleName(a: typeof AISLES[number], cats: { name: string }[]): string {
  return cats.find(c => a.match.test(c.name))?.name ?? a.name;
}
