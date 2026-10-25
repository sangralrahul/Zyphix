import React from 'react';
import { ShoppingCart, Store, Tag } from 'lucide-react';
import { Container } from '@/ui/kit';
import { BgVideo, Grain, Kicker, Reveal, Stagger } from '@/ui/cinema';
import { VIDEOS } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   Statement — full-bleed video band with one large white statement (a claim
   about the product, not a testimonial) and the three reasons beneath it.
──────────────────────────────────────────────────────────────────────────── */

const COLS = [
  { icon: <ShoppingCart size={18} />, title: 'A shopping app, not a feed', text: 'People open Zyphix to buy groceries, order food or book a service. A placement meets that intent instead of interrupting something else.' },
  { icon: <Store size={18} />, title: 'The shelf is real', text: 'Rows and spotlights link to products stocked by partner stores nearby, at the local price. A tap can become an order in the same session.' },
  { icon: <Tag size={18} />, title: 'Labelled, capped, honest', text: 'Every placement is marked Sponsored. We cap sponsored content per screen and never remove organic results to make room.' },
];

export function Statement() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05080E] text-white">
      <BgVideo clip={VIDEOS.unboxing} dim={0.55} />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.75) 0%, rgba(5,8,14,.25) 40%, rgba(5,8,14,.92) 100%)' }} />
      <Grain />
      <Container className="relative flex min-h-[92svh] flex-col justify-end pb-16 pt-32 md:pb-24 md:pt-44">
        <Reveal><Kicker light>Why it works</Kicker></Reveal>
        <Reveal delay={0.05} y={32} blur>
          <h2 className="max-w-[1080px] text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[52px] md:text-[64px]">
            Intent at the point of purchase. <span className="text-white/55">The closer a message sits to the basket, the less it has to shout.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-8 border-t border-white/15 pt-10 md:mt-20 md:grid-cols-3 md:gap-10" step={0.08}>
          {COLS.map(c => (
            <div key={c.title}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-300 ring-1 ring-white/15 backdrop-blur-md">{c.icon}</span>
              <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-white">{c.title}</h3>
              <p className="mt-2 max-w-[380px] text-[15px] leading-[1.65] text-white/65">{c.text}</p>
            </div>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
