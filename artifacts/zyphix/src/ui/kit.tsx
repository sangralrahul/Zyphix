import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from '@/lib/motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   Zyphix UI kit — Stripe / Linear-style design system (green accent kept).
   Typography: Inter everywhere, tight tracking, big display sizes.
   Surfaces: white / #FAFAFA / ink #0B0F19; borders 1px #E6E8EC; soft shadows.
   Color: brand green #0DA366 with mesh gradients (green → teal → mint).
   Imagery: product UI in device frames, abstract gradients — no stock photos.
   ════════════════════════════════════════════════════════════════════════════ */

export const G = '#0DA366';
export const G_DEEP = '#077A46';
export const TEAL = '#06B6D4';
export const MINT = '#A7F3D0';
export const INK = '#0B0F19';
export const INK_2 = '#111827';
export const FONT = "'Geist', 'Geist Fallback', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const SERIF = "'Instrument Serif', 'Instrument Serif Fallback', ui-serif, Georgia, serif";

export const fade = (delay = 0, y = 14) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

/* ── Layout ─────────────────────────────────────────────────────────────── */
export function Container({ children, className = '', narrow = false }: { children: React.ReactNode; className?: string; narrow?: boolean }) {
  return <div className={`mx-auto w-full px-5 sm:px-8 ${narrow ? 'max-w-[880px]' : 'max-w-[1120px]'} ${className}`}>{children}</div>;
}

export function Section({ id, children, className = '', tone = 'white' }: { id?: string; children: React.ReactNode; className?: string; tone?: 'white' | 'soft' | 'ink' }) {
  const bg = tone === 'ink' ? 'bg-[#0B0F19] text-white' : tone === 'soft' ? 'bg-[#FAFAFA]' : 'bg-white';
  return <section id={id} className={`relative py-20 md:py-28 ${bg} ${className}`}>{children}</section>;
}

/** Hairline divider with a subtle gradient highlight, Stripe-style. */
export function Hairline({ dark = false }: { dark?: boolean }) {
  return <div className={`h-px w-full ${dark ? 'bg-gradient-to-r from-transparent via-white/15 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'}`} />;
}

/* ── Backgrounds ────────────────────────────────────────────────────────── */
/** Soft green mesh gradient (absolute, behind content). */
export function Mesh({ className = '', intensity = 1 }: { className?: string; intensity?: number }) {
  const a = 0.35 * intensity, b = 0.22 * intensity, c = 0.18 * intensity;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute -top-40 left-1/2 h-[720px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, rgba(13,163,102,${a}), transparent 70%)` }} />
      <div className="absolute -top-20 right-[-10%] h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, rgba(6,182,212,${b}), transparent 70%)` }} />
      <div className="absolute top-40 left-[-10%] h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, rgba(167,243,208,${c}), transparent 70%)` }} />
    </div>
  );
}

