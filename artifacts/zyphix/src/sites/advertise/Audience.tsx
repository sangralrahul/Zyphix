import React from 'react';
import { Package, UtensilsCrossed, Wrench, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2, unsplash } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Who it's for — four photographic cards with concrete use-cases.
──────────────────────────────────────────────────────────────────────────── */

const AUDIENCE = [
  {
    icon: <Package size={18} />, tint: '#0DA366', label: 'FMCG brands', img: unsplash('photo-1550583724-b2692b85b150'),
    d: 'Your SKUs are already on kirana shelves. Make them the first thing a shopper sees in the categories you own.',
    uses: ['Sponsored row for a 5-SKU breakfast range in 20 pin codes', 'Spotlight a new pack size in Tea & coffee for 30 days', 'Search placement on "atta" and "aata" across one city zone'],
    formats: ['Row', 'Spotlight', 'Search'],
  },
  {
    icon: <UtensilsCrossed size={18} />, tint: '#EA580C', label: 'Local restaurants', img: unsplash('photo-1585937421612-70a008356fbe'),
    d: 'Be the featured spot in Zyphix Eats for your own neighbourhood — not a city-wide auction you can\'t win.',
    uses: ['Featured card on Friday–Sunday evenings within 3 km', 'Search placement on "biryani" for your delivery radius', '₹50-off first-order coupon to convert nearby first-timers'],
    formats: ['Featured', 'Search', 'Offers'],
  },
  {
    icon: <Wrench size={18} />, tint: '#2563EB', label: 'Home-service businesses', img: unsplash('photo-1581578731548-c64695cc6952'),
    d: 'Electricians, plumbers, cleaners and salons: get booked by households a few streets away who are already looking.',
    uses: ['Featured in Zyphix Book for AC servicing before summer', 'Home banner in Book for a deep-cleaning package in 2 sectors', 'Coupon for first booking, limited to your service radius'],
    formats: ['Featured', 'Banner', 'Offers'],
  },
  {
    icon: <ShoppingBag size={18} />, tint: '#7C3AED', label: 'D2C brands', img: unsplash('photo-1556740758-90de374c12ad'),
    d: 'Sample and launch locality by locality through partner stores, and see the baskets your spend actually lands in.',
    uses: ['Launch banner + coupon for a new snack in South Delhi pin codes', 'Spotlight to win trial against incumbent brands on the same shelf', 'Row placement for a seasonal gifting range for 14 days'],
    formats: ['Banner', 'Spotlight', 'Row', 'Offers'],
  },
];

export function Audience() {
  return (
    <section id="audience" className="scroll-mt-20 border-y border-gray-200 bg-gray-50">
      <div className={`${CONTAINER} py-20 md:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <Eyebrow>Who it's for</Eyebrow>
            <H2>Made for brands and businesses that sell locally.</H2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">Whether you sell across India or on one street, every placement is bounded by delivery area — so you only pay to reach people a partner can actually serve.</p>
          </div>
          <a href="#contact" className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-900 hover:bg-gray-100">Discuss your category <ArrowRight size={15} /></a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {AUDIENCE.map(a => (
            <article key={a.label} className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.10)]">
              <div className="relative h-[190px] overflow-hidden">
                <img src={a.img} alt={a.label} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0) 35%, rgba(11,18,32,.8) 100%)' }} />
                <span className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-900 shadow" style={{ color: a.tint }}>{a.icon}</span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <h3 className="text-[22px] font-black tracking-tight text-white" style={{ fontFamily: HEAD_FONT }}>{a.label}</h3>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[14px] leading-relaxed text-gray-600">{a.d}</p>
                <p className="mt-5 text-[11.5px] font-bold uppercase tracking-wider text-gray-400">Example plans</p>
                <ul className="mt-2 flex-1 space-y-2">
                  {a.uses.map(u => <li key={u} className="flex items-start gap-2 text-[13.5px] leading-snug text-gray-700"><Check size={14} className="mt-[3px] shrink-0" style={{ color: a.tint }} />{u}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {a.formats.map(f => <span key={f} className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: `${a.tint}14`, color: a.tint }}>{f}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
