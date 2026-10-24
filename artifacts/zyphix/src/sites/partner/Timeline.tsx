import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PhoneCall, BadgeCheck, ClipboardList, Rocket } from 'lucide-react';
import { SectionHead, G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { fade } from './shared';

/* ── 5-step onboarding timeline ──────────────────────────────────────────── */
const STEPS = [
  { icon: FileText, t: 'Apply online', d: 'Pick your track and complete a short guided form. It takes a few minutes and there is no fee.', time: 'Day 0', need: ['Phone number', 'Area / pin code', 'Track details'] },
  { icon: PhoneCall, t: 'Verification call', d: 'Your onboarding manager calls within 2 working days to confirm details and walk through what happens next.', time: 'Within 2 working days', need: ['Government ID', 'Business or trade details'] },
  { icon: BadgeCheck, t: 'Document & background check', d: 'We verify ID, licences and, for Zyphix Book professionals, run a background check. Only the last four characters of your ID are entered online.', time: 'A few days', need: ['Licence / FSSAI / GST', 'Address proof', 'Bank account'] },
  { icon: ClipboardList, t: 'Set up & train', d: 'Menu, catalogue or rate card goes live with our help. A short training session covers the partner app for your track.', time: 'One session', need: ['Menu or product list', 'Photos', 'Availability'] },
  { icon: Rocket, t: 'Go live', d: 'Start receiving orders or bookings from customers near you. Your manager checks in during the first week.', time: 'First order', need: ['Partner app installed', 'Online status on'] },
];

export function Timeline() {
  return (
    <section id="onboarding" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <SectionHead eyebrow="How onboarding works" title="From application to first order in five steps." sub="The same process for every track, run by a real onboarding manager. Here is what happens and what you will need at each step." />

        {/* desktop: horizontal */}
        <div className="relative mt-14 hidden lg:block">
          <div aria-hidden className="absolute left-[10%] right-[10%] top-[26px] h-0.5 bg-gray-200" />
          <div aria-hidden className="absolute left-[10%] top-[26px] h-0.5 w-[40%]" style={{ background: G }} />
          <ol className="grid grid-cols-5 gap-5">
            {STEPS.map((s, i) => (
              <motion.li key={s.t} {...fade(.08 * i)} className="relative">
                <div className="flex justify-center">
                  <span className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-4 border-white text-white shadow-md" style={{ background: i < 3 ? G : '#0B1220' }}><s.icon size={20} /></span>
                </div>
                <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(11,18,32,.08)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-bold text-gray-600">{s.time}</span>
                  </div>
                  <h3 className="mt-2 text-[16px] font-extrabold leading-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{s.t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{s.d}</p>
                  <p className="mt-4 text-[10.5px] font-bold uppercase tracking-wider text-gray-400">What you need</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.need.map(n => <li key={n} className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">{n}</li>)}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* mobile: vertical */}
        <ol className="relative mt-12 space-y-6 lg:hidden">
          <div aria-hidden className="absolute bottom-6 left-[25px] top-6 w-0.5 bg-gray-200" />
          {STEPS.map((s, i) => (
            <motion.li key={s.t} {...fade(.06 * i)} className="relative flex gap-4">
              <span className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border-4 border-white text-white shadow-md" style={{ background: i < 3 ? G : '#0B1220' }}><s.icon size={20} /></span>
              <div className="flex-1 rounded-3xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-bold text-gray-600">{s.time}</span>
                </div>
                <h3 className="mt-1.5 text-[17px] font-extrabold text-gray-900" style={{ fontFamily: HEAD_FONT }}>{s.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-600">{s.d}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {s.need.map(n => <li key={n} className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">{n}</li>)}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