/** Fine grid lines fading out (for ink or white sections). */
export function Grid({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const line = dark ? 'rgba(255,255,255,.07)' : 'rgba(11,15,25,.06)';
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      style={{ backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`, backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)' }} />
  );
}

/** Animated gradient "aurora" band used in hero visuals. */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-70 blur-3xl"
        style={{ background: `conic-gradient(from 180deg at 50% 50%, ${G} 0deg, ${TEAL} 90deg, ${MINT} 180deg, ${G_DEEP} 270deg, ${G} 360deg)` }}
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
    </div>
  );
}

/* ── Typography ─────────────────────────────────────────────────────────── */
export function Eyebrow({ children, dark = false, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 text-[13px] font-semibold tracking-tight ${dark ? 'text-emerald-300' : 'text-emerald-700'} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{children}
    </p>
  );
}

export function Display({ children, className = '', as: Tag = 'h1', size = 'xl' }: { children: React.ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3'; size?: 'xl' | 'lg' | 'md' }) {
  const s = size === 'xl' ? 'text-[2.75rem] sm:text-[3.6rem] lg:text-[4.4rem] leading-[1.02]' : size === 'lg' ? 'text-[2.1rem] sm:text-[2.7rem] lg:text-[3.2rem] leading-[1.06]' : 'text-[1.6rem] sm:text-[1.9rem] leading-[1.15]';
  return <Tag className={`font-semibold tracking-[-0.035em] ${s} ${className}`} style={{ fontFamily: FONT }}>{children}</Tag>;
}

export function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${G} 0%, ${TEAL} 60%, ${G_DEEP} 100%)` }}>{children}</span>;
}

export function Lead({ children, dark = false, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return <p className={`text-[17px] sm:text-[18px] leading-[1.6] tracking-[-0.01em] ${dark ? 'text-white/65' : 'text-gray-600'} ${className}`}>{children}</p>;
}

export function SectionTitle({ eyebrow, title, lead, dark = false, align = 'left', className = '' }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; dark?: boolean; align?: 'left' | 'center'; className?: string }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-[720px] ${className}`}>
      {eyebrow && <Eyebrow dark={dark} className="mb-4">{eyebrow}</Eyebrow>}
      <Display as="h2" size="lg" className={dark ? 'text-white' : 'text-gray-900'}>{title}</Display>
      {lead && <Lead dark={dark} className="mt-5">{lead}</Lead>}
    </div>
  );
}

/* ── Buttons ────────────────────────────────────────────────────────────── */
const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 select-none';
const sizes = { sm: 'h-9 px-4 text-[13.5px]', md: 'h-11 px-5 text-[14.5px]', lg: 'h-12 px-6 text-[15px]' };
export function Button({ href, children, variant = 'primary', size = 'md', className = '', external = false, sameTab = false, onClick, type }: { href?: string; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'white'; size?: 'sm' | 'md' | 'lg'; className?: string; external?: boolean; /** absolute URL that should NOT open in a new tab (e.g. auth.zyphix.in) */ sameTab?: boolean; onClick?: () => void; type?: 'button' | 'submit' }) {
  const v = variant === 'primary' ? 'text-white shadow-[0_1px_2px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.2)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(13,163,102,.35)]'
    : variant === 'secondary' ? 'bg-white text-gray-900 border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:border-gray-300 hover:-translate-y-px'
    : variant === 'white' ? 'bg-white text-gray-900 hover:bg-gray-100'
    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100';
  const style = variant === 'primary' ? { background: `linear-gradient(180deg, #13B874 0%, ${G} 100%)` } : undefined;
  const cls = `${base} ${sizes[size]} ${v} ${className}`;
  if (href) {
    if (external || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      const newTab = href.startsWith('http') && !sameTab;
      return <a href={href} className={cls} style={style} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>{children}</a>;
    }
    return <Link href={href} className={cls} style={style}>{children}</Link>;
  }
  return <button type={type ?? 'button'} onClick={onClick} className={cls} style={style}>{children}</button>;
}

export function ArrowLink({ href, children, className = '', dark = false }: { href: string; children: React.ReactNode; className?: string; dark?: boolean }) {
  const cls = `group inline-flex items-center gap-1.5 text-[14.5px] font-semibold ${dark ? 'text-emerald-300' : 'text-emerald-700'} ${className}`;
  const inner = <>{children}<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>;
  return href.startsWith('http') || href.startsWith('#') ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

/* ── Surfaces ───────────────────────────────────────────────────────────── */
export function Card({ children, className = '', dark = false, hover = true }: { children: React.ReactNode; className?: string; dark?: boolean; hover?: boolean }) {
  return (
    <div className={`relative rounded-2xl border ${dark ? 'border-white/10 bg-white/[.04]' : 'border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]'} ${hover ? (dark ? 'transition hover:bg-white/[.07]' : 'transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(11,15,25,.08)]') : ''} ${className}`}>{children}</div>
  );
}

export function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/60 bg-white/70 shadow-[0_8px_40px_rgba(11,15,25,.08)] backdrop-blur-xl ${className}`}>{children}</div>;
}

/** Bento grid: 12-col, children pass `className="md:col-span-N"` */
export function Bento({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 gap-4 md:grid-cols-12 ${className}`}>{children}</div>;
}

export function IconTile({ children, tone = 'green', className = '' }: { children: React.ReactNode; tone?: 'green' | 'teal' | 'ink' | 'orange' | 'violet' | 'blue'; className?: string }) {
  const t = { green: 'bg-emerald-50 text-emerald-700 ring-emerald-100', teal: 'bg-cyan-50 text-cyan-700 ring-cyan-100', ink: 'bg-gray-900 text-white ring-gray-900', orange: 'bg-orange-50 text-orange-600 ring-orange-100', violet: 'bg-violet-50 text-violet-700 ring-violet-100', blue: 'bg-blue-50 text-blue-700 ring-blue-100' }[tone];
  return <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${t} ${className}`}>{children}</span>;
}

export function Chip({ children, tone = 'gray', className = '' }: { children: React.ReactNode; tone?: 'gray' | 'green' | 'ink' | 'orange' | 'violet' | 'blue'; className?: string }) {
  const t = { gray: 'bg-gray-100 text-gray-700', green: 'bg-emerald-50 text-emerald-700', ink: 'bg-gray-900 text-white', orange: 'bg-orange-50 text-orange-700', violet: 'bg-violet-50 text-violet-700', blue: 'bg-blue-50 text-blue-700' }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${t} ${className}`}>{children}</span>;
}

