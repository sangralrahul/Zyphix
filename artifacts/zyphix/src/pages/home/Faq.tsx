import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Section, Container, SectionTitle, Accordion, ArrowLink, Display, Lead, Button, Mesh, Hairline, fade } from '@/ui/kit';
import { PARTNER_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion, final CTA band and the sticky mobile bottom CTA.
──────────────────────────────────────────────────────────────────────────── */

const FAQ = [
  { q: 'Where is Zyphix available?', a: 'We onboard stores, restaurants and professionals area by area across India. Set your location in the app to see live partners near you, or join early access and we will email you when we go live in your neighbourhood.' },
  { q: 'Are prices the same as in the store?', a: 'Yes. Partners list their own shelf and menu prices and we do not mark them up. There is no surge pricing and no hidden handling charge. Any delivery fee is shown at checkout before you pay.' },
  { q: 'How do you deliver in 30 minutes?', a: 'Every order is fulfilled by a business within a few kilometres of you and carried by a rider from the same area. Short distances and real inventory make the 30-minute target possible without dark stores.' },
  { q: 'Is there a minimum order?', a: 'Each store sets its own minimum, if any, and you will see it on the store page before you add items. Small orders are welcome.' },
  { q: 'How do I pay?', a: 'UPI, cards, net banking and popular wallets online. Cash on delivery is available on eligible orders and shown at checkout.' },
  { q: 'What if something is missing or wrong?', a: 'Report it from the order screen. Support verifies with the store and rider and refunds the affected items to your original payment method or Zyphix wallet.' },
  { q: 'How can my business join?', a: <>Apply at <a href={PARTNER_SITE} className="font-semibold text-emerald-700" target="_blank" rel="noopener noreferrer">partner.zyphix.in</a>. Applying is free and an onboarding manager calls you within two working days to take you live.</> },
];

export function Faq() {
  return (
    <Section id="faq" className="scroll-mt-16">
      <Container narrow>
        <SectionTitle eyebrow="FAQ" title="Questions, answered." align="center" />
        <motion.div {...fade(0.05)} className="mt-10 border-t border-gray-200">
          <Accordion items={FAQ} />
        </motion.div>
        <p className="mt-8 text-center text-[14px] text-gray-500">Still stuck? <ArrowLink href="/contact" className="ml-1">Contact support</ArrowLink></p>
      </Container>
    </Section>
  );
}

/* ── Final CTA band ───────────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <Hairline />
      <Mesh intensity={1.2} />
      <Container className="py-24 text-center md:py-32">
        <motion.div {...fade(0)}>
          <Display as="h2" size="lg" className="mx-auto max-w-[680px] text-gray-900">Your neighbourhood is already on Zyphix.</Display>
          <Lead className="mx-auto mt-5 max-w-[520px]">Groceries from the kirana, dinner from the dhaba, an electrician for the weekend. Place your first order.</Lead>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/now" size="lg">Order now <ArrowRight size={16} /></Button>
            <Button href="/eats" variant="secondary" size="lg">Order food</Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8EC] bg-white/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Groceries in ~30 min</p>
          <p className="truncate text-[11.5px] text-gray-500">Shelf prices · zero surge</p>
        </div>
        <Button href="/now" size="sm" className="shrink-0">Order now <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}
