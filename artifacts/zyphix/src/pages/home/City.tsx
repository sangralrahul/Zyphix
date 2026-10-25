import React from 'react';
import { Light, Kicker, Sub, Reveal } from '@/ui/cinema';
import { Accent, ClipWall, VideoText } from '@/ui/motion2';
import { Container } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { Display } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   "Your city, on demand" clip mosaic and the JAMMU video-in-type band.
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
            <Sub className="max-w-[46ch]">The spice seller, the chai stall, the family kitchen and the rider who knows the lane. Zyphix is just the shortest way between them and you.</Sub>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={32} className="mt-12 md:mt-16">
          <ClipWall
            clips={[VIDEOS.spices, VIDEOS.chai, VIDEOS.merchant, VIDEOS.cooking, VIDEOS.doorHandoff]}
            labels={['Bazaar masala', 'Chai at the corner', 'Your local merchant', 'Cooked to order', 'At your door']}
          />
        </Reveal>
      </Container>
    </Light>
  );
}

export function JammuBand() {
  return (
    <section className="relative bg-[#05080E] text-white">
      <VideoText clip={VIDEOS.vegMarket} text="JAMMU" />
      <Container className="flex flex-col gap-3 border-t border-white/10 py-8 text-[14px] text-white/60 sm:flex-row sm:items-center sm:justify-between md:py-10">
        <p className="text-[17px] font-medium tracking-[-0.02em] text-white md:text-[20px]">Jammu first. <span className="text-white/50">More cities, street by street.</span></p>
        <p>Live in Jammu today · onboarding partners area by area</p>
      </Container>
    </section>
  );
}
