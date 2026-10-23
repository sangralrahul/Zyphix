import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Clock, MapPin, ShieldCheck, Store, UtensilsCrossed, Wrench, Bike,
  Smartphone, Search, PackageCheck, Leaf, BadgeIndianRupee, Menu, X, Mail,
  CheckCircle2, ChevronDown, Instagram, Linkedin, Twitter,
} from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { apiFetch } from '@/lib/api';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix — company landing page (zyphix.in)
   Clean, white, green-accent. The delivery app itself lives at /now and /eats.
──────────────────────────────────────────────────────────────────────────── */

const G  = '#0DA366';
const G2 = '#0A8C58';
const INK = '#0B1220';

const NAV = [
  { label: 'Products',     href: '#products' },
  { label: 'How it works', href: '#how' },
  { label: 'Partners',     href: '#partners' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

/* ── Nav ──────────────────────────────────────────────────────────────────── */
function TopNav() {
  const [open, setOpen] = useState(false);
  const item = (n: typeof NAV[number]) =>
    n.href.startsWith('#')
      ? <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">{n.label}</a>
      : <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">{n.label}</Link>;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 h-[68px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Zyphix home" className="flex items-center">
          <ZyphixLogo size={32} wordmarkColor={INK} wordmarkHighlight={G} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">{NAV.map(item)}</nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/partner" className="text-[14px] font-semibold text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
            Become a partner
          </Link>
          <Link href="/now" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-white px-4 py-2 rounded-xl transition hover:opacity-90" style={{ background: G }}>
            Order now <ArrowRight size={15} />
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-gray-700" aria-label="Menu" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 flex flex-col gap-4">
          {NAV.map(item)}
          <div className="flex gap-3 pt-2">
            <Link href="/partner" className="flex-1 text-center text-[14px] font-semibold text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200">Become a partner</Link>
            <Link href="/now" className="flex-1 text-center text-[14px] font-bold text-white px-4 py-2.5 rounded-xl" style={{ background: G }}>Order now</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(249,115,22,.10), transparent 60%)' }} />
      <div className="mx-auto max-w-[1180px] px-5 pt-16 pb-14 md:pt-24 md:pb-24 grid md:grid-cols-[1.05fr_.95fr] gap-12 items-center">
        <div>
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12.5px] font-bold text-emerald-700">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
            India's SuperLocal App · Now onboarding across India
          </motion.div>

          <motion.h1 {...fade(.05)} className="mt-5 font-black tracking-[-0.04em] leading-[1.02] text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]" style={{ fontFamily: "'Outfit', sans-serif", color: INK }}>
            Your neighbourhood,<br />
            <span style={{ color: G }}>delivered in 30 minutes.</span>
          </motion.h1>

          <motion.p {...fade(.1)} className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-gray-600">
            Groceries, food, pharmacy and home services from real local kirana stores, restaurants and professionals — one app, transparent pricing, no dark warehouses.
          </motion.p>

          <motion.div {...fade(.15)} className="mt-8 flex flex-wrap gap-3">
            <Link href="/now" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(13,163,102,.35)] transition hover:-translate-y-0.5" style={{ background: G }}>
              Order groceries <ArrowRight size={17} />
            </Link>
            <Link href="/eats" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-gray-900 border border-gray-200 bg-white transition hover:bg-gray-50">
              <UtensilsCrossed size={17} className="text-orange-500" /> Order food
            </Link>
          </motion.div>

          <motion.ul {...fade(.2)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-gray-600">
            {[
              [<Clock size={15} />, 'Under 30 min delivery'],
              [<BadgeIndianRupee size={15} />, 'Zero surge pricing'],
              [<Store size={15} />, 'Real local stores'],
            ].map(([icon, t], i) => (
              <li key={i} className="flex items-center gap-2"><span className="text-emerald-600">{icon}</span>{t}</li>
            ))}
          </motion.ul>
        </div>

        {/* Visual */}
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .15 }} className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(11,18,32,.10)]">
              <img src="/images/groceries.png" alt="Fresh groceries from local kirana stores" className="h-[220px] sm:h-[260px] w-full object-cover" loading="eager" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[12.5px] font-bold text-gray-900 shadow">
                <span className="h-2 w-2 rounded-full" style={{ background: G }} /> Zyphix Now · Groceries
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 p-3 shadow backdrop-blur">
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Sharma Kirana Store</p>
                  <p className="text-[12px] text-gray-500">0.8 km away · 2,900+ items</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">18 min</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_12px_40px_rgba(11,18,32,.08)]">
              <img src="/images/food.png" alt="Food from neighbourhood restaurants" className="h-[150px] w-full object-cover" loading="lazy" />
              <div className="p-3">
                <p className="text-[13px] font-bold text-gray-900">Zyphix Eats</p>
                <p className="text-[12px] text-gray-500">Dhabas, cloud kitchens & local favourites</p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-3xl p-4 text-white shadow-[0_12px_40px_rgba(13,163,102,.30)]" style={{ background: `linear-gradient(145deg, ${G} 0%, ${G2} 100%)` }}>
              <Bike size={26} />
              <div>
                <p className="text-[28px] font-black leading-none tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>30<span className="text-[16px] font-bold"> min</span></p>
                <p className="mt-1 text-[12.5px] text-white/85">Average doorstep delivery target</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Category strip ───────────────────────────────────────────────────────── */
