import React, { useMemo } from 'react';
import { MapPin, Store, CreditCard, Navigation, UtensilsCrossed, Wrench, Check } from 'lucide-react';
import { Light, Kicker, Sub, Reveal, Counter, Ticker, PhotoTile } from '@/ui/cinema';
import { Accent, RouteMap } from '@/ui/motion2';
import { Container } from '@/ui/kit';
import { landscape } from '@/data/media';
import { usePartners, type PartnerListing } from '@/lib/partners';
import { NUM, PARTNER_SITE, Display, TileLabel } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   "How it works" (id="how") — live route animation beside the four steps and
   the promise list, then the live-proof band fed by the real partner directory.
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: <MapPin size={17} />, title: 'Set your location', body: 'We only show stores, kitchens and pros that serve your street.' },
  { icon: <Store size={17} />, title: 'Pick from local partners', body: 'Real shelves, real menus, real slots, at the partner’s own prices.' },
  { icon: <CreditCard size={17} />, title: 'Pay how you like', body: 'UPI, cards, wallets or cash on delivery. No hidden charges.' },
  { icon: <Navigation size={17} />, title: 'Track it live', body: 'Watch the rider or pro on the map, right to your door.' },
];

const PROMISES = ['Free delivery on bigger baskets', 'No markup on shelf or menu prices', 'No surge pricing', 'Credit if we are late'];

export function HowItWorks() {
  return (
    <Light id="how" className="scroll-mt-16 py-24 md:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal><Kicker>How it works</Kicker></Reveal>
            <Reveal delay={0.05}><Display>Watch your order <Accent green>move</Accent>.</Display></Reveal>
            <Reveal delay={0.1}><Sub className="mt-6 max-w-[44ch]">The same four steps for groceries, food and services. One login, one wallet, one order history.</Sub></Reveal>

            <ol className="mt-10 border-t border-gray-200">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={0.1 + i * 0.06} y={16} className="flex gap-4 border-b border-gray-200 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{s.icon}</span>
                  <div>
                    <p className="text-[16.5px] font-semibold tracking-[-0.02em] text-gray-900"><span className="mr-2 text-[13px] font-medium text-gray-400" style={NUM}>0{i + 1}</span>{s.title}</p>
                    <p className="mt-1 text-[14.5px] leading-[1.55] text-gray-600">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <Reveal y={32}>
              <RouteMap className="aspect-[4/3] w-full shadow-[0_40px_100px_-40px_rgba(11,15,25,.55)] sm:aspect-[560/380]" />
            </Reveal>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.1} y={24}>
                <PhotoTile photo={landscape('deliveryBag', 2)} ratio="4/3" rounded="rounded-3xl" className="!bg-[#0B1220]">
                  <TileLabel title="Handed over, not dropped" />
                </PhotoTile>
              </Reveal>
              <Reveal delay={0.16} y={24} className="flex flex-col justify-between rounded-3xl bg-[#F6F7F9] p-5 ring-1 ring-gray-200 sm:p-6">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700">The promise</p>
                <ul className="mt-3 space-y-2.5">
                  {PROMISES.map(p => (
                    <li key={p} className="flex items-start gap-2.5 text-[13.5px] font-medium leading-[1.4] text-gray-800 sm:text-[14.5px]">
                      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#0DA366] text-white"><Check size={11} strokeWidth={3} /></span>{p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Light>
  );
}

/* ── Live proof: real partner directory ──────────────────────────────────── */
const TYPE_LABEL: Record<PartnerListing['type'], { label: string; icon: React.ReactNode }> = {
  store: { label: 'Store', icon: <Store size={13} /> },
  restaurant: { label: 'Restaurant', icon: <UtensilsCrossed size={13} /> },
  service: { label: 'Pro', icon: <Wrench size={13} /> },
  delivery: { label: 'Rider', icon: <Navigation size={13} /> },
};

export function LiveProof() {
  const stores = usePartners('store');
  const restaurants = usePartners('restaurant');
  const pros = usePartners('service');
  const all = useMemo(() => {
    const seen = new Set<string>();
    return [...stores.partners, ...restaurants.partners, ...pros.partners].filter(p => p.name && !seen.has(p.id) && seen.add(p.id));
  }, [stores.partners, restaurants.partners, pros.partners]);
  // A directory with a handful of names reads as "just launched"; show it once there is a real network.
  if (all.length < 6) return null;

  const items = all.slice(0, 40).map(p => {
    const t = TYPE_LABEL[p.type] ?? TYPE_LABEL.store;
    return (
      <span key={p.id} className="inline-flex h-11 items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 text-[14px] font-medium text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">{t.icon}</span>
        {p.name}
        <span className="text-[12px] text-gray-400">{[t.label, p.locality || p.city].filter(Boolean).join(' · ')}</span>
      </span>
    );
  });
  return (
    <Light tone="soft" className="border-y border-gray-100 py-16 md:py-20">
      <Container>
        <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Kicker>Live partner directory</Kicker>
            <h2 className="text-[26px] font-semibold tracking-[-0.035em] text-gray-900 sm:text-[32px]">
              <span style={NUM}><Counter to={all.length} /></span> local businesses already on Zyphix
            </h2>
          </div>
          <a href={PARTNER_SITE} target="_blank" rel="noopener noreferrer" className="text-[14.5px] font-semibold text-emerald-700">Add your business</a>
        </Reveal>
      </Container>
      <Reveal delay={0.1} y={0} className="mt-8">
        <Ticker items={items} speed={Math.max(30, items.length * 3)} size="text-[14px]" />
      </Reveal>
    </Light>
  );
}
