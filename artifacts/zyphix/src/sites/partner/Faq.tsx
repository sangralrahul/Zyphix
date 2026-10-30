import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Accordion, Container } from '@/ui/kit';
import { BgVideo, GhostButton, GlowButton, Grain, Headline, Kicker, Light, Reveal, Sub } from '@/ui/cinema';
import { VIDEOS } from '@/data/media';
import { Accent, Magnetic } from '@/ui/motion2';
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
    <Light id="faq" tone="soft" className="scroll-mt-16 py-24 md:py-32">
      <Container narrow>
        <Reveal className="mb-12 text-center">
          <Kicker>FAQ</Kicker>
          <Headline size="md">Questions partners ask first.</Headline>
        </Reveal>
        <Reveal delay={0.05}><Accordion items={FAQ} /></Reveal>
        <p className="mt-10 text-center text-[14.5px] text-gray-600">Something else? Write to <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-semibold text-emerald-700 hover:underline">{PARTNERSHIPS_EMAIL}</a>.</p>
      </Container>
    </Light>
  );
}

/* ── Final CTA (full-bleed video) ────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05080E] py-28 text-white md:py-40">
      <BgVideo clip={VIDEOS.foodDelivery} dim={0.6} />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.85) 0%, rgba(5,8,14,.35) 50%, rgba(5,8,14,.9) 100%)' }} />
      <Grain />
      <Container className="relative text-center">
        <Reveal><Headline size="lg" light className="mx-auto max-w-[18ch] text-balance">Pick a track and apply in <Accent green>ten</Accent> minutes.</Headline></Reveal>
        <Reveal delay={0.05}><Sub light className="mx-auto mt-5 max-w-[520px]">Free to apply. A real person calls you within two working days.</Sub></Reveal>
        <Reveal delay={0.1} className="mx-auto mt-10 grid max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-2">
          {TRACKS.map(t => (
            <a key={t.id} href={t.href} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/[.05] px-5 py-4 text-left backdrop-blur transition hover:border-emerald-400/50 hover:bg-white/[.08]">
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">{t.name}</span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white transition group-hover:translate-x-0.5"><ArrowRight size={15} /></span>
            </a>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
