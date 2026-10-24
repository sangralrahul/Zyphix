import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Section, Container, SectionTitle, Card, Button, Chip, fade } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Pricing — three tiers described by inclusions only. No prices.
──────────────────────────────────────────────────────────────────────────── */

const TIERS = [
  {
    name: 'Starter', tag: 'One placement, one area', featured: false,
    d: 'A single store, restaurant or service business — or a brand testing one locality.',
    rows: [['Placements', '1 format'], ['Areas', '1 delivery area'], ['Duration', '7 or 14 days'], ['Support', 'Email']],
  },
  {
    name: 'Growth', tag: 'Multi-format, multi-area', featured: true,
    d: 'Brands running a launch or promotion across several neighbourhoods in one city.',
    rows: [['Placements', 'Up to 3 formats, combined'], ['Areas', 'Up to 5 delivery areas'], ['Duration', '14 or 30 days, dayparts included'], ['Support', 'Named partnerships contact']],
  },
  {
    name: 'Enterprise', tag: 'City-wide and multi-city', featured: false,
    d: 'National brands and agencies planning always-on or multi-city programmes.',
    rows: [['Placements', 'All six formats, any mix'], ['Areas', 'Multiple cities as they launch'], ['Duration', 'Quarterly or annual'], ['Support', 'Partnerships lead, agency billing']],
  },
];

export function Pricing() {
  return (
    <Section id="pricing" className="scroll-mt-16">
      <Container>
        <SectionTitle align="center" eyebrow="Pricing" title="Flat rates. Written quotes." lead="Every placement is priced flat per period and quoted before anything goes live. Pick the shape that fits and we'll send a custom quote." />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div key={t.name} {...fade(i * 0.08)}>
              <Card className={`flex h-full flex-col p-7 ${t.featured ? 'ring-1 ring-emerald-200 shadow-[0_12px_40px_rgba(13,163,102,.10)]' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">{t.name}</h3>
                  {t.featured && <Chip tone="green">Most chosen</Chip>}
                </div>
                <p className="mt-1 text-[13px] font-medium text-emerald-700">{t.tag}</p>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-gray-600">{t.d}</p>
                <dl className="mt-6 flex-1 space-y-3 border-t border-gray-200 pt-6">
                  {t.rows.map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <Check size={15} className="mt-[3px] shrink-0 text-emerald-600" />
                      <div className="text-[14px]"><dt className="inline font-medium text-gray-900">{k}: </dt><dd className="inline text-gray-600">{v}</dd></div>
                    </div>
                  ))}
                </dl>
                <Button href="#contact" variant={t.featured ? 'primary' : 'secondary'} className="mt-7 w-full">Custom quote <ArrowRight size={15} /></Button>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-[13.5px] text-gray-500">No auctions or bidding · Change areas between periods · GST invoice for every period</p>
      </Container>
    </Section>
  );
}
