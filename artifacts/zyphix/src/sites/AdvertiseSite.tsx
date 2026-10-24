import React, { useState } from 'react';
import { Switch, Route, Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Menu, X, Mail, CheckCircle2, LayoutPanelTop, Rows3, Sparkles, Search,
  Star, TicketPercent, Package, UtensilsCrossed, Wrench, ShoppingBag, MapPin, Target,
  BarChart3, Handshake, MessageSquareText, FileText, Rocket, ExternalLink,
} from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { SectionHead, btnPrimary, btnSecondary, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';
import { apiFetch } from '@/lib/api';

/* ────────────────────────────────────────────────────────────────────────────
   advertise.zyphix.in — advertising site for brands and local businesses.
   White surfaces, gray-200 borders, green accent, dark INK hero band.
──────────────────────────────────────────────────────────────────────────── */

const MAIN_SITE = 'https://zyphix.in';
const PARTNER_SITE = 'https://partner.zyphix.in';
const PARTNERSHIPS_EMAIL = 'partnerships@zyphix.in';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

const NAV = [
  { label: 'Ad formats',   href: '#formats' },
  { label: 'Who it\'s for', href: '#audience' },
  { label: 'How it works', href: '#how' },
  { label: 'Get in touch', href: '#contact' },
];

/* ── Header ───────────────────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const items = NAV.map(n => (
    <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">{n.label}</a>
  ));
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 h-[68px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Zyphix Advertise home" className="flex items-center gap-2.5">
          <ZyphixLogo size={32} wordmarkColor={INK} wordmarkHighlight={G} />
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wider text-emerald-700">Advertise</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">{items}</nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={MAIN_SITE} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
            Back to zyphix.in <ExternalLink size={14} />
          </a>
          <a href="#contact" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-white px-4 py-2 rounded-xl transition hover:opacity-90" style={{ background: G }}>
            Get in touch <ArrowRight size={15} />
          </a>
        </div>

        <button className="md:hidden p-2 rounded-lg text-gray-700" aria-label="Menu" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 flex flex-col gap-4">
          {items}
          <div className="flex gap-3 pt-2">
            <a href={MAIN_SITE} className="flex-1 text-center text-[14px] font-semibold text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200">Back to zyphix.in</a>
            <a href="#contact" onClick={() => setOpen(false)} className="flex-1 text-center text-[14px] font-bold text-white px-4 py-2.5 rounded-xl" style={{ background: G }}>Get in touch</a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <ZyphixLogo size={28} wordmarkColor={INK} wordmarkHighlight={G} />
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">Advertise</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-gray-700">
          <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="hover:text-gray-900">{PARTNERSHIPS_EMAIL}</a>
          <a href={PARTNER_SITE} className="hover:text-gray-900">Become a partner</a>
          <a href={`${MAIN_SITE}/privacy`} className="hover:text-gray-900">Privacy</a>
          <a href={`${MAIN_SITE}/terms`} className="hover:text-gray-900">Terms</a>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-[1180px] px-5 py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[13px] text-gray-500">
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Made in India · <a href={MAIN_SITE} className="font-semibold text-gray-700">zyphix.in</a></p>
        </div>
      </div>
    </footer>
  );
}

function Shell({ children, title }: { children: React.ReactNode; title: string }) {
  React.useEffect(() => { document.title = `${title} · Zyphix Advertise`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden text-white" style={{ background: `radial-gradient(1100px 600px at 80% -10%, rgba(13,163,102,.55), transparent 60%), radial-gradient(700px 500px at 0% 100%, rgba(249,115,22,.22), transparent 55%), ${INK}` }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse at 60% 40%, black 30%, transparent 75%)' }} />
      <div className="mx-auto max-w-[1180px] px-5 pt-16 pb-14 md:pt-24 md:pb-20 grid md:grid-cols-[1.05fr_.95fr] gap-12 items-center">
        <div>
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12.5px] font-bold text-emerald-300 backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            Launching across India · Early advertiser programme
          </motion.div>

          <motion.h1 {...fade(.05)} className="mt-6 font-black tracking-[-0.045em] leading-[1.0] text-[2.7rem] sm:text-[3.6rem] lg:text-[4.4rem]" style={{ fontFamily: HEAD_FONT }}>
            Reach customers in the{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #34D399, #10B981 50%, #A7F3D0)' }}>neighbourhoods you serve.</span>
          </motion.h1>

          <motion.p {...fade(.1)} className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-white/70">
            Hyperlocal, intent-driven placements inside a shopping app — not a feed. Your brand shows up when people are choosing what to buy, from the stores and restaurants a few kilometres away.
          </motion.p>

          <motion.div {...fade(.15)} className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}>
              Talk to partnerships <ArrowRight size={17} />
            </a>
            <a href="#formats" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15">
              See ad formats
            </a>
          </motion.div>

          <motion.div {...fade(.2)} className="mt-10 grid max-w-[560px] grid-cols-3 gap-3">
            {[
              ['Now', 'Groceries from kirana stores'],
              ['Eats', 'Food from local restaurants'],
              ['Book', 'Home services from local pros'],
            ].map(([v, l]) => (
              <div key={v} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                <p className="text-[20px] font-black leading-none tracking-tight" style={{ fontFamily: HEAD_FONT }}>Zyphix {v}</p>
                <p className="mt-1.5 text-[12px] leading-snug text-white/60">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Placement mock */}
        <motion.div initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .7, delay: .15 }} className="relative mx-auto w-full max-w-[440px]">
          <div aria-hidden className="absolute -inset-6 rounded-[40px] opacity-70 blur-2xl" style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,.5), transparent)' }} />
          <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/5 p-3 backdrop-blur">
            <div className="rounded-[24px] bg-white p-4 text-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12.5px] font-bold"><MapPin size={14} className="text-emerald-600" /> Delivering to Sector 12</div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-black text-emerald-700">30 min</span>
              </div>
              <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-400 flex items-center gap-2"><Search size={14} /> Search atta, milk, snacks…</div>
              <div className="mt-3 relative overflow-hidden rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${G}, #047857)` }}>
                <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Sponsored</span>
                <p className="text-[11.5px] font-semibold text-white/80">Home banner</p>
                <p className="mt-1 text-[17px] font-black leading-tight" style={{ fontFamily: HEAD_FONT }}>Your brand, first thing shoppers see</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[13px] font-bold">Breakfast essentials <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Sponsored row</span></p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {['Atta', 'Milk', 'Poha'].map((n, i) => (
                  <div key={n} className={`rounded-2xl border p-2.5 ${i === 1 ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'}`}>
                    <div className="h-12 rounded-xl bg-gray-100" />
                    <p className="mt-2 text-[12px] font-bold">{n}</p>
                    <p className="text-[11px] text-gray-500">{i === 1 ? 'Spotlight' : 'From local shelf'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Ad formats ───────────────────────────────────────────────────────────── */
const FORMATS = [
  { icon: <LayoutPanelTop size={20} />, t: 'Home banner', d: 'A prominent banner on the home screen of Zyphix Now, Eats or Book, shown only to customers in the delivery areas you choose.' },
  { icon: <Rows3 size={20} />, t: 'Sponsored category row', d: 'Your products as a named row inside the grocery store — "Breakfast essentials by your brand" — right where shoppers browse.' },
  { icon: <Sparkles size={20} />, t: 'Product spotlight', d: 'Highlight one SKU inside its category with a spotlight badge, so it stands out among items from the same kirana shelf.' },
  { icon: <Search size={20} />, t: 'Search placement', d: 'Appear at the top of results for the search terms that matter to you — "atta", "chai", "detergent" — labelled clearly as sponsored.' },
  { icon: <Star size={20} />, t: 'Featured restaurant or pro', d: 'A featured slot in Zyphix Eats or Zyphix Book for your restaurant, salon, repair service or clinic in your own neighbourhood.' },
  { icon: <TicketPercent size={20} />, t: 'Offers & coupons push', d: 'A coupon or offer surfaced in the Offers tab and at checkout to customers near you — the simplest way to drive a first order.' },
];
function Formats() {
  return (
    <section id="formats" className="mx-auto max-w-[1180px] px-5 py-20 md:py-24 scroll-mt-20">
      <SectionHead eyebrow="Ad formats" title="Placements built into the shopping journey." sub="Every format lives inside the app where buying decisions happen. All sponsored placements are clearly labelled to customers." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FORMATS.map(f => (
          <div key={f.t} className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.10)]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{f.icon}</span>
            <h3 className="mt-5 text-[19px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{f.t}</h3>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-gray-600">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Who it's for ─────────────────────────────────────────────────────────── */
const AUDIENCE = [
  { icon: <Package size={22} />, tint: '#0DA366', bg: '#ECFDF5', t: 'FMCG brands', d: 'Get your SKUs noticed in the grocery store — sponsored rows, product spotlights and search placement in the areas where your products are already stocked.' },
  { icon: <UtensilsCrossed size={22} />, tint: '#EA580C', bg: '#FFF7ED', t: 'Local restaurants', d: 'Be the featured spot in Zyphix Eats for your neighbourhood. Reach hungry customers a few streets away, not a whole city.' },
  { icon: <Wrench size={22} />, tint: '#2563EB', bg: '#EFF6FF', t: 'Home-service businesses', d: 'Electricians, cleaners, salons, repair shops — get featured in Zyphix Book and run neighbourhood-targeted banners and offers.' },
  { icon: <ShoppingBag size={22} />, tint: '#7C3AED', bg: '#F5F3FF', t: 'D2C brands', d: 'Launch or sample in specific localities through partner stores, with coupons and spotlights that put your product in real baskets.' },
];
function Audience() {
  return (
    <section id="audience" className="bg-gray-50 border-y border-gray-200 scroll-mt-20">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="Who it's for" title="Made for brands and businesses that sell locally." sub="Whether you sell across India or on one street, placements are targeted by delivery area — so you only pay to reach the people you can actually serve." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map(a => (
            <div key={a.t} className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: a.bg, color: a.tint }}>{a.icon}</span>
              <h3 className="mt-5 text-[19px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{a.t}</h3>
              <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-gray-600">{a.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Why Zyphix ───────────────────────────────────────────────────────────── */
const WHY = [
  { icon: <MapPin size={20} />, t: 'Hyperlocal targeting by delivery area', d: 'Pick the neighbourhoods and pin codes you serve. Your placement is shown only to customers who can order from stores in that area.' },
  { icon: <Target size={20} />, t: 'Intent at the point of purchase', d: 'Customers open Zyphix to buy groceries, order food or book a service. Your brand appears while they decide — not while they scroll.' },
  { icon: <BarChart3 size={20} />, t: 'Transparent reporting', d: 'A simple report with impressions, taps and orders attributed to your placement. No vanity dashboards, no fine print.' },
  { icon: <Handshake size={20} />, t: 'No bidding wars', d: 'Flat rates per placement and period. You know what you pay before you go live, and you never outbid a neighbour for the same slot.' },
];
function Why() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
      <div className="grid gap-12 md:grid-cols-[.9fr_1.1fr] items-start">
        <div>
          <SectionHead align="left" eyebrow="Why Zyphix for ads" title="Closer to the customer than any feed." sub="Zyphix is a shopping app for the neighbourhood economy. Advertising on it means being present at the moment of choice, inside the delivery radius that matters to you." />
          <a href="#contact" className={`mt-8 ${btnPrimary}`} style={{ background: G }}>Start a conversation <ArrowRight size={16} /></a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY.map(w => (
            <div key={w.t} className="rounded-3xl border border-gray-200 bg-white p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{w.icon}</span>
              <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900">{w.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ─────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: <MessageSquareText size={20} />, t: 'Tell us your goal', d: 'Share what you want — awareness in a new locality, trial for a product, more orders for your restaurant — and the areas you serve.' },
  { icon: <FileText size={20} />, t: 'We propose placements and a flat rate', d: 'Our partnerships team suggests the formats that fit, with a plain-language quote. No auctions, no hidden fees.' },
  { icon: <Rocket size={20} />, t: 'Go live and get a simple report', d: 'Your placement goes live in the chosen areas. At the end of the period you get a clear report of what it did.' },
];
function How() {
  return (
    <section id="how" className="bg-gray-50 border-y border-gray-200 scroll-mt-20">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="How it works" title="From first call to live placement in three steps." />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-3xl border border-gray-200 bg-white p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{s.icon}</span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</span>
              </div>
              <h3 className="mt-5 text-[18px] font-extrabold text-gray-900">{s.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Pricing ──────────────────────────────────────────────────────────────── */
function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
      <div className="grid gap-10 rounded-[32px] border border-emerald-100 p-8 md:grid-cols-[1.1fr_.9fr] md:p-12 items-center" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 60%)' }}>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Pricing</p>
          <h2 className="mt-3 text-[1.9rem] md:text-[2.4rem] font-black tracking-[-0.03em] leading-[1.08] text-gray-900" style={{ fontFamily: HEAD_FONT }}>
            Flat, transparent rates.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">
            We are in our early advertiser programme, so every plan is a custom quote based on the formats you pick, the areas you target and the period you run. You see the full price before anything goes live, and it doesn't change mid-campaign.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#contact" className={btnPrimary} style={{ background: G }}>Request a quote <ArrowRight size={16} /></a>
            <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className={btnSecondary}><Mail size={16} /> {PARTNERSHIPS_EMAIL}</a>
          </div>
        </div>
        <ul className="grid gap-3">
          {[
            'Priced per placement and period — not per click or auction',
            'Targeted by delivery area, so you never pay for the wrong city',
            'Early advertisers get first choice of placements as new areas open',
            'Cancel or change areas between periods, no lock-in',
          ].map(x => (
            <li key={x} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-[14.5px] text-gray-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /> {x}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Inquiry form ─────────────────────────────────────────────────────────── */
const BUSINESS_TYPES = ['FMCG brand', 'Restaurant', 'Home services', 'D2C brand', 'Agency', 'Other'];
const BUDGETS = ['Under ₹25k', '₹25k–1L', '₹1L–5L', '₹5L+', 'Not sure'];

const inputCls = 'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100';
const labelCls = 'block text-[13px] font-bold text-gray-700 mb-1.5';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelCls}>{label}</span>{children}</label>;
}

function Contact() {
  const [form, setForm] = useState({ businessName: '', contactName: '', email: '', phone: '', city: '', businessType: '', budgetRange: '', goal: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (state === 'error') { setState('idle'); setError(''); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.phone.replace(/\D/g, '');
    if (!form.businessName.trim() || !form.contactName.trim() || !form.city.trim()) { setState('error'); setError('Please fill in all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setState('error'); setError('Please enter a valid email address.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setState('error'); setError('Please enter a valid 10-digit Indian mobile number.'); return; }
    if (!form.businessType || !form.budgetRange) { setState('error'); setError('Please choose a business type and a budget range.'); return; }

    setState('loading');
    try {
      const res = await apiFetch('/api/partner-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contactName.trim(),
          email: form.email.trim(),
          phone,
          city: form.city.trim(),
          role: 'advertiser',
          details: { businessName: form.businessName.trim(), businessType: form.businessType, budgetRange: form.budgetRange, goal: form.goal.trim() },
        }),
      });
      let data: { success?: boolean; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }
      if (res.ok && data.success !== false && !data.error) { setState('done'); }
      else { setState('error'); setError(data.error || 'Something went wrong. Please try again or email us directly.'); }
    } catch {
      setState('error'); setError('Could not reach our server. Please try again or email us directly.');
    }
  };

  return (
    <section id="contact" className="bg-gray-50 border-t border-gray-200 scroll-mt-20">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24 grid gap-12 md:grid-cols-[.8fr_1.2fr] items-start">
        <div>
          <SectionHead align="left" eyebrow="Get in touch" title="Tell us what you want to achieve." sub="Share a few details and our partnerships team will come back with placement ideas and a flat-rate quote for your areas." />
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-[13px] font-bold uppercase tracking-wider text-gray-400">Prefer email?</p>
            <a href={`mailto:${PARTNERSHIPS_EMAIL}?subject=Advertising%20on%20Zyphix`} className="mt-2 inline-flex items-center gap-2 text-[15.5px] font-bold text-emerald-700 hover:text-emerald-800"><Mail size={17} /> {PARTNERSHIPS_EMAIL}</a>
            <p className="mt-3 text-[13.5px] leading-relaxed text-gray-600">Include your business name, the cities or neighbourhoods you serve and what you'd like to run. We reply within 2 working days.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
          {state === 'done' ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><CheckCircle2 size={28} /></span>
              <h3 className="text-[22px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>Thanks — our partnerships team will reply within 2 working days.</h3>
              <p className="text-[14.5px] leading-relaxed text-gray-600">We've received your details. If anything is urgent, write to <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="font-semibold text-emerald-700">{PARTNERSHIPS_EMAIL}</a>.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Business name"><input className={inputCls} value={form.businessName} onChange={set('businessName')} placeholder="Acme Foods Pvt. Ltd." required /></Field>
                <Field label="Contact name"><input className={inputCls} value={form.contactName} onChange={set('contactName')} placeholder="Your full name" required /></Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Work email"><input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="you@company.com" required /></Field>
                <Field label="Phone (10 digits)"><input type="tel" inputMode="numeric" maxLength={10} className={inputCls} value={form.phone} onChange={set('phone')} placeholder="98765 43210" required /></Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="City"><input className={inputCls} value={form.city} onChange={set('city')} placeholder="Delhi" required /></Field>
                <Field label="Business type">
                  <select className={inputCls} value={form.businessType} onChange={set('businessType')} required>
                    <option value="">Select…</option>
                    {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Monthly budget">
                  <select className={inputCls} value={form.budgetRange} onChange={set('budgetRange')} required>
                    <option value="">Select…</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="What do you want to achieve?">
                <textarea rows={4} className={`${inputCls} resize-y`} value={form.goal} onChange={set('goal')} placeholder="e.g. Launch our new oats range in South Delhi and get it into first baskets; or get more weekend orders for our restaurant in Indiranagar." />
              </Field>

              {state === 'error' && error && <p className="text-[13.5px] font-semibold text-red-500">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={state === 'loading'} className={`${btnPrimary} justify-center disabled:opacity-70`} style={{ background: G }}>
                  {state === 'loading' ? 'Sending…' : <>Send inquiry <ArrowRight size={16} /></>}
                </button>
                <p className="text-[12.5px] text-gray-500">We only use these details to reply to your inquiry.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Pages ────────────────────────────────────────────────────────────────── */
function Home() {
  return (
    <Shell title="Advertise on Zyphix">
      <Hero />
      <Formats />
      <Audience />
      <Why />
      <How />
      <Pricing />
      <Contact />
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell title="Page not found">
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(249,115,22,.08), transparent 60%)' }} />
        <div className="mx-auto max-w-[640px] px-5 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Error 404</p>
          <h1 className="mt-3 font-black tracking-[-0.04em] leading-[1.02] text-[2.8rem] sm:text-[3.6rem]" style={{ fontFamily: HEAD_FONT, color: INK }}>Page not found.</h1>
          <p className="mt-5 text-[16.5px] leading-relaxed text-gray-600">That page doesn't exist on advertise.zyphix.in. Head back to the overview or talk to our partnerships team.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className={btnPrimary} style={{ background: G }}>Advertising overview <ArrowRight size={16} /></Link>
            <a href={MAIN_SITE} className={btnSecondary}>Back to zyphix.in</a>
          </div>
        </div>
      </section>
    </Shell>
  );
}

/* ── Site root ────────────────────────────────────────────────────────────── */
export default function AdvertiseSite() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}
