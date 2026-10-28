/**
 * Motion kit v2 — the "premium" layer on top of src/ui/cinema.tsx.
 *
 *  Accent          serif-italic accent word inside a headline (Instrument Serif)
 *  ScrollStory     pinned section: scroll steps through chapters, video cross-fades
 *  HScrollGallery  pinned section: vertical scroll drives a horizontal track of cards
 *  ZoomVideo       a framed video that grows to full-bleed as you scroll (Apple-style)
 *  VideoText       giant headline with a video playing *inside* the letters
 *  ClipWall        mosaic of looping clips (plays only in view)
 *  RouteMap        live animated delivery: route draws, rider moves, ETA counts down
 *  LiveOrder       cycling order-status card (Placed → Packed → On the way → Delivered)
 *  Magnetic        element that leans toward the cursor
 *  Spotlight       card with a cursor-following glow
 *  GiantMarquee    huge outlined words that drift with scroll velocity
 *
 * Every component has a static fallback (screenshots, ?noanim, reduced motion) that
 * shows all content with no pinning and no transforms.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useInView, useMotionTemplate, useMotionValue, useScroll, useSpring,
  useTransform, useVelocity, useAnimationFrame, type MotionValue,
} from '@/lib/motion';
import { BgVideo, isStatic, handoff, EASE, G } from './cinema';
import type { Clip } from '@/data/media';

/* ── Accent ──────────────────────────────────────────────────────────────── */
export function Accent({ children, green = false, className = '' }: { children: React.ReactNode; green?: boolean; className?: string }) {
  return (
    <span className={`font-serif-accent ${className}`} style={{ color: green ? '#34D399' : undefined, fontFamily: "'Instrument Serif', 'Instrument Serif Fallback', ui-serif, Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
      {children}
    </span>
  );
}

/* ── ScrollStory ─────────────────────────────────────────────────────────── */
export type Chapter = { kicker?: string; title: React.ReactNode; body: React.ReactNode; clip: Clip; extra?: React.ReactNode };

function ChapterText({ c, i, n, progress }: { c: Chapter; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n, end = (i + 1) / n;
  const pad = 0.025;
  // fade out ends exactly at the boundary, fade in starts right after it → no overlap
  const opacity = useTransform(progress, [start, start + pad * 2, end - pad * 2, end], i === 0 ? [1, 1, 1, 0] : i === n - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + pad * 2, end - pad * 2, end], i === 0 ? [0, 0, 0, -30] : i === n - 1 ? [30, 0, 0, 0] : [30, 0, 0, -30]);
  return (
    <motion.div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ opacity, y }}>
      {c.kicker && <div className="mb-4 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">{c.kicker}</div>}
      <h3 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-[46px] md:text-[56px]">{c.title}</h3>
      <div className="mt-5 max-w-[460px] text-[17px] leading-[1.6] text-white/70">{c.body}</div>
      {c.extra && <div className="mt-7">{c.extra}</div>}
    </motion.div>
  );
}
function ChapterVideo({ c, i, n, progress }: { c: Chapter; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n, end = (i + 1) / n;
  const pad = 0.05;
  const opacity = useTransform(progress, [start - pad, start + pad, end - pad, end + pad], i === 0 ? [1, 1, 1, 0] : i === n - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.08, 1]);
  // Mount a chapter's video when it gets close, then keep it mounted for good:
  // scrolling back up must never re-download or restart a clip.
  const [mounted, setMounted] = useState(i === 0);
  const [on, setOn] = useState(i === 0);
  useEffect(() => progress.on('change', p => {
    const isOn = p >= start - pad && p <= end + pad;
    const isNear = p >= start - 1.5 / n && p <= end + 1.5 / n;
    setOn(isOn);
    if (isNear) setMounted(true);
  }), [progress, start, end, n, pad]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale }}>
      {mounted && <BgVideo clip={c.clip} dim={0.15} playWhenVisible={on} />}
    </motion.div>
  );
}

