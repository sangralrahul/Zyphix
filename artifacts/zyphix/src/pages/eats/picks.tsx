/**
 * Zyphix Eats — editorial blocks above the restaurant grid.
 * "Tonight's picks" bento, cuisine photo tiles, partner strip and the final restaurant CTA.
 * Everything renders without /api; registered restaurants arrive via usePartners.
 */
import React from 'react';
import { ArrowRight, Star, Clock, CheckCircle2, ClipboardList, Zap, ChefHat, Flame, Bike } from 'lucide-react';
import { Reveal, Kicker, Sub, GlowButton, Dark, Glow, Grain, PhotoTile } from '@/ui/cinema';
import { Accent, ClipWall, VideoText, RouteMap, LiveOrder, Magnetic } from '@/ui/motion2';
import { VIDEOS, PHOTOS, landscape, pexelsPhoto, type Photo } from '@/data/media';

/** Display headline style for Eats bands (Geist, tight tracking). */
export const DISPLAY = 'font-semibold tracking-[-0.04em] text-balance';

/** Deterministic photo for a listing with no image: landscape food/restaurant shots first, then the rest. */
const POOL: Photo[] = [
  ...PHOTOS.restaurant.filter(p => !p.portrait),
  ...PHOTOS.indianFood.filter(p => !p.portrait),
  ...PHOTOS.restaurant.filter(p => p.portrait),
  ...PHOTOS.indianFood.filter(p => p.portrait),
];
export const fallbackPhoto = (i: number): Photo => POOL[Math.abs(i) % POOL.length];

/** Photo per cuisine chip (index-based, stable between renders). */
export const cuisinePhoto = (i: number): Photo => {
  const a = landscape('indianFood', Math.floor(i / 2));
  const b = landscape('restaurant', Math.floor(i / 2));
  return i % 2 === 0 ? a : b;
};

/** Hand-matched photo per cuisine chip; falls back to the index-based pool. */
const dish = (id: number, alt: string): Photo => ({ id: String(id), src: pexelsPhoto(id, 480), alt });
const CUISINE_PHOTO: Record<string, () => Photo> = {
  'North Indian': () => dish(9609844, 'Butter chicken curry in a bowl'),
  'South Indian': () => dish(5560763, 'Crisp dosas with chutneys on a banana leaf'),
  'Biryani': () => dish(12737656, 'Plate of chicken biryani'),
  'Pizza': () => dish(2147491, 'Two margherita pizzas'),
  'Burgers': () => dish(1639557, 'Cheeseburger close-up'),
  'Momos': () => dish(5409010, 'Steamed dumplings on a slate'),
  'Chinese': () => dish(2347311, 'Bowl of stir-fried noodles'),
  'Sweets': () => dish(15014918, 'Bowl of gulab jamun'),
  'Chai & Snacks': () => dish(5410400, 'Pav with spicy curry'),
  'Healthy': () => dish(1640777, 'Fresh salad bowl'),
};
export const photoForCuisine = (c: string, i: number): Photo => CUISINE_PHOTO[c]?.() || cuisinePhoto(i);

export type PickRestaurant = { id: string; name: string; cuisine: string; eta: string; rating?: number; image: string };

