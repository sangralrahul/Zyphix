import React from 'react';
import { ArrowUpRight, Check, Play } from 'lucide-react';
import { BgVideo, Reveal, G } from '@/ui/cinema';
import { WIDE, metaFor, orderedServices, type Service } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Service category grid — big photo tiles in a bento; every tile that has a
   clip (Plumber, Electrician, AC Service) reveals its video on hover (always
   visible on touch devices, where it plays once in view).
──────────────────────────────────────────────────────────────────────────── */

function Tile({ service, selected, onSelect, wide, index }: { service: Service; selected: boolean; onSelect: () => void; wide: boolean; index: number }) {
  const m = metaFor(service);
  const Icon = m.icon;
  return (
    <Reveal delay={Math.min(index * 0.05, 0.4)} y={16} amount={0.1} className={wide ? 'col-span-2' : ''}>
      <button type="button" onClick={onSelect} aria-pressed={selected}
        className={`group relative isolate block h-full w-full overflow-hidden rounded-3xl bg-gray-900 text-left text-white outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
          selected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#F8F9FA]' : ''
        }`}>
        <img src={m.photo.src} alt={m.photo.alt} loading="lazy" decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
        {m.clip && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <BgVideo clip={m.clip} dim={0} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/85 via-[#05080E]/20 to-[#05080E]/10" />

        <span className="absolute left-4 top-4 flex items-center gap-1.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-md"><Icon size={16} /></span>
          {m.clip && <span className="hidden h-7 items-center gap-1 rounded-full border border-white/15 bg-black/25 px-2.5 text-[11px] font-medium text-white/85 backdrop-blur-md transition-opacity group-hover:opacity-0 sm:inline-flex [@media(hover:none)]:hidden"><Play size={10} fill="currentColor" /> Preview</span>}
        </span>
        <span className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white transition-all duration-300 ${selected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} style={{ background: G }}>
          <Check size={14} strokeWidth={3} />
        </span>

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className={`font-semibold tracking-[-0.03em] ${wide ? 'text-[20px] md:text-[26px]' : 'text-[16px] md:text-[18px]'}`}>{service.title}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-white/70 md:text-[13px]">{m.blurb}</p>
          </div>
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-colors ${selected ? 'bg-white text-gray-900' : 'group-hover:bg-white group-hover:text-gray-900'}`}>
            {selected ? <Check size={15} strokeWidth={2.5} /> : <ArrowUpRight size={15} />}
          </span>
        </div>
      </button>
    </Reveal>
  );
}

export function ServiceTiles({ selected, onSelect }: { selected: string | null; onSelect: (s: Service) => void }) {
  const list = orderedServices();
  return (
    <div className="grid grid-cols-2 gap-3 [grid-auto-rows:168px] sm:[grid-auto-rows:210px] md:gap-4 lg:grid-cols-4 lg:[grid-auto-rows:220px]">
      {list.map((s, i) => (
        <Tile key={s.id} service={s} index={i} wide={WIDE.has(s.id)} selected={selected === s.id} onSelect={() => onSelect(s)} />
      ))}
    </div>
  );
}
