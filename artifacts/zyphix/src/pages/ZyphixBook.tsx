import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Wrench, Zap, Sparkles, Paintbrush, Snowflake, Droplets, Hammer, ChefHat, Truck, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import { services } from '@/data/mockData';
import { usePartners, tagList, type PartnerListing } from '@/lib/partners';
import { Chip, IconTile, Card, Button, G, FONT } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Book — home services from verified professionals.
   Stripe-neutral app page: service tiles, a plain booking card, and the
   live professionals list. No hero, no trust strip.
──────────────────────────────────────────────────────────────────────────── */

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

type Service = typeof services[0];
type Tone = React.ComponentProps<typeof IconTile>['tone'];

/* Icon + tile tone per service (keyed by id) */
const SERVICE_META: Record<string, { icon: LucideIcon; tone: Tone }> = {
  sv1:  { icon: Wrench,     tone: 'blue' },
  sv2:  { icon: Zap,        tone: 'orange' },
  sv3:  { icon: Sparkles,   tone: 'green' },
  sv4:  { icon: Paintbrush, tone: 'violet' },
  sv5:  { icon: Snowflake,  tone: 'teal' },
  sv6:  { icon: Droplets,   tone: 'blue' },
  sv7:  { icon: Hammer,     tone: 'orange' },
  sv8:  { icon: ChefHat,    tone: 'green' },
  sv9:  { icon: Truck,      tone: 'violet' },
  sv10: { icon: Wrench,     tone: 'teal' },
};
const metaFor = (s: Service) => SERVICE_META[s.id] || { icon: Wrench, tone: 'blue' as Tone };

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

const STEPS = ['Pick a service', 'Choose a slot', 'Confirm'];

const enter = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, ease: 'easeOut' as const } };

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
    <motion.div {...enter} className="mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
      {/* Header row */}
      <div className="flex items-baseline gap-2.5">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-gray-900">Zyphix Book</h1>
        <span className="text-[13px] text-gray-500">Home services · verified professionals</span>
      </div>

      {/* How it works — one quiet line */}
      <p className="mt-2 text-[13px] text-gray-500">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span className="mx-2 text-gray-300">·</span>}
            <span className="font-medium text-gray-700">{i + 1}</span> {s}
          </React.Fragment>
        ))}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div>
          {/* Service tiles */}
          <section id="services" className="scroll-mt-24">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-gray-900">Services</h2>
              <span className="text-[13px] text-gray-500">{services.length} services</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {services.map(service => {
                const isSelected = selectedService === service.id;
                const m = metaFor(service);
                const Icon = m.icon;
                return (
                  <button key={service.id}
                    onClick={() => { setSelectedService(isSelected ? null : service.id); if (isSelected) setSelectedSlot(null); }}
                    aria-pressed={isSelected}
                    className={`relative flex h-full w-full flex-col items-start rounded-xl border bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,.03)] transition ${
                      isSelected ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    {isSelected && (
                      <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: G }}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <IconTile tone={m.tone}><Icon size={18} /></IconTile>
                    <p className="mt-3 text-[14px] font-semibold tracking-[-0.01em] text-gray-900">{service.title}</p>
                    <p className="mt-0.5 text-[12.5px] text-gray-500">{service.category}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Verified professionals (live partner directory) — only when non-empty */}
          {prosLoading ? (
            <section className="mt-8">
              <div className="h-5 w-56 animate-pulse rounded bg-gray-200" />
              <Card hover={false} className="mt-3 divide-y divide-gray-100 rounded-xl">
                {[0, 1].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 animate-pulse rounded bg-gray-200" /><div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" /></div>
                    <div className="h-9 w-28 animate-pulse rounded-full bg-gray-100" />
                  </div>
                ))}
              </Card>
            </section>
          ) : pros.length > 0 && (
            <section className="mt-8">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-gray-900">Verified professionals near you</h2>
                <span className="text-[13px] text-gray-500">{pros.length} pro{pros.length > 1 ? 's' : ''}</span>
              </div>
              <Card hover={false} className="mt-3 divide-y divide-gray-100 rounded-xl">
                {pros.map(p => {
                  const skills = tagList(p.tags || '').filter(t => t.toLowerCase() !== (p.category || '').toLowerCase()).slice(0, 3);
                  const place = [p.locality, p.city].filter(Boolean).join(', ');
                  const line = [p.category, place].filter(Boolean).join(' · ');
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <IconTile tone="green" className="text-[13px] font-semibold">{proInitials(p.name)}</IconTile>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <p className="truncate text-[14px] font-semibold text-gray-900">{p.name}</p>
                          <ShieldCheck size={14} className="shrink-0 text-emerald-600" aria-label="Verified" />
                        </div>
                        {line && <p className="truncate text-[12.5px] text-gray-500">{line}</p>}
                        {skills.length > 0 && (
                          <div className="mt-1.5 hidden flex-wrap gap-1 sm:flex">
                            {skills.map(s => <Chip key={s}>{s}</Chip>)}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => requestBooking(p)}>Request booking</Button>
                    </div>
                  );
                })}
              </Card>
            </section>
          )}
        </div>

        {/* Booking panel */}
        <aside id={BOOKING_PANEL_ID} className="scroll-mt-24 lg:sticky lg:top-24">
          <Card hover={false} className="rounded-xl p-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">Booking</h2>

            {activeService ? (
              <>
                {(() => {
                  const m = metaFor(activeService);
                  const Icon = m.icon;
                  return (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-[#FAFAFA] p-3">
                      <IconTile tone={m.tone}><Icon size={18} /></IconTile>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-gray-900">{activeService.title}</p>
                        <p className="text-[12.5px] text-gray-500">{activeService.category} · next slot {activeService.nextSlot}</p>
                      </div>
                    </div>
                  );
                })()}

                <p className="mt-4 text-[13px] font-medium text-gray-700">Time · Today</p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const on = selectedSlot === slot;
                    return (
                      <button key={slot} onClick={() => setSelectedSlot(slot)} aria-pressed={on}
                        className={`rounded-lg border py-2 text-[12.5px] font-medium transition ${
                          on ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}>
                        {slot.replace(':00', '')}
                      </button>
                    );
                  })}
                </div>

                <dl className="mt-4 space-y-1.5 text-[13px]">
                  <div className="flex justify-between"><dt className="text-gray-500">Service</dt><dd className="font-medium text-gray-900">{activeService.title}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Slot</dt><dd className="font-medium text-gray-900">{selectedSlot || '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Visit charge</dt><dd className="text-gray-900">Shown before confirm</dd></div>
                </dl>

                <button type="button" onClick={handleBook} disabled={!selectedSlot}
                  className={`mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[13.5px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    booked ? 'bg-emerald-800' : ''
                  }`}
                  style={booked ? undefined : { background: G }}>
                  {booked ? <><Check size={15} strokeWidth={3} /> Booking confirmed</> : 'Confirm booking'}
                </button>
                <p className="mt-2.5 text-center text-[12px] text-gray-500">Free cancellation up to 1 hour before your slot.</p>
              </>
            ) : (
              <p className="mt-2 text-[13px] text-gray-500">Select a service to see today's time slots.</p>
            )}
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}
