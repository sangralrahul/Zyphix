import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, MapPin, Phone, Instagram, Twitter, Linkedin,
  ChevronRight, Moon, Star, Menu, X, Search, Clock, ShieldCheck, Leaf, Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ZyphixLogo } from '../components/ZyphixLogo';
import { useLocation } from 'wouter';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — light theme system
───────────────────────────────────────────── */
const BG     = '#FFFFFF';
const BG2    = '#F8FAFB';
const SURF   = '#F3F4F6';
const CARD   = '#FFFFFF';
const BD     = '#E5E7EB';
const BD2    = '#D1D5DB';
const G      = '#16A34A';
const G2     = '#15803D';
const G_BG   = '#F0FDF4';
const G_BG2  = '#DCFCE7';
const G_BD   = '#BBF7D0';
const ORG    = '#EA580C';
const ORG_BG = '#FFF7ED';
const ORG_BD = '#FED7AA';
const T1     = '#111827';
const T2     = '#6B7280';
const T3     = '#9CA3AF';
const DARK   = '#0B0B0B';
const SH     = '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)';
const SH2    = '0 4px 16px rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.08)';

type Role = 'customer' | 'restaurant' | 'merchant' | 'delivery';

/* ─────────────────────────────────────────────
   ANNOUNCEMENT BAR
───────────────────────────────────────────── */
function AnnoBar() {
  const msgs = [
    '🎉  Early access — get ₹125 credit on your first order',
    '🚀  Now live across India — join 500+ on the waitlist',
    '🏪  Kirana store owner? List your store for free',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: G, padding: '10px 16px', textAlign: 'center', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.p key={idx}
          initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', lineHeight: 1 }}>
          {msgs[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, openModal } = useAuth();
  const [, nav] = useLocation();

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 16);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scroll = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-50"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${solid ? BD : 'transparent'}`, boxShadow: solid ? SH : 'none', transition: 'all 0.2s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 32 }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }} onClick={e => { e.preventDefault(); nav('/'); }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>Z</span>
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: T1, letterSpacing: '-0.03em' }}>ZYPHIX</span>
          </div>
        </a>

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', gap: 2, marginRight: 'auto' }} className="hidden md:flex">
          {[['ZyphixNow', () => scroll('services')], ['ZyphixEats', () => scroll('services')], ['How It Works', () => scroll('how')], ['About', () => { window.location.href = '/about'; }]].map(([label, fn]) => (
            <button key={label as string} onClick={fn as () => void}
              style={{ padding: '6px 13px', borderRadius: 8, fontSize: 13.5, fontWeight: 500, color: T2, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = T1; e.currentTarget.style.background = SURF; }}
              onMouseLeave={e => { e.currentTarget.style.color = T2; e.currentTarget.style.background = 'transparent'; }}>
              {label as string}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }} className="hidden md:flex">
          {/* Dark theme toggle */}
          <button onClick={() => nav('/dark')} title="Dark mode"
            style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${BD}`, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T3, transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T1; (e.currentTarget as HTMLElement).style.color = T1; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; (e.currentTarget as HTMLElement).style.color = T3; }}>
            <Moon size={15} />
          </button>

          {user ? (
            <button onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 8, border: `1px solid ${BD}`, background: BG, color: T2, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>{user.name[0]}</div>
              {user.name.split(' ')[0]}
            </button>
          ) : (
            <button onClick={openModal}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: 'transparent', color: T2, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = T1; e.currentTarget.style.borderColor = BD2; }}
              onMouseLeave={e => { e.currentTarget.style.color = T2; e.currentTarget.style.borderColor = BD; }}>
              Sign in
            </button>
          )}
          <button onClick={() => scroll('waitlist')}
            style={{ padding: '8px 18px', borderRadius: 8, background: G, color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = G2)}
            onMouseLeave={e => (e.currentTarget.style.background = G)}>
            Join Waitlist
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: T1, cursor: 'pointer', padding: 4 }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ borderTop: `1px solid ${BD}`, background: BG, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[['ZyphixNow', 'services'], ['ZyphixEats', 'services'], ['How It Works', 'how'], ['Join Waitlist', 'waitlist']].map(([l, id]) => (
                <button key={l} onClick={() => scroll(id)}
                  style={{ padding: '11px 0', textAlign: 'left', background: 'none', border: 'none', color: l === 'Join Waitlist' ? G : T2, fontSize: 14, fontWeight: l === 'Join Waitlist' ? 700 : 500, cursor: 'pointer' }}>
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO — two-column, clean and bright
───────────────────────────────────────────── */
function Hero() {
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const categories = [
    { em: '🥦', label: 'Vegetables' },
    { em: '🥛', label: 'Dairy' },
    { em: '💊', label: 'Pharmacy' },
    { em: '🍱', label: 'Restaurants' },
    { em: '🛒', label: 'Kirana' },
    { em: '🍰', label: 'Bakery' },
  ];

  return (
    <section style={{ background: BG, padding: '80px 24px 100px', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 640, height: 640, background: 'radial-gradient(circle at 70% 30%, rgba(22,163,74,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 400, height: 400, background: 'radial-gradient(circle, rgba(234,88,12,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 72, alignItems: 'center', position: 'relative' }}>
        {/* ── Left: copy ── */}
        <div>
          {/* Launch badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G_BG, border: `1px solid ${G_BD}`, borderRadius: 99, padding: '6px 14px 6px 8px', marginBottom: 28 }}>
            <span style={{ background: G, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, letterSpacing: '0.04em' }}>LAUNCHING</span>
            <span style={{ fontSize: 13, color: G2, fontWeight: 600 }}>Across India · 2025</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.08 }}
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem, 4.2vw, 3.7rem)', color: T1, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 20 }}>
            Groceries & food<br />
            <span style={{ color: G }}>in 30 minutes,</span><br />
            from your neighbourhood.
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16 }}
            style={{ fontSize: 16.5, color: T2, lineHeight: 1.72, maxWidth: 460, marginBottom: 36 }}>
            Zyphix connects you with local kirana stores and restaurants near you — real store prices, delivered to your door, powered by your neighbourhood.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 40 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => scroll('waitlist')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', fontSize: 14.5, fontWeight: 700, padding: '14px 28px', borderRadius: 11, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.3)', letterSpacing: '-0.01em' }}>
              Join the Waitlist — Free
              <ArrowRight size={16} />
            </motion.button>
            <button onClick={() => scroll('how')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: T2, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T1)}
              onMouseLeave={e => (e.currentTarget.style.color = T2)}>
              How it works <ChevronRight size={14} />
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.36 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['A','B','C','D','E'].map((l, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${130+i*18},60%,${42+i*4}%)`, border: '2px solid #fff', marginLeft: i ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>{l}</div>
              ))}
            </div>
            <div style={{ height: 18, width: 1, background: BD }} />
            <p style={{ fontSize: 13.5, color: T2 }}><strong style={{ color: T1 }}>500+</strong> people on the waitlist</p>
            <div style={{ height: 18, width: 1, background: BD }} />
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#FBBF24" color="#FBBF24" />)}
            </div>
            <p style={{ fontSize: 13, color: T3 }}>5.0 from early users</p>
          </motion.div>
        </div>

        {/* ── Right: app preview card ── */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
          style={{ position: 'relative' }}>

          {/* Main app card */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 22, overflow: 'hidden', boxShadow: SH2 }}>
            {/* Card header */}
            <div style={{ background: G, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: 12, color: '#fff', fontFamily: "'Outfit',sans-serif" }}>Z</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>ZYPHIX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '4px 10px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Live across India</span>
              </div>
            </div>

            {/* Location row */}
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={14} color={G} />
              <span style={{ fontSize: 13, color: T1, fontWeight: 600 }}>Koramangala, Bengaluru</span>
              <span style={{ fontSize: 11, color: T3, marginLeft: 'auto' }}>Change</span>
            </div>

            {/* Search bar */}
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BD}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG2, border: `1px solid ${BD}`, borderRadius: 10, padding: '9px 13px' }}>
                <Search size={14} color={T3} />
                <span style={{ fontSize: 13, color: T3 }}>Search groceries, restaurants...</span>
              </div>
            </div>

            {/* Service tabs */}
            <div style={{ padding: '14px 20px 0', display: 'flex', gap: 8 }}>
              {[{ l: '⚡ ZyphixNow', c: G, bg: G_BG, bd: G_BD }, { l: '🍱 ZyphixEats', c: ORG, bg: ORG_BG, bd: ORG_BD }].map((t, i) => (
                <div key={i} style={{ flex: 1, padding: '8px 12px', borderRadius: 10, background: t.bg, border: `1.5px solid ${t.bd}`, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: t.c }}>{t.l}</p>
                  <p style={{ fontSize: 10, color: T3, marginTop: 2 }}>{i === 0 ? '30 min delivery' : '200+ restaurants'}</p>
                </div>
              ))}
            </div>

            {/* Category grid */}
            <div style={{ padding: '16px 20px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Popular categories</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {categories.map((c, i) => (
                  <div key={i} style={{ background: BG2, border: `1px solid ${BD}`, borderRadius: 11, padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G_BD; (e.currentTarget as HTMLElement).style.background = G_BG; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; (e.currentTarget as HTMLElement).style.background = BG2; }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{c.em}</div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: T2 }}>{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating delivery badge */}
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: -20, left: -24, background: CARD, border: `1px solid ${BD}`, borderRadius: 14, padding: '13px 16px', boxShadow: SH2, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: G_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T1, lineHeight: 1 }}>28 min</p>
              <p style={{ fontSize: 11, color: T3, marginTop: 3 }}>Avg. delivery time</p>
            </div>
          </motion.div>

          {/* Floating rating badge */}
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', top: 24, right: -24, background: CARD, border: `1px solid ${BD}`, borderRadius: 14, padding: '12px 16px', boxShadow: SH2, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 20 }}>🏪</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T1, lineHeight: 1 }}>200+</p>
              <p style={{ fontSize: 11, color: T3, marginTop: 3 }}>Partner stores</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
