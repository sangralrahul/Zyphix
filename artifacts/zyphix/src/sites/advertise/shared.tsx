import React from 'react';
import { HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Shared bits for advertise.zyphix.in sections.
──────────────────────────────────────────────────────────────────────────── */

export const MAIN_SITE = 'https://zyphix.in';
export const PARTNER_SITE = 'https://partner.zyphix.in';
export const PARTNERSHIPS_EMAIL = 'partnerships@zyphix.in';

export const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

export const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .55, ease: 'easeOut' as const, delay },
});

export const CONTAINER = 'mx-auto max-w-[1180px] px-5';

export function Eyebrow({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={`text-[12px] font-bold uppercase tracking-[.12em] ${tone === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>{children}</p>;
}

export function H2({ children, className = '', tone = 'light' }: { children: React.ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  return (
    <h2 className={`mt-3 text-[1.9rem] md:text-[2.5rem] font-black tracking-[-0.03em] leading-[1.08] ${tone === 'dark' ? 'text-white' : 'text-gray-900'} ${className}`} style={{ fontFamily: HEAD_FONT }}>
      {children}
    </h2>
  );
}

export function H3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-black tracking-tight text-gray-900 ${className}`} style={{ fontFamily: HEAD_FONT }}>{children}</h3>;
}

/** Small "Sponsored" label used inside every placement mock-up. */
export function SponsoredTag({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[.08em] ${dark ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'} ${className}`}>
      Sponsored
    </span>
  );
}

/** Subtle "Sample" marker for mock data. */
export function SampleTag({ className = '' }: { className?: string }) {
  return <span className={`inline-flex items-center rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 ${className}`}>Sample</span>;
}
