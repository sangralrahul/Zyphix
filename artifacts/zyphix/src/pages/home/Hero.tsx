import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBasket, UtensilsCrossed, Wrench, ChevronDown } from 'lucide-react';
import { VideoHero, Words, Kicker, GlowButton, GhostButton, Ticker, Reveal, Light, isStatic, EASE } from '@/ui/cinema';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { NOW_SITE, EATS_SITE, BOOK_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Full-viewport video hero + the promise ticker underneath it.
──────────────────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  { name: 'Now', what: 'Groceries in 30 min', href: NOW_SITE, icon: <ShoppingBasket size={15} /> },
  { name: 'Eats', what: 'Food from local kitchens', href: EATS_SITE, icon: <UtensilsCrossed size={15} /> },
  { name: 'Book', what: 'Home services', href: BOOK_SITE, icon: <Wrench size={15} /> },
];

function ScrollCue() {
  const stat = isStatic();
  return (
    <a href="#products" aria-label="Scroll to products" className="group hidden items-center gap-2 text-[12.5px] font-medium text-white/60 transition hover:text-white md:inline-flex">
      <span className="relative block h-9 w-[1px] overflow-hidden bg-white/20">
        <motion.span
          className="absolute left-0 top-0 block h-full w-full bg-white"
          initial={stat ? false : { y: '-100%' }}
          animate={stat ? undefined : { y: '100%' }}
          transition={stat ? undefined : { duration: 1.6, ease: EASE, repeat: Infinity, repeatDelay: 0.4 }}
        />
      </span>
      Scroll
      <ChevronDown size={14} className="transition-transform group-hover:translate-y-0.5" />
    </a>
  );
}

export function Hero() {
  const stat = isStatic();
  const fade = (d: number) => stat ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } };
  return (
    <VideoHero clip={VIDEOS.heroCity} height="min-h-[100svh]" dim={0.42} position="center 40%">
      <Container className="pb-8 pt-40 sm:pb-10 md:pt-48">
        <motion.div {...fade(0.1)}>
          <Kicker light>India's SuperLocal app · Jammu first</Kicker>
        </motion.div>
        <Words
          text="Your neighbourhood, delivered in 30 minutes."
          delay={0.25}
          className="max-w-[1000px] text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-[64px] md:text-[84px]"
        />
        <motion.p {...fade(0.8)} className="mt-6 max-w-[560px] text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
          Groceries from the kirana, dinner from the dhaba, an electrician for the weekend. One app, one account, every shop near you.
        </motion.p>
        <motion.div {...fade(0.95)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <GlowButton href={NOW_SITE} sameTab>Order on Zyphix Now <ArrowRight size={17} /></GlowButton>
          <GhostButton href="/app">Get the app</GhostButton>
        </motion.div>

        {/* glass strip: product pills + scroll cue */}
        <motion.div {...fade(1.1)} className="mt-14 flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/[.08] p-3 backdrop-blur-xl sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-2.5 sm:pl-3 sm:pr-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-1.5">
            {PRODUCTS.map(p => (
              <a key={p.name} href={p.href} className="group flex min-h-[44px] items-center gap-3 rounded-full px-4 py-2 transition hover:bg-white/10 sm:gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">{p.icon}</span>
                <span className="whitespace-nowrap text-[14.5px] font-semibold text-white">Zyphix {p.name}</span>
                <span className="whitespace-nowrap text-[13px] text-white/55">{p.what}</span>
                <ArrowRight size={14} className="ml-auto text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white sm:ml-0" />
              </a>
            ))}
          </div>
          <ScrollCue />
        </motion.div>
      </Container>
    </VideoHero>
  );
}

/* ── Promise ticker ─────────────────────────────────────────────────────── */
const PROMISES = [
  'Groceries in 30 min', 'Food from local restaurants', 'Verified home professionals',
  '₹0 delivery above ₹199', 'Cash on delivery', 'Live order tracking',
];

export function PromiseTicker() {
  const items = PROMISES.map(t => (
    <React.Fragment key={t}>
      <span className="text-gray-900">{t}</span>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0DA366]" />
    </React.Fragment>
  ));
  return (
    <Light className="border-b border-gray-100">
      <Reveal y={0}>
        <Ticker items={items} speed={34} size="text-[15px] sm:text-[16px]" className="py-5 sm:py-6" />
      </Reveal>
    </Light>
  );
}
