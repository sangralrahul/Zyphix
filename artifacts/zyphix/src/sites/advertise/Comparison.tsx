import React from 'react';
import { Check, Minus } from 'lucide-react';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2 } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Comparison — Zyphix Ads vs social feeds / search ads (qualitative, honest).
──────────────────────────────────────────────────────────────────────────── */

const ROWS: Array<{ k: string; z: string; o: string; zGood?: boolean }> = [
  { k: 'Where it appears', z: 'Inside a shopping app — on the home screen, in a category, in search results or at checkout', o: 'In a social feed between posts, or above web search results', zGood: true },
  { k: 'Customer intent', z: 'Already deciding what to buy from nearby stores, restaurants or pros', o: 'Browsing, chatting or researching — purchase may be days away', zGood: true },
  { k: 'Targeting unit', z: 'Delivery area: pin codes or a radius around partner stores', o: 'Demographics, interests, lookalikes, broad geo-radius', zGood: true },
  { k: 'Pricing model', z: 'Flat rate per placement per period, quoted before go-live', o: 'Auction — CPC / CPM varies with competition and season', zGood: true },
  { k: 'Reporting', z: 'Impressions, taps and orders attributed per placement, with SKUs', o: 'Impressions, clicks, conversions via pixel or app events', zGood: true },
  { k: 'Creative effort', z: 'One image + short copy; we review and help adapt', o: 'Multiple creatives, formats and ongoing A/B testing' },
  { k: 'Minimum commitment', z: 'One placement, one area, 7 days', o: 'Usually none, but results need sustained spend' },
  { k: 'Reach', z: 'Bounded by live Zyphix partners — launching area by area', o: 'Very large, nationwide' },
];

export function Comparison() {
  return (
    <section className={`${CONTAINER} py-20 md:py-24`}>
      <div className="max-w-[680px]">
        <Eyebrow>Zyphix Ads vs the usual channels</Eyebrow>
        <H2>Different job to a feed. Honest about where each wins.</H2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">Zyphix Ads is not a replacement for your social or search budget. It is the last step: the moment someone a few streets away is about to buy.</p>
      </div>

      <div className="mt-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white">
        <div className="hidden grid-cols-[1.1fr_1.6fr_1.6fr] border-b border-gray-200 bg-gray-50 md:grid">
          <div className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-gray-400">Criteria</div>
          <div className="flex items-center gap-2 border-l border-gray-200 px-6 py-4">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: G }} />
            <span className="text-[14px] font-black text-gray-900" style={{ fontFamily: HEAD_FONT }}>Zyphix Ads</span>
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 px-6 py-4">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="text-[14px] font-black text-gray-700" style={{ fontFamily: HEAD_FONT }}>Social feeds / search ads</span>
          </div>
        </div>
        {ROWS.map((r, i) => (
          <div key={r.k} className={`grid md:grid-cols-[1.1fr_1.6fr_1.6fr] ${i > 0 ? 'border-t border-gray-200' : ''}`}>
            <div className="px-6 pb-2 pt-5 text-[13.5px] font-bold text-gray-900 md:py-5">{r.k}</div>
            <div className="flex items-start gap-3 px-6 py-2 md:border-l md:border-gray-200 md:py-5" style={{ background: 'rgba(13,163,102,.035)' }}>
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: r.zGood ? G : '#9CA3AF' }}>{r.zGood ? <Check size={12} /> : <Minus size={12} />}</span>
              <p className="text-[14px] leading-relaxed text-gray-800"><span className="mr-1.5 inline rounded bg-emerald-100 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 md:hidden">Zyphix</span>{r.z}</p>
            </div>
            <div className="flex items-start gap-3 px-6 pb-5 pt-2 md:border-l md:border-gray-200 md:py-5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600"><Minus size={12} /></span>
              <p className="text-[14px] leading-relaxed text-gray-600"><span className="mr-1.5 inline rounded bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-600 md:hidden">Feeds / search</span>{r.o}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] text-gray-500">Qualitative comparison of how each channel works. We do not publish performance benchmarks while the early advertiser programme is running.</p>
    </section>
  );
}
