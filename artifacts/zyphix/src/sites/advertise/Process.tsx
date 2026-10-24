import React from 'react';
import { motion } from 'framer-motion';
import { Section, Container, SectionTitle, fade, G } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   How it works — five numbered steps in one row with a connecting hairline.
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  ['Brief', 'Tell us the business, the areas and what you want to happen.'],
  ['Plan & flat quote', 'Formats, areas, dates and one written price.'],
  ['Creative review', 'We check artwork against spec; one revision round included.'],
  ['Go live', 'Your placement runs for the booked period, labelled Sponsored.'],
  ['Report', 'A per-placement summary at the end of the period.'],
];

export function Process() {
  return (
    <Section id="process" tone="soft" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="How it works" title="From brief to report in five steps." />
        <ol className="relative mt-12 grid gap-8 md:grid-cols-5 md:gap-6">
          <div aria-hidden className="absolute left-4 top-0 hidden h-px w-[calc(100%-2rem)] bg-gray-200 md:block" style={{ top: 16 }} />
          {STEPS.map(([t, d], i) => (
            <motion.li key={t} {...fade(i * 0.07)} className="relative flex gap-4 md:block">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[12.5px] font-semibold text-gray-900 ring-4 ring-[#FAFAFA]" style={i === 0 ? { borderColor: G, color: G } : undefined}>{i + 1}</span>
              <div className="md:mt-5">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">{t}</p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-gray-600">{d}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
