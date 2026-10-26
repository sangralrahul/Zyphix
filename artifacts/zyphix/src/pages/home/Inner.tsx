import React from 'react';
import { motion } from '@/lib/motion';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { FONT, Container } from '@/ui/kit';
import { VideoHero, Kicker, Sub, Reveal, isStatic, EASE } from '@/ui/cinema';
import { SplitHeadline, type Part } from '@/ui/motion2';
import type { Clip, Photo } from '@/data/media';
import { Display } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Shared shell for the main-site inner marketing pages (About, Contact,
   Investors, Blog, App): transparent header over a short video/photo hero,
   Geist, the home page's Container, type scale and section spacing.
──────────────────────────────────────────────────────────────────────────── */

export function InnerPage({ title, children }: { title?: string; children: React.ReactNode }) {
  React.useEffect(() => { if (title) document.title = `${title} · Zyphix`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased" style={{ fontFamily: FONT }}>
      <SiteHeader variant="transparent" />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Display headline used in every inner hero: 44 → 64 → 76px, max 3 lines at 1440. */
export const HERO_H1 = 'max-w-[16ch] text-balance text-[44px] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-[62px] md:text-[76px]';

function PhotoBackdrop({ photo, position = 'center' }: { photo: Photo; position?: string }) {
  return (
    <div className="absolute inset-0">
      <img src={photo.src} alt="" aria-hidden className="h-full w-full object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-[#05080E]/45" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.6) 0%, rgba(5,8,14,.05) 40%, rgba(5,8,14,.3) 70%, rgba(5,8,14,.95) 100%)' }} />
    </div>
  );
}

/**
 * Short cinematic hero for inner pages. Pass a `clip` (video) or a `photo`.
 * `aside` renders to the right on desktop (e.g. a phone mock-up).
 */
export function InnerHero({ clip, photo, kicker, parts, sub, children, aside, height = 'min-h-[70svh] md:min-h-[76svh]', position }: {
  clip?: Clip; photo?: Photo; kicker: string; parts: Part[]; sub?: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode; height?: string; position?: string;
}) {
  const stat = isStatic();
  const fade = (d: number) => (stat ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } });
  const body = (
    <Container className="pb-16 pt-36 md:pb-24 md:pt-44">
      <div className={aside ? 'grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16' : ''}>
        <div>
          <motion.div {...fade(0.1)}><Kicker light>{kicker}</Kicker></motion.div>
          <SplitHeadline parts={parts} delay={0.2} className={HERO_H1} />
          {sub && <motion.div {...fade(0.6)}><Sub light className="mt-6 max-w-[54ch]">{sub}</Sub></motion.div>}
          {children && <motion.div {...fade(0.75)} className="mt-9">{children}</motion.div>}
        </div>
        {aside && <motion.div {...fade(0.9)} className="hidden lg:block">{aside}</motion.div>}
      </div>
    </Container>
  );
  if (clip) return <VideoHero clip={clip} height={height} dim={0.45} position={position}>{body}</VideoHero>;
  return (
    <section className={`relative isolate flex ${height} w-full items-end overflow-hidden bg-[#05080E] text-white`}>
      {photo && <PhotoBackdrop photo={photo} position={position} />}
      <div className="relative z-10 w-full">{body}</div>
    </section>
  );
}

/** Section intro: kicker + h2 (48–58px) + lead. */
export function SectionIntro({ kicker, title, sub, light = false, align = 'left', className = '' }: { kicker: string; title: React.ReactNode; sub?: React.ReactNode; light?: boolean; align?: 'left' | 'center'; className?: string }) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto flex flex-col items-center text-center' : ''} ${className}`}>
      <Reveal><Kicker light={light}>{kicker}</Kicker></Reveal>
      <Reveal delay={0.05}><Display light={light} className={center ? 'mx-auto' : ''}>{title}</Display></Reveal>
      {sub && <Reveal delay={0.1}><Sub light={light} className={`mt-6 max-w-[56ch] ${center ? 'mx-auto' : ''}`}>{sub}</Sub></Reveal>}
    </div>
  );
}

/** Standard page section: py-24 md:py-36 on the shared Container. */
export function Band({ children, tone = 'white', className = '', id }: { children: React.ReactNode; tone?: 'white' | 'soft' | 'dark'; className?: string; id?: string }) {
  const bg = tone === 'dark' ? 'bg-[#05080E] text-white' : tone === 'soft' ? 'bg-[#F6F7F9] text-gray-900' : 'bg-white text-gray-900';
  return (
    <section id={id} className={`relative overflow-clip py-24 md:py-36 ${bg} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Card surface shared by the inner pages. */
export const panel = 'rounded-3xl border border-gray-200 bg-white';
export const iconChip = 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
export const h3 = 'text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-gray-900 md:text-[24px]';
export const body = 'text-[15px] leading-[1.6] text-gray-600';
