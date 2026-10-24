import React, { useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Menu, X, Bike, UtensilsCrossed, Store, Mail, ChevronDown, CheckCircle2, ExternalLink,
  FileText, BadgeCheck, ClipboardList, Rocket, Sparkles, Zap, Wrench, Snowflake, Paintbrush, Hammer,
  Droplets, ChefHat, Truck, Bug, type LucideIcon,
} from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { SectionHead, btnPrimary, btnSecondary, card, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';
import { DeliverySetup } from '@/pages/DeliverySetup';
import { RestaurantSetup } from '@/pages/RestaurantSetup';
import { MerchantSetup } from '@/pages/MerchantSetup';
import { ServiceProSetup } from '@/pages/ServiceProSetup';

/* ────────────────────────────────────────────────────────────────────────────
   partner.zyphix.in — partner portal. Mounted at the root for that hostname.
──────────────────────────────────────────────────────────────────────────── */

const BLUE = '#2563EB';
const ORANGE = '#EA580C';
const VIOLET = '#7C3AED';

const NAV = [
  { label: 'Delivery partners',     href: '/delivery' },
  { label: 'Restaurants',           href: '/restaurant' },
  { label: 'Service professionals', href: '/services' },
  { label: 'Store owners',          href: '/store' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .5, ease: 'easeOut' as const, delay },
});