export function SampleTag({ className = '' }: { className?: string }) {
  return <span className={`rounded-md border border-gray-200 bg-white/80 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-gray-400 ${className}`}>Sample</span>;
}

/* ── Device frames ──────────────────────────────────────────────────────── */
export function Phone({ children, className = '', dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={`relative mx-auto w-[300px] rounded-[44px] p-[10px] ${dark ? 'bg-[#1b1f2a]' : 'bg-[#0B0F19]'} shadow-[0_30px_80px_rgba(11,15,25,.35),inset_0_0_0_1px_rgba(255,255,255,.08)] ${className}`}>
      <div className="absolute left-1/2 top-[14px] z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
      <div className="relative overflow-hidden rounded-[36px] bg-white" style={{ aspectRatio: '9 / 19' }}>
        <div className="flex h-[44px] items-end justify-between px-6 pb-1 text-[11px] font-semibold text-gray-900"><span>9:41</span><span className="tracking-tight">●●● ◔ ▮</span></div>
        {children}
      </div>
    </div>
  );
}

export function Browser({ children, className = '', url = 'zyphix.in' }: { children: React.ReactNode; className?: string; url?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_80px_rgba(11,15,25,.18)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-gray-200 bg-[#FAFAFA] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" /><span className="h-2.5 w-2.5 rounded-full bg-gray-300" /><span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <span className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-[11.5px] text-gray-500 ring-1 ring-gray-200">https://{url}</span>
      </div>
      {children}
    </div>
  );
}

/* ── Interactive ────────────────────────────────────────────────────────── */
export function Accordion({ items, dark = false }: { items: { q: string; a: React.ReactNode }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={`divide-y ${dark ? 'divide-white/10' : 'divide-gray-200'}`}>
      {items.map((it, i) => (
        <div key={it.q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left">
            <span className={`text-[16px] font-semibold tracking-[-0.01em] ${dark ? 'text-white' : 'text-gray-900'}`}>{it.q}</span>
            <ChevronDown size={18} className={`shrink-0 transition-transform ${dark ? 'text-white/50' : 'text-gray-400'} ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <div className={`-mt-1 pb-6 text-[15px] leading-[1.65] ${dark ? 'text-white/65' : 'text-gray-600'}`}>{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

export function Marquee({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <div className="relative overflow-hidden py-3" style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
      <div className="flex w-max gap-3 whitespace-nowrap" style={{ animation: 'marquee 45s linear infinite' }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${dark ? 'border-white/10 bg-white/5 text-white/70' : 'border-gray-200 bg-white text-gray-600'}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/** Simple sparkline from numbers (for sample dashboards). */
export function Sparkline({ data, color = G, className = '' }: { data: number[]; color?: string; className?: string }) {
  const w = 120, h = 36, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ');
  return <svg viewBox={`0 0 ${w} ${h}`} className={`h-9 w-[120px] ${className}`}><polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts} /></svg>;
}
