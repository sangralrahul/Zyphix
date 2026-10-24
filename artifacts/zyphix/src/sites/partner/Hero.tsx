import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin, Wallet, BadgeCheck, Headset, ShieldCheck, Smartphone, IndianRupee, CheckCircle2 } from 'lucide-react';
import { SectionHead, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';
import { fade, PHOTOS, TRACKS, SERVICE_LIST, VIOLET } from './shared';
import { HeroOrderCard } from './Mockups';

/* ── Hero ────────────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative overflow-hidden text-white" style={{ background: INK }}>
      <img src={PHOTOS.hero} alt="Delivery partner riding through a neighbourhood" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,18,32,.92) 0%, rgba(11,18,32,.78) 45%, rgba(11,18,32,.35) 100%)' }} />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,.15) 0%, rgba(11,18,32,0) 40%, rgba(11,18,32,.9) 100%)' }} />

      <div className="relative mx-auto grid min-h-[70vh] max-w-[1180px] items-center gap-10 px-5 pb-20 pt-14 md:min-h-[80vh] md:grid-cols-[1.1fr_.9fr] md:pb-24 md:pt-20">
        <div>
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12.5px] font-bold text-emerald-300 backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            Zyphix partner portal · Onboarding across India
          </motion.div>
          <motion.h1 {...fade(.05)} className="mt-6 max-w-[760px] text-[2.6rem] font-black leading-[1.0] tracking-[-0.045em] sm:text-[3.6rem] lg:text-[4.4rem]" style={{ fontFamily: HEAD_FONT }}>
            Earn, cook, fix and sell —<br className="hidden sm:block" /> <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #34D399, #10B981 50%, #A7F3D0)' }}>in your own neighbourhood.</span>
          </motion.h1>
          <motion.p {...fade(.1)} className="mt-6 max-w-[560px] text-[16.5px] leading-relaxed text-white/75">
            Zyphix is the SuperLocal app for groceries, food and home services. Partner as a delivery rider, a restaurant or kitchen, a verified Zyphix Book professional, or a kirana store — with transparent terms, weekly payouts and a real onboarding manager.
          </motion.p>
          <motion.div {...fade(.15)} className="mt-8 flex flex-wrap gap-3">
            <a href="#tracks" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}>
              Choose your track <ArrowRight size={17} />
            </a>
            <a href="mailto:partnerships@zyphix.in" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15">
              <Mail size={16} /> partnerships@zyphix.in
            </a>
          </motion.div>
          <motion.ul {...fade(.2)} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-white/70">
            {['Free to apply', 'No joining fee', 'Verification call within 2 working days', 'Go live with a real person\'s help'].map(k => (
              <li key={k} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> {k}</li>
            ))}
          </motion.ul>
        </div>

        {/* floating UI card */}
        <motion.div initial={{ opacity: 0, y: 28, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .7, delay: .2 }} className="relative hidden justify-end md:flex">
          <div className="relative">
            <HeroOrderCard />
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .6 }} className="absolute -left-36 top-[62%] flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: VIOLET }}><BadgeCheck size={18} /></span>
              <div>
                <p className="text-[12.5px] font-bold">Verified member</p>
                <p className="text-[11px] text-gray-500">Zyphix Book · badge live</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }} className="absolute -bottom-10 right-6 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Wallet size={18} /></span>
              <div>
                <p className="text-[12.5px] font-bold">Weekly payout</p>
                <p className="text-[11px] text-gray-500">Settles every Monday</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Trust strip ─────────────────────────────────────────────────────────── */
const SIGNALS = [
  { icon: MapPin, t: 'Onboarding across India', d: 'Neighbourhood by neighbourhood' },
  { icon: Wallet, t: 'Weekly payouts', d: 'Settled to your bank account' },
  { icon: BadgeCheck, t: 'Verified badge', d: 'After ID and background checks' },
  { icon: Headset, t: 'Dedicated onboarding manager', d: 'A real person, start to go-live' },
  { icon: IndianRupee, t: 'Transparent terms', d: 'Commission explained before go-live' },
  { icon: Smartphone, t: 'Partner app & dashboard', d: 'Orders, menu, stock, payouts' },
];
export function TrustStrip() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-y divide-gray-200 px-5 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0 lg:divide-x">
        {SIGNALS.map((s, i) => (
          <motion.div key={s.t} {...fade(.05 * i)} className="flex items-start gap-3 py-5 lg:px-4 lg:first:pl-0 lg:last:pr-0">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><s.icon size={17} /></span>
            <div>
              <p className="text-[13px] font-extrabold leading-tight text-gray-900">{s.t}</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-gray-500">{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Track grid (photo cards) ────────────────────────────────────────────── */
export function TrackGrid() {
  const [delivery, restaurant, services, store] = TRACKS;
  const Card = ({ tr, big = false, delay = 0 }: { tr: typeof TRACKS[number]; big?: boolean; delay?: number }) => (
    <motion.div {...fade(delay)} className={`${big ? 'lg:row-span-2' : ''} flex`}>
      <Link href={tr.href} className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,18,32,.14)] ${big ? 'min-h-[420px] lg:min-h-full' : 'min-h-[300px]'}`}>
        <img src={tr.cardPhoto} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,.05) 0%, rgba(11,18,32,.35) 45%, rgba(11,18,32,.92) 100%)' }} />
        <div className="relative flex flex-1 flex-col justify-between p-5 text-white md:p-6">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: tr.tint }}><tr.icon size={12} /> {tr.short}</span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">{tr.product}</span>
          </div>
          <div>
            <h3 className={`font-black leading-[1.05] tracking-tight ${big ? 'text-[28px] md:text-[34px]' : 'text-[22px] md:text-[24px]'}`} style={{ fontFamily: HEAD_FONT }}>{tr.title}</h3>
            <p className={`mt-2 text-white/75 ${big ? 'max-w-[460px] text-[14.5px]' : 'line-clamp-2 text-[13px]'}`}>{tr.headline} {big ? tr.body.split('. ')[0] + '.' : ''}</p>
            {tr.id === 'services' && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {SERVICE_LIST.slice(0, 6).map(s => <li key={s.label} className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">{s.label}</li>)}
                <li className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">+{SERVICE_LIST.length - 6} more</li>
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold">{tr.cta} <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-gray-900"><ArrowRight size={16} /></span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <section id="tracks" className="scroll-mt-20 bg-gray-50 border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead align="left" eyebrow="Partner tracks" title="Three ways to partner. One neighbourhood network." sub="Pick the track that matches how you work. Each has its own short, guided application and its own onboarding manager." />
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-600">
            <ShieldCheck size={15} className="text-emerald-700" /> Free to apply · No joining fee
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Card tr={delivery} big delay={0} />
          <Card tr={restaurant} delay={.08} />
          <Card tr={services} delay={.16} />
        </div>
        {/* secondary: store */}
        <motion.div {...fade(.24)} className="mt-5">
          <Link href={store.href} className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(11,18,32,.12)] md:grid-cols-[320px_1fr]">
            <div className="relative min-h-[180px] overflow-hidden">
              <img src={store.cardPhoto} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0 md:bg-gradient-to-r md:from-transparent md:to-white" />
            </div>
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center md:p-7">
              <div className="flex-1">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700"><store.icon size={12} /> {store.short} · Zyphix Now</p>
                <h3 className="mt-3 text-[24px] font-black leading-tight tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>Run a kirana, pharmacy or local store? {store.title.toLowerCase()}.</h3>
                <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-gray-600">{store.body}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white" style={{ background: G }}>{store.cta} <ArrowRight size={15} /></span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
