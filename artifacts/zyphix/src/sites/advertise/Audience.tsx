import React from 'react';
import { ShoppingBasket, UtensilsCrossed, Wrench, Package } from 'lucide-react';
import { Container } from '@/ui/kit';
import { Dark, Glow, Grain, Kicker, Headline, Sub, Reveal } from '@/ui/cinema';
import { Targeting } from './Targeting';

/* ────────────────────────────────────────────────────────────────────────────
   Who it's for + Targeting — one dark band (Glow + Grain). Four audience
   cards, then the targeting story with a parallax city photo.
──────────────────────────────────────────────────────────────────────────── */

const TILES: Array<{ icon: React.ReactNode; title: string; line: string; chips: string[]; span: string }> = [
  { icon: <ShoppingBasket size={18} />, title: 'FMCG brands', line: 'Put a range in front of shoppers at the kirana shelf where it is already stocked.', chips: ['Sponsored row', 'Spotlight'], span: 'lg:col-span-7' },
  { icon: <UtensilsCrossed size={18} />, title: 'Local restaurants', line: 'Be the featured card for the neighbourhood you deliver to.', chips: ['Featured in Eats', 'Search'], span: 'lg:col-span-5' },
  { icon: <Wrench size={18} />, title: 'Home-service businesses', line: 'Salons, cleaners and repair pros, shown inside their own service radius.', chips: ['Featured in Book', 'Home banner'], span: 'lg:col-span-5' },
  { icon: <Package size={18} />, title: 'D2C brands', line: 'Test a locality before committing to a city, with a coupon to earn the first order.', chips: ['Home banner', 'Offers & coupons'], span: 'lg:col-span-7' },
];

export function Audience() {
  return (
    <Dark id="audience" className="scroll-mt-16 py-24 md:py-36">
      <Glow x="85%" y="8%" size={900} alpha={0.28} />
      <Glow x="5%" y="78%" size={760} alpha={0.18} />
      <Grain />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal><Kicker light>Who it's for</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg" light>Built for businesses that sell by neighbourhood.</Headline></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Sub light>If your customers are decided by a delivery radius, the placement should be too.</Sub>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-12">
          {TILES.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06} y={24} className={t.span}>
              <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[.04] p-6 transition-colors duration-500 hover:border-emerald-300/30 hover:bg-white/[.07] sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/25">{t.icon}</span>
                <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.02em] text-white">{t.title}</h3>
                <p className="mt-2 max-w-[460px] text-[15px] leading-[1.6] text-white/60">{t.line}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {t.chips.map(c => <span key={c} className="rounded-full border border-white/15 bg-white/[.06] px-2.5 py-1 text-[12px] font-medium text-white/80">{c}</span>)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 border-t border-white/10 pt-24 md:mt-32 md:pt-32">
          <Targeting />
        </div>
      </Container>
    </Dark>
  );
}
