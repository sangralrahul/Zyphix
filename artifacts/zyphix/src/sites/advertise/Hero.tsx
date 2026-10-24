import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, ChevronDown, Home, UtensilsCrossed, Wrench, TicketPercent, User, Plus, Wifi, BatteryFull, Signal, Sparkles, IndianRupee, Layers, FileBarChart2 } from 'lucide-react';
import { G, HEAD_FONT, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, SponsoredTag, fade, unsplash } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Hero — full-bleed market photo with ink overlay + phone mock-up.
──────────────────────────────────────────────────────────────────────────── */

const HERO_IMG = unsplash('photo-1586201375761-83865001e31c');

/** Realistic Zyphix Now home screen inside a phone frame. All sponsored
    placements carry a visible "Sponsored" label. */
export function PhoneMock({ className = '' }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-[300px] sm:w-[320px] ${className}`}>
      {/* bezel */}
      <div className="rounded-[44px] border border-white/15 bg-[#0B1220] p-[10px] shadow-[0_40px_80px_rgba(0,0,0,.55)]">
        <div className="relative overflow-hidden rounded-[36px] bg-[#F8F9FA] text-gray-900">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-gray-900">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-[#0B1220]" />
            <span className="flex items-center gap-1"><Signal size={11} /><Wifi size={11} /><BatteryFull size={13} /></span>
          </div>

          {/* app header */}
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-1 text-[10.5px] font-semibold text-gray-500"><MapPin size={11} className="text-emerald-600" /> Delivering to</p>
                <p className="flex items-center gap-0.5 text-[13px] font-black leading-tight" style={{ fontFamily: HEAD_FONT }}>Sector 12, Dwarka <ChevronDown size={13} /></p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10.5px] font-black text-emerald-700">~22 min</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11.5px] text-gray-400"><Search size={13} /> Search "atta", "milk", "poha"…</div>
          </div>

          {/* sponsored home banner */}
          <div className="px-4 pt-3">
            <div className="relative overflow-hidden rounded-2xl p-3.5 text-white" style={{ background: `linear-gradient(135deg, ${G}, #047857)` }}>
              <div aria-hidden className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/15" />
              <div aria-hidden className="absolute -right-2 bottom-[-30px] h-20 w-20 rounded-full bg-white/10" />
              <SponsoredTag dark className="absolute right-2.5 top-2.5" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75">Home banner</p>
              <p className="mt-1 max-w-[170px] text-[15px] font-black leading-tight" style={{ fontFamily: HEAD_FONT }}>Fresh oats, now at your local kirana</p>
              <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-emerald-700">Shop the range <ArrowRight size={10} /></span>
            </div>
          </div>

          {/* sponsored category row */}
          <div className="px-4 pt-3.5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[12px] font-bold">Breakfast essentials <SponsoredTag /></p>
              <span className="text-[10.5px] font-semibold text-emerald-700">See all</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ['Rolled oats 1kg', '₹189', true],
                ['Poha 500g', '₹42', false],
                ['Toned milk 500ml', '₹28', false],
              ].map(([n, p, hot]) => (
                <div key={n as string} className={`relative rounded-xl border bg-white p-2 ${hot ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
                  {hot && <span className="absolute -top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white"><Sparkles size={8} /> Spotlight</span>}
                  <div className="h-11 rounded-lg" style={{ background: hot ? 'linear-gradient(135deg,#D1FAE5,#A7F3D0)' : 'linear-gradient(135deg,#F3F4F6,#E5E7EB)' }} />
                  <p className="mt-1.5 truncate text-[10.5px] font-bold">{n}</p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-[10.5px] font-black">{p}</p>
                    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={10} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* organic rows (for realism) */}
          <div className="px-4 pt-3.5">
            <p className="text-[12px] font-bold">Fruits & vegetables</p>
            <div className="mt-2 flex gap-2">
              {['Bananas', 'Tomatoes', 'Onions', 'Spinach'].map((n, i) => (
                <div key={n} className="w-[64px] shrink-0">
                  <div className="h-12 rounded-xl" style={{ background: ['#FEF3C7', '#FEE2E2', '#F3E8FF', '#DCFCE7'][i] }} />
                  <p className="mt-1 truncate text-[10px] font-semibold text-gray-700">{n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* product spotlight card */}
          <div className="px-4 pb-3 pt-3.5">
            <div className="relative flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-2.5">
              <SponsoredTag className="absolute right-2 top-2" />
              <div className="h-12 w-12 shrink-0 rounded-xl" style={{ background: 'linear-gradient(135deg,#FDE68A,#F59E0B)' }} />
              <div className="min-w-0">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">Product spotlight</p>
                <p className="truncate text-[11.5px] font-bold">Chai masala 100g · Sharma Kirana</p>
                <p className="text-[10.5px] text-gray-500">0.8 km · ₹65 · 15% off first order</p>
              </div>
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

const SIGNALS = ['Launching across India', 'Early advertiser programme', 'Flat rates', 'Placement-level reporting'];

export function Hero() {
  return (
    <>
      <section className="relative text-white" style={{ background: INK }}>
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <img src={HERO_IMG} alt="" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,18,32,.96) 0%, rgba(11,18,32,.88) 40%, rgba(11,18,32,.55) 75%, rgba(11,18,32,.35) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,.25) 0%, rgba(11,18,32,0) 40%, rgba(11,18,32,.85) 100%)' }} />
          <div className="pointer-events-none absolute inset-0 opacity-[.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at 30% 40%, black 20%, transparent 70%)' }} />
          <div className="absolute right-[8%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,.45), transparent)' }} />
        </div>

        <div className={`${CONTAINER} relative grid min-h-[80vh] items-center gap-12 pb-16 pt-14 md:grid-cols-[1.1fr_.9fr] md:pb-24 md:pt-20`}>
          <div>
            <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12.5px] font-bold text-emerald-300 backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
              Zyphix Ads · For brands and local businesses
            </motion.div>

            <motion.h1 {...fade(.05)} className="mt-6 font-black tracking-[-0.045em] leading-[1.0] text-[2.7rem] sm:text-[3.6rem] lg:text-[4.3rem]" style={{ fontFamily: HEAD_FONT }}>
              Reach customers in the{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #34D399, #10B981 50%, #A7F3D0)' }}>neighbourhoods they shop in.</span>
            </motion.h1>

            <motion.p {...fade(.1)} className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-white/75">
              Zyphix is a shopping app, not a feed. Your placement appears while someone is choosing what to buy from the kirana, restaurant or professional a few streets away — targeted by delivery area, priced flat, reported per placement.
            </motion.p>

            <motion.div {...fade(.15)} className="mt-9 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}>
                Talk to partnerships <ArrowRight size={17} />
              </a>
              <a href="#formats" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15">
                See ad formats
              </a>
            </motion.div>

            <motion.div {...fade(.2)} className="mt-10 grid max-w-[600px] grid-cols-3 gap-3">
              {[
                [<Layers size={16} />, 'Six formats', 'Banner, row, spotlight, search, featured, offers'],
                [<IndianRupee size={16} />, 'Flat rates', 'Per placement, per period. No auctions.'],
                [<FileBarChart2 size={16} />, 'Clear reports', 'Impressions, taps and attributed orders'],
              ].map(([ic, v, l]) => (
                <div key={v as string} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                  <span className="text-emerald-300">{ic}</span>
                  <p className="mt-2 text-[15px] font-black leading-none tracking-tight" style={{ fontFamily: HEAD_FONT }}>{v as string}</p>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-white/60">{l as string}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* phone mock + floating cards */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }} className="relative z-10 mx-auto w-full max-w-[460px] md:-mb-24">
            <PhoneMock />
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .55 }} className="absolute -right-2 top-16 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: G }}><MapPin size={18} /></span>
              <div>
                <p className="text-[12.5px] font-bold">Shown in 6 pin codes</p>
                <p className="text-[11.5px] text-gray-500">Dwarka · delivery area only</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .7 }} className="absolute -left-4 bottom-28 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Sparkles size={18} /></span>
              <div>
                <p className="text-[12.5px] font-bold">Always labelled "Sponsored"</p>
                <p className="text-[11.5px] text-gray-500">Customers see exactly what's paid</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* signal strip */}
      <div className="border-b border-gray-200 bg-white">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4 text-[13.5px] font-semibold text-gray-700 md:justify-between md:pl-5 md:pr-[460px]`}>
          {SIGNALS.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="hidden text-gray-300 md:inline">·</span>}
              <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{s}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
