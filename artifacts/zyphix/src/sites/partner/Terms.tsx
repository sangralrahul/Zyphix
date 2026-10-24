import React from 'react';
import { motion } from 'framer-motion';
import { Headset, IndianRupee, UserRound } from 'lucide-react';
import { Container, Grid, Section, SectionTitle, fade, Chip, Hairline } from '@/ui/kit';

/* ── INK statement: terms & people ───────────────────────────────────────── */
const COLS = [
  { icon: UserRound, title: 'Onboarding manager', body: 'A named person walks you from application to go-live. Same contact for documents, setup and your first week.' },
  { icon: IndianRupee, title: 'Commission explained before go-live', body: 'Rates, settlement cycle and what counts as a deduction are written down and agreed before your listing goes live.' },
  { icon: Headset, title: 'Support Mon–Sat, 9am–7pm IST', body: 'Partner support on phone and email during working hours. Order-time issues are routed to a live team.' },
];

export function TermsBand() {
  return (
    <Section id="terms" tone="ink" className="isolate overflow-hidden scroll-mt-16">
      <Grid dark />
      <Container>
        <SectionTitle dark eyebrow="How we work" title="Transparent terms. Real people." lead="No surprises after go-live. These are commitments about process, not promises about earnings." />
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {COLS.map((c, i) => (
            <motion.div key={c.title} {...fade(0.08 * i)} className="border-t border-white/10 pt-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10"><c.icon size={18} /></span>
              <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-white">{c.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.65] text-white/60">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ── 4-step onboarding row ───────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Apply', body: 'Pick a track and fill a short form. Takes about ten minutes.', need: ['Phone number', 'Your area'] },
  { n: '02', title: 'Verification call', body: 'Your onboarding manager calls within two working days to confirm details.', need: ['Government ID', 'Bank account'] },
  { n: '03', title: 'Set up', body: 'Menu, catalogue, rate card or vehicle details — set up together with our team.', need: ['Menu / catalogue', 'FSSAI or RC (if applicable)'] },
  { n: '04', title: 'Go live', body: 'Your listing or partner app goes live. Same person stays with you through week one.', need: ['Partner app', 'Smartphone'] },
];

export function Steps() {
  return (
    <Section id="onboarding" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="Onboarding" title="Four steps from application to go-live." lead="Free to apply, no joining fee. What you need at each step is listed below." />
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-5 hidden md:block"><Hairline /></div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((s, i) => (
              <motion.li key={s.n} {...fade(0.08 * i)} className="relative">
                <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,.04)]">{s.n}</span>
                <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{s.body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.need.map(n => <Chip key={n}>{n}</Chip>)}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
