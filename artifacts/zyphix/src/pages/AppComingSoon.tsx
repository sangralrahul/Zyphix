import { apiFetch } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ArrowRight, Check, Bell, ChevronLeft, Apple, Play,
  Zap, MapPin, Tag, ShoppingBag, UtensilsCrossed, RefreshCw,
  Sparkles, Search, Clock, Star,
} from 'lucide-react';

/* ── Brand tokens ── */
const INK = '#04100B';
const G = '#0DA366';
const G2 = '#00E28A';
const MINT = '#6EE7B7';

/* Launch target — a fixed future date used for the live countdown */
const LAUNCH_TARGET = new Date('2026-08-15T09:00:00Z').getTime();

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return [
    { v: p(d), l: 'Days' },
    { v: p(h), l: 'Hours' },
    { v: p(m), l: 'Minutes' },
    { v: p(s), l: 'Seconds' },
  ];
}

/* ── Crafted phone mockup with a mini Zyphix UI ── */
function PhoneMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 18 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* rotating conic halo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '-16% -22%', borderRadius: '50%',
          background: `conic-gradient(from 0deg, transparent 0%, ${G}55 15%, transparent 35%, ${G2}44 55%, transparent 75%, ${MINT}33 92%, transparent 100%)`,
          filter: 'blur(34px)', opacity: 0.8, pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative', width: 288, height: 590, borderRadius: 46,
          background: 'linear-gradient(160deg, #0c1a14, #060f0b)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 60px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 10px rgba(0,0,0,0.35)',
          padding: 10, boxSizing: 'border-box',
        }}
      >
        {/* screen */}
        <div style={{ width: '100%', height: '100%', borderRadius: 38, background: '#F6F8F6', overflow: 'hidden', position: 'relative', boxSizing: 'border-box' }}>
          {/* dynamic island */}
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 92, height: 26, borderRadius: 20, background: '#04100B', zIndex: 5 }} />
          {/* app header */}
          <div style={{ background: `linear-gradient(150deg, ${G} 0%, #0a7d4f 100%)`, padding: '46px 16px 18px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, letterSpacing: '-.04em', fontSize: 18 }}>ZYPHI<span style={{ color: MINT }}>X</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,.16)', padding: '4px 9px', borderRadius: 20 }}>
                <Clock size={11} /> 12 min
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 12, padding: '9px 12px' }}>
              <Search size={14} color={G} />
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 500 }}>Search groceries & food…</span>
            </div>
          </div>
          {/* dual hero */}
          <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { t: 'Zyphix Now', s: 'Grocery · 12m', bg: 'linear-gradient(160deg,#0DA366,#065f46)', Icon: ShoppingBag },
              { t: 'Zyphix Eats', s: 'Food · Hot', bg: 'linear-gradient(160deg,#f97316,#c2410c)', Icon: UtensilsCrossed },
            ].map(({ t, s, bg, Icon }) => (
              <div key={t} style={{ borderRadius: 14, background: bg, padding: 12, color: '#fff', height: 96, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Icon size={20} />
                <div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 12.5, lineHeight: 1.1 }}>{t}</div>
                  <div style={{ fontSize: 9.5, opacity: .85 }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
          {/* category chips */}
          <div style={{ padding: '0 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Veg', 'Dairy', 'Snacks', 'Pharmacy'].map(c => (
              <span key={c} style={{ fontSize: 10, fontWeight: 700, color: '#065f46', background: '#DCFCE7', padding: '5px 10px', borderRadius: 20 }}>{c}</span>
            ))}
          </div>
          {/* order card */}
          <div style={{ margin: 14, padding: 12, borderRadius: 14, background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 20px rgba(0,0,0,.05)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={17} color={G} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111827' }}>Arriving in 12 min</div>
              <div style={{ height: 5, borderRadius: 3, background: '#EAF6EF', marginTop: 6, overflow: 'hidden' }}>
                <motion.div animate={{ width: ['20%', '75%', '20%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ height: '100%', background: G, borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 62 }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', color: '#fff', letterSpacing: '-.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 7 }}>{l}</div>
    </div>
  );
}

/* ── Main page ── */
export function AppComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const countdown = useCountdown(LAUNCH_TARGET);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'app-page' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Something went wrong.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { Icon: Zap, text: '30-minute grocery delivery' },
    { Icon: UtensilsCrossed, text: 'Food from local dhabas' },
    { Icon: MapPin, text: 'Live order tracking' },
    { Icon: Tag, text: 'App-exclusive deals' },
    { Icon: Bell, text: 'Instant push updates' },
    { Icon: RefreshCw, text: 'One-tap reorder' },
  ];

  const marquee = ['Groceries', 'Street Food', 'Pharmacy', 'Dairy & Eggs', 'Biryani', 'Fresh Veg', 'Home Services', 'Sweets', 'Beverages', 'Snacks'];

  return (
    <div data-testid="app-coming-soon" style={{ minHeight: '100vh', background: INK, position: 'relative', overflow: 'hidden', fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes zx-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes zx-spin { to { transform: rotate(360deg); } }
        .zx-input::placeholder { color: rgba(255,255,255,.32); }
        @media (max-width: 900px){ .zx-hero { grid-template-columns: 1fr !important; } .zx-phone-wrap { justify-content: center !important; margin-top: 12px; } }
      `}</style>

      {/* ── Background layers ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-25%', left: '-12%', width: '65vw', height: '65vw', borderRadius: '50%', background: `radial-gradient(circle, ${G}33 0%, transparent 62%)`, filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', bottom: '-30%', right: '-15%', width: '60vw', height: '60vw', borderRadius: '50%', background: `radial-gradient(circle, ${G2}22 0%, transparent 64%)`, filter: 'blur(20px)' }} />
        {/* fine grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(circle at 50% 30%, black, transparent 78%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black, transparent 78%)' }} />
        {/* grain */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* ── Nav ── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: `linear-gradient(135deg, ${G}, ${G2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 18px ${G}55` }}>
            <span style={{ color: '#fff', fontWeight: 900, fontStyle: 'italic', fontSize: 15, fontFamily: "'Outfit',sans-serif" }}>//</span>
          </div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '-.05em', color: '#fff' }}>ZYPHI<span style={{ color: MINT }}>X</span></span>
        </a>
        <a data-testid="back-home-link" href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.55)', textDecoration: 'none', transition: 'color .15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.55)'}>
          <ChevronLeft size={15} /> Back to Home
        </a>
      </div>

      {/* ── Hero ── */}
      <div className="zx-hero" style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '30px 24px 40px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'center' }}>

        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: `${G}1f`, border: `1px solid ${G}45`, borderRadius: 99, padding: '7px 15px', marginBottom: 26 }}>
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: G2, animation: 'zx-spin 1s linear infinite', boxShadow: `0 0 0 0 ${G2}` }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: G2, boxShadow: `0 0 10px ${G2}` }} />
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: MINT, letterSpacing: '.12em', textTransform: 'uppercase' }}>Launching on iOS &amp; Android</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .7 }}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(2.6rem, 6vw, 4.6rem)', color: '#fff', lineHeight: 0.98, letterSpacing: '-.055em', margin: '0 0 20px' }}>
            Your city,<br />
            <span style={{ background: `linear-gradient(105deg, ${G2} 0%, ${MINT} 55%, #a7f3d0 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in your pocket.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .6 }}
            style={{ fontSize: 16.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, margin: '0 0 30px', maxWidth: 500 }}>
            The Zyphix app is almost here — groceries in 30 minutes, food from local dhabas, and hyperlocal services, all in one place. Register now for launch-day perks.
          </motion.p>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24, duration: .6 }}
            style={{ display: 'flex', alignItems: 'stretch', gap: 10, marginBottom: 32 }}>
            {countdown.map((c, i) => (
              <React.Fragment key={c.l}>
                <div style={{ background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 16, padding: '14px 4px', flex: 1, textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                  <Stat v={c.v} l={c.l} />
                </div>
                {i < countdown.length - 1 && <div style={{ alignSelf: 'center', color: 'rgba(255,255,255,.2)', fontWeight: 900, fontSize: 22 }}>:</div>}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Notify form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .6 }}
            style={{ maxWidth: 500 }}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 210, position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focused ? G2 : 'rgba(255,255,255,.35)', transition: 'color .15s' }} />
                    <input
                      data-testid="notify-email-input"
                      className="zx-input"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="you@email.com"
                      style={{
                        width: '100%', paddingLeft: 44, paddingRight: 14, height: 52,
                        borderRadius: 14, fontSize: 14.5, color: '#fff', fontFamily: 'inherit', outline: 'none', fontWeight: 500,
                        background: focused ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.05)',
                        border: `1.5px solid ${error ? '#EF4444' : focused ? `${G}90` : 'rgba(255,255,255,.12)'}`,
                        boxSizing: 'border-box', transition: 'all .15s',
                        boxShadow: focused ? `0 0 0 4px ${G}22` : 'none',
                      }}
                    />
                  </div>
                  <motion.button
                    data-testid="notify-submit-button"
                    whileHover={loading ? {} : { scale: 1.03, y: -1 }} whileTap={loading ? {} : { scale: 0.97 }}
                    type="submit" disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 26px', height: 52, borderRadius: 14, background: loading ? `${G}80` : `linear-gradient(135deg, ${G}, ${G2})`, color: '#fff', fontSize: 15, fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', boxShadow: `0 10px 30px ${G}55`, fontFamily: "'Outfit',sans-serif" }}>
                    {loading ? 'Sending…' : <>Notify Me <ArrowRight size={16} /></>}
                  </motion.button>
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', fontSize: 12.5, color: '#F87171', margin: '2px 0 0' }}>{error}</motion.p>}
                </motion.form>
              ) : (
                <motion.div key="ok" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 20px', background: `${G}1c`, border: `1.5px solid ${G}55`, borderRadius: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 18px ${G}77` }}>
                    <Check size={17} color="#fff" strokeWidth={3} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>You're on the launch list!</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>We'll email your exclusive offer the day we go live.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 16 }}>
              <div style={{ display: 'flex' }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, ${G2})`, border: `2px solid ${INK}`, marginLeft: i ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={11} color="#fff" fill="#fff" />
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: 'rgba(255,255,255,.45)' }}>
                <span style={{ color: MINT, fontWeight: 800 }}>3,200+</span> people already waiting
              </p>
            </div>
          </motion.div>

          {/* store badges */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .6 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
            {[
              { Icon: Apple, sub: 'Download on the', title: 'App Store' },
              { Icon: Play, sub: 'Get it on', title: 'Google Play' },
            ].map(({ Icon, sub, title }) => (
              <div key={title} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderRadius: 14, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', opacity: .85 }}>
                <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 8, fontWeight: 900, color: INK, background: MINT, padding: '1px 6px', borderRadius: 5, letterSpacing: '.06em' }}>SOON</div>
                <Icon size={24} color="#fff" fill="#fff" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: 9.5, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{sub}</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-.02em', fontFamily: "'Outfit',sans-serif" }}>{title}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — phone + feature list */}
        <div className="zx-phone-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          <PhoneMock />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .6 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 380 }}>
            {features.map(({ Icon, text }, i) => (
              <motion.div key={text} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .65 + i * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${G}22`, border: `1px solid ${G}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={MINT} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.75)', lineHeight: 1.2 }}>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,.07)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '16px 0', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'zx-marquee 26s linear infinite' }}>
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 26px', fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,.28)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>
              {m} <Sparkles size={13} color={G} />
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: `linear-gradient(to top, ${G}12, transparent)`, pointerEvents: 'none' }} />
    </div>
  );
}
