import React from 'react';
import { motion } from 'framer-motion';
import { Container, G } from '@/ui/kit';
import { Light, Kicker, Headline, Sub, Reveal, isStatic, EASE } from '@/ui/cinema';

/* ────────────────────────────────────────────────────────────────────────────
   How it works — five steps on a timeline whose line draws in on scroll
   (horizontal on desktop, vertical on mobile; static under ?noanim).
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  ['Brief', 'Tell us the business, the areas and what you want to happen.'],
  ['Plan & flat quote', 'Formats, areas, dates and one written price.'],
  ['Creative review', 'We check artwork against spec; one revision round included.'],
  ['Go live', 'Your placement runs for the booked period, labelled Sponsored.'],
  ['Report', 'A per-placement summary at the end of the period.'],
];

function Line({ vertical = false }: { vertical?: boolean }) {
  const base = vertical
    ? 'absolute bottom-6 left-5 top-6 w-px origin-top md:hidden'
    : 'absolute left-5 right-5 top-5 hidden h-px origin-left md:block';
  const style = { background: `linear-gradient(${vertical ? '180deg' : '90deg'}, ${G}, rgba(13,163,102,.15))` };
  if (isStatic()) return <div aria-hidden className={base} style={style} />;
  const from = vertical ? { scaleY: 0 } : { scaleX: 0 };
  const to = vertical ? { scaleY: 1 } : { scaleX: 1 };
  return (
    <motion.div aria-hidden className={base} style={style} initial={from} whileInView={to}
      viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.4, ease: EASE, delay: 0.15 }} />
  );
}

export function Process() {
  return (
    <Light id="process" className="scroll-mt-16 border-t border-gray-100 py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal><Kicker>How it works</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg">From brief to report in five steps.</Headline></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Sub>One written plan with a flat price before go-live, and one report per placement at the end of the period.</Sub>
          </Reveal>
        </div>

        <div className="relative mt-14 md:mt-20">
          <div aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-gray-200 md:block" />
          <div aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-gray-200 md:hidden" />
          <Line />
          <Line vertical />
          <ol className="relative grid gap-9 md:grid-cols-5 md:gap-6">
            {STEPS.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={0.1 + i * 0.1} y={20} className="relative flex gap-5 md:block">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-semibold ring-1 ring-gray-200 shadow-[0_0_0_6px_#fff]"
                  style={{ fontVariantNumeric: 'tabular-nums', color: i === 0 ? '#fff' : '#111827', background: i === 0 ? G : '#fff' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="pt-1.5 md:mt-6 md:pt-0">
                  <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-gray-900">{t}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-gray-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Light>
  );
}
