import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Mail, Store, UtensilsCrossed, Wrench, MapPin, Leaf, BadgeIndianRupee,
  Smartphone, TrendingUp, Users, Globe, Handshake, Lightbulb, Building2,
} from 'lucide-react';
import { SitePage, PageHero, SectionHead, btnPrimary, btnSecondary, card, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Investors — thesis, qualitative market view, product lines, the ask.
   No invented figures: Zyphix is pre-launch / onboarding.
──────────────────────────────────────────────────────────────────────────── */

const DECK_MAILTO = 'mailto:hello@zyphix.in?subject=' + encodeURIComponent('Request for Zyphix investor deck');

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .5, ease: 'easeOut' as const, delay },
});

const THESIS = [
  { icon: <MapPin size={20} />, t: 'Hyperlocal by design', d: 'Every order is fulfilled by a business within a few kilometres of the customer. Short distances make fast delivery possible without expensive infrastructure.' },
  { icon: <Leaf size={20} />, t: 'Local-first, not dark stores', d: 'We put existing kirana stores, restaurants and professionals online instead of building warehouses that compete with them. Supply already exists; we add the software.' },
  { icon: <BadgeIndianRupee size={20} />, t: 'Asset-light unit economics', d: 'No inventory, no cold storage, no warehouse leases. Zyphix earns a platform fee on transactions it enables rather than carrying the cost of goods.' },
  { icon: <Smartphone size={20} />, t: 'One app, many categories', d: 'Groceries, food, pharmacy and home services share one account, one delivery network and one customer relationship, raising frequency and lifetime value.' },
];

const MARKET = [
  { icon: <Users size={20} />, t: 'A dense, trusted supply base', d: 'India\'s neighbourhoods are served by millions of independent kirana stores, eateries and service professionals. Most are still offline, and most customers still buy from them every week.' },
  { icon: <Globe size={20} />, t: 'Demand beyond the metros', d: 'Quick-commerce players have concentrated on a handful of large cities. Smaller cities and towns have the same appetite for convenience and far fewer options.' },
  { icon: <TrendingUp size={20} />, t: 'Rising digital readiness', d: 'Affordable data, UPI payments and smartphone adoption mean both shopkeepers and customers are ready to transact online — they only need a platform built around them.' },
  { icon: <Handshake size={20} />, t: 'A partner-aligned model', d: 'Independent businesses are wary of platforms that undercut them. A model that keeps their margin and their customer relationship earns loyalty that discounting cannot.' },
];

const PRODUCTS = [
  { icon: <Store size={22} />, tint: '#0DA366', bg: '#ECFDF5', name: 'Zyphix Now', tag: 'Groceries & essentials', d: 'Live inventory and shelf prices from kirana stores near the customer, delivered within an under-30-minute target.', href: '/now' },
  { icon: <UtensilsCrossed size={22} />, tint: '#EA580C', bg: '#FFF7ED', name: 'Zyphix Eats', tag: 'Food delivery', d: 'Neighbourhood restaurants, dhabas and cloud kitchens on fair, flat commissions.', href: '/eats' },
  { icon: <Wrench size={22} />, tint: '#2563EB', bg: '#EFF6FF', name: 'Zyphix Book', tag: 'Home services', d: 'Verified local electricians, plumbers, cleaners and more, booked and paid transparently in-app.', href: '/book' },
];

const LOOKING_FOR = [
  { icon: <Lightbulb size={18} />, t: 'Early-stage partners', d: 'Angels and pre-seed / seed funds who back founders at the pre-launch stage and are comfortable with a build-and-learn roadmap.' },
  { icon: <Building2 size={18} />, t: 'Operators with India depth', d: 'Investors who understand retail, logistics or payments in India and can open doors to partners and talent.' },
  { icon: <Handshake size={18} />, t: 'Long-term alignment', d: 'Capital that values a durable, partner-friendly marketplace over subsidised growth.' },
];

export function Investors() {
  return (
    <SitePage title="Investors">
      <PageHero
        eyebrow="Investor relations"
        title={<>Building India's <span style={{ color: G }}>SuperLocal</span> commerce layer.</>}
        sub="Zyphix is a hyperlocal platform that brings groceries, food and home services online from the independent businesses that already serve every neighbourhood — without dark warehouses."
      >
        <a href={DECK_MAILTO} className={btnPrimary} style={{ background: G }}><Mail size={16} /> Request investor deck</a>
        <Link href="/about" className={btnSecondary}>About Zyphix <ArrowRight size={16} /></Link>
      </PageHero>

      {/* Status strip — honest, no invented numbers */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-[1180px] flex-wrap gap-x-8 gap-y-2 px-5 py-4 text-[13.5px] text-gray-600">
          {['Founded 2024', 'Pre-launch · onboarding partners across India', 'Three product lines on one platform', 'Zero surge pricing'].map(t => (
            <span key={t} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} />{t}</span>
          ))}
        </div>
      </section>

      {/* Thesis */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="Thesis" title="Why local-first wins." sub="Quick commerce has been built around warehouses. We believe the next wave is built around the shops that are already there." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {THESIS.map((t, i) => (
            <motion.div key={t.t} {...fade(i * .06)} className={`${card} p-7`}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{t.icon}</span>
              <h3 className="mt-4 text-[18px] font-extrabold text-gray-900">{t.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{t.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market opportunity (qualitative) */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <SectionHead eyebrow="Market opportunity" title="A large market the incumbents have left open." sub="We share market sizing and traction in the investor deck. The qualitative case is simple." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {MARKET.map(m => (
              <div key={m.t} className={`${card} flex gap-5 p-6`}>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{m.icon}</span>
                <div>
                  <h3 className="text-[16.5px] font-extrabold text-gray-900">{m.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product lines */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="Product lines" title="One account, one network, three experiences." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PRODUCTS.map(p => (
            <Link key={p.name} href={p.href} className={`${card} group flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.10)]`}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: p.bg, color: p.tint }}>{p.icon}</span>
              <p className="mt-5 text-[12px] font-bold uppercase tracking-wider" style={{ color: p.tint }}>{p.tag}</p>
              <h3 className="mt-1 text-[22px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{p.name}</h3>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-gray-600">{p.d}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: p.tint }}>See the product <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* What we're looking for */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-5 py-20 md:grid-cols-[.9fr_1.1fr] md:py-24">
          <div>
            <SectionHead align="left" eyebrow="What we're looking for" title="Partners for the earliest chapter." sub="We are raising an early round to onboard partners, launch in our first neighbourhoods and build out the product. The deck, roadmap and financial model are shared on request." />
            <a href={DECK_MAILTO} className={`${btnPrimary} mt-8`} style={{ background: G }}><Mail size={16} /> Request investor deck</a>
          </div>
          <div className="grid gap-4">
            {LOOKING_FOR.map(l => (
              <div key={l.t} className={`${card} flex gap-4 p-6`}>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{l.icon}</span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-gray-900">{l.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{l.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="flex flex-col gap-6 rounded-[32px] p-8 text-white md:flex-row md:items-center md:justify-between md:p-12" style={{ background: INK }}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Get in touch</p>
            <h2 className="mt-3 text-[1.8rem] font-black tracking-[-0.03em] leading-[1.1] md:text-[2.2rem]" style={{ fontFamily: HEAD_FONT }}>Let's build India's SuperLocal economy together.</h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/65">Email us for the investor deck or to schedule a call with the founder.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={DECK_MAILTO} className={btnPrimary} style={{ background: G }}><Mail size={16} /> hello@zyphix.in</a>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-[14.5px] font-bold text-white hover:bg-white/10">Contact page <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

export default Investors;
