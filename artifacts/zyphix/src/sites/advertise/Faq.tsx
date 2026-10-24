import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, Container, SectionTitle, Accordion, Mesh, Display, Lead, Button, Eyebrow } from '@/ui/kit';
import { PARTNERSHIPS_EMAIL, PARTNER_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion (7 Qs) in a narrow Container + final CTA band on Mesh.
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
    <Section id="faq" className="scroll-mt-16">
      <Container narrow>
        <SectionTitle align="center" eyebrow="FAQ" title="Questions advertisers ask first." lead={<>Not answered here? Write to <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-medium text-emerald-700">{PARTNERSHIPS_EMAIL}</a>.</>} />
        <div className="mt-12"><Accordion items={FAQ} /></div>
      </Container>
    </Section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-gray-200 py-20 md:py-28">
      <Mesh />
      <Container className="text-center">
        <Eyebrow className="justify-center">Early advertiser programme</Eyebrow>
        <Display as="h2" size="lg" className="mx-auto mt-4 max-w-[640px] text-gray-900">Be in the app when your neighbourhood opens.</Display>
        <Lead className="mx-auto mt-5 max-w-[520px]">Send a brief and get a written plan, the live areas near you and a flat quote.</Lead>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="#contact" size="lg">Talk to partnerships <ArrowRight size={16} /></Button>
          <Button href={PARTNER_SITE} variant="secondary" size="lg">Become a partner instead</Button>
        </div>
      </Container>
    </section>
  );
}
