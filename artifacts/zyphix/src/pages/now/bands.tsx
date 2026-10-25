/**
 * Zyphix Now — premium interstitial bands that sit between the product rows.
 * They never replace shop UI: the grid stays fast and scannable around them.
 *
 *  HeroLiveOrder   floating live order card for the desktop hero
 *  MarketBand      "Fresh from the market" ClipWall (vegMarket, fruit, packing, merchant, spices)
 *  TrackBand       "Track every order live" RouteMap + the 30-minute promise
 *  useRotatingWord rotating search placeholder (milk, atta, bananas…)
 */
import React, { useEffect, useState } from 'react';
import { ArrowRight, Store, PackageCheck, Bike } from 'lucide-react';
import { Reveal, Glow, Grain, isStatic } from '@/ui/cinema';
import { Accent, ClipWall, RouteMap, LiveOrder } from '@/ui/motion2';
import { VIDEOS } from '@/data/media';

/** Display headline style used on Now bands (Geist, tight tracking). */
export const DISPLAY = 'font-semibold tracking-[-0.04em] text-balance';

/** Cycles through `words` every `ms` (static under ?noanim / reduced motion). */
export function useRotatingWord(words: string[], ms = 2200) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (isStatic() || words.length < 2) return;
    const id = window.setInterval(() => setI(v => (v + 1) % words.length), ms);
    return () => window.clearInterval(id);
  }, [words.length, ms]);
  return words[i % words.length];
}

/** Floating live-order card over the hero (desktop only). */
export function HeroLiveOrder() {
  return (
    <div className="pointer-events-none absolute bottom-24 right-10 z-10 hidden w-[300px] xl:block">
      <Reveal delay={0.5} y={20}>
        <LiveOrder dark className="pointer-events-auto" items={['Fresh milk 1 L', 'Whole-wheat flour 5 kg', 'Bananas · 6']} />
      </Reveal>
    </div>
  );
}

/** Dark ClipWall band: the supply side behind the grid. */
export function MarketBand({ onShopProduce }: { onShopProduce?: () => void }) {
  return (
    <section aria-label="Fresh from the market" className="relative isolate -mx-4 overflow-hidden bg-[#05080E] px-4 py-12 text-white md:mx-0 md:rounded-3xl md:px-8 md:py-14">
      <Glow x="12%" y="0%" size={700} alpha={0.22} />
      <Grain opacity={0.05} />
      <div className="relative">
        <Reveal y={16} amount={0.3} className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-9">
          <div className="max-w-[560px]">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Sourced every morning</p>
            <h2 className={`${DISPLAY} max-w-[18ch] text-[30px] leading-[1.04] md:text-[44px]`}>
              Fresh from the <Accent green>market</Accent>, packed near you.
            </h2>
          </div>
          <div className="max-w-[360px]">
            <p className="text-[14.5px] leading-[1.6] text-white/65">
              Produce comes in from local markets each morning, gets checked and packed at stores in your neighbourhood, then leaves with a rider.
            </p>
            {onShopProduce && (
              <button type="button" onClick={onShopProduce}
                className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-semibold text-gray-900 transition hover:-translate-y-px hover:bg-emerald-50">
                Shop fruits &amp; veg <ArrowRight size={14} />
              </button>
            )}
          </div>
        </Reveal>
        <Reveal y={20} amount={0.15}>
          {/* 3-col override: the shared 5-tile spans fill a 3×3 grid exactly (4 cols leaves a hole) */}
        <ClipWall
            clips={[VIDEOS.vegMarket, VIDEOS.fruit, VIDEOS.packing, VIDEOS.merchant, VIDEOS.spices]}
            labels={['Fresh produce', 'Seasonal fruit', 'Packed to order', 'Your local store', 'Whole spices']}
          />
        </Reveal>
      </div>
    </section>
  );
}

/** Split band: promise steps on the left, live RouteMap on the right. */
export function TrackBand() {
  const steps = [
    { icon: <Store size={15} />, t: 'Picked at a store near you', s: 'Your order goes to the closest partner store with everything in stock.' },
    { icon: <PackageCheck size={15} />, t: 'Packed in minutes', s: 'Items are checked and bagged as soon as you pay.' },
    { icon: <Bike size={15} />, t: 'Tracked to your door', s: 'Follow the rider on the map with a live ETA.' },
  ];
  return (
    <section aria-label="Track every order live" className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
      <div className="grid items-stretch md:grid-cols-[1fr_1.15fr]">
        <Reveal y={16} amount={0.25} className="flex flex-col justify-center p-6 md:p-10">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">The 30-minute promise</p>
          <h2 className={`${DISPLAY} max-w-[16ch] text-[28px] leading-[1.05] text-gray-900 md:text-[40px]`}>
            Track every order <Accent green>live</Accent>.
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
          <RouteMap dark className="aspect-[56/38] md:aspect-auto md:h-full md:min-h-[420px]" minutes={30} />
        </div>
      </div>
    </section>
  );
}
