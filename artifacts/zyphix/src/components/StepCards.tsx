import React from 'react';
import { pexelsPhoto } from '@/data/media';

/* Photo-led "how it works" cards shared by Zyphix Eats and Zyphix Book. */
export type Step = { photo: number; t: string; s: string };

export function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-gray-900 md:text-[28px]">{title}</h2>
        {sub && <p className="mt-1 text-[14px] text-gray-500 md:text-[15px]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StepCards({ steps, accent = '#0B7F50' }: { steps: Step[]; accent?: string }) {
  return (
    <ol className={`mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 ${steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {steps.map((st, i) => (
        <li key={st.t} className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <img src={pexelsPhoto(st.photo, 640)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-white px-2.5 text-[12.5px] font-bold tabular-nums shadow-sm" style={{ color: accent }}>{i + 1}</span>
          </div>
          <div className="p-5">
            <p className="text-[16px] font-semibold tracking-[-0.015em] text-gray-900">{st.t}</p>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-gray-500">{st.s}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
