import React from 'react';
import { motion } from '@/lib/motion';
import { ArrowRight, ShoppingBasket, UtensilsCrossed, Wrench, ChevronDown } from 'lucide-react';
import { VideoHero, Kicker, GlowButton, GhostButton, Reveal, Light, Sub, isStatic, EASE, handoff } from '@/ui/cinema';
import { Accent, Magnetic, LiveOrder, GiantMarquee, SplitHeadline } from '@/ui/motion2';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { NOW_SITE, EATS_SITE, BOOK_SITE, Display } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Full-viewport video hero (with a live order card on desktop) and the
   intro band with the giant scroll-velocity marquee underneath it.
──────────────────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  { name: 'Now', what: 'Groceries in 10 min', href: NOW_SITE, icon: <ShoppingBasket size={15} /> },
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

const HERO_ITEMS = ['Fresh milk 1 L', 'Whole-wheat flour 5 kg', 'Bananas · 6'];

export function Hero() {
  const stat = isStatic();
  const fade = (d: number) => (stat || handoff()) ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE, delay: d * 0.4 } };
  return (
    <VideoHero clip={VIDEOS.heroCity} height="min-h-[100svh]" dim={0.42} position="center 40%">
      <Container className="pb-8 pt-36 sm:pb-10 md:pt-40">
        <motion.div {...fade(0.1)}>
          <Kicker light>The SuperLocal app</Kicker>
        </motion.div>
        <SplitHeadline
          parts={['Your neighbourhood,', { accent: 'delivered', green: true }, 'in 10 minutes.']}
          delay={0.1}
          className="max-w-[16ch] text-balance text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[64px] md:max-w-none md:text-[78px]"
        />
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div>
            <motion.p {...fade(0.4)} className="max-w-[52ch] text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
              Groceries from the corner store, dinner from your favourite kitchen, an electrician for the weekend. One app, one account, every shop near you.
            </motion.p>
            <motion.div {...fade(0.47)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic><GlowButton href={NOW_SITE} sameTab className="w-full sm:w-auto">Order on Zyphix Now <ArrowRight size={17} /></GlowButton></Magnetic>
              <GhostButton href="/app">Get the app</GhostButton>
            </motion.div>
          </div>
          <motion.div {...fade(0.6)} className="hidden justify-self-end lg:block">
            <LiveOrder dark items={HERO_ITEMS} className="!max-w-[320px]" />
          </motion.div>
        </div>

        {/* glass strip: product pills + scroll cue */}
        <motion.div {...fade(0.55)} className="mt-12 flex flex-col gap-4 rounded-3xl border border-white/15 bg-white/[.08] p-3 backdrop-blur-xl sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-2.5 sm:pl-3 sm:pr-6">
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

/* ── Intro band + giant marquee ─────────────────────────────────────────── */
const FACTS = [
  ['10 min', 'grocery delivery promise'],
  ['Free', 'delivery on bigger baskets'],
  ['1 login', 'for Now, Eats and Book'],
];

export function IntroMarquee() {
  return (
    <Light className="border-b border-gray-100 pt-24 md:pt-36">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal><Kicker>One app, three ways in</Kicker></Reveal>
            <Reveal delay={0.05}><Display>Everything local, <Accent green>one tap</Accent> away.</Display></Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}><Sub className="max-w-[46ch]">Zyphix connects you to the shops, kitchens and pros already on your street. Their prices, their people, delivered by riders from your area.</Sub></Reveal>
          </div>
        </div>
        <Reveal delay={0.15} className="mt-14 grid grid-cols-3 divide-x divide-gray-200 border-y border-gray-200">
          {FACTS.map(([n, l]) => (
            <div key={n} className="px-3 py-6 first:pl-0 sm:px-8 sm:py-8 sm:first:pl-0">
              <p className="text-[24px] font-semibold tracking-[-0.04em] text-gray-900 sm:text-[40px]" style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</p>
              <p className="mt-1 text-[12.5px] leading-[1.45] text-gray-500 sm:text-[14px]">{l}</p>
            </div>
          ))}
        </Reveal>
      </Container>
      <div className="py-10 md:py-16" aria-hidden>
        <GiantMarquee words={['Groceries', 'Food', 'Services', 'Nearby']} light={false} className="pb-[2.4vw]" />
      </div>
    </Light>
  );
}
