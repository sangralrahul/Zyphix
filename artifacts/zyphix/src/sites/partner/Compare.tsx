import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Headset, MessageCircle, GraduationCap, Clock, Users, Store, Handshake, ArrowRight } from 'lucide-react';
import { SectionHead, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';
import { fade, PHOTOS } from './shared';

/* ── Comparison table ────────────────────────────────────────────────────── */
const ROWS: Array<{ k: string; z: string; a: string; good: boolean }> = [
  { k: 'Commission model',          z: 'Flat and transparent, explained before go-live',          a: 'Variable, changes with campaigns and tiers',       good: true },
  { k: 'Your customers\' data',     z: 'Shared with you — names, repeat orders, feedback',         a: 'Withheld or shown only in aggregate',             good: true },
  { k: 'Pricing on your menu/shelf', z: 'Your price is the app price — no surge added',           a: 'Platform mark-ups and surge on top of your price', good: true },
  { k: 'Payout cadence',            z: 'Weekly settlement to your bank account',                  a: 'Varies; often tied to minimum thresholds',         good: true },
  { k: 'Delivery radius',           z: 'Hyperlocal — your neighbourhood, short runs',             a: 'City-wide; long runs and cold food',               good: true },
  { k: 'Who you compete with',      z: 'Other local businesses only — no dark stores',            a: 'The platform\'s own warehouses and private labels', good: true },
  { k: 'Onboarding',                z: 'Named onboarding manager, verification call, training',   a: 'Self-serve forms and ticket queues',               good: true },
  { k: 'Support',                   z: 'WhatsApp and phone during business hours, email after',   a: 'Chatbot-first, escalation by ticket',              good: true },
  { k: 'Joining fee',               z: 'None',                                                    a: 'Varies by platform and category',                  good: true },
  { k: 'Contract',                  z: 'Month-to-month, leave any time',                          a: 'Lock-ins and exclusivity clauses are common',      good: true },
];

export function Compare() {
  return (
    <section id="compare" className="scroll-mt-20 border-y border-gray-200 bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="Honest comparison" title="The Zyphix partner model, side by side." sub="No percentages, no claims we cannot back. Just how we have chosen to structure the relationship versus what partners usually tell us they are used to." />
        <motion.div {...fade(.1)} className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_16px_48px_rgba(11,18,32,.06)]">
          <div className="grid grid-cols-[1.1fr_1.4fr_1.2fr] border-b border-gray-200 bg-gray-50 text-[12px] font-bold uppercase tracking-wider md:text-[12.5px]">
            <div className="px-4 py-4 text-gray-500 md:px-6">What matters</div>
            <div className="flex items-center gap-2 px-4 py-4 md:px-6" style={{ color: G }}><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Zyphix partner model</div>
            <div className="px-4 py-4 text-gray-500 md:px-6">Typical aggregator</div>
          </div>
          <ul className="divide-y divide-gray-100">
            {ROWS.map(r => (
              <li key={r.k} className="grid grid-cols-[1.1fr_1.4fr_1.2fr] text-[13px] md:text-[14px]">
                <div className="px-4 py-4 font-bold text-gray-900 md:px-6">{r.k}</div>
                <div className="flex items-start gap-2 bg-emerald-50/40 px-4 py-4 text-gray-800 md:px-6">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: G }}><Check size={12} /></span>
                  <span>{r.z}</span>
                </div>
                <div className="flex items-start gap-2 px-4 py-4 text-gray-500 md:px-6">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400"><Minus size={12} /></span>
                  <span>{r.a}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-[12px] text-gray-500 md:px-6">"Typical aggregator" describes patterns partners commonly report to us; individual platforms differ. Exact Zyphix commission and payout terms for your category are shared in writing before you go live.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── INK statement band ──────────────────────────────────────────────────── */
const PILLARS = [
  { icon: Store, t: 'Local-first by design', d: 'Every order on Zyphix is fulfilled by a business within a few kilometres of the customer. We do not run dark stores or ghost kitchens that compete with you.' },
  { icon: Handshake, t: 'Terms you can read', d: 'Commission, payout schedule and what happens on cancellations are written down and shared before you go live. Nothing changes without notice.' },
  { icon: Users, t: 'People, not tickets', d: 'A named onboarding manager takes you from application to first order, and stays reachable on WhatsApp and phone after.' },
];
export function InkBand() {
  return (
    <section className="relative overflow-hidden text-white" style={{ background: INK }}>
      <img src={PHOTOS.thali} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[.14]" />
      <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(900px 500px at 85% 0%, rgba(13,163,102,.35), transparent 60%), linear-gradient(180deg, ${INK}cc, ${INK})` }} />
      <div className="relative mx-auto max-w-[1180px] px-5 py-20 md:py-28">
        <motion.p {...fade(0)} className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Why we exist</motion.p>
        <motion.h2 {...fade(.05)} className="mt-4 max-w-[900px] text-[2.2rem] font-black leading-[1.02] tracking-[-0.04em] sm:text-[3rem] lg:text-[3.8rem]" style={{ fontFamily: HEAD_FONT }}>
          Built for the people who already run your neighbourhood.
        </motion.h2>
        <motion.p {...fade(.1)} className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-white/70">
          The kirana that knows your order, the dhaba that knows your spice level, the electrician who comes when he says he will. Zyphix gives them the tools of a national app without taking away what makes them local.
        </motion.p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div key={p.t} {...fade(.15 + i * .08)} className="rounded-3xl border border-white/10 bg-white/[.05] p-6 backdrop-blur-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400"><p.icon size={20} /></span>
              <h3 className="mt-4 text-[17px] font-extrabold">{p.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/65">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Partner support ─────────────────────────────────────────────────────── */
const SUPPORT = [
  { icon: Headset, t: 'A named onboarding manager', d: 'From the moment your application is accepted you have one person responsible for getting you live — document checks, catalogue or menu setup, training and your first week of orders.', chips: ['Verification call', 'Setup help', 'First-week check-in'] },
  { icon: MessageCircle, t: 'WhatsApp & phone support', d: 'Once you are live, partner support is reachable on WhatsApp and phone Monday to Saturday, 9 am to 7 pm IST. Outside those hours, write to support@zyphix.in and we reply the next working morning. Your onboarding manager shares the numbers after verification.', chips: ['Mon – Sat', '9 am – 7 pm IST', 'Email after hours'] },
  { icon: GraduationCap, t: 'Training that fits your track', d: 'Short, practical sessions on the partner app: accepting and completing orders, handling cancellations, updating menus or stock, and keeping your verified badge in good standing. Available in Hindi and English, in person or on a call.', chips: ['Hindi & English', 'In person or call', 'App walkthrough'] },
];
export function Support() {
  return (
    <section id="support" className="scroll-mt-20 bg-gray-50 border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <SectionHead align="left" eyebrow="Partner support" title="You are never on your own." sub="Onboarding across India is done by people, not forms. Here is exactly what support looks like before and after you go live." />
            <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200">
              <img src={PHOTOS.plumber} alt="" loading="lazy" className="h-[240px] w-full object-cover" />
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Clock size={18} /></span>
              <p className="text-[13.5px] leading-snug text-gray-700"><span className="font-bold text-gray-900">Our commitment:</span> we call every applicant within 2 working days of receiving the form.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {SUPPORT.map((s, i) => (
              <motion.div key={s.t} {...fade(.05 * i)} className="flex gap-5 rounded-3xl border border-gray-200 bg-white p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><s.icon size={22} /></span>
                <div>
                  <h3 className="text-[17px] font-extrabold text-gray-900">{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{s.d}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {s.chips.map(c => <li key={c} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[12px] font-semibold text-gray-700">{c}</li>)}
                  </ul>
                </div>
              </motion.div>
            ))}
            <a href="mailto:partnerships@zyphix.in" className="inline-flex items-center gap-2 self-start rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: G }}>
              Ask the partnerships team <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
