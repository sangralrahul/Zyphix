import React from 'react';
import { motion } from '@/lib/motion';
import { ArrowRight } from 'lucide-react';
import { VideoHero, Kicker, GlowButton, GhostButton, Ticker, Reveal, Light, isStatic, EASE, handoff } from '@/ui/cinema';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { Magnetic, SplitHeadline } from '@/ui/motion2';
import { PARTNERSHIPS_EMAIL, TRACKS } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Full-viewport city video hero (accent headline, magnetic CTA) + the four track pills, then a promise ticker.
──────────────────────────────────────────────────────────────────────────── */

export function Hero() {
  const stat = isStatic();
  const fade = (d: number) => (stat || handoff()) ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE, delay: d * 0.4 } };
  return (
    <VideoHero clip={VIDEOS.heroCity} height="min-h-[100svh]" dim={0.45} position="center 45%">
      <Container className="pb-8 pt-40 sm:pb-10 md:pt-48">
        <motion.div {...fade(0.1)}>
          <Kicker light>Partner portal</Kicker>
        </motion.div>
        <SplitHeadline
          parts={['Grow with the', { accent: 'SuperLocal', green: true }, 'app.']}
          delay={0.1}
          className="max-w-[14ch] text-balance text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[64px] md:text-[84px]"
        />
        <motion.p {...fade(0.4)} className="mt-6 max-w-[580px] text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
          Deliver, cook, fix or sell for customers a few streets away. Free to apply, transparent terms, weekly payouts and a real onboarding manager from application to go-live.
        </motion.p>
        <motion.div {...fade(0.47)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic className="w-full sm:w-auto"><GlowButton href="#tracks" className="w-full sm:w-auto">Choose your track <ArrowRight size={17} /></GlowButton></Magnetic>
          <GhostButton href={`mailto:${PARTNERSHIPS_EMAIL}`}>Talk to us</GhostButton>
        </motion.div>

        {/* glass strip: the four tracks */}
        <motion.div {...fade(0.55)} className="mt-14 grid gap-1 rounded-2xl border border-white/15 bg-white/[.08] p-2 backdrop-blur-xl sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map(t => (
            <a key={t.id} href={t.href} className="group flex min-h-[52px] items-center gap-3 rounded-xl px-3.5 py-2.5 transition hover:bg-white/10">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30"><t.icon size={15} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold leading-snug text-white">{t.name}</span>
                <span className="block truncate text-[12.5px] text-white/55">{t.product}</span>
              </span>
              <ArrowRight size={14} className="shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </a>
          ))}
        </motion.div>
      </Container>
    </VideoHero>
  );
}

/* ── Promise ticker ─────────────────────────────────────────────────────── */
const SIGNALS = [
  'Free to apply', 'No joining fee or deposit', 'Verification call within 2 working days',
  'Weekly payouts, settled every Monday', 'Named onboarding manager', 'Partner support Mon–Sat, 9am–7pm IST',
];

export function Signals() {
  const items = SIGNALS.map(t => (
    <React.Fragment key={t}>
      <span className="text-gray-900">{t}</span>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0DA366]" />
    </React.Fragment>
  ));
  return (
    <Light className="border-b border-gray-100">
      <Reveal y={0}>
        <Ticker items={items} speed={36} size="text-[15px] sm:text-[16px]" className="py-5 sm:py-6" />
      </Reveal>
    </Light>
  );
}