/* ── Tonight's picks: kitchen ClipWall + the three top restaurants on photo tiles ── */
export function TonightsPicks({ picks, onOpen }: { picks: PickRestaurant[]; onOpen: (id: string) => void }) {
  return (
    <section className="mt-8 md:mt-10" aria-label="Tonight's picks">
      <Reveal y={12} amount={0.4} className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Tonight's picks</p>
          <h2 className={`${DISPLAY} max-w-[22ch] text-[26px] leading-[1.06] text-gray-900 md:text-[34px]`}>
            Straight from the <Accent green>kitchen</Accent>, tracked to your door.
          </h2>
        </div>
        <p className="max-w-[340px] text-[13.5px] leading-[1.55] text-gray-600">Kitchens start cooking the moment you tap order. Every delivery comes with a live ETA.</p>
      </Reveal>
      <Reveal y={18} amount={0.15}>
        {/* 3-col override: the shared 5-tile spans fill a 3×3 grid exactly (4 cols leaves a hole) */}
        <ClipWall
          clips={[VIDEOS.plating, VIDEOS.streetFood, VIDEOS.chefTeam, VIDEOS.chai, VIDEOS.foodDelivery]}
          labels={['Plated to order', 'Street favourites', 'Busy kitchens', 'Tea & snacks', 'Out for delivery']}
        />
      </Reveal>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-12">
        {picks.slice(0, 3).map((r, i) => (
          <Reveal key={r.id} className="md:col-span-4" y={18} delay={0.08 * i} amount={0.2}>
            <button type="button" onClick={() => onOpen(r.id)} className="group block w-full text-left">
              <PhotoTile photo={r.image ? { id: r.id, src: r.image, alt: r.name } : fallbackPhoto(i)} ratio="4/3" rounded="rounded-2xl">
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.05) 30%, rgba(5,8,14,.85) 100%)' }} />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[16px] font-semibold tracking-[-0.01em]">{r.name}</p>
                    {r.rating !== undefined && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[12px] font-semibold backdrop-blur-md"><Star size={11} className="fill-white" />{r.rating}</span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-white/70">{r.cuisine}</p>
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-white/85"><Clock size={12} />{r.eta}</p>
                </div>
              </PhotoTile>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Cuisine photo tiles ── */
export function CuisineTiles({ cuisines, active, onPick }: { cuisines: string[]; active: string; onPick: (c: string) => void }) {
  return (
    <section className="mt-8 md:mt-10" aria-label="Cuisines">
      <Reveal y={12} amount={0.4} className="mb-3 flex items-baseline gap-2">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] md:text-[18px]">What are you craving?</h2>
        <span className="text-[12.5px] text-gray-500">{cuisines.length} cuisines</span>
      </Reveal>
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar md:mx-0 md:grid md:grid-cols-5 md:px-0">
        {cuisines.map((c, i) => {
          const on = active === c;
          return (
            <Reveal key={c} delay={Math.min(i * 0.05, 0.4)} y={14} amount={0.1} className="w-[150px] shrink-0 md:w-auto">
              <button type="button" onClick={() => onPick(c)} aria-pressed={on}
                className={`group block w-full overflow-hidden rounded-2xl text-left transition duration-300 hover:-translate-y-0.5 ${on ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#F8F9FA]' : ''}`}>
                <PhotoTile photo={photoForCuisine(c, i)} ratio="4/3" rounded="rounded-2xl">
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.0) 35%, rgba(5,8,14,.8) 100%)' }} />
                  <p className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-[14px] font-semibold text-white">
                    <span className="truncate">{c}</span>
                    <ArrowRight size={14} className="shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </PhotoTile>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ── "Partner restaurants go live automatically" strip ── */
export function PartnerStrip({ registeredCount }: { registeredCount: number }) {
  const steps = [
    { icon: <ClipboardList size={16} />, t: 'Register on partner.zyphix.in', s: 'Name, locality and cuisine. It takes a few minutes.' },
    { icon: <Zap size={16} />, t: 'Listed here automatically', s: 'New kitchens appear on this page with a "New" tag as soon as they register.' },
    { icon: <CheckCircle2 size={16} />, t: 'Menu goes live when ready', s: 'Orders start the moment the menu is published.' },
  ];
  return (
    <Reveal as="section" y={16} amount={0.2} className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white md:mt-12">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="border-b border-gray-200 p-5 md:col-span-4 md:border-b-0 md:border-r md:p-6">
          <Kicker>For restaurants</Kicker>
          <h2 className="text-[20px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[24px]">Partner restaurants go live automatically.</h2>
          <p className="mt-2 text-[13.5px] leading-[1.55] text-gray-600">
            {registeredCount > 0
              ? `${registeredCount} kitchen${registeredCount === 1 ? '' : 's'} joined through the partner site and ${registeredCount === 1 ? 'is' : 'are'} already listed below.`
              : 'Every registration on the partner site shows up on this page automatically.'}
          </p>
          <a href="https://partner.zyphix.in" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">
            Register your restaurant <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:col-span-8">
          {steps.map((st, i) => (
            <div key={st.t} className="p-5 md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{st.icon}</span>
                <span className="text-[11.5px] font-semibold tabular-nums text-gray-400">0{i + 1}</span>
              </div>
              <p className="mt-3 text-[14.5px] font-semibold tracking-[-0.01em] text-gray-900">{st.t}</p>
              <p className="mt-1 text-[13px] leading-[1.5] text-gray-600">{st.s}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ── Final dark CTA ── */
export function RestaurantCta() {
  const photo = landscape('restaurant', 0);
  return (
    <Dark className="-mx-4 mt-10 md:mx-0 md:mt-12 md:rounded-3xl">
      <img src={photo.src} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,8,14,.95) 0%, rgba(5,8,14,.75) 55%, rgba(5,8,14,.35) 100%)' }} />
      <Glow x="85%" y="100%" size={700} alpha={0.3} />
      <Grain />
      <div className="relative px-5 py-14 md:px-12 md:py-20">
        <Reveal y={16} amount={0.3}>
          <Kicker light>Own a kitchen?</Kicker>
          <h2 className={`${DISPLAY} max-w-[18ch] text-[34px] leading-[1.04] text-white sm:text-[46px] md:text-[56px]`}>Put your kitchen on every <Accent green>phone</Accent> nearby.</h2>
          <Sub light className="mt-4 max-w-[520px]">No joining fee, commission explained before you go live, a real-time order dashboard, and Zyphix riders at your counter.</Sub>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic><GlowButton href="https://partner.zyphix.in">Partner with Zyphix <ArrowRight size={16} /></GlowButton></Magnetic>
            <span className="text-[13px] text-white/55">partner.zyphix.in</span>
          </div>
        </Reveal>
      </div>
    </Dark>
  );
}

/* ── Hero live order (desktop) ── */
export function EatsHeroLiveOrder() {
  return (
    <div className="pointer-events-none zx-bleed-right absolute bottom-12 right-10 z-10 hidden w-[300px] xl:block">
      <Reveal delay={0.5} y={20}>
        <LiveOrder dark className="pointer-events-auto" items={['Paneer tikka', 'Margherita pizza', 'Iced lemon tea × 2']} />
      </Reveal>
    </div>
  );
}

/* ── "HUNGRY?" video-in-letters band ── */
export function HungryBand({ label = "See what's open", href = '#eats-grid', note = 'Cooked to order in kitchens near you.' }: { label?: string; href?: string; note?: string } = {}) {
  return (
    <section aria-label="Hungry?" className="relative -mx-4 mt-10 overflow-hidden bg-[#05080E] md:mx-0 md:mt-12 md:rounded-3xl">
      <VideoText clip={VIDEOS.cooking} text="HUNGRY?" size="text-[19vw] md:text-[190px] lg:text-[226px]" className="pt-6 md:pt-8" />
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-white md:px-8">
        <p className="text-[14px] text-white/70">{note}</p>
        <a href={href} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-semibold text-gray-900 no-underline transition hover:-translate-y-px hover:bg-emerald-50">
          {label} <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

/* ── RouteMap band: kitchen → rider → gate ── */
export function EatsTrackBand() {
  const steps = [
    { icon: <ChefHat size={15} />, t: 'Kitchen accepts', s: 'The restaurant confirms and starts cooking right away.' },
    { icon: <Flame size={15} />, t: 'Packed hot', s: 'Sealed at the counter the moment it leaves the pan.' },
    { icon: <Bike size={15} />, t: 'Rider to your gate', s: 'Follow the rider on the map with a live ETA.' },
  ];
  return (
    <section aria-label="Live tracking" className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white md:mt-12">
      <div className="grid items-stretch md:grid-cols-[1fr_1.15fr]">
        <Reveal y={16} amount={0.25} className="flex flex-col justify-center p-6 md:p-10">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Live tracking</p>
          <h2 className={`${DISPLAY} max-w-[16ch] text-[28px] leading-[1.05] text-gray-900 md:text-[40px]`}>
            Hot food, tracked <Accent green>live</Accent>.
          </h2>
          <ol className="mt-6 space-y-4 border-t border-gray-100 pt-6">
            {steps.map((st, i) => (
              <li key={st.t} className="flex gap-3.5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{st.icon}</span>
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-gray-900"><span className="mr-1.5 tabular-nums text-gray-400">0{i + 1}</span>{st.t}</p>
                  <p className="mt-0.5 text-[13px] leading-[1.5] text-gray-600">{st.s}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <div className="p-3 pt-0 md:p-3 md:pl-0">
          <RouteMap dark className="aspect-[56/38] md:aspect-auto md:h-full md:min-h-[420px]" minutes={28} />
        </div>
      </div>
    </section>
  );
}
