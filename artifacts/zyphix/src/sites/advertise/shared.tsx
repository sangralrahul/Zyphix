import React from 'react';
import { MapPin, ChevronDown, Search, Plus, Sparkles } from 'lucide-react';
import { G, G_DEEP } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Shared bits for advertise.zyphix.in — constants and the tiny in-app UI
   fragments used inside Phone / Browser mocks. All mock data is illustrative.
──────────────────────────────────────────────────────────────────────────── */

export const MAIN_SITE = 'https://zyphix.in';
export const PARTNER_SITE = 'https://partner.zyphix.in';
export const PARTNERSHIPS_EMAIL = 'partnerships@zyphix.in';

/** Small "Sponsored" label — present on every placement mock. */
export function SponsoredTag({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-[2px] text-[8.5px] font-semibold uppercase tracking-[.08em] ${dark ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'} ${className}`}>
      Sponsored
    </span>
  );
}

/* ── App mock fragments (small, monochrome, no photos) ─────────────────── */
export function AppHeader({ area = 'Home', product = 'Zyphix Now', accent = G }: { area?: string; product?: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-1">
      <div>
        <p className="text-[9.5px] font-medium uppercase tracking-wider text-gray-400">{product}</p>
        <p className="flex items-center gap-1 text-[12px] font-semibold text-gray-900"><MapPin size={11} style={{ color: accent }} /> {area} <ChevronDown size={11} className="text-gray-400" /></p>
      </div>
      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${accent}14`, color: accent }}>30 min</span>
    </div>
  );
}

export function AppSearch({ value }: { value?: string }) {
  return (
    <div className={`mx-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] ${value ? 'border-emerald-300 bg-white text-gray-900 ring-2 ring-emerald-100' : 'border-gray-200 bg-[#FAFAFA] text-gray-400'}`}>
      <Search size={12} className="text-gray-400" /> {value ?? 'Search "milk", "bread", "eggs"'}
    </div>
  );
}

const SWATCH: Record<string, string> = {
  gray: 'linear-gradient(135deg,#F3F4F6,#E5E7EB)',
  green: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
  amber: 'linear-gradient(135deg,#FEF3C7,#FDE68A)',
  blue: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)',
  rose: 'linear-gradient(135deg,#FFE4E6,#FECDD3)',
};

export function AppTile({ name, price, tone = 'gray', spotlight = false }: { name: string; price: string; tone?: keyof typeof SWATCH; spotlight?: boolean }) {
  return (
    <div className={`relative rounded-xl border bg-white p-1.5 ${spotlight ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
      {spotlight && <span className="absolute -top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-[2px] text-[7.5px] font-semibold uppercase tracking-wider text-white" style={{ background: G }}><Sparkles size={7} /> Spotlight</span>}
      <div className="h-9 rounded-lg" style={{ background: SWATCH[tone] }} />
      <p className="mt-1 truncate text-[9.5px] font-semibold text-gray-900">{name}</p>
      <div className="mt-0.5 flex items-center justify-between">
        <p className="text-[9.5px] font-semibold text-gray-700">{price}</p>
        <span className="flex h-4 w-4 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={9} /></span>
      </div>
    </div>
  );
}

export function AppRow({ title, sponsored = false, highlight = false, children }: { title: string; sponsored?: boolean; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div className={`mx-4 mt-3 ${highlight ? 'rounded-2xl p-1.5 ring-2 ring-emerald-200' : ''}`}>
      <div className="flex items-center justify-between px-0.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-900">{title} {sponsored && <SponsoredTag />}</p>
        <span className="text-[9.5px] font-semibold text-emerald-700">See all</span>
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">{children}</div>
    </div>
  );
}

export function AppBanner({ highlight = false, headline = 'Fresh oats, now at your corner store', brand = 'Your brand' }: { highlight?: boolean; headline?: string; brand?: string }) {
  return (
    <div className={`relative mx-4 mt-3 overflow-hidden rounded-2xl p-3 text-white ${highlight ? 'ring-2 ring-emerald-200 ring-offset-2' : ''}`} style={{ background: `linear-gradient(135deg, ${G}, ${G_DEEP})` }}>
      <div aria-hidden className="absolute -right-5 -top-6 h-20 w-20 rounded-full bg-white/15" />
      <SponsoredTag dark className="absolute right-2 top-2" />
      <p className="text-[8.5px] font-medium uppercase tracking-wider text-white/75">{brand}</p>
      <p className="mt-0.5 max-w-[160px] text-[13px] font-semibold leading-tight tracking-[-0.01em]">{headline}</p>
      <span className="mt-2 inline-flex rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-emerald-700">Shop the range</span>
    </div>
  );
}

export function AppDots() {
  return <div className="mt-1.5 flex justify-center gap-1">{[0, 1, 2].map(i => <span key={i} className={`h-1 rounded-full ${i === 0 ? 'w-3.5 bg-emerald-600' : 'w-1 bg-gray-300'}`} />)}</div>;
}

export function AppGhost({ className = 'h-9' }: { className?: string }) {
  return <div className={`mx-4 mt-3 rounded-xl bg-[#F3F4F6] ${className}`} />;
}

/** "Illustrative" label for every mock placement / report (no real data shown). */
export function IllustrativeTag({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[.1em] ${dark ? 'bg-white/10 text-white/70 ring-1 ring-white/15' : 'bg-white/90 text-gray-500 ring-1 ring-gray-200'} backdrop-blur ${className}`}>
      Illustrative
    </span>
  );
}

/** Ad surfaces shown in the hero strip. */
export const SURFACES = [
  { name: 'Zyphix Now', where: 'Home banner, rows, spotlight' },
  { name: 'Zyphix Eats', where: 'Featured near you' },
  { name: 'Zyphix Book', where: 'Featured pros' },
  { name: 'In-app search', where: 'First result, your terms' },
  { name: 'Offers & checkout', where: 'Coupons at the basket' },
];
