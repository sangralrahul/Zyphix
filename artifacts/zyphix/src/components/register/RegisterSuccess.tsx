import React, { useMemo } from 'react';
import { motion } from '@/lib/motion';
import { Check, Mail } from 'lucide-react';
import { BgVideo, isStatic } from '@/ui/cinema';
import { TRACKS, type Track } from './RegisterShell';

/* ────────────────────────────────────────────────────────────────────────────
   "Thanks for registering" — shared celebration for every partner form.
   Sequence: ring draws → check draws → shock-wave rings + particle burst →
   headline rises word by word → next-steps timeline fills in one by one.
──────────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;
const BURST = ['#0DA366', '#34D399', '#6EE7B7', '#FBBF24', '#FFFFFF', '#A7F3D0'];

function Burst({ accent }: { accent: string }) {
  const parts = useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2 + (i % 2 ? 0.12 : -0.08);
    const d = 120 + (i % 5) * 34;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 4 + (i % 4) * 2, c: i % 7 === 0 ? accent : BURST[i % BURST.length], r: i % 3 === 0, delay: 0.95 + (i % 6) * 0.015 };
  }), [accent]);
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {parts.map((p, i) => (
        <motion.span key={i} className="absolute block" style={{ width: p.s, height: p.r ? p.s * 2.4 : p.s, marginLeft: -p.s / 2, marginTop: -p.s / 2, background: p.c, borderRadius: p.r ? 2 : 999 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{ x: p.x, y: p.y + 30, opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.8], rotate: p.r ? 220 : 0 }}
          transition={{ duration: 1.4, delay: p.delay, ease: [0.16, 1, 0.3, 1], times: [0, 0.15, 0.7, 1] }} />
      ))}
    </div>
  );
}

function Seal({ accent }: { accent: string }) {
  const stat = isStatic();
  return (
    <div className="relative mx-auto h-[120px] w-[120px]">
      {!stat && [0, 1, 2].map(i => (
        <motion.span key={i} aria-hidden className="absolute inset-0 rounded-full" style={{ border: `2px solid ${accent}` }}
          initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
          transition={{ duration: 1.6, delay: 0.95 + i * 0.22, ease: 'easeOut' }} />
      ))}
      {!stat && <Burst accent={accent} />}
      <motion.div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${accent} 55%, white), ${accent} 72%)`, boxShadow: `0 20px 60px -10px ${accent}` }}
        initial={stat ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 1.12, 1], opacity: 1 }} transition={{ duration: 0.7, delay: 0.55, ease: EASE }} />
      <svg viewBox="0 0 120 120" className="absolute inset-0">
        <motion.circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round"
          initial={stat ? false : { pathLength: 0, rotate: -90 }} animate={{ pathLength: 1, rotate: -90 }} style={{ originX: '50%', originY: '50%' }}
          transition={{ duration: 0.75, ease: EASE }} />
        <motion.path d="M38 62 L53 76 L83 45" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
          initial={stat ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.95, ease: 'easeOut' }} />
      </svg>
    </div>
  );
}

function Rise({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={isStatic() ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

export function RegisterSuccess({ track, name, headline, message, nextSteps, summary, actions }: {
  track: Track;
  name?: string;
  /** e.g. "Sharma Dhaba is registered." — defaults to a thank-you line */
  headline?: string;
  message: React.ReactNode;
  nextSteps: string[];
  summary?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const t = TRACKS[track];
  const first = (name || '').trim().split(/\s+/)[0];
  const words = (headline || `Thanks for registering${first ? `, ${first}` : ''}.`).split(' ');
  const stat = isStatic();
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <div>
      {/* ── Celebration panel ── */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-[#05080E] px-6 pb-10 pt-12 text-center text-white sm:px-10 sm:pt-16">
        <BgVideo clip={t.clip} dim={0.7} />
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(60% 55% at 50% 30%, ${t.accent}55, transparent 70%)` }} />
        <div className="relative">
          <Seal accent={t.accent} />
          <h2 className="mx-auto mt-9 max-w-[18ch] text-[32px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[44px]">
            {words.map((w, i) => (
              <React.Fragment key={i}>
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <motion.span className="inline-block" initial={stat ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 1.25 + i * 0.06, ease: EASE }}>
                    {i === 0 ? <span className="font-serif-accent" style={{ color: '#6EE7B7' }}>{w}</span> : w}
                  </motion.span>
                </span>{i < words.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </h2>
          <Rise delay={1.6} className="mx-auto mt-4 max-w-[52ch] text-[15.5px] leading-[1.65] text-white/75">{message}</Rise>
          <Rise delay={1.75} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/85 ring-1 ring-white/15 backdrop-blur-md">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: '#34D399' }} /><span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#34D399' }} /></span>
            Application received · {t.kicker.split('·')[0].trim()}
          </Rise>
        </div>
      </section>

      {/* ── What happens next ── */}
      <Rise delay={1.9} className="mt-6 rounded-[24px] border border-gray-200 bg-white p-6 sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-500">What happens next</p>
        <ol className="relative mt-5">
          {[{ s: 'Application received', done: true }, ...nextSteps.map(s => ({ s, done: false }))].map((x, i, arr) => (
            <motion.li key={x.s} className="relative flex gap-4 pb-6 last:pb-0"
              initial={stat ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 2.0 + i * 0.12, ease: EASE }}>
              {i < arr.length - 1 && <span aria-hidden className="absolute left-[13px] top-7 h-[calc(100%-22px)] w-px" style={{ background: i === 0 ? t.accent : '#E5E7EB' }} />}
              <span className="relative mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                style={x.done ? { background: t.accent, color: '#fff' } : i === 1 ? { background: '#fff', color: t.accent, boxShadow: `inset 0 0 0 2px ${t.accent}` } : { background: '#F3F4F6', color: '#6B7280' }}>
                {x.done ? <Check size={14} strokeWidth={3} /> : i + 1}
                {i === 1 && !stat && <motion.span aria-hidden className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 2px ${t.accent}` }} animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 2.6 }} />}
              </span>
              <div className="pt-0.5">
                <p className={`text-[15px] ${x.done ? 'font-semibold text-gray-900' : i === 1 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{x.s}</p>
                {x.done && <p className="mt-0.5 text-[13px] text-gray-500">Just now</p>}
                {i === 1 && <p className="mt-0.5 text-[13px]" style={{ color: t.accent }}>Up next</p>}
              </div>
            </motion.li>
          ))}
        </ol>
      </Rise>

      {summary && <Rise delay={2.3} className="mt-6">{summary}</Rise>}

      <Rise delay={2.45} className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="inline-flex items-center gap-2 text-[13.5px] text-gray-500"><Mail size={15} />Questions? <a href="mailto:partnerships@zyphix.in" className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">partnerships@zyphix.in</a></p>
        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
      </Rise>
    </div>
  );
}

/** Pill buttons sized for the success footer. */
export function SuccessButton({ children, onClick, primary = false, accent = '#0DA366' }: { children: React.ReactNode; onClick: () => void; primary?: boolean; accent?: string }) {
  return (
    <motion.button type="button" onClick={onClick} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
      className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-[14.5px] font-semibold transition ${primary ? 'text-white shadow-[0_10px_30px_-10px_rgba(13,163,102,.6)]' : 'border border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}
      style={primary ? { background: accent } : undefined}>
      {children}
    </motion.button>
  );
}