/** Pinned chapters. Height = chapters × 100vh. Left: text; right: video (full-bleed behind on mobile). */
export function ScrollStory({ chapters, id, intro }: { chapters: Chapter[]; id?: string; intro?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = chapters.length;
  const dot = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (isStatic()) {
    return (
      <section id={id} className="relative bg-[#05080E] py-24 text-white">
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
          {intro}
          <div className="mt-10 grid gap-16">
            {chapters.map((c, i) => (
              <div key={i} className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  {c.kicker && <div className="mb-4 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">{c.kicker}</div>}
                  <h3 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[46px]">{c.title}</h3>
                  <div className="mt-5 max-w-[460px] text-[17px] leading-[1.6] text-white/70">{c.body}</div>
                  {c.extra && <div className="mt-7">{c.extra}</div>}
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><BgVideo clip={c.clip} dim={0.1} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} ref={ref} className="relative bg-[#05080E] text-white" style={{ height: `${n * 100 + 20}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* mobile: video full-bleed behind text */}
        <div className="absolute inset-0 md:hidden">
          {chapters.map((c, i) => <ChapterVideo key={i} c={c} i={i} n={n} progress={scrollYProgress} />)}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080E] via-[#05080E]/70 to-[#05080E]/30" />
        </div>
        <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 sm:px-8 md:grid-cols-[1fr_1.1fr]">
          <div className="relative h-[60svh] md:h-[520px]">
            {intro && <div className="absolute inset-x-0 top-0">{intro}</div>}
            {chapters.map((c, i) => <ChapterText key={i} c={c} i={i} n={n} progress={scrollYProgress} />)}
          </div>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-white/10 md:block lg:aspect-[5/6]">
            {chapters.map((c, i) => <ChapterVideo key={i} c={c} i={i} n={n} progress={scrollYProgress} />)}
            <div className="absolute inset-x-6 bottom-6 h-[3px] overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full rounded-full" style={{ width: dot, background: G }} />
            </div>
          </div>
        </div>
        {/* step dots */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
          {chapters.map((_, i) => <StepDot key={i} i={i} n={n} progress={scrollYProgress} />)}
        </div>
      </div>
    </section>
  );
}
function StepDot({ i, n, progress }: { i: number; n: number; progress: MotionValue<number> }) {
  const h = useTransform(progress, [i / n - 0.02, i / n + 0.05, (i + 1) / n - 0.05, (i + 1) / n + 0.02], [8, 28, 28, 8]);
  const o = useTransform(progress, [i / n - 0.02, i / n + 0.05, (i + 1) / n - 0.05, (i + 1) / n + 0.02], [0.3, 1, 1, 0.3]);
  return <motion.span className="block w-[3px] rounded-full bg-white" style={{ height: h, opacity: o }} />;
}

/* ── HScrollGallery ──────────────────────────────────────────────────────── */
/** Pinned horizontal track. `items` are rendered as cards ~ 360–440px wide. */
export function HScrollGallery({ items, header, id, cardClass = 'w-[78vw] sm:w-[420px]' }: { items: React.ReactNode[]; header?: React.ReactNode; id?: string; cardClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 40)); };
    m(); window.addEventListener('resize', m); return () => window.removeEventListener('resize', m);
  }, [items.length]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  if (isStatic()) {
    return (
      <section id={id} className="relative overflow-hidden bg-[#05080E] py-24 text-white">
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">{header}</div>
        <div className="mt-10 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8">{items.map((it, i) => <div key={i} className={`shrink-0 ${cardClass}`}>{it}</div>)}</div>
      </section>
    );
  }
  return (
    <section id={id} ref={ref} className="relative bg-[#05080E] text-white" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">{header}</div>
        <motion.div ref={track} className="mt-10 flex gap-5 pl-5 pr-10 sm:pl-[max(32px,calc((100vw-1120px)/2+32px))]" style={{ x }}>
          {items.map((it, i) => <div key={i} className={`shrink-0 ${cardClass}`}>{it}</div>)}
        </motion.div>
      </div>
    </section>
  );
}

/* ── ZoomVideo ───────────────────────────────────────────────────────────── */
/** Starts as a rounded inset frame, expands to full-bleed while scrolling through. Children overlay the video. */
export function ZoomVideo({ clip, children, id }: { clip: Clip; children?: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const inset = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const textY = useTransform(scrollYProgress, [0.4, 1], [40, 0]);
  const textO = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  const stat = isStatic();
  return (
    <section id={id} ref={ref} className="relative bg-[#05080E] py-0">
      <motion.div className="relative h-[100svh] w-full overflow-hidden" style={stat ? undefined : { clipPath }}>
        <BgVideo clip={clip} dim={0.35} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080E]/80 via-transparent to-[#05080E]/40" />
        <motion.div className="relative z-10 flex h-full items-end" style={stat ? undefined : { y: textY, opacity: textO }}>
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── VideoText ───────────────────────────────────────────────────────────── */
/** Giant words with video visible only inside the letters (mix-blend multiply). */
export function VideoText({ clip, text, className = '', size = 'text-[22vw] md:text-[17vw]' }: { clip: Clip; text: string; className?: string; size?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#05080E] ${className}`}>
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(120deg,#0DA366 0%,#34D399 45%,#0B7A4B 100%)' }} />
      <BgVideo clip={clip} dim={0} />
      <div aria-hidden className={`relative flex items-center justify-center bg-[#05080E] font-semibold leading-[0.85] tracking-[-0.06em] text-white mix-blend-multiply ${size}`} style={{ paddingBlock: '0.08em' }}>
        {text}
      </div>
      <span className="sr-only">{text}</span>
    </div>
  );
}

/* ── ClipWall ────────────────────────────────────────────────────────────── */
export function ClipWall({ clips, labels = [], className = '' }: { clips: Clip[]; labels?: string[]; className?: string }) {
  // 5 tiles fill exactly: desktop 4×2 (first tile 2×2), mobile 2×3 (first tile full width).
  const spans = ['col-span-2 md:row-span-2', '', '', '', ''];
  return (
    <div className={`grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4 md:auto-rows-[220px] ${className}`}>
      {clips.slice(0, 5).map((c, i) => (
        <div key={c.id + i} className={`group relative overflow-hidden rounded-2xl bg-gray-900 md:rounded-3xl ${spans[i] || ''}`}>
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"><BgVideo clip={c} dim={0} /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {labels[i] && <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[12.5px] font-medium text-white backdrop-blur-md md:bottom-4 md:left-4">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

/* ── RouteMap ────────────────────────────────────────────────────────────── */
const ROUTE = 'M 60 300 C 120 300, 130 220, 200 210 S 300 240, 330 170 S 420 90, 500 80';
/** Live delivery animation: store → home, rider glides along a drawn route, ETA counts down. Loops. */
export function RouteMap({ className = '', dark = true, minutes = 18 }: { className?: string; dark?: boolean; minutes?: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(600);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const t = useMotionValue(isStatic() ? 0.62 : 0);
  const rx = useMotionValue(60), ry = useMotionValue(300);
  const [eta, setEta] = useState(minutes);
  const [done, setDone] = useState(false);
  useEffect(() => { if (pathRef.current) setLen(pathRef.current.getTotalLength()); }, []);
  useAnimationFrame((time) => {
    if (isStatic() || !inView || !pathRef.current) return;
    const cycle = 9000; // ms
    const p = Math.min(1, ((time % (cycle + 1600)) / cycle));
    t.set(p);
  });
  useEffect(() => t.on('change', p => {
    if (!pathRef.current) return;
    const pt = pathRef.current.getPointAtLength(p * len);
    rx.set(pt.x); ry.set(pt.y);
    const e = Math.max(1, Math.ceil(minutes * (1 - p)));
    setEta(prev => (prev === e ? prev : e));
    const d = p >= 0.999;
    setDone(prev => (prev === d ? prev : d));
  }), [t, len, minutes, rx, ry]);
  useEffect(() => { // static frame
    if (isStatic() && pathRef.current) { const pt = pathRef.current.getPointAtLength(0.62 * len); rx.set(pt.x); ry.set(pt.y); setEta(Math.ceil(minutes * 0.38)); }
  }, [len, minutes]);
  const dash = useTransform(t, p => len * (1 - p));
  const grid = dark ? 'rgba(255,255,255,.06)' : 'rgba(15,23,42,.06)';
  const road = dark ? 'rgba(255,255,255,.10)' : 'rgba(15,23,42,.10)';
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[28px] ${dark ? 'bg-[#0B1220] ring-1 ring-white/10' : 'bg-white ring-1 ring-gray-200'} ${className}`}>
      <svg viewBox="0 0 560 380" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <pattern id="zx-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke={grid} strokeWidth="1" /></pattern>
          <linearGradient id="zx-route" x1="0" x2="1"><stop offset="0" stopColor="#19C27C" /><stop offset="1" stopColor="#34D399" /></linearGradient>
          <radialGradient id="zx-pulse"><stop offset="0" stopColor="#34D399" stopOpacity=".55" /><stop offset="1" stopColor="#34D399" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="560" height="380" fill="url(#zx-grid)" />
        {/* blocks */}
        {[[90, 40, 120, 70], [250, 30, 90, 90], [380, 160, 130, 70], [120, 240, 60, 40], [420, 260, 90, 80], [30, 120, 70, 70], [230, 270, 120, 60]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill={dark ? 'rgba(255,255,255,.035)' : 'rgba(15,23,42,.035)'} />
        ))}
        {/* roads */}
        <path d="M 0 210 H 560 M 200 0 V 380 M 330 0 V 380 M 0 80 H 560" stroke={road} strokeWidth="14" fill="none" />
        <path ref={pathRef} d={ROUTE} stroke={dark ? 'rgba(255,255,255,.12)' : 'rgba(15,23,42,.12)'} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="2 10" />
        <motion.path d={ROUTE} stroke="url(#zx-route)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={len} style={{ strokeDashoffset: dash }} />
        {/* store */}
        <g transform="translate(60 300)"><circle r="16" fill="#0DA366" /><path d="M -6 -3 h 12 l -1.5 9 h -9 z M -4 -3 a 4 4 0 0 1 8 0" stroke="white" strokeWidth="1.8" fill="none" /></g>
        {/* home */}
        <g transform="translate(500 80)">
          <circle r="26" fill="url(#zx-pulse)"><animate attributeName="r" values="16;30;16" dur="2s" repeatCount="indefinite" /></circle>
          <circle r="15" fill={dark ? '#fff' : '#0B0F19'} />
          <path d="M -6 1 L 0 -5 L 6 1 V 6 H -6 Z" fill={dark ? '#0B0F19' : '#fff'} />
        </g>
        {/* rider */}
        <motion.g style={{ x: rx, y: ry }}>
          <circle r="20" fill="#34D399" opacity=".18" />
          <circle r="11" fill="#fff" />
          <circle r="6.5" fill="#0DA366" />
        </motion.g>
      </svg>
      {/* ETA chip */}
      <div className={`absolute left-4 top-4 flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-xl ${dark ? 'bg-white/10 text-white ring-1 ring-white/15' : 'bg-white/90 text-gray-900 ring-1 ring-gray-200'}`}>
        <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
        <div>
          <p className={`text-[11.5px] font-medium ${dark ? 'text-white/60' : 'text-gray-500'}`}>{done ? 'Delivered' : 'Rider on the way'}</p>
          <p className="text-[18px] font-semibold tabular-nums tracking-[-0.02em]">{done ? 'Enjoy!' : `${eta} min`}</p>
        </div>
      </div>
      <div className={`absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-[11.5px] font-medium ${dark ? 'bg-white/10 text-white/70 ring-1 ring-white/10' : 'bg-gray-100 text-gray-600'}`}>Illustrative route</div>
    </div>
  );
}

/* ── LiveOrder ───────────────────────────────────────────────────────────── */
const STAGES = ['Order placed', 'Packed at store', 'Rider picked up', 'Arriving now', 'Delivered'];
export function LiveOrder({ items = ['Amul Taaza Milk 1L', 'Aashirvaad Atta 5kg', 'Bananas · 6 pcs'], className = '', dark = false }: { items?: string[]; className?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [s, setS] = useState(isStatic() ? 2 : 0);
  useEffect(() => {
    if (isStatic() || !inView) return;
    const id = window.setInterval(() => setS(v => (v + 1) % STAGES.length), 1800);
    return () => window.clearInterval(id);
  }, [inView]);
  const tone = dark ? 'bg-[#0B1220]/90 text-white ring-white/10' : 'bg-white text-gray-900 ring-gray-200';
  return (
    <div ref={ref} className={`w-full max-w-[340px] rounded-3xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,.45)] ring-1 backdrop-blur-xl ${tone} ${className}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[12px] font-medium ${dark ? 'text-white/55' : 'text-gray-500'}`}>Order #ZX-2041</p>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-500">Live</span>
      </div>
      <div className="relative mt-3 h-[30px] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p key={s} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -26, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="absolute text-[21px] font-semibold tracking-[-0.02em]">
            {STAGES[s]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {STAGES.map((_, i) => (
          <div key={i} className={`h-1.5 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
            <motion.div className="h-full rounded-full" style={{ background: G }} initial={false} animate={{ width: i <= s ? '100%' : '0%' }} transition={{ duration: 0.5, ease: EASE }} />
          </div>
        ))}
      </div>
      <ul className={`mt-4 space-y-2 border-t pt-4 text-[13.5px] ${dark ? 'border-white/10 text-white/75' : 'border-gray-100 text-gray-600'}`}>
        {items.map(it => <li key={it} className="flex items-center justify-between gap-3"><span className="truncate">{it}</span><span className="text-emerald-500">✓</span></li>)}
      </ul>
    </div>
  );
}

/* ── Magnetic ────────────────────────────────────────────────────────────── */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 }), sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  if (isStatic()) return <div className={`inline-block ${className}`}>{children}</div>;
  return (
    <motion.div ref={ref} className={`inline-block ${className}`} style={{ x: sx, y: sy }}
      onMouseMove={e => { const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

/* ── Spotlight ───────────────────────────────────────────────────────────── */
export function Spotlight({ children, className = '', dark = true, color = 'rgba(52,211,153,.18)' }: { children: React.ReactNode; className?: string; dark?: boolean; color?: string }) {
  const mx = useMotionValue(-400), my = useMotionValue(-400);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${color}, transparent 70%)`;
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl ${dark ? 'bg-white/[.03] ring-1 ring-white/10' : 'bg-white ring-1 ring-gray-200'} transition-shadow duration-300 hover:shadow-[0_30px_80px_-30px_rgba(13,163,102,.45)] ${className}`}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      onMouseLeave={() => { mx.set(-400); my.set(-400); }}
    >
      {!isStatic() && <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: bg }} />}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── GiantMarquee ────────────────────────────────────────────────────────── */
export function GiantMarquee({ words, className = '', outline = true, light = true, baseSpeed = 2.2 }: { words: string[]; className?: string; outline?: boolean; light?: boolean; baseSpeed?: number }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-1500, 0, 1500], [-4, 1, 4], { clamp: false });
  const row = useRef<HTMLDivElement>(null);
  const onScreen = useInView(row, { amount: 0 });
  useAnimationFrame((_, delta) => {
    if (isStatic() || !row.current || !onScreen) return;
    const w = row.current.scrollWidth / 2;
    let v = x.get() - baseSpeed * (delta / 16) * Math.max(0.6, Math.abs(factor.get()));
    if (v <= -w) v += w;
    x.set(v);
  });
  const stroke = light ? 'rgba(255,255,255,.55)' : 'rgba(15,23,42,.35)';
  const content = [...words, ...words];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div ref={row} className="flex w-max gap-[0.4em] text-[18vw] font-semibold leading-[1.08] tracking-[-0.05em] md:text-[12vw]" style={{ x }}>
        {content.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-[0.4em]"
            style={outline && i % 2 === 0 ? { WebkitTextStroke: `1.5px ${stroke}`, color: 'transparent' } : { color: light ? '#fff' : '#0B0F19' }}>
            {w}<span className="inline-block h-[0.18em] w-[0.18em] rounded-full" style={{ background: G }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── SplitHeadline (word-by-word reveal with one serif accent) ─────────────── */
export type Part = string | { accent: string; green?: boolean };

export function SplitHeadline({ parts, className = '', delay = 0, as: Tag = 'h1' }: { parts: Part[]; className?: string; delay?: number; as?: 'h1' | 'h2' }) {
  const label = parts.map(p => (typeof p === 'string' ? p : p.accent)).join(' ');
  // flatten into word tokens, remembering which one is the accent
  const tokens: { w: string; accent?: boolean; green?: boolean }[] = [];
  parts.forEach(p => {
    if (typeof p === 'string') p.split(' ').filter(Boolean).forEach(w => tokens.push({ w }));
    else tokens.push({ w: p.accent, accent: true, green: p.green });
  });
  const render = (t: typeof tokens[number]) => (t.accent ? <Accent green={t.green} className="pr-[0.04em]">{t.w}</Accent> : t.w);

  if (isStatic() || handoff()) {
    return (
      <Tag className={className}>
        {tokens.map((t, i) => <React.Fragment key={i}>{render(t)}{i < tokens.length - 1 ? ' ' : ''}</React.Fragment>)}
      </Tag>
    );
  }
  return (
    <Tag className={className} aria-label={label}>
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <motion.span className="inline-block" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.035 }}>
              {render(t)}
            </motion.span>
          </span>
          {i < tokens.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
