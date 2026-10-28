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
  // Desktop only: a full-screen blended layer costs scrolling smoothness on phones.
  if (isStatic() || typeof window === 'undefined' || !window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) return null;
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

/** Every click or tap on something interactive answers with a soft green pulse at the pointer.
 *  Drawn on a fixed layer, so it never changes the clicked element's own styles. */
export function ClickPulse() {
  React.useEffect(() => {
    if (isStatic()) return;
    const SEL = 'a[href], button:not(:disabled), [role="button"], [role="tab"], [role="menuitem"], input[type="submit"], input[type="checkbox"], input[type="radio"], label, summary, select';
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const t = (e.target as Element | null)?.closest?.(SEL) as HTMLElement | null;
      if (!t) return;
      // find the surface behind the element: first ancestor with a solid background
      let dark = false;
      for (let el: HTMLElement | null = t; el; el = el.parentElement) {
        const c = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (c && (c.length < 4 || c[3] > 0.5)) { dark = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) < 110; break; }
      }
      const r = t.getBoundingClientRect();
      const size = Math.min(240, Math.max(72, Math.max(r.width, r.height) * 1.35));
      const glow = dark ? 'rgba(110,231,183,.6)' : 'rgba(13,163,102,.34)';
      const ring = dark ? 'rgba(167,243,208,.95)' : 'rgba(13,163,102,.8)';
      const mk = (css: string) => {
        const el = document.createElement('span');
        el.setAttribute('aria-hidden', 'true');
        el.style.cssText = `position:fixed;left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;pointer-events:none;z-index:2147483000;will-change:transform,opacity;${css}`;
        document.body.appendChild(el);
        return el;
      };
      const dot = mk(`background:radial-gradient(circle, ${glow} 0%, ${glow} 30%, transparent 70%)`);
      const rim = mk(`box-shadow:inset 0 0 0 2px ${ring}`);
      dot.animate([{ transform: 'scale(.35)', opacity: 1 }, { transform: 'scale(.8)', opacity: .9, offset: .55 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600, easing: 'ease-out' }).onfinish = () => dot.remove();
      rim.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(.8)', opacity: 1, offset: .55 }, { transform: 'scale(1.1)', opacity: 0 }], { duration: 680, easing: 'ease-out' }).onfinish = () => rim.remove();
      setTimeout(() => rim.remove(), 900);
      setTimeout(() => dot.remove(), 900);
    };
    window.addEventListener('pointerdown', down, { passive: true, capture: true });
    return () => window.removeEventListener('pointerdown', down, { capture: true } as EventListenerOptions);
  }, []);
  return null;
}
