import React from 'react';
import { motion } from 'framer-motion';
import { Headset, IndianRupee, UserRound, Wallet, CalendarCheck, BadgeCheck, Smartphone, FileCheck, Clock, Banknote, ListChecks } from 'lucide-react';
import { Light, Dark, Glow, Grain, Kicker, Headline, Sub, Reveal, Stagger, ParallaxImage, Counter, isStatic, EASE } from '@/ui/cinema';
import { Container, Chip } from '@/ui/kit';
import { PARTNER_PHOTOS, NUM } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   "What you get" split (parallax photo + staggered list) · dark terms band with
   the payout timeline (rules only, no earnings figures) · onboarding steps.
──────────────────────────────────────────────────────────────────────────── */

/* ── What you get ───────────────────────────────────────────────────────── */
const GETS = [
  { icon: UserRound, title: 'A named onboarding manager', body: 'One person from application to go-live, and through your first week.' },
  { icon: IndianRupee, title: 'Commission explained before go-live', body: 'Rates, settlement cycle and deductions are written down and agreed first.' },
  { icon: Wallet, title: 'Weekly payouts', body: 'A settlement summary in the partner app; the amount lands in your verified bank account every Monday.' },
  { icon: ListChecks, title: 'Your prices, your hours', body: 'Menu, catalogue, rate card, slots and stock toggles stay in your control.' },
  { icon: Headset, title: 'Partner support Mon–Sat, 9am–7pm IST', body: 'Phone and email during working hours; order-time issues go to a live team.' },
  { icon: BadgeCheck, title: 'Free to apply, no joining fee', body: 'No deposit for any track. Verification call within two working days.' },
];

