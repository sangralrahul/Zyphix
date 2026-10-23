import { apiFetch } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Mail, ArrowRight, Check, Bell, Zap, MapPin, Tag, UtensilsCrossed, RefreshCw,
  Smartphone, Globe, Share, PlusSquare, ShoppingBag, Clock,
} from 'lucide-react';
import { SitePage, PageHero, SectionHead, btnPrimary, btnSecondary, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix mobile app — coming soon (zyphix.in/app)
   Light page: hero + countdown + notify form, "use it in your browser" steps,
   feature list, store badges.
──────────────────────────────────────────────────────────────────────────── */

/* Launch target — a fixed future date used for the live countdown */
const LAUNCH_TARGET = new Date('2026-08-15T09:00:00Z').getTime();

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return [
    { v: p(d), l: 'Days' },
    { v: p(h), l: 'Hours' },
    { v: p(m), l: 'Minutes' },
    { v: p(s), l: 'Seconds' },
  ];
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

const FEATURES = [
  { Icon: Zap, t: '30-minute grocery delivery', d: 'Real kirana shelves near you, packed and moving in minutes.' },
  { Icon: UtensilsCrossed, t: 'Food from local dhabas', d: 'Neighbourhood restaurants and cloud kitchens, fair commissions.' },
  { Icon: MapPin, t: 'Live order tracking', d: 'Follow your delivery partner from pickup to doorstep.' },
  { Icon: Tag, t: 'App-exclusive deals', d: 'Offers and launch-day perks only in the app.' },
  { Icon: Bell, t: 'Instant push updates', d: 'Order confirmed, packed, on the way — without refreshing.' },
  { Icon: RefreshCw, t: 'One-tap reorder', d: 'Your weekly essentials, re-ordered in a single tap.' },
];

const BROWSER_STEPS = [
  { Icon: Globe, t: 'Open zyphix.in', d: 'Everything — groceries, food and services — already works in your mobile browser.' },
  { Icon: Share, t: 'Tap Share or the browser menu', d: 'On iPhone use the Share button in Safari; on Android open the Chrome menu (⋮).' },
  { Icon: PlusSquare, t: 'Add to Home Screen', d: 'Zyphix gets its own icon and opens full-screen, just like an installed app.' },
];

/* ── Light phone preview ──────────────────────────────────────────────────── */
function PhonePreview() {
  return (
    <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .15 }} className="mx-auto w-[270px]">
      <div className="rounded-[40px] border border-gray-200 bg-white p-2.5 shadow-[0_24px_60px_rgba(11,18,32,.12)]">
        <div className="relative overflow-hidden rounded-[32px] bg-gray-50">
          <div className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full" style={{ background: INK }} />
          <div className="px-4 pb-4 pt-10 text-white" style={{ background: G }}>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-black tracking-tight" style={{ fontFamily: HEAD_FONT }}>Zyphix</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold"><Clock size={10} /> 30 min</span>
            </div>
            <div className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] font-medium text-gray-400">Search groceries &amp; food…</div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 p-3.5">
            <div className="flex h-[88px] flex-col justify-between rounded-2xl bg-emerald-50 p-3 text-emerald-800">
              <ShoppingBag size={18} />
              <div><p className="text-[12px] font-extrabold leading-tight">Zyphix Now</p><p className="text-[10px] text-emerald-700">Groceries</p></div>
            </div>
            <div className="flex h-[88px] flex-col justify-between rounded-2xl bg-orange-50 p-3 text-orange-700">
              <UtensilsCrossed size={18} />
              <div><p className="text-[12px] font-extrabold leading-tight">Zyphix Eats</p><p className="text-[10px] text-orange-600">Food</p></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 px-3.5">
            {['Veg', 'Dairy', 'Snacks', 'Pharmacy'].map(c => (
              <span key={c} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-700">{c}</span>
            ))}
          </div>
          <div className="m-3.5 flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Zap size={16} /></span>
            <div className="flex-1">
              <p className="text-[11.5px] font-extrabold text-gray-900">Order on the way</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-2/3 rounded-full" style={{ background: G }} /></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────────── */