const CATS = ['Fruits & Veg', 'Dairy & Eggs', 'Snacks', 'Pharmacy', 'Grains & Dal', 'Bakery', 'Household', 'Personal Care', 'Biryani', 'Pizza', 'Thali', 'Desserts', 'Home Services'];
function CategoryStrip() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-5 flex items-center gap-4 overflow-x-auto no-scrollbar">
        <span className="shrink-0 text-[12px] font-bold uppercase tracking-wider text-gray-400">Everyday essentials</span>
        {CATS.map(c => (
          <span key={c} className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-[13px] font-semibold text-gray-700">{c}</span>
        ))}
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

/* ── Footer ───────────────────────────────────────────────────────────────── */
const FOOT: Array<[string, Array<[string, string]>]> = [
  ['Products', [['Zyphix Now', '/now'], ['Zyphix Eats', '/eats'], ['Zyphix Book', '/book'], ['Offers', '/offers'], ['Mobile app', '/app']]],
  ['Partners', [['Partner overview', '/partner'], ['List your store', '/merchant-setup'], ['Register restaurant', '/restaurant-setup'], ['Deliver with us', '/delivery-setup']]],
  ['Company', [['About', '/about'], ['Blog', '/blog'], ['Investors', '/investors'], ['Contact', '/contact']]],
  ['Legal', [['Privacy policy', '/privacy'], ['Terms of service', '/terms']]],
];
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-14 grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <ZyphixLogo size={30} wordmarkColor={INK} wordmarkHighlight={G} />
          <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-gray-600">India's SuperLocal App — groceries, food, pharmacy and services from trusted neighbourhood businesses.</p>
          <div className="mt-5 flex gap-3">
            {[[<Instagram size={16} />, 'https://instagram.com/zyphix.in', 'Instagram'], [<Linkedin size={16} />, 'https://linkedin.com/company/zyphix', 'LinkedIn'], [<Twitter size={16} />, 'https://x.com/zyphix_in', 'X']].map(([ic, href, label]) => (
              <a key={label as string} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900">{ic}</a>
            ))}
          </div>
        </div>
        {FOOT.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-gray-400">{h}</p>
            <ul className="mt-4 space-y-2.5">
              {links.map(([l, href]) => <li key={l}><Link href={href} className="text-[14px] font-medium text-gray-700 hover:text-gray-900">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-[1180px] px-5 py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[13px] text-gray-500">
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Made in India · <a href="mailto:hello@zyphix.in" className="font-semibold text-gray-700">hello@zyphix.in</a></p>
        </div>
      </div>
    </footer>
  );
}

/* ── Shared ───────────────────────────────────────────────────────────────── */
function SectionHead({ eyebrow, title, sub, align = 'center' }: { eyebrow: string; title: string; sub?: string; align?: 'center' | 'left' }) {
  const c = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-[640px] ${c}`}>
      <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-[1.9rem] md:text-[2.5rem] font-black tracking-[-0.03em] leading-[1.08] text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
      {sub && <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">{sub}</p>}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <TopNav />
      <main>
        <Hero />
        <CategoryStrip />
        <Products />
        <HowItWorks />
        <Why />
        <Partners />
        <EarlyAccess />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
