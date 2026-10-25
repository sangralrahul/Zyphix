import { Bike, UtensilsCrossed, Sparkles, Store, type LucideIcon } from 'lucide-react';
import { VIDEOS, PHOTOS, landscape, type Clip, type Photo } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   partner.zyphix.in — shared data for the partner portal (promises only, no
   invented metrics). Photos / clips come from src/data/media.ts.
──────────────────────────────────────────────────────────────────────────── */

export const PARTNERSHIPS_EMAIL = 'partnerships@zyphix.in';
export const MAIN_SITE = 'https://zyphix.in';
export const ADVERTISE_SITE = 'https://advertise.zyphix.in';
export const NOW_SITE = 'https://now.zyphix.in';
export const EATS_SITE = 'https://eats.zyphix.in';
export const BOOK_SITE = 'https://book.zyphix.in';

export const BLUE = '#2563EB';
export const ORANGE = '#EA580C';
export const VIOLET = '#7C3AED';

export const NUM = { fontVariantNumeric: 'tabular-nums' } as const;

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
  /** Where the listing shows up for customers. */
  listedOn: string;
  title: string;
  line: string;
  bullets: string[];
  cta: string;
  photo: Photo;
  clip?: Clip;
}

export const TRACKS: Track[] = [
  {
    id: 'delivery', href: '/delivery', tone: 'blue', tint: BLUE, icon: Bike,
    name: 'Delivery partner', product: 'Zyphix Now · Eats', listedOn: 'Rider app',
    title: 'Deliver in your own area',
    line: 'Short runs from neighbourhood stores and kitchens to customers a few streets away.',
    bullets: ['Payout shown before you accept', 'Weekly settlement to your bank', 'No forced hours or penalty targets'],
    cta: 'Start delivering',
    photo: landscape('rider', 0), clip: VIDEOS.rider,
  },
  {
    id: 'restaurant', href: '/restaurant', tone: 'orange', tint: ORANGE, icon: UtensilsCrossed,
    name: 'Restaurant & kitchen partner', product: 'Zyphix Eats', listedOn: 'eats.zyphix.in',
    title: 'List on Zyphix Eats',
    line: 'Restaurants, dhabas, cloud kitchens, bakeries and sweet shops.',
    bullets: ['Commission explained before go-live', 'Menu, prices and hours stay yours', 'Prep-time control on every order'],
    cta: 'Register restaurant',
    photo: landscape('chef', 0), clip: VIDEOS.chefTeam,
  },
  {
    id: 'services', href: '/services', tone: 'violet', tint: VIOLET, icon: Sparkles,
    name: 'Zyphix Book professional', product: 'Zyphix Book', listedOn: 'book.zyphix.in',
    title: 'Become a verified member',
    line: 'Booking requests from your locality, with a verified badge once checks are complete.',
    bullets: ['Verified badge after ID checks', 'You set days, slots and rate card', 'Solo pros and small teams welcome'],
    cta: 'Join Zyphix Book',
    photo: landscape('plumbing', 0), clip: VIDEOS.plumber,
  },
  {
    id: 'store', href: '/store', tone: 'green', tint: '#0DA366', icon: Store,
    name: 'Kirana & store owner', product: 'Zyphix Now', listedOn: 'now.zyphix.in',
    title: 'Put your shelves online',
    line: 'Kirana stores, pharmacies, dairies and local retail.',
    bullets: ['Free catalogue setup', 'Stock toggles from your phone', 'Shelf price is the app price'],
    cta: 'List your store',
    photo: landscape('shopOwner', 0), clip: VIDEOS.merchant,
  },
];

/** Extra photos used around the page. */
export const PARTNER_PHOTOS = {
  handover: PHOTOS.foodDelivery[1],   // portrait: rider handing over an order
  doorstep: PHOTOS.people[0],
  electrician: landscape('electrician', 0),
  salon: landscape('salon', 0),
};
