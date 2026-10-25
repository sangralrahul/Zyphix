/**
 * Cinematic kit — full-bleed video, scroll reveals, parallax, counters.
 * Used by every Zyphix site (home, now, eats, book, partner, advertise, support).
 *
 * Rules baked in:
 *  - Every reveal is "once"; when `?noanim` is in the URL, or the page runs under an
 *    automation driver (screenshots), or the user prefers reduced motion, content
 *    renders immediately with no transforms.
 *  - Video never blocks: poster paints first, 720p on small screens, 1080p otherwise,
 *    `playsInline muted loop autoPlay`, and a failed load silently keeps the poster.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, animate as fmAnimate, type MotionProps } from 'framer-motion';
import { pickRendition, posterAt, photoSrcSet, type Clip, type Photo } from '@/data/media';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const G = '#0DA366';

/* ── Motion guard ─────────────────────────────────────────────────────────── */
let _static: boolean | null = null;
/** True when animations should be skipped entirely (screenshots, reduced motion, ?noanim). */
export function isStatic(): boolean {
  if (_static !== null) return _static;
  if (typeof window === 'undefined') return (_static = true);
  const q = window.location.search.includes('noanim');
  const wd = !!(navigator as any).webdriver;
  const rm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  return (_static = q || wd || rm);
}

/* ── Reveal ───────────────────────────────────────────────────────────────── */
type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span' | 'article' | 'header' | 'figure';
  style?: React.CSSProperties;
};
/** Scroll-triggered fade/slide. `delay` in seconds (capped at 0.8). */
export function Reveal({ children, delay = 0, y = 24, x = 0, scale = 1, blur = false, once = true, amount = 0.2, className = '', as = 'div', style }: RevealProps) {
  const Tag = (motion as any)[as] as typeof motion.div;
  if (isStatic()) {
    const Plain = as as any;
    return <Plain className={className} style={style}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y, x, scale, filter: blur ? 'blur(10px)' : 'none' }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay: Math.min(delay, 0.8) }}
    >
      {children}
    </Tag>
  );
}

/** Staggers direct children (each child is wrapped). */
export function Stagger({ children, step = 0.07, y = 20, className = '', amount = 0.15 }: { children: React.ReactNode; step?: number; y?: number; className?: string; amount?: number }) {
  const kids = React.Children.toArray(children);
  return (
    <div className={className}>
      {kids.map((k, i) => (
        <Reveal key={(k as any)?.key ?? i} delay={i * step} y={y} amount={amount} className="contents">
          {k}
        </Reveal>
      ))}
    </div>
  );
}

/** Headline that reveals word by word. */
export function Words({ text, className = '', delay = 0, as: Tag = 'h1', style }: { text: string; className?: string; delay?: number; as?: 'h1' | 'h2' | 'h3' | 'p'; style?: React.CSSProperties }) {
  const words = text.split(' ');
  if (isStatic()) return <Tag className={className} style={style}>{text}</Tag>;
  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.05 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* ── Video ───────────────────────────────────────────────────────────────── */
function useSmall() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const on = () => setSmall(window.innerWidth < 768);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return small;
}

/**
 * Background video that fills its parent (parent must be `relative overflow-hidden`).
 * Performance rules:
 *  - nothing is downloaded until the box is within ~1 screen of the viewport (`priority` skips this for heroes);
 *  - the rendition matches the box size (360p / 540p / 720p / 1080p);
 *  - it only plays while visible and pauses off-screen; once loaded it stays loaded,
 *    so scrolling back up is instant;
 *  - the poster is a resized JPEG, never the full-size original.
 */
export function BgVideo({ clip, className = '', dim = 0.45, position = 'center', blur = false, playWhenVisible = true, priority = false }: { clip: Clip; className?: string; dim?: number; position?: string; blur?: boolean; playWhenVisible?: boolean; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(priority);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width || window.innerWidth);
    if (typeof IntersectionObserver === 'undefined') { setNear(true); setVisible(true); return; }
    const nearObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); nearObs.disconnect(); } }, { rootMargin: '120% 0px 120% 0px' });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.12 });
    nearObs.observe(el); visObs.observe(el);
    return () => { nearObs.disconnect(); visObs.disconnect(); };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playWhenVisible && visible && document.visibilityState === 'visible') { const p = v.play(); if (p) p.catch(() => {}); }
    else v.pause();
  }, [visible, near, playWhenVisible, ready]);

  const src = useMemo(() => (width ? pickRendition(clip, width) : ''), [clip, width]);
  const poster = useMemo(() => posterAt(clip.poster, width > 900 ? 1280 : width > 500 ? 960 : 640), [clip.poster, width]);

  return (
    <div ref={box} aria-hidden className={`absolute inset-0 ${className}`}>
      {width > 0 && (
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }}
          loading={priority ? 'eager' : 'lazy'} decoding="async" {...(priority ? { fetchpriority: 'high' } as any : {})} />
      )}
      {!failed && !isStatic() && near && src && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ objectPosition: position, filter: blur ? 'blur(6px) scale(1.05)' : undefined, opacity: ready ? 1 : 0 }}
          src={src}
          muted
          loop
          playsInline
          autoPlay={priority}
          preload={priority ? 'auto' : 'metadata'}
          disablePictureInPicture
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}
      {dim > 0 && <div className="absolute inset-0" style={{ background: `rgba(5,8,14,${dim})` }} />}
    </div>
  );
}

