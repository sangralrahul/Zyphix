import { sendRequest, OFFLINE_MSG } from '@/lib/requests';
import { WaitlistForm } from '@/components/RequestForms';
import { pexelsPhoto } from '@/data/media';
import { StepCards, SectionTitle } from '@/components/StepCards';
import { useSeo } from '@/lib/seo';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Clock, MapPin, Search, ShieldCheck, X } from 'lucide-react';
import { services } from '@/data/localData';
import { usePartners, tagList, type PartnerListing } from '@/lib/partners';
import { PHOTOS, VIDEOS, type Photo } from '@/data/media';
import { Chip, Accordion, Button, FONT } from '@/ui/kit';
import { VideoHero, Reveal, Stagger, Kicker, Headline, Sub, Counter, Dark, Glow, Grain, GlowButton, GhostButton, G } from '@/ui/cinema';
import { ScrollStory, ZoomVideo, Spotlight, Magnetic, SplitHeadline, type Chapter } from '@/ui/motion2';
import { BookingPanel, type BookingState } from './book/BookingPanel';
import { ServiceTiles } from './book/ServiceTiles';

import { LiveJob } from './book/LiveJob';
import { DAYS, FAQ, PANEL_ID, PANEL_ID_MOBILE, PARTNER_URL, PROMISES, metaFor, orderedServices, proInitials, serviceForPro, type Day, type Service } from './book/shared';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — home services from verified professionals (book.zyphix.in).
   Premium pass: video hero with an accent headline, a live "pro on the way"
   card, service bento (hover video on every tile that has a clip), the sticky
   booking panel, a pinned ScrollStory of how a booking works, a craft photo
   bento, Spotlight safety cards, FAQ and a ZoomVideo CTA for professionals.
   Renders inside LightLayout (Navbar + BottomNav, 1280 container).
   Clips used once each: cleaning (hero), plumber / electrician / acRepair
   (tiles), phoneOrder / doorHandoff / salon / homeSpa (story), haircut (CTA).
──────────────────────────────────────────────────────────────────────────── */

const H2 = 'text-balance tracking-[-0.04em]';

/* ── How a booking works (pinned chapters) ─────────────────────────────── */
const tag = (t: string) => <span key={t} className="inline-flex h-8 items-center rounded-full border border-white/15 bg-white/[.06] px-3 text-[12.5px] font-medium text-white/80">{t}</span>;
const CHAPTERS: Chapter[] = [
  { kicker: '01 · Pick', title: 'Pick a service.', clip: VIDEOS.phoneOrder,
    body: 'Plumbing, electrical, cleaning, AC and more. Each one comes with a clear scope, so you know what is covered before anyone arrives.',
    extra: <div className="flex flex-wrap gap-2">{['Clear scope', 'Search or browse'].map(tag)}</div> },
  { kicker: '02 · Schedule', title: 'Choose a slot. They show up in it.', clip: VIDEOS.doorHandoff,
    body: 'Today or tomorrow, morning to evening. The visit charge is shown before you confirm, and if your pro runs more than 30 minutes late, you get a credit.',
    extra: <div className="flex flex-wrap gap-2">{['Price before you confirm', "Credit if we're late"].map(tag)}</div> },
  { kicker: '03 · At your door', title: 'A verified pro does the work.', clip: VIDEOS.salon,
    body: 'ID and police-verified before their first booking. Any extra parts or time are quoted before the job starts, never after.',
    extra: <div className="flex flex-wrap gap-2">{['ID & police-verified', 'Quote before extra work'].map(tag)}</div> },
  { kicker: '04 · After', title: 'Done, and guaranteed.', clip: VIDEOS.homeSpa,
    body: 'If a completed job has an issue within 7 days, we send a professional back to fix it. Reschedule free; cancel free up to an hour before.',
    extra: <div className="flex flex-wrap gap-2">{['7-day work guarantee', 'Free reschedule'].map(tag)}</div> },
];

/* ── Safety & policy cards ─────────────────────────────────────────────── */
const POLICIES = [
  { icon: ShieldCheck, n: 100, f: (n: number) => `${Math.round(n)}%`, t: 'of pros ID & police-verified', s: 'Checks finish before their first booking, not after.' },
  { icon: Clock, n: 30, f: (n: number) => `${Math.round(n)} min`, t: "late? You get a credit", s: 'More than 30 minutes past your slot, part of the visit charge comes back.' },
  { icon: BadgeCheck, n: 7, f: (n: number) => `${Math.round(n)}-day`, t: 'work guarantee', s: 'An issue within 7 days? A pro comes back and fixes it, free.' },
  { icon: CalendarClock, n: 0, f: () => 'Free', t: 'to reschedule or cancel', s: 'Up to 1 hour before your slot. No questions.' },
];

