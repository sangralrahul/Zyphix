import React from 'react';
import { useLocation } from 'wouter';
import { motion, useScroll, useSpring } from '@/lib/motion';
import { isStatic } from '@/ui/cinema';

/* ────────────────────────────────────────────────────────────────────────────
   Site-wide cinematic layer:
   - a hairline scroll-progress bar in brand green
   - a very light film grain over the whole page
   - a soft cross-fade between pages on in-app navigation
   All of it switches off for "reduce motion".
──────────────────────────────────────────────────────────────────────────── */

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  if (isStatic()) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px] origin-left"
      style={{ scaleX, background: 'linear-gradient(90deg, #0DA366, #34D399 60%, #A7F3D0)', boxShadow: '0 0 12px rgba(13,163,102,.6)' }} />
  );
}

export function FilmGrain() {
  if (isStatic()) return null;
  return <div aria-hidden className="zx-grain pointer-events-none fixed inset-0 z-[119]" style={{ backgroundImage: GRAIN, opacity: 0.045, mixBlendMode: 'overlay' }} />;
}

/** Fades page content in when the path changes (opacity only: filters/transforms on an
    ancestor would break position:fixed headers and modals inside the page). */
export function PageFade({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const path = location.split('?')[0];
  if (isStatic()) return <>{children}</>;
  return (
    <motion.div key={path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/** Feeds pointer position to the spotlight on dark sections (one listener for the whole page). */
export function Spotlight() {
  React.useEffect(() => {
    if (isStatic() || !window.matchMedia('(hover:hover)').matches) return;
    let lit: HTMLElement | null = null; let raf = 0; let ev: PointerEvent | null = null;
    const apply = () => {
      raf = 0; if (!ev) return;
      const el = (ev.target as HTMLElement | null)?.closest?.('.zx-spot') as HTMLElement | null;
      if (lit && lit !== el) lit.classList.remove('zx-lit');
      lit = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${ev.clientX - r.left}px`); el.style.setProperty('--my', `${ev.clientY - r.top}px`);
      el.classList.add('zx-lit');
    };
    const move = (e: PointerEvent) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { lit?.classList.remove('zx-lit'); lit = null; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}
