import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Container, Button } from '@/ui/kit';
import { Light, Kicker, Headline, Sub, Reveal } from '@/ui/cinema';
import { Spotlight, Magnetic } from '@/ui/motion2';

/* ────────────────────────────────────────────────────────────────────────────
   Pricing — three tiers described by inclusions only (Spotlight cards). No prices.
──────────────────────────────────────────────────────────────────────────── */

const TIERS = [
  {
    name: 'Starter', tag: 'One placement, one area', featured: false,
    d: 'A single store, restaurant or service business — or a brand testing one locality.',
    rows: [['Placements', '1 format'], ['Areas', '1 delivery area'], ['Duration', '7 or 14 days'], ['Support', 'Email']],
  },
  {
    name: 'Growth', tag: 'Multi-format, multi-area', featured: true,
    d: 'Brands running a launch or promotion across several neighbourhoods.',
    rows: [['Placements', 'Up to 3 formats, combined'], ['Areas', 'Up to 5 delivery areas'], ['Duration', '14 or 30 days, dayparts included'], ['Support', 'Named partnerships contact']],
  },
  {
    name: 'Enterprise', tag: 'City-wide and multi-city', featured: false,
    d: 'Large brands and agencies planning always-on or multi-city programmes.',
    rows: [['Placements', 'All six formats, any mix'], ['Areas', 'Multiple cities as they launch'], ['Duration', 'Quarterly or annual'], ['Support', 'Partnerships lead, agency billing']],
  },
];

export function Pricing() {
  return (
    <Light id="pricing" className="scroll-mt-16 py-24 md:py-36">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <Reveal><Kicker>Pricing</Kicker></Reveal>
          <Reveal delay={0.05}><Headline size="lg" className="text-balance">Flat rates. Written quotes.</Headline></Reveal>
          <Reveal delay={0.1}><Sub className="mx-auto mt-5 max-w-[620px]">Every placement is priced flat per period and quoted before anything goes live. Pick the shape that fits and we'll send a custom quote.</Sub></Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} y={28}>
              <Spotlight dark={t.featured} color={t.featured ? 'rgba(52,211,153,.22)' : 'rgba(13,163,102,.10)'}
                className={`h-full [&>div:last-child]:h-full ${t.featured ? '!bg-[#05080E] shadow-[0_40px_90px_rgba(5,8,14,.28)]' : ''}`}>
              <article className={`relative flex h-full flex-col p-7 sm:p-8 ${t.featured ? 'text-white' : 'text-gray-900'}`}>
                {t.featured && <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(13,163,102,.45), transparent 70%)' }} />}
                <div className="relative flex items-center justify-between gap-3">
                  <h3 className="text-[28px] font-semibold tracking-[-0.04em]">{t.name}</h3>
                  {t.featured && <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[12px] font-semibold text-emerald-200 ring-1 ring-emerald-300/30">Recommended</span>}
                </div>
                <p className={`relative mt-1 text-[13.5px] font-semibold ${t.featured ? 'text-emerald-300' : 'text-emerald-700'}`}>{t.tag}</p>
                <p className={`relative mt-4 text-[15px] leading-[1.6] ${t.featured ? 'text-white/65' : 'text-gray-600'}`}>{t.d}</p>
                <dl className={`relative mt-7 flex-1 divide-y border-t ${t.featured ? 'divide-white/10 border-white/10' : 'divide-gray-100 border-gray-200'}`}>
                  {t.rows.map(([k, v]) => (
                    <div key={k} className="flex items-start gap-3 py-3.5">
                      <Check size={15} className={`mt-[3px] shrink-0 ${t.featured ? 'text-emerald-300' : 'text-emerald-600'}`} />
                      <div className="text-[14.5px]">
                        <dt className={`inline font-semibold ${t.featured ? 'text-white' : 'text-gray-900'}`}>{k}: </dt>
                        <dd className={`inline ${t.featured ? 'text-white/70' : 'text-gray-600'}`}>{v}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                {t.featured
                  ? <Magnetic strength={0.2} className="relative mt-7 w-full"><Button href="#contact" variant="primary" size="lg" className="w-full">Custom quote <ArrowRight size={15} /></Button></Magnetic>
                  : <Button href="#contact" variant="secondary" size="lg" className="relative mt-7 w-full">Custom quote <ArrowRight size={15} /></Button>}
              </article>
              </Spotlight>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-[14px] text-gray-500">No auctions or bidding · Change areas between periods · Tax invoice for every period</p>
        </Reveal>
      </Container>
    </Light>
  );
}
