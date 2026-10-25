import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container, Accordion } from '@/ui/kit';
import { BgVideo, GhostButton, GlowButton, Grain, Headline, Kicker, Light, Reveal, Sub } from '@/ui/cinema';
import { VIDEOS } from '@/data/media';
import { Magnetic } from '@/ui/motion2';
import { PARTNERSHIPS_EMAIL, PARTNER_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion (7 Qs) on a soft band + full-bleed video final CTA.
──────────────────────────────────────────────────────────────────────────── */

const FAQ = [
  { q: 'Where can I advertise right now?', a: 'Zyphix is launching across India area by area. When you send a brief, partnerships replies with the neighbourhoods that are live today and the ones opening next. Early advertisers get first choice of placements as new areas open.' },
  { q: 'How is pricing decided if there are no auctions?', a: 'Each placement has a flat rate for a period (7, 14 or 30 days) in one delivery area. Your quote is the sum of the placements, areas and periods you pick. It is written down before go-live and does not change mid-campaign.' },
  { q: 'Do I need to be a Zyphix partner to advertise?', a: 'Not for banners, rows, spotlights, search or coupons — those promote products already stocked by partner stores. A Featured placement in Eats or Book needs a live, verified partner listing so customers can actually order. Partner onboarding is free at partner.zyphix.in.' },
  { q: 'What counts as an attributed order?', a: 'An order placed by a customer who tapped your placement and bought the promoted product, dish or service in the same session, or redeemed your coupon. View-through conversions are not counted.' },
  { q: 'How are sponsored placements shown to customers?', a: 'Every paid placement carries a visible "Sponsored" label. We cap sponsored content per screen, never remove organic results to make room, and reject creative that could be mistaken for a store\'s own listing.' },
  { q: 'What creative do I need to supply?', a: 'Usually one image to the spec shown under each format, a short headline and a CTA label. For rows and spotlights we also need the exact SKUs. One revision round is included in every plan.' },
  { q: 'Can I change or cancel a campaign once it is live?', a: 'Creative swaps and daypart changes can be made during a run with one working day\'s notice. Areas and formats change between periods. If you stop a placement early, unused full weeks are credited to your next booking.' },
];

export function Faq() {
  return (
    <Light id="faq" tone="soft" className="scroll-mt-16 py-24 md:py-32">
      <Container narrow>
        <Reveal className="mb-12 text-center">
          <Kicker>FAQ</Kicker>
          <Headline size="md">Questions advertisers ask first.</Headline>
        </Reveal>
        <Reveal delay={0.05}><Accordion items={FAQ} /></Reveal>
        <p className="mt-10 text-center text-[14.5px] text-gray-600">Not answered here? Write to <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-semibold text-emerald-700 hover:underline">{PARTNERSHIPS_EMAIL}</a>.</p>
      </Container>
    </Light>
  );
}

/* ── Final CTA (full-bleed video) ────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05080E] py-28 text-white md:py-40">
      <BgVideo clip={VIDEOS.heroCity} dim={0.6} />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.85) 0%, rgba(5,8,14,.35) 50%, rgba(5,8,14,.9) 100%)' }} />
      <Grain />
      <Container className="relative text-center">
        <Reveal><Kicker light className="justify-center">Early advertiser programme</Kicker></Reveal>
        <Reveal delay={0.05}><Headline size="lg" light className="mx-auto max-w-[18ch] text-balance">Be in the app when your neighbourhood opens.</Headline></Reveal>
        <Reveal delay={0.1}><Sub light className="mx-auto mt-5 max-w-[520px]">Send a brief and get a written plan, the live areas near you and a flat quote.</Sub></Reveal>
        <Reveal delay={0.15} className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Magnetic className="w-full sm:w-auto"><GlowButton href="#contact" className="w-full sm:w-auto">Talk to partnerships <ArrowRight size={17} /></GlowButton></Magnetic>
          <GhostButton href={PARTNER_SITE}>Become a partner instead</GhostButton>
        </Reveal>
      </Container>
    </section>
  );
}
