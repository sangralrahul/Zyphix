import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, CalendarCheck, Wrench, Zap, Sparkles, Paintbrush, Snowflake, Droplets, Hammer, ChefHat, Truck,
  ShieldCheck, BadgeIndianRupee, MapPin, Clock, ArrowRight, type LucideIcon,
} from 'lucide-react';
import { services } from '@/data/mockData';
import { usePartners, tagList, type PartnerListing } from '@/lib/partners';
import { Chip } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — verified local home-service professionals
   Light, green accent, bold service tiles, sticky booking panel.
──────────────────────────────────────────────────────────────────────────── */

const G = '#0DA366';
const G2 = '#047857';
const HEAD: React.CSSProperties = { fontFamily: "'Outfit', sans-serif" };

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

type Service = typeof services[0];

/* Icon + colour per service (keyed by id, falls back on title) */
const SERVICE_META: Record<string, { icon: LucideIcon; bg: string; fg: string }> = {
  sv1:  { icon: Wrench,     bg: '#EFF6FF', fg: '#2563EB' },
  sv2:  { icon: Zap,        bg: '#FEF3C7', fg: '#D97706' },
  sv3:  { icon: Sparkles,   bg: '#ECFDF5', fg: '#0DA366' },
  sv4:  { icon: Paintbrush, bg: '#FDF2F8', fg: '#DB2777' },
  sv5:  { icon: Snowflake,  bg: '#ECFEFF', fg: '#0891B2' },
  sv6:  { icon: Droplets,   bg: '#EFF6FF', fg: '#0284C7' },
  sv7:  { icon: Hammer,     bg: '#FFF7ED', fg: '#EA580C' },
  sv8:  { icon: ChefHat,    bg: '#FEF2F2', fg: '#DC2626' },
  sv9:  { icon: Truck,      bg: '#F5F3FF', fg: '#7C3AED' },
  sv10: { icon: Wrench,     bg: '#F1F5F9', fg: '#475569' },
};
const metaFor = (s: Service) => SERVICE_META[s.id] || { icon: Wrench, bg: '#F1F5F9', fg: '#475569' };

const BOOKING_PANEL_ID = 'booking-panel';

/** Match a professional's category (and skills) to a service tile; falls back to the first service. */
function serviceForPro(p: PartnerListing): Service {
  const terms = [p.category, ...tagList(p.tags || '')].map(t => t.trim().toLowerCase()).filter(Boolean);
  for (const term of terms) {
    const hit = services.find(s => {
      const title = s.title.toLowerCase(), cat = s.category.toLowerCase();
      return title === term || cat === term || title.includes(term) || term.includes(title) || cat.includes(term) || term.includes(cat);
    });
    if (hit) return hit;
  }
  return services[0];
}

const proInitials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || '•';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .45, ease: 'easeOut' as const, delay },
});

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const STEPS = [
  { icon: Wrench,        title: 'Pick a service',  desc: 'Choose what you need help with — repairs, cleaning, appliances and more.' },
  { icon: Clock,         title: 'Choose a slot',   desc: 'Select a time today or tomorrow that suits you.' },
  { icon: CalendarCheck, title: 'Confirm',         desc: 'A verified local professional is assigned and you get the details.' },
];

const TRUST = [
  { icon: ShieldCheck,       title: 'Verified professionals', desc: 'Every pro is identity- and background-checked before joining.' },
  { icon: BadgeIndianRupee,  title: 'Transparent pricing',    desc: 'Know the price before you book. No hidden charges.' },
  { icon: MapPin,            title: 'Hyperlocal',             desc: 'Professionals from your own neighbourhood, not a call centre.' },
  { icon: Clock,             title: 'Free cancellation',      desc: 'Cancel up to an hour before your slot at no cost.' },
];