export function WhatYouGet() {
  return (
    <Light tone="soft" className="py-24 md:py-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal y={32} className="relative">
              <ParallaxImage photo={PARTNER_PHOTOS.handover} ratio="4/5" className="shadow-[0_30px_80px_rgba(11,15,25,.14)]" />
              <Reveal delay={0.25} x={-12} y={0} className="absolute -right-3 bottom-8 sm:-right-6">
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/85 p-3 pr-4 shadow-[0_8px_40px_rgba(11,15,25,.12)] backdrop-blur-xl">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Wallet size={17} /></span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-gray-900">Weekly payout</p>
                    <p className="text-[11px] text-gray-500">Settles every Monday</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.35} x={12} y={0} className="absolute -left-3 top-8 sm:-left-6">
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/85 p-3 pr-4 shadow-[0_8px_40px_rgba(11,15,25,.12)] backdrop-blur-xl">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100"><BadgeCheck size={17} /></span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-gray-900">Verified member</p>
                    <p className="text-[11px] text-gray-500">Zyphix Book · badge live</p>
                  </div>
                </div>
              </Reveal>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal><Kicker>What you get</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg">The same deal for every partner, written down.</Headline></Reveal>
            <Reveal delay={0.1}><Sub className="mt-6 max-w-[560px]">These are commitments about process, not promises about earnings. They apply to every track from the first week.</Sub></Reveal>
            <Stagger className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2" step={0.07}>
              {GETS.map(g => (
                <div key={g.title} className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-[0_1px_2px_rgba(0,0,0,.05)] ring-1 ring-gray-200"><g.icon size={19} /></span>
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.01em] text-gray-900">{g.title}</p>
                    <p className="mt-1 text-[14.5px] leading-[1.55] text-gray-600">{g.body}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </Light>
  );
}

/* ── Terms band: payout timeline + the three people/terms columns ───────── */
const TIMELINE = [
  { icon: Smartphone, title: 'Order comes in', body: 'The payout for that order is shown before you accept it. No forced hours, no penalty targets.' },
  { icon: Clock, title: 'Through the week', body: 'Every completed order is added to your running summary in the partner app.' },
  { icon: FileCheck, title: 'Sunday night', body: 'The week closes. Your summary lists orders, deductions and the settlement amount.' },
  { icon: Banknote, title: 'Monday', body: 'The amount is sent to the bank account you verified during onboarding.' },
];

const COLS = [
  { icon: UserRound, title: 'Onboarding manager', body: 'A named person walks you from application to go-live. Same contact for documents, setup and your first week.' },
  { icon: IndianRupee, title: 'Commission explained before go-live', body: 'Rates, settlement cycle and what counts as a deduction are written down and agreed before your listing goes live.' },
  { icon: Headset, title: 'Support Mon–Sat, 9am–7pm IST', body: 'Partner support on phone and email during working hours. Order-time issues are routed to a live team.' },
];

function Connector() {
  const stat = isStatic();
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-6 hidden h-px w-full md:block">
      <div className="absolute inset-0 bg-white/10" />
      <motion.div
        className="absolute inset-0 origin-left"
        style={{ background: 'linear-gradient(90deg, #0DA366, #19C27C 60%, rgba(25,194,124,.3))' }}
        initial={stat ? false : { scaleX: 0 }}
        whileInView={stat ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      />
    </div>
  );
}

export function TermsBand() {
  return (
    <Dark id="terms" className="scroll-mt-16 py-24 md:py-36">
      <Glow x="50%" y="0%" size={1100} alpha={0.3} />
      <Grain />
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal><Kicker light>How we work</Kicker></Reveal>
            <Reveal delay={0.05}><Headline light size="lg">Transparent terms. Real people.</Headline></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Sub light>No surprises after go-live. Here is how a week's payout actually moves, and who you can call when something needs fixing.</Sub>
          </Reveal>
        </div>

        {/* payout timeline */}
        <div className="relative mt-16 md:mt-20">
          <Connector />
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
            {TIMELINE.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.12 + i * 0.12} y={28} className="relative flex gap-5 md:block">
                {i < TIMELINE.length - 1 && <span aria-hidden className="absolute left-6 top-12 h-[calc(100%+40px)] w-px bg-white/10 md:hidden" />}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-[#05080E] text-emerald-300 shadow-[0_0_0_6px_#05080E,0_0_40px_rgba(13,163,102,.35)]">
                  <s.icon size={20} />
                </div>
                <div className="md:mt-7">
                  <p className="text-[13px] font-semibold tracking-[0.12em] text-emerald-300/80" style={NUM}>
                    <Counter to={i + 1} duration={0.9} format={n => String(Math.round(n)).padStart(2, '0')} />
                  </p>
                  <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-white">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-white/60">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Stagger className="mt-20 grid gap-6 border-t border-white/10 pt-12 md:grid-cols-3 md:gap-8" step={0.08}>
          {COLS.map(c => (
            <div key={c.title} className="rounded-3xl border border-white/10 bg-white/[.04] p-6 md:p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10"><c.icon size={18} /></span>
              <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-white">{c.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.65] text-white/60">{c.body}</p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Dark>
  );
}

/* ── 4-step onboarding ──────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Apply', body: 'Pick a track and fill a short form. Takes about ten minutes.', need: ['Phone number', 'Your area'] },
  { n: '02', title: 'Verification call', body: 'Your onboarding manager calls within two working days to confirm details.', need: ['Government ID', 'Bank account'] },
  { n: '03', title: 'Set up', body: 'Menu, catalogue, rate card or vehicle details, set up together with our team.', need: ['Menu / catalogue', 'FSSAI or RC (if applicable)'] },
  { n: '04', title: 'Go live', body: 'Your listing or partner app goes live. Same person stays with you through week one.', need: ['Partner app', 'Smartphone'] },
];

export function Steps() {
  return (
    <Light id="onboarding" className="scroll-mt-16 py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal><Kicker>Onboarding</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg">Four steps from application to go-live.</Headline></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Sub>Free to apply, no joining fee. What you need at each step is listed below, so nothing stalls on paperwork.</Sub>
          </Reveal>
        </div>
        <div className="relative mt-14 md:mt-20">
          <div aria-hidden className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent md:block" />
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={0.08 * i} y={24} className="relative">
                <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,.04)]" style={NUM}>{s.n}</span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.015em] text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{s.body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.need.map(n => <Chip key={n}><CalendarCheck size={11} className="text-emerald-600" /> {n}</Chip>)}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Light>
  );
}
