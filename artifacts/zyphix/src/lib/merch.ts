/**
 * Merchandising helpers for the Zyphix Now home layer.
 * Everything here is derived from the live catalogue – no typed numbers, no copy.
 */
import type { Product, Category } from '@/lib/catalog';
import type { Coupon } from '@/data/coupons';
import { hasRealImage } from '@/lib/productImage';

export const discountOf = (p: Product) =>
  p.origPrice && p.origPrice > p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0;

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Stable ordering that floats products with real photos to the front. */
export function preferPhotos(list: Product[]): Product[] {
  const real: Product[] = [], rest: Product[] = [];
  for (const p of list) (hasRealImage(p) ? real : rest).push(p);
  return real.concat(rest);
}

/** Round-robin across categories so a row does not show 12 items from one shelf. */
export function spreadAcrossCategories(list: Product[], limit: number): Product[] {
  const buckets = new Map<string, Product[]>();
  for (const p of list) {
    const b = buckets.get(p.category);
    if (b) b.push(p); else buckets.set(p.category, [p]);
  }
  const out: Product[] = [];
  const queues = Array.from(buckets.values());
  let i = 0;
  while (out.length < limit && queues.some(q => q.length)) {
    const q = queues[i % queues.length];
    const p = q.shift();
    if (p) out.push(p);
    i++;
  }
  return out;
}

export type CategoryStats = { name: string; count: number; minPrice: number; maxDiscount: number; discounted: number };

export function categoryStats(products: Product[]): Map<string, CategoryStats> {
  const m = new Map<string, CategoryStats>();
  for (const p of products) {
    let s = m.get(p.category);
    if (!s) { s = { name: p.category, count: 0, minPrice: Infinity, maxDiscount: 0, discounted: 0 }; m.set(p.category, s); }
    s.count++;
    if (p.price < s.minPrice) s.minPrice = p.price;
    const d = discountOf(p);
    if (d > 0) { s.discounted++; if (d > s.maxDiscount) s.maxDiscount = d; }
  }
  return m;
}

/* ── Offer cards ─────────────────────────────────────────────────────────── */

export type OfferTheme = 'green' | 'amber' | 'sky' | 'rose';
export type Offer = {
  key: string;
  theme: OfferTheme;
  label: string;      // small line above the headline (category name / coupon context)
  headline: string;   // computed: "Up to 25% off", "From ₹9", "WELCOME50"
  sub: string;        // computed detail line
  images: Product[];  // up to 3 products for the collage
  target: { kind: 'category'; name: string } | { kind: 'section'; id: string };
};

const couponLine = (c: Coupon) => {
  const who = c.firstOrderOnly ? 'your first order' : 'orders';
  if (c.type === 'FLAT') return `${inr(c.value)} off on ${who} above ${inr(c.minOrder)}`;
  if (c.type === 'PERCENT') return `${c.value}% off on ${who} above ${inr(c.minOrder)}${c.maxDiscount ? ` · up to ${inr(c.maxDiscount)}` : ''}`;
  return `Free delivery on ${who} above ${inr(c.minOrder)}`;
};

function collage(list: Product[], n = 3): Product[] {
  const out: Product[] = [];
  const seen = new Set<string>();
  for (const p of preferPhotos(list)) {
    const key = p.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key); out.push(p);
    if (out.length === n) break;
  }
  return out;
}

export function buildOffers(products: Product[], categories: Category[], coupon: Coupon | undefined, bestsellers: Product[]): Offer[] {
  const stats = categoryStats(products);
  const present = categories.filter(c => stats.has(c.name));
  const byCat = (name: string) => products.filter(p => p.category === name);
  const offers: Offer[] = [];
  const used = new Set<string>();

  const pick = (preferred: string, fallback: (a: CategoryStats, b: CategoryStats) => number): CategoryStats | undefined => {
    const pref = stats.get(preferred);
    if (pref && !used.has(pref.name)) return pref;
    return present.map(c => stats.get(c.name)!).filter(s => !used.has(s.name)).sort(fallback)[0];
  };

  // 1 · Snacks: biggest discount in the category
  const snacks = pick('Snacks & Munchies', (a, b) => b.maxDiscount - a.maxDiscount);
  if (snacks && snacks.maxDiscount > 0) {
    used.add(snacks.name);
    const list = byCat(snacks.name).filter(p => discountOf(p) > 0).sort((a, b) => discountOf(b) - discountOf(a));
    offers.push({
      key: `disc-${snacks.name}`, theme: 'amber', label: snacks.name,
      headline: `Up to ${snacks.maxDiscount}% off`,
      sub: `${snacks.discounted} of ${snacks.count} products on offer`,
      images: collage(list), target: { kind: 'category', name: snacks.name },
    });
  }

  // 2 · Dairy: lowest entry price
  const dairy = pick('Dairy & Eggs', (a, b) => a.minPrice - b.minPrice);
  if (dairy && Number.isFinite(dairy.minPrice)) {
    used.add(dairy.name);
    const list = byCat(dairy.name).slice().sort((a, b) => a.price - b.price);
    offers.push({
      key: `from-${dairy.name}`, theme: 'sky', label: dairy.name,
      headline: `From ${inr(dairy.minPrice)}`,
      sub: `${dairy.count} products · delivery in 30 min`,
      images: collage(list), target: { kind: 'category', name: dairy.name },
    });
  }

  // 3 · Coupon
  if (coupon) {
    offers.push({
      key: `coupon-${coupon.code}`, theme: 'green', label: coupon.firstOrderOnly ? 'New customers' : 'Coupon',
      headline: coupon.code, sub: couponLine(coupon),
      images: collage(bestsellers.length ? bestsellers : products), target: { kind: 'section', id: 'home-bestsellers' },
    });
  }

  // 4 · Best remaining discount category
  const best = pick('', (a, b) => b.maxDiscount - a.maxDiscount);
  if (best && best.maxDiscount > 0) {
    used.add(best.name);
    const list = byCat(best.name).filter(p => discountOf(p) > 0).sort((a, b) => discountOf(b) - discountOf(a));
    offers.push({
      key: `disc-${best.name}`, theme: 'rose', label: best.name,
      headline: `Up to ${best.maxDiscount}% off`,
      sub: `${best.discounted} of ${best.count} products on offer`,
      images: collage(list), target: { kind: 'category', name: best.name },
    });
  }

  return offers;
}

