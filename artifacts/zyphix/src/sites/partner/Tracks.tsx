import React, { useMemo } from 'react';
import { ArrowRight, Check, Store, UtensilsCrossed, Wrench, Bike, ClipboardCheck } from 'lucide-react';
import { Light, Dark, Glow, Grain, Kicker, Headline, Sub, Reveal, GlowButton, Counter, Ticker, PhotoTile, BgVideo } from '@/ui/cinema';
import { HScrollGallery, Accent, GiantMarquee } from '@/ui/motion2';
import { Container, Chip } from '@/ui/kit';
import { PHOTOS, landscape } from '@/data/media';
import { SERVICES, TRACKS, NUM, NOW_SITE, EATS_SITE, BOOK_SITE, type Track } from './shared';
import { usePartners, type PartnerListing, type PartnerType } from '@/lib/partners';

/* ────────────────────────────────────────────────────────────────────────────
   Track gallery (pinned horizontal track of tall video cards) · giant
   marquee + "Listed automatically" band · live partner directory (renders
   nothing until the API has partners).
──────────────────────────────────────────────────────────────────────────── */

/* ── Track gallery: pinned horizontal track of tall video cards ─────────── */
function TrackCard({ tr, i }: { tr: Track; i: number }) {
  return (
    <article className="group relative flex h-[min(64svh,560px)] min-h-[440px] flex-col justify-end overflow-hidden rounded-3xl bg-[#0B1220] text-white ring-1 ring-white/10">
      <a href={tr.href} aria-label={tr.cta} className="absolute inset-0 z-0">
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
          {tr.clip ? <BgVideo clip={tr.clip} dim={0.1} /> : <img src={tr.photo.src} alt={tr.photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        </div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.55) 0%, rgba(5,8,14,0) 28%, rgba(5,8,14,.45) 55%, rgba(5,8,14,.96) 100%)' }} />
      </a>
      <div className="pointer-events-none absolute inset-x-5 top-5 z-10 flex items-center justify-between sm:inset-x-6 sm:top-6">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md"><tr.icon size={15} /></span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white/90 ring-1 ring-white/25 backdrop-blur-md">{tr.product}</span>
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-white/60" style={NUM}>0{i + 1}</span>
      </div>
      <div className="relative z-10 p-5 sm:p-7">
        <h3 className="text-[28px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[32px]">{tr.title}</h3>
        <p className="mt-2 max-w-[38ch] text-[14.5px] leading-[1.55] text-white/75">{tr.line}</p>
        <ul className="mt-4 space-y-1.5">
          {tr.bullets.map(b => (
            <li key={b} className="flex items-start gap-2 text-[13.5px] text-white/85"><Check size={15} className="mt-0.5 shrink-0 text-emerald-300" /> {b}</li>
          ))}
        </ul>
        <div className="mt-6">
          <GlowButton href={tr.href} size="md">{tr.cta} <ArrowRight size={15} /></GlowButton>
        </div>
      </div>
    </article>
  );
}

/** Closing card of the gallery: every service a Zyphix Book pro can list. */
function ServicesCard() {
  return (
    <div className="flex h-[min(64svh,560px)] min-h-[440px] flex-col justify-between rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-7">
      <div>
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Zyphix Book categories</p>
        <p className="mt-4 text-[26px] font-semibold leading-[1.08] tracking-[-0.04em] text-white">Ten trades, one verified badge.</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {SERVICES.map(s => <li key={s} className="rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-[13px] font-medium text-white/85">{s}</li>)}
      </ul>
      <a href="/services" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-300 hover:text-emerald-200">Join as a professional <ArrowRight size={15} /></a>
    </div>
  );
}

export function TrackBento() {
  const [delivery, restaurant, services, store] = TRACKS;
  const order = [delivery, restaurant, store, services];
  return (
    <HScrollGallery
      id="tracks"
      cardClass="w-[84vw] sm:w-[400px]"
      header={
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker light>Choose your track</Kicker>
            <h2 className="max-w-[18ch] text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[46px] md:text-[58px]">
              Four ways in. One <Accent green>neighbourhood</Accent> network.
            </h2>
          </div>
          <p className="hidden max-w-[44ch] text-[17px] leading-[1.6] text-white/65 lg:col-span-5 lg:block">Each track has a short guided application and its own onboarding manager. Scroll to see them all.</p>
        </div>
      }
      items={[...order.map((tr, i) => <TrackCard key={tr.id} tr={tr} i={i} />), <ServicesCard key="svc" />]}
    />
  );
}

/* ── Listed automatically ───────────────────────────────────────────────── */
const DESTINATIONS = [
  { host: 'now.zyphix.in', href: NOW_SITE, who: 'Stores & shop owners', what: 'Your shelves, at shelf prices, 30-minute delivery.' },
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
    <Dark className="pb-24 pt-16 md:pb-36 md:pt-24">
      <Glow x="15%" y="20%" size={900} alpha={0.22} />
      <Grain />
      <GiantMarquee words={['Deliver', 'Cook', 'Sell', 'Fix']} className="relative border-b border-white/10 pb-12 md:pb-20" />
      <Container className="mt-16 md:mt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal><Kicker light>Listed automatically</Kicker></Reveal>
            <Reveal delay={0.05}><Headline light size="lg" className="text-balance">Register once. Go live where people shop.</Headline></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-6 max-w-[480px]">Your listing is built from your registration and goes live on the Zyphix product for your track. People in your area see you in the app and on the web, with no separate storefront to maintain.</Sub></Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <Reveal y={32} className="col-span-2">
                <PhotoTile photo={landscape('kirana', 0)} ratio="16/8" rounded="rounded-3xl" className="!bg-[#111827] ring-1 ring-white/10">
                  <DestLabel {...DESTINATIONS[0]} />
                </PhotoTile>
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