/** Card-sized video (16:10 by default) that plays when scrolled into view. */
export function VideoCard({ clip, className = '', ratio = '16/10', rounded = 'rounded-2xl', overlay, children }: { clip: Clip; className?: string; ratio?: string; rounded?: string; overlay?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${rounded} bg-gray-900 ${className}`} style={{ aspectRatio: ratio }}>
      <BgVideo clip={clip} dim={0} />
      {overlay}
      {children}
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
/** Full-viewport video hero. Children are the foreground content (already centred/left aligned by you). */
export function VideoHero({ clip, children, height = 'min-h-[92svh]', dim = 0.5, gradient = true, className = '', position = 'center' }: { clip: Clip; children: React.ReactNode; height?: string; dim?: number; gradient?: boolean; className?: string; position?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fg = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const stat = isStatic();
  return (
    <section ref={ref} className={`relative isolate flex ${height} w-full items-end overflow-hidden bg-[#05080E] text-white ${className}`}>
      <motion.div className="absolute inset-0" style={stat ? undefined : { y, scale }}>
        <BgVideo clip={clip} dim={dim} position={position} priority />
      </motion.div>
      {gradient && (
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.55) 0%, rgba(5,8,14,.05) 35%, rgba(5,8,14,.25) 70%, rgba(5,8,14,.95) 100%)' }} />
      )}
      <motion.div className="relative z-10 w-full" style={stat ? undefined : { opacity: fg }}>
        {children}
      </motion.div>
    </section>
  );
}

