import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Store, UtensilsCrossed, Wrench, Clock, Star, MapPin, Plus, Search, Flame, Leaf, Calendar,
  BadgeCheck, ShieldCheck, Zap, Pill as PillIcon, ChevronRight,
} from 'lucide-react';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, PHOTOS, SampleTag, SWATCH, fade, MONO, ORANGE, BLUE, Eyebrow, Pill } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Products — Zyphix Now / Eats / Book as big alternating photo + UI sections.
──────────────────────────────────────────────────────────────────────────── */

/* ── Mock 1: store grid (Zyphix Now) ────────────────────────────────────── */
function StoreGridMock() {
  const STORES = [
    { n: 'Sharma Kirana Store', d: '0.8 km · 18 min', tag: 'Open', tone: 'green' },
    { n: 'Gupta General Store', d: '1.1 km · 22 min', tag: 'Open', tone: 'amber' },
    { n: 'Apna Medical & Pharmacy', d: '1.4 km · 24 min', tag: '24×7', tone: 'teal' },
    { n: 'Fresh Basket Fruits & Veg', d: '0.6 km · 15 min', tag: 'Open', tone: 'red' },
  ];
  const ITEMS: Array<[string, string, string, keyof typeof SWATCH]> = [
    ['Amul Taaza Milk 500 ml', '₹28', 'Dairy & Eggs', 'blue'],
    ['Tata Salt 1 kg', '₹26', 'Masalas & Spices', 'gray'],
    ['Parle-G 800 g', '₹80', 'Bakery & Biscuits', 'amber'],
  ];
  return (
    <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)]">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Zyphix Now</p>
          <p className="flex items-center gap-1 text-[12.5px] font-black" style={{ fontFamily: HEAD_FONT }}><MapPin size={11} style={{ color: G }} /> Stores near Sector 12</p>
        </div>
        <div className="flex items-center gap-2"><Pill tint={G} bg="#ECFDF5"><Clock size={10} /> 30-min target</Pill><SampleTag /></div>
      </div>
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[11.5px] text-gray-400"><Search size={13} /> Search products or stores</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {STORES.map(s => (
            <div key={s.n} className="rounded-2xl border border-gray-200 p-2.5">
              <div className="h-14 rounded-xl" style={{ background: SWATCH[s.tone] }} />
              <div className="mt-2 flex items-start justify-between gap-1">
                <p className="truncate text-[11.5px] font-bold text-gray-900">{s.n}</p>
                <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">{s.tag}</span>
              </div>
              <p className="text-[10px] text-gray-500">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-[11.5px] font-bold">Bought again from Sharma Kirana</p>
          <span className="text-[10.5px] font-semibold text-emerald-700">See all</span>
        </div>
        <ul className="mt-2 divide-y divide-gray-100 rounded-2xl border border-gray-200">
          {ITEMS.map(([n, p, c, tone]) => (
            <li key={n} className="flex items-center gap-3 px-3 py-2">
              <div className="h-9 w-9 shrink-0 rounded-lg" style={{ background: SWATCH[tone] }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-bold">{n}</p>
                <p className="text-[10px] text-gray-500">{c} · shelf price</p>
              </div>
              <p className="text-[12px] font-black" style={MONO}>{p}</p>
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={11} /></span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-white" style={{ background: G }}>
          <span className="text-[11.5px] font-bold">3 items · ₹134</span>
          <span className="inline-flex items-center gap-1 text-[11.5px] font-bold">View cart <ChevronRight size={13} /></span>
        </div>
      </div>
    </div>
  );
}

/* ── Mock 2: restaurant list (Zyphix Eats) ──────────────────────────────── */
function RestaurantListMock() {
  const R = [
    { n: 'Biryani House', c: 'Hyderabadi · Mughlai', t: '25 min', d: '1.4 km', tone: 'orange', chips: ['Chicken biryani', 'Kebabs'], badge: 'Popular nearby' },
    { n: 'Dosa Corner', c: 'South Indian · Breakfast', t: '18 min', d: '0.9 km', tone: 'amber', chips: ['Masala dosa', 'Filter coffee'] },
    { n: 'Punjabi Dhaba', c: 'North Indian · Thali', t: '30 min', d: '2.1 km', tone: 'red', chips: ['Dal makhani', 'Tandoori roti'] },
    { n: 'Momo Station', c: 'Tibetan · Chinese', t: '20 min', d: '1.2 km', tone: 'purple', chips: ['Veg momos', 'Thukpa'] },
  ];
  return (
    <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)]">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Zyphix Eats</p>
          <p className="flex items-center gap-1 text-[12.5px] font-black" style={{ fontFamily: HEAD_FONT }}><MapPin size={11} style={{ color: ORANGE }} /> Restaurants near you</p>
        </div>
        <div className="flex items-center gap-2"><Pill tint={ORANGE} bg="#FFF7ED"><Flame size={10} /> 14 open now</Pill><SampleTag /></div>
      </div>
      <div className="flex gap-1.5 overflow-hidden px-4 pt-3">
        {['All', 'Veg only', 'Under 20 min', 'Biryani', 'Thali', 'Chinese'].map((c, i) => (
          <span key={c} className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${i === 0 ? 'text-white' : 'border border-gray-200 bg-white text-gray-600'}`} style={i === 0 ? { background: ORANGE } : undefined}>{c}</span>
        ))}
      </div>
      <ul className="divide-y divide-gray-100 px-4 pt-2 pb-3">
        {R.map(r => (
          <li key={r.n} className="flex gap-3 py-2.5">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl" style={{ background: SWATCH[r.tone] }}>
              {r.badge && <span className="absolute left-1 top-1 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-bold text-orange-700 shadow">{r.badge}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[12px] font-bold text-gray-900">{r.n}</p>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[9.5px] font-semibold text-gray-600"><Clock size={9} /> {r.t}</span>
              </div>
              <p className="text-[10.5px] text-gray-500">{r.c} · {r.d}</p>
              <div className="mt-1.5 flex gap-1">{r.chips.map(ch => <span key={ch} className="rounded-full border border-gray-200 px-1.5 py-0.5 text-[9px] text-gray-600">{ch}</span>)}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 border-t border-gray-200 bg-orange-50/60 px-4 py-2.5 text-[10.5px] text-orange-800"><Leaf size={12} /> Menu prices set by the restaurant · delivery fee shown before you pay</div>
    </div>
  );
}

/* ── Mock 3: booking card (Zyphix Book) ─────────────────────────────────── */
function BookingCardMock() {
  const SLOTS = ['9–11 AM', '11–1 PM', '2–4 PM', '4–6 PM', '6–8 PM'];
  return (
    <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(11,18,32,.14)]">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: BLUE }}><Wrench size={16} /></span>
          <div>
            <p className="text-[12.5px] font-extrabold text-gray-900">Book an electrician</p>
            <p className="text-[10.5px] text-gray-500">Zyphix Book · Sector 12</p>
          </div>
        </div>
        <SampleTag />
      </div>
      <div className="px-4 pt-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Professional</p>
        <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-gray-200 p-2.5">
          <div className="h-11 w-11 shrink-0 rounded-xl" style={{ background: SWATCH.blue }} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[12px] font-bold">Ramesh Verma <BadgeCheck size={13} style={{ color: BLUE }} /></p>
            <p className="text-[10.5px] text-gray-500">Electrician · 2.1 km · ID & background verified</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700"><Star size={10} className="fill-amber-400 text-amber-400" /> New</span>
        </div>
      </div>
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400"><Calendar size={11} /> Tomorrow, Sat</p>
          <span className="text-[10px] font-semibold text-gray-400">Pick a slot</span>
        </div>
        <div className="mt-1.5 grid grid-cols-5 gap-1.5">
          {SLOTS.map((s, i) => (
            <span key={s} className={`rounded-lg border py-1.5 text-center text-[9.5px] font-bold ${i === 1 ? 'text-white' : 'border-gray-200 text-gray-700'}`} style={i === 1 ? { background: BLUE, borderColor: BLUE } : undefined}>{s}</span>
          ))}
        </div>
      </div>
      <div className="px-4 pt-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Job</p>
        <ul className="mt-1.5 space-y-1.5">
          {[['Switchboard / MCB check', true], ['Replace faulty socket', true], ['Fan installation', false]].map(([l, on]) => (
            <li key={l as string} className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-[11.5px] font-medium text-gray-800">
              <span className="flex items-center gap-2">{on ? <Check size={13} style={{ color: BLUE }} /> : <span className="h-3 w-3 rounded border border-gray-300" />} {l as string}</span>
              <span className="text-[10px] text-gray-400">{on ? 'added' : 'add'}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Visit charge</p>
          <p className="text-[13px] font-black text-gray-900" style={MONO}>Shown before you confirm</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-bold text-white" style={{ background: BLUE }}>Confirm booking <ArrowRight size={13} /></span>
      </div>
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */
type Product = {
  id: string; name: string; tag: string; tint: string; bg: string; icon: React.ReactNode;
  headline: string; body: string; photo: string; photoAlt: string; bullets: string[]; href: string; cta: string; mock: React.ReactNode;
};
const PRODUCTS: Product[] = [
  {
    id: 'now', name: 'Zyphix Now', tag: 'Groceries & essentials', tint: G, bg: '#ECFDF5', icon: <Store size={18} />,
    headline: 'The kirana down the road, on your phone.',
    body: 'Fresh produce, dairy, staples, snacks, pharmacy and household items from independent stores within a few kilometres of you. You see the store\'s real shelf and the store\'s real price — Zyphix just handles the ordering, payment and the rider.',
    photo: PHOTOS.kirana, photoAlt: 'Fresh vegetables on a local kirana store shelf',
    bullets: ['Live inventory from the store itself — if it\'s on the shelf, it\'s in the app', 'Shelf price is the app price; delivery fee shown before you pay', '30-minute delivery target from stores under 3 km away', 'Pharmacy and daily essentials from the same cart'],
    href: '/now', cta: 'Order groceries', mock: <StoreGridMock />,
  },
  {
    id: 'eats', name: 'Zyphix Eats', tag: 'Food delivery', tint: ORANGE, bg: '#FFF7ED', icon: <UtensilsCrossed size={18} />,
    headline: 'Your favourite dhaba, without the aggregator markup.',
    body: 'Neighbourhood restaurants, dhabas, bakeries and cloud kitchens — biryani to thali to momos. Restaurants pay a flat, transparent commission, so the menu price you see is the price they set, and the kitchen that cooked your food is the one that keeps the margin.',
    photo: PHOTOS.streetFood, photoAlt: 'Freshly cooked Indian street food being served',
    bullets: ['Menu prices set by the restaurant, not inflated to cover commissions', 'Short-radius delivery keeps food hot and riders local', 'Filter by veg-only, cuisine or delivery time', 'Live kitchen status: accepted, preparing, picked up, at your door'],
    href: '/eats', cta: 'Order food', mock: <RestaurantListMock />,
  },
  {
    id: 'book', name: 'Zyphix Book', tag: 'Home services', tint: BLUE, bg: '#EFF6FF', icon: <Wrench size={18} />,
    headline: 'A verified professional, booked in a few taps.',
    body: 'Electricians, plumbers, cleaners, AC technicians, salon-at-home and more — independent professionals from your own area, verified by ID and a background check. Pick a slot, describe the job, and the visit charge is shown before you confirm.',
    photo: PHOTOS.electrician, photoAlt: 'An electrician working on a home switchboard',
    bullets: ['Every professional carries a verified badge after ID and background checks', 'Two-hour slots, same day or scheduled ahead', 'Visit charge and parts policy shown before you confirm', 'Job checklist and photo of finished work in the app'],
    href: '/book', cta: 'Book a service', mock: <BookingCardMock />,
  },
];

const BULLET_ICONS = [<Zap size={14} />, <ShieldCheck size={14} />, <Clock size={14} />, <PillIcon size={14} />];

/* ── Section ─────────────────────────────────────────────────────────────── */
export function Products() {
  return (
    <section id="products" className="scroll-mt-20 bg-white">
      <div className={`${CONTAINER} pt-20 md:pt-24`}>
        <div className="mx-auto max-w-[680px] text-center">
          <Eyebrow>Products</Eyebrow>
          <h2 className="mt-3 text-[1.9rem] font-black leading-[1.08] tracking-[-0.03em] text-gray-900 md:text-[2.5rem]" style={{ fontFamily: HEAD_FONT }}>One app. Three ways to shop your neighbourhood.</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">Groceries, food and home services share one account, one cart experience and one promise: it comes from a real business near you.</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {PRODUCTS.map(p => (
            <a key={p.id} href={`#${p.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-[13.5px] font-bold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: p.bg, color: p.tint }}>{p.icon}</span>{p.name}
            </a>
          ))}
        </div>
      </div>

      {PRODUCTS.map((p, i) => {
        const flip = i % 2 === 1;
        return (
          <div key={p.id} id={p.id} className={`scroll-mt-20 ${i === PRODUCTS.length - 1 ? '' : 'border-b border-gray-100'}`}>
            <div className={`${CONTAINER} grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16`}>
              {/* visual */}
              <motion.div {...fade(.05)} className={`relative ${flip ? 'lg:order-2' : ''}`}>
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200">
                  <img src={p.photo} alt={p.photoAlt} loading="lazy" className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]" />
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0) 40%, rgba(11,18,32,.55) 100%)' }} />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold text-gray-900 shadow">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.tint }} /> {p.name}
                  </span>
                </div>
                <div className={`relative mx-4 -mt-28 sm:mx-6 sm:-mt-40 lg:absolute lg:bottom-8 lg:mt-0 ${flip ? 'lg:-left-10 lg:mx-0' : 'lg:-right-10 lg:mx-0'} lg:w-[440px]`}>
                  {p.mock}
                </div>
              </motion.div>

              {/* copy */}
              <motion.div {...fade(.1)} className={flip ? 'lg:order-1' : ''}>
                <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider" style={{ background: p.bg, color: p.tint }}>{p.icon} {p.tag}</p>
                <h3 className="mt-4 text-[1.8rem] font-black leading-[1.08] tracking-[-0.03em] text-gray-900 md:text-[2.4rem]" style={{ fontFamily: HEAD_FONT }}>{p.headline}</h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">{p.body}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {p.bullets.map((b, j) => (
                    <li key={b} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: p.bg, color: p.tint }}>{BULLET_ICONS[j % BULLET_ICONS.length]}</span>
                      <span className="text-[13.5px] leading-snug text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href={p.href} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: p.tint }}>{p.cta} <ArrowRight size={16} /></Link>
                  <Link href="/offers" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 transition hover:bg-gray-50">See offers</Link>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
