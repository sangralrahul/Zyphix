import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, ListChecks } from 'lucide-react';
import { SectionHead, HEAD_FONT } from '@/components/layout/SiteChrome';
import { fade, TRACKS, SERVICE_LIST, type Track } from './shared';
import { DeliveryPhone, RestaurantDashboard, ServicesBooking, StoreCatalogue } from './Mockups';

/* ────────────────────────────────────────────────────────────────────────────
   Full track sections — photo + UI mock-up on one side, benefits on the other.
──────────────────────────────────────────────────────────────────────────── */

function Mock({ id }: { id: Track['id'] }) {
  switch (id) {
    case 'delivery':   return <DeliveryPhone />;
    case 'restaurant': return <RestaurantDashboard />;
    case 'services':   return <ServicesBooking />;
    case 'store':      return <StoreCatalogue />;
  }
}

const MOCK_CAPTION: Record<Track['id'], string> = {
  delivery: 'Delivery partner app — active order, route, per-order payout and weekly summary',
  restaurant: 'Partner dashboard — today\'s orders, menu availability toggles and prep-time control',
  services: 'Zyphix Book — booking request with slot, address area, job checklist and verified-badge progress',
  store: 'Store catalogue — stock toggles, low-stock alerts and nearby riders',
};

function TrackSection({ tr, flip, index }: { tr: Track; flip: boolean; index: number }) {
  const Visual = (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[32px] border border-gray-200">
        <img src={tr.photo} alt="" loading="lazy" className="h-[300px] w-full object-cover md:h-[360px]" />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0) 40%, rgba(11,18,32,.75) 100%)' }} />
        <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold text-gray-900 shadow">
          <span className="h-2 w-2 rounded-full" style={{ background: tr.tint }} /> {tr.product}
        </div>
        <p className="absolute bottom-5 left-5 right-5 text-[12.5px] font-semibold text-white/85">{MOCK_CAPTION[tr.id]}</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .25 }} className={`relative z-10 ${tr.id === 'delivery' ? '-mt-44 flex justify-center' : '-mt-20 px-3 sm:px-6'}`}>
        <Mock id={tr.id} />
      </motion.div>
    </div>
  );

  const Copy = (
    <div className="lg:py-6">
      <p className="text-[12px] font-bold uppercase tracking-[.12em]" style={{ color: tr.tint }}>{tr.eyebrow} · {tr.short}</p>
      <h2 className="mt-3 text-[1.9rem] font-black leading-[1.08] tracking-[-0.03em] text-gray-900 md:text-[2.4rem]" style={{ fontFamily: HEAD_FONT }}>{tr.headline}</h2>
      <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">{tr.body}</p>

      {tr.id === 'services' && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {SERVICE_LIST.map(s => (
            <li key={s.label} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-semibold" style={{ borderColor: '#DDD6FE', background: tr.bg, color: '#4C1D95' }}>
              <s.icon size={12} style={{ color: tr.tint }} /> {s.label}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-1">
        {tr.benefits.map(b => (
          <li key={b} className="flex items-start gap-2.5 text-[14px] text-gray-800">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" style={{ color: tr.tint }} /> {b}
          </li>
        ))}
      </ul>

      <div className="mt-7 grid gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-gray-500"><ListChecks size={13} /> Requirements</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {tr.requirements.map(r => <li key={r} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-gray-700">{r}</li>)}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-gray-500"><FileText size={13} /> What you need</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {tr.need.map(r => <li key={r} className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: tr.bg, color: tr.tint }}>{r}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link href={tr.href} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5 hover:opacity-95" style={{ background: tr.tint }}>
          {tr.cta} <ArrowRight size={16} />
        </Link>
        <a href="#onboarding" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 transition hover:bg-gray-50">How onboarding works</a>
      </div>
    </div>
  );

  return (
    <section id={`track-${tr.id}`} className={`scroll-mt-20 ${index % 2 === 1 ? 'bg-gray-50 border-y border-gray-200' : 'bg-white'}`}>
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <motion.div {...fade(0)} className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={flip ? 'lg:order-2' : ''}>{Visual}</div>
          <div className={flip ? 'lg:order-1' : ''}>{Copy}</div>
        </motion.div>
      </div>
    </section>
  );
}

export function Tracks() {
  return (
    <>
      <section className="mx-auto max-w-[1180px] px-5 pt-20 md:pt-24">
        <SectionHead eyebrow="Inside each track" title="What the work looks like, day to day." sub="Real partner tools, not promises. Every track below shows the actual app surface you will use — orders, menu, bookings or stock — alongside what you get and what we ask for." />
      </section>
      {TRACKS.map((tr, i) => <TrackSection key={tr.id} tr={tr} flip={i % 2 === 1} index={i} />)}
    </>
  );
}
