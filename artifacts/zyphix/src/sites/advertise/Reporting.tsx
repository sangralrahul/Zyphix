import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download } from 'lucide-react';
import { Section, Container, Eyebrow, Display, Lead, ArrowLink, Browser, Sparkline, SampleTag, Chip, fade, G, TEAL } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Reporting feature story — text + Browser mock of a sample report.
   KPI values are shown as "—": no invented performance numbers.
──────────────────────────────────────────────────────────────────────────── */

const KPIS = ['Impressions', 'Taps', 'Attributed orders', 'Coupon redemptions'];
const BARS = [38, 52, 46, 70, 64, 80, 58];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ReportMock() {
  return (
    <Browser url="advertise.zyphix.in/reports/sample">
      <div className="bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Campaign report</p>
            <p className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em] text-gray-900">YourBrand oats · Dwarka · 14 days</p>
          </div>
          <div className="flex items-center gap-2"><SampleTag /><span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11.5px] font-medium text-gray-600"><Download size={12} /> CSV</span></div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {KPIS.map(k => (
            <div key={k} className="rounded-xl border border-gray-200 bg-[#FAFAFA] p-3">
              <p className="text-[11px] font-medium text-gray-500">{k}</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-gray-300">—</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between"><p className="text-[12px] font-medium text-gray-700">Taps by day</p><Chip>Home banner</Chip></div>
            <div className="mt-4 flex h-[90px] items-end gap-2">
              {BARS.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: .6, delay: .1 + i * .05, ease: [0.22, 1, 0.36, 1] }} className="w-full rounded-md" style={{ background: i === 5 ? G : 'rgba(13,163,102,.25)' }} />
                  <span className="text-[9.5px] text-gray-400">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-[12px] font-medium text-gray-700">By placement</p>
            <ul className="mt-3 space-y-2.5">
              {[['Home banner', G, [3, 5, 4, 7, 6, 8, 7]], ['Sponsored row', TEAL, [2, 3, 5, 4, 6, 7, 9]], ['Coupon', '#9CA3AF', [1, 1, 2, 2, 3, 4, 4]]].map(([n, c, d]) => (
                <li key={n as string} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[12px] text-gray-700"><span className="h-2 w-2 rounded-full" style={{ background: c as string }} />{n as string}</span>
                  <Sparkline data={d as number[]} color={c as string} className="h-6 w-[72px]" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Browser>
  );
}

export function Reporting() {
  return (
    <Section id="reporting" tone="soft" className="scroll-mt-16">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div {...fade(0.1, 20)} className="order-2 lg:order-1"><ReportMock /></motion.div>
        <div className="order-1 max-w-[520px] lg:order-2">
          <Eyebrow>Reporting</Eyebrow>
          <Display as="h2" size="lg" className="mt-4 text-gray-900">One report per placement. Nothing blended.</Display>
          <Lead className="mt-5">Every placement is reported on its own, so you can see which format, area and period did the work.</Lead>
          <ul className="mt-7 space-y-3">
            {[
              'Impressions, taps and attributed orders per placement',
              'Coupon redemptions matched to checkout',
              'End-of-period summary, with CSV on request',
            ].map(t => <li key={t} className="flex gap-3 text-[15px] text-gray-600"><Check size={16} className="mt-1 shrink-0 text-emerald-600" />{t}</li>)}
          </ul>
          <ArrowLink href="#faq" className="mt-7">How attribution works</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
