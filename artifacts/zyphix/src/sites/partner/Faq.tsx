import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Accordion, Button, Container, Display, Lead, Mesh, Section, SectionTitle, fade } from '@/ui/kit';
import { PARTNERSHIPS_EMAIL, TRACKS } from './shared';

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQ = [
  { q: 'Is there any fee to join?', a: 'No. Applying is free and there is no joining fee or deposit for any track. Commission, where it applies, is explained before you go live.' },
  { q: 'How long does onboarding take?', a: 'You get a verification call within two working days of applying. Setup after that depends on how quickly documents and your menu, catalogue or rate card are ready.' },
  { q: 'When are payouts settled?', a: 'Weekly. Your settlement summary is in the partner app and the amount is sent to the bank account you verified during onboarding.' },
  { q: 'Can I partner in more than one track?', a: 'Yes. A restaurant can also list a store, and a professional can also deliver. Each track has its own short application and verification.' },
  { q: 'Which documents do I need?', a: 'A government ID and a bank account for every track. Delivery partners on motor vehicles add a driving licence and RC; food businesses add FSSAI; stores and restaurants add GST if applicable.' },
  { q: 'What does "verified badge" mean on Zyphix Book?', a: 'The badge shows once ID, address proof, a background check and a skill confirmation call are complete. Customers see it on your profile and on every booking.' },
  { q: 'Who do I contact if something goes wrong?', a: `Your onboarding manager during setup, and partner support Mon–Sat, 9am–7pm IST after go-live. You can also write to ${PARTNERSHIPS_EMAIL}.` },
];

export function Faq() {
  return (
    <Section id="faq" tone="soft" className="scroll-mt-16">
      <Container narrow>
        <SectionTitle eyebrow="FAQ" title="Questions partners ask first." align="center" className="mb-12" />
        <motion.div {...fade(0.05)}><Accordion items={FAQ} /></motion.div>
        <p className="mt-10 text-center text-[14.5px] text-gray-600">Something else? Write to <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-semibold text-emerald-700 hover:underline">{PARTNERSHIPS_EMAIL}</a>.</p>
      </Container>
    </Section>
  );
}

/* ── Final CTA band ──────────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-gray-200 bg-white py-20 md:py-28">
      <Mesh intensity={1.1} />
      <Container className="text-center">
        <motion.div {...fade(0)}>
          <Display as="h2" size="lg" className="mx-auto max-w-[680px] text-gray-900">Pick a track and apply in ten minutes.</Display>
        </motion.div>
        <motion.div {...fade(0.05)}>
          <Lead className="mx-auto mt-5 max-w-[520px]">Free to apply. A real person calls you within two working days.</Lead>
        </motion.div>
        <motion.div {...fade(0.1)} className="mx-auto mt-9 flex max-w-[720px] flex-wrap justify-center gap-3">
          {TRACKS.map((t, i) => (
            <Button key={t.id} href={t.href} variant={i === 0 ? 'primary' : 'secondary'}>{t.name} <ArrowRight size={15} /></Button>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
