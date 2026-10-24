import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Check, Wrench, Zap, Sparkles, Paintbrush, Snowflake, Droplets, Hammer, ChefHat, Truck, ShieldCheck,
  Radar, Bike, MapPin, Clock, CalendarClock, Receipt, Headset, BadgeCheck, PhoneCall, ArrowRight, type LucideIcon,
} from 'lucide-react';
import { services } from '@/data/mockData';
import { usePartners, tagList, type PartnerListing } from '@/lib/partners';
import { Chip, IconTile, Card, Button, Accordion, Eyebrow, Display, Lead, Mesh, Grid, G, G_DEEP, TEAL, FONT, fade } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — home services from verified professionals.
   Premium, animated, image-rich page: video hero with a looping booking demo,
   photo service cards, animated "how it works", sticky booking panel, live
   professionals from the partner directory, FAQ and CTA.
──────────────────────────────────────────────────────────────────────────── */

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
const DAYS = ['Today', 'Tomorrow'] as const;
type Day = typeof DAYS[number];

type Service = typeof services[0];
type Tone = React.ComponentProps<typeof IconTile>['tone'];

/* Icon, tile tone and photo per service (keyed by id) */
const unsplash = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
const SERVICE_META: Record<string, { icon: LucideIcon; tone: Tone; photo: string }> = {
  sv1:  { icon: Wrench,     tone: 'blue',   photo: 'photo-1621905251189-08b45d6a269e' },
  sv2:  { icon: Zap,        tone: 'orange', photo: 'photo-1581578731548-c64695cc6952' },
  sv3:  { icon: Sparkles,   tone: 'green',  photo: 'photo-1527515637462-cff94eecc1ac' },
  sv4:  { icon: Paintbrush, tone: 'violet', photo: 'photo-1562259949-e8e7689d7828' },
  sv5:  { icon: Snowflake,  tone: 'teal',   photo: 'photo-1631545806609-4d7b19a8a6b0' },
  sv6:  { icon: Droplets,   tone: 'blue',   photo: 'photo-1548839140-29a749e1cf4d' },
  sv7:  { icon: Hammer,     tone: 'orange', photo: 'photo-1504148455328-c376907d081c' },
  sv8:  { icon: ChefHat,    tone: 'green',  photo: 'photo-1556910103-1c02745aae4d' },
  sv9:  { icon: Truck,      tone: 'violet', photo: 'photo-1600518464441-9154a4dea21b' },
  sv10: { icon: Wrench,     tone: 'teal',   photo: 'photo-1581244277943-fe4a9c777189' },
};
const metaFor = (s: Service) => SERVICE_META[s.id] || { icon: Wrench, tone: 'blue' as Tone, photo: 'photo-1584622650111-993a426fbf0a' };

const HERO_POSTER = unsplash('photo-1581578731548-c64695cc6952', 1600);
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

const EASE = [0.22, 1, 0.36, 1] as const;

/** Translucent pill button for use on ink/video backgrounds. */
function GlassButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ext = href.startsWith('http');
  return (
    <a href={href} target={ext ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-[15px] font-semibold tracking-[-0.01em] text-white backdrop-blur transition-all duration-200 hover:-translate-y-px hover:bg-white/20">
      {children}
    </a>
  );
}
// Reveal on mount (not on scroll) so content is never left invisible in browsers that
// don't fire intersection events reliably (in-app webviews, print, prerender).
const inView = (delay = 0, y = 18) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay: Math.min(delay, 0.6) },
});

