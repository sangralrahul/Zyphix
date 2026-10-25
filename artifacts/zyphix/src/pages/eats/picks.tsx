/**
 * Zyphix Eats — editorial blocks above the restaurant grid.
 * "Tonight's picks" bento, cuisine photo tiles, partner strip and the final restaurant CTA.
 * Everything renders without /api; registered restaurants arrive via usePartners.
 */
import React from 'react';
import { ArrowRight, Star, Clock, CheckCircle2, ClipboardList, Zap } from 'lucide-react';
import { VideoCard, Reveal, Headline, Kicker, Sub, GlowButton, Dark, Glow, Grain, PhotoTile } from '@/ui/cinema';
import { VIDEOS, PHOTOS, landscape, type Photo } from '@/data/media';

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

export type PickRestaurant = { id: string; name: string; cuisine: string; eta: string; rating?: number; image: string };

/* ── Tonight's picks: two in-view videos + the three top restaurants on photo tiles ── */
export function TonightsPicks({ picks, onOpen }: { picks: PickRestaurant[]; onOpen: (id: string) => void }) {
  return (
    <section className="mt-8 md:mt-10" aria-label="Tonight's picks">
      <Reveal y={12} amount={0.4} className="mb-3 flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <h2 className="truncate text-[17px] font-semibold tracking-[-0.01em] md:text-[18px]">Tonight's picks</h2>
          <span className="shrink-0 text-[12.5px] text-gray-500">hot, tracked, on time</span>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <Reveal className="md:col-span-7" y={18} amount={0.2}>
          <VideoCard clip={VIDEOS.foodDelivery} ratio="16/10" rounded="rounded-2xl"
            overlay={<div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0) 40%, rgba(5,8,14,.85) 100%)' }} />}>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
              <Kicker light className="mb-2">Live tracking</Kicker>
              <p className="text-[22px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[28px]">Watch your rider, door to door.</p>
              <p className="mt-1.5 max-w-[420px] text-[13px] text-white/70 md:text-[14px]">Every order is tracked from the kitchen to your gate, with a live ETA.</p>
            </div>
          </VideoCard>
        </Reveal>
        <Reveal className="md:col-span-5" y={18} delay={0.1} amount={0.2}>
          <VideoCard clip={VIDEOS.food} ratio="8/7" rounded="rounded-2xl"
            overlay={<div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0) 40%, rgba(5,8,14,.85) 100%)' }} />}>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
              <Kicker light className="mb-2">Cooked to order</Kicker>
              <p className="text-[22px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[26px]">Straight off the tawa.</p>
              <p className="mt-1.5 text-[13px] text-white/70 md:text-[14px]">Kitchens start cooking the moment you tap order.</p>
            </div>
          </VideoCard>
        </Reveal>
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
                <PhotoTile photo={cuisinePhoto(i)} ratio="4/3" rounded="rounded-2xl">
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
          <Kicker light>Own a kitchen in Jammu?</Kicker>
          <Headline size="lg" light className="max-w-[640px]">Put your restaurant on every phone in the city.</Headline>
          <Sub light className="mt-4 max-w-[520px]">No joining fee, commission explained before you go live, a real-time order dashboard, and Zyphix riders at your counter.</Sub>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <GlowButton href="https://partner.zyphix.in">Partner with Zyphix <ArrowRight size={16} /></GlowButton>
            <span className="text-[13px] text-white/55">partner.zyphix.in</span>
          </div>
        </Reveal>
      </div>
    </Dark>
  );
}
