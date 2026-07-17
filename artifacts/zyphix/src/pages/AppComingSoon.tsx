import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check, Bell, ChevronLeft } from 'lucide-react';

const G = '#0DA366';
const G2 = '#00D97E';

/* ── Floating particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const COLORS = ['#0DA366', '#00D97E', '#34D399', '#6EE7B7', '#ffffff'];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  );
}

/* ── Animated phone mockup ── */
function PhoneMockup({ icon, color, label, delay = 0 }: { icon: string; color: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 130, height: 260, borderRadius: 28,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 10, position: 'relative', overflow: 'hidden',
          boxShadow: `0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Screen glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`, pointerEvents: 'none' }} />
        {/* Notch */}
        <div style={{ position: 'absolute', top: 10, width: 40, height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.4)' }} />
        {/* App icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(145deg, ${color}33, ${color}11)`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          {icon}
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '.04em' }}>{label}</p>
        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: 12, width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Store badge button ── */
function StoreBadge({ icon, title, sub, comingSoon }: { icon: React.ReactNode; title: string; sub: string; comingSoon?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 13, padding: '13px 22px',
        borderRadius: 16,
        background: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)'}`,
        cursor: 'pointer', transition: 'all .2s', position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}
    >
      {comingSoon && (
        <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 8, fontWeight: 800, color: G2, letterSpacing: '.06em', textTransform: 'uppercase', background: `${G2}18`, padding: '1px 5px', borderRadius: 4 }}>
          Soon
        </div>
      )}
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500, lineHeight: 1, marginBottom: 3 }}>{sub}</p>
        <p style={{ fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-.02em' }}>{title}</p>
      </div>
    </motion.button>
  );
}

