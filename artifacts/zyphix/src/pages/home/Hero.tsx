import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBasket, UtensilsCrossed, Wrench, ChevronDown } from 'lucide-react';
import { VideoHero, Kicker, GlowButton, GhostButton, Reveal, Light, Sub, isStatic, EASE } from '@/ui/cinema';
import { Accent, Magnetic, LiveOrder, GiantMarquee } from '@/ui/motion2';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { NOW_SITE, EATS_SITE, BOOK_SITE, Display } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Full-viewport video hero (with a live order card on desktop) and the
   intro band with the giant scroll-velocity marquee underneath it.
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

/** Word-by-word headline that can hold an <Accent> node. */
function HeroTitle() {
  const parts: React.ReactNode[] = ['Your', 'neighbourhood,', <Accent green key="a">delivered</Accent>, 'in', '30', 'minutes.'];
  const cls = 'text-balance text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[68px] md:text-[84px]';
  if (isStatic()) return <h1 className={cls}>{parts.map((p, i) => <React.Fragment key={i}>{p}{i < parts.length - 1 ? ' ' : ''}</React.Fragment>)}</h1>;
  return (
    <h1 className={cls} aria-label="Your neighbourhood, delivered in 30 minutes.">
      {parts.map((p, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}>{p}</motion.span>
          {i < parts.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const stat = isStatic();
  const fade = (d: number) => stat ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } };
  return (
    <VideoHero clip={VIDEOS.heroCity} height="min-h-[100svh]" dim={0.42} position="center 40%">
      <Container className="pb-8 pt-36 sm:pb-10 md:pt-44">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <motion.div {...fade(0.1)}>
              <Kicker light>India's SuperLocal app · Jammu first</Kicker>
            </motion.div>
            <HeroTitle />
            <motion.p {...fade(0.8)} className="mt-7 max-w-[54ch] text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
              Groceries from the kirana, dinner from the dhaba, an electrician for the weekend. One app, one account, every shop near you.
            </motion.p>
            <motion.div {...fade(0.95)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic><GlowButton href={NOW_SITE} sameTab className="w-full sm:w-auto">Order on Zyphix Now <ArrowRight size={17} /></GlowButton></Magnetic>
              <GhostButton href="/app">Get the app</GhostButton>
            </motion.div>
          </div>
          <motion.div {...fade(1.2)} className="hidden lg:block">
            <LiveOrder dark className="ml-auto" />
            <p className="mt-3 text-right text-[12px] text-white/45">What tracking looks like · illustrative order</p>
          </motion.div>
        </div>

        {/* glass strip: product pills + scroll cue */}
        <motion.div {...fade(1.1)} className="mt-14 flex flex-col gap-4 rounded-3xl border border-white/15 bg-white/[.08] p-3 backdrop-blur-xl sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-2.5 sm:pl-3 sm:pr-6">
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
  ['30 min', 'grocery delivery promise'],
  ['₹0', 'delivery on orders above ₹199'],
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
            <Reveal delay={0.1}><Sub className="max-w-[46ch]">Zyphix connects you to the shops, kitchens and professionals already on your street. Their prices, their people, delivered by riders from your area.</Sub></Reveal>
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
        <GiantMarquee words={['Groceries', 'Food', 'Services', 'Jammu']} light={false} className="pb-[2.4vw]" />
      </div>
    </Light>
  );
}
