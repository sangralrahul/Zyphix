import React from 'react';
import {
  Bike, UtensilsCrossed, Store, Sparkles, Zap, Wrench, Snowflake, Paintbrush, Hammer, Droplets, ChefHat, Truck, Bug,
  type LucideIcon,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   partner.zyphix.in — shared tokens, data and helpers for the partner portal.
──────────────────────────────────────────────────────────────────────────── */

export const BLUE   = '#2563EB';
export const ORANGE = '#EA580C';
export const VIOLET = '#7C3AED';

export const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

export const U = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

export const PHOTOS = {
  hero:        U('photo-1526367790999-0150786686a2'),
  delivery:    U('photo-1595435934249-5df7ed86e1c0'),
  deliveryAlt: U('photo-1526367790999-0150786686a2'),
  restaurant:  U('photo-1585937421612-70a008356fbe'),
  kitchen:     U('photo-1563379091339-03b21ab4a4f8'),
  thali:       U('photo-1546069901-ba9599a7e63c'),
  electrician: U('photo-1581578731548-c64695cc6952'),
  cleaning:    U('photo-1527515637462-cff94eecc1ac'),
  plumber:     U('photo-1621905251189-08b45d6a269e'),
  kirana:      U('photo-1610832958506-aa56368176cf'),
  shelves:     U('photo-1586201375761-83865001e31c'),
  pharmacy:    U('photo-1556740758-90de374c12ad'),
};

export const NAV = [
  { label: 'Delivery',     href: '/delivery' },
  { label: 'Restaurants',  href: '/restaurant' },
  { label: 'Zyphix Book',  href: '/services' },
  { label: 'Stores',       href: '/store' },
];

export const SERVICE_LIST: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'House cleaning', icon: Sparkles }, { label: 'Electrician', icon: Zap }, { label: 'Plumber', icon: Wrench },
  { label: 'AC service', icon: Snowflake }, { label: 'Painter', icon: Paintbrush }, { label: 'Carpenter', icon: Hammer },
  { label: 'Water purifier', icon: Droplets }, { label: 'Home cook', icon: ChefHat }, { label: 'Packers & movers', icon: Truck },
  { label: 'Pest control', icon: Bug },
];

export type TrackId = 'delivery' | 'restaurant' | 'services' | 'store';

export interface Track {
  id: TrackId;
  href: string;
  tint: string;
  bg: string;
  ring: string;
  icon: LucideIcon;
  eyebrow: string;
  product: string;
  short: string;
  title: string;
  headline: string;
  body: string;
  benefits: string[];
  requirements: string[];
  need: string[];
  cta: string;
  photo: string;
  cardPhoto: string;
}