/* ── Parallax image ──────────────────────────────────────────────────────── */
export function ParallaxImage({ photo, className = '', strength = 12, ratio = '4/5', rounded = 'rounded-3xl', children }: { photo: Photo; className?: string; strength?: number; ratio?: string; rounded?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const stat = isStatic();
  return (
    <div ref={ref} className={`relative overflow-hidden bg-gray-100 ${rounded} ${className}`} style={{ aspectRatio: ratio }}>
      <motion.img
        src={photo.src}
        srcSet={photoSrcSet(photo.src)}
        sizes="(max-width: 768px) 100vw, 50vw"
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-[130%] w-full -top-[15%] object-cover"
        style={stat ? { top: 0, height: '100%' } : { y }}
      />
      {children}
    </div>
  );
}

/** Plain photo tile with gentle zoom on hover. */
export function PhotoTile({ photo, className = '', ratio = '4/3', rounded = 'rounded-2xl', children, sizes }: { photo: Photo; className?: string; ratio?: string; rounded?: string; children?: React.ReactNode; sizes?: string }) {
  return (
    <div className={`group relative overflow-hidden bg-gray-100 ${rounded} ${className}`} style={{ aspectRatio: ratio }}>
      <img src={photo.src} srcSet={photoSrcSet(photo.src)} alt={photo.alt} loading="lazy" decoding="async" sizes={sizes || '(max-width: 768px) 100vw, 40vw'} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
      {children}
    </div>
  );
}

/* ── Numbers ─────────────────────────────────────────────────────────────── */
/** Counts up from 0 when scrolled into view. `format` lets you add ₹ / % / +. */
export function Counter({ to, duration = 1.6, format = (n: number) => Math.round(n).toLocaleString('en-IN'), className = '' }: { to: number; duration?: number; format?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const [txt, setTxt] = useState(() => (isStatic() ? format(to) : format(0)));
  useEffect(() => {
    if (isStatic()) return;
    if (!inView) return;
    const c = fmAnimate(mv, to, { duration, ease: EASE, onUpdate: v => setTxt(format(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to]);
  return <span ref={ref} className={className}>{txt}</span>;
}

/* ── Scroll progress bar (top of page) ───────────────────────────────────── */
export function ScrollProgress({ color = G }: { color?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  if (isStatic()) return null;
  return <motion.div aria-hidden className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left" style={{ scaleX, background: color }} />;
}

/* ── Marquee (logos / words) ─────────────────────────────────────────────── */
export function Ticker({ items, speed = 28, className = '', dark = false, size = 'text-[15px]' }: { items: React.ReactNode[]; speed?: number; className?: string; dark?: boolean; size?: string }) {
  const row = useMemo(() => [...items, ...items], [items]);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <div className={`flex w-max gap-10 whitespace-nowrap ${size} font-medium ${dark ? 'text-white/70' : 'text-gray-500'}`} style={{ animation: isStatic() ? undefined : `zx-ticker ${speed}s linear infinite` }}>
        {row.map((it, i) => <span key={i} className="inline-flex items-center gap-3">{it}</span>)}
      </div>
      <style>{`@keyframes zx-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

/* ── Buttons for dark / photo backgrounds ────────────────────────────────── */
const btn = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 select-none';
export function GlowButton({ href, children, className = '', size = 'lg', onClick, sameTab = false }: { href?: string; children: React.ReactNode; className?: string; size?: 'md' | 'lg'; onClick?: () => void; sameTab?: boolean }) {
  const s = size === 'lg' ? 'h-13 px-7 text-[15.5px] h-[52px]' : 'h-11 px-5 text-[14.5px]';
  const cls = `${btn} ${s} text-white shadow-[0_0_0_1px_rgba(255,255,255,.08),0_12px_40px_rgba(13,163,102,.45)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,.12),0_18px_50px_rgba(13,163,102,.6)] ${className}`;
  const style = { background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` };
  if (href) {
    const ext = href.startsWith('http');
    return <a href={href} className={cls} style={style} target={ext && !sameTab ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}>{children}</a>;
  }
  return <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>;
}
export function GhostButton({ href, children, className = '', size = 'lg', onClick, light = true }: { href?: string; children: React.ReactNode; className?: string; size?: 'md' | 'lg'; onClick?: () => void; light?: boolean }) {
  const s = size === 'lg' ? 'px-7 text-[15.5px] h-[52px]' : 'h-11 px-5 text-[14.5px]';
  const tone = light ? 'border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300';
  const cls = `${btn} ${s} border ${tone} ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/* ── Section wrappers ────────────────────────────────────────────────────── */
export function Dark({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`relative overflow-clip bg-[#05080E] text-white ${className}`}>{children}</section>;
}
export function Light({ children, className = '', id, tone = 'white' }: { children: React.ReactNode; className?: string; id?: string; tone?: 'white' | 'soft' }) {
  return <section id={id} className={`relative overflow-clip ${tone === 'soft' ? 'bg-[#F6F7F9]' : 'bg-white'} text-gray-900 ${className}`}>{children}</section>;
}
/** Green radial glow for dark sections. */
export function Glow({ className = '', x = '50%', y = '0%', size = 900, alpha = 0.35 }: { className?: string; x?: string; y?: string; size?: number; alpha?: number }) {
  return <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ left: x, top: y, width: size, height: size, transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, rgba(13,163,102,${alpha}), transparent 70%)`, filter: 'blur(20px)' }} />;
}
/** Subtle film grain over dark/photo sections. */
export function Grain({ opacity = 0.06 }: { opacity?: number }) {
  return <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ opacity, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.8'/></svg>\")" }} />;
}

/* ── Big type ────────────────────────────────────────────────────────────── */
export function Headline({ children, className = '', as: Tag = 'h2', size = 'lg', light = false }: { children: React.ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3'; size?: 'xl' | 'lg' | 'md'; light?: boolean }) {
  const s = size === 'xl' ? 'text-[44px] leading-[1.02] sm:text-[64px] md:text-[84px] tracking-[-0.045em]'
    : size === 'lg' ? 'text-[34px] leading-[1.05] sm:text-[46px] md:text-[58px] tracking-[-0.04em]'
    : 'text-[26px] leading-[1.1] sm:text-[32px] md:text-[40px] tracking-[-0.03em]';
  return <Tag className={`text-balance font-semibold ${s} ${light ? 'text-white' : 'text-gray-900'} ${className}`}>{children}</Tag>;
}
export function Kicker({ children, light = false, className = '' }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return <div className={`mb-4 inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] ${light ? 'text-emerald-300' : 'text-emerald-700'} ${className}`}><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{children}</div>;
}
export function Sub({ children, light = false, className = '' }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return <p className={`text-[17px] leading-[1.6] sm:text-[19px] ${light ? 'text-white/70' : 'text-gray-600'} ${className}`}>{children}</p>;
}

/* ── Tilt card (mouse-follow) ────────────────────────────────────────────── */
export function Tilt({ children, className = '', max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 }), sry = useSpring(ry, { stiffness: 200, damping: 20 });
  if (isStatic()) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2); rx.set(-py * max * 2);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export type { MotionProps };
