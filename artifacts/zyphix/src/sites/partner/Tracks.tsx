import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Store, UtensilsCrossed, Wrench, Bike, ClipboardCheck } from 'lucide-react';
import { Light, Dark, Glow, Grain, Kicker, Headline, Sub, Reveal, Stagger, GlowButton, Counter, Ticker, PhotoTile, VideoCard, isStatic } from '@/ui/cinema';
import { Container, Chip } from '@/ui/kit';
import { VIDEOS, PHOTOS, landscape, type Clip } from '@/data/media';
import { SERVICES, TRACKS, NUM, NOW_SITE, EATS_SITE, BOOK_SITE, type Track } from './shared';
import { usePartners, type PartnerListing, type PartnerType } from '@/lib/partners';

/* ────────────────────────────────────────────────────────────────────────────
   Track bento (photo cards with hover video) · "Listed automatically" band ·
   live partner directory (renders nothing until the API has partners).
──────────────────────────────────────────────────────────────────────────── */

/* ── Hover clip: poster is already painted by the card; video fades in on hover */
function HoverClip({ clip, active }: { clip: Clip; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [wanted, setWanted] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) { setWanted(true); v.play().catch(() => {}); }
    else v.pause();
  }, [active]);
  if (failed || isStatic()) return null;
  return (
    <video
      ref={ref}
      aria-hidden
      src={wanted ? clip.src720 || clip.src : undefined}
      muted loop playsInline preload="none"
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

function TrackCard({ tr, className = '', delay = 0, chips = false }: { tr: Track; className?: string; delay?: number; chips?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay} y={32} className={className}>
      <article
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="group relative flex h-full min-h-[460px] flex-col justify-end overflow-hidden rounded-3xl bg-[#05080E] text-white shadow-[0_24px_60px_rgba(11,15,25,.12)] md:min-h-[500px]"
      >
        <a href={tr.href} aria-label={tr.cta} className="absolute inset-0 z-0">
          <img src={tr.photo.src} alt={tr.photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" />
          {tr.clip && <HoverClip clip={tr.clip} active={hover} />}
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.35) 0%, rgba(5,8,14,.05) 30%, rgba(5,8,14,.55) 60%, rgba(5,8,14,.94) 100%)' }} />
        </a>

        <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-2 sm:left-6 sm:top-6">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md"><tr.icon size={15} /></span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white/90 ring-1 ring-white/25 backdrop-blur-md">{tr.product}</span>
        </div>

        <div className="relative z-10 p-5 pt-20 sm:p-7 sm:pt-24">
          <h3 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[30px]">{tr.title}</h3>
          <p className="mt-2 max-w-[420px] text-[15px] leading-[1.55] text-white/75">{tr.line}</p>
          {chips && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {SERVICES.slice(0, 6).map(s => <li key={s} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white/85 backdrop-blur-sm">{s}</li>)}
              <li className="rounded-full border border-white/15 bg-white/[.04] px-2.5 py-1 text-[12px] font-medium text-white/60">+{SERVICES.length - 6} more</li>
            </ul>
          )}
          <ul className="mt-4 space-y-1.5">
            {tr.bullets.map(b => (
              <li key={b} className="flex items-start gap-2 text-[14px] text-white/85"><Check size={15} className="mt-0.5 shrink-0 text-emerald-300" /> {b}</li>
            ))}
          </ul>
          <div className="mt-6">
            <GlowButton href={tr.href} size="md">{tr.cta} <ArrowRight size={15} /></GlowButton>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function TrackBento() {
  const [delivery, restaurant, services, store] = TRACKS;
  return (
    <Light id="tracks" className="scroll-mt-16 py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal><Kicker>Choose your track</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg">Four ways to partner. One neighbourhood network.</Headline></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-4">
            <Sub>Pick the track that matches how you work. Each has a short guided application and its own onboarding manager.</Sub>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12">
          <TrackCard tr={delivery} className="md:col-span-7" delay={0} />
          <TrackCard tr={restaurant} className="md:col-span-5" delay={0.08} />
          <TrackCard tr={store} className="md:col-span-5" delay={0.16} />
          <TrackCard tr={services} className="md:col-span-7" delay={0.24} chips />
        </div>
      </Container>
    </Light>
  );
}

/* ── Listed automatically ───────────────────────────────────────────────── */
const DESTINATIONS = [
  { host: 'now.zyphix.in', href: NOW_SITE, who: 'Kirana & store owners', what: 'Your shelves, at shelf prices, 30-minute delivery.' },
  { host: 'eats.zyphix.in', href: EATS_SITE, who: 'Restaurants & kitchens', what: 'Your menu, your prices, riders timed to prep.' },
  { host: 'book.zyphix.in', href: BOOK_SITE, who: 'Zyphix Book professionals', what: 'Your slots and rate card, with a verified badge.' },
];

function DestLabel({ host, who, what }: { host: string; who: string; what: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0) 0%, rgba(5,8,14,.82) 100%)' }}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-emerald-300">{host}</p>
      <p className="mt-1 text-[16px] font-semibold tracking-[-0.01em] text-white">{who}</p>
      <p className="mt-0.5 text-[12.5px] text-white/65">{what}</p>
    </div>
  );
}

