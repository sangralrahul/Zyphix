import { Wrench, Zap, Sparkles, Paintbrush, Snowflake, Droplets, Hammer, ChefHat, Truck, type LucideIcon } from 'lucide-react';
import { services } from '@/data/mockData';
import { PHOTOS, VIDEOS, type Clip, type Photo } from '@/data/media';
import { tagList, type PartnerListing } from '@/lib/partners';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — shared constants, media mapping and small helpers.
──────────────────────────────────────────────────────────────────────────── */

export type Service = typeof services[number];

export const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
export const DAYS = ['Today', 'Tomorrow'] as const;
export type Day = typeof DAYS[number];

export const PANEL_ID = 'booking-panel';
export const PANEL_ID_MOBILE = 'booking-panel-mobile';
export const PARTNER_URL = 'https://partner.zyphix.in';

type Meta = { icon: LucideIcon; photo: Photo; clip?: Clip; blurb: string };

/** Icon, verified Pexels photo (and clip where one exists) per service id. */
export const SERVICE_META: Record<string, Meta> = {
  sv1:  { icon: Wrench,     photo: PHOTOS.plumbing[0],    clip: VIDEOS.plumber,     blurb: 'Leaks, taps, fittings' },
  sv2:  { icon: Zap,        photo: PHOTOS.electrician[0], clip: VIDEOS.electrician, blurb: 'Switchboards, fans, wiring' },
  // the hero already plays the cleaning clip, so this tile stays a photo (no clip twice per page)
  sv3:  { icon: Sparkles,   photo: PHOTOS.cleaning[1],    blurb: 'Deep clean, kitchen, bathroom' },
  sv4:  { icon: Paintbrush, photo: PHOTOS.painting[0],    blurb: 'Rooms, touch-ups, textures' },
  sv5:  { icon: Snowflake,  photo: PHOTOS.appliance[0],   clip: VIDEOS.acRepair,    blurb: 'Service, gas refill, install' },
  sv6:  { icon: Droplets,   photo: PHOTOS.plumbing[1],    blurb: 'Filter change, repair' },
  sv7:  { icon: Hammer,     photo: PHOTOS.carpenter[0],   blurb: 'Repairs, fittings, assembly' },
  sv8:  { icon: ChefHat,    photo: PHOTOS.indianFood[0],  blurb: 'Daily meals, parties' },
  sv9:  { icon: Truck,      photo: PHOTOS.people[2],      blurb: 'Local shifting, packing' },
  sv10: { icon: Wrench,     photo: PHOTOS.plumbing[5],    blurb: 'Small fixes, mounting' },
};
const FALLBACK: Meta = { icon: Wrench, photo: PHOTOS.cleaning[1], blurb: 'Verified professionals' };
export const metaFor = (s: Service): Meta => SERVICE_META[s.id] || FALLBACK;

/** Bento order: the two tiles with a clip are wide and lead their rows. */
export const TILE_ORDER = ['sv3', 'sv1', 'sv5', 'sv2', 'sv4', 'sv6', 'sv7', 'sv8', 'sv9', 'sv10'];
export const WIDE = new Set(['sv3', 'sv2']);
export const orderedServices = (): Service[] => {
  const byId = new Map(services.map(s => [s.id, s]));
  const ordered = TILE_ORDER.map(id => byId.get(id)).filter((s): s is Service => !!s);
  const rest = services.filter(s => !TILE_ORDER.includes(s.id));
  return [...ordered, ...rest];
};

/** Match a professional's category (and skills) to a service; falls back to the first service. */
export function serviceForPro(p: PartnerListing): Service {
  const terms = [p.category, ...tagList(p.tags || '')].map(t => t.trim().toLowerCase()).filter(Boolean);
  for (const term of terms) {
    const hit = services.find(s => {
      const title = s.title.toLowerCase(), cat = s.category.toLowerCase();
      return title === term || cat === term || title.includes(term) || term.includes(title) || cat.includes(term) || term.includes(cat);
    });
    if (hit) return hit;
  }
  return services[0];
}

export const proInitials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || '·';

export const PROMISES = [
  'ID & police-verified pros',
  'Price shown before you confirm',
  'Reschedule free',
  "Credit if we're late",
  '7-day work guarantee',
  'Support Mon–Sat',
];

export const FAQ = [
  { q: 'How are professionals verified?', a: 'Each professional submits a government ID, address proof and a police verification certificate, then completes a skill confirmation call before they can accept bookings on Zyphix Book.' },
  { q: 'When do I see the price?', a: 'The visit charge for the selected service is shown in the booking panel before you confirm. If the job needs extra parts or time, the professional quotes it before starting.' },
  { q: 'Can I reschedule or cancel?', a: 'Yes. You can reschedule for free, and cancel at no charge up to 1 hour before your slot.' },
  { q: 'What if the professional is late?', a: 'We notify you if they are running behind. If they arrive more than 30 minutes after your slot, you get a credit on the visit charge, or you can pick a new slot or cancel without any charge.' },
  { q: 'Is there a guarantee on the work?', a: 'Yes. Under our 7-day work guarantee, if a completed job has an issue within 7 days we send a professional back to fix it.' },
  { q: 'Which areas do you cover?', a: 'Coverage depends on the professionals registered in your city. The "Pros near you" list shows verified professionals currently available.' },
];
