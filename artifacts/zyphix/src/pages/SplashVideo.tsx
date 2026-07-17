import { useState, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';

/* ── Design tokens — dark theme ────────────────────────── */
const BG   = '#0A0F1A';
const BG2  = '#111827';
const T1   = '#F1F5F9';
const T2   = '#94A3B8';
const G    = '#0DA366';
const G2   = '#065F46';
const GD   = 'linear-gradient(135deg,#0DA366 0%,#065F46 100%)';
const OR   = '#EA580C';
const ORD  = 'linear-gradient(135deg,#EA580C 0%,#C2410C 100%)';
const BD   = 'rgba(255,255,255,0.07)';
const OFT  = "'Outfit', sans-serif";
const INT  = "'Inter', sans-serif";
const EASE: [number,number,number,number] = [0.25, 0.46, 0.45, 0.94];
const DURATIONS = [4200, 5000, 5000, 4800, 6000];

function useAutoAdvance(total: number, onDone?: () => void) {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => {
      if (scene >= total - 1) {
        onDone?.();
        setScene(0);
      } else {
        setScene(s => s + 1);
      }
    }, DURATIONS[scene]);
    return () => clearTimeout(id);
  }, [scene, total, onDone]);
  const go = useCallback((i: number) => setScene(i), []);
  return { scene, go };
}

/* ── Shared: subtle grid pattern ────────────────────────── */
function Grid() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `linear-gradient(${T1}07 1px, transparent 1px), linear-gradient(90deg, ${T1}07 1px, transparent 1px)`,
      backgroundSize: '6vw 6vw',
    }} />
  );
}

