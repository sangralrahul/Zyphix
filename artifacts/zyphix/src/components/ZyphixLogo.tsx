import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Icon mark ─── */
function PinMark({ size }: { size: number }) {
  const r  = Math.round(size * 0.265);
  const fs = Math.round(size * 0.46);
  const [entered, setEntered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.35, rotate: -18, opacity: 0 }}
      animate={
        entered
          ? { scale: [1, 1.07, 0.97, 1], rotate: 0, opacity: 1 }
          : { scale: 1, rotate: 0, opacity: 1 }
      }
      transition={
        entered
          ? { duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8 }
          : { type: 'spring', stiffness: 420, damping: 17, delay: 0.04 }
      }
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      whileHover={{ scale: 1.12, rotate: 7 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'linear-gradient(148deg, #1AE082 0%, #0DC268 38%, #09A058 72%, #077A46 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 5px 22px rgba(9,160,88,.52), inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(0,0,0,.12)',
        cursor: 'pointer',
        willChange: 'transform',
      }}
    >
      <SlashMark fs={fs} />
    </motion.div>
  );
}

function SlashMark({ fs }: { fs: number }) {
  const [entered, setEntered] = useState(false);

  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={
        entered
          ? { opacity: 1, y: [0, -2, 0] }
          : { opacity: 1, y: 0 }
      }
      transition={
        entered
          ? { duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.0 }
          : { delay: 0.26, duration: 0.28, ease: 'easeOut' }
      }
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 900,
        fontStyle: 'italic',
        fontSize: fs,
        color: '#ffffff',
        lineHeight: 1,
        letterSpacing: '-0.08em',
        userSelect: 'none',
        textShadow: '0 1px 6px rgba(0,0,0,.18)',
        display: 'block',
      }}
    >
      //
    </motion.span>
  );
}

/* ─── Main logo ─── */
export function ZyphixLogo({
  size = 32,
  showWordmark = true,
  gap = 9,
  fontSize,
  ixColor = '#0A0F1A',
}: {
  size?: number;
  wordmarkColor?: string;
  wordmarkHighlight?: string;
  showWordmark?: boolean;
  gap?: number;
  fontSize?: number;
  playAnimation?: boolean;
  ixColor?: string;
}) {
  const fs = fontSize ?? size * 0.6;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexShrink: 0 }}>
      <PinMark size={size} />

      {showWordmark && (
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: fs,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'baseline',
        }}>
          <ZyphWord />
          <IxWord color={ixColor} />
        </span>
      )}
    </div>
  );
}

function ZyphWord() {
  const [entered, setEntered] = useState(false);

  return (
    <motion.span
      initial={{ x: -24, opacity: 0 }}
      animate={
        entered
          ? { x: [0, -1.5, 0], opacity: 1 }
          : { x: 0, opacity: 1 }
      }
      transition={
        entered
          ? { duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }
          : { delay: 0.18, duration: 0.38, ease: [0.22, 1, 0.36, 1] }
      }
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      style={{
        fontStyle: 'italic',
        background: 'linear-gradient(135deg, #18F590 0%, #0DC268 55%, #08924C 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
        paddingRight: '0.04em',
        willChange: 'transform',
      }}
    >
      ZYPH
    </motion.span>
  );
}

function IxWord({ color = '#0A0F1A' }: { color?: string }) {
  const [entered, setEntered] = useState(false);

  return (
    <motion.span
      initial={{ x: -20, opacity: 0 }}
      animate={
        entered
          ? { x: [0, -1.5, 0], opacity: 1 }
          : { x: 0, opacity: 1 }
      }
      transition={
        entered
          ? { duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6, delay: 0.15 }
          : { delay: 0.30, duration: 0.38, ease: [0.22, 1, 0.36, 1] }
      }
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      style={{
        color,
        fontStyle: 'normal',
        display: 'inline-block',
        willChange: 'transform',
      }}
    >
      IX
    </motion.span>
  );
}

export function ZMarkOnly({ size = 32 }: { size?: number }) {
  const r  = Math.round(size * 0.265);
  const fs = Math.round(size * 0.46);
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: 'linear-gradient(148deg, #1AE082 0%, #0DC268 38%, #09A058 72%, #077A46 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      boxShadow: '0 5px 22px rgba(9,160,88,.52)',
    }}>
      <span style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontStyle: 'italic',
        fontSize: fs, color: '#fff', lineHeight: 1, letterSpacing: '-0.08em',
      }}>//</span>
    </div>
  );
}
