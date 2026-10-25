import React from 'react';
import { Light, Kicker, Sub, Reveal } from '@/ui/cinema';
import { Accent, ClipWall, VideoText } from '@/ui/motion2';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { ArrowUpRight } from 'lucide-react';
import { Display, NOW_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   "Your city, on demand" clip mosaic and the SUPERLOCAL video-in-type band.
──────────────────────────────────────────────────────────────────────────── */

export function CityWall() {
  return (
    <Light className="py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal><Kicker>Made of the neighbourhood</Kicker></Reveal>
            <Reveal delay={0.05}><Display>Your city, <Accent green>on demand</Accent>.</Display></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Sub className="max-w-[46ch]">The spice seller, the corner café, the family kitchen and the rider who knows the lane. Zyphix is the shortest way between them and you.</Sub>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={32} className="mt-12 md:mt-16">
          <ClipWall
            clips={[VIDEOS.vegMarket, VIDEOS.chai, VIDEOS.merchant, VIDEOS.chefTeam, VIDEOS.doorHandoff]}
            labels={['Fresh from the market', 'The corner café', 'Your local merchant', 'Cooked to order', 'At your door']}
          />
        </Reveal>
      </Container>
    </Light>
  );
}

export function SuperLocalBand() {
  return (
    <section className="relative bg-[#05080E] text-white">
      <VideoText clip={VIDEOS.spices} text="SUPERLOCAL" size="text-[15vw] md:text-[13vw]" />
      <Container className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between md:py-10">
        <p className="text-[17px] font-medium tracking-[-0.02em] text-white md:text-[20px]">The SuperLocal app. <span className="text-white/50">Rolling out neighbourhood by neighbourhood.</span></p>
        <a href={NOW_SITE} className="group inline-flex min-h-[44px] items-center gap-1.5 text-[14.5px] font-semibold text-emerald-300 transition hover:text-emerald-200">Check if we deliver to you <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
      </Container>
    </section>
  );
}
