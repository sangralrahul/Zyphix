import React from 'react';
import { Store, ShieldCheck, Handshake } from 'lucide-react';
import { HEAD_FONT, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, unsplash } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Dark INK statement band with three supporting columns.
──────────────────────────────────────────────────────────────────────────── */

const COLS = [
  { icon: <Store size={20} />, t: 'Built on real local inventory', d: 'Every placement links to something a partner store, kitchen or professional nearby can actually deliver. No dead-end clicks to an out-of-stock page.' },
  { icon: <ShieldCheck size={20} />, t: 'Labelled, limited, respectful', d: 'Sponsored placements are always marked, capped per screen, and never replace organic results. Customers keep trusting the app, which keeps your ad worth something.' },
  { icon: <Handshake size={20} />, t: 'Shared upside with partners', d: 'Sponsored orders still go through the local store or restaurant. Your spend grows their business too — which is why they stock, display and recommend what you push.' },
];

export function Statement() {
  return (
    <section className="relative overflow-hidden text-white" style={{ background: INK }}>
      <img src={unsplash('photo-1526367790999-0150786686a2')} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${INK} 0%, rgba(11,18,32,.92) 55%, rgba(11,18,32,.75) 100%)` }} />
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(900px 500px at 85% 0%, rgba(13,163,102,.35), transparent 60%)' }} />
      <div className={`${CONTAINER} relative py-20 md:py-28`}>
        <Eyebrow tone="dark">Why advertise here</Eyebrow>
        <h2 className="mt-4 max-w-[900px] font-black tracking-[-0.035em] leading-[1.02] text-[2.4rem] sm:text-[3.2rem] lg:text-[4rem]" style={{ fontFamily: HEAD_FONT }}>
          Built for the people who already run your neighbourhood — <span className="text-emerald-400">and the brands they stock.</span>
        </h2>
        <p className="mt-6 max-w-[620px] text-[16.5px] leading-relaxed text-white/70">
          Zyphix exists so that the kirana, the dhaba and the electrician down the road can compete with warehouses and apps. Advertising on Zyphix is how a brand shows up inside that local economy instead of around it.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {COLS.map(c => (
            <div key={c.t} className="rounded-3xl border border-white/10 bg-white/[.04] p-6 backdrop-blur-sm transition hover:bg-white/[.07]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">{c.icon}</span>
              <h3 className="mt-4 text-[17px] font-extrabold" style={{ fontFamily: HEAD_FONT }}>{c.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/65">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
