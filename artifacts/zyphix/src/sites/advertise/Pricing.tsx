import React from 'react';
import { Check, ArrowRight, Mail, Sparkles } from 'lucide-react';
import { G, HEAD_FONT, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2, PARTNERSHIPS_EMAIL } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Pricing — three tiers described by inclusions. No prices; custom quotes.
──────────────────────────────────────────────────────────────────────────── */

const TIERS = [
  {
    name: 'Starter', tag: 'One placement, one neighbourhood', featured: false,
    d: 'For a single restaurant, store, service business or a brand testing one locality.',
    rows: [['Placements', '1 format (any)'], ['Areas', '1 delivery area, up to 6 pin codes'], ['Duration', '7 or 14 days'], ['Creative', 'Spec check + one revision round'], ['Reporting', 'End-of-period placement report'], ['Support', 'Email, partnerships@zyphix.in']],
  },
  {
    name: 'Growth', tag: 'Multi-format, multi-area', featured: true,
    d: 'For FMCG and D2C brands running a launch or promotion across several neighbourhoods.',
    rows: [['Placements', 'Up to 3 formats, combined (e.g. banner + row + coupon)'], ['Areas', 'Up to 5 delivery areas in one city'], ['Duration', '14 or 30 days, dayparts included'], ['Creative', 'Adaptation help + local-language copy check'], ['Reporting', 'Mid-period check-in + end-of-period report, CSV'], ['Support', 'Named partnerships manager']],
  },
  {
    name: 'Enterprise', tag: 'City-wide and multi-city', featured: false,
    d: 'For national brands and agencies planning always-on or multi-city programmes.',
    rows: [['Placements', 'All six formats, any mix'], ['Areas', 'Multiple cities as Zyphix launches them'], ['Duration', 'Quarterly or annual, with first choice of new areas'], ['Creative', 'Dedicated review lane, shared asset library'], ['Reporting', 'Weekly reports + quarterly review'], ['Support', 'Partnerships lead + agency billing']],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className={`${CONTAINER} scroll-mt-20 py-20 md:py-24`}>
      <div className="mx-auto max-w-[680px] text-center">
        <Eyebrow>Pricing</Eyebrow>
        <H2>Flat rates. Custom quotes. Nothing hidden.</H2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">Every plan is priced flat per placement, per area, per period — quoted in writing before anything goes live, and unchanged mid-campaign. Pick the shape that fits and we'll send a quote within 2 working days.</p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {TIERS.map(t => (
          <div key={t.name} className={`relative flex flex-col rounded-[28px] border p-7 ${t.featured ? 'border-emerald-300 bg-white shadow-[0_24px_60px_rgba(13,163,102,.16)] ring-4 ring-emerald-100' : 'border-gray-200 bg-white'}`}>
            {t.featured && <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: G }}><Sparkles size={11} /> Most chosen</span>}
            <p className="text-[12px] font-bold uppercase tracking-wider text-emerald-700">{t.tag}</p>
            <h3 className="mt-1 text-[28px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{t.name}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{t.d}</p>
            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Price</p>
              <p className="text-[16px] font-black text-gray-900" style={{ fontFamily: HEAD_FONT }}>Custom flat quote</p>
            </div>
            <dl className="mt-5 flex-1 space-y-3">
              {t.rows.map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check size={12} /></span>
                  <div><dt className="text-[11.5px] font-bold uppercase tracking-wider text-gray-400">{k}</dt><dd className="text-[14px] text-gray-800">{v}</dd></div>
                </div>
              ))}
            </dl>
            <a href="#contact" className={`mt-7 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold transition hover:-translate-y-0.5 ${t.featured ? 'text-white' : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}`} style={t.featured ? { background: G } : undefined}>
              Custom quote <ArrowRight size={16} />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-gray-50 px-6 py-5 md:flex-row">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-gray-700">
          {['No auctions or bidding', 'Cancel or change areas between periods', 'Early advertisers get first choice of new areas', 'GST invoice for every period'].map(x => <span key={x} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{x}</span>)}
        </div>
        <a href={`mailto:${PARTNERSHIPS_EMAIL}?subject=Advertising%20quote`} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13.5px] font-bold text-white" style={{ background: INK }}><Mail size={15} /> Email for a quote</a>
      </div>
    </section>
  );
}
