import React from 'react';
import {
  ArrowRight, Store, Warehouse, Leaf, BadgePercent, Clock, ShieldCheck,
  Handshake, MapPin, Check, X,
} from 'lucide-react';
import { Kicker, Reveal, ParallaxImage, PhotoTile, GlowButton, GhostButton } from '@/ui/cinema';
import { Accent, Magnetic } from '@/ui/motion2';
import { VIDEOS, landscape } from '@/data/media';
import { InnerPage, InnerHero, SectionIntro, Band, panel, iconChip, h3, body } from './home/Inner';
import { Display } from './home/shared';

/* ────────────────────────────────────────────────────────────────────────────
   About — company story, mission, values, local-first vs dark stores.
──────────────────────────────────────────────────────────────────────────── */

const FACTS = [
  { icon: <MapPin size={18} />, v: 'Founded 2024', l: 'Independent and founder-led' },
  { icon: <Clock size={18} />, v: 'Under 10 minutes', l: 'Doorstep delivery target' },
  { icon: <BadgePercent size={18} />, v: 'Zero surge', l: 'Shelf price is the app price' },
  { icon: <Store size={18} />, v: 'Rolling out', l: 'Neighbourhood by neighbourhood' },
];

const VALUES = [
  { icon: <Handshake size={20} />, t: 'Partners first', d: 'Free onboarding, fair commissions and weekly payouts. Zyphix only works when the corner store and the kitchen win too.' },
  { icon: <BadgePercent size={20} />, t: 'Radical transparency', d: 'No surge pricing and no hidden handling fees. Every charge is shown before you pay.' },
  { icon: <Clock size={20} />, t: 'Speed by design', d: 'Short distances and live local inventory, not giant warehouses, are what make fast delivery possible.' },
  { icon: <ShieldCheck size={20} />, t: 'Trust and safety', d: 'Verified partners, secure payments and live tracking on every order and every service booking.' },
];

const COMPARE: Array<{ point: string; local: string; dark: string }> = [
  { point: 'Where your order comes from', local: 'A real store, restaurant or professional near you', dark: 'A warehouse built to compete with them' },
  { point: 'Who keeps the margin', local: 'The local business, with a fair platform fee', dark: 'The platform, after heavy discounting' },
  { point: 'Pricing', local: 'Shelf price, no surge', dark: 'Dynamic pricing and handling fees' },
  { point: 'Impact on the neighbourhood', local: 'More customers for existing shops', dark: 'Fewer independent shops over time' },
];

export function About() {
  return (
    <InnerPage title="About">
      <InnerHero
        clip={VIDEOS.merchant}
        kicker="Our story"
        parts={['Built for the', { accent: 'neighbourhood', green: true }, 'economy.']}
        sub="Your corner store, favourite kitchen and trusted plumber deserve world-class technology, without being replaced by it. That is the whole idea."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic><GlowButton href="/now" className="w-full sm:w-auto">Order now <ArrowRight size={17} /></GlowButton></Magnetic>
          <GhostButton href="/partner">Partner with us</GhostButton>
        </div>
      </InnerHero>

      {/* Facts (honest, no invented metrics) */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid w-full max-w-[1120px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.v} delay={i * 0.05} className={`flex items-start gap-3.5 py-8 md:py-10 ${i % 2 ? 'pl-4 sm:pl-6' : 'pr-4'} ${i > 0 ? 'lg:border-l lg:border-gray-100 lg:pl-6' : ''}`}>
              <span className="mt-0.5 text-emerald-600">{f.icon}</span>
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.02em] text-gray-900">{f.v}</p>
                <p className="mt-0.5 text-[13.5px] text-gray-500">{f.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission */}
      <Band>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionIntro kicker="Mission" title={<>Technology for the shops that <Accent green>already</Accent> run your street.</>} />
            <Reveal delay={0.1} className="mt-8 space-y-4 text-[17px] leading-[1.65] text-gray-600">
              <p>Every neighbourhood runs on independent stores, food businesses and service professionals. They know their customers by name, but most have never had the tools that large chains take for granted.</p>
              <p>Zyphix gives every local business a digital storefront, simple order and inventory management, delivery and payments, and gives customers one app for groceries, food and home services from the places they already trust.</p>
              <p className="font-medium text-gray-900">We call it SuperLocal: a superapp for the local economy, not a replacement for it.</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-6">
            <Reveal y={32} className="col-span-2"><ParallaxImage photo={landscape('shopOwner', 0)} ratio="16/10" /></Reveal>
            <Reveal y={32} delay={0.08}><PhotoTile photo={landscape('chef', 0)} ratio="1/1" rounded="rounded-3xl" /></Reveal>
            <Reveal y={32} delay={0.14}><PhotoTile photo={landscape('rider', 0)} ratio="1/1" rounded="rounded-3xl" /></Reveal>
          </div>
        </div>
      </Band>

      {/* Values */}
      <Band tone="soft">
        <SectionIntro kicker="What we stand for" title={<>Four principles behind <Accent green>every</Accent> decision.</>} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06} y={24} className={`${panel} p-7`}>
              <span className={iconChip}>{v.icon}</span>
              <h3 className={`mt-6 ${h3}`}>{v.t}</h3>
              <p className={`mt-3 ${body}`}>{v.d}</p>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* How we're different */}
      <Band>
        <SectionIntro kicker="How we're different" title={<>Local-first, not <Accent green>dark stores</Accent>.</>} sub="Most quick-commerce apps build warehouses that compete with the shops around you. Zyphix puts those shops online instead." />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal y={24} className="rounded-3xl bg-[#05080E] p-8 text-white md:p-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0DA366] text-white"><Leaf size={20} /></span>
            <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.03em]">Zyphix: local-first</h3>
            <ul className="mt-6 space-y-4">
              {COMPARE.map(c => (
                <li key={c.point} className="flex gap-3 text-[15px] leading-[1.55]">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span><span className="font-medium text-white">{c.point}:</span> <span className="text-white/65">{c.local}</span></span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal y={24} delay={0.08} className={`${panel} p-8 md:p-10`}>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-500"><Warehouse size={20} /></span>
            <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-gray-500">Dark-store model</h3>
            <ul className="mt-6 space-y-4">
              {COMPARE.map(c => (
                <li key={c.point} className="flex gap-3 text-[15px] leading-[1.55]">
                  <X size={18} className="mt-0.5 shrink-0 text-gray-400" />
                  <span><span className="font-medium text-gray-700">{c.point}:</span> <span className="text-gray-500">{c.dark}</span></span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Band>

      {/* CTA */}
      <Band tone="dark">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal><Kicker light>Join us</Kicker></Reveal>
            <Reveal delay={0.05}><Display light>Be part of your neighbourhood's <Accent green>next chapter</Accent>.</Display></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-white/65">List your store, restaurant or services for free, or simply order from the businesses around you.</p></Reveal>
          </div>
          <Reveal delay={0.15} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <GlowButton href="/partner">Become a partner <ArrowRight size={17} /></GlowButton>
            <GhostButton href="/now">Order now</GhostButton>
          </Reveal>
        </div>
      </Band>
    </InnerPage>
  );
}

export default About;