export function ZyphixBook() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (selectedSlot) {
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }
  };

  const activeService = selectedService ? services.find(s => s.id === selectedService) || null : null;

  const { partners: pros, loading: prosLoading } = usePartners('service');
  const requestBooking = (p: PartnerListing) => {
    const svc = serviceForPro(p);
    setSelectedService(svc.id);
    setSelectedSlot(null);
    requestAnimationFrame(() => {
      const el = document.getElementById(BOOKING_PANEL_ID);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
    });
  };

  return (
    <div className="relative">
      {/* ── Hero ── */}
      <section className="relative -mx-4 overflow-hidden sm:mx-0 sm:mt-5 sm:rounded-3xl" style={{ background: `linear-gradient(135deg, ${G2} 0%, ${G} 55%, #34D399 100%)` }}>
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(600px 300px at 90% 0%, rgba(255,255,255,.22), transparent 60%), radial-gradient(500px 260px at 0% 100%, rgba(11,18,32,.25), transparent 60%)' }} />
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 hidden h-64 w-64 rounded-full border-[28px] border-white/10 md:block" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 right-32 hidden h-48 w-48 rounded-full border-[20px] border-white/10 md:block" />

        <div className="relative grid gap-8 px-5 pb-8 pt-10 sm:px-10 sm:pb-12 sm:pt-14 md:grid-cols-[1.1fr_.9fr] md:items-center">
          <div>
            <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[12.5px] font-bold text-white backdrop-blur">
              <CalendarCheck size={14} /> Zyphix Book · Home services
            </motion.div>
            <motion.h1 {...fade(.05)} className="mt-4 max-w-[600px] text-[2.1rem] font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-[3rem] lg:text-[3.4rem]" style={HEAD}>
              Trusted professionals, booked in minutes
            </motion.h1>
            <motion.p {...fade(.1)} className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/90 sm:text-[16.5px]">
              Electricians, plumbers, cleaners and more from your own neighbourhood — verified, transparently priced, and at your door on time.
            </motion.p>
            <motion.div {...fade(.15)} className="mt-6 flex flex-wrap gap-3">
              <a href="#services" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 shadow-[0_8px_24px_rgba(0,0,0,.18)] transition hover:-translate-y-0.5">
                Browse services <ArrowRight size={16} />
              </a>
              <a href="#how" className="inline-flex items-center gap-2 rounded-2xl border border-white/40 px-5 py-3 text-[14.5px] font-bold text-white transition hover:bg-white/10">
                How it works
              </a>
            </motion.div>
          </div>

          {/* Stat-free visual: service icon mosaic */}
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, delay: .15 }} className="hidden md:block">
            <div className="grid grid-cols-3 gap-3">
              {services.slice(0, 6).map((s, i) => {
                const m = metaFor(s);
                const Icon = m.icon;
                return (
                  <motion.button key={s.id} {...fade(.2 + i * .05)} onClick={() => setSelectedService(s.id)}
                    className="flex flex-col items-start gap-3 rounded-2xl bg-white/95 p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,.14)] transition hover:-translate-y-0.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: m.bg, color: m.fg }}><Icon size={20} /></span>
                    <span className="text-[13.5px] font-black tracking-[-0.01em] text-gray-900" style={HEAD}>{s.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="relative border-t border-white/20 bg-black/10 px-5 py-3 sm:px-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-white/95">
            {[[ShieldCheck, 'Verified pros'], [BadgeIndianRupee, 'Price before you book'], [MapPin, 'Onboarding across India']].map(([Icon, t], i) => {
              const I = Icon as LucideIcon;
              return <li key={i} className="flex items-center gap-1.5"><I size={15} /> {t as string}</li>;
            })}
          </ul>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="mt-8 scroll-mt-24">
        <motion.div {...fade(.2)} className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative flex items-start gap-4 rounded-3xl border border-gray-200 bg-white p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon size={20} /></span>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Step {i + 1}</p>
                  <p className="mt-0.5 text-[16px] font-black tracking-[-0.02em] text-gray-900" style={HEAD}>{s.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Services + booking panel ── */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <section id="services" className="scroll-mt-24">
          <motion.div {...fade(.25)} className="flex items-end justify-between">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Available services</p>
              <h2 className="mt-0.5 text-[22px] font-black tracking-[-0.03em] text-gray-900 sm:text-[26px]" style={HEAD}>What do you need help with?</h2>
            </div>
            <span className="text-[13px] font-semibold text-gray-500">{services.length} services</span>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {services.map(service => {
              const isSelected = selectedService === service.id;
              const m = metaFor(service);
              const Icon = m.icon;
              return (
                <motion.div key={service.id} variants={fadeUp}>
                  <button
                    onClick={() => { setSelectedService(isSelected ? null : service.id); if (isSelected) setSelectedSlot(null); }}
                    className={`group relative flex h-full w-full flex-col rounded-3xl border p-4 text-left transition sm:p-5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_32px_rgba(13,163,102,.18)]'
                        : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(11,18,32,.08)]'
                    }`}>
                    {isSelected && (
                      <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: G }}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105" style={{ background: m.bg, color: m.fg }}>
                      <Icon size={22} />
                    </span>
                    <p className="mt-4 text-[16px] font-black tracking-[-0.02em] text-gray-900" style={HEAD}>{service.title}</p>
                    <p className="text-[12px] font-medium text-gray-500">{service.category}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{service.available} pros</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500"><Clock size={11} /> {service.nextSlot}</span>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Verified professionals (live partner directory) */}
          <motion.div {...fade(.28)} className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Registered professionals</p>
                <h2 className="mt-0.5 text-[22px] font-black tracking-[-0.03em] text-gray-900 sm:text-[26px]" style={HEAD}>Verified professionals near you</h2>
              </div>
              {!prosLoading && pros.length > 0 && <span className="text-[13px] font-semibold text-gray-500">{pros.length} pro{pros.length > 1 ? 's' : ''}</span>}
            </div>

            {prosLoading ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[0, 1].map(i => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gray-200 animate-pulse" />
                      <div className="flex-1 space-y-2"><div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" /><div className="h-3 w-1/3 rounded bg-gray-200 animate-pulse" /></div>
                    </div>
                    <div className="mt-3 flex gap-1.5"><div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" /><div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" /></div>
                    <div className="mt-4 h-9 w-full rounded-full bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : pros.length === 0 ? (
              <a href="https://partner.zyphix.in/services" target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-3.5 transition hover:bg-emerald-50">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><ShieldCheck size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-gray-900">Professionals are being onboarded in your area</span>
                  <span className="block text-[12.5px] text-gray-500">Electricians, plumbers, cleaners — verified before they go live.</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold" style={{ color: G }}>Join as a professional <ArrowRight size={14} /></span>
              </a>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-4 grid gap-3 sm:grid-cols-2">
                {pros.map(p => {
                  const skills = tagList(p.tags || '').filter(t => t.toLowerCase() !== (p.category || '').toLowerCase()).slice(0, 4);
                  const place = [p.locality, p.city].filter(Boolean).join(' · ');
                  return (
                    <motion.div key={p.id} variants={fadeUp} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,18,32,.08)]">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-black text-white" style={{ background: `linear-gradient(135deg, ${G2}, ${G})`, ...HEAD }}>{proInitials(p.name)}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="truncate text-[15px] font-bold text-gray-900">{p.name}</p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><ShieldCheck size={11} /> Verified member</span>
                          </div>
                          {p.category && <p className="mt-0.5 text-[12.5px] font-medium text-gray-600">{p.category}</p>}
                          {place && <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-gray-500"><MapPin size={11} className="text-gray-400" /> {place}</p>}
                        </div>
                      </div>
                      {skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {skills.map(s => <Chip key={s}>{s}</Chip>)}
                        </div>
                      )}
                      <button type="button" onClick={() => requestBooking(p)}
                        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px"
                        style={{ background: G }}>
                        Request booking <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Why Zyphix */}
          <motion.div {...fade(.3)} className="mt-8 grid gap-3 sm:grid-cols-2">
            {TRUST.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="flex items-start gap-3 rounded-3xl border border-gray-200 bg-white p-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon size={18} /></span>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">{t.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-600">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* Sticky booking panel */}
        <motion.aside {...fade(.3)} id={BOOKING_PANEL_ID} className="scroll-mt-24 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_16px_48px_rgba(11,18,32,.08)]">
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: G }}><CalendarCheck size={19} /></span>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Your booking</p>
                <p className="text-[16px] font-black tracking-[-0.02em] text-gray-900" style={HEAD}>
                  {activeService ? activeService.title : 'Pick a service to start'}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeService ? (
                <motion.div key={activeService.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .25 }} className="p-5">
                  {(() => {
                    const m = metaFor(activeService);
                    const Icon = m.icon;
                    return (
                      <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: m.bg, color: m.fg }}><Icon size={18} /></span>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-bold text-gray-900">{activeService.title}</p>
                          <p className="text-[12px] text-gray-500">{activeService.category} · {activeService.available} pros available</p>
                        </div>
                      </div>
                    );
                  })()}

                  <p className="mt-5 text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Pick a time · Today</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const on = selectedSlot === slot;
                      return (
                        <button key={slot} onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl border py-2.5 text-[12.5px] font-bold transition ${
                            on ? 'border-transparent text-white shadow-[0_6px_18px_rgba(13,163,102,.3)]' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
                          }`}
                          style={on ? { background: G } : undefined}>
                          {slot.replace(':00', '')}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 space-y-1.5 rounded-2xl border border-gray-200 p-3.5 text-[13px]">
                    <div className="flex justify-between text-gray-600"><span>Service</span><span className="font-bold text-gray-900">{activeService.title}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Slot</span><span className="font-bold text-gray-900">{selectedSlot || '—'}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Visit charge</span><span className="font-bold" style={{ color: G }}>Shown before confirm</span></div>
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={!selectedSlot}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(13,163,102,.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
                    style={{ background: booked ? G2 : G, ...HEAD }}>
                    {booked ? <><Check size={17} strokeWidth={3} /> Booking confirmed</> : <>Confirm booking <ArrowRight size={16} /></>}
                  </button>
                  <p className="mt-3 text-center text-[11.5px] text-gray-500">Free cancellation up to 1 hour before your slot.</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm"><Wrench size={22} /></span>
                    <p className="mt-3 text-[14px] font-bold text-gray-900">No service selected</p>
                    <p className="mt-1 text-[12.5px] text-gray-500">Tap a service tile to see today's time slots.</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-[12.5px] text-gray-600">
                    {STEPS.map((s, i) => (
                      <li key={s.title} className="flex items-center gap-2.5">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: G }}>{i + 1}</span>
                        {s.title}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
