import { MENU, RESTAURANTS, type Restaurant } from '@/data/eats';

import { etaMins, isPureVeg } from './parts';

const img = (id: string) => MENU.find(m => m.id === id)!.image;

/** "What's on your mind?" — dishes that real kitchens on Zyphix actually serve. */
export const DISHES: { label: string; image: string; re: RegExp }[] = [
  { label: 'Biryani', image: img('m8'), re: /biryani/i },
  { label: 'Pizza', image: img('m5'), re: /pizza/i },
  { label: 'Dosa', image: img('m16'), re: /dosa|idli|south indian/i },
  { label: 'Momos', image: img('m18'), re: /momo/i },
  { label: 'Burger', image: img('m21'), re: /burger/i },
  { label: 'Paneer', image: img('m24'), re: /paneer/i },
  { label: 'Chai', image: img('m22'), re: /chai/i },
  { label: 'Dal', image: img('m1'), re: /dal\b|dal makhni/i },
  { label: 'Chole', image: img('m13'), re: /chole|bhature|kulcha/i },
  { label: 'Sweets', image: img('m11'), re: /sweet|mithai|jamun|katli/i },
  { label: 'Healthy', image: img('m15'), re: /healthy|bowl|salad/i },
  { label: 'Pasta', image: img('m7'), re: /pasta/i },
];

const haystack = (r: Restaurant) => `${r.name} ${r.cuisine} ${r.cuisineType} ${MENU.filter(m => m.restaurantId === r.id).map(m => m.name).join(' ')}`;
export const servesDish = (r: Restaurant, label: string) => { const d = DISHES.find(x => x.label === label); return d ? d.re.test(haystack(r)) : true; };

export type SortKey = 'relevance' | 'rating' | 'time' | 'cost';
export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'rating', label: 'Rating: high to low' },
  { key: 'time', label: 'Delivery time: fastest' },
  { key: 'cost', label: 'Min order: low to high' },
];

export type Flags = { rating: boolean; veg: boolean; fast: boolean; free: boolean; fresh: boolean };
export const NO_FLAGS: Flags = { rating: false, veg: false, fast: false, free: false, fresh: false };
export const FLAG_LABELS: { key: keyof Flags; label: string; icon: 'star' | 'leaf' | 'flash' | 'bicycle' | 'sparkles' }[] = [
  { key: 'rating', label: 'Rating 4.5+', icon: 'star' },
  { key: 'veg', label: 'Pure Veg', icon: 'leaf' },
  { key: 'fast', label: 'Under 30 mins', icon: 'flash' },
  { key: 'free', label: 'Free delivery', icon: 'bicycle' },
  { key: 'fresh', label: 'New', icon: 'sparkles' },
];

export function applyFilters(list: Restaurant[], f: Flags, sort: SortKey, dish: string | null) {
  let out = list.filter(r =>
    (!f.rating || r.rating >= 4.5) &&
    (!f.veg || isPureVeg(r)) &&
    (!f.fast || etaMins(r) <= 30) &&
    (!f.free || r.deliveryFee === 0) &&
    (!f.fresh || r.tags.some(t => /new/i.test(t))) &&
    (!dish || servesDish(r, dish)));
  if (sort === 'rating') out = [...out].sort((a, b) => b.rating - a.rating);
  if (sort === 'time') out = [...out].sort((a, b) => etaMins(a) - etaMins(b));
  if (sort === 'cost') out = [...out].sort((a, b) => a.minOrder - b.minOrder);
  return out;
}

export const ALL = RESTAURANTS;