export function ListedAutomatically() {
  return (
    <Dark className="py-24 md:py-36">
      <Glow x="15%" y="20%" size={900} alpha={0.22} />
      <Grain />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal><Kicker light>Listed automatically</Kicker></Reveal>
            <Reveal delay={0.05}><Headline light size="lg">Register once. Appear where your customers already shop.</Headline></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-6 max-w-[480px]">Your listing is built from your registration and goes live on the Zyphix product for your track. People in your area see you in the app and on the web, with no separate storefront to maintain.</Sub></Reveal>
            <Stagger className="mt-8 grid gap-3" step={0.08}>
              {[
                ['Register', 'A ten-minute form on this portal.'],
                ['Verify', 'A call within two working days; documents checked.'],
                ['Go live', 'Your listing appears on now., eats. or book.zyphix.in, and in the rider app for delivery partners.'],
              ].map(([t, d], i) => (
                <div key={t} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 text-[12.5px] font-semibold text-emerald-300" style={NUM}>0{i + 1}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-white">{t}</p>
                    <p className="mt-0.5 text-[14px] leading-[1.55] text-white/60">{d}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <Reveal y={32} className="col-span-2">
                <VideoCard clip={VIDEOS.groceryShelf} ratio="16/8" rounded="rounded-3xl" className="!bg-[#111827] ring-1 ring-white/10">
                  <DestLabel {...DESTINATIONS[0]} />
                </VideoCard>
              </Reveal>
              <Reveal y={32} delay={0.1}>
                <PhotoTile photo={landscape('indianFood', 0)} ratio="4/5" rounded="rounded-3xl" className="!bg-[#111827] ring-1 ring-white/10">
                  <DestLabel {...DESTINATIONS[1]} />
                </PhotoTile>
              </Reveal>
              <Reveal y={32} delay={0.18}>
                <PhotoTile photo={PHOTOS.electrician[1]} ratio="4/5" rounded="rounded-3xl" className="!bg-[#111827] ring-1 ring-white/10">
                  <DestLabel {...DESTINATIONS[2]} />
                </PhotoTile>
              </Reveal>
            </div>
            <Reveal delay={0.25} className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-[13.5px] text-white/70">
              <ClipboardCheck size={16} className="shrink-0 text-emerald-300" />
              Delivery partners are not listed publicly; they receive orders from Zyphix Now and Eats in the partner app.
            </Reveal>
          </div>
        </div>
      </Container>
    </Dark>
  );
}

/* ── Live directory (real registrations) ───────────────────────────────── */
const TYPE_META: Record<PartnerType, { label: string; plural: string; tone: 'green' | 'orange' | 'violet' | 'blue'; icon: typeof Store }> = {
  store: { label: 'Store', plural: 'Stores', tone: 'green', icon: Store },
  restaurant: { label: 'Restaurant', plural: 'Restaurants', tone: 'orange', icon: UtensilsCrossed },
  service: { label: 'Professional', plural: 'Professionals', tone: 'violet', icon: Wrench },
  delivery: { label: 'Rider', plural: 'Riders', tone: 'blue', icon: Bike },
};

export function LiveDirectory() {
  const store = usePartners('store');
  const restaurant = usePartners('restaurant');
  const service = usePartners('service');
  const delivery = usePartners('delivery');
  const groups = useMemo<{ type: PartnerType; list: PartnerListing[] }[]>(() => [
    { type: 'store', list: store.partners }, { type: 'restaurant', list: restaurant.partners },
    { type: 'service', list: service.partners }, { type: 'delivery', list: delivery.partners },
  ], [store.partners, restaurant.partners, service.partners, delivery.partners]);
  const total = groups.reduce((n, g) => n + g.list.length, 0);
  if (total === 0) return null;

  const latest = groups.flatMap(g => g.list)
    .filter(p => p.name)
    .sort((a, b) => (Date.parse(b.joinedAt) || 0) - (Date.parse(a.joinedAt) || 0))
    .slice(0, 40);

  const items = latest.map(p => {
    const m = TYPE_META[p.type] ?? TYPE_META.store;
    const place = p.locality || p.city;
    return (
      <span key={`${p.type}-${p.id}`} className="inline-flex h-11 items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 text-[14px] font-medium text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><m.icon size={13} /></span>
        {p.name}
        <span className="text-[12px] text-gray-400">{[m.label, place].filter(Boolean).join(' · ')}</span>
      </span>
    );
  });

  return (
    <Light tone="soft" className="py-16 md:py-20">
      <Container>
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Kicker>Live partner directory</Kicker>
            <h2 className="text-[26px] font-semibold tracking-[-0.025em] text-gray-900 sm:text-[32px]">
              <span style={NUM}><Counter to={total} /></span> {total === 1 ? 'partner' : 'partners'} registered so far
            </h2>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {groups.filter(g => g.list.length > 0).map(g => {
              const m = TYPE_META[g.type];
              return <li key={g.type}><Chip tone={m.tone}><m.icon size={12} /> {g.list.length} {g.list.length === 1 ? m.label : m.plural}</Chip></li>;
            })}
          </ul>
        </Reveal>
      </Container>
      <Reveal delay={0.1} y={0} className="mt-8">
        <Ticker items={items} speed={Math.max(30, items.length * 3)} size="text-[14px]" />
      </Reveal>
    </Light>
  );
}
