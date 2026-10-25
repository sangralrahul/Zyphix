import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Light, Kicker, Sub, Reveal, GlowButton, GhostButton } from '@/ui/cinema';
import { Accent, Magnetic, ZoomVideo } from '@/ui/motion2';
import { Container, Accordion, ArrowLink, Button } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { NOW_SITE, EATS_SITE, PARTNER_SITE, SUPPORT_SITE, Display } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion, final full-bleed video CTA and the sticky mobile bottom CTA.
──────────────────────────────────────────────────────────────────────────── */

const FAQ = [
  { q: 'Where is Zyphix available?', a: <>We are rolling out neighbourhood by neighbourhood, onboarding stores, restaurants and professionals one area at a time. Set your location on <a href={NOW_SITE} className="font-semibold text-emerald-700">now.zyphix.in</a> to check if we deliver to you; if we are not on your street yet, join early access and we will email you the day we are.</> },
  { q: 'Are prices the same as in the store?', a: 'Yes. Partners list their own shelf and menu prices and we do not mark them up. There is no surge pricing and no hidden handling charge. Any delivery fee is shown at checkout before you pay, and bigger baskets ship free.' },
  { q: 'How do you deliver in 30 minutes?', a: 'Every order is fulfilled by a business within a few kilometres of you and carried by a rider from the same area. Short distances and real inventory make the 30-minute target possible without dark stores.' },
  { q: 'How do I pay?', a: 'Cards, UPI, net banking and popular wallets online. Cash on delivery is available on eligible orders and shown at checkout.' },
  { q: 'What if something is missing or wrong?', a: 'Report it from the order screen. Support verifies with the store and rider and refunds the affected items to your original payment method or Zyphix wallet.' },
  { q: 'How can my business join?', a: <>Apply at <a href={PARTNER_SITE} className="font-semibold text-emerald-700" target="_blank" rel="noopener noreferrer">partner.zyphix.in</a>. Listing is free and an onboarding manager calls you within two working days to take you live.</> },
];

export function Faq() {
  return (
    <Light id="faq" className="scroll-mt-16 border-t border-gray-100 py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal><Kicker>FAQ</Kicker></Reveal>
            <Reveal delay={0.05}><Display size="md">Questions, <Accent green>answered</Accent>.</Display></Reveal>
            <Reveal delay={0.1}><Sub className="mt-5 max-w-[34ch]">Everything else lives in the help centre.</Sub></Reveal>
            <Reveal delay={0.15} className="mt-6 flex flex-col items-start gap-3">
              <ArrowLink href={SUPPORT_SITE}>Visit support.zyphix.in</ArrowLink>
              <ArrowLink href="/contact">Contact support</ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="border-t border-gray-200 lg:col-span-8">
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </Container>
    </Light>
  );
}

/* ── Final CTA: inset frame that zooms to full-bleed ─────────────────────── */
export function FinalCta() {
  return (
    <ZoomVideo clip={VIDEOS.nightCity}>
      <Container className="w-full pb-20 md:pb-28">
        <Kicker light>Neighbourhood by neighbourhood</Kicker>
        <Display light size="xl" className="!max-w-[16ch]">Your neighbourhood is <Accent green>already here</Accent>.</Display>
        <Sub light className="mt-6 max-w-[46ch]">Place your first order and see how fast local can be.</Sub>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic><GlowButton href={NOW_SITE} sameTab className="w-full sm:w-auto">Order on Zyphix Now <ArrowRight size={17} /></GlowButton></Magnetic>
          <GhostButton href={EATS_SITE}>Order food instead</GhostButton>
        </div>
      </Container>
    </ZoomVideo>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8EC] bg-white/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Groceries in 30 min</p>
          <p className="truncate text-[11.5px] text-gray-500">Shelf prices · free delivery on bigger baskets</p>
        </div>
        <Button href={NOW_SITE} sameTab size="sm" className="shrink-0">Order now <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}
