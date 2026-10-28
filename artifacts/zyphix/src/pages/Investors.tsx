import React from 'react';
import { Link } from 'wouter';
import {
  ArrowRight, Mail, Store, UtensilsCrossed, Wrench, MapPin, Leaf, Coins,
  Smartphone, TrendingUp, Users, Globe, Handshake, Lightbulb, Building2,
} from 'lucide-react';
import { Kicker, Reveal, GlowButton, GhostButton, ParallaxImage } from '@/ui/cinema';
import { Accent, Magnetic } from '@/ui/motion2';
import { VIDEOS, landscape } from '@/data/media';
import { InnerPage, InnerHero, SectionIntro, Band, panel, iconChip, h3, body } from './home/Inner';
import { Display } from './home/shared';

/* ────────────────────────────────────────────────────────────────────────────
   Investors — thesis, qualitative market view, product lines, the ask.
   No invented figures: Zyphix is pre-launch / onboarding.
──────────────────────────────────────────────────────────────────────────── */

const DECK_MAILTO = 'mailto:hello@zyphix.in?subject=' + encodeURIComponent('Request for Zyphix investor deck');

const THESIS = [
  { icon: <MapPin size={20} />, t: 'Hyperlocal by design', d: 'Every order is fulfilled by a business within a few kilometres of the customer. Short distances make fast delivery possible without expensive infrastructure.' },
  { icon: <Leaf size={20} />, t: 'Local-first, not dark stores', d: 'We put existing stores, restaurants and professionals online instead of building warehouses that compete with them. Supply already exists; we add the software.' },
  { icon: <Coins size={20} />, t: 'Asset-light unit economics', d: 'No inventory, no cold storage, no warehouse leases. Zyphix earns a platform fee on transactions it enables rather than carrying the cost of goods.' },
  { icon: <Smartphone size={20} />, t: 'One app, many categories', d: 'Groceries, food and home services share one account, one delivery network and one customer relationship, raising frequency and lifetime value.' },
];

const MARKET = [
  { icon: <Users size={20} />, t: 'A dense, trusted supply base', d: 'Every neighbourhood is served by independent stores, eateries and service professionals. Most are still offline, and most customers still buy from them every week.' },
  { icon: <Globe size={20} />, t: 'Demand beyond the biggest cities', d: 'Quick-commerce players have concentrated on a handful of very large cities. Smaller cities and towns have the same appetite for convenience and far fewer options.' },
  { icon: <TrendingUp size={20} />, t: 'Rising digital readiness', d: 'Affordable data, instant digital payments and smartphones mean both shopkeepers and customers are ready to transact online. They only need a platform built around them.' },
  { icon: <Handshake size={20} />, t: 'A partner-aligned model', d: 'Independent businesses are wary of platforms that undercut them. A model that keeps their margin and their customer relationship earns loyalty that discounting cannot.' },
];

const PRODUCTS = [
  { icon: <Store size={22} />, photo: landscape('produce', 0), name: 'Zyphix Now', tag: 'Groceries & essentials', d: 'Live inventory and shelf prices from stores near the customer, delivered within an under-10-minute target.', href: '/now' },
  { icon: <UtensilsCrossed size={22} />, photo: landscape('chef', 0), name: 'Zyphix Eats', tag: 'Food delivery', d: 'Neighbourhood restaurants, cafés and cloud kitchens on fair, flat commissions.', href: '/eats' },
  { icon: <Wrench size={22} />, photo: landscape('electrician', 0), name: 'Zyphix Book', tag: 'Home services', d: 'Verified local electricians, plumbers, cleaners and more, booked and paid transparently in-app.', href: '/book' },
];

const LOOKING_FOR = [
  { icon: <Lightbulb size={18} />, t: 'Early-stage partners', d: 'Angels and pre-seed / seed funds who back founders at the pre-launch stage and are comfortable with a build-and-learn roadmap.' },
  { icon: <Building2 size={18} />, t: 'Operators with local-commerce depth', d: 'Investors who understand retail, logistics or payments and can open doors to partners and talent.' },
  { icon: <Handshake size={18} />, t: 'Long-term alignment', d: 'Capital that values a durable, partner-friendly marketplace over subsidised growth.' },
];

const STATUS = ['Founded 2024', 'Pre-launch · onboarding the first neighbourhoods', 'Three product lines on one platform', 'Zero surge pricing'];

