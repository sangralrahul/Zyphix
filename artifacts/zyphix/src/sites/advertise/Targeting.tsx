import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Clock, Check } from 'lucide-react';
import { Section, Container, Eyebrow, Display, Lead, ArrowLink, SampleTag, fade, G } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Targeting feature story — text + CSS radius diagram (rings, pin, callouts).
──────────────────────────────────────────────────────────────────────────── */

function RadiusDiagram() {
  const rings = [100, 72, 44];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <div aria-hidden className="absolute inset-0 rounded-3xl border border-gray-200 bg-[#FAFAFA]" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      {rings.map((r, i) => (
        <motion.div key={r} {...fade(0.1 + i * 0.1, 0)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: `${r * 0.78}%`, height: `${r * 0.78}%`, borderColor: `rgba(13,163,102,${0.25 + i * 0.2})`, background: `rgba(13,163,102,${0.03 + i * 0.03})` }} />
      ))}
      <motion.div {...fade(0.4, 6)} className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(13,163,102,.4)]" style={{ background: G }}>
        <MapPin size={18} />
      </motion.div>
      {[
        { label: 'Delivery area', sub: '6 pin codes · Dwarka', icon: <MapPin size={13} />, cls: 'left-3 top-5 sm:left-5 sm:top-8' },
        { label: 'Category intent', sub: 'Searching "atta", browsing Staples', icon: <Search size={13} />, cls: 'right-3 top-[38%] sm:right-5' },
        { label: 'Time of day', sub: 'Evening, 6–10 pm', icon: <Clock size={13} />, cls: 'bottom-5 left-5 sm:bottom-8 sm:left-10' },
      ].map((c, i) => (
        <motion.div key={c.label} {...fade(0.5 + i * 0.1)} className={`absolute flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-[0_8px_30px_rgba(11,15,25,.08)] ${c.cls}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">{c.icon}</span>
          <div><p className="text-[12.5px] font-semibold text-gray-900">{c.label}</p><p className="text-[11.5px] text-gray-500">{c.sub}</p></div>
        </motion.div>
      ))}
      <SampleTag className="absolute bottom-3 right-3" />
    </div>
  );
}

export function Targeting() {
  return (
    <Section id="targeting" className="scroll-mt-16">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <div className="max-w-[520px]">
          <Eyebrow>Targeting</Eyebrow>
          <Display as="h2" size="lg" className="mt-4 text-gray-900">Target by where people shop, not who they are.</Display>
          <Lead className="mt-5">No profiles, no lookalikes. A placement runs in the delivery areas you pick, in the categories your product lives in, at the hours that matter.</Lead>
          <ul className="mt-7 space-y-3">
            {[
              ['Delivery area', 'Pin codes, sectors or a radius around partner stores.'],
              ['Category intent', 'Shown in the category or search your product belongs to.'],
              ['Time of day', 'Optional dayparts — breakfast, evening, weekend.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3 text-[15px]"><Check size={16} className="mt-1 shrink-0 text-emerald-600" /><span className="text-gray-600"><span className="font-semibold text-gray-900">{t}.</span> {d}</span></li>
            ))}
          </ul>
          <ArrowLink href="#contact" className="mt-7">Ask which areas are live</ArrowLink>
        </div>
        <RadiusDiagram />
      </Container>
    </Section>
  );
}
