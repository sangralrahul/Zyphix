import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle2, Smartphone, Share, PlusSquare, MoreVertical, Bell, MapPin, Wifi } from 'lucide-react';
import { G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';
import { apiFetch } from '@/lib/api';
import { CONTAINER, fade } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   App section — early-access form (same /api/notify contract), store badges
   ("coming soon") and add-to-home-screen steps.
──────────────────────────────────────────────────────────────────────────── */

export function EarlyAccessForm() {
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

  if (state === 'done') {
    return (
      <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-[14px] font-bold text-white">
        <CheckCircle2 size={18} /> You're on the list — see you at launch.
      </div>
    );
  }
  return (
    <>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email" required value={email} onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
            placeholder="you@email.com" aria-label="Email address"
            className="w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-[14.5px] text-gray-900 outline-none transition focus:ring-4 focus:ring-emerald-100"
            style={{ borderColor: state === 'error' ? '#EF4444' : '#E5E7EB' }}
          />
        </label>
        <button type="submit" disabled={state === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[14.5px] font-bold text-white disabled:opacity-70" style={{ background: G }}>
          {state === 'loading' ? 'Joining…' : <>Notify me <ArrowRight size={16} /></>}
        </button>
      </form>
      {state === 'error' && <p className="mt-2 text-[13px] font-semibold text-red-500">Please enter a valid email address.</p>}
      <p className="mt-3 text-[12.5px] text-gray-500">No spam. One email when we launch in your area.</p>
    </>
  );
}

const A2HS = [
  { os: 'iPhone / Safari', steps: [<>Open <b>zyphix.in</b> in Safari</>, <>Tap the <Share size={12} className="inline -mt-0.5" /> Share button</>, <>Choose <b>Add to Home Screen</b></>] },
  { os: 'Android / Chrome', steps: [<>Open <b>zyphix.in</b> in Chrome</>, <>Tap the <MoreVertical size={12} className="inline -mt-0.5" /> menu</>, <>Choose <b>Add to Home screen</b> / <b>Install app</b></>] },
];

export function AppSection() {
  return (
    <section id="app" className={`${CONTAINER} scroll-mt-20 py-20 md:py-24`}>
      <div className="grid gap-8 overflow-hidden rounded-[32px] border border-emerald-100 lg:grid-cols-[1.05fr_.95fr]" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 60%)' }}>
        <motion.div {...fade(0)} className="p-8 md:p-12">
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Early access</p>
          <h2 className="mt-3 text-[1.9rem] font-black leading-[1.08] tracking-[-0.03em] text-gray-900 md:text-[2.5rem]" style={{ fontFamily: HEAD_FONT }}>
            Be first in your neighbourhood.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
            We're rolling out neighbourhood by neighbourhood across India. Leave your email and we'll tell you the moment Zyphix goes live near you — plus launch-day perks.
          </p>
          <EarlyAccessForm />

          <div className="mt-8 border-t border-emerald-100 pt-6">
            <p className="flex items-center gap-2 text-[13px] font-bold text-gray-900"><Smartphone size={15} className="text-emerald-700" /> The Zyphix app is coming to iOS & Android</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[['/images/appstore.webp', 'Coming soon on the', 'App Store'], ['/images/googleplay.webp', 'Coming soon on', 'Google Play']].map(([src, small, big]) => (
                <Link key={big} href="/app" className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white transition hover:opacity-90" style={{ background: INK }}>
                  <img src={src} alt="" className="h-6 w-6 object-contain" loading="lazy" />
                  <span className="leading-tight"><span className="block text-[10px] font-medium text-white/70">{small}</span><span className="block text-[14px] font-bold">{big}</span></span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fade(.1)} className="border-t border-emerald-100 bg-white p-8 md:p-10 lg:border-l lg:border-t-0">
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-gray-400">Use it today</p>
          <h3 className="mt-2 text-[22px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>Add zyphix.in to your home screen.</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-600">Everything already works in your browser. Pin it for a full-screen, app-like experience in three taps.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {A2HS.map(a => (
              <div key={a.os} className="rounded-2xl border border-gray-200 p-4">
                <p className="text-[13px] font-extrabold text-gray-900">{a.os}</p>
                <ol className="mt-3 space-y-2">
                  {a.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-snug text-gray-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-black text-white" style={{ background: G }}>{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <ul className="mt-5 grid gap-2 text-[12.5px] text-gray-600 sm:grid-cols-3">
            {[[<PlusSquare size={14} />, 'Full-screen, no browser bar'], [<Bell size={14} />, 'Order updates as you shop'], [<MapPin size={14} />, 'Saved addresses & reorders']].map(([ic, l]) => (
              <li key={l as string} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2"><span className="text-emerald-700">{ic}</span>{l as string}</li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-[11.5px] text-gray-400"><Wifi size={12} /> Works on any phone with a modern browser. No download needed.</p>
        </motion.div>
      </div>
    </section>
  );
}