/* ── Header ──────────────────────────────────────────────────────────────── */
function PartnerHeader() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();
  const link = (n: typeof NAV[number], cls: string) => (
    <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`${cls} ${loc === n.href ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>{n.label}</Link>
  );
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Zyphix Partners home" className="flex items-center gap-2.5">
          <ZyphixLogo size={32} wordmarkColor={INK} wordmarkHighlight={G} />
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wider text-emerald-700">Partners</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">{NAV.map(n => link(n, 'text-[14px] font-semibold transition-colors'))}</nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="https://zyphix.in" className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-[14px] font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
            Back to zyphix.in <ExternalLink size={14} />
          </a>
          <a href="#partner-types" className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[14px] font-bold text-white transition hover:opacity-90" style={{ background: G }}>
            Apply now <ArrowRight size={15} />
          </a>
        </div>

        <button className="rounded-lg p-2 text-gray-700 lg:hidden" aria-label="Menu" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-5 py-4 lg:hidden">
          {NAV.map(n => link(n, 'text-[15px] font-semibold'))}
          <div className="flex gap-3 pt-2">
            <a href="https://zyphix.in" className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-[14px] font-semibold text-gray-700">Back to zyphix.in</a>
            <a href="#partner-types" onClick={() => setOpen(false)} className="flex-1 rounded-xl px-4 py-2.5 text-center text-[14px] font-bold text-white" style={{ background: G }}>Apply now</a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function PartnerFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <ZyphixLogo size={28} wordmarkColor={INK} wordmarkHighlight={G} />
          <p className="mt-3 max-w-[320px] text-[13.5px] leading-relaxed text-gray-600">Partner portal for delivery partners, restaurants, service professionals and neighbourhood stores.</p>
          <a href="mailto:partnerships@zyphix.in" className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-gray-800 hover:text-gray-900"><Mail size={14} /> partnerships@zyphix.in</a>
        </div>
        <div className="grid grid-cols-2 gap-8 text-[13.5px]">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Join as</p>
            <ul className="mt-3 space-y-2">
              {NAV.map(n => <li key={n.href}><Link href={n.href} className="font-medium text-gray-700 hover:text-gray-900">{n.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Zyphix</p>
            <ul className="mt-3 space-y-2">
              <li><a href="https://zyphix.in" className="font-medium text-gray-700 hover:text-gray-900">zyphix.in</a></li>
              <li><a href="https://zyphix.in/privacy" className="font-medium text-gray-700 hover:text-gray-900">Privacy policy</a></li>
              <li><a href="https://zyphix.in/terms" className="font-medium text-gray-700 hover:text-gray-900">Terms of service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-4 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Onboarding across India</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Landing content ─────────────────────────────────────────────────────── */
const SERVICE_LIST: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'House cleaning', icon: Sparkles }, { label: 'Electrician', icon: Zap }, { label: 'Plumber', icon: Wrench },
  { label: 'AC service', icon: Snowflake }, { label: 'Painter', icon: Paintbrush }, { label: 'Carpenter', icon: Hammer },
  { label: 'Water purifier', icon: Droplets }, { label: 'Home cook', icon: ChefHat }, { label: 'Packers & movers', icon: Truck },
  { label: 'Pest control', icon: Bug },
];

const CATEGORIES = [
  {
    href: '/delivery', tint: BLUE, bg: '#EFF6FF', border: 'hover:border-blue-300', icon: <Bike size={24} />,
    tag: 'Delivery partner', title: 'Earn with short local runs.',
    sub: 'Deliver groceries, food and essentials within your own neighbourhood. Choose your days and shifts, see the payout for every order before you accept it.',
    perks: ['Bike, scooter, bicycle or car', 'Flexible days and shifts', 'Per-order earnings shown upfront'],
    cta: 'Start delivering',
  },
  {
    href: '/restaurant', tint: ORANGE, bg: '#FFF7ED', border: 'hover:border-orange-300', icon: <UtensilsCrossed size={24} />,
    tag: 'Restaurant & kitchen partner', title: 'List your restaurant on Zyphix Eats.',
    sub: 'Restaurants, cloud kitchens, bakeries and sweet shops. Set your own menu, prices and hours and receive orders from customers nearby.',
    perks: ['Fair, transparent commission', 'Your menu, your prices', 'Real-time order dashboard'],
    cta: 'Register restaurant',
  },
  {
    href: '/services', tint: VIOLET, bg: '#F5F3FF', border: 'hover:border-violet-300', icon: <Sparkles size={24} />,
    tag: 'Zyphix Book professional', title: 'Become a verified member at Zyphix.',
    sub: 'Home-service professionals get bookings from customers in their own area, with a verified badge that customers can trust.',
    perks: null, // replaced by the service list
    cta: 'Join Zyphix Book',
  },
];

const STEPS = [
  { icon: <FileText size={20} />, t: 'Apply online', d: 'Pick your partner type and fill in a short guided form. It takes a few minutes and costs nothing.' },
  { icon: <BadgeCheck size={20} />, t: 'Verification call', d: 'Our onboarding team calls you to confirm details and verify your identity or business documents.' },
  { icon: <ClipboardList size={20} />, t: 'Set up', d: 'We help you add your menu or catalogue, set your service area and availability, or complete delivery training.' },
  { icon: <Rocket size={20} />, t: 'Go live', d: 'Start receiving orders and bookings from customers near you and track everything in your partner dashboard.' },
];

const BENEFITS = [
  { tint: BLUE, bg: '#EFF6FF', icon: <Bike size={18} />, title: 'For delivery partners', items: ['Short distances within your area', 'No forced targets — ride when you want', 'Transparent per-order payouts', 'Support from a real onboarding team'] },
  { tint: ORANGE, bg: '#FFF7ED', icon: <UtensilsCrossed size={18} />, title: 'For restaurants', items: ['Free listing and menu setup', 'No surge pricing added on top of your menu', 'Regular settlement to your bank account', 'Order dashboard for your staff'] },
  { tint: VIOLET, bg: '#F5F3FF', icon: <Sparkles size={18} />, title: 'For service professionals', items: ['Verified badge once checks are complete', 'Bookings from customers in your locality', 'Choose your own days, slots and radius', 'Solo professionals and small teams welcome'] },
  { tint: G, bg: '#ECFDF5', icon: <Store size={18} />, title: 'For store owners', items: ['Kirana, pharmacy and local retail', 'Catalogue setup help', 'Hyperlocal delivery network', 'Keep the customers you already have'] },
];

const FAQ = [
  { q: 'Does it cost anything to join?', a: 'No. There is no joining fee for any partner type. Platform fees and commissions are explained clearly before you go live.' },
  { q: 'What documents do I need?', a: 'Delivery partners need a valid government ID and, for motor vehicles, a driving licence and registration. Restaurants and stores need basic business details and an FSSAI or GST number where applicable. Service professionals need a government ID; we only ask for the last four characters online and verify the rest on a call.' },
  { q: 'How does verification work for Zyphix Book professionals?', a: 'After you apply, our onboarding team calls you, verifies your identity and runs a background check. Once complete, your profile shows a verified badge to customers.' },
  { q: 'Which cities are you in?', a: 'We are onboarding partners across India, neighbourhood by neighbourhood. Apply now and we will let you know when customers in your area can order.' },
  { q: 'Can I set my own prices and hours?', a: 'Yes. Restaurants and stores list their own prices. Service professionals and delivery partners set their own availability. Zyphix does not add surge pricing on top of what you charge.' },
  { q: 'Who do I contact with questions?', a: 'Write to partnerships@zyphix.in and a member of the team will get back to you.' },
];

function PartnerHome() {
  const [open, setOpen] = useState<number | null>(0);
  React.useEffect(() => { document.title = 'Partner with Zyphix · Zyphix Partners'; window.scrollTo(0, 0); }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(124,58,237,.08), transparent 60%)' }} />
        <div className="mx-auto max-w-[1180px] px-5 pb-12 pt-14 md:pb-16 md:pt-20">
          <motion.p {...fade(0)} className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Zyphix partner portal · Onboarding across India</motion.p>
          <motion.h1 {...fade(.05)} className="mt-3 max-w-[820px] text-[2.3rem] font-black leading-[1.04] tracking-[-0.04em] sm:text-[3rem] lg:text-[3.5rem]" style={{ fontFamily: HEAD_FONT, color: INK }}>
            Grow with Zyphix <span style={{ color: G }}>in your neighbourhood.</span>
          </motion.h1>
          <motion.p {...fade(.1)} className="mt-5 max-w-[640px] text-[16.5px] leading-relaxed text-gray-600">
            Deliver, cook or fix things for the people around you. Choose how you want to partner with Zyphix, apply in a few minutes and our team takes it from there.
          </motion.p>
          <motion.div {...fade(.15)} className="mt-7 flex flex-wrap gap-3">
            <a href="#partner-types" className={btnPrimary} style={{ background: G }}>Choose your partner type <ArrowRight size={16} /></a>
            <a href="mailto:partnerships@zyphix.in" className={btnSecondary}><Mail size={16} /> partnerships@zyphix.in</a>
          </motion.div>
        </div>
      </section>

      {/* Three category cards */}
      <section id="partner-types" className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="Partner types" title="Three ways to partner." sub="Each has its own short, guided sign-up. Pick the one that fits you." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.href} {...fade(i * .08)} className={`${card} flex flex-col p-6 transition ${c.border} md:p-7`}>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: c.bg, color: c.tint }}>{c.icon}</span>
              <p className="mt-5 text-[12px] font-bold uppercase tracking-wider" style={{ color: c.tint }}>{c.tag}</p>
              <h3 className="mt-2 text-[24px] font-black leading-tight tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{c.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-600">{c.sub}</p>
              {c.perks ? (
                <ul className="mt-5 flex-1 space-y-2">
                  {c.perks.map(k => (
                    <li key={k} className="flex items-start gap-2 text-[13.5px] text-gray-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: c.tint }} /> {k}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-5 flex flex-1 flex-wrap content-start gap-1.5">
                  {SERVICE_LIST.map(s => (
                    <li key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[12.5px] font-semibold text-violet-900">
                      <s.icon size={12} style={{ color: VIOLET }} /> {s.label}
                    </li>
                  ))}
                </ul>
              )}
              <Link href={c.href} className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:opacity-95" style={{ background: c.tint }}>
                {c.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Store owners */}
        <motion.div {...fade(.3)} className="mt-5 flex flex-col gap-4 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Store size={18} /></span>
            <p className="text-[14px] text-gray-700"><span className="font-bold text-gray-900">Run a kirana, pharmacy or local store?</span> List it on Zyphix and take orders from customers nearby.</p>
          </div>
          <Link href="/store" className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold text-emerald-700 hover:text-emerald-800">List your store <ArrowRight size={15} /></Link>
        </motion.div>
      </section>

      {/* How onboarding works */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <SectionHead eyebrow="How onboarding works" title="From application to first order." sub="A real person from our team walks you through every step." />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className={`${card} p-6`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{s.icon}</span>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Benefits per category */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="What you get" title="Built for independent partners." sub="Transparent terms, local demand and a team you can actually reach." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(b => (
            <div key={b.title} className={`${card} p-6`}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: b.bg, color: b.tint }}>{b.icon}</span>
              <h3 className="mt-4 text-[16px] font-extrabold text-gray-900">{b.title}</h3>
              <ul className="mt-3 space-y-2">
                {b.items.map(k => (
                  <li key={k} className="flex items-start gap-2 text-[13.5px] text-gray-700">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: b.tint }} /> {k}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[820px] px-5 py-20 md:py-24">
          <SectionHead eyebrow="FAQ" title="Partner questions, answered." />
          <div className="mt-10 divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
                  <span className="text-[15.5px] font-bold text-gray-900">{f.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <p className="-mt-1 px-6 pb-6 text-[14.5px] leading-relaxed text-gray-600">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="flex flex-col gap-6 rounded-[32px] p-8 text-white md:flex-row md:items-center md:justify-between md:p-12" style={{ background: INK }}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Ready when you are</p>
            <h2 className="mt-3 text-[1.8rem] font-black leading-[1.1] tracking-[-0.03em] md:text-[2.2rem]" style={{ fontFamily: HEAD_FONT }}>Start partnering with Zyphix today.</h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/65">Questions before you apply? Email <a href="mailto:partnerships@zyphix.in" className="font-semibold text-white underline-offset-2 hover:underline">partnerships@zyphix.in</a>.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/delivery" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 hover:bg-gray-100">Deliver</Link>
            <Link href="/restaurant" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-[14.5px] font-bold text-white hover:bg-white/10">Restaurant</Link>
            <Link href="/services" className={btnPrimary} style={{ background: G }}>Join Zyphix Book <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Not found ───────────────────────────────────────────────────────────── */
function PartnerNotFound() {
  return (
    <section className="mx-auto max-w-[640px] px-5 py-24 text-center">
      <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">404</p>
      <h1 className="mt-3 text-[2rem] font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>This page doesn't exist.</h1>
      <p className="mt-3 text-[15px] text-gray-600">The link may be old or mistyped. Head back to the partner portal to pick your partner type.</p>
      <Link href="/" className={`${btnPrimary} mt-7`} style={{ background: G }}>Back to partner home <ArrowRight size={16} /></Link>
    </section>
  );
}

/* ── Site ────────────────────────────────────────────────────────────────── */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <PartnerHeader />
      <main>{children}</main>
      <PartnerFooter />
    </div>
  );
}

export default function PartnerSite() {
  return (
    <Switch>
      <Route path="/"><Shell><PartnerHome /></Shell></Route>
      <Route path="/delivery" component={DeliverySetup} />
      <Route path="/restaurant" component={RestaurantSetup} />
      <Route path="/store" component={MerchantSetup} />
      <Route path="/services" component={ServiceProSetup} />
      <Route><Shell><PartnerNotFound /></Shell></Route>
    </Switch>
  );
}

export { PartnerSite };
