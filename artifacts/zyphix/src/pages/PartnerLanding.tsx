import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from '@/lib/motion';
import {
  Store, UtensilsCrossed, Bike, ArrowRight, CheckCircle2, ChevronDown,
  FileText, BadgeCheck, Rocket, ClipboardList, Mail,
} from 'lucide-react';
import { SitePage, PageHero, SectionHead, btnPrimary, btnSecondary, card, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Partner overview — store / restaurant / delivery partner types.
──────────────────────────────────────────────────────────────────────────── */

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .5, ease: 'easeOut' as const, delay },
});

const PARTNERS = [
  {
    icon: <Store size={22} />, tint: '#0DA366', bg: '#ECFDF5',
    tag: 'Local & retail stores', title: 'Sell from your store.',
    sub: 'Your corner store, supermarket or shop online in days. Accept orders, manage inventory and keep the customers you already have.',
    perks: ['Free onboarding and catalogue setup', 'Hyperlocal delivery network, under-30-minute target', 'Weekly payouts, no hidden fees'],
    cta: 'List your store', href: '/merchant-setup', img: '/images/groceries.webp',
  },
  {
    icon: <UtensilsCrossed size={22} />, tint: '#EA580C', bg: '#FFF7ED',
    tag: 'Restaurants & kitchens', title: 'List your restaurant.',
    sub: 'Reach nearby customers with fair, flat commissions. Set your own menu, hours and prices from a simple dashboard.',
    perks: ['Fair, transparent commission', 'Real-time order dashboard', 'Help from our onboarding team'],
    cta: 'Register restaurant', href: '/restaurant-setup', img: '/images/food.webp',
  },
  {
    icon: <Bike size={22} />, tint: '#2563EB', bg: '#EFF6FF',
    tag: 'Delivery partners', title: 'Earn on your schedule.',
    sub: 'Short, local runs in your own area. Ride when you want, with transparent per-order earnings shown before you accept.',
    perks: ['Flexible hours, no forced targets', 'Short local distances', 'Bike, bicycle, scooter or car'],
    cta: 'Start delivering', href: '/delivery-setup', img: '/images/scooter.webp',
  },
];

const STEPS = [
  { icon: <FileText size={20} />, t: 'Apply online', d: 'Tell us about your store, restaurant or vehicle. It takes a few minutes and costs nothing.' },
  { icon: <BadgeCheck size={20} />, t: 'Verification', d: 'Our team checks your documents and business details so customers can trust every partner on Zyphix.' },
  { icon: <ClipboardList size={20} />, t: 'Set up your listing', d: 'We help you upload your catalogue or menu, set prices and hours, or complete delivery training.' },
  { icon: <Rocket size={20} />, t: 'Go live', d: 'Start receiving orders from customers near you. Track everything from your partner dashboard.' },
];

const FAQ = [
  { q: 'Does it cost anything to join?', a: 'No. Onboarding and listing are free for stores and restaurants, and there is no joining fee for delivery partners. Platform fees are explained clearly before you go live.' },
  { q: 'Can I set my own prices?', a: 'Yes. Partners list their own shelf or menu prices. Zyphix does not add surge pricing on top of what you charge.' },
  { q: 'How and when do I get paid?', a: 'Earnings are settled to your bank account on a regular weekly cycle, with a full breakdown of every order in your dashboard.' },
  { q: 'Which cities are you in?', a: 'We are rolling out neighbourhood by neighbourhood. Apply now and we will let you know when customers in your area can order.' },
  { q: 'What do I need to become a delivery partner?', a: 'A vehicle, a smartphone, valid ID and (for motor vehicles) a driving licence and registration. Details are on the delivery sign-up page.' },
];

export function PartnerLanding() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SitePage title="Partner with Zyphix">
      <PageHero
        eyebrow="Now onboarding partners"
        title={<>Grow your business <span style={{ color: G }}>with Zyphix.</span></>}
        sub="Join as a local store, restaurant or delivery partner and reach customers in your neighbourhood — with transparent pricing and tools built for independent businesses."
      >
        <a href="#partner-types" className={btnPrimary} style={{ background: G }}>Choose your partner type <ArrowRight size={16} /></a>
        <a href="mailto:partnerships@zyphix.in" className={btnSecondary}><Mail size={16} /> partnerships@zyphix.in</a>
      </PageHero>

      {/* Partner types */}
      <section id="partner-types" className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="Partner types" title="Three ways to partner." sub="Pick the one that fits you — each has its own sign-up with a short, guided form." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <motion.div key={p.href} {...fade(i * .08)} className={`${card} flex flex-col overflow-hidden`}>
              <img src={p.img} alt={p.tag} className="h-[160px] w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: p.bg, color: p.tint }}>{p.icon}</span>
                  <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: p.tint }}>{p.tag}</p>
                </div>
                <h3 className="mt-4 text-[22px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{p.sub}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.perks.map(k => (
                    <li key={k} className="flex items-start gap-2 text-[13.5px] text-gray-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: p.tint }} /> {k}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:opacity-95" style={{ background: p.tint }}>
                  {p.cta} <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How onboarding works */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <SectionHead eyebrow="How onboarding works" title="From application to first order." sub="A real person from our team walks you through every step." />
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className={`${card} p-6`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{s.icon}</span>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[820px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="FAQ" title="Partner questions, answered." />
        <div className="mt-10 divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
                <span className="text-[15.5px] font-bold text-gray-900">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="-mt-1 px-6 pb-6 text-[14.5px] leading-relaxed text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-24">
        <div className="flex flex-col gap-6 rounded-[32px] p-8 text-white md:flex-row md:items-center md:justify-between md:p-12" style={{ background: INK }}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Ready when you are</p>
            <h2 className="mt-3 text-[1.8rem] font-black tracking-[-0.03em] leading-[1.1] md:text-[2.2rem]" style={{ fontFamily: HEAD_FONT }}>Put your business on the map.</h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/65">Questions before you apply? Email <a href="mailto:partnerships@zyphix.in" className="font-semibold text-white underline-offset-2 hover:underline">partnerships@zyphix.in</a> and we'll get back to you.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/merchant-setup" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 hover:bg-gray-100">List your store</Link>
            <Link href="/restaurant-setup" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-[14.5px] font-bold text-white hover:bg-white/10">Register restaurant</Link>
            <Link href="/delivery-setup" className={btnPrimary} style={{ background: G }}>Start delivering <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

export default PartnerLanding;
