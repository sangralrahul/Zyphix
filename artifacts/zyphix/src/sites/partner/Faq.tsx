import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Mail, Bike, UtensilsCrossed, Sparkles, Store } from 'lucide-react';
import { SectionHead, G, INK, HEAD_FONT, btnPrimary } from '@/components/layout/SiteChrome';
import { fade, PHOTOS } from './shared';

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQ: Array<{ q: string; a: string; tag: string }> = [
  { tag: 'All tracks', q: 'Does it cost anything to join Zyphix as a partner?', a: 'No. There is no joining fee, no listing fee and no charge for onboarding, training or catalogue setup. Commission (for restaurants and stores) is explained in writing before you go live, and delivery partners and Zyphix Book professionals pay nothing to be on the platform.' },
  { tag: 'All tracks', q: 'Which cities and areas are you live in?', a: 'We are onboarding partners across India, neighbourhood by neighbourhood, rather than announcing whole cities at once. Apply with your area or pin code; if customers in your locality are not live yet, we tell you honestly and let you know when they are.' },
  { tag: 'All tracks', q: 'How long does onboarding take?', a: 'You hear from an onboarding manager within 2 working days of applying. Document checks take a few days depending on your track; menu, catalogue or rate-card setup is usually a single session. Most partners go live within one to two weeks of a complete application.' },
  { tag: 'Delivery', q: 'What do delivery partners need, and how are payouts made?', a: 'You need to be 18 or older with a smartphone, a government ID and a bike, scooter, bicycle or car. Motor vehicles need a driving licence and RC. Every order shows its payout before you accept it, and the week\'s total is settled to your bank account weekly. There are no forced login hours or penalty targets.' },
  { tag: 'Restaurants', q: 'How does commission work for restaurants and kitchens on Zyphix Eats?', a: 'Commission is flat and shared in writing before go-live — it does not change with campaigns, tiers or "visibility" packages. You set your own menu prices and hours, and Zyphix adds no surge pricing on top. You also see customer names and order history for your own orders.' },
  { tag: 'Zyphix Book', q: 'How does verification work for Zyphix Book professionals?', a: 'After you apply, your onboarding manager verifies your government ID and address proof and runs a background check. Online, we only ask for the last four characters of your ID; the rest is verified on a call. Once complete, your profile shows a verified badge to customers and you start receiving booking requests in your chosen area.' },
  { tag: 'Zyphix Book', q: 'Can I choose my service area, days and rates?', a: 'Yes. You set the radius you are willing to travel, the days and time slots you work, and your rate card for visits and common jobs. Customers see your rates before booking, and you can decline a request if it does not fit.' },
  { tag: 'Stores', q: 'I run a kirana or pharmacy. How is stock kept accurate?', a: 'Our team sets up your catalogue with you, and the store app lets you toggle items in and out of stock in a tap, scan barcodes to add new ones, and get low-stock alerts. Pharmacies need a valid drug licence; we help you list only what you are permitted to sell.' },
  { tag: 'All tracks', q: 'What documents will I be asked for?', a: 'Delivery partners: government ID, and a driving licence plus RC for motor vehicles. Restaurants: FSSAI number, GST where applicable, owner ID and menu. Stores: owner ID, GST where applicable, drug licence for pharmacies. Zyphix Book professionals: government ID, address proof and any trade certificate you hold. Everyone needs a bank account or UPI for payouts.' },
  { tag: 'All tracks', q: 'Is there a contract or lock-in?', a: 'No lock-in and no exclusivity. Partnership runs month to month and you can pause or leave at any time by telling your onboarding manager. Terms do not change without notice.' },
  { tag: 'All tracks', q: 'Who do I contact if I have a question or a problem?', a: 'Before you go live, your onboarding manager. After go-live, partner support on WhatsApp and phone, Monday to Saturday, 9 am to 7 pm IST (numbers shared after verification), and support@zyphix.in at any time. For partnership and business questions, write to partnerships@zyphix.in.' },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHead align="left" eyebrow="FAQ" title="Partner questions, answered." sub="Straight answers on fees, documents, verification and support. If yours is not here, email partnerships@zyphix.in." />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[[Bike, 'Delivery', '/delivery'], [UtensilsCrossed, 'Restaurants', '/restaurant'], [Sparkles, 'Zyphix Book', '/services'], [Store, 'Stores', '/store']].map(([Icon, l, href]) => {
                const I = Icon as React.ComponentType<{ size?: number }>;
                return (
                  <Link key={l as string} href={href as string} className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-300">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><I size={16} /></span>
                    <span className="flex-1 text-[14px] font-bold text-gray-900">Apply as {l as string}</span>
                    <ArrowRight size={15} className="text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900" />
                  </Link>
                );
              })}
            </div>
          </div>
          <motion.div {...fade(.1)} className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-500">{f.tag}</span>
                    <span className="text-[15.5px] font-bold text-gray-900">{f.q}</span>
                  </span>
                  <ChevronDown size={18} className={`shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <p className="-mt-1 px-6 pb-6 text-[14.5px] leading-relaxed text-gray-600">{f.a}</p>}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA band ──────────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
      <motion.div {...fade(0)} className="relative overflow-hidden rounded-[32px] text-white" style={{ background: INK }}>
        <img src={PHOTOS.kirana} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${INK} 0%, ${INK}ee 55%, ${INK}99 100%), radial-gradient(600px 300px at 100% 0%, rgba(13,163,102,.5), transparent 70%)` }} />
        <div className="relative grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-14">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Ready when you are</p>
            <h2 className="mt-3 text-[2rem] font-black leading-[1.06] tracking-[-0.03em] md:text-[2.8rem]" style={{ fontFamily: HEAD_FONT }}>Start partnering with Zyphix today.</h2>
            <p className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-white/70">Free to apply. A real onboarding manager calls within 2 working days. Questions first? Email <a href="mailto:partnerships@zyphix.in" className="font-semibold text-white underline-offset-2 hover:underline">partnerships@zyphix.in</a>.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#tracks" className={btnPrimary} style={{ background: G }}>Choose your track <ArrowRight size={16} /></a>
              <a href="mailto:partnerships@zyphix.in" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-[14.5px] font-bold text-white hover:bg-white/10"><Mail size={15} /> Talk to the team</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[[Bike, 'Delivery partner', '/delivery'], [UtensilsCrossed, 'Restaurant & kitchen', '/restaurant'], [Sparkles, 'Zyphix Book professional', '/services'], [Store, 'Kirana & store', '/store']].map(([Icon, l, href]) => {
              const I = Icon as React.ComponentType<{ size?: number }>;
              return (
                <Link key={l as string} href={href as string} className="group rounded-2xl border border-white/10 bg-white/[.06] p-4 transition hover:bg-white/[.12]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400"><I size={18} /></span>
                  <p className="mt-3 text-[14px] font-extrabold leading-tight">{l as string}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-emerald-400">Apply <ArrowRight size={12} className="transition group-hover:translate-x-0.5" /></p>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