export function AppComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const countdown = useCountdown(LAUNCH_TARGET);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'app-page' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Something went wrong.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SitePage title="Mobile app">
      <div data-testid="app-coming-soon">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gray-200">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(249,115,22,.08), transparent 60%)' }} />
          <div className="mx-auto max-w-[1180px] px-5 pt-14 pb-14 md:pt-20 md:pb-20 grid gap-12 md:grid-cols-[1.1fr_.9fr] items-center">
            <div>
              <motion.p {...fade(0)} className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Mobile app · Coming soon</motion.p>
              <motion.h1 {...fade(.05)} className="mt-3 max-w-[700px] font-black tracking-[-0.04em] leading-[1.04] text-[2.3rem] sm:text-[3rem] lg:text-[3.5rem]" style={{ fontFamily: HEAD_FONT, color: INK }}>
                The Zyphix app is coming to <span style={{ color: G }}>iOS &amp; Android.</span>
              </motion.h1>
              <motion.p {...fade(.1)} className="mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-gray-600">
                Groceries in 30 minutes, food from local dhabas and trusted home services — in one native app. Leave your email and we'll tell you the moment it's live.
              </motion.p>

              {/* Countdown */}
              <motion.div {...fade(.15)} className="mt-8 grid max-w-[460px] grid-cols-4 gap-2.5">
                {countdown.map(c => (
                  <div key={c.l} className="rounded-2xl border border-gray-200 bg-white px-2 py-3.5 text-center">
                    <p className="text-[26px] sm:text-[32px] font-black leading-none tracking-tight tabular-nums text-gray-900" style={{ fontFamily: HEAD_FONT }}>{c.v}</p>
                    <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[.12em] text-gray-400">{c.l}</p>
                  </div>
                ))}
              </motion.div>

              {/* Notify form */}
              <motion.div {...fade(.2)} className="mt-7 max-w-[520px]">
                {submitted ? (
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20"><Check size={15} strokeWidth={3} /></span>
                    <div>
                      <p className="text-[14px] font-bold">You're on the launch list!</p>
                      <p className="text-[12.5px] text-white/85">We'll email you the day the app goes live.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                      <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        data-testid="notify-email-input"
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@email.com"
                        className="w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-[14.5px] text-gray-900 outline-none transition focus:ring-4 focus:ring-emerald-100"
                        style={{ borderColor: error ? '#EF4444' : '#E5E7EB' }}
                      />
                    </label>
                    <button
                      data-testid="notify-submit-button"
                      type="submit" disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[14.5px] font-bold text-white transition hover:opacity-95 disabled:opacity-70"
                      style={{ background: G }}>
                      {loading ? 'Sending…' : <>Notify me <ArrowRight size={16} /></>}
                    </button>
                  </form>
                )}
                {error && <p className="mt-2 text-[13px] font-semibold text-red-500">{error}</p>}
                <p className="mt-3 text-[12.5px] text-gray-500">No spam. One email when the app launches.</p>
              </motion.div>

              {/* Store badges */}
              <motion.div {...fade(.25)} className="mt-7 flex flex-wrap gap-3">
                {[['/images/appstore.webp', 'Coming soon on the', 'App Store'], ['/images/googleplay.webp', 'Coming soon on', 'Google Play']].map(([src, small, big]) => (
                  <span key={big} aria-disabled className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white" style={{ background: INK }}>
                    <img src={src} alt="" className="h-6 w-6 object-contain" loading="lazy" />
                    <span className="leading-tight"><span className="block text-[10px] font-medium text-white/70">{small}</span><span className="block text-[14px] font-bold">{big}</span></span>
                  </span>
                ))}
              </motion.div>
            </div>

            <PhonePreview />
          </div>
        </section>

        {/* Until then — use the web app */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24 grid gap-12 md:grid-cols-[.9fr_1.1fr] items-center">
            <div>
              <SectionHead align="left" eyebrow="Until then" title="Use zyphix.in in your browser — today." sub="You don't need to wait for the app. The full Zyphix experience already runs in Safari and Chrome, and you can pin it to your home screen in three taps." />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/now" className={btnPrimary} style={{ background: G }}>Order groceries <ArrowRight size={16} /></Link>
                <Link href="/eats" className={btnSecondary}><UtensilsCrossed size={16} className="text-orange-500" /> Order food</Link>
              </div>
            </div>
            <ol className="grid gap-4">
              {BROWSER_STEPS.map((s, i) => (
                <li key={s.t} className="flex gap-5 rounded-3xl border border-gray-200 bg-white p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><s.Icon size={20} /></span>
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

        {/* Features */}
        <section className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <SectionHead eyebrow="What's in the app" title="Everything local, built for your phone." sub="The same neighbourhood network as the website — plus the things only a native app can do well." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.t} className="rounded-3xl border border-gray-200 bg-white p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><f.Icon size={20} /></span>
                <h3 className="mt-4 text-[16.5px] font-extrabold text-gray-900">{f.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-24">
          <div className="flex flex-col items-start gap-5 rounded-[32px] border border-emerald-100 p-8 md:flex-row md:items-center md:justify-between md:p-12" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 60%)' }}>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-gray-900 border border-gray-200"><Smartphone size={22} /></span>
              <div>
                <h3 className="text-[20px] font-extrabold text-gray-900" style={{ fontFamily: HEAD_FONT }}>Want to be told the day we launch?</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-gray-600">Scroll up and leave your email — or just start ordering on the web right now.</p>
              </div>
            </div>
            <Link href="/" className={btnSecondary}>Back to zyphix.in <ArrowRight size={16} /></Link>
          </div>
        </section>
      </div>
    </SitePage>
  );
}

export default AppComingSoon;
