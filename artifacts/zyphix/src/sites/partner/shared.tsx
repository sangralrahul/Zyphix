import { Bike, UtensilsCrossed, Sparkles, Store, type LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   partner.zyphix.in — shared data for the partner portal (no photos, no metrics).
──────────────────────────────────────────────────────────────────────────── */

export const PARTNERSHIPS_EMAIL = 'partnerships@zyphix.in';
export const MAIN_SITE = 'https://zyphix.in';
export const ADVERTISE_SITE = 'https://advertise.zyphix.in';

export const BLUE = '#2563EB';
export const ORANGE = '#EA580C';
export const VIOLET = '#7C3AED';

export const NAV = [
  { label: 'Delivery',    href: '/delivery' },
  { label: 'Restaurants', href: '/restaurant' },
  { label: 'Zyphix Book', href: '/services' },
  { label: 'Stores',      href: '/store' },
];

export const SERVICES = [
  'House cleaning', 'Electrician', 'Plumber', 'AC service', 'Painter',
  'Carpenter', 'Water purifier', 'Home cook', 'Packers & movers', 'Pest control',
];

export type TrackTone = 'blue' | 'orange' | 'violet' | 'green';

export interface Track {
  id: 'delivery' | 'restaurant' | 'services' | 'store';
  href: string;
  tone: TrackTone;
  tint: string;
  icon: LucideIcon;
  name: string;
  product: string;
  title: string;
  line: string;
  bullets: string[];
  cta: string;
}

export const TRACKS: Track[] = [
  {
    id: 'delivery', href: '/delivery', tone: 'blue', tint: BLUE, icon: Bike,
    name: 'Delivery partner', product: 'Zyphix Now · Eats',
    title: 'Deliver in your own area',
    line: 'Short runs from neighbourhood stores and kitchens to customers a few streets away.',
    bullets: ['Payout shown before you accept', 'Weekly settlement to your bank', 'No forced hours or penalty targets'],
    cta: 'Start delivering',
  },
  {
    id: 'restaurant', href: '/restaurant', tone: 'orange', tint: ORANGE, icon: UtensilsCrossed,
    name: 'Restaurant & kitchen partner', product: 'Zyphix Eats',
    title: 'List on Zyphix Eats',
    line: 'Restaurants, dhabas, cloud kitchens, bakeries and sweet shops.',
    bullets: ['Commission explained before go-live', 'Menu, prices and hours stay yours', 'Prep-time control on every order'],
    cta: 'Register restaurant',
  },
  {
    id: 'services', href: '/services', tone: 'violet', tint: VIOLET, icon: Sparkles,
    name: 'Zyphix Book professional', product: 'Zyphix Book',
    title: 'Become a verified member',
    line: 'Booking requests from your locality, with a verified badge once checks are complete.',
    bullets: ['Verified badge after ID checks', 'You set days, slots and rate card', 'Solo pros and small teams welcome'],
    cta: 'Join Zyphix Book',
  },
  {
    id: 'store', href: '/store', tone: 'green', tint: '#0DA366', icon: Store,
    name: 'Kirana & store owner', product: 'Zyphix Now',
    title: 'Put your shelves online',
    line: 'Kirana stores, pharmacies, dairies and local retail.',
    bullets: ['Free catalogue setup', 'Stock toggles from your phone', 'Shelf price is the app price'],
    cta: 'List your store',
  },
];
