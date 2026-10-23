import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Store, Warehouse, Leaf, BadgeIndianRupee, Clock, ShieldCheck,
  Handshake, MapPin, Check, X,
} from 'lucide-react';
import { SitePage, PageHero, SectionHead, btnPrimary, btnSecondary, card, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   About — company story, mission, values, local-first vs dark stores.
──────────────────────────────────────────────────────────────────────────── */

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .5, ease: 'easeOut' as const, delay },
});

const FACTS = [
  { icon: <MapPin size={18} />, v: 'Founded 2024', l: 'Built in India, for India' },
  { icon: <Clock size={18} />, v: 'Under 30 minutes', l: 'Doorstep delivery target' },
  { icon: <BadgeIndianRupee size={18} />, v: 'Zero surge', l: 'Shelf price is the app price' },
  { icon: <Store size={18} />, v: 'Onboarding across India', l: 'Neighbourhood by neighbourhood' },
];

const VALUES = [
  { icon: <Handshake size={20} />, t: 'Partners first', d: 'Free onboarding, fair commissions and weekly payouts. Zyphix only works when the kirana and the kitchen win too.' },
  { icon: <BadgeIndianRupee size={20} />, t: 'Radical transparency', d: 'No surge pricing and no hidden handling fees. Every charge is shown before you pay.' },
  { icon: <Clock size={20} />, t: 'Speed by design', d: 'Short distances and live local inventory, not giant warehouses, are what make fast delivery possible.' },
  { icon: <ShieldCheck size={20} />, t: 'Trust and safety', d: 'Verified partners, secure payments and live tracking on every order and every service booking.' },
];

const COMPARE: Array<{ point: string; local: string; dark: string }> = [
  { point: 'Where your order comes from', local: 'A real kirana, restaurant or professional near you', dark: 'A warehouse built to compete with them' },
  { point: 'Who keeps the margin', local: 'The local business, with a fair platform fee', dark: 'The platform, after heavy discounting' },
  { point: 'Pricing', local: 'Shelf price, no surge', dark: 'Dynamic pricing and handling fees' },
  { point: 'Impact on the neighbourhood', local: 'More customers for existing shops', dark: 'Fewer independent shops over time' },
];

export function About() {
  return (
    <SitePage title="About">
      <PageHero
        eyebrow="Our story"
        title={<>Built for India's <span style={{ color: G }}>neighbourhood economy.</span></>}
        sub="Zyphix started with a simple belief: your local kirana store, favourite dhaba and trusted plumber deserve world-class technology — without being replaced by it."
      >
        <Link href="/now" className={btnPrimary} style={{ background: G }}>Order now <ArrowRight size={16} /></Link>
        <Link href="/partner" className={btnSecondary}>Partner with us</Link>
      </PageHero>

      {/* Facts (honest, no invented metrics) */}
      <section className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <motion.div key={f.v} {...fade(i * .06)} className={`${card} flex items-start gap-4 p-5`}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{f.icon}</span>
              <div>
                <p className="text-[16px] font-extrabold text-gray-900">{f.v}</p>
                <p className="mt-0.5 text-[13px] text-gray-500">{f.l}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 md:grid-cols-[1fr_1fr] md:py-24">
          <div>
            <SectionHead align="left" eyebrow="Mission" title="Technology for the businesses that already run your neighbourhood." />
            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-gray-600">
              <p>India's neighbourhoods are powered by millions of independent kirana stores, food businesses and service professionals. They know their customers by name, but most of them have never had the tools that large chains take for granted.</p>
              <p>Zyphix gives every local business a digital storefront, simple order and inventory management, delivery and payments — and gives customers one app for groceries, food, pharmacy and home services from the places they already trust.</p>
              <p className="font-semibold text-gray-900">We call it SuperLocal: a superapp for the local economy, not a replacement for it.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 overflow-hidden rounded-3xl border border-gray-200 bg-white">
              <img src="/images/groceries.png" alt="Groceries from a local kirana store" className="h-[220px] w-full object-cover" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
              <img src="/images/food.png" alt="Food from a neighbourhood restaurant" className="h-[150px] w-full object-cover" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
              <img src="/images/scooter.png" alt="Zyphix delivery partner" className="h-[150px] w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="What we stand for" title="Four principles behind every decision." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(v => (
            <div key={v.t} className={`${card} p-6`}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{v.icon}</span>
              <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900">{v.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How we're different */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <SectionHead eyebrow="How we're different" title="Local-first, not dark stores." sub="Most quick-commerce apps build warehouses that compete with the shops around you. Zyphix puts those shops online instead." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className={`${card} p-7`}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: G }}><Leaf size={20} /></span>
              <h3 className="mt-4 text-[20px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>Zyphix: local-first</h3>
              <ul className="mt-4 space-y-3">
                {COMPARE.map(c => (
                  <li key={c.point} className="flex gap-3 text-[14px] leading-relaxed">
                    <Check size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span><span className="font-semibold text-gray-900">{c.point}:</span> <span className="text-gray-600">{c.local}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${card} p-7`}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-500"><Warehouse size={20} /></span>
              <h3 className="mt-4 text-[20px] font-black tracking-tight text-gray-500" style={{ fontFamily: HEAD_FONT }}>Dark-store model</h3>
              <ul className="mt-4 space-y-3">
                {COMPARE.map(c => (
                  <li key={c.point} className="flex gap-3 text-[14px] leading-relaxed">
                    <X size={17} className="mt-0.5 shrink-0 text-gray-400" />
                    <span><span className="font-semibold text-gray-700">{c.point}:</span> <span className="text-gray-500">{c.dark}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="flex flex-col gap-6 rounded-[32px] p-8 text-white md:flex-row md:items-center md:justify-between md:p-12" style={{ background: INK }}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Join us</p>
            <h2 className="mt-3 text-[1.8rem] font-black tracking-[-0.03em] leading-[1.1] md:text-[2.2rem]" style={{ fontFamily: HEAD_FONT }}>Be part of your neighbourhood's next chapter.</h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/65">List your store, restaurant or services for free — or simply order from the businesses around you.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/partner" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 hover:bg-gray-100">Become a partner <ArrowRight size={16} /></Link>
            <Link href="/now" className={btnPrimary} style={{ background: G }}>Order now</Link>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

export default About;
