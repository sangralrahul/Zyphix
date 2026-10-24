import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, CreditCard, Bike, CheckCircle2, Store, Home, Phone, MessageSquare, PackageCheck, Clock } from 'lucide-react';
import { G, HEAD_FONT, SectionHead } from '@/components/layout/SiteChrome';
import { CONTAINER, SampleTag, fade, MONO } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   How it works — 4-step timeline + live-looking order tracker mock-up.
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: MapPin, t: 'Set your location', d: 'We show only the stores, kitchens and professionals that can actually reach you inside the 30-minute target — usually within 3 km.', chips: ['GPS or saved address', 'Flat / landmark notes'] },
  { icon: Search, t: 'Pick from real local shelves', d: 'Browse by category or search by product. Stock and prices come from the store itself, so what you see is what is on the shelf right now.', chips: ['Live inventory', 'Shelf prices'] },
  { icon: CreditCard, t: 'Pay the way you like', d: 'UPI, cards and wallets online — or cash on delivery. The delivery fee, if any, is shown before you pay. No surge, no handling charge.', chips: ['UPI · cards · COD', 'Fee shown up front'] },
  { icon: Bike, t: 'Track it to your door', d: 'The store packs, a nearby delivery partner picks up, and you follow every step live — with a call or chat button if anything needs a word.', chips: ['Live map', 'Call or chat with rider'] },
];

function MapMock() {
  return (
    <div className="relative h-[170px] overflow-hidden bg-[#EEF3EE]">
      <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(11,18,32,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11,18,32,.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div aria-hidden className="absolute left-0 right-0 top-[52px] h-[9px] bg-white" />
      <div aria-hidden className="absolute left-0 right-0 top-[120px] h-[7px] bg-white" />
      <div aria-hidden className="absolute bottom-0 top-0 left-[80px] w-[8px] bg-white" />
      <div aria-hidden className="absolute bottom-0 top-0 left-[230px] w-[6px] bg-white" />
      <div aria-hidden className="absolute left-[96px] top-[68px] h-[44px] w-[110px] rounded-sm bg-emerald-100/70" />
      <div aria-hidden className="absolute left-[246px] top-[10px] h-[36px] w-[90px] rounded-sm bg-emerald-100/50" />
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 360 170" fill="none" preserveAspectRatio="none">
        <path d="M48 134 L84 134 L84 56 L230 56 L230 26 L300 26" stroke={G} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 7" />
        <path d="M48 134 L84 134 L84 56 L170 56" stroke={G} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="absolute left-[158px] top-[44px] flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md" style={{ background: G }}><Bike size={13} /></span>
      <span className="absolute left-[38px] top-[118px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white shadow"><Store size={12} /></span>
      <span className="absolute left-[288px] top-[10px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white shadow" style={{ background: G }}><Home size={12} /></span>
      <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-700 shadow-sm">1.6 km · 2 min away</div>
      <SampleTag className="absolute right-2 top-2" />
    </div>
  );
}

export function OrderTracker({ className = '' }: { className?: string }) {
  const TL = [
    { icon: CheckCircle2, label: 'Order placed', sub: '7:42 PM · paid via UPI', state: 'done' },
    { icon: Store, label: 'Sharma Kirana packed 6 items', sub: '7:46 PM · 4 min', state: 'done' },
    { icon: Bike, label: 'Rider Arjun picked up', sub: '7:49 PM · 1.6 km to you', state: 'active' },
    { icon: Home, label: 'Delivered', sub: 'Leave at door · Flat 3B', state: 'todo' },
  ];
  return (
    <div className={`w-full max-w-[420px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)] ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Order #ZN-4821</p>
          <p className="flex items-center gap-1.5 text-[13px] font-black" style={{ fontFamily: HEAD_FONT }}>
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
            Arriving in 2 min
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700" style={MONO}><Clock size={11} /> 14 min total</span>
      </div>
      <MapMock />
      <div className="px-4 pt-4">
        {TL.map((s, i, arr) => (
          <div key={s.label} className="relative flex gap-3 pb-3.5">
            {i < arr.length - 1 && <span aria-hidden className="absolute left-[11px] top-6 h-[calc(100%-14px)] w-px" style={{ background: s.state === 'done' ? G : '#E5E7EB' }} />}
            <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: s.state === 'todo' ? '#E5E7EB' : G, background: s.state === 'done' ? G : '#fff', color: s.state === 'todo' ? '#9CA3AF' : G }}>
              {s.state === 'done' ? <CheckCircle2 size={14} className="text-white" /> : <s.icon size={12} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`truncate text-[12.5px] font-bold ${s.state === 'todo' ? 'text-gray-400' : 'text-gray-900'}`}>{s.label}</p>
                {s.state === 'active' && <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">Now</span>}
              </div>
              <p className="truncate text-[11px] text-gray-500">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm"><Bike size={16} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-gray-900">Arjun · Zyphix delivery partner</p>
          <p className="text-[10.5px] text-gray-500">Verified · 6 items · ₹134 paid</p>
        </div>
        <button type="button" aria-label="Call rider" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700"><Phone size={14} /></button>
        <button type="button" aria-label="Chat with rider" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700"><MessageSquare size={14} /></button>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white">
      <div className={`${CONTAINER} py-20 md:py-24`}>
        <SectionHead eyebrow="How it works" title="From tap to doorstep in four steps." sub="Hyperlocal by design: every order is fulfilled by a business within a few kilometres of you and carried by a rider from the same area." />

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.15fr_.85fr]">
          {/* timeline */}
          <ol className="relative grid gap-6 sm:grid-cols-2">
            <span aria-hidden className="absolute left-[22px] top-6 hidden h-[calc(100%-48px)] w-px bg-gray-200 sm:hidden" />
            {STEPS.map((s, i) => (
              <motion.li key={s.t} {...fade(i * .07)} className="relative rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(11,18,32,.08)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><s.icon size={20} /></span>
                  <span className="text-[34px] font-black leading-none text-gray-200" style={{ fontFamily: HEAD_FONT }}>0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-[18px] font-extrabold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.d}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.chips.map(c => <span key={c} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11.5px] font-semibold text-gray-600">{c}</span>)}
                </div>
                {i < STEPS.length - 1 && <span aria-hidden className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 sm:flex"><ArrowRight size={12} /></span>}
              </motion.li>
            ))}
          </ol>

          {/* tracker */}
          <motion.div {...fade(.2)} className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:justify-self-end">
            <div aria-hidden className="absolute -inset-6 rounded-[40px] opacity-70 blur-2xl" style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,.25), transparent)' }} />
            <OrderTracker className="relative" />
            <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: G }}><PackageCheck size={18} /></span>
              <p className="text-[13px] leading-snug text-gray-600"><span className="font-bold text-gray-900">Something wrong with an item?</span> Report it from the order screen — refunds for missing or damaged items go back to the original payment method.</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/now" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: G }}>Place your first order <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
