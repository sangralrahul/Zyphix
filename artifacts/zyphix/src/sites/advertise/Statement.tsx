import React from 'react';
import { ShoppingCart, Store, Tag } from 'lucide-react';
import { Container } from '@/ui/kit';
import { Grain, Glow, Kicker, Stagger } from '@/ui/cinema';
import { VideoText, ZoomVideo, Spotlight, Accent } from '@/ui/motion2';
import { VIDEOS } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   Statement — a giant "INTENT" with video inside the letters, then a framed
   neighbourhood-store clip that zooms to full-bleed carrying one statement
   (a claim about the product, not a testimonial), then the three reasons.
──────────────────────────────────────────────────────────────────────────── */

const COLS = [
  { icon: <ShoppingCart size={18} />, title: 'A shopping app, not a feed', text: 'People open Zyphix to buy groceries, order food or book a service. A placement meets that intent instead of interrupting something else.' },
  { icon: <Store size={18} />, title: 'The shelf is real', text: 'Rows and spotlights link to products stocked by partner stores nearby, at the local price. A tap can become an order in the same session.' },
  { icon: <Tag size={18} />, title: 'Labelled, capped, honest', text: 'Every placement is marked Sponsored. We cap sponsored content per screen and never remove organic results to make room.' },
];

export function Statement() {
  return (
    <div className="bg-[#05080E] text-white">
      {/* video inside the letters */}
      <div className="pt-20 md:pt-28">
        <Container><Kicker light>Why it works</Kicker></Container>
        <VideoText clip={VIDEOS.spices} text="INTENT" className="mt-2" size="text-[25vw] md:text-[22vw]" />
      </div>

      {/* framed clip that grows to full-bleed */}
      <ZoomVideo clip={VIDEOS.merchant}>
        <Container className="w-full pb-14 md:pb-20">
          <h2 className="max-w-[20ch] text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-[48px] md:text-[58px]">
            The closer a message sits to the <Accent green>basket</Accent>, the less it has to shout.
          </h2>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-white/75 md:text-[18px]">Intent at the point of purchase: placements sit right beside the neighbourhood shelf people are already buying from.</p>
        </Container>
      </ZoomVideo>

      {/* the three reasons */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <Glow x="80%" y="0%" size={800} alpha={0.2} />
        <Grain />
        <Container className="relative">
          <Stagger className="grid gap-4 md:grid-cols-3 md:gap-5" step={0.08}>
            {COLS.map(c => (
              <Spotlight key={c.title} className="h-full">
                <div className="p-6 md:p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10">{c.icon}</span>
                  <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.025em] text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-white/65">{c.text}</p>
                </div>
              </Spotlight>
            ))}
          </Stagger>
        </Container>
      </section>
    </div>
  );
}
