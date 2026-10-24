import React from 'react';
import { Eye, MousePointerClick, ShoppingBag, IndianRupee, Check, Download, CalendarDays, LayoutPanelTop, Rows3, TicketPercent } from 'lucide-react';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2, SampleTag } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Reporting — mock report dashboard (labelled "Sample report") + checklist.
   Numbers below are illustrative placeholders, not performance claims.
──────────────────────────────────────────────────────────────────────────── */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const IMPRESSIONS = [42, 55, 48, 61, 70, 88, 76];   // relative heights (0–100)
const TAPS =        [30, 38, 34, 44, 52, 66, 58];

function Sparkline({ points, color = G, h = 36, w = 120 }: { points: number[]; color?: string; h?: number; w?: number }) {
  const max = Math.max(...points), min = Math.min(...points);
  const d = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * (h - 6) - 3}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      <polyline points={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={h - ((points[points.length - 1] - min) / (max - min || 1)) * (h - 6) - 3} r="3" fill={color} />
    </svg>
  );
}

const KPIS = [
  { icon: <Eye size={15} />, label: 'Impressions', value: '—', hint: 'Times your placement was on screen', spark: [20, 28, 24, 34, 40, 52, 46] },
  { icon: <MousePointerClick size={15} />, label: 'Taps', value: '—', hint: 'Opens of your product, store or coupon', spark: [10, 14, 13, 18, 22, 30, 26] },
  { icon: <ShoppingBag size={15} />, label: 'Orders attributed', value: '—', hint: 'Orders containing your item after a tap', spark: [4, 6, 5, 8, 9, 14, 12] },
  { icon: <IndianRupee size={15} />, label: 'Spend', value: 'Flat', hint: 'Fixed for the period, known upfront', spark: [50, 50, 50, 50, 50, 50, 50] },
];

const PLACEMENT_ROWS = [
  { icon: <LayoutPanelTop size={13} />, n: 'Home banner · Dwarka (6 pin codes)', period: '1–14 Oct', share: 72, status: 'Live' },
  { icon: <Rows3 size={13} />, n: 'Breakfast row · Dwarka (6 pin codes)', period: '1–30 Oct', share: 58, status: 'Live' },
  { icon: <TicketPercent size={13} />, n: 'OATS50 coupon · Dwarka', period: '1–31 Oct', share: 41, status: 'Live' },
];

function ReportCard() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_24px_60px_rgba(11,18,32,.10)]">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Placement report <SampleTag /></p>
          <p className="mt-0.5 text-[15px] font-black text-gray-900" style={{ fontFamily: HEAD_FONT }}>YourBrand · Oats launch · Dwarka</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-700"><CalendarDays size={13} /> 1–14 Oct</span>
          <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-bold text-white" style={{ background: G }}><Download size={13} /> CSV</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 md:grid-cols-4">
        {KPIS.map(k => (
          <div key={k.label} className="bg-white p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">{k.icon} {k.label}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-[24px] font-black leading-none tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{k.value}</p>
              <Sparkline points={k.spark} w={72} h={28} color={k.label === 'Spend' ? '#9CA3AF' : G} />
            </div>
            <p className="mt-2 text-[11px] leading-snug text-gray-500">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* bar chart */}
      <div className="border-t border-gray-200 px-5 py-5">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-bold text-gray-800">Daily impressions vs taps</p>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: G }} /> Impressions</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-200" /> Taps</span>
          </div>
        </div>
        <div className="mt-4 grid h-[120px] grid-cols-7 items-end gap-3">
          {DAYS.map((d, i) => (
            <div key={d} className="flex h-full flex-col items-center justify-end gap-1.5">
              <div className="flex h-full w-full items-end justify-center gap-1">
                <div className="w-full max-w-[18px] rounded-t-md" style={{ height: `${IMPRESSIONS[i]}%`, background: G }} />
                <div className="w-full max-w-[18px] rounded-t-md bg-emerald-200" style={{ height: `${TAPS[i]}%` }} />
              </div>
              <span className="text-[10.5px] font-semibold text-gray-400">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* placement rows */}
      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-[12.5px] font-bold text-gray-800">By placement</p>
        <div className="mt-3 space-y-2.5">
          {PLACEMENT_ROWS.map(r => (
            <div key={r.n} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">{r.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-bold text-gray-900">{r.n}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full" style={{ width: `${r.share}%`, background: G }} /></div>
                  <span className="text-[10.5px] text-gray-400">{r.period}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RECEIVE = [
  'Impressions, taps and tap-through rate per placement, per area, per day',
  'Orders attributed to each placement, with the SKUs or dishes they contained',
  'Coupon redemptions and the discount value settled, for offers placements',
  'Daypart breakdown so you can see when the placement actually worked',
  'A plain-language summary from your partnerships manager at the end of each period',
  'CSV export of everything above — no vanity dashboards, no fine print',
];

export function Reporting() {
  return (
    <section id="reporting" className="scroll-mt-20 border-y border-gray-200 bg-gray-50">
      <div className={`${CONTAINER} grid items-center gap-12 py-20 md:py-24 lg:grid-cols-[.85fr_1.15fr]`}>
        <div>
          <Eyebrow>Reporting</Eyebrow>
          <H2>Placement-level reporting, down to the order.</H2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">
            Because the placement and the purchase happen in the same app, we can tell you what each one did — not just how many people scrolled past it. Every advertiser receives:
          </p>
          <ul className="mt-6 space-y-3">
            {RECEIVE.map(r => (
              <li key={r} className="flex items-start gap-3 text-[14.5px] leading-snug text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check size={12} /></span>{r}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[12.5px] text-gray-500">Reports are shared at the end of each booked period, with a mid-period check-in for runs of 14 days or longer.</p>
        </div>
        <ReportCard />
      </div>
    </section>
  );
}
