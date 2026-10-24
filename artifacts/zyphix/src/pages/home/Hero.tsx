import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, MapPin, Search, ChevronDown, Home, UtensilsCrossed, Wrench, TicketPercent, User, Plus,
  Wifi, BatteryFull, Signal, Bike, BadgeIndianRupee, Clock, Star, CheckCircle2, Store, ShieldCheck, Zap,
} from 'lucide-react';
import { type Category } from '@/lib/catalog';
import { G, HEAD_FONT, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, PHOTOS, SampleTag, SWATCH, fade, MONO, PRODUCT_COUNT, CATEGORY_NAMES, ORANGE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Hero — full-bleed kirana photo, ink overlay, headline + phone mock-up.
──────────────────────────────────────────────────────────────────────────── */

const PHONE_CATS: Array<[string, string, string]> = [
  ['Fruits & Veg', '🥦', '#DCFCE7'], ['Dairy & Eggs', '🥛', '#DBEAFE'], ['Snacks', '🍿', '#F3E8FF'],
  ['Atta & Dal', '🌾', '#FEF3C7'], ['Pharmacy', '💊', '#CFFAFE'], ['Household', '🧹', '#E2E8F0'],
];
const PHONE_PRODUCTS: Array<[string, string, string, keyof typeof SWATCH]> = [
  ['Amul Taaza 500 ml', '₹28', 'Dairy & Eggs', 'blue'],
  ['Bananas · 6 pc', '₹42', 'Fruits & Veg', 'amber'],
  ['Aashirvaad Atta 5 kg', '₹265', 'Atta, Rice & Dal', 'green'],
];

/** Realistic Zyphix app home screen inside a phone frame. */
export function PhoneMock({ className = '' }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-[300px] sm:w-[320px] ${className}`}>
      <div className="rounded-[44px] border border-white/15 bg-[#0B1220] p-[10px] shadow-[0_40px_80px_rgba(0,0,0,.55)]">
        <div className="relative overflow-hidden rounded-[36px] bg-[#F8F9FA] text-gray-900">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-gray-900" style={MONO}>
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-[#0B1220]" />
            <span className="flex items-center gap-1"><Signal size={11} /><Wifi size={11} /><BatteryFull size={13} /></span>
          </div>

          {/* location header + search */}
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-1 text-[10.5px] font-semibold text-gray-500"><MapPin size={11} className="text-emerald-600" /> Delivering to</p>
                <p className="flex items-center gap-0.5 text-[13px] font-black leading-tight" style={{ fontFamily: HEAD_FONT }}>Sector 12, Dwarka <ChevronDown size={13} /></p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10.5px] font-black text-emerald-700"><Clock size={10} /> ~22 min</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11.5px] text-gray-400"><Search size={13} /> Search "atta", "milk", "poha"…</div>
          </div>

          {/* category row */}
          <div className="px-4 pt-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold">Shop by category</p>
              <span className="text-[10.5px] font-semibold text-emerald-700">All 26</span>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {PHONE_CATS.map(([n, ic, bg]) => (
                <div key={n} className="text-center">
                  <div className="flex h-10 items-center justify-center rounded-xl text-[16px]" style={{ background: bg }}>{ic}</div>
                  <p className="mt-1 truncate text-[8.5px] font-semibold text-gray-600">{n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* nearby store + products */}
          <div className="px-4 pt-3.5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[12px] font-bold"><Store size={12} className="text-emerald-600" /> Sharma Kirana · 0.8 km</p>
              <SampleTag />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PHONE_PRODUCTS.map(([n, p, c, tone]) => (
                <div key={n} className="rounded-xl border border-gray-200 bg-white p-2">
                  <div className="h-11 rounded-lg" style={{ background: SWATCH[tone] }} />
                  <p className="mt-1.5 truncate text-[10.5px] font-bold">{n}</p>
                  <p className="truncate text-[9px] text-gray-400">{c}</p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-[10.5px] font-black" style={MONO}>{p}</p>
                    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={10} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eats row */}
          <div className="px-4 pb-3 pt-3.5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[12px] font-bold"><UtensilsCrossed size={12} style={{ color: ORANGE }} /> Zyphix Eats near you</p>
              <span className="text-[10.5px] font-semibold" style={{ color: ORANGE }}>See all</span>
            </div>
            <div className="mt-2 flex gap-2">
              {[['Biryani House', 'Hyderabadi · 25 min', 'orange'], ['Dosa Corner', 'South Indian · 18 min', 'amber']].map(([n, s, tone]) => (
                <div key={n} className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5">
                  <div className="h-9 w-9 shrink-0 rounded-lg" style={{ background: SWATCH[tone] }} />
                  <div className="min-w-0">
                    <p className="truncate text-[10.5px] font-bold">{n}</p>
                    <p className="truncate text-[9px] text-gray-500">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* bottom nav */}
          <div className="flex items-center justify-around border-t border-gray-200 bg-white px-2 pb-4 pt-2 text-[9px] font-semibold text-gray-400">
            {[[<Home size={15} />, 'Now', true], [<UtensilsCrossed size={15} />, 'Eats', false], [<Wrench size={15} />, 'Book', false], [<TicketPercent size={15} />, 'Offers', false], [<User size={15} />, 'Account', false]].map(([ic, l, on]) => (
              <span key={l as string} className={`flex flex-col items-center gap-0.5 ${on ? 'text-emerald-700' : ''}`}>{ic}{l as string}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const MARQUEE = ['Fruits & Veg', 'Dairy & Eggs', 'Biryani', 'Pharmacy', 'Snacks & Munchies', 'Pizza', 'Atta, Rice & Dal', 'Electrician', 'Tea & Coffee', 'Ice Creams', 'Baby Care', 'Plumber', 'Thali', 'Bakery & Biscuits', 'Masalas & Spices', 'Cleaning', 'Dosa', 'Household', 'Momos', 'Pet Care'];

export function Hero({ categories }: { categories: Category[] }) {
  return (
    <section className="relative text-white" style={{ background: INK }}>
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <img src={PHOTOS.heroMarket} alt="" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,18,32,.96) 0%, rgba(11,18,32,.88) 40%, rgba(11,18,32,.55) 75%, rgba(11,18,32,.35) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,.25) 0%, rgba(11,18,32,0) 40%, rgba(11,18,32,.9) 100%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-[.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at 30% 40%, black 20%, transparent 70%)' }} />
        <div className="absolute right-[8%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,.45), transparent)' }} />
      </div>

      <div className={`${CONTAINER} relative grid min-h-[80vh] items-center gap-12 pb-16 pt-14 md:grid-cols-[1.1fr_.9fr] md:pb-28 md:pt-20`}>
        <div>
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12.5px] font-bold text-emerald-300 backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            India's SuperLocal App · Now onboarding across India
          </motion.div>

          <motion.h1 {...fade(.05)} className="mt-6 font-black tracking-[-0.045em] leading-[0.98] text-[2.9rem] sm:text-[3.9rem] lg:text-[4.7rem]" style={{ fontFamily: HEAD_FONT }}>
            Your neighbourhood,<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #34D399, #10B981 50%, #A7F3D0)' }}>delivered in 30 minutes.</span>
          </motion.h1>

          <motion.p {...fade(.1)} className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-white/75">
            Groceries, food, pharmacy and home services from the real kirana stores, restaurants and professionals a few streets away — one app, shelf prices, zero surge, no dark warehouses.
          </motion.p>

          <motion.div {...fade(.15)} className="mt-9 flex flex-wrap gap-3">
            <Link href="/now" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}>
              Order groceries <ArrowRight size={17} />
            </Link>
            <Link href="/eats" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15">
              <UtensilsCrossed size={17} className="text-orange-400" /> Order food
            </Link>
          </motion.div>

          <motion.div {...fade(.2)} className="mt-10 grid max-w-[600px] grid-cols-3 gap-3">
            {[
              [<Store size={16} />, PRODUCT_COUNT, 'products from local shelves'],
              [<Zap size={16} />, `${categories.length || 26} categories`, 'groceries, pharmacy, household'],
              [<ShieldCheck size={16} />, 'Zero surge', 'shelf price is the app price'],
            ].map(([ic, v, l]) => (
              <div key={v as string} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                <span className="text-emerald-300">{ic}</span>
                <p className="mt-2 text-[17px] font-black leading-none tracking-tight" style={{ fontFamily: HEAD_FONT }}>{v as string}</p>
                <p className="mt-1.5 text-[11.5px] leading-snug text-white/60">{l as string}</p>
              </div>
            ))}
          </motion.div>

          <motion.ul {...fade(.25)} className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-white/70">
            {['Live order tracking', 'Pay online or cash on delivery', 'Real stores, real inventory'].map(k => (
              <li key={k} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> {k}</li>
            ))}
          </motion.ul>
        </div>

        {/* phone + satellite cards */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }} className="relative z-10 mx-auto w-full max-w-[460px] md:-mb-24">
          <PhoneMock />
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .55 }} className="absolute -right-2 top-20 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl sm:flex">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: G }}>
              <Bike size={18} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
            </span>
            <div>
              <p className="text-[12.5px] font-bold">Rider 2 min away</p>
              <p className="text-[11.5px] text-gray-500">Order #ZN-4821 · on the way</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .7 }} className="absolute -left-4 bottom-32 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><BadgeIndianRupee size={18} /></span>
            <div>
              <p className="text-[12.5px] font-bold">Shelf price = app price</p>
              <p className="text-[11.5px] text-gray-500">No surge, no hidden handling fee</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .85 }} className="absolute -right-6 bottom-10 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-gray-900 shadow-2xl lg:flex">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <p className="text-[11.5px] font-bold">Rate your store after every order</p>
          </motion.div>
        </motion.div>
      </div>

      {/* category marquee strip */}
      <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="relative overflow-hidden py-3.5">
          <div className="flex w-max gap-3 whitespace-nowrap" style={{ animation: 'marquee 48s linear infinite' }}>
            {[...MARQUEE, ...MARQUEE].map((c, i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] font-semibold text-white/80">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Signal strip (no invented numbers) ──────────────────────────────────── */
export function SignalStrip({ categories }: { categories: Category[] }) {
  const SIGNALS = [
    `${PRODUCT_COUNT} products`,
    `${categories.length || CATEGORY_NAMES.length} categories`,
    '30-min target',
    'Zero surge',
    'Real local stores',
  ];
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className={`${CONTAINER} flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4 text-[13.5px] font-semibold text-gray-700 md:justify-between md:pr-[440px]`}>
        {SIGNALS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span className="hidden text-gray-300 md:inline">·</span>}
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{s}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
