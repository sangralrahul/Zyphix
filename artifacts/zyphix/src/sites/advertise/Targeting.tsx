import React from 'react';
import { MapPin, Layers, Clock, Store, UtensilsCrossed, Wrench, ArrowRight } from 'lucide-react';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2 } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   How targeting works — CSS radius diagram with pin + three callouts.
──────────────────────────────────────────────────────────────────────────── */

const CALLOUTS = [
  { icon: <MapPin size={18} />, t: 'By delivery area / pin codes', d: 'Pick the pin codes or the radius around partner stores you care about. Your placement is shown only to customers whose delivery address falls inside it — nobody in the wrong city, ever.', chips: ['Pin codes', 'Radius', 'Sectors / wards'] },
  { icon: <Layers size={18} />, t: 'By category intent', d: 'Attach the placement to a category, a search term or a product in Zyphix Now, Eats or Book. It appears when a customer is already inside that part of the app.', chips: ['Category', 'Search term', 'Product'] },
  { icon: <Clock size={18} />, t: 'By time of day', d: 'Run breakfast placements in the morning, dinner placements from 6 pm, or a weekend-only schedule. Dayparts are set per placement, at no extra cost.', chips: ['Dayparts', 'Weekdays / weekends', 'Date range'] },
];

const SHOPS: Array<{ icon: React.ReactNode; x: string; y: string; label: string; tone: string; dim?: boolean }> = [
  { icon: <Store size={13} />, x: '38%', y: '36%', label: 'Sharma Kirana', tone: '#0DA366' },
  { icon: <UtensilsCrossed size={13} />, x: '60%', y: '42%', label: 'Biryani House', tone: '#EA580C' },
  { icon: <Store size={13} />, x: '47%', y: '66%', label: 'Daily Needs', tone: '#0DA366' },
  { icon: <Wrench size={13} />, x: '66%', y: '62%', label: 'FixIt Pros', tone: '#2563EB' },
  { icon: <Store size={13} />, x: '18%', y: '20%', label: 'Out of area', tone: '#9CA3AF', dim: true },
  { icon: <UtensilsCrossed size={13} />, x: '84%', y: '24%', label: 'Out of area', tone: '#9CA3AF', dim: true },
  { icon: <Store size={13} />, x: '82%', y: '84%', label: 'Out of area', tone: '#9CA3AF', dim: true },
];

function RadiusDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[32px] border border-gray-200 bg-white">
      {/* street grid */}
      <div aria-hidden className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#D1D5DB 2px, transparent 2px), linear-gradient(90deg, #D1D5DB 2px, transparent 2px)', backgroundSize: '176px 176px', opacity: .6 }} />
      {/* a "road" diagonal */}
      <div aria-hidden className="absolute left-[-10%] top-[48%] h-[10px] w-[120%] rotate-[-18deg] rounded-full bg-gray-200" />
      {/* rings */}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-emerald-300/80" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(13,163,102,.16), rgba(13,163,102,.06) 70%, transparent)' }} />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/60" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-emerald-400/10" style={{ animationDuration: '3s' }} />
      {/* ring labels */}
      <span className="absolute left-1/2 top-[13%] -translate-x-1/2 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm">Delivery area · ~3 km</span>
      <span className="absolute left-1/2 top-[27%] -translate-x-1/2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">Core · 6 pin codes</span>

      {/* shops */}
      {SHOPS.map(s => (
        <div key={s.label + s.x} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: s.x, top: s.y }}>
          <div className={`flex items-center gap-1.5 rounded-full border bg-white py-1 pl-1 pr-2.5 shadow-sm ${s.dim ? 'border-gray-200 opacity-60' : 'border-gray-200'}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: s.tone }}>{s.icon}</span>
            <span className={`text-[10.5px] font-bold ${s.dim ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{s.label}</span>
          </div>
        </div>
      ))}

      {/* customer pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div className="relative flex flex-col items-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white text-white shadow-[0_10px_24px_rgba(13,163,102,.45)]" style={{ background: G }}><MapPin size={18} /></span>
          <span className="-mt-1 h-3 w-3 rotate-45 rounded-sm" style={{ background: G }} />
          <span className="mt-1 whitespace-nowrap rounded-lg bg-[#0B1220] px-2 py-1 text-[10.5px] font-bold text-white">Customer · Sector 12</span>
        </div>
      </div>

      {/* legend */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-gray-200 bg-white/95 px-3 py-2 text-[10.5px] font-semibold text-gray-600 backdrop-blur">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: G }} /> Kirana</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Restaurant</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Service pro</span>
        <span className="flex items-center gap-1.5 text-gray-400"><span className="h-2.5 w-2.5 rounded-full bg-gray-300" /> Not shown your ad</span>
      </div>
    </div>
  );
}

export function Targeting() {
  return (
    <section id="targeting" className={`${CONTAINER} scroll-mt-20 py-20 md:py-24`}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow>How targeting works</Eyebrow>
          <H2>You target a delivery area, not a demographic.</H2>
          <p className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-gray-600">
            Every Zyphix order is fulfilled by a partner within a few kilometres of the customer. We use the same boundary for advertising: a placement is shown only to customers whose address sits inside the delivery areas you choose, at the moments you choose.
          </p>
          <ol className="mt-8 space-y-4">
            {CALLOUTS.map((c, i) => (
              <li key={c.t} className="flex gap-4 rounded-3xl border border-gray-200 bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{c.icon}</span>
                <div>
                  <p className="text-[11.5px] font-bold uppercase tracking-wider text-gray-400">Layer {i + 1}</p>
                  <h3 className="mt-0.5 text-[17px] font-extrabold text-gray-900" style={{ fontFamily: HEAD_FONT }}>{c.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{c.d}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{c.chips.map(ch => <span key={ch} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11.5px] font-semibold text-gray-700">{ch}</span>)}</div>
                </div>
              </li>
            ))}
          </ol>
          <a href="#contact" className="mt-8 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: G }}>Map my areas with partnerships <ArrowRight size={16} /></a>
        </div>
        <RadiusDiagram />
      </div>
    </section>
  );
}
