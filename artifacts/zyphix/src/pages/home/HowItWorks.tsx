import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Store, CreditCard, Navigation, UtensilsCrossed, Wrench } from 'lucide-react';
import { Dark, Light, Glow, Grain, Kicker, Headline, Sub, Reveal, Counter, Ticker, isStatic, EASE } from '@/ui/cinema';
import { Container } from '@/ui/kit';
import { usePartners, type PartnerListing } from '@/lib/partners';
import { NUM, PARTNER_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   "How it works" (id="how") — four horizontal steps with an animated connector,
   then the live-proof band fed by the real partner directory.
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: <MapPin size={20} />, title: 'Set your location', body: 'Drop a pin or type your colony. We only show stores, kitchens and pros that actually serve your street.' },
  { icon: <Store size={20} />, title: 'Pick from local partners', body: 'Real shelves, real menus, real slots. Prices are the partner’s own, with no markup from us.' },
  { icon: <CreditCard size={20} />, title: 'Pay how you like', body: 'UPI, cards, net banking, wallets or cash on delivery. The total you see is the total you pay.' },
  { icon: <Navigation size={20} />, title: 'Track it live', body: 'Watch your rider or pro on the map. Groceries in 30 minutes, food while it is hot, pros on the slot you chose.' },
];

function Connector() {
  const stat = isStatic();
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-6 hidden h-px w-full md:block">
      <div className="absolute inset-0 bg-white/10" />
      <motion.div
        className="absolute inset-0 origin-left"
        style={{ background: 'linear-gradient(90deg, #0DA366, #19C27C 60%, rgba(25,194,124,.3))' }}
        initial={stat ? false : { scaleX: 0 }}
        whileInView={stat ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      />
    </div>
  );
}

export function HowItWorks() {
  return (
    <Dark id="how" className="scroll-mt-16 border-t border-white/[.06] py-24 md:py-36">
      <Glow x="50%" y="0%" size={1100} alpha={0.3} />
      <Grain />
      <Container>
        <div className="max-w-[720px]">
          <Reveal><Kicker light>How it works</Kicker></Reveal>
          <Reveal delay={0.05}><Headline light size="lg">Four taps between you and your door.</Headline></Reveal>
          <Reveal delay={0.1}><Sub light className="mt-6">The same flow for groceries, food and services. One login, one wallet, one order history.</Sub></Reveal>
        </div>

        <div className="relative mt-16 md:mt-20">
          <Connector />
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.12 + i * 0.12} y={28} className="relative flex gap-5 md:block">
                {/* vertical connector on mobile */}
                {i < STEPS.length - 1 && <span aria-hidden className="absolute left-6 top-12 h-[calc(100%+40px)] w-px bg-white/10 md:hidden" />}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-[#05080E] text-emerald-300 shadow-[0_0_0_6px_#05080E,0_0_40px_rgba(13,163,102,.35)]">
                  {s.icon}
                </div>
                <div className="md:mt-7">
                  <p className="text-[13px] font-semibold tracking-[0.12em] text-emerald-300/80" style={NUM}>
                    <Counter to={i + 1} duration={0.9} format={n => String(Math.round(n)).padStart(2, '0')} />
                  </p>
                  <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-white">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-white/60">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Dark>
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
  if (!all.length) return null;

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
    <Light tone="soft" className="py-16 md:py-20">
      <Container>
        <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Kicker>Live partner directory</Kicker>
            <h2 className="text-[26px] font-semibold tracking-[-0.025em] text-gray-900 sm:text-[32px]">
              <span style={NUM}><Counter to={all.length} /></span> {all.length === 1 ? 'partner' : 'partners'} registered on Zyphix
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
