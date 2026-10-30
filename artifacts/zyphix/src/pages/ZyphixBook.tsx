import { sendRequest, OFFLINE_MSG } from '@/lib/requests';
import { WaitlistForm } from '@/components/RequestForms';
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
import { DAYS, FAQ, PANEL_ID, PANEL_ID_MOBILE, PARTNER_URL, PROMISES, metaFor, proInitials, serviceForPro, type Day, type Service } from './book/shared';

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
        className="flex h-[52px] items-center gap-2 rounded-2xl bg-white pl-4 pr-1.5 text-gray-900 shadow-[0_24px_60px_-15px_rgba(0,0,0,.6)] md:h-14">
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

  return (
    <div className="w-full text-gray-900" style={{ fontFamily: FONT }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="zx-bleed -mx-4">
        <VideoHero clip={VIDEOS.cleaning} height="min-h-[600px] md:min-h-[82svh]" dim={0.45}>
          <div className="zx-bleed-inner relative px-4 pb-7 pt-20 md:pb-16 md:pt-28">
            <div className="lg:max-w-[640px] xl:max-w-[700px]">
              <Kicker light>Zyphix Book</Kicker>
              <SplitHeadline parts={['Home services, done by', { accent: 'verified', green: true }, 'pros.']}
                className="max-w-[16ch] text-balance text-[40px] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-[54px] md:text-[72px]" />
              <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.55] text-white/75 md:text-[18px]">
                Plumbers, electricians, cleaners and more from your own neighbourhood. Price shown before you confirm.
              </p>
              <ServicePicker onPick={pickFromHero} />
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
                {PROMISES.slice(0, 4).map(t => (
                  <span key={t} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 text-[13px] font-medium text-white/90 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{t}
                  </span>
                ))}
              </div>
            </div>
            {/* live "pro on the way" card, desktop only */}
            <div className="zx-bleed-right pointer-events-none absolute bottom-16 right-10 hidden xl:block">
              <Reveal delay={0.6} y={24} className="pointer-events-auto">
                <LiveJob />
              </Reveal>
            </div>
          </div>
        </VideoHero>
      </div>

      {/* ── Services + pros, with the sticky booking panel ───────────────── */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:mt-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <section id="services" className="scroll-mt-24">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <Kicker>Services</Kicker>
                <Headline size="md" as="h2" className={H2}>What do you need done?</Headline>
              </div>
              <span className="hidden shrink-0 pb-2 text-[13px] text-gray-500 sm:block">{services.length} services · Hover a tile to preview</span>
            </Reveal>
            <div className="mt-8">
              <ServiceTiles selected={selectedService} onSelect={selectService} />
            </div>
          </section>

          {/* Booking panel inline on mobile / tablet */}
          <div className="mt-8 lg:hidden">
            <BookingPanel id={PANEL_ID_MOBILE} state={booking} />
          </div>

          {/* ── Pros near you (live partner directory) ───────────────────── */}
          <section id="pros" className="mt-20 scroll-mt-24 md:mt-28">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <Kicker>Pros near you</Kicker>
                <Headline size="md" as="h2" className={H2}>Verified professionals, listed live.</Headline>
              </div>
              {!prosLoading && pros.length > 0 && <span className="hidden shrink-0 pb-2 text-[13px] text-gray-500 sm:block">{pros.length} pro{pros.length > 1 ? 's' : ''}</span>}
            </Reveal>

            {prosLoading ? (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[0, 1].map(i => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                    <div className="h-28 animate-pulse bg-gray-100" />
                    <div className="space-y-2 p-4 pt-7"><div className="h-3.5 w-1/2 animate-pulse rounded bg-gray-200" /><div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" /><div className="mt-4 h-9 animate-pulse rounded-full bg-gray-100" /></div>
                  </div>
                ))}
              </div>
            ) : pros.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pros.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i, 6) * 0.06} y={14} amount={0.1}><ProCard p={p} onBook={() => requestBooking(p)} /></Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="mt-8">
                <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:grid-cols-[1.05fr_1fr]">
                  {/* left: what every pro goes through, over a calm photo */}
                  <div className="relative isolate min-h-[260px] overflow-hidden bg-[#05080E] p-6 text-white md:p-8">
                    <img src={PHOTOS.plumbing[0].src} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
                    <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#05080E] via-[#05080E]/75 to-[#05080E]/20" />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/85 backdrop-blur"><MapPin size={12} /> Opening area by area</span>
                    <p className="mt-4 max-w-[20ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[30px]">Every pro is checked before their first booking.</p>
                    <ol className="mt-6 space-y-3">
                      {[
                        { icon: <BadgeCheck size={15} />, t: 'ID and address check' },
                        { icon: <ShieldCheck size={15} />, t: 'Police verification' },
                        { icon: <CalendarClock size={15} />, t: 'Then listed here, with live slots' },
                      ].map((st, i) => (
                        <li key={st.t} className="flex items-center gap-3 text-[14px] text-white/85">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-300 ring-1 ring-white/15">{st.icon}</span>
                          <span><span className="mr-1.5 text-[12px] tabular-nums text-white/45">0{i + 1}</span>{st.t}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {/* right: get told when pros go live nearby */}
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Coming to your area</p>
                    <p className="mt-2 text-[20px] font-semibold leading-[1.15] tracking-[-0.025em] text-gray-900 md:text-[24px]">Get a message when verified pros are bookable near you.</p>
                    <div className="mt-5"><WaitlistForm product="book" cta="Notify me" /></div>
                    <a href={`${PARTNER_URL}/services`} className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">Work in home services? Listing is free <ArrowUpRight size={14} /></a>
                  </div>
                </div>
              </Reveal>
            )}
          </section>
        </div>

        {/* ── Sticky booking panel (desktop) ──────────────────────────────── */}
        <aside className="hidden lg:sticky lg:top-20 lg:block">
          <BookingPanel id={PANEL_ID} state={booking} />
        </aside>
      </div>

      {/* ── How a booking works (pinned story) ───────────────────────────── */}
      <div className="-mx-4 mt-24 md:mx-0 md:mt-36 md:overflow-clip md:rounded-3xl">
        <ScrollStory id="how" chapters={CHAPTERS}
          intro={<Kicker light>How a booking works</Kicker>} />
      </div>

      {/* ── Craft bento ──────────────────────────────────────────────────── */}
      <section className="mt-24 md:mt-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal><Kicker>Every room, every fix</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg" as="h2" className={`max-w-[18ch] ${H2}`}>Skilled hands, booked like an order.</Headline></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5"><Sub className="max-w-[52ch]">Carpentry, painting and the jobs nobody wants to chase a number for. Tap one to start a booking.</Sub></Reveal>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-12 md:gap-4 md:[grid-auto-rows:240px]">
          <Reveal y={24} className="col-span-2 md:col-span-7 md:row-span-2">
            <CraftTile photo={PHOTOS.carpenter[0]} title="Carpenter" sub="Repairs, fittings, assembly" onClick={() => pickById('sv7')} className="aspect-[4/3] md:aspect-auto md:h-full" />
          </Reveal>
          <Reveal y={24} delay={0.08} className="col-span-2 md:col-span-5">
            <CraftTile photo={PHOTOS.painting[0]} title="Painter" sub="Rooms, touch-ups, textures" onClick={() => pickById('sv4')} className="aspect-[16/10] md:aspect-auto md:h-full" />
          </Reveal>
          <Reveal y={24} delay={0.14} className="col-span-2 md:col-span-5">
            <CraftTile photo={PHOTOS.pestControl[2]} title="Pest control" sub="Listed as verified pros join" className="aspect-[16/10] md:aspect-auto md:h-full" />
          </Reveal>
          <Reveal y={24} delay={0.06} className="md:col-span-4">
            <CraftTile photo={PHOTOS.acRepair[4]} title="AC service" sub="Service, gas refill, install" onClick={() => pickById('sv5')} className="aspect-[4/5] sm:aspect-[16/10] md:aspect-auto md:h-full" />
          </Reveal>
          <Reveal y={24} delay={0.12} className="md:col-span-4">
            <CraftTile photo={PHOTOS.carpenter[3]} title="Handyman" sub="Small fixes, mounting" onClick={() => pickById('sv10')} className="aspect-[4/5] sm:aspect-[16/10] md:aspect-auto md:h-full" />
          </Reveal>
          <Reveal y={24} delay={0.18} className="col-span-2 md:col-span-4">
            <CraftTile photo={PHOTOS.painting[1]} title="Fresh coat" sub="Painter · one room or the whole home" onClick={() => pickById('sv4')} className="aspect-[16/10] md:aspect-auto md:h-full" />
          </Reveal>
        </div>
      </section>

      {/* ── Safety & policies (Spotlight cards) ──────────────────────────── */}
      <div className="-mx-4 mt-24 md:mx-0 md:mt-36">
        <Dark className="py-24 md:rounded-3xl md:py-32">
          <Glow x="20%" y="10%" alpha={0.3} />
          <Glow x="85%" y="90%" size={700} alpha={0.2} />
          <Grain />
          <div className="relative px-5 md:px-12 lg:px-16">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal><Kicker light>Safety &amp; policies</Kicker></Reveal>
                <Reveal delay={0.05}><Headline size="lg" as="h2" light className={`max-w-[16ch] ${H2}`}>Every booking, the same standard.</Headline></Reveal>
              </div>
              <Reveal delay={0.1} className="lg:col-span-5"><Sub light className="max-w-[48ch]">Rules on every job, not promises made case by case. If we fall short, the remedy is already decided.</Sub></Reveal>
            </div>
            <Stagger className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-4 lg:gap-5" step={0.1}>
              {POLICIES.map(c => (
                <Spotlight key={c.t} className="h-full">
                  <div className="flex h-full flex-col p-4 sm:p-6 md:p-7">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10"><c.icon size={19} /></span>
                    <p className="mt-6 text-[34px] font-semibold leading-none tracking-[-0.05em] text-white sm:mt-10 sm:text-[44px] md:text-[52px]"><Counter to={c.n} format={c.f} /></p>
                    <p className="mt-3 text-[14px] font-semibold tracking-[-0.01em] text-white sm:text-[15.5px]">{c.t}</p>
                    <p className="mt-1.5 text-[12.5px] leading-[1.5] text-white/60 sm:text-[13.5px]">{c.s}</p>
                  </div>
                </Spotlight>
              ))}
            </Stagger>
          </div>
        </Dark>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mt-24 scroll-mt-24 md:mt-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal><Kicker>FAQ</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="md" as="h2" className={H2}>Questions, answered.</Headline></Reveal>
            <Reveal delay={0.1}><Sub className="mt-4">Anything else? Support is available Mon–Sat at <a href="mailto:support@zyphix.in" className="font-semibold text-emerald-700">support@zyphix.in</a>.</Sub></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="rounded-3xl border border-gray-200 bg-white px-5 sm:px-8">
              <Accordion items={FAQ} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA for professionals (zooming video) ──────────────────── */}
      <div className="-mx-4 mt-24 md:mx-0 md:mt-36 md:overflow-hidden md:rounded-3xl">
        <ZoomVideo clip={VIDEOS.haircut}>
          <div className="w-full px-5 pb-12 md:px-12 md:pb-16 lg:px-16">
            <Kicker light>For professionals</Kicker>
            <h2 className="max-w-[16ch] text-balance text-[36px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[48px] md:text-[58px]">
              Work your own neighbourhood. Get paid every week.
            </h2>
            <p className="mt-5 max-w-[50ch] text-[16px] leading-[1.6] text-white/75 md:text-[18px]">Electricians, plumbers, cleaners, beauticians and more. Listing is free; verification takes a few days.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic><GlowButton href={PARTNER_URL}>Join Zyphix Book <ArrowUpRight size={16} /></GlowButton></Magnetic>
              <GhostButton href="#faq">How verification works</GhostButton>
            </div>
          </div>
        </ZoomVideo>
      </div>
    </div>
  );
}
