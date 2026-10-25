import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, MapPin, Search, ShieldCheck, Wrench, X } from 'lucide-react';
import { services } from '@/data/mockData';
import { usePartners, tagList, type PartnerListing } from '@/lib/partners';
import { PHOTOS, VIDEOS } from '@/data/media';
import { Chip, Accordion, Button, FONT } from '@/ui/kit';
import { VideoHero, Words, Reveal, Stagger, Kicker, Headline, Sub, ParallaxImage, Counter, Dark, Glow, Grain, GlowButton, GhostButton, BgVideo, G } from '@/ui/cinema';
import { BookingPanel, type BookingState } from './book/BookingPanel';
import { ServiceTiles } from './book/ServiceTiles';
import { DAYS, FAQ, PANEL_ID, PANEL_ID_MOBILE, PARTNER_URL, PROMISES, metaFor, proInitials, serviceForPro, type Day, type Service } from './book/shared';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — home services from verified professionals (book.zyphix.in).
   Cinematic direction: compact video hero with a service picker, photo bento
   of services (hover video), split "how a booking works", sticky booking
   panel, live professionals, dark policy band, FAQ, final CTA for pros.
   Renders inside LightLayout (Navbar + BottomNav, 1280 container).
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: Wrench, title: 'Pick a service', body: 'Plumbing, electrical, cleaning, AC and more. Each one comes with a clear scope so you know what is covered.' },
  { icon: CalendarClock, title: 'Choose a slot', body: 'Today or tomorrow, morning to evening. The visit charge is shown before you confirm.' },
  { icon: BadgeCheck, title: 'A verified pro arrives', body: 'ID and police-verified, tracked to your door. Reschedule free if plans change; cancel free up to an hour before.' },
];

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
        <button type="submit" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 text-[13.5px] font-semibold text-white md:h-11 md:px-5" style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
          Book <ArrowRight size={14} />
        </button>
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
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [day, setDay] = useState<Day>(DAYS[0]);
  const [address, setAddress] = useState('');

  useEffect(() => { document.title = 'Zyphix Book — Home services by verified pros'; }, []);

  const handleBook = () => {
    if (selectedSlot) {
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }
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

  const booking: BookingState = { activeService, day, setDay, slot: selectedSlot, setSlot: setSelectedSlot, address, setAddress, booked, onBook: handleBook };

  return (
    <div className="w-full text-gray-900" style={{ fontFamily: FONT }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="-mx-4 md:mx-0 md:mt-4">
        <VideoHero clip={VIDEOS.cleaning} height="min-h-[560px] md:min-h-[62svh]" dim={0.45} className="md:rounded-3xl">
          <div className="px-4 pb-7 pt-16 md:px-10 md:pb-10 md:pt-20 lg:px-14">
            <Kicker light>Zyphix Book · Jammu</Kicker>
            <Words as="h1" text="Home services, done by verified pros." className="max-w-[760px] text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-[48px] md:text-[64px]" />
            <p className="mt-4 max-w-[540px] text-[15.5px] leading-[1.55] text-white/75 md:text-[18px]">
              Plumbers, electricians, cleaners and more from your own neighbourhood. ID and police-verified, price shown before you confirm.
            </p>
            <ServicePicker onPick={pickFromHero} />
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PROMISES.slice(0, 4).map(t => (
                <span key={t} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 text-[13px] font-medium text-white/90 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{t}
                </span>
              ))}
            </div>
          </div>
        </VideoHero>
      </div>

      {/* ── Services + how it works + pros, with the sticky booking panel ── */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <section id="services" className="scroll-mt-24">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <Kicker>Services</Kicker>
                <Headline size="md" as="h2">What do you need done?</Headline>
              </div>
              <span className="hidden shrink-0 pb-2 text-[13px] text-gray-500 sm:block">{services.length} services · Today &amp; tomorrow</span>
            </Reveal>
            <div className="mt-6">
              <ServiceTiles selected={selectedService} onSelect={selectService} />
            </div>
          </section>

          {/* Booking panel inline on mobile / tablet */}
          <div className="mt-8 lg:hidden">
            <BookingPanel id={PANEL_ID_MOBILE} state={booking} />
          </div>

          {/* ── How a booking works (split: parallax photo + steps) ──────── */}
          <section id="how" className="mt-20 scroll-mt-24 md:mt-28">
            <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-12">
              <Reveal x={-16} y={0}>
                <ParallaxImage photo={PHOTOS.electrician[1]} ratio="4/5" strength={10} className="shadow-[0_30px_80px_-30px_rgba(11,15,25,.35)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><ShieldCheck size={18} /></span>
                    <div>
                      <p className="text-[14.5px] font-semibold">Every pro is ID &amp; police-verified</p>
                      <p className="text-[12.5px] text-white/70">Before their first booking, not after</p>
                    </div>
                  </div>
                </ParallaxImage>
              </Reveal>
              <div>
                <Reveal><Kicker>How a booking works</Kicker></Reveal>
                <Reveal delay={0.05}><Headline size="md" as="h2">Three steps. No phone tag.</Headline></Reveal>
                <Reveal delay={0.1}><Sub className="mt-4">Pick, schedule, done. You see the price before you confirm and you can track your professional to the door.</Sub></Reveal>
                <Stagger className="mt-8 space-y-0" step={0.12}>
                  {STEPS.map(({ icon: Icon, title, body }, i) => (
                    <div key={title} className="relative flex gap-4 pb-10 last:pb-0">
                      {i < STEPS.length - 1 && <span aria-hidden className="absolute left-[22px] top-12 h-[calc(100%-56px)] w-px bg-gradient-to-b from-emerald-300 to-gray-200" />}
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-[0_8px_24px_-8px_rgba(13,163,102,.5)] ring-1 ring-emerald-100"><Icon size={19} /></span>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">Step {i + 1}</p>
                        <p className="mt-0.5 text-[18px] font-semibold tracking-[-0.02em] text-gray-900">{title}</p>
                        <p className="mt-1.5 text-[14.5px] leading-[1.6] text-gray-600">{body}</p>
                      </div>
                    </div>
                  ))}
                </Stagger>
              </div>
            </div>
          </section>

          {/* ── Pros near you (live partner directory) ───────────────────── */}
          <section id="pros" className="mt-20 scroll-mt-24 md:mt-28">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <Kicker>Pros near you</Kicker>
                <Headline size="md" as="h2">Verified professionals, listed live.</Headline>
              </div>
              {!prosLoading && pros.length > 0 && <span className="hidden shrink-0 pb-2 text-[13px] text-gray-500 sm:block">{pros.length} pro{pros.length > 1 ? 's' : ''}</span>}
            </Reveal>

            {prosLoading ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[0, 1].map(i => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                    <div className="h-28 animate-pulse bg-gray-100" />
                    <div className="space-y-2 p-4 pt-7"><div className="h-3.5 w-1/2 animate-pulse rounded bg-gray-200" /><div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" /><div className="mt-4 h-9 animate-pulse rounded-full bg-gray-100" /></div>
                  </div>
                ))}
              </div>
            ) : pros.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pros.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i, 6) * 0.06} y={14} amount={0.1}><ProCard p={p} onBook={() => requestBooking(p)} /></Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="mt-6">
                <div className="relative overflow-hidden rounded-3xl bg-[#05080E] text-white">
                  <img src={PHOTOS.plumbing[0].src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#05080E] via-[#05080E]/80 to-[#05080E]/30" />
                  <Grain />
                  <div className="relative p-6 md:p-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/85"><MapPin size={12} /> Opening area by area</span>
                    <p className="mt-4 max-w-[460px] text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[26px]">No professionals are listed in your area yet.</p>
                    <p className="mt-2 max-w-[440px] text-[14.5px] leading-[1.6] text-white/70">Pros appear here the moment they pass verification. If you work in home services, listing is free.</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <GlowButton href={`${PARTNER_URL}/services`} size="md">Join as a professional <ArrowUpRight size={15} /></GlowButton>
                      <GhostButton href="#services" size="md">Browse services</GhostButton>
                    </div>
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

      {/* ── Policy band ──────────────────────────────────────────────────── */}
      <div className="-mx-4 mt-20 md:mx-0 md:mt-28">
        <Dark className="py-20 md:rounded-3xl md:py-28">
          <Glow x="20%" y="10%" alpha={0.3} />
          <Glow x="85%" y="90%" size={700} alpha={0.2} />
          <Grain />
          <div className="relative px-5 md:px-12 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal><Kicker light>Our policies</Kicker></Reveal>
                <Reveal delay={0.05}><Headline size="lg" as="h2" light>Every booking, the same standard.</Headline></Reveal>
                <Reveal delay={0.1}><Sub light className="mt-5">These are rules on every job, not promises we make case by case. If we fall short, the remedy is already decided.</Sub></Reveal>
                <Reveal delay={0.15}>
                  <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[14px] text-white/80">
                    {PROMISES.map(t => <li key={t} className="flex items-start gap-2"><BadgeCheck size={16} className="mt-0.5 shrink-0 text-emerald-300" />{t}</li>)}
                  </ul>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Stagger className="grid grid-cols-2 gap-4 md:gap-5" step={0.1}>
                  {[
                    { n: 100, f: (n: number) => `${Math.round(n)}%`, t: 'of pros ID & police-verified', s: 'Before their first booking' },
                    { n: 100, f: (n: number) => `₹${Math.round(n)}`, t: 'off if we are late', s: 'More than 30 minutes past your slot' },
                    { n: 7, f: (n: number) => `${Math.round(n)}-day`, t: 'work guarantee', s: 'We come back and fix it, free' },
                    { n: 0, f: (n: number) => `₹${Math.round(n)}`, t: 'to reschedule or cancel', s: 'Up to 1 hour before your slot' },
                  ].map(c => (
                    <div key={c.t} className="rounded-3xl border border-white/10 bg-white/[.04] p-5 md:p-7">
                      <p className="text-[40px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[56px]"><Counter to={c.n} format={c.f} /></p>
                      <p className="mt-3 text-[15px] font-semibold tracking-[-0.01em] text-white">{c.t}</p>
                      <p className="mt-1 text-[13px] text-white/60">{c.s}</p>
                    </div>
                  ))}
                </Stagger>
              </div>
            </div>
          </div>
        </Dark>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mt-20 scroll-mt-24 md:mt-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal><Kicker>FAQ</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="md" as="h2">Questions, answered.</Headline></Reveal>
            <Reveal delay={0.1}><Sub className="mt-4">Anything else? Support is available Mon–Sat at <a href="mailto:support@zyphix.in" className="font-semibold text-emerald-700">support@zyphix.in</a>.</Sub></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="rounded-3xl border border-gray-200 bg-white px-5 sm:px-8">
              <Accordion items={FAQ} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA for professionals ──────────────────────────────────── */}
      <div className="-mx-4 mt-20 md:mx-0 md:mt-28">
        <section className="relative isolate flex min-h-[460px] items-end overflow-hidden bg-[#05080E] text-white md:min-h-[520px] md:rounded-3xl">
          <BgVideo clip={VIDEOS.salon} dim={0.5} />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.2) 0%, rgba(5,8,14,.1) 40%, rgba(5,8,14,.95) 100%)' }} />
          <Grain />
          <div className="relative z-10 w-full px-5 pb-10 pt-24 md:px-12 md:pb-14 lg:px-16">
            <Reveal><Kicker light>For professionals</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg" as="h2" light className="max-w-[720px]">Work from your own neighbourhood. Get paid every week.</Headline></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-4 max-w-[520px]">Electricians, plumbers, cleaners, beauticians and more. Listing is free; verification takes a few days.</Sub></Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <GlowButton href={PARTNER_URL}>Join Zyphix Book <ArrowUpRight size={16} /></GlowButton>
                <GhostButton href="#faq">How verification works</GhostButton>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