export function Investors() {
  return (
    <InnerPage title="Investors">
      <InnerHero
        clip={VIDEOS.nightCity}
        kicker="Investor relations"
        parts={['Building the', { accent: 'SuperLocal', green: true }, 'commerce layer.']}
        sub="Zyphix brings groceries, food and home services online from the independent businesses that already serve every neighbourhood, without dark warehouses."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic><GlowButton href={DECK_MAILTO} className="w-full sm:w-auto"><Mail size={17} /> Request investor deck</GlowButton></Magnetic>
          <GhostButton href="/about">About Zyphix <ArrowRight size={17} /></GhostButton>
        </div>
      </InnerHero>

      {/* Status strip — honest, no invented numbers */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex w-full max-w-[1120px] flex-wrap gap-x-8 gap-y-3 px-5 py-6 text-[14px] text-gray-600 sm:px-8">
          {STATUS.map(t => (
            <span key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#0DA366]" />{t}</span>
          ))}
        </div>
      </section>

      {/* Thesis */}
      <Band>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro kicker="Thesis" title={<>Why local&#8209;first <Accent green>wins</Accent>.</>} sub="Quick commerce has been built around warehouses. We believe the next wave is built around the shops that are already there." />
            <Reveal delay={0.15} y={32} className="mt-10 hidden lg:block"><ParallaxImage photo={landscape('shopOwner', 1)} ratio="4/5" /></Reveal>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {THESIS.map((t, i) => (
              <Reveal key={t.t} delay={i * 0.06} y={24} className={`${panel} p-7`}>
                <span className={iconChip}>{t.icon}</span>
                <h3 className={`mt-6 ${h3}`}>{t.t}</h3>
                <p className={`mt-3 ${body}`}>{t.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Band>

      {/* Market opportunity (qualitative) */}
      <Band tone="dark">
        <SectionIntro light kicker="Market opportunity" title={<>A large market the incumbents have <Accent green>left open</Accent>.</>} sub="We share market sizing and traction in the investor deck. The qualitative case is simple." />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {MARKET.map((m, i) => (
            <Reveal key={m.t} delay={i * 0.06} y={24} className="flex gap-5 rounded-3xl bg-white/[.04] p-7 ring-1 ring-white/10">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10">{m.icon}</span>
              <div>
                <h3 className="text-[20px] font-semibold tracking-[-0.025em] text-white">{m.t}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-white/65">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Product lines */}
      <Band>
        <SectionIntro kicker="Product lines" title={<>One account, one network, <Accent green>three</Accent> experiences.</>} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06} y={24}>
              <Link href={p.href} className={`${panel} group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(11,18,32,.25)]`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img src={p.photo.src} alt={p.photo.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
                  <span className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-emerald-700 backdrop-blur">{p.icon}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700">{p.tag}</p>
                  <h3 className={`mt-2 ${h3}`}>{p.name}</h3>
                  <p className={`mt-3 flex-1 ${body}`}>{p.d}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-emerald-700">See the product <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* What we're looking for */}
      <Band tone="soft">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro kicker="What we're looking for" title={<>Partners for the <Accent green>earliest</Accent> chapter.</>} sub="We are raising an early round to onboard partners, launch in our first neighbourhoods and build out the product. The deck, roadmap and financial model are shared on request." />
            <Reveal delay={0.15} className="mt-9"><GlowButton href={DECK_MAILTO}><Mail size={17} /> Request investor deck</GlowButton></Reveal>
          </div>
          <div className="grid gap-4 lg:col-span-7">
            {LOOKING_FOR.map((l, i) => (
              <Reveal key={l.t} delay={i * 0.06} y={20} className={`${panel} flex gap-5 p-7`}>
                <span className={iconChip}>{l.icon}</span>
                <div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.025em] text-gray-900">{l.t}</h3>
                  <p className={`mt-2 ${body}`}>{l.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Band>

      {/* CTA */}
      <Band tone="dark">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal><Kicker light>Get in touch</Kicker></Reveal>
            <Reveal delay={0.05}><Display light>Let's build the SuperLocal economy <Accent green>together</Accent>.</Display></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-white/65">Email us for the investor deck or to schedule a call with the founder.</p></Reveal>
          </div>
          <Reveal delay={0.15} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <GlowButton href={DECK_MAILTO}><Mail size={17} /> hello@zyphix.in</GlowButton>
            <GhostButton href="/contact">Contact page <ArrowRight size={17} /></GhostButton>
          </Reveal>
        </div>
      </Band>
    </InnerPage>
  );
}

export default Investors;
