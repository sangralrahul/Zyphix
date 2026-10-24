import React from 'react';
import { MessageSquareText, FileText, PenTool, Rocket, FileBarChart2, ArrowRight } from 'lucide-react';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2 } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Process timeline — horizontal on desktop, vertical on mobile.
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: <MessageSquareText size={20} />, t: 'Brief', d: 'Tell us your goal, the areas you serve and the products or outlets you want to push. A 15-minute call or the form below is enough.', need: ['Goal', 'Areas / pin codes', 'Products or outlets'], when: 'Day 0' },
  { icon: <FileText size={20} />, t: 'Plan & flat quote', d: 'Partnerships proposes formats, dayparts and a period, with a single flat price. No auctions and nothing that changes after you sign off.', need: ['Budget range', 'Preferred dates'], when: 'Within 2 working days' },
  { icon: <PenTool size={20} />, t: 'Creative review', d: 'Send artwork and copy to spec. We check it against the format, the "Sponsored" labelling rules and local-language fit, and suggest fixes if needed.', need: ['Images to spec', 'Headline + CTA', 'Coupon terms (if any)'], when: '1–3 working days' },
  { icon: <Rocket size={20} />, t: 'Go live', d: 'The placement goes live in the chosen areas on the agreed date. You get a confirmation with screenshots from the app and a live link to check it yourself.', need: ['Sign-off on quote'], when: 'Agreed start date' },
  { icon: <FileBarChart2 size={20} />, t: 'Report', d: 'At the end of the period (and mid-way for longer runs) you receive the placement report and a short written summary — plus options to extend or add areas.', need: ['Nothing — we send it'], when: 'End of period' },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 border-y border-gray-200 bg-gray-50">
      <div className={`${CONTAINER} py-20 md:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <Eyebrow>How it works</Eyebrow>
            <H2>Brief to report in five steps.</H2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">A named partnerships manager runs the whole thing with you. Most first campaigns are live within two weeks of the brief.</p>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: G }}>Start with a brief <ArrowRight size={16} /></a>
        </div>

        <ol className="relative mt-14 grid gap-8 md:grid-cols-5 md:gap-5">
          {/* connector */}
          <div aria-hidden className="absolute left-[27px] top-0 bottom-0 w-px bg-gray-200 md:left-0 md:right-0 md:top-[27px] md:h-px md:w-auto md:bottom-auto" />
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative flex gap-5 md:block">
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-gray-50 text-white shadow-[0_8px_20px_rgba(13,163,102,.3)]" style={{ background: G }}>
                {s.icon}
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1220] text-[11px] font-black text-white">{i + 1}</span>
              </div>
              <div className="flex-1 md:mt-5">
                <p className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-700">{s.when}</p>
                <h3 className="mt-1 text-[18px] font-extrabold text-gray-900" style={{ fontFamily: HEAD_FONT }}>{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.d}</p>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">What you need</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {s.need.map(n => <span key={n} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-gray-700">{n}</span>)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
