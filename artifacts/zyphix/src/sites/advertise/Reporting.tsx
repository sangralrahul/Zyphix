import React from 'react';
import { Check, Download, ArrowRight, CalendarDays } from 'lucide-react';
import { Container, Sparkline, G, TEAL } from '@/ui/kit';
import { Light, Kicker, Headline, Sub, Reveal, Stagger } from '@/ui/cinema';
import { IllustrativeTag } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Reporting — copy + an illustrative report dashboard card. KPI values are
   shown as "—": no invented performance numbers, only the shape of a report.
──────────────────────────────────────────────────────────────────────────── */

const KPIS: Array<[string, number[]]> = [
  ['Impressions', [3, 4, 4, 6, 5, 7, 8]],
  ['Taps', [2, 3, 3, 5, 4, 6, 6]],
  ['Attributed orders', [1, 2, 2, 3, 3, 4, 5]],
  ['Coupon redemptions', [1, 1, 2, 2, 3, 3, 4]],
];
const BARS = [38, 52, 46, 70, 64, 80, 58];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PLACEMENTS: Array<[string, string, number[]]> = [
  ['Home banner', G, [3, 5, 4, 7, 6, 8, 7]],
  ['Sponsored row', TEAL, [2, 3, 5, 4, 6, 7, 9]],
  ['Coupon', '#9CA3AF', [1, 1, 2, 2, 3, 4, 4]],
];

function Dashboard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_40px_100px_rgba(11,15,25,.14)]">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">Campaign report</p>
          <p className="mt-0.5 truncate text-[15.5px] font-semibold tracking-[-0.01em] text-gray-900">YourBrand oats · 6 areas · 14 days</p>
        </div>
        <div className="flex items-center gap-2">
          <IllustrativeTag />
          <span className="hidden items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 sm:inline-flex"><CalendarDays size={13} /> Period</span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-600"><Download size={13} /> CSV</span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map(([k, d]) => (
            <div key={k} className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-3.5">
              <p className="text-[11.5px] font-medium leading-tight text-gray-500">{k}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-[22px] font-semibold leading-none tracking-[-0.02em] text-gray-300">—</p>
                <Sparkline data={d} className="h-7 w-[64px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between"><p className="text-[12.5px] font-semibold text-gray-800">Taps by day</p><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Home banner</span></div>
            <div className="mt-4 flex h-[110px] items-end gap-2">
              {BARS.map((h, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div className="w-full rounded-md" style={{ height: `${h}%`, background: i === 5 ? G : 'rgba(13,163,102,.22)' }} />
                  <span className="text-[10px] text-gray-400">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-[12.5px] font-semibold text-gray-800">By placement</p>
            <ul className="mt-3 divide-y divide-gray-100">
              {PLACEMENTS.map(([n, c, d]) => (
                <li key={n} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="flex items-center gap-2 text-[12.5px] text-gray-700"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{n}</span>
                  <Sparkline data={d} color={c} className="h-6 w-[80px]" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reporting() {
  return (
    <Light id="reporting" tone="soft" className="scroll-mt-16 py-24 md:py-36">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal><Kicker>Reporting</Kicker></Reveal>
          <Reveal delay={0.05}><Headline size="lg">One report per placement. Nothing blended.</Headline></Reveal>
          <Reveal delay={0.1}><Sub className="mt-5">Every placement is reported on its own, so you can see which format, area and period did the work.</Sub></Reveal>
          <Stagger className="mt-8 divide-y divide-gray-200 border-y border-gray-200" step={0.07}>
            {[
              'Impressions, taps and attributed orders per placement',
              'Coupon redemptions matched to checkout',
              'End-of-period summary, with CSV on request',
            ].map(t => <div key={t} className="flex gap-3 py-4 text-[15px] text-gray-700"><Check size={16} className="mt-1 shrink-0 text-emerald-600" />{t}</div>)}
          </Stagger>
          <Reveal delay={0.1}>
            <a href="#faq" className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-800">How attribution works <ArrowRight size={15} /></a>
          </Reveal>
        </div>
        <Reveal y={36} delay={0.1} className="lg:col-span-7"><Dashboard /></Reveal>
      </Container>
    </Light>
  );
}
