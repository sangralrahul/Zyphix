import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from '@/lib/motion';
import { BadgeCheck, Check } from 'lucide-react';
import { isStatic, EASE, G } from '@/ui/cinema';

/* ────────────────────────────────────────────────────────────────────────────
   Service version of the live order card: Booked → Pro assigned → On the way
   → Started → Done. Cycles while in view; frozen on "On the way" when static.
   Obviously a mock status card (no real booking data).
──────────────────────────────────────────────────────────────────────────── */

const STAGES = [
  { t: 'Booked', s: 'Visit charge confirmed' },
  { t: 'Pro assigned', s: 'Verified member · ID checked' },
  { t: 'On the way', s: 'Arriving in your slot' },
  { t: 'Job started', s: 'Scope agreed at your door' },
  { t: 'Done', s: '7-day work guarantee active' },
];

export function LiveJob({ service = 'AC Service', slot = 'Today, 5:00 PM', className = '' }: { service?: string; slot?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [s, setS] = useState(isStatic() ? 2 : 0);
  useEffect(() => {
    if (isStatic() || !inView) return;
    const id = window.setInterval(() => setS(v => (v + 1) % STAGES.length), 2000);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className={`w-full max-w-[330px] rounded-3xl bg-white/95 p-5 text-gray-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,.55)] ring-1 ring-white/40 backdrop-blur-xl ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-gray-500">{service} · {slot}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700">
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
          Live
        </span>
      </div>
      <div className="relative mt-3 h-[52px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={s} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="absolute inset-x-0">
            <p className="text-[22px] font-semibold leading-tight tracking-[-0.03em]">{STAGES[s].t}</p>
            <p className="text-[12.5px] text-gray-500">{STAGES[s].s}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {STAGES.map((_, i) => (
          <div key={i} className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <motion.div className="h-full rounded-full" style={{ background: G }} initial={false} animate={{ width: i <= s ? '100%' : '0%' }} transition={{ duration: 0.5, ease: EASE }} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[13px] font-semibold text-white" style={{ background: `linear-gradient(135deg, #19C27C, ${G})` }}>
          <BadgeCheck size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">Your verified pro</p>
          <p className="truncate text-[12px] text-gray-500">ID &amp; police-verified · tracked to your door</p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={14} strokeWidth={2.5} /></span>
      </div>
    </div>
  );
}