/* ── Shared: floating blob ───────────────────────────────── */
function Blob({ x, y, size, color, delay = 0 }: { x: string; y: string; size: string; color: string; delay?: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: color, filter: 'blur(48px)', pointerEvents: 'none', zIndex: 1 }}
      animate={{ scale: [1, 1.18, 0.92, 1.1, 1], x: [0, 18, -14, 8, 0], y: [0, -12, 20, -8, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Shared: floating emoji particle ────────────────────── */
function FloatEmoji({ emoji, x, y, delay = 0, size = '2.2vw' }: { emoji: string; x: string; y: string; delay?: number; size?: string }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, fontSize: size, pointerEvents: 'none', zIndex: 2, userSelect: 'none', opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.4, 0.65, 0], y: [0, -18, -8, -22, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Shared: animated ring ───────────────────────────────── */
function Ring({ size, color, delay = 0 }: { size: string; color: string; delay?: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', top: '50%', left: '50%', width: size, height: size, borderRadius: '50%', border: `1.5px solid ${color}`, transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 1 }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: [0.6, 1.4], opacity: [0.5, 0] }}
      transition={{ duration: 2.8, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

/* ── Scene 1 — Brand Reveal ─────────────────────────────── */
function Scene1() {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [250, 950, 1800, 3000].map((d, i) => setTimeout(() => setPh(i + 1), d));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: BG, overflow: 'hidden' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}>
      <Grid />
      <ZyphixBg />

      {/* Animated background blobs */}
      <Blob x="-8%" y="-12%" size="45vw" color={`${G}0D`} delay={0} />
      <Blob x="62%" y="55%" size="38vw" color={`${G}08`} delay={1.5} />
      <Blob x="70%" y="-15%" size="30vw" color={`${T1}05`} delay={3} />

      {/* Cinematic light rays from centre */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -62%)', width: 0, height: 0, zIndex: 1, pointerEvents: 'none' }}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '38vw', height: 2,
              background: `linear-gradient(to right, ${G}22, transparent)`,
              transformOrigin: 'left center',
              transform: `rotate(${deg}deg)`,
              pointerEvents: 'none',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0.7], opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 1.8, delay: 0.6 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      {/* Pulsing rings behind icon */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -62%)', zIndex: 1 }}>
        <Ring size="18vw" color={`${G}30`} delay={0} />
        <Ring size="28vw" color={`${G}18`} delay={0.7} />
        <Ring size="40vw" color={`${G}0C`} delay={1.4} />
      </div>

      {/* Floating dots */}
      {[
        { x: '14%', y: '22%', s: 8, c: G, d: 0 },
        { x: '82%', y: '18%', s: 6, c: G, d: 1.2 },
        { x: '88%', y: '72%', s: 10, c: `${G}80`, d: 0.6 },
        { x: '10%', y: '75%', s: 7, c: `${T1}25`, d: 2 },
        { x: '48%', y: '12%', s: 5, c: G, d: 1.8 },
        { x: '25%', y: '85%', s: 9, c: `${G}60`, d: 0.4 },
      ].map((dot, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: dot.x, top: dot.y, width: dot.s, height: dot.s, borderRadius: '50%', background: dot.c, zIndex: 2, pointerEvents: 'none' }}
          animate={{ y: [0, -12, 6, -8, 0], opacity: [0.4, 0.8, 0.5, 0.9, 0.4] }}
          transition={{ duration: 4 + dot.d, delay: dot.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Icon */}
      <motion.div style={{ marginBottom: '3vh', position: 'relative', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        animate={ph >= 1 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}>
        <div style={{ width: '8.5vw', height: '8.5vw', minWidth: 74, minHeight: 74, borderRadius: '22%', background: GD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 0 rgba(255,255,255,0.25) inset, 0 20px 60px ${G}40, 0 0 0 1px ${G}25` }}>
          <span style={{ fontFamily: OFT, fontWeight: 900, fontStyle: 'italic', fontSize: '3.8vw', color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>//</span>
        </div>
        {/* Shimmer sweep */}
        <motion.div
          style={{ position: 'absolute', inset: 0, borderRadius: '22%', background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)', pointerEvents: 'none' }}
          initial={{ x: '-100%' }}
          animate={ph >= 1 ? { x: '180%' } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Wordmark — letters stagger in */}
      <motion.div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'baseline', overflow: 'hidden' }}
        initial={{ opacity: 0 }}
        animate={ph >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.1 }}>
        {'ZYPH'.split('').map((ch, i) => (
          <motion.span key={i}
            style={{ fontFamily: OFT, fontWeight: 900, fontSize: '12vw', color: T1, letterSpacing: '-0.055em', lineHeight: 0.87, display: 'inline-block' }}
            initial={{ opacity: 0, y: 40 }}
            animate={ph >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
          >{ch}</motion.span>
        ))}
        {'IX'.split('').map((ch, i) => (
          <motion.span key={i}
            style={{ fontFamily: OFT, fontWeight: 900, fontSize: '12vw', color: G, letterSpacing: '-0.055em', lineHeight: 0.87, display: 'inline-block' }}
            initial={{ opacity: 0, y: 40 }}
            animate={ph >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: (4 + i) * 0.07, ease: EASE }}
          >{ch}</motion.span>
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.p style={{ position: 'relative', zIndex: 10, fontFamily: INT, fontSize: '1.3vw', fontWeight: 500, color: T2, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '2.2vh' }}
        initial={{ opacity: 0, letterSpacing: '0.5em' }}
        animate={ph >= 3 ? { opacity: 1, letterSpacing: '0.25em' } : {}}
        transition={{ duration: 1.1, ease: EASE }}>
        India's SuperLocal App
      </motion.p>

      {/* Location pill */}
      <motion.div style={{ position: 'relative', zIndex: 10, marginTop: '3vh', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 50, border: `1.5px solid ${G}40`, background: `${G}08`, color: G, fontFamily: INT, fontWeight: 600, fontSize: '1.1vw' }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={ph >= 4 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}>
        <motion.span
          style={{ width: 7, height: 7, borderRadius: '50%', background: G, display: 'inline-block' }}
          animate={{ boxShadow: [`0 0 0px ${G}`, `0 0 10px ${G}`, `0 0 0px ${G}`] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        Now live across India
      </motion.div>
    </motion.div>
  );
}

/* ── Grocery data ────────────────────────────────────────── */
const GROCERIES = [
  { name: 'Tomatoes',  price: '₹25/kg',  cat: 'Veggie', img: 'photo-1546094096-0df4bcaaa337' },
  { name: 'Broccoli',  price: '₹80/pc',  cat: 'Veggie', img: 'photo-1459411621453-7b03977f4bfc' },
  { name: 'Carrots',   price: '₹35/kg',  cat: 'Veggie', img: 'photo-1447175008436-054170c2e979' },
  { name: 'Spinach',   price: '₹20/bn',  cat: 'Veggie', img: 'photo-1576045057995-568f588f82fb' },
  { name: 'Mangoes',   price: '₹120/dz', cat: 'Fruit',  img: 'photo-1553279768-865429fa0078' },
  { name: 'Apples',    price: '₹160/kg', cat: 'Fruit',  img: 'photo-1568702846914-96b305d2aaeb' },
  { name: 'Bananas',   price: '₹45/dz',  cat: 'Fruit',  img: 'photo-1571771894821-ce9b6c11b08e' },
  { name: 'Basmati',   price: '₹90/kg',  cat: 'Grain',  img: 'photo-1536304929831-ee1ca9d44906' },
];

const CAT_COLOR: Record<string, string> = { Veggie: G, Fruit: '#F97316', Grain: '#D97706', Dairy: '#6366F1' };

function GroceryCard({ item, delay, show }: { item: typeof GROCERIES[0]; delay: number; show: boolean }) {
  return (
    <motion.div
      style={{ background: BG2, borderRadius: 14, padding: '0.7vw 0.6vw 0.6vw', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', width: '7.2vw', minWidth: 78, position: 'relative', overflow: 'hidden' }}
      initial={{ opacity: 0, y: 32, scale: 0.82 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.48, delay, ease: [0.34, 1.56, 0.64, 1] }}>
      <div style={{ position: 'absolute', top: 5, right: 5, fontSize: '0.55vw', fontFamily: INT, fontWeight: 700, color: CAT_COLOR[item.cat] ?? G, background: `${CAT_COLOR[item.cat] ?? G}14`, padding: '2px 5px', borderRadius: 4 }}>{item.cat}</div>
      <div style={{ width: '4.8vw', height: '4.8vw', minWidth: 48, minHeight: 48, borderRadius: '50%', overflow: 'hidden', marginBottom: '0.5vw', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        <img src={`https://images.unsplash.com/${item.img}?w=200&q=80`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <p style={{ fontFamily: OFT, fontWeight: 700, fontSize: '0.8vw', color: T1, textAlign: 'center', lineHeight: 1.2, marginBottom: '0.3vw' }}>{item.name}</p>
      <p style={{ fontFamily: INT, fontWeight: 700, fontSize: '0.72vw', color: CAT_COLOR[item.cat] ?? G }}>{item.price}</p>
    </motion.div>
  );
}

/* ── Shared: ZYPHIX letter watermark strip — appears on every scene ── */
const ZF_ROWS = [
  { letter: 'Z', full: 'Zero Surge'         },
  { letter: 'Y', full: 'Your Neighbourhood' },
  { letter: 'P', full: 'Proximity Powered'  },
  { letter: 'H', full: 'Hyperlocal'         },
  { letter: 'I', full: 'Instant Delivery'   },
  { letter: 'X', full: 'Xtra Savings'       },
];

/* Drop-and-morph cycle timing (ms) */
const ZFC = 4400; // total cycle duration per column

function DropColumn({ letter, full, idx }: { letter: string; full: string; idx: number }) {
  /* Evenly-distributed stagger so the wave stays permanent through every loop */
  const delay = (idx * ZFC) / 6 / 1000;

  /* ── Word: drops from above, lands, then fades out ── */
  const wordY    = ['-72px', '-72px', '0px',  '0px',  '0px',  '8px' ];
  const wordOp   = [0,        0,       0.13,   0.13,   0.06,   0     ];
  const wordT    = [0,        0.05,    0.26,   0.50,   0.66,   0.74  ];
  const wordEase = ['linear', [0.16,1,0.3,1], 'linear','linear','easeIn'] as const;

  /* ── Impact ripple: brief scale-out line below the word ── */
  const rippleT = [0, 0.23, 0.27, 0.34, 1];

  /* ── Letter: materialises after word vanishes, then floats up & out ── */
  const letScale = [1,   1,   1,  0.55, 1.08, 1,   1,   1,   0.85];
  const letOp    = [0,   0,   0,   0,   0,    0.08, 0.08, 0.04, 0  ];
  const letY     = [0,   0,   0,   0,   0,    0,    0,    -8,  -22 ];
  const letT     = [0, 0.05, 0.50, 0.62, 0.74, 0.80, 0.90, 0.96, 1.0];

  return (
    <div style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
      minHeight: 'clamp(4.8rem, 9vw, 7.2rem)',
      minWidth:  'clamp(4.5rem, 9vw, 7.2rem)',
    }}>

      {/* Full-form word */}
      <motion.div
        style={{
          position: 'absolute', bottom: '36%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          width: 'clamp(4.8rem, 9.5vw, 7.8rem)',
        }}
        animate={{ y: wordY, opacity: wordOp }}
        transition={{ duration: ZFC / 1000, times: wordT, ease: wordEase as never, repeat: Infinity, delay }}
      >
        <span style={{
          fontFamily: INT, fontWeight: 700,
          fontSize: 'clamp(0.68rem, 1.05vw, 0.84rem)',
          color: T1,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          textAlign: 'center' as const,
          userSelect: 'none', lineHeight: 1.25,
        }}>{full}</span>

        {/* Impact ripple line */}
        <motion.div
          animate={{ scaleX: [0,0,1.6,0,0], opacity: [0,0,0.35,0,0] }}
          transition={{ duration: ZFC / 1000, times: rippleT, ease: 'linear', repeat: Infinity, delay }}
          style={{ width: '100%', height: 1, background: `${G}70`, borderRadius: 1, transformOrigin: 'center' }}
        />
      </motion.div>

      {/* Single letter — blooms up from where the word landed */}
      <motion.span
        style={{
          position: 'absolute', bottom: 0,
          fontFamily: OFT, fontWeight: 900,
          fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
          color: T1, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none',
        }}
        animate={{ scale: letScale, opacity: letOp, y: letY }}
        transition={{ duration: ZFC / 1000, times: letT, ease: 'linear', repeat: Infinity, delay }}
      >
        {letter}
      </motion.span>
    </div>
  );
}

function ZyphixBg() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      gap: 'clamp(1.2vw, 4vw, 6.5vw)',
      padding: '0 7vw 3.5vh',
      pointerEvents: 'none', zIndex: 2,
    }}>
      {ZF_ROWS.map(({ letter, full }, i) => (
        <DropColumn key={letter} letter={letter} full={full} idx={i} />
      ))}
    </div>
  );
}

/* ── Scene 2 — ZyphixNow (Grocery showcase) ─────────────── */
function Scene2() {
  const [ph, setPh] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const ts = [150, 700, 1100, 2200, 4300].map((d, i) => setTimeout(() => setPh(i + 1), d));
    return () => ts.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (ph < 2) return;
    let n = 0;
    const id = setInterval(() => { n += 2; setCount(Math.min(n, 30)); if (n >= 30) clearInterval(id); }, 45);
    return () => clearInterval(id);
  }, [ph]);

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', overflow: 'hidden', background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}>
      <Grid />
      <ZyphixBg />
      <Blob x="-8%" y="20%" size="34vw" color={`${G}0B`} delay={0} />
      <Blob x="52%" y="-8%" size="26vw" color={`${G}07`} delay={2} />

      {/* Speed lines */}
      {[0,1,2,3].map(i => (
        <motion.div key={i}
          style={{ position: 'absolute', left: 0, top: `${22 + i * 13}%`, height: 1.5, background: `linear-gradient(to right, transparent, ${G}45, transparent)`, borderRadius: 2, zIndex: 2, pointerEvents: 'none' }}
          animate={{ width: ['0%', '40%', '0%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.3, delay: 0.5 + i * 0.2, repeat: Infinity, repeatDelay: 2.8, ease: EASE }}
        />
      ))}

      {/* Left accent bar */}
      <motion.div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: GD, zIndex: 5 }}
        initial={{ scaleY: 0, originY: 1 }}
        animate={ph >= 1 ? { scaleY: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }} />

      {/* Left — Text */}
      <div style={{ flex: '0 0 44%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 3vw 0 8vw', position: 'relative', zIndex: 10 }}>
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '2vh' }}
          initial={{ opacity: 0, x: -24 }}
          animate={ph >= 1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: GD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${G}40` }}>
            <span style={{ fontFamily: OFT, fontWeight: 900, fontStyle: 'italic', fontSize: 13, color: '#fff' }}>//</span>
          </div>
          <span style={{ fontFamily: INT, fontWeight: 600, fontSize: '1.05vw', color: T2, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Zyphix Now</span>
        </motion.div>

        <motion.div style={{ fontFamily: OFT, fontWeight: 900, fontSize: '6vw', lineHeight: 0.88, letterSpacing: '-0.045em', marginBottom: '2vh' }}
          initial={{ opacity: 0, y: 28 }}
          animate={ph >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}>
          <span style={{ color: T1, display: 'block' }}>Fresh grocery</span>
          <span style={{ color: G, display: 'block' }}>in <span style={{ fontVariantNumeric: 'tabular-nums' }}>{ph >= 2 ? count : 0}</span> mins.</span>
        </motion.div>

        <motion.p style={{ fontFamily: INT, fontSize: '1.3vw', color: T2, fontWeight: 400, lineHeight: 1.7, marginBottom: '3vh', maxWidth: '25vw' }}
          initial={{ opacity: 0 }}
          animate={ph >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.75, ease: EASE }}>
          Vegetables, fruits, grains & dairy — straight from your kirana.
        </motion.p>

        <motion.div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 10 }}
          animate={ph >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}>
          {['🥦 Veggies', '🍎 Fruits', '🌾 Grains', '🥛 Dairy'].map((tag, i) => (
            <motion.div key={tag}
              style={{ padding: '5px 12px', borderRadius: 6, background: `${G}10`, border: `1.5px solid ${G}28`, color: G, fontFamily: INT, fontWeight: 600, fontSize: '0.85vw' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={ph >= 4 ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>
              {tag}
            </motion.div>
          ))}
        </motion.div>

        {/* Delivery badge */}
        <motion.div
          style={{ marginTop: '2.5vh', display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 18px', borderRadius: 8, background: '#1E293B', color: '#F1F5F9', fontFamily: OFT, fontWeight: 700, fontSize: '1vw', width: 'fit-content', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={ph >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
          <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.6, delay: 2, repeat: Infinity, repeatDelay: 3 }}>⚡</motion.span>
          Express delivery · Pan India
        </motion.div>
      </div>

      {/* Right — Grocery card grid */}
      <div style={{ flex: '0 0 56%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2vh 4vw 2vh 2vw' }}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', width: '38vw', height: '38vw', borderRadius: '50%', background: `radial-gradient(circle, ${G}08 0%, transparent 68%)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1vw' }}>
          {/* Row 1 */}
          <div style={{ display: 'flex', gap: '1vw' }}>
            {GROCERIES.slice(0, 4).map((item, i) => (
              <GroceryCard key={item.name} item={item} delay={0.3 + i * 0.1} show={ph >= 2} />
            ))}
          </div>
          {/* Row 2 */}
          <div style={{ display: 'flex', gap: '1vw' }}>
            {GROCERIES.slice(4, 8).map((item, i) => (
              <GroceryCard key={item.name} item={item} delay={0.65 + i * 0.1} show={ph >= 2} />
            ))}
          </div>
          {/* Shelf divider */}
          <motion.div
            style={{ height: 3, borderRadius: 2, background: `linear-gradient(to right, transparent, ${G}30, transparent)` }}
            initial={{ scaleX: 0 }} animate={ph >= 2 ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          />
          {/* Cart total bar */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderRadius: 10, background: BG2, boxShadow: '0 2px 16px rgba(0,0,0,0.4)', border: `1.5px solid ${G}30` }}
            initial={{ opacity: 0, y: 12 }}
            animate={ph >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1vw' }}>🛒</span>
              <span style={{ fontFamily: INT, fontWeight: 600, fontSize: '0.85vw', color: T2 }}>8 items · ₹650</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: G }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span style={{ fontFamily: OFT, fontWeight: 700, fontSize: '0.85vw', color: G }}>Packed in 8 min</span>
            </div>
          </motion.div>
        </div>

        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BG} 0%, transparent 8%)`, pointerEvents: 'none' }} />
      </div>
    </motion.div>
  );
}

/* ── Pizza slice pull component ──────────────────────────── */
const PIZZA_IMG = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=80';

function PizzaPull({ show }: { show: boolean }) {
  return (
    <div style={{ position: 'relative', width: '22vw', height: '22vw' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', inset: '-15%', borderRadius: '50%', background: `radial-gradient(circle, ${OR}14, transparent 68%)`, pointerEvents: 'none' }} />

      {/* Pizza base */}
      <motion.div
        style={{ width: '22vw', height: '22vw', borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 2px ${OR}22, 0 8px 40px rgba(0,0,0,0.18), 0 40px 70px rgba(0,0,0,0.1)` }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={show ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}>
        <img src={PIZZA_IMG} alt="pizza" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>

      {/* Lifted slice — same image, triangle clip-path */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${PIZZA_IMG})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          clipPath: 'polygon(50% 50%, 30% 0%, 70% 0%)',
          filter: 'drop-shadow(0 -6px 14px rgba(234,88,12,0.35))',
          zIndex: 10,
        }}
        initial={{ y: 0, rotate: 0, opacity: 0 }}
        animate={show ? { y: [-55, -75, -55], rotate: [0, 5, 0], opacity: 1 } : {}}
        transition={show ? { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }, rotate: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }, opacity: { duration: 0.5 } } : {}}
      />

      {/* Cheese strings */}
      {show && [-11, -1, 9].map((offsetX, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', top: '3%', left: `calc(50% + ${offsetX}px)`, width: 2.5, borderRadius: 2, background: 'linear-gradient(to bottom, #FCD34D, #FBBF24BB)', zIndex: 9, transformOrigin: 'top center' }}
          animate={{ height: [0, 44, 52, 44, 0] }}
          transition={{ duration: 2.8, delay: 1.0 + i * 0.13, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Steam wisps */}
      {show && [28, 50, 68].map((pct, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', bottom: '18%', left: `${pct}%`, width: 7, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', filter: 'blur(3.5px)', zIndex: 5, pointerEvents: 'none' }}
          animate={{ y: [0, -55], opacity: [0, 0.75, 0], x: [0, i % 2 === 0 ? 9 : -9, 0] }}
          transition={{ duration: 1.8, delay: i * 0.55, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ── Scene 3 — ZyphixEats (Food showcase) ───────────────── */
const FOOD_ITEMS = [
  { name: 'Margherita Pizza', place: 'Pizza Palace', time: '25 min', rating: '4.7', img: 'photo-1574071318508-1cdbab80d002' },
  { name: 'Chicken Biryani',  place: 'Biryani House', time: '30 min', rating: '4.9', img: 'photo-1589302168068-964664d93dc0' },
  { name: 'Classic Burger',   place: 'Burger Studio', time: '20 min', rating: '4.6', img: 'photo-1568901346375-23c9450c58cd' },
];

function Scene3() {
  const [ph, setPh] = useState(0);
  const [foodIdx, setFoodIdx] = useState(0);
  useEffect(() => {
    const ts = [150, 700, 1300, 2200, 4300].map((d, i) => setTimeout(() => setPh(i + 1), d));
    return () => ts.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (ph < 3) return;
    const id = setInterval(() => setFoodIdx(n => (n + 1) % FOOD_ITEMS.length), 1400);
    return () => clearInterval(id);
  }, [ph]);

  const food = FOOD_ITEMS[foodIdx];

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch', overflow: 'hidden', background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}>
      <Grid />
      <ZyphixBg />
      <Blob x="55%" y="35%" size="38vw" color={`${OR}0A`} delay={0} />
      <Blob x="2%" y="5%"  size="22vw" color={`${OR}07`} delay={2} />

      {/* Animated orange arc */}
      <motion.div
        style={{ position: 'absolute', right: '-6%', top: '-18%', width: '56vw', height: '56vw', borderRadius: '50%', border: `70px solid ${OR}07`, pointerEvents: 'none', zIndex: 1 }}
        animate={{ rotate: [0, 25, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Right accent bar */}
      <motion.div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, background: ORD, zIndex: 5 }}
        initial={{ scaleY: 0, originY: 1 }}
        animate={ph >= 1 ? { scaleY: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }} />

      {/* Left — Text */}
      <div style={{ flex: '0 0 46%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 3vw 0 8vw', position: 'relative', zIndex: 10 }}>
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '2vh' }}
          initial={{ opacity: 0, x: -24 }}
          animate={ph >= 1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: ORD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${OR}40` }}>
            <span style={{ fontFamily: OFT, fontWeight: 900, fontStyle: 'italic', fontSize: 13, color: '#fff' }}>//</span>
          </div>
          <span style={{ fontFamily: INT, fontWeight: 600, fontSize: '1.05vw', color: T2, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Zyphix Eats</span>
        </motion.div>

        <motion.h2 style={{ fontFamily: OFT, fontWeight: 900, fontSize: '6vw', lineHeight: 0.88, letterSpacing: '-0.045em', marginBottom: '2vh' }}
          initial={{ opacity: 0, y: 28 }}
          animate={ph >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}>
          <span style={{ color: T1, display: 'block' }}>Cravings</span>
          <span style={{ color: OR, display: 'block' }}>delivered hot.</span>
        </motion.h2>

        <motion.p style={{ fontFamily: INT, fontSize: '1.3vw', color: T2, fontWeight: 400, lineHeight: 1.7, marginBottom: '2.5vh', maxWidth: '24vw' }}
          initial={{ opacity: 0 }}
          animate={ph >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.75, ease: EASE }}>
          Pizza, biryani, burgers & more — from your favourite local restaurants.
        </motion.p>

        {/* Live food card ticker */}
        <motion.div
          style={{ background: BG2, borderRadius: 14, padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', border: `1.5px solid ${OR}30`, maxWidth: '24vw', overflow: 'hidden' }}
          initial={{ opacity: 0, y: 14 }}
          animate={ph >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}>
          <AnimatePresence mode="wait">
            <motion.div key={foodIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: '3.8vw', height: '3.8vw', minWidth: 42, minHeight: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <img src={`https://images.unsplash.com/${food.img}?w=200&q=80`} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ fontFamily: OFT, fontWeight: 700, fontSize: '1vw', color: T1, lineHeight: 1.2 }}>{food.name}</p>
                <p style={{ fontFamily: INT, fontSize: '0.8vw', color: T2, lineHeight: 1.4 }}>{food.place}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                  <span style={{ fontFamily: INT, fontSize: '0.75vw', color: OR, fontWeight: 600 }}>⏱ {food.time}</span>
                  <span style={{ fontFamily: INT, fontSize: '0.75vw', color: '#F59E0B', fontWeight: 600 }}>★ {food.rating}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', gap: 5, marginTop: 10, justifyContent: 'center' }}>
            {FOOD_ITEMS.map((_, i) => (
              <motion.div key={i}
                style={{ height: 3, borderRadius: 2, background: i === foodIdx ? OR : `${OR}30` }}
                animate={{ width: i === foodIdx ? 18 : 7 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ marginTop: '2.5vh', display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 18px', borderRadius: 8, background: '#1E293B', color: '#F1F5F9', fontFamily: OFT, fontWeight: 700, fontSize: '1vw', width: 'fit-content', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={ph >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}>🔥</motion.span>
          Hot & on time · Across India
        </motion.div>
      </div>

      {/* Right — Pizza pull + food thumbnails */}
      <div style={{ flex: '0 0 54%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vh', padding: '2vh 5vw 2vh 1vw' }}>

        {/* Pizza with cheese pull */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={ph >= 2 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}>
          <PizzaPull show={ph >= 2} />
        </motion.div>

        {/* Food thumbnail strip */}
        <motion.div
          style={{ display: 'flex', gap: '1vw', zIndex: 10 }}
          initial={{ opacity: 0, y: 20 }}
          animate={ph >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}>
          {[
            { img: 'photo-1589302168068-964664d93dc0', label: 'Biryani' },
            { img: 'photo-1568901346375-23c9450c58cd', label: 'Burger' },
            { img: 'photo-1565299624946-b28f40a0ae38', label: 'Tandoori' },
          ].map((f, i) => (
            <motion.div key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
              initial={{ opacity: 0, y: 16 }}
              animate={ph >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}>
              <div style={{ width: '5.5vw', height: '5.5vw', minWidth: 52, minHeight: 52, borderRadius: 12, overflow: 'hidden', boxShadow: `0 3px 14px rgba(0,0,0,0.15), 0 0 0 2px ${OR}18` }}>
                <img src={`https://images.unsplash.com/${f.img}?w=200&q=80`} alt={f.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontFamily: INT, fontWeight: 600, fontSize: '0.7vw', color: T2 }}>{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to left, ${BG} 0%, transparent 8%)`, pointerEvents: 'none' }} />
      </div>
    </motion.div>
  );
}

/* ── Scene 4 — India (light theme) ──────────────────────── */
function Scene4() {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [400, 1100, 2000, 3200].map((d, i) => setTimeout(() => setPh(i + 1), d));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden', background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.85 }}>
      <Grid />
      <ZyphixBg />

      {/* Blobs */}
      <Blob x="30%" y="-20%" size="50vw" color={`${G}07`} delay={0} />
      <Blob x="-10%" y="50%" size="30vw" color={`${G}0A`} delay={2} />

      {/* Animated diagonal stripe accent */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          style={{ position: 'absolute', top: 0, bottom: 0, left: `${28 + i * 3}%`, width: 1, background: `linear-gradient(to bottom, transparent, ${G}18, transparent)`, pointerEvents: 'none', zIndex: 1 }}
          animate={{ scaleY: [0, 1, 0], y: ['100%', '0%', '-100%'] }}
          transition={{ duration: 3.5, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        />
      ))}

      {/* Right side — city photo */}
      <motion.div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '46%', overflow: 'hidden' }}
        initial={{ opacity: 0, x: 60 }} animate={ph >= 1 ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: EASE }}>
        <motion.img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85"
          alt="India" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }}
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: 'linear' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BG} 0%, transparent 35%)` }} />
      </motion.div>

      {/* Floating location pins */}
      {[{ x: '55%', y: '15%', d: 0.5 }, { x: '72%', y: '60%', d: 1.4 }, { x: '88%', y: '30%', d: 0.9 }].map((p, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: p.x, top: p.y, zIndex: 3, fontSize: '2vw', pointerEvents: 'none', opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], y: [0, -15, 0] }}
          transition={{ duration: 3, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}>
          📍
        </motion.div>
      ))}

      {/* Left side — text */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 0 0 8vw', maxWidth: '60vw' }}>
        <motion.div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 50, background: `${G}15`, border: `1.5px solid ${G}30`, color: G, fontFamily: INT, fontWeight: 600, fontSize: '1.05vw', marginBottom: '2.5vh' }}
          initial={{ opacity: 0, y: 10 }}
          animate={ph >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}>
          🇮🇳 Built for
        </motion.div>

        {/* INDIA with character stagger */}
        <div style={{ display: 'flex', marginBottom: '3.5vh', overflow: 'hidden' }}>
          {'INDIA'.split('').map((ch, i) => (
            <motion.span key={i}
              style={{ fontFamily: OFT, fontWeight: 900, fontSize: '13.5vw', color: T1, lineHeight: 0.85, letterSpacing: '-0.05em', textTransform: 'uppercase', display: 'inline-block' }}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={ph >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.75, delay: i * 0.08, ease: EASE }}
            >{ch}</motion.span>
          ))}
        </div>

        <motion.p style={{ fontFamily: INT, fontSize: '1.65vw', color: T2, fontWeight: 400, lineHeight: 1.65, marginBottom: '4vh' }}
          initial={{ opacity: 0 }}
          animate={ph >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}>
          Building India's SuperLocal Commerce Layer — city by city.
        </motion.p>

        <motion.div style={{ display: 'flex', gap: '4.5vw' }}
          initial={{ opacity: 0, y: 14 }}
          animate={ph >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}>
          {[['5L+', 'Customers'], ['100+', 'Partners'], ['4.8★', 'Rating']].map(([v, l], i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={ph >= 4 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}>
              <p style={{ fontFamily: OFT, fontWeight: 900, fontSize: '3.8vw', color: T1, lineHeight: 1, letterSpacing: '-0.03em' }}>{v}</p>
              <p style={{ fontFamily: INT, fontSize: '1.05vw', color: T2, marginTop: 5 }}>{l}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Scene 5 — Outro / CTA ──────────────────────────────── */
function Scene5({ onDone }: { onDone?: () => void }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const ts = [350, 1000, 1750, 3000, 5400].map((d, i) => setTimeout(() => setPh(i + 1), d));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: BG, overflow: 'hidden' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ scale: 1.03, opacity: 0 }}
      transition={{ duration: 0.75 }}>
      <Grid />
      <ZyphixBg />

      {/* Blobs */}
      <Blob x="-10%" y="-10%" size="40vw" color={`${G}08`} delay={0} />
      <Blob x="65%" y="60%" size="35vw" color={`${OR}07`} delay={1.5} />
      <Blob x="70%" y="-5%" size="28vw" color={`${G}06`} delay={3} />

      {/* Expanding celebration rings */}
      {ph >= 1 && (
        <>
          <Ring size="20vw" color={`${G}35`} delay={0} />
          <Ring size="35vw" color={`${G}20`} delay={0.5} />
          <Ring size="55vw" color={`${G}10`} delay={1} />
          <Ring size="75vw" color={`${G}07`} delay={1.5} />
        </>
      )}

      {/* Floating confetti dots */}
      {Array.from({ length: 14 }).map((_, i) => {
        const colors = [G, OR, G2, `${G}80`, `${OR}80`];
        return (
          <motion.div key={i}
            style={{
              position: 'absolute',
              left: `${5 + i * 7}%`, top: `${10 + (i % 5) * 18}%`,
              width: 6 + (i % 4) * 3, height: 6 + (i % 4) * 3,
              borderRadius: i % 3 === 0 ? '50%' : 3,
              background: colors[i % colors.length],
              opacity: 0, zIndex: 2, pointerEvents: 'none',
            }}
            animate={ph >= 1 ? { opacity: [0, 0.7, 0], y: [0, -40, -80], rotate: [0, 180, 360] } : {}}
            transition={{ duration: 3 + (i % 3), delay: 0.05 * i, repeat: Infinity, repeatDelay: 1.5 + (i % 3) * 0.4 }}
          />
        );
      })}

      {/* Logo */}
      <motion.div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1.8vw', marginBottom: '3.5vh' }}
        initial={{ opacity: 0, y: 24 }}
        animate={ph >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}>
        <div style={{ width: '7.5vw', height: '7.5vw', minWidth: 62, minHeight: 62, borderRadius: '22%', background: GD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 0 rgba(255,255,255,0.25) inset, 0 16px 50px ${G}40, 0 0 0 1px ${G}22` }}>
          <span style={{ fontFamily: OFT, fontWeight: 900, fontStyle: 'italic', fontSize: '3.3vw', color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>//</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {'ZYPH'.split('').map((ch, i) => (
            <motion.span key={i}
              style={{ fontFamily: OFT, fontWeight: 900, fontSize: '9.5vw', color: T1, lineHeight: 0.87, letterSpacing: '-0.055em', display: 'inline-block' }}
              initial={{ opacity: 0, y: 30 }}
              animate={ph >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.06, ease: EASE }}
            >{ch}</motion.span>
          ))}
          {'IX'.split('').map((ch, i) => (
            <motion.span key={i}
              style={{ fontFamily: OFT, fontWeight: 900, fontSize: '9.5vw', color: G, lineHeight: 0.87, letterSpacing: '-0.055em', display: 'inline-block' }}
              initial={{ opacity: 0, y: 30 }}
              animate={ph >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.06, ease: EASE }}
            >{ch}</motion.span>
          ))}
        </div>
      </motion.div>

      {/* Service tags */}
      <motion.div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '2vw', marginBottom: '3.5vh' }}
        initial={{ opacity: 0, y: 12 }}
        animate={ph >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EASE }}>
        {[{ n: 'ZyphixNow', c: G, e: '🛒' }, { n: 'ZyphixEats', c: OR, e: '🍽️' }].map(({ n, c, e }) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 20px', borderRadius: 8, border: `1.5px solid ${c}28`, background: `${c}07`, color: T1, fontFamily: INT, fontWeight: 600, fontSize: '1.2vw' }}>
            <span>{e}</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 8px ${c}` }} />
            {n}
          </div>
        ))}
      </motion.div>

      {/* Divider */}
      <motion.div style={{ position: 'relative', zIndex: 10, width: 1, height: '3.5vh', background: BD, marginBottom: '3.5vh' }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={ph >= 3 ? { opacity: 1, scaleY: 1 } : {}}
        transition={{ duration: 0.45, ease: EASE }} />

      {/* Tagline */}
      <motion.p style={{ position: 'relative', zIndex: 10, fontFamily: INT, fontSize: '1.55vw', color: T2, fontWeight: 400, marginBottom: '3.5vh', letterSpacing: '0.18em', textTransform: 'uppercase' }}
        initial={{ opacity: 0 }}
        animate={ph >= 3 ? { opacity: 1 } : {}}
        transition={{ duration: 0.75, ease: EASE }}>
        India's SuperLocal App
      </motion.p>

      {/* CTA */}
      <motion.div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '1.5vw', alignItems: 'center' }}
        initial={{ opacity: 0, y: 16 }}
        animate={ph >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}>
        <Link href="/">
          <motion.button onClick={onDone}
            style={{ padding: '14px 48px', borderRadius: 8, background: GD, color: '#fff', fontFamily: OFT, fontWeight: 800, fontSize: '1.45vw', cursor: 'pointer', border: 'none', letterSpacing: '-0.01em', position: 'relative', overflow: 'hidden' }}
            animate={{ boxShadow: [`0 8px 32px ${G}40, 0 0 0 1px ${G}25`, `0 12px 48px ${G}65, 0 0 0 1px ${G}45`, `0 8px 32px ${G}40, 0 0 0 1px ${G}25`] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.975 }}>
            Join the Waitlist →
          </motion.button>
        </Link>
      </motion.div>

      {/* Clavix credit */}
      <motion.p
        style={{ position: 'relative', zIndex: 10, fontSize: '0.8vw', color: `${T2}70`, letterSpacing: '.1em', marginTop: '2vh', fontFamily: INT }}
        initial={{ opacity: 0 }}
        animate={ph >= 4 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}>
        A Clavix Technologies product
      </motion.p>

      {/* Bottom progress line */}
      <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2.5, background: BD, zIndex: 10 }}
        initial={{ opacity: 0 }} animate={ph >= 3 ? { opacity: 1 } : {}}>
        <motion.div style={{ height: '100%', background: GD }}
          initial={{ width: '0%' }}
          animate={ph >= 3 ? { width: '100%' } : {}}
          transition={{ duration: 3.5, ease: 'linear' }} />
      </motion.div>
    </motion.div>
  );
}

/* ── SplashVideoCore — embeddable, no nav ───────────────── */
export function SplashVideoCore({ onDone }: { onDone?: () => void }) {
  const { scene, go } = useAutoAdvance(5, onDone);
  const SCENE_LABELS = ['Brand', 'Grocery', 'Food', 'India', 'Launch'];

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: BG }}>
      {/* Cinematic letterbox — top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${G}90, ${G}40, ${G}90)`, zIndex: 200, pointerEvents: 'none' }} />
      {/* Cinematic letterbox — bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${G}40, ${G}90, ${G}40)`, zIndex: 200, pointerEvents: 'none' }} />

      {/* ── Segmented progress bar ── */}
      <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', alignItems: 'center', gap: 6 }}>
        {SCENE_LABELS.map((label, i) => (
          <button key={i} onClick={() => go(i)} title={label}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0' }}>
            <div style={{ width: 40, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative' }}>
              {i < scene && (
                <div style={{ position: 'absolute', inset: 0, background: `${G}CC` }} />
              )}
              {i === scene && (
                <motion.div
                  style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: G }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: DURATIONS[scene] / 1000, ease: 'linear' }}
                  key={scene}
                />
              )}
            </div>
            <span style={{ fontFamily: INT, fontSize: 9, fontWeight: 600, color: i === scene ? G : 'rgba(255,255,255,0.28)', letterSpacing: '.06em', textTransform: 'uppercase' as const, transition: 'color .3s' }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 20, width: '100%', height: '100%' }}>
        <AnimatePresence mode="sync">
          {scene === 0 && <Scene1 key="s1" />}
          {scene === 1 && <Scene2 key="s2" />}
          {scene === 2 && <Scene3 key="s3" />}
          {scene === 3 && <Scene4 key="s4" />}
          {scene === 4 && <Scene5 key="s5" onDone={onDone} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── SplashVideo — standalone page with back nav ────────── */
export function SplashVideo() {
  const [, setLoc] = useLocation();
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Glassmorphism back button */}
      <button
        onClick={() => setLoc('/')}
        style={{ position: 'absolute', top: 22, left: 22, zIndex: 200, padding: '7px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.65)', fontFamily: INT, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '.02em', transition: 'all .18s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'; }}>
        ← Back
      </button>
      <SplashVideoCore />
    </div>
  );
}
