import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, MapPin, Receipt, ShieldCheck, CalendarClock } from 'lucide-react';
import { Chip } from '@/ui/kit';
import { EASE, G, isStatic } from '@/ui/cinema';
import { PHOTOS } from '@/data/media';
import { DAYS, TIME_SLOTS, metaFor, type Day, type Service } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Booking panel — service → day (Today / Tomorrow) → slot → address → confirm.
   State lives in the page so the same panel can render in the sticky desktop
   column and inline on mobile.
──────────────────────────────────────────────────────────────────────────── */

export type BookingState = {
  activeService: Service | null;
  day: Day; setDay: (d: Day) => void;
  slot: string | null; setSlot: (s: string | null) => void;
  address: string; setAddress: (a: string) => void;
  booked: boolean; onBook: () => void;
};

export function BookingPanel({ id, state }: { id: string; state: BookingState }) {
  const { activeService, day, setDay, slot, setSlot, address, setAddress, booked, onBook } = state;
  const stat = isStatic();
  const anim = stat ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.25, ease: EASE } };

  return (
    <div id={id} className="scroll-mt-24 overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03),0_24px_60px_-30px_rgba(11,15,25,.25)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-gray-900">Your booking</h2>
        {activeService ? <Chip tone="green">Step {slot ? 3 : 2} of 3</Chip> : <Chip>Step 1 of 3</Chip>}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {activeService ? (
          <motion.div key={activeService.id} {...anim}>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FAFAFA] p-2.5">
              <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img src={metaFor(activeService).photo.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-semibold text-gray-900">{activeService.title}</p>
                <p className="truncate text-[12.5px] text-gray-500">{activeService.category} · next slot {activeService.nextSlot}</p>
              </div>
            </div>

            {/* Day tabs */}
            <div className="mt-4 flex rounded-xl bg-gray-100 p-1">
              {DAYS.map(d => {
                const on = day === d;
                return (
                  <button key={d} type="button" onClick={() => { setDay(d); setSlot(null); }} aria-pressed={on}
                    className={`relative flex-1 rounded-lg py-2 text-[13px] font-semibold transition ${on ? 'bg-white text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,.08)]' : 'text-gray-500 hover:text-gray-700'}`}>
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(s => {
                const on = slot === s;
                return (
                  <button key={s} type="button" onClick={() => setSlot(s)} aria-pressed={on}
                    className={`h-10 rounded-xl border text-[12.5px] font-medium transition active:scale-95 ${
                      on ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}>
                    {s.replace(':00', '')}
                  </button>
                );
              })}
            </div>

            <label className="mt-4 block">
              <span className="text-[12.5px] font-medium text-gray-700">Address <span className="font-normal text-gray-400">(optional)</span></span>
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
                <MapPin size={14} className="shrink-0 text-gray-400" />
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Flat, street, locality" className="h-11 w-full bg-transparent text-[13.5px] text-gray-900 outline-none placeholder:text-gray-400" />
              </span>
            </label>

            <dl className="mt-4 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><dt className="text-gray-500">Service</dt><dd className="font-medium text-gray-900">{activeService.title}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Slot</dt><dd className="font-medium text-gray-900">{slot ? `${day}, ${slot}` : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Visit charge</dt><dd className="inline-flex items-center gap-1 text-gray-900"><Receipt size={13} className="text-gray-400" /> Shown before you confirm</dd></div>
            </dl>

            <div className="relative mt-4">
              <AnimatePresence mode="wait" initial={false}>
                {booked ? (
                  <motion.div key="done" {...(stat ? {} : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } })}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white" style={{ background: G }}><Check size={20} strokeWidth={3} /></span>
                    <div>
                      <p className="text-[14px] font-semibold text-emerald-900">Booking confirmed</p>
                      <p className="text-[12.5px] text-emerald-800/80">{activeService.title} · {day}, {slot}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="cta" {...(stat ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } })}>
                    <button type="button" onClick={onBook} disabled={!slot}
                      className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full text-[14.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(13,163,102,.6)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                      style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
                      {slot ? 'Confirm booking' : 'Choose a time slot'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-2.5 text-center text-[12px] text-gray-500">Free cancellation up to 1 hour before your slot.</p>
          </motion.div>
        ) : (
          <motion.div key="empty" {...(stat ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } })} className="mt-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900" style={{ aspectRatio: '16/9' }}>
              <img src={PHOTOS.cleaning[1].src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/90 via-[#05080E]/30 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><CalendarClock size={17} /></span>
                <p className="mt-2 text-[15px] font-semibold tracking-[-0.01em]">Pick a service to start</p>
                <p className="text-[12.5px] text-white/70">Slots for today and tomorrow appear here.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-[13px] text-gray-600">
              {[['Price shown before you confirm', Receipt], ['Reschedule free', CalendarClock], ['ID & police-verified pros', ShieldCheck]].map(([t, Icon]) => {
                const I = Icon as typeof Receipt;
                return <li key={t as string} className="flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><I size={14} /></span>{t as string}</li>;
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
