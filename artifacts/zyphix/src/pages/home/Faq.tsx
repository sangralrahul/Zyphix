import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Light, VideoHero, Kicker, Headline, Sub, Reveal, Words, GlowButton, GhostButton } from '@/ui/cinema';
import { Container, Accordion, ArrowLink, Button } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { NOW_SITE, EATS_SITE, PARTNER_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion, final full-bleed video CTA and the sticky mobile bottom CTA.
──────────────────────────────────────────────────────────────────────────── */

const FAQ = [
  { q: 'Where is Zyphix available?', a: 'We are live in Jammu first and onboarding stores, restaurants and professionals area by area. Set your location in the app to see live partners near you; if we are not on your street yet, join early access and we will email you the day we are.' },
  { q: 'Are prices the same as in the store?', a: 'Yes. Partners list their own shelf and menu prices and we do not mark them up. There is no surge pricing and no hidden handling charge. Any delivery fee is shown at checkout before you pay, and orders above ₹199 ship for ₹0.' },
  { q: 'How do you deliver in 30 minutes?', a: 'Every order is fulfilled by a business within a few kilometres of you and carried by a rider from the same area. Short distances and real inventory make the 30-minute target possible without dark stores.' },
  { q: 'How do I pay?', a: 'UPI, cards, net banking and popular wallets online. Cash on delivery is available on eligible orders and shown at checkout.' },
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
            <Reveal delay={0.05}><Headline size="md">Questions, answered.</Headline></Reveal>
            <Reveal delay={0.1}><Sub className="mt-5">Still stuck? <ArrowLink href="/contact" className="ml-1 align-baseline">Contact support</ArrowLink></Sub></Reveal>
          </div>
          <Reveal delay={0.1} className="border-t border-gray-200 lg:col-span-8">
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </Container>
    </Light>
  );
}

/* ── Final full-bleed CTA ─────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <VideoHero clip={VIDEOS.unboxing} height="min-h-[82svh]" dim={0.5} position="center 30%">
      <Container className="flex min-h-[82svh] flex-col justify-center py-24 text-center md:py-32">
        <Reveal><Kicker light className="justify-center">Jammu · more cities soon</Kicker></Reveal>
        <Words as="h2" text="Your neighbourhood is already on Zyphix." className="mx-auto max-w-[900px] text-[38px] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-[56px] md:text-[72px]" />
        <Reveal delay={0.3}><Sub light className="mx-auto mt-6 max-w-[520px]">Place your first order and see how fast local can be.</Sub></Reveal>
        <Reveal delay={0.4} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GlowButton href={NOW_SITE} sameTab>Order on Zyphix Now <ArrowRight size={17} /></GlowButton>
          <GhostButton href={EATS_SITE}>Order food instead</GhostButton>
        </Reveal>
      </Container>
    </VideoHero>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8EC] bg-white/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Groceries in 30 min</p>
          <p className="truncate text-[11.5px] text-gray-500">Shelf prices · ₹0 delivery above ₹199</p>
        </div>
        <Button href={NOW_SITE} sameTab size="sm" className="shrink-0">Order now <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}
