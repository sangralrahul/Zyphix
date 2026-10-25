import React from 'react';
import { MapPin, Search, Clock, Check, ArrowRight } from 'lucide-react';
import { Kicker, Headline, Sub, Reveal, ParallaxImage, Stagger } from '@/ui/cinema';
import { PHOTOS } from '@/data/media';
import { IllustrativeTag } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Targeting — second half of the dark Audience band: copy + a parallax city
   photo with radius rings and three targeting callouts layered on top.
──────────────────────────────────────────────────────────────────────────── */

const LEVERS: Array<[string, string]> = [
  ['Delivery area', 'Pin codes, sectors or a radius around partner stores.'],
  ['Category intent', 'Shown in the category or search your product belongs to.'],
  ['Time of day', 'Optional dayparts — breakfast, evening, weekend.'],
];

const CALLOUTS = [
  { label: 'Delivery area', sub: '6 pin codes · your choice', icon: <MapPin size={13} />, cls: 'left-3 top-3 sm:left-5 sm:top-5' },
  { label: 'Category intent', sub: 'Searching "atta", browsing Staples', icon: <Search size={13} />, cls: 'right-3 top-[68%] sm:right-5' },
  { label: 'Time of day', sub: 'Evening, 6–10 pm', icon: <Clock size={13} />, cls: 'bottom-3 left-3 sm:bottom-5 sm:left-5' },
];

function RadiusPhoto() {
  return (
    <ParallaxImage photo={PHOTOS.city[0]} ratio="4/5" className="bg-gray-800 ring-1 ring-white/10" strength={10}>
      <div aria-hidden className="absolute inset-0 bg-[#05080E]/45" />
      {[92, 64, 36].map((r, i) => (
        <div key={r} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: `${r}%`, aspectRatio: '1 / 1', borderColor: `rgba(110,231,183,${0.25 + i * 0.2})`, background: `rgba(13,163,102,${0.06 + i * 0.05})` }} />
      ))}
      <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_0_0_8px_rgba(13,163,102,.25),0_12px_40px_rgba(13,163,102,.6)]" style={{ background: '#0DA366' }}>
        <MapPin size={19} />
      </div>
      {CALLOUTS.map((c, i) => (
        <Reveal key={c.label} delay={0.2 + i * 0.1} className={`absolute ${c.cls}`}>
          <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-[#05080E]/60 px-3 py-2 backdrop-blur-md">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200">{c.icon}</span>
            <div className="min-w-0"><p className="text-[12.5px] font-semibold text-white">{c.label}</p><p className="text-[11.5px] text-white/60">{c.sub}</p></div>
          </div>
        </Reveal>
      ))}
      <IllustrativeTag dark className="absolute right-3 top-4 sm:right-5 sm:top-6" />
    </ParallaxImage>
  );
}

export function Targeting() {
  return (
    <div id="targeting" className="scroll-mt-16 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6 lg:order-2">
        <Reveal><Kicker light>Targeting</Kicker></Reveal>
        <Reveal delay={0.05}><Headline size="lg" light>Target by where people shop, not who they are.</Headline></Reveal>
        <Reveal delay={0.1}><Sub light className="mt-5 max-w-[520px]">No profiles, no lookalikes. A placement runs in the delivery areas you pick, in the categories your product lives in, at the hours that matter.</Sub></Reveal>
        <Stagger className="mt-8 space-y-0 divide-y divide-white/10 border-y border-white/10" step={0.07}>
          {LEVERS.map(([t, d]) => (
            <div key={t} className="flex gap-3 py-4 text-[15px]">
              <Check size={16} className="mt-1 shrink-0 text-emerald-300" />
              <span className="text-white/65"><span className="font-semibold text-white">{t}.</span> {d}</span>
            </div>
          ))}
        </Stagger>
        <Reveal delay={0.1}>
          <a href="#contact" className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-emerald-300 transition hover:gap-2.5 hover:text-emerald-200">Ask which areas are live <ArrowRight size={15} /></a>
        </Reveal>
      </div>
      <Reveal y={32} className="mx-auto w-full max-w-[520px] lg:order-1 lg:col-span-6 lg:max-w-none">
        <RadiusPhoto />
      </Reveal>
    </div>
  );
}
