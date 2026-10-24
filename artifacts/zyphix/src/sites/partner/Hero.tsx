import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Wallet } from 'lucide-react';
import { Aurora, Button, Container, Display, Eyebrow, fade, Glass, GradientText, Lead, Mesh, Phone } from '@/ui/kit';
import { PARTNERSHIPS_EMAIL } from './shared';
import { PartnerAppScreen } from './Mockups';

/* ── Hero ────────────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-16 md:pt-24">
      <Mesh intensity={0.9} />
      <Container className="grid items-center gap-14 pb-20 md:grid-cols-[1.05fr_.95fr] md:pb-28">
        <div className="max-w-[560px]">
          <motion.div {...fade(0)}><Eyebrow>Partner portal</Eyebrow></motion.div>
          <motion.div {...fade(0.05)}>
            <Display className="mt-5 text-gray-900">Grow with Zyphix <GradientText>in your neighbourhood.</GradientText></Display>
          </motion.div>
          <motion.div {...fade(0.1)}>
            <Lead className="mt-6 max-w-[500px]">Deliver, cook, fix or sell for customers a few streets away. Transparent terms, weekly payouts and a real onboarding manager from application to go-live.</Lead>
          </motion.div>
          <motion.div {...fade(0.15)} className="mt-8 flex flex-wrap gap-3">
            <Button href="#tracks" size="lg">Choose your track <ArrowRight size={16} /></Button>
            <Button href={`mailto:${PARTNERSHIPS_EMAIL}`} variant="secondary" size="lg">Talk to us</Button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[460px]">
          <div className="relative isolate overflow-hidden rounded-[32px] px-6 pt-10" style={{ background: 'linear-gradient(180deg, #F3FBF7 0%, #ECFDF5 100%)' }}>
            <Aurora className="opacity-80" />
            <div className="relative -mb-24">
              <Phone>
                <PartnerAppScreen />
              </Phone>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="absolute -left-4 top-[22%] hidden sm:block md:-left-10">
            <Glass className="flex items-center gap-3 p-3 pr-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100"><BadgeCheck size={17} /></span>
              <div>
                <p className="text-[12.5px] font-semibold text-gray-900">Verified member</p>
                <p className="text-[11px] text-gray-500">Zyphix Book · badge live</p>
              </div>
            </Glass>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85, duration: 0.6 }} className="absolute -right-2 bottom-[18%] hidden sm:block md:-right-8">
            <Glass className="flex items-center gap-3 p-3 pr-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Wallet size={17} /></span>
              <div>
                <p className="text-[12.5px] font-semibold text-gray-900">Weekly payout</p>
                <p className="text-[11px] text-gray-500">Settles every Monday</p>
              </div>
            </Glass>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ── Signal row ──────────────────────────────────────────────────────────── */
const SIGNALS = ['Free to apply', 'No joining fee', 'Verification call within 2 working days', 'Weekly payouts'];

export function Signals() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <Container>
        <ul className="grid grid-cols-2 divide-y divide-gray-200 sm:divide-y-0 md:grid-cols-4 md:divide-x">
          {SIGNALS.map((s, i) => (
            <motion.li key={s} {...fade(0.05 * i, 8)} className="flex items-center gap-2.5 py-5 text-[14px] font-medium text-gray-700 md:justify-center md:px-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{s}
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
