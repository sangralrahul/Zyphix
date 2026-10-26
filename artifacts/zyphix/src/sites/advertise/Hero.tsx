import React from 'react';
import { motion } from '@/lib/motion';
import { ArrowRight } from 'lucide-react';
import { VideoHero, Kicker, GlowButton, GhostButton, Ticker, Reveal, Light, isStatic, EASE } from '@/ui/cinema';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { Magnetic, SplitHeadline } from '@/ui/motion2';
import { SURFACES } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Full-viewport supermarket-aisle video hero (accent headline, magnetic CTA), glass strip of the ad surfaces,
   then a ticker of the advertiser promises.
──────────────────────────────────────────────────────────────────────────── */

export function Hero() {
  const stat = isStatic();
  const fade = (d: number) => stat ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } };
  return (
    <VideoHero clip={VIDEOS.groceryShelf} height="min-h-[100svh]" dim={0.5} position="center 50%">
      <Container className="pb-8 pt-36 sm:pb-10 md:pt-48">
        <motion.div {...fade(0.1)}>
          <Kicker light>Zyphix Ads</Kicker>
        </motion.div>
        <SplitHeadline
          parts={['Put your brand in front of your neighbourhood, at the', { accent: 'moment', green: true }, 'they buy.']}
          delay={0.25}
          className="max-w-[24ch] text-balance text-[40px] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-[60px] md:text-[76px]"
        />
        <motion.p {...fade(0.85)} className="mt-6 max-w-[600px] text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
          Placements inside a shopping app, not a feed. Your brand shows on the home screen, in search and in categories, only in the delivery areas you choose, and always labelled Sponsored.
        </motion.p>
        <motion.div {...fade(1)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic className="w-full sm:w-auto"><GlowButton href="#contact" className="w-full sm:w-auto">Talk to partnerships <ArrowRight size={17} /></GlowButton></Magnetic>
          <GhostButton href="#formats">See the formats</GhostButton>
        </motion.div>

        {/* glass strip: where placements run */}
        <motion.div {...fade(1.15)} className="mt-14 rounded-2xl border border-white/15 bg-white/[.08] p-2 backdrop-blur-xl sm:mt-20">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 sm:hidden">Where your placement runs</p>
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
            {SURFACES.map((s, i) => (
              <li key={s.name} className={`flex min-h-[52px] flex-col justify-center rounded-xl px-3.5 py-2.5 ${i === SURFACES.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <span className="flex items-center gap-2 text-[14px] font-semibold text-white">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />{s.name}
                </span>
                <span className="mt-0.5 block pl-3.5 text-[12.5px] leading-snug text-white/55">{s.where}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </VideoHero>
  );
}

/* ── Promise ticker ─────────────────────────────────────────────────────── */
const SIGNALS = [
  'Always labelled Sponsored', 'Flat rates, no auctions', 'Written quote before go-live',
  'Targeted by delivery area', 'One report per placement', 'Early advertiser programme',
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