/* ── Main page ── */
export function AppComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/notify', {
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
    { icon: '⚡', text: '30-min grocery delivery' },
    { icon: '🍱', text: 'Food from local dhabas' },
    { icon: '📍', text: 'Live order tracking' },
    { icon: '🏷️', text: 'App-exclusive deals' },
    { icon: '🔔', text: 'Push notifications' },
    { icon: '💳', text: 'One-tap reorder' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#040A0F', position: 'relative', overflow: 'hidden' }}>

      {/* ── Animated gradient background ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,163,102,0.22) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,217,126,0.15) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{ position: 'absolute', top: '40%', left: '40%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)' }}
        />
      </div>

      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(13,163,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,163,102,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* ── Navigation bar ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>//</span>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '-.04em', color: '#fff' }}>
            ZYPHI<span style={{ color: '#34D399' }}>X</span>
          </span>
        </a>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color .15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}>
          <ChevronLeft size={15} /> Back to Home
        </a>
      </div>

      {/* ── Main content ── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* ── Left: Text + CTA ── */}
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${G}18`, border: `1px solid ${G}40`, borderRadius: 99, padding: '7px 16px', marginBottom: 28 }}
          >
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Bell size={13} color={G2} strokeWidth={2.5} />
            </motion.span>
            <span style={{ fontSize: 12, fontWeight: 700, color: G2, letterSpacing: '.04em' }}>LAUNCHING ON iOS & ANDROID</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#fff', lineHeight: 1.05, letterSpacing: '-.05em', marginBottom: 18 }}
          >
            Zyphix is coming<br />
            <span style={{ background: `linear-gradient(135deg, ${G2} 0%, #34D399 50%, #6EE7B7 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              to your phone.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}
          >
            India's SuperLocal app is arriving on the App Store and Google Play. Get groceries, food, and local services delivered — all in one app. Be the first to know when we launch.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}
          >
            {features.map((f, i) => (
              <motion.span
                key={f.text}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.06 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '6px 14px', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}
              >
                {f.icon} {f.text}
              </motion.span>
            ))}
          </motion.div>

          {/* Store badges */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}
          >
            <StoreBadge
              icon={<svg width="28" height="28" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.2-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.2 135.4-316.8 268.9-316.8 71 0 130.1 46.3 173.4 46.3 41.7 0 107.7-50.4 185.3-50.4 30.9 0 108.2 2.6 168.2 81.4zm-90.5-185.3c33.5-39.8 57-94.8 57-150.8 0-7.7-.7-15.4-2-22.5-53.7 2-117.3 35.7-157.4 80.7-34.5 39.2-64.4 94.8-64.4 153.6 0 8.4 1.3 16.7 1.9 19.2 3.5.6 9 1.3 14.5 1.3 47.7 0 105.4-31.9 150.4-81.5z"/></svg>}
              sub="Download on the" title="App Store" comingSoon
            />
            <StoreBadge
              icon={<svg width="28" height="28" viewBox="0 0 512 512" fill="none"><path d="M48 432c0 17.7 19.3 28 34.3 18.9L416 272v-32L82.3 61.1C67.3 52 48 62.3 48 80v352z" fill="#4285F4"/><path d="M48 80c0-17.7 19.3-28 34.3-18.9L282 181l-52 52L48 80z" fill="#34A853"/><path d="M230 181l52-52 100.4 60.6-52 52L230 181z" fill="#FBBC05"/><path d="M282 331 82.3 449.9C67.3 459 48 448.7 48 431l182-153 52 53z" fill="#EA4335"/></svg>}
              sub="Get it on" title="Google Play" comingSoon
            />
          </motion.div>

          {/* Email form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Bell size={15} color={G2} />
                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>Get notified when we launch</p>
              </div>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 1.6 }}>
                Join 3,000+ people waiting for the Zyphix app. We'll send you a launch-day exclusive offer.
              </p>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focused ? G2 : 'rgba(255,255,255,0.3)', transition: 'color .15s' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(''); }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="your@email.com"
                        style={{
                          width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 13, paddingBottom: 13,
                          borderRadius: 12, fontSize: 13.5, color: '#fff', fontFamily: 'inherit', outline: 'none',
                          background: focused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                          border: `1.5px solid ${error ? '#EF4444' : focused ? `${G}80` : 'rgba(255,255,255,0.1)'}`,
                          boxSizing: 'border-box', transition: 'all .15s',
                        }}
                      />
                    </div>
                    <motion.button
                      whileHover={loading ? {} : { scale: 1.04 }} whileTap={loading ? {} : { scale: 0.97 }}
                      type="submit"
                      disabled={loading}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 12, background: loading ? `${G}80` : `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`, color: '#fff', fontSize: 14, fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', boxShadow: `0 8px 24px ${G}44` }}
                    >
                      {loading ? 'Sending…' : <><span>Notify Me</span> <ArrowRight size={15} /></>}
                    </motion.button>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', fontSize: 12, color: '#EF4444', marginTop: -4 }}>{error}</motion.p>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: `${G}18`, border: `1.5px solid ${G}40`, borderRadius: 12 }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={16} color="#fff" strokeWidth={3} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>You're on the list!</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>We'll email you the moment the app drops. 🚀</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}
          >
            <div style={{ display: 'flex' }}>
              {['🧑', '👩', '👨', '🙋'].map((e, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${G}44, ${G2}22)`, border: '2px solid #040A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginLeft: i ? -8 : 0 }}>{e}</div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ color: G2, fontWeight: 700 }}>3,200+</span> people already signed up
            </p>
          </motion.div>
        </div>

        {/* ── Right: Phone mockups ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ flex: '0 1 380px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 20, paddingBottom: 20 }}
        >
          <PhoneMockup icon="🛒" color="#0DA366" label="Zyphix Now" delay={0.4} />
          <div style={{ transform: 'translateY(-28px)' }}>
            <PhoneMockup icon="🍱" color="#F97316" label="Zyphix Eats" delay={0.55} />
          </div>
          <PhoneMockup icon="📅" color="#6366F1" label="Zyphix Book" delay={0.7} />
        </motion.div>
      </div>

      {/* ── Bottom stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40 }}>
          {[
            { icon: '⭐', value: '4.8', label: 'Expected App Rating' },
            { icon: '🚀', value: 'Q2 2025', label: 'Target Launch' },
            { icon: '📱', value: 'iOS + Android', label: 'Both Platforms' },
            { icon: '🎁', value: '50% OFF', label: 'Launch Day Offer' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, marginBottom: 4 }}>{s.icon}</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: '#fff', fontSize: '1.35rem', letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subtle bottom gradient */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(13,163,102,0.06), transparent)', pointerEvents: 'none' }} />
    </div>
  );
}