export const TRACKS: Track[] = [
  {
    id: 'delivery', href: '/delivery', tint: BLUE, bg: '#EFF6FF', ring: 'hover:border-blue-300', icon: Bike,
    eyebrow: 'Track 01', product: 'Zyphix Now · Eats', short: 'Delivery partner',
    title: 'Deliver in your own area',
    headline: 'Short runs. Clear payouts. Your schedule.',
    body: 'Carry groceries, food and essentials from neighbourhood stores and kitchens to customers a few streets away. Every order shows its payout before you accept it, and the week\'s earnings are summarised in your app.',
    benefits: ['Per-order payout shown before you accept', 'Weekly settlement to your bank account', 'Short hyperlocal distances, no cross-city runs', 'No forced login hours or penalty targets', 'Dedicated onboarding manager and training'],
    requirements: ['18+ years', 'Smartphone with data', 'Bike, scooter, bicycle or car', 'Government ID'],
    need: ['Aadhaar or voter ID', 'Driving licence (motor vehicles)', 'Vehicle RC (motor vehicles)', 'Bank account'],
    cta: 'Start delivering',
    photo: PHOTOS.deliveryAlt, cardPhoto: PHOTOS.delivery,
  },
  {
    id: 'restaurant', href: '/restaurant', tint: ORANGE, bg: '#FFF7ED', ring: 'hover:border-orange-300', icon: UtensilsCrossed,
    eyebrow: 'Track 02', product: 'Zyphix Eats', short: 'Restaurant & kitchen partner',
    title: 'List on Zyphix Eats',
    headline: 'Your menu, your prices, your customers.',
    body: 'Restaurants, dhabas, cloud kitchens, bakeries and sweet shops. Manage orders, menu availability and prep times from one dashboard, with a flat, transparent commission explained before you go live.',
    benefits: ['Flat, transparent commission — no hidden fees', 'Menu, prices and hours stay in your control', 'Customer names and order history shared with you', 'Live order dashboard built for the counter', 'Prep-time control so riders arrive when food is ready'],
    requirements: ['Registered food business', 'FSSAI licence', 'Menu with prices', 'Bank account'],
    need: ['FSSAI number', 'GST (if applicable)', 'Menu photos', 'Owner ID'],
    cta: 'Register restaurant',
    photo: PHOTOS.kitchen, cardPhoto: PHOTOS.restaurant,
  },
  {
    id: 'services', href: '/services', tint: VIOLET, bg: '#F5F3FF', ring: 'hover:border-violet-300', icon: Sparkles,
    eyebrow: 'Track 03', product: 'Zyphix Book', short: 'Zyphix Book professional',
    title: 'Become a verified member at Zyphix',
    headline: 'Verified badge. Local bookings. Fair rates.',
    body: 'Electricians, plumbers, cleaners, AC technicians, painters, carpenters, home cooks, movers and pest-control teams. Get booking requests from customers in your locality, with a verified badge once your checks are complete.',
    benefits: ['Verified badge after ID and background checks', 'Bookings only from your chosen area and radius', 'You set your days, slots and rate card', 'Solo professionals and small teams both welcome', 'Job checklist and customer confirmation on every booking'],
    requirements: ['Trade experience', 'Government ID', 'Own tools', 'Smartphone'],
    need: ['Aadhaar or voter ID', 'Address proof', 'Trade certificate (if any)', 'Bank account'],
    cta: 'Join Zyphix Book',
    photo: PHOTOS.cleaning, cardPhoto: PHOTOS.electrician,
  },
  {
    id: 'store', href: '/store', tint: '#0DA366', bg: '#ECFDF5', ring: 'hover:border-emerald-300', icon: Store,
    eyebrow: 'Also for', product: 'Zyphix Now', short: 'Kirana & store owner',
    title: 'Put your shelves on Zyphix Now',
    headline: 'Shelf price is the app price.',
    body: 'Kirana stores, pharmacies, dairies and local retail. List your catalogue, toggle stock in seconds and let a nearby delivery partner carry orders to customers who already walk past your shop.',
    benefits: ['Free catalogue setup with our team', 'Stock toggles and price edits from your phone', 'Hyperlocal delivery network at your door', 'Keep the customers you already serve', 'No dark store competing against you'],
    requirements: ['Physical store', 'Owner ID', 'Product list', 'Bank account'],
    need: ['Shop photo', 'GST (if applicable)', 'Drug licence (pharmacy)', 'UPI or bank details'],
    cta: 'List your store',
    photo: PHOTOS.shelves, cardPhoto: PHOTOS.kirana,
  },
];

/** Small "Sample" tag used on every UI mock-up. */
export function SampleTag({ className = '' }: { className?: string }) {
  return <span className={`rounded-md border border-gray-200 bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 ${className}`}>Sample</span>;
}

/** Tinted pill. */
export function Pill({ children, tint, bg }: { children: React.ReactNode; tint: string; bg: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ color: tint, background: bg }}>{children}</span>;
}

export function Progress({ value, tint, className = '' }: { value: number; tint: string; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: tint }} />
    </div>
  );
}
