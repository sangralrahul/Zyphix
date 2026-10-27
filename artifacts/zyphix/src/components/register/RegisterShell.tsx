import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Check, LifeBuoy, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { BgVideo, isStatic } from '@/ui/cinema';
import { SplitHeadline } from '@/ui/motion2';
import { VIDEOS, type Clip } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   Shared frame for every partner registration (store, restaurant, delivery, service).
   Desktop: cinematic video rail on the left (headline + live step progress), form on the right.
   Mobile: compact video header with a segmented progress bar, form below.
   Field styling comes from the scoped `.zx-reg` rules in index.css.
──────────────────────────────────────────────────────────────────────────── */

export type Track = 'store' | 'restaurant' | 'delivery' | 'service';

const EASE = [0.22, 1, 0.36, 1] as const;

export const TRACKS: Record<Track, {
  label: string; kicker: string; clip: Clip; accent: string;
  headline: (string | { accent: string; green?: boolean })[]; sub: string;
}> = {
  store: {
    label: 'Register your store', kicker: 'Zyphix Now · Store partner', clip: VIDEOS.merchant, accent: '#0DA366',
    headline: ['Put your shelves', { accent: 'online', green: true }, 'in minutes.'],
    sub: 'List your kirana, pharmacy or speciality store on Zyphix Now. Your prices, your stock, riders from your area.',
  },
  restaurant: {
    label: 'Register your restaurant', kicker: 'Zyphix Eats · Restaurant partner', clip: VIDEOS.chefTeam, accent: '#E11D48',
    headline: ['Your kitchen,', { accent: 'every', green: true }, 'table nearby.'],
    sub: 'Restaurants, cafés, dhabas and home kitchens list their own menus at their own prices. We bring the orders and the riders.',
  },
  delivery: {
    label: 'Become a delivery partner', kicker: 'Zyphix · Delivery partner', clip: VIDEOS.rider, accent: '#0DA366',
    headline: ['Ride your', { accent: 'own', green: true }, 'neighbourhood.'],
    sub: 'Short runs a few streets away, payouts shown before you accept, and hours you choose.',
  },
  service: {
    label: 'Join Zyphix Book', kicker: 'Zyphix Book · Service professional', clip: VIDEOS.electrician, accent: '#7C3AED',
    headline: ['Your skill,', { accent: 'booked', green: true }, 'by neighbours.'],
    sub: 'Electricians, plumbers, cleaners, cooks and more. Fixed quotes up front, bookings in your area, verified profile.',
  },
};

const TRUST = [
  { icon: <Wallet size={15} />, t: 'Free to apply' },
  { icon: <ShieldCheck size={15} />, t: 'Reviewed by a real person' },
  { icon: <LifeBuoy size={15} />, t: 'Onboarding manager' },
];

