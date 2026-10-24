import React, { useState } from 'react';
import { HEAD_FONT } from '@/components/layout/SiteChrome';
import { type Category } from '@/lib/catalog';

/* ────────────────────────────────────────────────────────────────────────────
   Shared bits for the zyphix.in home page sections.
──────────────────────────────────────────────────────────────────────────── */

export const PRODUCT_COUNT = '2,900+';
export const PARTNER_SITE = 'https://partner.zyphix.in';
export const ADVERTISE_SITE = 'https://advertise.zyphix.in';

export const ORANGE = '#EA580C';
export const BLUE = '#2563EB';

export const CONTAINER = 'mx-auto max-w-[1180px] px-5';
export const MONO = { fontVariantNumeric: 'tabular-nums' } as const;

export const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

export const PHOTOS = {
  heroMarket: unsplash('photo-1586201375761-83865001e31c'),
  kirana: unsplash('photo-1610832958506-aa56368176cf'),
  shelves: unsplash('photo-1550583724-b2692b85b150'),
  streetFood: unsplash('photo-1585937421612-70a008356fbe'),
  thali: unsplash('photo-1546069901-ba9599a7e63c'),
  electrician: unsplash('photo-1581578731548-c64695cc6952'),
  cleaning: unsplash('photo-1527515637462-cff94eecc1ac'),
  rider: unsplash('photo-1526367790999-0150786686a2'),
  bag: unsplash('photo-1595435934249-5df7ed86e1c0'),
  pharmacy: unsplash('photo-1556740758-90de374c12ad'),
};

export const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

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

export function Eyebrow({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={`text-[12px] font-bold uppercase tracking-[.12em] ${tone === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>{children}</p>;
}

export function H2({ children, className = '', tone = 'light' }: { children: React.ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  return (
    <h2 className={`mt-3 text-[1.9rem] md:text-[2.5rem] font-black tracking-[-0.03em] leading-[1.08] ${tone === 'dark' ? 'text-white' : 'text-gray-900'} ${className}`} style={{ fontFamily: HEAD_FONT }}>
      {children}
    </h2>
  );
}

/** Subtle "Sample" marker for mock data. */
export function SampleTag({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return <span className={`inline-flex items-center rounded-full border border-dashed px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${dark ? 'border-white/30 text-white/60' : 'border-gray-300 text-gray-400'} ${className}`}>Sample</span>;
}

export function Pill({ children, tint, bg }: { children: React.ReactNode; tint: string; bg: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={{ color: tint, background: bg }}>{children}</span>;
}

/** Soft gradient swatch standing in for a product photo inside mock-ups. */
export const SWATCH: Record<string, string> = {
  gray: 'linear-gradient(135deg,#F3F4F6,#E5E7EB)',
  green: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
  amber: 'linear-gradient(135deg,#FDE68A,#F59E0B)',
  red: 'linear-gradient(135deg,#FECACA,#F87171)',
  blue: 'linear-gradient(135deg,#DBEAFE,#93C5FD)',
  purple: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)',
  orange: 'linear-gradient(135deg,#FED7AA,#FB923C)',
  pink: 'linear-gradient(135deg,#FBCFE8,#F472B6)',
  teal: 'linear-gradient(135deg,#CCFBF1,#5EEAD4)',
};