function Services() {
  const scroll = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  const cards = [
    {
      badge: '⚡ ZyphixNow', color: G, bg: G_BG, bd: G_BD, textColor: G2,
      title: 'Your local kirana,\nnow supercharged.',
      desc: 'Order from verified kirana stores near you. Same products, same prices — just delivered to your door in under 30 minutes.',
      tags: ['Vegetables', 'Dairy & Eggs', 'Pharmacy', 'Household', 'Snacks'],
      stat: '30 min', statSub: 'avg. delivery',
    },
    {
      badge: '🍱 ZyphixEats', color: ORG, bg: ORG_BG, bd: ORG_BD, textColor: ORG,
      title: "Food from places\nyou actually love.",
      desc: "Restaurants, dhabas, cloud kitchens — including the local gem that's not on Swiggy. Real local food, delivered fresh.",
      tags: ['Biryani', 'Pizza', 'Burgers', 'Thali', 'Chai & Snacks'],
      stat: '200+', statSub: 'restaurant partners',
    },
  ];

  return (
    <section id="services" style={{ background: BG2, borderTop: `1px solid ${BD}`, padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Two services, one app</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: T1, letterSpacing: '-0.04em', lineHeight: 1.12 }}>
            Everything you need,<br />from your neighbourhood.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {cards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 20, padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: SH, transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH2; (e.currentTarget as HTMLElement).style.borderColor = c.bd; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH; (e.currentTarget as HTMLElement).style.borderColor = BD; }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.bg, border: `1px solid ${c.bd}`, borderRadius: 99, padding: '6px 14px', alignSelf: 'flex-start', marginBottom: 24 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.textColor }}>{c.badge}</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem, 2vw, 1.85rem)', color: T1, letterSpacing: '-0.03em', lineHeight: 1.18, marginBottom: 14, whiteSpace: 'pre-line' }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.72, marginBottom: 24 }}>{c.desc}</p>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 28 }}>
                  {c.tags.map(t => (
                    <span key={t} style={{ background: SURF, border: `1px solid ${BD}`, borderRadius: 7, padding: '4px 12px', fontSize: 12, color: T2, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ background: c.bg, border: `1px solid ${c.bd}`, borderRadius: 11, padding: '12px 18px' }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: c.textColor, lineHeight: 1 }}>{c.stat}</p>
                    <p style={{ fontSize: 11, color: T3, marginTop: 3, fontWeight: 500 }}>{c.statSub}</p>
                  </div>
                  <button onClick={scroll} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.color, color: '#fff', fontSize: 13, fontWeight: 700, padding: '11px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'opacity 0.15s', boxShadow: `0 4px 12px ${c.color}30` }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                    Join Waitlist <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS ROW
───────────────────────────────────────────── */
function StatsRow() {
  const stats = [
    { v: '500+', l: 'People on waitlist' },
    { v: '200+', l: 'Partner stores' },
    { v: '< 30 min', l: 'Avg. delivery' },
    { v: '₹0', l: 'Platform fees' },
  ];
  return (
    <div style={{ background: G, padding: '44px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', color: '#fff', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 6 }}>{s.v}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>{s.l}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', icon: <MapPin size={22} color={G} />, title: 'Set your location', desc: 'Allow GPS or enter your address. We instantly surface verified kirana stores and restaurants within your area.' },
    { n: '02', icon: <Search size={22} color={G} />, title: 'Browse & place order', desc: "Choose from 1,000+ grocery items or local restaurants — all at the same price you'd pay in-store." },
    { n: '03', icon: <Clock size={22} color={G} />, title: 'Delivered in 30 min', desc: 'Track your order live. Our delivery partner picks up from the nearest store and reaches you fast.' },
  ];
  return (
    <section id="how" style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Simple by design</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: T1, letterSpacing: '-0.04em', lineHeight: 1.12 }}>How Zyphix works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              <div style={{ background: BG2, border: `1px solid ${BD}`, borderRadius: 18, padding: '32px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: G_BG, border: `1px solid ${G_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: SURF, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: T1, marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: T2, lineHeight: 1.72 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WAITLIST FORM
───────────────────────────────────────────── */
function WaitlistSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [done, setDone] = useState(false);
  const [pos, setPos] = useState(500);
  const [foc, setFoc] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('zyphix_waitlist');
    if (s) { const p = JSON.parse(s); setDone(true); setPos(p.position ?? 500); }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) return;
    const newPos = pos + Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('zyphix_waitlist', JSON.stringify({ name, phone, city, role, position: newPos, joinedAt: new Date().toISOString() }));
    setPos(newPos);
    setDone(true);
  };

  const inputStyle = (id: string) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10, background: BG, border: `1.5px solid ${foc === id ? G : BD}`,
    color: T1, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
  });

  const roles: { id: Role; label: string; em: string }[] = [
    { id: 'customer', label: 'Customer', em: '🛒' },
    { id: 'restaurant', label: 'Restaurant', em: '🍽️' },
    { id: 'merchant', label: 'Merchant', em: '🏪' },
    { id: 'delivery', label: 'Delivery', em: '🛵' },
  ];

  return (
    <section id="waitlist" style={{ background: G_BG, borderTop: `1px solid ${G_BD}`, borderBottom: `1px solid ${G_BD}`, padding: '96px 24px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: G_BG2, border: `1px solid ${G_BD}`, borderRadius: 99, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: G, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: G2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Early access open</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: T1, letterSpacing: '-0.04em', lineHeight: 1.12, marginBottom: 10 }}>
            Reserve your spot.<br />It's completely free.
          </h2>
          <p style={{ fontSize: 15, color: T2, lineHeight: 1.68 }}>
            You're joining <strong style={{ color: T1 }}>{pos}+</strong> early members. Get launch credits, priority access, and 10 free deliveries.
          </p>
        </div>

        {done ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ background: CARD, border: `1px solid ${G_BD}`, borderRadius: 20, padding: '40px 32px', textAlign: 'center', boxShadow: SH2 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: G_BG, border: `1px solid ${G_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 26, color: G }}>✓</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: T1, marginBottom: 8 }}>You're on the list!</h3>
            <p style={{ fontSize: 14, color: T2, lineHeight: 1.65, marginBottom: 28 }}>
              You're <strong style={{ color: G }}>#{pos}</strong> on the waitlist. We'll notify you the moment Zyphix launches.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['🎁', '₹125 credit'], ['🚀', 'Priority access'], ['🆓', '10 free deliveries']].map(([em, l]) => (
                <div key={l} style={{ background: G_BG, border: `1px solid ${G_BD}`, borderRadius: 9, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{em}</span><span style={{ fontSize: 12.5, fontWeight: 600, color: G2 }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <form onSubmit={submit}
            style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 20, padding: '32px', boxShadow: SH2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required
                style={inputStyle('name')} onFocus={() => setFoc('name')} onBlur={() => setFoc(null)} />
              <input placeholder="Mobile number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                style={inputStyle('phone')} onFocus={() => setFoc('phone')} onBlur={() => setFoc(null)} />
            </div>
            <select value={city} onChange={e => setCity(e.target.value)} required
              style={{ ...inputStyle('city'), color: city ? T1 : T3, appearance: 'none', cursor: 'pointer', marginBottom: 20 }}>
              <option value="">Select your city</option>
              {['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Kochi', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <p style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>I am joining as a</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 22 }}>
              {roles.map(r => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)}
                  style={{ padding: '11px 6px', borderRadius: 11, border: `1.5px solid ${role === r.id ? G : BD}`, background: role === r.id ? G_BG : BG2, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, marginBottom: 5 }}>{r.em}</div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: role === r.id ? G2 : T3, lineHeight: 1.2 }}>{r.label}</p>
                </button>
              ))}
            </div>

            <button type="submit"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: G, color: '#fff', fontSize: 14.5, fontWeight: 700, padding: '14px', borderRadius: 11, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.28)' }}>
              Join the Waitlist <ArrowRight size={16} />
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: T3, marginTop: 12 }}>
              <Check size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Free forever · No credit card · Unsubscribe anytime
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: 'Aditya K.', city: 'Bengaluru', rating: 5, text: "Finally an app that sources from my local kirana. Ordered at 11pm — arrived in 24 minutes. Prices are identical to what I'd pay at the store." },
    { name: 'Priya G.', city: 'Delhi', rating: 5, text: 'ZyphixEats found that small biryani place in Lajpat Nagar that none of the other apps have. Love that they support local restaurants.' },
    { name: 'Rohit A.', city: 'Mumbai', rating: 5, text: 'Joined the waitlist early and got a ₹125 credit. The team is genuinely responsive. Very excited for the Mumbai launch.' },
  ];
  return (
    <section style={{ background: BG2, borderTop: `1px solid ${BD}`, padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Early community</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: T1, letterSpacing: '-0.04em', lineHeight: 1.12 }}>What early members say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 18, padding: '26px', height: '100%', boxShadow: SH, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH2; (e.currentTarget as HTMLElement).style.borderColor = BD2; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = SH; (e.currentTarget as HTMLElement).style.borderColor = BD; }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={13} fill="#FBBF24" color="#FBBF24" />)}
                </div>
                <p style={{ fontSize: 14.5, color: T1, lineHeight: 1.72, marginBottom: 22, fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 18, borderTop: `1px solid ${BD}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: G_BG, border: `1px solid ${G_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: G2, fontSize: 13 }}>{r.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: T1, fontSize: 13.5, lineHeight: 1 }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: T3, marginTop: 3 }}>{r.city} · Early member</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 40, paddingTop: 40, borderTop: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 4 }}>As featured in</span>
          {['The Hindu', 'Economic Times', 'YourStory', 'Inc42', 'Entrackr'].map(m => (
            <span key={m} style={{ padding: '5px 14px', background: CARD, border: `1px solid ${BD}`, borderRadius: 7, fontSize: 12.5, fontWeight: 500, color: T2, boxShadow: SH }}>{m}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRUST SECTION
───────────────────────────────────────────── */
function TrustSection() {
  const pillars = [
    { icon: <ShieldCheck size={20} color={G} />, title: 'No price inflation', desc: 'MRP is MRP. We never mark up product prices. You pay what the store charges.' },
    { icon: <MapPin size={20} color={G} />, title: 'Hyperlocal first', desc: 'Built for India, city by city. We know the streets, the neighbourhoods, the dhabas.' },
    { icon: <Leaf size={20} color={G} />, title: 'Kirana-powered', desc: 'Every order supports a real local store — zero platform markup, maximum community impact.' },
    { icon: <Zap size={20} color={G} />, title: 'Partner-first earnings', desc: 'Kirana and restaurant partners earn more per order than on any other platform.' },
  ];

  return (
    <section style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Our philosophy</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: T1, letterSpacing: '-0.04em', lineHeight: 1.12, marginBottom: 18 }}>
            Built in India.<br />Built for India.
          </h2>
          <p style={{ fontSize: 15, color: T2, lineHeight: 1.72, maxWidth: 420, marginBottom: 32 }}>
            We started Zyphix because people across India deserve the same fast, reliable delivery experience — powered by the kirana stores they've trusted for decades.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '18px', background: BG2, border: `1px solid ${BD}`, borderRadius: 14, boxShadow: SH }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: G_BG, border: `1px solid ${G_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👨‍💼</div>
            <div>
              <p style={{ fontWeight: 700, color: T1, fontSize: 15, lineHeight: 1 }}>Rahul</p>
              <p style={{ fontSize: 12.5, color: T3, marginTop: 4 }}>Founder, Clavix Technologies Pvt. Ltd.</p>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {pillars.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}>
              <div style={{ background: BG2, border: `1px solid ${BD}`, borderRadius: 16, padding: '22px', height: '100%', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G_BD; (e.currentTarget as HTMLElement).style.background = G_BG; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; (e.currentTarget as HTMLElement).style.background = BG2; }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: G_BG, border: `1px solid ${G_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{p.icon}</div>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: T1, marginBottom: 7 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: T2, lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────── */
function CtaBanner() {
  const scroll = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section style={{ background: BG2, borderTop: `1px solid ${BD}`, padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`, borderRadius: 22, padding: '56px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 460, position: 'relative' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Launching soon</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 12 }}>Don't miss the launch.</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>Join now for ₹125 launch credit, 10 free deliveries, and priority access in your city.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
            <button onClick={scroll}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: G2, fontSize: 14, fontWeight: 700, padding: '14px 28px', borderRadius: 11, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              Join Waitlist — Free <ArrowRight size={15} />
            </button>
            <a href="https://wa.me/919682394363" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px 24px', borderRadius: 11, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
              <Phone size={15} /> WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#0B0B0B', borderTop: `1px solid rgba(255,255,255,0.07)` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>Z</span>
              </div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.03em' }}>ZYPHIX</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.72, maxWidth: 250, marginBottom: 20 }}>India's SuperLocal App — groceries & food from kirana stores near you. Now live across India.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { ic: <Twitter size={13} />, h: '#' },
                { ic: <Instagram size={13} />, h: '#' },
                { ic: <Linkedin size={13} />, h: '#' },
                { ic: <Phone size={13} />, h: 'https://wa.me/919682394363' },
              ].map(({ ic, h }, i) => (
                <a key={i} href={h} target="_blank" rel="noopener noreferrer"
                  style={{ width: 32, height: 32, borderRadius: 8, background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', transition: 'all 0.15s', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G; (e.currentTarget as HTMLElement).style.color = G; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}>
                  {ic}
                </a>
              ))}
            </div>
          </div>
          {[
            { t: 'Product', links: [{ l: 'ZyphixNow', h: '#' }, { l: 'ZyphixEats', h: '#' }, { l: 'For Restaurants', h: '/restaurant-setup' }, { l: 'For Merchants', h: '/merchant-setup' }, { l: 'Delivery Partners', h: '/delivery-setup' }] },
            { t: 'Company', links: [{ l: 'About Us', h: '/about' }, { l: 'Contact', h: '/contact' }, { l: 'Brand Video', h: '/splash-video' }, { l: 'Careers', h: '#' }] },
            { t: 'Legal', links: [{ l: 'Privacy Policy', h: '/privacy' }, { l: 'Terms of Service', h: '/terms' }, { l: 'Refund Policy', h: '/terms' }] },
          ].map(({ t, links }) => (
            <div key={t}>
              <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(({ l, h }) => (
                  <li key={l}><a href={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>© 2025 Clavix Technologies Pvt. Ltd. All rights reserved.</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>Made with care in India</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   WHATSAPP FLOAT
───────────────────────────────────────────── */
function WAFloat() {
  return (
    <motion.a href="https://wa.me/919682394363" target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.5, type: 'spring', stiffness: 260 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, width: 52, height: 52, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.38)', textDecoration: 'none' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M20.52 3.48A11.95 11.95 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.57A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.24-1.43l-.38-.22-3.91 1 1.02-3.81-.24-.39A9.96 9.96 0 012 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.95 9.95 0 0122 12c0 5.52-4.48 10-10 10zm5.47-7.33c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.64.07a8.12 8.12 0 01-2.4-1.48 9.03 9.03 0 01-1.66-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52s-.67-1.62-.92-2.22c-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37S6 9.04 6 10.17c0 1.13.82 2.22.93 2.37.12.15 1.62 2.47 3.93 3.46.55.24.98.38 1.31.48.55.17 1.05.15 1.45.09.44-.07 1.37-.56 1.56-1.1.2-.54.2-1 .14-1.1-.06-.1-.24-.16-.5-.3z"/>
      </svg>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────
   HOME LIGHT
───────────────────────────────────────────── */
export function HomeLight() {
  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif", background: BG, minHeight: '100vh' }}>
      <AnnoBar />
      <Nav />
      <Hero />
      <Services />
      <StatsRow />
      <HowItWorks />
      <WaitlistSection />
      <Testimonials />
      <TrustSection />
      <CtaBanner />
      <Footer />
      <WAFloat />
    </div>
  );
}
