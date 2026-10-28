import { apiFetch } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import {
  Mail, ArrowRight, Check, Bell, Zap, MapPin, Tag, UtensilsCrossed, RefreshCw,
  Smartphone, Globe, Share, PlusSquare, ShoppingBag, Clock,
} from 'lucide-react';
import { G, INK } from '@/components/layout/SiteChrome';
import { Reveal, GlowButton, GhostButton } from '@/ui/cinema';
import { Accent } from '@/ui/motion2';
import { VIDEOS } from '@/data/media';
import { InnerPage, InnerHero, SectionIntro, Band, panel, iconChip, h3, body } from './home/Inner';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix mobile app — coming soon (zyphix.in/app)
   Video hero with countdown + notify form and a phone preview, then the
   "use it in your browser" steps and the feature list.
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
  return diff === 0 ? [] : [
    { v: p(d), l: 'Days' },
    { v: p(h), l: 'Hours' },
    { v: p(m), l: 'Minutes' },
    { v: p(s), l: 'Seconds' },
  ];
}

const FEATURES = [
  { Icon: Zap, t: '10-minute grocery delivery', d: 'Real shelves from stores near you, packed and moving in minutes.' },
  { Icon: UtensilsCrossed, t: 'Food from local kitchens', d: 'Neighbourhood restaurants, cafés and cloud kitchens on fair commissions.' },
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
    <div className="mx-auto w-[270px]">
      <div className="rounded-[40px] border border-gray-200 bg-white p-2.5 shadow-[0_24px_60px_rgba(11,18,32,.12)]">
        <div className="relative overflow-hidden rounded-[32px] bg-gray-50">
          <div className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full" style={{ background: INK }} />
          <div className="px-4 pb-4 pt-10 text-white" style={{ background: G }}>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-semibold tracking-[-0.02em]">Zyphix</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold"><Clock size={10} /> 10 min</span>
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
    </div>
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
    <InnerPage title="Mobile app">
      <div data-testid="app-coming-soon">
        <InnerHero
          clip={VIDEOS.phoneOrder}
          height="min-h-[100svh]"
          kicker="Mobile app · Coming soon"
          parts={['The Zyphix app is coming to', { accent: 'iOS & Android.', green: true }]}
          sub="Groceries in 10 minutes, food from local kitchens and trusted home services in one native app. Leave your email and we will tell you the moment it is live."
          aside={<PhonePreview />}
        >
          {/* Countdown (hidden once the target date has passed) */}
          {countdown.length > 0 && (
            <div className="mb-7 grid max-w-[440px] grid-cols-4 gap-2.5">
              {countdown.map(c => (
                <div key={c.l} className="rounded-2xl border border-white/15 bg-white/[.08] px-2 py-3.5 text-center backdrop-blur-md">
                  <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-white sm:text-[32px]">{c.v}</p>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[.12em] text-white/55">{c.l}</p>
                </div>
              ))}
            </div>
          )}

          {/* Notify form */}
          <div className="max-w-[520px]">
            {submitted ? (
              <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20"><Check size={15} strokeWidth={3} /></span>
                <div>
                  <p className="text-[14px] font-semibold">You're on the launch list!</p>
                  <p className="text-[12.5px] text-white/85">We'll email you the day the app goes live.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Email address</span>
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    data-testid="notify-email-input"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@email.com"
                    className="h-[52px] w-full rounded-full border bg-white pl-11 pr-4 text-[15px] text-gray-900 outline-none transition focus:ring-4 focus:ring-emerald-300/40"
                    style={{ borderColor: error ? '#EF4444' : '#E5E7EB' }}
                  />
                </label>
                <button
                  data-testid="notify-submit-button"
                  type="submit" disabled={loading}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-7 text-[15.5px] font-semibold text-white shadow-[0_12px_40px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5 disabled:opacity-70"
                  style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
                  {loading ? 'Sending…' : <>Notify me <ArrowRight size={16} /></>}
                </button>
              </form>
            )}
            {error && <p className="mt-2 text-[13px] font-semibold text-red-300">{error}</p>}
            <p className="mt-3 text-[13px] text-white/55">No spam. One email when the app launches.</p>
          </div>

          {/* Store badges */}
          <div className="mt-7 flex flex-wrap gap-3">
            {[['/images/appstore.webp', 'Coming soon on the', 'App Store'], ['/images/googleplay.webp', 'Coming soon on', 'Google Play']].map(([src, small, big]) => (
              <span key={big} aria-disabled className="inline-flex h-[52px] items-center gap-3 rounded-xl border border-white/15 bg-white/[.06] px-4 text-white">
                <img src={src} alt="" className="h-[22px] w-[22px] object-contain" loading="lazy" />
                <span className="leading-tight"><span className="block text-[10px] font-medium text-white/60">{small}</span><span className="block text-[15px] font-semibold tracking-[-0.01em]">{big}</span></span>
              </span>
            ))}
          </div>
        </InnerHero>

        {/* Until then — use the web app */}
        <Band tone="soft">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionIntro kicker="Until then" title={<>Use zyphix.in in your browser, <Accent green>today</Accent>.</>} sub="You don't need to wait for the app. The full Zyphix experience already runs in Safari and Chrome, and you can pin it to your home screen in three taps." />
              <Reveal delay={0.15} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <GlowButton href="/now">Order groceries <ArrowRight size={17} /></GlowButton>
                <GhostButton href="/eats" light={false}><UtensilsCrossed size={16} className="text-orange-500" /> Order food</GhostButton>
              </Reveal>
            </div>
            <ol className="grid gap-4 lg:col-span-7">
              {BROWSER_STEPS.map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 0.06} y={20} className={`${panel} flex gap-5 p-7`}>
                  <span className={iconChip}><s.Icon size={20} /></span>
                  <div>
                    <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gray-400">Step {i + 1}</p>
                    <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.025em] text-gray-900">{s.t}</h3>
                    <p className={`mt-2 ${body}`}>{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Band>

        {/* Features */}
        <Band>
          <SectionIntro kicker="What's in the app" title={<>Everything local, built for <Accent green>your phone</Accent>.</>} sub="The same neighbourhood network as the website, plus the things only a native app does well." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.05} y={20} className={`${panel} p-7`}>
                <span className={iconChip}><f.Icon size={20} /></span>
                <h3 className={`mt-6 ${h3}`}>{f.t}</h3>
                <p className={`mt-3 ${body}`}>{f.d}</p>
              </Reveal>
            ))}
          </div>
        </Band>

        {/* Closing CTA */}
        <Band tone="dark">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-5">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[.06] text-white ring-1 ring-white/10 sm:inline-flex"><Smartphone size={22} /></span>
              <div>
                <h2 className="max-w-[18ch] text-balance text-[36px] font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-[46px] md:text-[56px]">Want to hear the day <Accent green>we launch</Accent>?</h2>
                <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-white/65">Leave your email at the top of this page, or start ordering on the web right now.</p>
              </div>
            </div>
            <GhostButton href="/" className="shrink-0">Back to zyphix.in <ArrowRight size={17} /></GhostButton>
          </div>
        </Band>
      </div>
    </InnerPage>
  );
}

export default AppComingSoon;
