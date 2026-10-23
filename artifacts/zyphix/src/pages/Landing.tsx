import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Clock, MapPin, ShieldCheck, Store, UtensilsCrossed, Wrench, Bike,
  Smartphone, Search, PackageCheck, Leaf, BadgeIndianRupee, Menu, X, Mail,
  CheckCircle2, ChevronDown, Instagram, Linkedin, Twitter,
} from 'lucide-react';
import { SiteHeader, SiteFooter, SectionHead, G, G2, INK } from '@/components/layout/SiteChrome';
import { apiFetch } from '@/lib/api';
import { type Category } from '@/lib/catalog';

/** Lightweight: the landing page only needs categories (not the 3k-product list). */
function useCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>([]);
  React.useEffect(() => {
    let alive = true;
    fetch('/api/categories', { headers: { accept: 'application/json' } })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Category[]) => { if (alive && Array.isArray(d) && d.length) setCats(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return cats;
}
const PRODUCT_COUNT = '2,900+';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix — company landing page (zyphix.in)
   Clean, white, green-accent. The delivery app itself lives at /now and /eats.
──────────────────────────────────────────────────────────────────────────── */


const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

/* ── Hero ─────────────────────────────────────────────────────────────────── */
const HERO_CHIPS = ['Fruits & Veg', 'Dairy & Eggs', 'Biryani', 'Pharmacy', 'Snacks', 'Pizza', 'Atta & Dal', 'Electrician', 'Chai', 'Ice cream', 'Baby care', 'Plumber', 'Thali', 'Bakery'];

function Hero() {
  const categories = useCategories();
  const count = PRODUCT_COUNT;
  return (
    <section className="relative overflow-hidden text-white" style={{ background: `radial-gradient(1100px 600px at 80% -10%, rgba(13,163,102,.55), transparent 60%), radial-gradient(700px 500px at 0% 100%, rgba(249,115,22,.28), transparent 55%), ${INK}` }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at 60% 40%, black 30%, transparent 75%)' }} />
      <div className="mx-auto max-w-[1180px] px-5 pt-16 pb-10 md:pt-24 md:pb-16 grid md:grid-cols-[1.05fr_.95fr] gap-12 items-center">
        <div>
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12.5px] font-bold text-emerald-300 backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            India's SuperLocal App · Now onboarding across India
          </motion.div>

          <motion.h1 {...fade(.05)} className="mt-6 font-black tracking-[-0.045em] leading-[0.98] text-[3rem] sm:text-[3.9rem] lg:text-[4.9rem]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Your neighbourhood,<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #34D399, #10B981 50%, #A7F3D0)' }}>delivered in 30 minutes.</span>
          </motion.h1>

          <motion.p {...fade(.1)} className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-white/70">
            Groceries, food, pharmacy and home services from real local kirana stores, restaurants and professionals — one app, shelf prices, no dark warehouses.
          </motion.p>

          <motion.div {...fade(.15)} className="mt-9 flex flex-wrap gap-3">
            <Link href="/now" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}>
              Order groceries <ArrowRight size={17} />
            </Link>
            <Link href="/eats" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15">
              <UtensilsCrossed size={17} className="text-orange-400" /> Order food
            </Link>
          </motion.div>

          <motion.div {...fade(.2)} className="mt-10 grid max-w-[520px] grid-cols-3 gap-3">
            {[
              [count, 'products from local shelves'],
              [`${categories.length || 26}`, 'grocery categories'],
              ['30 min', 'doorstep delivery target'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                <p className="text-[22px] font-black leading-none tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{v}</p>
                <p className="mt-1.5 text-[12px] leading-snug text-white/60">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual stage */}
        <motion.div initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .7, delay: .15 }} className="relative mx-auto w-full max-w-[520px]">
          <div aria-hidden className="absolute -inset-6 rounded-[40px] opacity-70 blur-2xl" style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,.55), transparent)' }} />
          <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/5 p-3 backdrop-blur">
            <div className="relative overflow-hidden rounded-[24px]">
              <img src="/images/groceries.png" alt="Fresh groceries from a local kirana store" className="h-[300px] sm:h-[360px] w-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[12.5px] font-bold text-gray-900 shadow">
                <span className="h-2 w-2 rounded-full" style={{ background: G }} /> Live · Zyphix Now
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 p-3.5 text-gray-900 shadow-xl">
                <div>
                  <p className="text-[13.5px] font-bold">Order from Sharma Kirana Store</p>
                  <p className="text-[12px] text-gray-500">0.8 km away · packed in 4 min · rider on the way</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[12.5px] font-black text-emerald-700">18 min</span>
              </div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .5 }} className="absolute -right-3 top-10 hidden sm:flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl">
            <img src="/images/food.png" alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div>
              <p className="text-[12.5px] font-bold">Zyphix Eats</p>
              <p className="text-[11.5px] text-gray-500">Biryani House · 25 min</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .65 }} className="absolute -left-3 bottom-24 hidden sm:flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-gray-900 shadow-2xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: G }}><Bike size={20} /></span>
            <div>
              <p className="text-[12.5px] font-bold">Zero surge pricing</p>
              <p className="text-[11.5px] text-gray-500">Shelf price is the app price</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* marquee */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="relative overflow-hidden py-3.5">
          <div className="flex w-max gap-3 whitespace-nowrap" style={{ animation: 'marquee 40s linear infinite' }}>
            {[...HERO_CHIPS, ...HERO_CHIPS].map((c, i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] font-semibold text-white/80">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Category showcase ────────────────────────────────────────────────────── */
function CategoryShowcase() {
  const categories = useCategories();
  const cats = categories.slice(0, 12);
  if (!cats.length) return null;
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead align="left" eyebrow="Shop by category" title="Everything your kitchen and home needs." sub={`${categories.length || 26} categories, thousands of products — all from stores within a few kilometres of you.`} />
          <Link href="/now" className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-900 hover:bg-gray-100">Browse all <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cats.map((c, i) => (
            <Link key={c.name} href="/now" className={`group relative overflow-hidden rounded-3xl border border-gray-200 bg-white ${i === 0 ? 'col-span-2 row-span-2 min-h-[260px]' : 'min-h-[150px]'}`}>
              <img src={c.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(11,18,32,0) 30%, rgba(11,18,32,.85) 100%)` }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                <div>
                  <span className="text-[20px]">{c.icon}</span>
                  <p className={`font-black tracking-tight ${i === 0 ? 'text-[26px]' : 'text-[16px]'}`} style={{ fontFamily: "'Outfit', sans-serif" }}>{c.name}</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-gray-900"><ArrowRight size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Products ─────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    icon: <Store size={22} />, tint: '#0DA366', bg: '#ECFDF5',
    name: 'Zyphix Now', tag: 'Groceries & essentials',
    desc: 'Fresh produce, dairy, snacks, staples, pharmacy and household items from kirana stores near you — real shelves, real inventory.',
    href: '/now', cta: 'Shop groceries',
  },
  {
    icon: <UtensilsCrossed size={22} />, tint: '#EA580C', bg: '#FFF7ED',
    name: 'Zyphix Eats', tag: 'Food delivery',
    desc: 'Neighbourhood restaurants, dhabas and cloud kitchens — biryani to thali — with fair commissions so your favourite spots stay in business.',
    href: '/eats', cta: 'Order food',
  },
  {
    icon: <Wrench size={22} />, tint: '#2563EB', bg: '#EFF6FF',
    name: 'Zyphix Book', tag: 'Home services',
    desc: 'Verified local electricians, plumbers, cleaners and more. Book a trusted professional in a few taps, pay transparently.',
    href: '/book', cta: 'Book a service',
  },
];
function Products() {
  return (
    <section id="products" className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
      <SectionHead eyebrow="Products" title="One app for everything local." sub="Three experiences, one account, one neighbourhood network." />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PRODUCTS.map(p => (
          <Link key={p.name} href={p.href} className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.10)]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: p.bg, color: p.tint }}>{p.icon}</span>
            <p className="mt-5 text-[12px] font-bold uppercase tracking-wider" style={{ color: p.tint }}>{p.tag}</p>
            <h3 className="mt-1 text-[22px] font-black tracking-tight text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{p.name}</h3>
            <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-gray-600">{p.desc}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: p.tint }}>
              {p.cta} <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── How it works ─────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: <MapPin size={20} />, t: 'Set your location', d: 'We show only stores and restaurants that can actually reach you fast.' },
  { icon: <Search size={20} />, t: 'Pick from real local shelves', d: 'Live inventory and prices from the kirana or kitchen itself — no warehouse markup.' },
  { icon: <PackageCheck size={20} />, t: 'Delivered in minutes', d: 'A nearby delivery partner brings it to your door, tracked live in the app.' },
];
function HowItWorks() {
  return (
    <section id="how" className="bg-gray-50 border-y border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24 grid gap-12 md:grid-cols-[.9fr_1.1fr] items-center">
        <div>
          <SectionHead align="left" eyebrow="How it works" title="Order to doorstep in three steps." sub="Hyperlocal by design — every order is fulfilled by a business within a few kilometres of you." />
          <Link href="/now" className="mt-8 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white" style={{ background: G }}>
            Try it now <ArrowRight size={16} />
          </Link>
        </div>
        <ol className="grid gap-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-5 rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{s.icon}</span>
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</p>
                <h3 className="mt-0.5 text-[18px] font-extrabold text-gray-900">{s.t}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-gray-600">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Why Zyphix ───────────────────────────────────────────────────────────── */
const WHY = [
  { icon: <Leaf size={20} />, t: 'Local-first marketplace', d: 'We work with independent kirana stores and food partners — not dark stores that compete with them.' },
  { icon: <BadgeIndianRupee size={20} />, t: 'Transparent pricing', d: 'Shelf price is the app price. No surge, no hidden handling fees.' },
  { icon: <Clock size={20} />, t: 'Built for speed', d: 'Short distances and real inventory mean orders are packed and moving within minutes.' },
  { icon: <ShieldCheck size={20} />, t: 'Trust & safety', d: 'Verified partners, secure payments and live order tracking on every delivery.' },
];
function Why() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
      <SectionHead eyebrow="Why Zyphix" title="Technology for the neighbourhood economy." sub="Your local store, favourite dhaba and trusted plumber deserve world-class tools. That's what we build." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map(w => (
          <div key={w.t} className="rounded-3xl border border-gray-200 bg-white p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{w.icon}</span>
            <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900">{w.t}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{w.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Partners ─────────────────────────────────────────────────────────────── */
const PARTNERS = [
  { icon: <Store size={22} />, t: 'Kirana & retail stores', d: 'Put your shelves online, keep your customers and your margins.', href: '/merchant-setup', cta: 'List your store' },
  { icon: <UtensilsCrossed size={22} />, t: 'Restaurants & kitchens', d: 'Reach nearby customers with fair, flat commissions.', href: '/restaurant-setup', cta: 'Register restaurant' },
  { icon: <Bike size={22} />, t: 'Delivery partners', d: 'Earn flexibly with short, local runs in your own area.', href: '/delivery-setup', cta: 'Start delivering' },
];
function Partners() {
  return (
    <section id="partners" className="text-white" style={{ background: INK }}>
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] items-start">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Partner with Zyphix</p>
            <h2 className="mt-3 text-[2rem] md:text-[2.6rem] font-black tracking-[-0.03em] leading-[1.08]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Grow your local business without losing its identity.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/65">
              Zyphix brings digital ordering, delivery and payments to independent businesses — you stay the hero of your neighbourhood.
            </p>
            <Link href="/partner" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 hover:bg-gray-100">
              Partner overview <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PARTNERS.map(p => (
              <Link key={p.t} href={p.href} className="group rounded-3xl border border-white/10 bg-white/[.04] p-6 transition hover:bg-white/[.08]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">{p.icon}</span>
                <h3 className="mt-4 text-[16px] font-extrabold">{p.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/60">{p.d}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-emerald-400">{p.cta} <ArrowRight size={14} className="transition group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Early access / app ───────────────────────────────────────────────────── */
function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; }
    setState('loading');
    try {
      await apiFetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'landing' }) });
      try {
        const stored = JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as object[];
        stored.push({ email, source: 'landing', ts: Date.now() });
        localStorage.setItem('zyphix_waitlist', JSON.stringify(stored));
      } catch { /* ignore */ }
      setState('done');
    } catch { setState('error'); }
  };

  return (
    <section id="early-access" className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
      <div className="grid gap-10 rounded-[32px] border border-emerald-100 p-8 md:grid-cols-2 md:p-12 items-center" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 60%)' }}>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Early access</p>
          <h2 className="mt-3 text-[1.9rem] md:text-[2.4rem] font-black tracking-[-0.03em] leading-[1.08] text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Be first in your city.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
            We're rolling out neighbourhood by neighbourhood. Leave your email and we'll tell you the moment Zyphix goes live near you — plus launch-day perks.
          </p>

          {state === 'done' ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-[14px] font-bold text-white">
              <CheckCircle2 size={18} /> You're on the list — see you at launch.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" required value={email} onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                  placeholder="you@email.com"
                  className="w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-[14.5px] text-gray-900 outline-none transition focus:ring-4 focus:ring-emerald-100"
                  style={{ borderColor: state === 'error' ? '#EF4444' : '#E5E7EB' }}
                />
              </label>
              <button type="submit" disabled={state === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[14.5px] font-bold text-white disabled:opacity-70" style={{ background: G }}>
                {state === 'loading' ? 'Joining…' : <>Notify me <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
          {state === 'error' && <p className="mt-2 text-[13px] font-semibold text-red-500">Please enter a valid email address.</p>}
          <p className="mt-3 text-[12.5px] text-gray-500">No spam. One email when we launch in your area.</p>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-3xl border border-gray-200 bg-white p-7">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900"><Smartphone size={22} /></span>
          <h3 className="text-[20px] font-extrabold text-gray-900">The Zyphix app is coming to iOS & Android.</h3>
          <p className="text-[14px] leading-relaxed text-gray-600">Until then, everything works right here in your browser — add zyphix.in to your home screen for the full-screen experience.</p>
          <div className="mt-1 flex flex-wrap gap-3">
            {[['/images/appstore.webp', 'Coming soon on the', 'App Store'], ['/images/googleplay.webp', 'Coming soon on', 'Google Play']].map(([src, small, big]) => (
              <Link key={big} href="/app" className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white transition hover:opacity-90" style={{ background: INK }}>
                <img src={src} alt="" className="h-6 w-6 object-contain" loading="lazy" />
                <span className="leading-tight"><span className="block text-[10px] font-medium text-white/70">{small}</span><span className="block text-[14px] font-bold">{big}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ = [
  { q: 'Where is Zyphix available?', a: 'We are onboarding stores and restaurants across India city by city. Enter your location in the app to see live partners near you, or join early access to be notified when we launch in your area.' },
  { q: 'Are prices the same as in the store?', a: 'Yes. Partners list their own shelf prices. We don\'t add surge pricing or hidden handling charges — any delivery fee is shown up front before you pay.' },
  { q: 'How do you deliver so fast?', a: 'Every order is fulfilled by a business within a few kilometres of you and carried by a nearby delivery partner. Short distances, not giant warehouses, are what make 30-minute delivery possible.' },
  { q: 'How can my store or restaurant join?', a: 'Register from the Partners section above. Onboarding is free; our team verifies your business and helps you list your catalogue and go live.' },
];
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-[820px] px-5 pb-20 md:pb-24">
      <SectionHead eyebrow="FAQ" title="Questions, answered." />
      <div className="mt-10 divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
        {FAQ.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
              <span className="text-[15.5px] font-bold text-gray-900">{f.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-6 pb-6 -mt-1 text-[14.5px] leading-relaxed text-gray-600">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <SiteHeader />
      <main>
        <Hero />
        <CategoryShowcase />
        <Products />
        <HowItWorks />
        <Why />
        <Partners />
        <EarlyAccess />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}

export default Landing;