/* ── Craft bento (photos) ──────────────────────────────────────────────── */
function CraftTile({ photo, title, sub, className = '', onClick }: { photo: Photo; title: string; sub: string; className?: string; onClick?: () => void }) {
  const inner = (
    <>
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#05080E]/85 via-[#05080E]/10 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left text-white md:inset-x-5 md:bottom-5">
        <div className="min-w-0">
          <p className="text-[18px] font-semibold tracking-[-0.03em] md:text-[24px]">{title}</p>
          <p className="mt-0.5 text-[13px] text-white/70">{sub}</p>
        </div>
        {onClick && <span className="hidden h-10 w-10 sm:flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-gray-900"><ArrowUpRight size={16} /></span>}
      </div>
    </>
  );
  const cls = `group relative isolate block overflow-hidden rounded-3xl bg-gray-900 ${className}`;
  return onClick
    ? <button type="button" onClick={onClick} className={`${cls} w-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}>{inner}</button>
    : <div className={cls}>{inner}</div>;
}

/* ── Hero service picker ───────────────────────────────────────────────── */
function ServicePicker({ onPick }: { onPick: (s: Service) => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return services.slice(0, 6);
    return services.filter(s => s.title.toLowerCase().includes(t) || s.category.toLowerCase().includes(t) || metaFor(s).blurb.toLowerCase().includes(t));
  }, [q]);
  useEffect(() => {
    const on = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', on);
    return () => document.removeEventListener('mousedown', on);
  }, []);
  const pick = (s: Service) => { setQ(''); setOpen(false); onPick(s); };
  return (
    <div ref={wrap} className="relative mt-6 max-w-[640px]">
      <form role="search" onSubmit={e => { e.preventDefault(); if (matches[0]) pick(matches[0]); }}
        className="flex h-[52px] items-center gap-2 rounded-2xl border border-gray-200 bg-white pl-4 pr-1.5 text-gray-900 shadow-[0_10px_30px_-18px_rgba(16,24,40,.35)] md:h-14">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder="What do you need done? Try “AC service”" aria-label="Search services"
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400 md:text-[16px]" />
        {q && <button type="button" onClick={() => setQ('')} aria-label="Clear" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={15} /></button>}
        <Magnetic strength={0.25} className="shrink-0">
          <button type="submit" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(13,163,102,.6)] md:h-11 md:px-5" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
            Book <ArrowRight size={14} />
          </button>
        </Magnetic>
      </form>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,.5)]">
          {matches.length === 0 ? (
            <p className="px-4 py-4 text-[13.5px] text-gray-500">No service matches “{q}”. Try “plumber”, “cleaning” or “AC”.</p>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto py-1.5">
              {matches.map(s => {
                const m = metaFor(s); const Icon = m.icon;
                return (
                  <li key={s.id}>
                    <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => pick(s)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50">
                      <span className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100"><img src={m.photo.src} alt="" loading="lazy" className="h-full w-full object-cover" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold tracking-[-0.01em]">{s.title}</span>
                        <span className="block truncate text-[12.5px] text-gray-500">{m.blurb} · next slot {s.nextSlot}</span>
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600"><Icon size={14} /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Professionals from the live directory ─────────────────────────────── */
function ProCard({ p, onBook }: { p: PartnerListing; onBook: () => void }) {
  const skills = tagList(p.tags || '').filter(t => t.toLowerCase() !== (p.category || '').toLowerCase()).slice(0, 3);
  const place = [p.locality, p.city].filter(Boolean).join(', ');
  const svc = serviceForPro(p);
  const photo = metaFor(svc).photo;
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-20px_rgba(11,15,25,.25)]">
      <div className="relative h-28 overflow-hidden bg-gray-900">
        <img src={photo.src} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-transform duration-[1200ms] group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/80 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white backdrop-blur"><ShieldCheck size={12} /> Verified member</span>
        <span className="absolute -bottom-5 left-4 flex h-12 w-12 items-center justify-center rounded-2xl text-[15px] font-semibold text-white ring-4 ring-white" style={{ background: `linear-gradient(135deg, #19C27C, ${G})` }}>{proInitials(p.name)}</span>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-7">
        <p className="truncate text-[15.5px] font-semibold tracking-[-0.01em] text-gray-900">{p.name}</p>
        <p className="truncate text-[12.5px] text-gray-500">{p.category || svc.title}{place ? ` · ${place}` : ''}</p>
        {skills.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{skills.map(s => <Chip key={s}>{s}</Chip>)}</div>}
        <div className="mt-auto pt-4">
          <Button size="sm" variant="secondary" onClick={onBook} className="w-full">Request booking <ArrowRight size={14} /></Button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */
export function ZyphixBook() {
  useSeo('Zyphix Book — Home services by verified pros', 'Plumbers, electricians, cleaners and more from your neighbourhood. ID-verified pros, price shown before you confirm.');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [day, setDay] = useState<Day>(DAYS[0]);
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [bookError, setBookError] = useState('');


  const handleBook = async () => {
    const svc = selectedService ? services.find(s => s.id === selectedService) : null;
    if (!svc || !selectedSlot) return;
    if (!contactName.trim()) { setBookError('Add your name so the pro knows who to ask for.'); return; }
    if (!/^\d{10}$/.test(contactPhone)) { setBookError('Enter a 10-digit mobile number so we can confirm the visit.'); return; }
    if (address.trim().length < 6) { setBookError('Add the address where the work is needed.'); return; }
    setSending(true); setBookError('');
    try {
      await sendRequest('book', { name: contactName, phone: contactPhone, address }, [{ name: svc.title, note: `${day}, ${selectedSlot}` }], { slot: `${day}, ${selectedSlot}`, service: svc.title });
      setBooked(true);
    } catch { setBookError(OFFLINE_MSG); }
    setSending(false);
  };

  const activeService = selectedService ? services.find(s => s.id === selectedService) || null : null;

  const scrollToPanel = () => {
    requestAnimationFrame(() => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const el = document.getElementById(desktop ? PANEL_ID : PANEL_ID_MOBILE);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
    });
  };

  const { partners: pros, loading: prosLoading } = usePartners('service');
  const requestBooking = (p: PartnerListing) => {
    setSelectedService(serviceForPro(p).id);
    setSelectedSlot(null);
    scrollToPanel();
  };
  const selectService = (service: Service) => {
    const isSelected = selectedService === service.id;
    setSelectedService(isSelected ? null : service.id);
    if (isSelected) setSelectedSlot(null);
    else scrollToPanel();
  };
  const pickFromHero = (service: Service) => {
    setSelectedService(service.id);
    setSelectedSlot(null);
    scrollToPanel();
  };
  const pickById = (id: string) => { const s = services.find(x => x.id === id); if (s) pickFromHero(s); };

  const booking: BookingState = { activeService, day, setDay, slot: selectedSlot, setSlot: setSelectedSlot, address, setAddress, booked, onBook: handleBook,
    name: contactName, setName: setContactName, phone: contactPhone, setPhone: setContactPhone, sending, error: bookError, onReset: () => { setBooked(false); setSelectedSlot(null); } };

  const list = orderedServices();
  const heroPhotos = [list[0], list[1], list[2]].map(sv => metaFor(sv).photo);
  return (
    <div className="w-full text-gray-900" style={{ fontFamily: FONT }}>
      {/* ── Hero (Urban Company-style): headline + "What are you looking for?" grid, photo collage ── */}
      <section className="pt-6 md:pt-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h1 className="max-w-[16ch] text-[34px] font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-[44px] md:text-[50px]">Home services at your doorstep</h1>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.55] text-gray-500 md:text-[16px]">Verified plumbers, electricians, cleaners and more from your own neighbourhood. Price shown before you confirm.</p>
            <ServicePicker onPick={pickFromHero} />
            <div className="mt-6 rounded-[24px] border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,.04)] md:p-6">
              <p className="text-[16px] font-bold text-gray-900">What are you looking for?</p>
              <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5">
                {list.map(sv => {
                  const m = metaFor(sv); const Icon = m.icon;
                  return (
                    <button key={sv.id} type="button" onClick={() => pickFromHero(sv)} className="group flex flex-col items-center text-center">
                      <span className="flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-[#F5F6F8] text-gray-800 ring-1 ring-black/[.04] transition group-hover:bg-emerald-50 group-hover:text-emerald-700 md:h-[72px] md:w-[72px]">
                        <Icon size={26} strokeWidth={1.7} />
                      </span>
                      <span className="mt-2 line-clamp-2 text-[12px] font-semibold leading-tight text-gray-700 group-hover:text-gray-900">{sv.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div aria-hidden className="hidden h-[560px] grid-cols-2 grid-rows-[1.2fr_1fr] gap-3 lg:grid">
            {[6195951, 7218683, 27928761, 1249611].map((id, k) => (
              <div key={id} className={`overflow-hidden rounded-[24px] bg-gray-100 ${k === 0 ? 'row-span-1' : ''}`}><img src={pexelsPhoto(id, 640)} alt="" className="h-full w-full object-cover" /></div>
            ))}
          </div>
        </div>

        {/* Promise row */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: ShieldCheck, t: 'Verified pros', s: 'ID & police-checked' },
            { icon: BadgeCheck, t: 'Upfront price', s: 'Shown before you confirm' },
            { icon: CalendarClock, t: 'Free reschedule', s: 'Up to 1 hour before' },
            { icon: Clock, t: '7-day guarantee', s: 'On every completed job' },
          ].map(p => (
            <div key={p.t} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><p.icon size={18} /></span>
              <span><span className="block text-[14px] font-bold text-gray-900">{p.t}</span><span className="block text-[12.5px] text-gray-500">{p.s}</span></span>
            </div>
          ))}
        </div>

        {/* Offer-style banners (no prices or discounts invented) */}
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 md:gap-4 [&::-webkit-scrollbar]:hidden">
          {BANNERS.map(b => (
            <button key={b.t} type="button" onClick={() => pickById(b.id)}
              className="group relative flex h-[170px] w-[84%] shrink-0 snap-start overflow-hidden rounded-[22px] text-left transition hover:-translate-y-0.5 sm:w-auto" style={{ background: b.bg }}>
              <div className="relative z-10 flex w-[56%] flex-col justify-between p-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">{b.k}</p>
                  <p className="mt-1 text-[19px] font-extrabold leading-tight tracking-[-0.02em] text-white">{b.t}</p>
                </div>
                <span className="inline-flex h-9 w-fit items-center gap-1 rounded-full bg-white px-3.5 text-[12.5px] font-bold text-gray-900">Book now <ArrowRight size={13} /></span>
              </div>
              <img src={pexelsPhoto(b.photo, 480)} alt="" loading="lazy" className="absolute inset-y-0 right-0 h-full w-[48%] object-cover transition-transform duration-700 group-hover:scale-105 [mask-image:linear-gradient(90deg,transparent,#000_30%)]" />
            </button>
          ))}
        </div>
      </section>

      {/* ── Services + pros, with the sticky booking panel ───────────────── */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <section id="services" className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle title="Book a service" sub="Pick one to see today's and tomorrow's slots." />
              <span className="hidden shrink-0 text-[13px] text-gray-500 sm:block">{services.length} services</span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {list.map(sv => {
                const m = metaFor(sv); const on = selectedService === sv.id; const Icon = m.icon;
                return (
                  <button key={sv.id} type="button" onClick={() => selectService(sv)} aria-pressed={on}
                    className={`group flex items-center gap-4 rounded-2xl border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(16,24,40,.35)] ${on ? 'border-emerald-500 ring-2 ring-emerald-500/25' : 'border-gray-200'}`}>
                    <span className="relative block h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-[96px] md:w-[96px]">
                      <img src={m.photo.src} alt={m.photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.01em] text-gray-900 md:text-[16px]"><Icon size={15} className="shrink-0 text-emerald-700" /><span className="truncate">{sv.title}</span></span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-gray-500 md:text-[13px]">{m.blurb}</span>
                      <span className={`mt-2.5 inline-flex h-8 items-center gap-1 rounded-full px-3 text-[12.5px] font-semibold transition ${on ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 group-hover:bg-emerald-100'}`}>{on ? 'Selected' : 'Book'} <ArrowRight size={13} /></span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Booking panel inline on mobile / tablet */}
          <div className="mt-8 lg:hidden">
            <BookingPanel id={PANEL_ID_MOBILE} state={booking} />
          </div>

          {/* ── Pros near you (live partner directory) ── */}
          <section id="pros" className="mt-14 scroll-mt-24 md:mt-20">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle title="Pros near you" sub="Verified professionals listed in your area." />
              {!prosLoading && pros.length > 0 && <span className="hidden shrink-0 text-[13px] text-gray-500 sm:block">{pros.length} pro{pros.length > 1 ? 's' : ''}</span>}
            </div>
            {prosLoading ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[0, 1].map(i => <div key={i} className="h-56 animate-pulse rounded-3xl border border-gray-200 bg-white" />)}
              </div>
            ) : pros.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pros.map(p => <ProCard key={p.id} p={p} onBook={() => requestBooking(p)} />)}
              </div>
            ) : (
              <div className="mt-5 grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:grid-cols-2">
                <div className="bg-[#F3F8F5] p-6 md:p-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-gray-700 ring-1 ring-inset ring-gray-200"><MapPin size={12} /> Opening area by area</span>
                  <p className="mt-4 max-w-[20ch] text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] text-gray-900 md:text-[26px]">Every pro is checked before their first booking.</p>
                  <ol className="mt-5 space-y-3">
                    {[{ icon: <BadgeCheck size={15} />, t: 'ID and address check' }, { icon: <ShieldCheck size={15} />, t: 'Police verification' }, { icon: <CalendarClock size={15} />, t: 'Then listed here, with live slots' }].map(st => (
                      <li key={st.t} className="flex items-center gap-3 text-[14px] text-gray-700">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 ring-1 ring-emerald-100">{st.icon}</span>{st.t}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="text-[18px] font-semibold leading-[1.2] tracking-[-0.02em] text-gray-900 md:text-[20px]">Get a message when verified pros are bookable near you.</p>
                  <div className="mt-4"><WaitlistForm product="book" cta="Notify me" /></div>
                  <a href={`${PARTNER_URL}/services`} className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">Work in home services? Listing is free <ArrowUpRight size={14} /></a>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── Sticky booking panel (desktop) ── */}
        <aside className="hidden lg:sticky lg:top-20 lg:block">
          <BookingPanel id={PANEL_ID} state={booking} />
        </aside>
      </div>

      {/* ── How it works ── */}
      <section id="how" className="mt-16 md:mt-24">
        <SectionTitle title="How it works" sub="Four steps, the same on every booking." />
        <StepCards steps={STEPS} />
      </section>

      {/* ── Our promise ── */}
      <section className="mt-16 md:mt-24">
        <SectionTitle title="The Zyphix promise" sub="Rules on every job, decided in advance." />
        <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {POLICIES.map(c => (
            <div key={c.t} className="rounded-3xl bg-[#F3F8F5] p-5 md:p-6">
              <c.icon size={20} className="text-emerald-700" />
              <p className="mt-4 text-[28px] font-semibold leading-none tracking-[-0.04em] text-emerald-800 md:text-[34px]">{c.f(c.n)}</p>
              <p className="mt-2 text-[14px] font-semibold text-gray-900">{c.t}</p>
              <p className="mt-1 text-[12.5px] leading-[1.5] text-gray-500 md:text-[13px]">{c.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mt-16 scroll-mt-24 md:mt-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className={H2L}>Questions, answered</h2>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-gray-500">Anything else? Write to <a href="mailto:support@zyphix.in" className="font-semibold text-emerald-700">support@zyphix.in</a> (Mon–Sat).</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white px-5 sm:px-8 lg:col-span-8">
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>

      {/* ── For professionals ── */}
      <section className="mt-16 overflow-hidden rounded-3xl border border-gray-200 bg-white md:mt-24">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center p-6 md:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">For professionals</p>
            <h2 className="mt-2 max-w-[18ch] text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-gray-900 md:text-[36px]">Work your own neighbourhood. Get paid every week.</h2>
            <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-gray-500 md:text-[15.5px]">Electricians, plumbers, cleaners, beauticians and more. Listing is free; verification takes a few days.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={PARTNER_URL}>Join Zyphix Book <ArrowUpRight size={15} /></Button>
              <Button href="#faq" variant="secondary" sameTab>How verification works</Button>
            </div>
          </div>
          <div className="relative min-h-[220px] bg-gray-100"><img src={PHOTOS.carpenter[0].src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /></div>
        </div>
      </section>
    </div>
  );
}

/* ── How it works steps ── */
const STEPS = [
  { photo: 16052344, t: 'Pick a service', s: 'Plumbing, electrical, cleaning, AC and more, each with a clear scope.' },
  { photo: 5077068, t: 'Choose a slot', s: 'Today or tomorrow. The visit charge is shown before you confirm.' },
  { photo: 27928761, t: 'A verified pro arrives', s: 'Extra parts or time are quoted before the job starts, never after.' },
  { photo: 4239125, t: 'Done, and guaranteed', s: 'An issue within 7 days? A pro comes back and fixes it, free.' },
];
const H2L = 'text-[22px] font-semibold tracking-[-0.03em] text-gray-900 md:text-[28px]';

/* Colourful service banners under the hero (link straight into booking). */
const BANNERS = [
  { id: 'sv3', k: 'Home cleaning', t: 'A spotless home, done for you', photo: 6195951, bg: '#0F766E' },
  { id: 'sv5', k: 'AC service', t: 'Get your AC ready for summer', photo: 5463575, bg: '#1D4ED8' },
  { id: 'sv2', k: 'Electrician', t: 'Switches, fans and wiring fixed', photo: 27928761, bg: '#7C3AED' },
];