/* ── Rows ────────────────────────────────────────────────────────────────── */

export function dealsOfTheDay(products: Product[], limit = 12): Product[] {
  const list = products.filter(p => p.origPrice && p.origPrice > p.price);
  // Highest discount first; photos break ties so the row looks real.
  list.sort((a, b) => discountOf(b) - discountOf(a) || Number(hasRealImage(b)) - Number(hasRealImage(a)));
  return spreadAcrossCategories(list, limit);
}

/** Common Indian household staples, matched by brand + name against whatever the catalogue holds. */
const STAPLES: { brand: RegExp; name: RegExp }[] = [
  { brand: /amul/i, name: /butter/i },
  { brand: /amul|mother dairy/i, name: /milk/i },
  { brand: /aashirvaad/i, name: /atta/i },
  { brand: /tata/i, name: /salt/i },
  { brand: /maggi/i, name: /noodles|masala/i },
  { brand: /lay'?s/i, name: /./ },
  { brand: /parle/i, name: /parle-?g|glucose/i },
  { brand: /britannia/i, name: /good ?day|marie|bread/i },
  { brand: /fortune/i, name: /oil/i },
  { brand: /tata sampann/i, name: /dal|toor|moong|chana/i },
  { brand: /nescaf[eé]|nestl[eé]/i, name: /coffee|nescaf/i },
  { brand: /colgate/i, name: /toothpaste|paste/i },
  { brand: /surf excel/i, name: /./ },
  { brand: /amul/i, name: /cheese|paneer/i },
  { brand: /haldiram/i, name: /bhujia|namkeen/i },
  { brand: /cadbury/i, name: /dairy milk/i },
  { brand: /red label|tata tea|taj mahal/i, name: /tea/i },
  { brand: /dabur/i, name: /honey/i },
  { brand: /kissan/i, name: /ketchup|jam/i },
  { brand: /dettol|lifebuoy/i, name: /soap|handwash/i },
];

export function bestsellers(products: Product[], categories: Category[], limit = 12): Product[] {
  const out: Product[] = [];
  const taken = new Set<string>();
  for (const s of STAPLES) {
    const hits = preferPhotos(products.filter(p => s.brand.test(p.brand) && s.name.test(p.name) && !taken.has(p.id)));
    const hit = hits[0];
    if (hit) { out.push(hit); taken.add(hit.id); }
    if (out.length === limit) return out;
  }
  // Fallback: lead items from the largest categories.
  const stats = categoryStats(products);
  const top = categories.filter(c => stats.has(c.name)).sort((a, b) => stats.get(b.name)!.count - stats.get(a.name)!.count);
  for (const c of top) {
    const p = preferPhotos(products.filter(x => x.category === c.name && !taken.has(x.id)))[0];
    if (p) { out.push(p); taken.add(p.id); }
    if (out.length === limit) break;
  }
  return out;
}

export function underPrice(products: Product[], max: number, limit = 12): Product[] {
  const list = preferPhotos(products.filter(p => p.price <= max));
  return spreadAcrossCategories(list, limit);
}

export function topBrands(products: Product[], limit = 10, exclude: string[] = ['Local Farm']): { brand: string; count: number }[] {
  const m = new Map<string, number>();
  for (const p of products) {
    const b = (p.brand || '').trim();
    if (!b || exclude.includes(b)) continue;
    m.set(b, (m.get(b) || 0) + 1);
  }
  return Array.from(m, ([brand, count]) => ({ brand, count })).sort((a, b) => b.count - a.count).slice(0, limit);
}

export function freshProduce(products: Product[], limit = 12, category = 'Fruits & Veg'): Product[] {
  return preferPhotos(products.filter(p => p.category === category)).slice(0, limit);
}
