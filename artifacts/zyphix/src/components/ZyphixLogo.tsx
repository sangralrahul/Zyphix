import React from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix logo. Deliberately still: a brand mark that pulses or wiggles reads
   as unfinished. The only motion is a short lift on hover.
──────────────────────────────────────────────────────────────────────────── */

const MARK_BG = 'linear-gradient(148deg, #1AE082 0%, #0DC268 38%, #09A058 72%, #077A46 100%)';

function Mark({ size }: { size: number }) {
  const r = Math.round(size * 0.27);
  const fs = Math.round(size * 0.46);
  return (
    <span
      className="zx-logo-mark"
      style={{
        width: size, height: size, borderRadius: r, background: MARK_BG,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: '0 2px 8px rgba(9,160,88,.35), inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(0,0,0,.12)',
        transition: 'transform .25s cubic-bezier(.22,1,.36,1)',
      }}
    >
      <span style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: fs,
        color: '#fff', lineHeight: 1, letterSpacing: '-0.08em', userSelect: 'none', display: 'block',
        transform: 'translateX(-0.02em)',
      }}>//</span>
    </span>
  );
}

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
    <span className="zx-logo" style={{ display: 'inline-flex', alignItems: 'center', gap, flexShrink: 0 }}>
      <Mark size={size} />
      {showWordmark && (
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: fs, letterSpacing: '-0.03em',
          lineHeight: 1, userSelect: 'none', display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap',
        }}>
          <span style={{
            fontStyle: 'italic', paddingRight: '0.04em',
            background: 'linear-gradient(135deg, #18F590 0%, #0DC268 55%, #08924C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>ZYPH</span>
          <span style={{ color: ixColor }}>IX</span>
        </span>
      )}
    </span>
  );
}

export function ZMarkOnly({ size = 32 }: { size?: number }) {
  return <Mark size={size} />;
}
