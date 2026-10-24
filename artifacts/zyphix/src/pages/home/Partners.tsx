import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Store, UtensilsCrossed, Bike, Wrench, Megaphone, ExternalLink, CheckCircle2 } from 'lucide-react';
import { G, HEAD_FONT, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, PHOTOS, fade, PARTNER_SITE, ADVERTISE_SITE, ORANGE, BLUE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Partners — dark INK band linking the tracks to partner.zyphix.in.
──────────────────────────────────────────────────────────────────────────── */

const TRACKS = [
  { icon: Bike, tint: BLUE, t: 'Deliver with Zyphix', d: 'Short, local runs in your own area. Payout shown before you accept, settled weekly.', href: '/delivery-setup', cta: 'Start delivering', photo: PHOTOS.rider, chips: ['Weekly payouts', 'Own vehicle'] },
  { icon: UtensilsCrossed, tint: ORANGE, t: 'Restaurants & kitchens', d: 'Reach nearby customers with a flat, transparent commission and a dashboard built for the kitchen.', href: '/restaurant-setup', cta: 'Register restaurant', photo: PHOTOS.thali, chips: ['Flat commission', 'FSSAI licence'] },
  { icon: Wrench, tint: '#7C3AED', t: 'Service professionals', d: 'Electricians, plumbers, cleaners, salon-at-home — get verified, get a badge, get bookings.', href: '/service-setup', cta: 'Join as a professional', photo: PHOTOS.cleaning, chips: ['Verified badge', 'ID + background check'] },
  { icon: Store, tint: G, t: 'Kirana & local stores', d: 'Put your shelves online, keep your customers, keep your margins. Barcode-scan catalogue setup.', href: '/merchant-setup', cta: 'List your store', photo: PHOTOS.shelves, chips: ['Keep your prices', 'Free onboarding'] },
];

export function Partners() {
  return (
    <section id="partners" className="scroll-mt-20 text-white" style={{ background: INK }}>
      <div className={`${CONTAINER} py-20 md:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Partner with Zyphix</p>
            <h2 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-[-0.035em] md:text-[3rem]" style={{ fontFamily: HEAD_FONT }}>
              Built for the people who already run your neighbourhood.
            </h2>
          </div>
          <div>
            <p className="text-[15.5px] leading-relaxed text-white/65">
              Zyphix brings digital ordering, delivery, payments and marketing tools to independent businesses — and you stay the hero of your street. Free to apply, no joining fee, and a real onboarding manager from application to go-live.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-white/70">
              {['Free to apply', 'Weekly payouts', 'Verification call within 2 working days'].map(k => <li key={k} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> {k}</li>)}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={PARTNER_SITE} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 transition hover:bg-gray-100">Open partner portal <ExternalLink size={15} /></a>
              <a href={ADVERTISE_SITE} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-[14.5px] font-bold text-white backdrop-blur transition hover:bg-white/15"><Megaphone size={15} className="text-emerald-300" /> Advertise with us</a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((t, i) => (
            <motion.div key={t.t} {...fade(.08 + i * .06)} className="flex">
              <Link href={t.href} className="group relative flex min-h-[340px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] transition hover:-translate-y-1 hover:border-white/20">
                <img src={t.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-80" />
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,.15) 0%, rgba(11,18,32,.55) 45%, rgba(11,18,32,.96) 100%)' }} />
                <div className="relative flex flex-1 flex-col justify-between p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: t.tint }}><t.icon size={18} /></span>
                  <div>
                    <h3 className="text-[20px] font-black leading-tight tracking-tight" style={{ fontFamily: HEAD_FONT }}>{t.t}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/70">{t.d}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{t.chips.map(c => <span key={c} className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold backdrop-blur">{c}</span>)}</div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-emerald-300">{t.cta} <ArrowRight size={14} className="transition group-hover:translate-x-0.5" /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* advertise strip */}
        <motion.div {...fade(.35)} className="mt-6 grid items-center gap-5 rounded-3xl border border-white/10 bg-white/[.04] p-6 md:grid-cols-[auto_1fr_auto] md:p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"><Megaphone size={22} /></span>
          <div>
            <p className="text-[17px] font-extrabold" style={{ fontFamily: HEAD_FONT }}>Brands and local businesses: reach customers while they shop.</p>
            <p className="mt-1 text-[13.5px] text-white/60">Home banners, sponsored rows, product spotlights and search placements inside Zyphix Now, Eats and Book — targeted by delivery area, priced flat, always labelled "Sponsored".</p>
          </div>
          <a href={ADVERTISE_SITE} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: G }}>advertise.zyphix.in <ArrowRight size={15} /></a>
        </motion.div>
      </div>
    </section>
  );
}
