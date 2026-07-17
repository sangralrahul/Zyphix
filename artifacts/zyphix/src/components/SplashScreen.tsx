import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_MS = 12000;
const BG_INTERVAL = 3200;

const BG_IMGS = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop&q=90',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&h=1080&fit=crop&q=90',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&h=1080&fit=crop&q=90',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1920&h=1080&fit=crop&q=90',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&h=1080&fit=crop&q=90',
  'https://images.unsplash.com/photo-1553546895-531931aa1aa8?w=1920&h=1080&fit=crop&q=90',
];

const KB_DIRS = [
  { ix: '0%', iy: '0%', ax: '-3%', ay: '-2%' },
  { ix: '3%', iy: '2%', ax: '0%', ay: '-1%' },
  { ix: '-2%', iy: '3%', ax: '2%', ay: '0%' },
  { ix: '1%', iy: '-3%', ax: '-2%', ay: '2%' },
  { ix: '-3%', iy: '0%', ax: '1%', ay: '-3%' },
  { ix: '2%', iy: '-1%', ax: '-2%', ay: '3%' },
];

const BADGES = [
  { icon: '🥦', label: 'Fresh Grocery', delay: 4.0 },
  { icon: '🍽️', label: 'Hot Food',      delay: 4.35 },
  { icon: '🏠', label: 'Home Services', delay: 4.7 },
];

interface Props { onComplete: () => void }

export function SplashScreen({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [bgIdx, setBgIdx]     = useState(0);

  useEffect(() => {
    const bg   = setInterval(() => setBgIdx(i => (i + 1) % BG_IMGS.length), BG_INTERVAL);
    const hide = setTimeout(() => setVisible(false), TOTAL_MS - 1400);
    const done = setTimeout(onComplete, TOTAL_MS);
    return () => { clearInterval(bg); clearTimeout(hide); clearTimeout(done); };
  }, [onComplete]);

  const skip = () => { setVisible(false); setTimeout(onComplete, 900); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}
        >
          {/* ── Ken Burns background ── */}
          <AnimatePresence mode="sync">
            {BG_IMGS.map((src, i) => {
              if (i !== bgIdx) return null;
              const d = KB_DIRS[i % KB_DIRS.length];
              return (
                <motion.div key={src}
                  style={{ position: 'absolute', inset: '-10%', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, x: d.ix, y: d.iy, scale: 1.0 }}
                  animate={{ opacity: 1, x: d.ax, y: d.ay, scale: 1.16 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 2.0, ease: 'easeInOut' },
                    x: { duration: BG_INTERVAL / 1000 + 2.5, ease: 'linear' },
                    y: { duration: BG_INTERVAL / 1000 + 2.5, ease: 'linear' },
                    scale: { duration: BG_INTERVAL / 1000 + 2.5, ease: 'linear' },
                  }}
                />
              );
            })}
          </AnimatePresence>

          {/* ── Layered cinematic overlay ── */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.42) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.85) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(13,163,102,0.10) 0%, transparent 65%)' }} />

          {/* ── Letterbox bars ── */}
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.45 }} style={{ transformOrigin: 'top', position: 'absolute', top: 0, left: 0, right: 0, height: 56, background: '#000' }} />
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.45 }} style={{ transformOrigin: 'bottom', position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: '#000' }} />

          {/* ── Glowing orbs ── */}
          <motion.div style={{ position: 'absolute', top: '18%', left: '12%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,163,102,0.22) 0%, transparent 70%)', filter: 'blur(48px)', pointerEvents: 'none' }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div style={{ position: 'absolute', bottom: '22%', right: '14%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,214,120,0.18) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
          <motion.div style={{ position: 'absolute', top: '55%', left: '50%', width: 500, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(13,163,102,0.09) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', transform: 'translateX(-50%)' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />

          {/* ── SKIP button ── */}
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 0.5 }}
            onClick={skip}
            style={{ position: 'absolute', top: 16, right: 20, zIndex: 10, background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 50, padding: '7px 18px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer' }}>
            SKIP ›
          </motion.button>

          {/* ── Center stage ── */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.7, duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ marginBottom: 22 }}>
              <div style={{ width: 84, height: 84, borderRadius: '28%', background: 'linear-gradient(148deg, #1AE082 0%, #0DC268 40%, #09A058 72%, #077A46 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 1px rgba(255,255,255,0.12) inset, 0 8px 0 rgba(255,255,255,0.08) inset, 0 12px 50px rgba(13,163,102,0.75)' }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 36, color: '#fff', lineHeight: 1, letterSpacing: '-0.06em' }}>//</span>
              </div>
            </motion.div>

            {/* ZYPHIX wordmark */}
            <div style={{ display: 'flex', alignItems: 'baseline', overflow: 'hidden', marginBottom: 6 }}>
              <motion.span
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', letterSpacing: '-0.05em', lineHeight: 1, background: 'linear-gradient(135deg, #18F590 0%, #0DC268 55%, #08924C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic', display: 'inline-block' }}>
                ZYPH
              </motion.span>
              <motion.span
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.68, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', letterSpacing: '-0.05em', lineHeight: 1, color: '#fff', display: 'inline-block' }}>
                IX
              </motion.span>
            </div>

            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 2.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 200, height: 2, background: 'linear-gradient(to right, transparent, #0DA366 20%, #18F590 50%, #0DA366 80%, transparent)', marginBottom: 20, transformOrigin: 'center' }} />

            {/* India's SuperLocal App */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.6, ease: 'easeOut' }}
              style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 10 }}>
              India's SuperLocal App
            </motion.p>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.3, duration: 0.55, ease: 'easeOut' }}
              style={{ fontFamily: "'Inter',sans-serif", fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: 44 }}>
              Groceries · Food · Services · Jammu, J&K
            </motion.p>

            {/* Feature badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
              {BADGES.map(({ icon, label, delay }) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 24, scale: 0.82 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 50, padding: '10px 20px' }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: '0.82rem', color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>{label}</span>
                </motion.div>
              ))}
            </div>

            {/* "Now Live" city badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 5.6, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(13,163,102,0.14)', border: '1px solid rgba(13,163,102,0.38)', borderRadius: 50, padding: '9px 22px' }}>
              <motion.div
                style={{ width: 9, height: 9, borderRadius: '50%', background: '#10D678', flexShrink: 0 }}
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#10D678', letterSpacing: '0.07em' }}>
                Now Live · Jammu, J&K
              </span>
            </motion.div>
          </div>

          {/* ── Progress bar ── */}
          <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(to right, #065F46, #0DA366, #18F590)', transformOrigin: 'left', borderRadius: 2 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: (TOTAL_MS - 1000) / 1000, ease: 'linear', delay: 0.2 }} />
          </div>

          {/* ── Clavix credit ── */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8, duration: 0.6 }}
            style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontFamily: "'Inter',sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.14em' }}>
            A CLAVIX TECHNOLOGIES PRODUCT
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