/* ── Service photo with graceful fallback to a tinted icon tile ─────────── */
function ServicePhoto({ service, className = '', eager = false, sizes = '(min-width: 1024px) 25vw, 50vw' }: { service: Service; className?: string; eager?: boolean; sizes?: string }) {
  const [broken, setBroken] = useState(false);
  const m = metaFor(service);
  const Icon = m.icon;
  if (broken) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50 ${className}`}>
        <IconTile tone={m.tone} className="h-14 w-14 rounded-2xl"><Icon size={26} /></IconTile>
      </div>
    );
  }
  return (
    <img src={unsplash(m.photo)} alt={service.title} loading={eager ? 'eager' : 'lazy'} decoding="async" sizes={sizes}
      onError={() => setBroken(true)} className={`object-cover ${className}`} draggable={false} />
  );
}

/* ── Hero: looping booking demo card ────────────────────────────────────── */
const DEMO_STEPS = 4;
const DEMO_INTERVAL = 2500;

function DemoCard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % DEMO_STEPS), DEMO_INTERVAL);
    return () => clearInterval(t);
  }, []);
  const loop = reduce ? {} : { repeat: Infinity };

  return (
    <div className="relative w-full max-w-[360px]">
      <div className="absolute -inset-6 -z-10 rounded-[32px] opacity-60 blur-2xl" style={{ background: `radial-gradient(closest-side, ${G}55, transparent 70%)` }} />
      <div className="rounded-2xl border border-white/15 bg-white/[.08] p-1.5 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
        <div className="rounded-[12px] bg-white text-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md text-white" style={{ background: G }}><Zap size={12} /></span>
              <span className="text-[12.5px] font-semibold">Electrician · Switchboard repair</span>
            </div>
            <span className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-gray-400">Demo</span>
          </div>

          <div className="relative h-[168px] overflow-hidden px-4">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div key="s0" className="absolute inset-0 flex items-center gap-4 px-4"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="absolute inset-0 rounded-full border-2" style={{ borderColor: G }}
                        initial={{ scale: 0.3, opacity: 0.8 }} animate={{ scale: 1.15, opacity: 0 }}
                        transition={{ duration: 1.8, delay: i * 0.6, ease: 'easeOut', ...loop }} />
                    ))}
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Radar size={20} /></span>
                  </div>
                  <div>
                    <p className="text-[14.5px] font-semibold tracking-[-0.01em]">Finding an electrician near you</p>
                    <p className="mt-1 text-[12.5px] text-gray-500">Checking verified pros within 5 km</p>
                    <div className="mt-2.5 flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: G }}
                          animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: i * 0.2, ...loop }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" className="absolute inset-0 flex items-center gap-4 px-4"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
                  <motion.div className="relative shrink-0" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45, ease: EASE }}>
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-[18px] font-semibold text-white">RK</span>
                    <motion.span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white ring-2 ring-white" style={{ background: G }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.4 }}>
                      <Check size={13} strokeWidth={3} />
                    </motion.span>
                  </motion.div>
                  <div>
                    <p className="text-[14.5px] font-semibold tracking-[-0.01em]">Ramesh K. assigned</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-medium text-emerald-700"><ShieldCheck size={13} /> ID &amp; background verified</p>
                    <p className="mt-1 text-[12px] text-gray-500">Electrician · 4 yrs experience</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" className="absolute inset-0 flex flex-col justify-center px-4"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[14.5px] font-semibold tracking-[-0.01em]">On the way</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700"><Clock size={12} /> 12 min</span>
                  </div>
                  <div className="relative mt-5 h-1.5 w-full rounded-full bg-gray-100">
                    <motion.div className="absolute left-0 top-0 h-full rounded-full" style={{ background: `linear-gradient(90deg, ${G}, ${TEAL})` }}
                      initial={{ width: '8%' }} animate={{ width: '72%' }} transition={{ duration: 2, ease: 'easeInOut' }} />
                    <motion.span className="absolute -top-[15px] flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gray-900 text-white shadow-md"
                      initial={{ left: '8%' }} animate={{ left: '72%' }} transition={{ duration: 2, ease: 'easeInOut' }}>
                      <Bike size={15} />
                    </motion.span>
                    <span className="absolute -right-1 -top-[9px] text-gray-400"><MapPin size={18} /></span>
                  </div>
                  <p className="mt-5 text-[12.5px] text-gray-500">Live location shared until arrival</p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" className="absolute inset-0 flex items-center gap-4 px-4"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
                  <motion.span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 16 }}>
                    <Check size={30} strokeWidth={2.5} />
                  </motion.span>
                  <div>
                    <p className="text-[14.5px] font-semibold tracking-[-0.01em]">Job done</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[12.5px] text-gray-600"><Receipt size={13} /> ₹ shown before you confirm</p>
                    <p className="mt-1 text-[12px] text-gray-500">No surprises on the final bill</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* step indicator */}
          <div className="flex items-center gap-1.5 border-t border-gray-100 px-4 py-2.5">
            {Array.from({ length: DEMO_STEPS }).map((_, i) => (
              <motion.span key={i} className="h-1 rounded-full" animate={{ width: i === step ? 22 : 8, background: i === step ? G : '#E5E7EB' }} transition={{ duration: 0.3 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero background video with poster fallback ─────────────────────────── */
function HeroVideo() {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <img src={HERO_POSTER} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      {!failed && (
        <video autoPlay muted loop playsInline preload="metadata" aria-hidden poster={HERO_POSTER}
          onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/book-hero.mp4" type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,10,8,.86) 0%, rgba(5,10,8,.7) 45%, rgba(5,10,8,.45) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,10,8,.1) 0%, rgba(5,10,8,.15) 60%, rgba(5,10,8,.75) 100%)' }} />
    </>
  );
}

/* ── How it works: animated connector ───────────────────────────────────── */
function Connector({ vertical = false, delay = 0 }: { vertical?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`relative ${vertical ? 'mx-auto h-10 w-px' : 'h-px w-full'} bg-gray-200`}>
      {!reduce && (
        <motion.span className="absolute h-2 w-2 rounded-full shadow-[0_0_0_4px_rgba(13,163,102,.15)]" style={{ background: G, ...(vertical ? { left: -3.5 } : { top: -3.5 }) }}
          animate={vertical ? { top: ['0%', '100%'] } : { left: ['0%', '100%'] }}
          transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }} />
      )}
    </div>
  );
}

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Wrench, title: 'Pick a service', body: 'Choose from plumbing, electrical, cleaning, AC and more. Each one comes with a clear scope.' },
  { icon: CalendarClock, title: 'Choose a slot', body: 'Pick a time that suits you today or tomorrow. The visit charge is shown before you confirm.' },
  { icon: BadgeCheck, title: 'Confirm', body: 'A verified professional is assigned and you can track their arrival. Reschedule for free if plans change.' },
];

const TRUST = [
  { icon: ShieldCheck, label: 'ID & background verified' },
  { icon: Receipt, label: 'Price shown before you confirm' },
  { icon: CalendarClock, label: 'Reschedule free' },
  { icon: Headset, label: 'Support Mon–Sat' },
];

const INCLUDED: { icon: LucideIcon; tone: Tone; title: string; body: string }[] = [
  { icon: ShieldCheck, tone: 'green', title: 'Verified professionals', body: 'Every pro completes ID, address and background checks before their first booking.' },
  { icon: Receipt, tone: 'blue', title: 'Transparent pricing', body: 'The visit charge is shown before you confirm. Any extra parts are quoted before work starts.' },
  { icon: PhoneCall, tone: 'orange', title: 'On time, or we call you', body: 'If your professional is running late, we let you know and you can reschedule at no cost.' },
  { icon: BadgeCheck, tone: 'violet', title: '7-day work guarantee', body: 'If a completed job has an issue within 7 days, we send a professional back as part of our policy.' },
];

const FAQ = [
  { q: 'How are professionals verified?', a: 'Each professional submits a government ID, address proof and completes a background check and a skill confirmation call before they can accept bookings on Zyphix Book.' },
  { q: 'When do I see the price?', a: 'The visit charge for the selected service is shown in the booking panel before you confirm. If the job needs extra parts or time, the professional quotes it before starting.' },
  { q: 'Can I reschedule or cancel?', a: 'Yes. You can reschedule for free, and cancel at no charge up to 1 hour before your slot.' },
  { q: 'What if the professional is late?', a: 'We notify you if they are running behind. You can wait, pick a new slot, or cancel without any charge.' },
  { q: 'Is there a guarantee on the work?', a: 'Yes. Under our 7-day work guarantee, if a completed job has an issue within 7 days we send a professional back to fix it.' },
  { q: 'Which areas do you cover?', a: 'Coverage depends on the professionals registered in your city. The list below shows verified professionals currently available near you.' },
];

/* ════════════════════════════════════════════════════════════════════════════ */
export function ZyphixBook() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [day, setDay] = useState<Day>('Today');
  const [address, setAddress] = useState('');

  const handleBook = () => {
    if (selectedSlot) {
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }
  };

  const activeService = selectedService ? services.find(s => s.id === selectedService) || null : null;

  const scrollToPanel = () => {
    requestAnimationFrame(() => {
      const el = document.getElementById(BOOKING_PANEL_ID);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
    });
  };

  const { partners: pros, loading: prosLoading } = usePartners('service');
  const requestBooking = (p: PartnerListing) => {
    const svc = serviceForPro(p);
    setSelectedService(svc.id);
    setSelectedSlot(null);
    scrollToPanel();
  };

  const selectService = (service: Service) => {
    const isSelected = selectedService === service.id;
    setSelectedService(isSelected ? null : service.id);
    if (isSelected) setSelectedSlot(null);
    else scrollToPanel();
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.section {...fade(0)} className="relative overflow-hidden rounded-2xl bg-[#0B0F19] text-white shadow-[0_30px_80px_rgba(11,15,25,.25)] lg:min-h-[520px]">
        <HeroVideo />
        <div className="relative grid grid-cols-1 gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14 lg:py-16">
          <div>
            <Eyebrow dark>Zyphix Book · Home services</Eyebrow>
            <Display as="h1" size="lg" className="mt-4 max-w-[560px] text-white">Trusted professionals, booked in minutes.</Display>
            <Lead dark className="mt-5 max-w-[520px]">Plumbers, electricians, cleaners and more — ID-verified, with the price shown before you confirm. Pick a service, choose a slot, done.</Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#services" size="lg">Book a service <ArrowRight size={16} /></Button>
              <GlassButton href="#how">How it works</GlassButton>
            </div>
          </div>
          <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}>
            <DemoCard />
          </motion.div>
        </div>
      </motion.section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <motion.ul {...fade(0.15)} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TRUST.map(({ icon: Icon, label }, i) => (
          <motion.li key={label} {...inView(i * 0.06, 10)} className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-[13px] font-medium text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Icon size={15} /></span>
            {label}
          </motion.li>
        ))}
      </motion.ul>

      {/* ── Services + sticky booking panel ──────────────────────────────── */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="min-w-0">
          <section id="services" className="scroll-mt-24">
            <motion.div {...inView()} className="flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Services</Eyebrow>
                <Display as="h2" size="md" className="mt-2 text-gray-900">What do you need done?</Display>
              </div>
              <span className="hidden text-[13px] text-gray-500 sm:block">{services.length} services</span>
            </motion.div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, i) => {
                const isSelected = selectedService === service.id;
                const m = metaFor(service);
                const Icon = m.icon;
                return (
                  <motion.button key={service.id} type="button" {...inView(Math.min(i, 7) * 0.05, 16)}
                    whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => selectService(service)} aria-pressed={isSelected}
                    className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,.03)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(11,15,25,.12)] ${
                      isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/60' : 'border-gray-200'
                    }`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <ServicePhoto service={service} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                      <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-900 shadow-sm backdrop-blur"><Icon size={15} /></span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span key="check" className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-white ring-2 ring-white" style={{ background: G }}
                            initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                            <Check size={14} strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <div className="absolute inset-x-3 bottom-3 text-white">
                        <p className="text-[14.5px] font-semibold tracking-[-0.01em] drop-shadow">{service.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-3">
                      <p className="text-[12.5px] text-gray-500">{service.category}</p>
                      <span className={`text-[12px] font-semibold ${isSelected ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-700'}`}>{isSelected ? 'Selected' : 'Select'}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* ── How it works ──────────────────────────────────────────────── */}
          <section id="how" className="mt-14 scroll-mt-24">
            <motion.div {...inView()}>
              <Eyebrow>How it works</Eyebrow>
              <Display as="h2" size="md" className="mt-2 text-gray-900">Three steps, no phone tag.</Display>
            </motion.div>
            <Card hover={false} className="relative mt-6 overflow-hidden p-6 sm:p-8">
              <Mesh intensity={0.5} />
              <Grid />
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-4">
                {STEPS.map(({ icon: Icon, title, body }, i) => (
                  <React.Fragment key={title}>
                    {i > 0 && (
                      <>
                        <div className="md:hidden"><Connector vertical delay={i * 0.9} /></div>
                        <div className="hidden w-16 self-center md:block"><Connector delay={i * 0.9} /></div>
                      </>
                    )}
                    <motion.div {...inView(i * 0.12)} className="relative">
                      <div className="flex items-center gap-3">
                        <motion.span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-[0_6px_20px_rgba(13,163,102,.18)] ring-1 ring-emerald-100"
                          whileInView={{ scale: [0.9, 1.05, 1] }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}>
                          <Icon size={20} />
                        </motion.span>
                        <span className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Step {i + 1}</span>
                      </div>
                      <p className="mt-3 text-[16px] font-semibold tracking-[-0.01em] text-gray-900">{title}</p>
                      <p className="mt-1.5 text-[14px] leading-[1.6] text-gray-600">{body}</p>
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            </Card>
          </section>

          {/* ── Verified professionals (live partner directory) ───────────── */}
          <section className="mt-14">
            <motion.div {...inView()} className="flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Professionals</Eyebrow>
                <Display as="h2" size="md" className="mt-2 text-gray-900">Verified professionals near you</Display>
              </div>
              {!prosLoading && pros.length > 0 && <span className="hidden text-[13px] text-gray-500 sm:block">{pros.length} pro{pros.length > 1 ? 's' : ''}</span>}
            </motion.div>

            {prosLoading ? (
              <Card hover={false} className="mt-5 divide-y divide-gray-100">
                {[0, 1].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-4">
                    <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 animate-pulse rounded bg-gray-200" /><div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" /></div>
                    <div className="h-9 w-28 animate-pulse rounded-full bg-gray-100" />
                  </div>
                ))}
              </Card>
            ) : pros.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pros.map((p, i) => {
                  const skills = tagList(p.tags || '').filter(t => t.toLowerCase() !== (p.category || '').toLowerCase()).slice(0, 3);
                  const place = [p.locality, p.city].filter(Boolean).join(', ');
                  return (
                    <motion.div key={p.id} {...inView(Math.min(i, 6) * 0.07, 14)}>
                      <Card className="h-full p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-semibold text-white" style={{ background: `linear-gradient(135deg, ${G}, ${G_DEEP})` }}>{proInitials(p.name)}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-gray-900">{p.name}</p>
                            {p.category && <p className="truncate text-[12.5px] text-gray-500">{p.category}</p>}
                          </div>
                          <Chip tone="green"><ShieldCheck size={12} /> Verified member</Chip>
                        </div>
                        {skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {skills.map(s => <Chip key={s}>{s}</Chip>)}
                          </div>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-3">
                          {place ? <p className="inline-flex min-w-0 items-center gap-1 truncate text-[12.5px] text-gray-500"><MapPin size={13} className="shrink-0" /> <span className="truncate">{place}</span></p> : <span />}
                          <Button size="sm" variant="secondary" onClick={() => requestBooking(p)}>Request booking</Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-[13.5px] text-gray-500">
                No professionals are listed in your area yet. Are you a professional?{' '}
                <a href="https://partner.zyphix.in/services" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 hover:underline">Join Zyphix Book</a>.
              </p>
            )}
          </section>
        </div>

        {/* ── Booking panel ──────────────────────────────────────────────── */}
        <aside id={BOOKING_PANEL_ID} className="scroll-mt-24 lg:sticky lg:top-24">
          <Card hover={false} className="overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-gray-900">Your booking</h2>
              {activeService && <Chip tone="green">Step 2 of 3</Chip>}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {activeService ? (
                <motion.div key={activeService.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, ease: EASE }}>
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-[#FAFAFA] p-2.5">
                    <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <ServicePhoto service={activeService} className="h-full w-full" sizes="64px" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14.5px] font-semibold text-gray-900">{activeService.title}</p>
                      <p className="truncate text-[12.5px] text-gray-500">{activeService.category} · next slot {activeService.nextSlot}</p>
                    </div>
                  </div>

                  {/* Day tabs */}
                  <div className="mt-4 flex rounded-lg bg-gray-100 p-1">
                    {DAYS.map(d => {
                      const on = day === d;
                      return (
                        <button key={d} type="button" onClick={() => { setDay(d); setSelectedSlot(null); }} aria-pressed={on}
                          className={`relative flex-1 rounded-md py-1.5 text-[13px] font-semibold transition ${on ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                          {on && <motion.span layoutId="book-day-tab" className="absolute inset-0 rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,.08)]" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                          <span className="relative">{d}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const on = selectedSlot === slot;
                      return (
                        <motion.button key={slot} type="button" onClick={() => setSelectedSlot(slot)} aria-pressed={on} whileTap={{ scale: 0.95 }}
                          className={`rounded-lg border py-2 text-[12.5px] font-medium transition ${
                            on ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}>
                          {slot.replace(':00', '')}
                        </motion.button>
                      );
                    })}
                  </div>

                  <label className="mt-4 block">
                    <span className="text-[12.5px] font-medium text-gray-700">Address <span className="font-normal text-gray-400">(optional)</span></span>
                    <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
                      <MapPin size={14} className="shrink-0 text-gray-400" />
                      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Flat, street, locality" className="h-10 w-full bg-transparent text-[13.5px] text-gray-900 outline-none placeholder:text-gray-400" />
                    </span>
                  </label>

                  <dl className="mt-4 space-y-1.5 text-[13px]">
                    <div className="flex justify-between"><dt className="text-gray-500">Service</dt><dd className="font-medium text-gray-900">{activeService.title}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Slot</dt><dd className="font-medium text-gray-900">{selectedSlot ? `${day}, ${selectedSlot}` : '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Visit charge</dt><dd className="inline-flex items-center gap-1 text-gray-900"><Receipt size={13} className="text-gray-400" /> Shown before you confirm</dd></div>
                  </dl>

                  <div className="relative mt-4">
                    <AnimatePresence mode="wait" initial={false}>
                      {booked ? (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                          <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden>
                            <motion.circle cx="24" cy="24" r="20" fill="none" stroke={G} strokeWidth="3" strokeLinecap="round"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                            <motion.path d="M15 24.5l6 6 12-13" fill="none" stroke={G} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: 'easeOut', delay: 0.4 }} />
                          </svg>
                          <div>
                            <p className="text-[14px] font-semibold text-emerald-900">Booking confirmed</p>
                            <p className="text-[12.5px] text-emerald-800/80">{activeService.title} · {day}, {selectedSlot}</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                          <button type="button" onClick={handleBook} disabled={!selectedSlot}
                            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full text-[14.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.2)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(13,163,102,.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            style={{ background: `linear-gradient(180deg, #13B874 0%, ${G} 100%)` }}>
                            {selectedSlot ? 'Confirm booking' : 'Choose a time slot'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="mt-2.5 text-center text-[12px] text-gray-500">Free cancellation up to 1 hour before your slot.</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-4">
                  <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed border-gray-200 bg-[#FAFAFA] px-4 py-8 text-center">
                    <motion.span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-[0_6px_20px_rgba(13,163,102,.15)] ring-1 ring-emerald-100"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
                      <CalendarClock size={22} />
                    </motion.span>
                    <p className="mt-3 text-[14px] font-semibold text-gray-900">Pick a service to start</p>
                    <p className="mt-1 text-[12.5px] text-gray-500">Time slots for today and tomorrow appear here.</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-[12.5px] text-gray-600">
                    {['Price shown before you confirm', 'Reschedule free', 'ID & background verified pros'].map(t => (
                      <li key={t} className="flex items-center gap-2"><Check size={13} className="text-emerald-600" /> {t}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </aside>
      </div>

      {/* ── What's included ──────────────────────────────────────────────── */}
      <section className="mt-16">
        <motion.div {...inView()} className="mx-auto max-w-[640px] text-center">
          <Eyebrow className="justify-center">What's included</Eyebrow>
          <Display as="h2" size="md" className="mt-2 text-gray-900">Every booking, the same standard.</Display>
          <Lead className="mt-3 text-[15.5px]">These are our policies on every job, not promises we make case by case.</Lead>
        </motion.div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map(({ icon: Icon, tone, title, body }, i) => (
            <motion.div key={title} {...inView(i * 0.08, 20)} whileHover={{ y: -4 }} className="h-full">
              <Card className="group relative h-full overflow-hidden p-5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: `${G}33` }} />
                <motion.div whileInView={{ rotate: [0, -8, 6, 0] }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 + i * 0.08 }} className="inline-block">
                  <IconTile tone={tone}><Icon size={19} /></IconTile>
                </motion.div>
                <p className="mt-4 text-[15.5px] font-semibold tracking-[-0.01em] text-gray-900">{title}</p>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-gray-600">{body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <motion.div {...inView()}>
          <Eyebrow>FAQ</Eyebrow>
          <Display as="h2" size="md" className="mt-2 text-gray-900">Questions, answered.</Display>
          <Lead className="mt-3 text-[15.5px]">Anything else? Support is available Mon–Sat.</Lead>
        </motion.div>
        <motion.div {...inView(0.1)}>
          <Card hover={false} className="px-5 sm:px-7">
            <Accordion items={FAQ} />
          </Card>
        </motion.div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <motion.section {...inView()} className="relative mt-16 mb-8 overflow-hidden rounded-2xl bg-[#0B0F19] px-6 py-12 text-center text-white sm:px-10 sm:py-16">
        <Grid dark />
        <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${G}66, transparent 70%)` }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <Eyebrow dark className="justify-center">Ready when you are</Eyebrow>
        <Display as="h2" size="md" className="mx-auto mt-3 max-w-[560px] text-white">Book a verified professional for today or tomorrow.</Display>
        <Lead dark className="mx-auto mt-4 max-w-[480px]">The visit charge is shown before you confirm. Reschedule for free if plans change.</Lead>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="#services" size="lg">Book a service <ArrowRight size={16} /></Button>
          <GlassButton href="https://partner.zyphix.in/services">Join as a professional</GlassButton>
        </div>
      </motion.section>
    </div>
  );
}