function StepRail({ steps, step, accent }: { steps: string[]; step: number; accent: string }) {
  return (
    <ol className="relative mt-10 space-y-1">
      {steps.map((s, i) => {
        const done = i < step, current = i === step;
        return (
          <li key={s} className="relative flex items-center gap-4 py-2.5">
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute left-[15px] top-[38px] h-[calc(100%-20px)] w-px bg-white/15">
                <motion.span className="absolute inset-x-0 top-0 block w-px origin-top" style={{ background: accent, height: '100%' }}
                  initial={false} animate={{ scaleY: done ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} />
              </span>
            )}
            <span className="relative flex h-[31px] w-[31px] shrink-0 items-center justify-center">
              {current && !isStatic() && (
                <motion.span aria-hidden className="absolute inset-0 rounded-full" style={{ background: accent }}
                  animate={{ scale: [1, 1.7], opacity: [0.45, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }} />
              )}
              <motion.span className="relative flex h-full w-full items-center justify-center rounded-full text-[12.5px] font-semibold"
                initial={false}
                animate={{ background: done || current ? accent : 'rgba(255,255,255,0.08)', color: done || current ? '#fff' : 'rgba(255,255,255,0.55)' }}
                style={{ boxShadow: done || current ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,.18)' }}>
                {done ? <Check size={15} strokeWidth={2.6} /> : i + 1}
              </motion.span>
            </span>
            <span className={`text-[15px] transition-colors ${current ? 'font-semibold text-white' : done ? 'text-white/80' : 'text-white/45'}`}>{s}</span>
            {current && <span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-medium text-white/70 ring-1 ring-white/15">Now</span>}
          </li>
        );
      })}
    </ol>
  );
}

function MobileProgress({ steps, step, accent }: { steps: string[]; step: number; accent: string }) {
  return (
    <div className="mt-5">
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <span key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <motion.span className="block h-full origin-left rounded-full" style={{ background: accent }}
              initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-[12.5px] text-white/70">
        Step {Math.min(step + 1, steps.length)} of {steps.length} · <span className="font-semibold text-white">{steps[Math.min(step, steps.length - 1)]}</span>
      </p>
    </div>
  );
}

export function RegisterShell({ track, steps, step, done = false, children }: {
  track: Track; steps: string[]; step: number; done?: boolean; children: React.ReactNode;
}) {
  const [, setLoc] = useLocation();
  const t = TRACKS[track];
  React.useEffect(() => { document.title = `${t.label} · Zyphix Partners`; }, [t.label]);
  const style = { ['--acc' as string]: t.accent } as React.CSSProperties;

  return (
    <div className="zx-reg min-h-screen bg-[#F6F7F9] text-gray-900 lg:grid lg:grid-cols-[minmax(380px,40%)_1fr]" style={style}>
      {/* ── Video rail (desktop) / header (mobile) ── */}
      <aside className="relative isolate overflow-hidden bg-[#05080E] text-white lg:sticky lg:top-0 lg:h-screen">
        <BgVideo clip={t.clip} dim={0.45} priority />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.55) 0%, rgba(5,8,14,.35) 40%, rgba(5,8,14,.92) 100%)' }} />
        <div aria-hidden className="absolute -left-24 bottom-0 h-[420px] w-[420px] rounded-full opacity-40 blur-[110px]" style={{ background: t.accent }} />

        <div className="relative flex h-full flex-col px-5 pb-6 pt-5 sm:px-8 lg:px-12 lg:pb-10 lg:pt-9">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setLoc('/')} className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-white/80 transition hover:text-white">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <ZyphixLogo size={26} ixColor="#FFFFFF" />
            </button>
            <a href="mailto:partnerships@zyphix.in" className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] font-medium text-white/85 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/15">Need help?</a>
          </div>

          <div className="mt-8 lg:mt-auto">
            <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#6EE7B7' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.accent }} />{t.kicker}
            </p>
            <SplitHeadline as="h1" parts={t.headline}
              className="mt-4 max-w-[14ch] text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[52px]" />
            <p className="mt-4 hidden max-w-[42ch] text-[15.5px] leading-[1.6] text-white/70 sm:block">{t.sub}</p>
          </div>

          <div className="lg:hidden"><MobileProgress steps={steps} step={done ? steps.length : step} accent={t.accent} /></div>
          <div className="hidden lg:block"><StepRail steps={steps} step={done ? steps.length : step} accent={t.accent} /></div>

          <div className="mt-8 hidden flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-[13px] text-white/65 lg:flex">
            {TRUST.map(x => <span key={x.t} className="inline-flex items-center gap-2"><span className="text-emerald-300">{x.icon}</span>{x.t}</span>)}
          </div>
        </div>
      </aside>

      {/* ── Form side ── */}
      <main className="relative min-w-0">
        <div className="mx-auto w-full max-w-[860px] px-4 pb-24 pt-6 sm:px-8 lg:px-12 lg:pt-14">
          {!done && (
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-[13px] font-medium text-gray-500">
                <span className="inline-flex items-center gap-1.5"><Sparkles size={14} style={{ color: t.accent }} />{t.label}</span>
              </p>
              <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="text-[13px] tabular-nums text-gray-500">Step {step + 1} of {steps.length}</motion.p>
              </AnimatePresence>
            </div>
          )}
          {done ? children : (
            <div className="zx-reg-card relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white px-5 pb-8 pt-9 shadow-[0_1px_2px_rgba(16,24,40,.04),0_30px_70px_-40px_rgba(16,24,40,.28)] sm:px-10 sm:pb-10 sm:pt-11">
              <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gray-100">
                <motion.div className="h-full origin-left" style={{ background: t.accent }}
                  initial={false} animate={{ scaleX: (step + 1) / steps.length }} transition={{ duration: 0.7, ease: EASE }} />
              </div>
              {children}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
