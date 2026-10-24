import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Store, Warehouse, Leaf, BadgeIndianRupee, Clock, ShieldCheck, Info } from 'lucide-react';
import { G, HEAD_FONT, SectionHead } from '@/components/layout/SiteChrome';
import { CONTAINER, fade } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Why Zyphix — qualitative comparison vs dark-store quick commerce.
──────────────────────────────────────────────────────────────────────────── */

type Row = { label: string; zyphix: string; dark: string; good: boolean };
const ROWS: Row[] = [
  { label: 'Where products come from', zyphix: 'The kirana, pharmacy or vegetable vendor a few streets away', dark: 'A centralised dark store or warehouse run by the platform', good: true },
  { label: 'Who keeps the margin', zyphix: 'The local shop. Zyphix charges a flat, transparent fee', dark: 'The platform; the neighbourhood store is bypassed', good: true },
  { label: 'Pricing', zyphix: 'Shelf price = app price. Zero surge, no hidden handling charge', dark: 'Platform-set prices; surge, handling and small-cart fees vary', good: true },
  { label: 'Impact on local shops', zyphix: 'Stores gain orders, tools and customers they keep', dark: 'Stores compete against the platform\'s own inventory', good: true },
  { label: 'Delivery radius', zyphix: 'Short, hyperlocal runs — usually under 3 km', dark: 'Set by warehouse coverage, not your neighbourhood', good: true },
  { label: 'Catalogue', zyphix: 'What local shops actually stock, including regional and seasonal items', dark: 'A standardised SKU list chosen centrally', good: true },
  { label: 'Relationship', zyphix: 'You know the store; the store knows you', dark: 'Anonymous fulfilment', good: true },
];

const PILLARS = [
  { icon: Leaf, t: 'Local-first marketplace', d: 'We work with independent kirana stores, restaurants and professionals — never against them with our own warehouses.' },
  { icon: BadgeIndianRupee, t: 'Transparent pricing', d: 'Shelf price is the app price. Any delivery fee is shown before you pay, and it never surges.' },
  { icon: Clock, t: 'Built for speed', d: 'Short distances and live inventory mean orders are packed and moving within minutes.' },
  { icon: ShieldCheck, t: 'Trust & safety', d: 'Verified partners, secure payments, live tracking and a real support team on every order.' },
];

export function Why() {
  return (
    <section id="why" className="scroll-mt-20 border-y border-gray-200 bg-gray-50">
      <div className={`${CONTAINER} py-20 md:py-24`}>
        <SectionHead eyebrow="Why Zyphix" title="Quick commerce that keeps your neighbourhood in business." sub="Dark-store apps are fast because they replace your local shops. Zyphix is fast because your local shops are already close — we just connect them to you." />

        <motion.div {...fade(.05)} className="mt-12 overflow-hidden rounded-[32px] border border-gray-200 bg-white">
          {/* header */}
          <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr] border-b border-gray-200 text-[12px] font-bold uppercase tracking-wider md:grid-cols-[1fr_1.3fr_1.3fr]">
            <div className="px-4 py-4 text-gray-400 md:px-6">Compare</div>
            <div className="flex items-center gap-2 border-l border-gray-200 bg-emerald-50/70 px-4 py-4 text-emerald-800 md:px-6"><span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: G }}><Store size={14} /></span> Zyphix</div>
            <div className="flex items-center gap-2 border-l border-gray-200 px-4 py-4 text-gray-500 md:px-6"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500"><Warehouse size={14} /></span> Dark-store apps</div>
          </div>
          {ROWS.map((r, i) => (
            <div key={r.label} className={`grid grid-cols-[1.1fr_1.2fr_1.2fr] text-[13.5px] md:grid-cols-[1fr_1.3fr_1.3fr] ${i < ROWS.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="px-4 py-4 font-bold text-gray-900 md:px-6">{r.label}</div>
              <div className="flex items-start gap-2 border-l border-gray-200 bg-emerald-50/40 px-4 py-4 text-gray-800 md:px-6">
                <Check size={15} className="mt-[3px] shrink-0 text-emerald-600" /> <span>{r.zyphix}</span>
              </div>
              <div className="flex items-start gap-2 border-l border-gray-200 px-4 py-4 text-gray-500 md:px-6">
                <Minus size={15} className="mt-[3px] shrink-0 text-gray-300" /> <span>{r.dark}</span>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-[12px] text-gray-500 md:px-6">
            <Info size={13} className="mt-[2px] shrink-0" /> A qualitative comparison of operating models, not a claim about any specific company. Delivery fees on Zyphix, where charged, are always shown before payment.
          </div>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((w, i) => (
            <motion.div key={w.t} {...fade(.1 + i * .05)} className="rounded-3xl border border-gray-200 bg-white p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><w.icon size={20} /></span>
              <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900" style={{ fontFamily: HEAD_FONT }}>{w.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{w.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
