import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const G   = '#0DA366';
const T1  = '#111827';
const T2  = '#6B7280';
const T3  = '#9CA3AF';
const BD  = '#E5E7EB';
const W   = '#FFFFFF';
const BG  = '#F8F9FA';
const SH  = '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)';

const scrollToWaitlist = () =>
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });

/* ══════════════════════════════════════════
   1. CATEGORY GRID (replaces BrandsMarquee)
══════════════════════════════════════════ */
const CAT_TILES = [
  { img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop&q=85', name: 'Vegetables',    bg: '#ECFDF5', bd: '#A7F3D0', tc: '#065F46' },
  { img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop&q=85', name: 'Dairy & Eggs',  bg: '#F0F9FF', bd: '#BAE6FD', tc: '#0C4A6E' },
  { img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=85', name: 'Medicine',      bg: '#FDF4FF', bd: '#E9D5FF', tc: '#581C87' },
  { img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&q=85', name: 'Electronics',   bg: '#F1F5F9', bd: '#CBD5E1', tc: '#1E293B' },
  { img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop&q=85', name: 'Snacks',        bg: '#FFFBEB', bd: '#FDE68A', tc: '#78350F' },
  { img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop&q=85', name: 'Household',     bg: '#F5F3FF', bd: '#DDD6FE', tc: '#4C1D95' },
  { img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop&q=85', name: 'Fruits',        bg: '#FFF1F2', bd: '#FECDD3', tc: '#9F1239' },
  { img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop&q=85', name: 'Personal Care', bg: '#F0FDFA', bd: '#99F6E4', tc: '#134E4A' },
  { img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&q=85', name: 'Grains & Dal',  bg: '#FFFBEB', bd: '#FCD34D', tc: '#713F12' },
  { img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&q=85', name: 'Pet Care',      bg: '#FFF7ED', bd: '#FED7AA', tc: '#9A3412' },
];

export function CategoryGrid() {
  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, padding: '52px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.035em', lineHeight: 1.1, marginBottom: 10 }}>
            Everything from your neighbourhood —<br />delivered in 30 minutes
          </h2>
          <p style={{ fontSize: 15, color: T2, maxWidth: 480, margin: '0 auto' }}>
            1,000+ products across 10 categories, sourced from kirana stores near you
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {CAT_TILES.map(({ img, name, bg, bd, tc }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.04 }}
              style={{ border: `1.5px solid ${bd}`, borderRadius: 16, overflow: 'hidden', textAlign: 'center', cursor: 'pointer', background: bg, boxShadow: SH, transition: 'box-shadow .18s' }}>
              <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
                <img src={img} alt={name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: tc, lineHeight: 1.3, padding: '10px 6px 12px' }}>{name}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .cat-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   2. SAVINGS CALCULATOR
══════════════════════════════════════════ */
function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function funEquivalent(yearly: number) {
  if (yearly >= 10000) return "That's enough for a Gulmarg trip!";
  if (yearly >= 5000)  return "That's almost a new phone! 📱";
  return "That's 3 months of chai! ☕";
}

export function SavingsCalculator() {
  const [spend, setSpend] = useState(3000);
  const perOrder = (spend / 20) * 0.30;
  const perMonth = spend * 0.28;
  const perYear  = spend * 12 * 0.28;

  const cards = [
    { label: 'You save per order', value: fmt(perOrder), sub: '30% off every order',    icon: '🛒', accent: G },
    { label: 'You save per month', value: fmt(perMonth), sub: 'No hidden charges',       icon: '📅', accent: G },
    { label: 'You save per year',  value: fmt(perYear),  sub: funEquivalent(perYear),    icon: '🎯', accent: '#059669', big: true },
  ];

  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '72px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', border: `1px solid #A7F3D0`, borderRadius: 999, padding: '5px 14px', fontSize: 11.5, fontWeight: 700, color: '#065F46', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 16 }}>
            💰 Real Savings
          </span>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.25rem)', color: T1, letterSpacing: '-.04em', lineHeight: 1.15, marginBottom: 12 }}>
            See exactly how much you save<br />switching to Zyphix
          </h2>
          <p style={{ fontSize: 15, color: T2, maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Most Indian families spend ₹3,000–₹8,000/month on food &amp; groceries
          </p>
        </div>

        {/* Slider card */}
        <div style={{ background: W, border: `1.5px solid ${BD}`, borderRadius: 20, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: T2 }}>My monthly food + grocery spend</p>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.6rem', color: G, letterSpacing: '-.03em' }}>{fmt(spend)}</span>
          </div>
          <input type="range" min={500} max={10000} step={100} value={spend}
            onChange={e => setSpend(Number(e.target.value))}
            style={{ width: '100%', accentColor: G, height: 6, cursor: 'pointer', borderRadius: 99 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11.5, color: T3, fontWeight: 500 }}>₹500</span>
            <span style={{ fontSize: 11.5, color: T3, fontWeight: 500 }}>₹10,000</span>
          </div>
        </div>

        {/* Result cards */}
        <div className="savings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
          {cards.map(({ label, value, sub, icon, accent, big }) => (
            <motion.div key={label} layout
              style={{ background: W, border: `1.5px solid ${BD}`, borderRadius: 18, padding: '24px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
              <p style={{ fontSize: 20, marginBottom: 8 }}>{icon}</p>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{label}</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: big ? '2.1rem' : '1.75rem', color: accent, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 10 }}>
                {value}
              </p>
              <p style={{ fontSize: 12, color: T2, lineHeight: 1.45 }}>{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={scrollToWaitlist}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', fontSize: 15, fontWeight: 800, padding: '15px 34px', borderRadius: 13, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(13,163,102,.35)', transition: 'filter .15s, transform .15s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.filter='brightness(1.1)'; el.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.filter='brightness(1)'; el.style.transform='translateY(0)'; }}>
            Start saving — Join Waitlist →
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width:640px){ .savings-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   3. RECEIPT COMPARISON
══════════════════════════════════════════ */
const otherLines = [
  { label: 'Food value',      value: '₹300', note: '',             color: T1 },
  { label: 'Delivery fee',    value: '₹60',  note: '',             color: '#EF4444' },
  { label: 'Platform fee',    value: '₹10',  note: '',             color: '#EF4444' },
  { label: 'Surge charge',    value: '₹40',  note: 'peak hours',   color: '#EF4444' },
  { label: 'Packing charge',  value: '₹15',  note: '',             color: '#EF4444' },
];
const zyphixLines = [
  { label: 'Food value',      value: '₹300', note: '',                  color: T1 },
  { label: 'Delivery fee',    value: '₹20',  note: '',                  color: G },
  { label: 'Platform fee',    value: '₹2',   note: 'just gateway cost', color: G },
  { label: 'Surge charge',    value: '₹0',   note: 'NEVER',             color: G },
  { label: 'Packing charge',  value: '₹0',   note: '',                  color: G },
];

export function ReceiptComparison() {
  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.035em', marginBottom: 10 }}>
            The same ₹300 food order.<br />Very different total bill.
          </h2>
        </div>
        <style>{`@media(max-width:767px){.receipt-grid{grid-template-columns:1fr!important;}}`}</style>
        <div className="receipt-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36 }}>

          {/* Other apps */}
          <div style={{ background: W, border: `1.5px solid #FCA5A5`, borderRadius: 20, overflow: 'hidden', boxShadow: SH }}>
            <div style={{ background: '#7F1D1D', padding: '18px 24px' }}>
              <p style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>Other Delivery Apps</p>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {otherLines.map(({ label, value, note, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${BD}` }}>
                  <div>
                    <span style={{ fontSize: 13.5, color: T1, fontWeight: 500 }}>{label}</span>
                    {note && <span style={{ marginLeft: 6, fontSize: 10.5, background: '#FEE2E2', color: '#B91C1C', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{note}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: T1 }}>TOTAL</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#DC2626' }}>₹425</span>
              </div>
              <p style={{ marginTop: 12, fontSize: 11.5, color: '#B91C1C', fontWeight: 600, textAlign: 'center', background: '#FEF2F2', borderRadius: 8, padding: '8px 12px' }}>Hidden charges added</p>
            </div>
          </div>

          {/* Zyphix */}
          <div style={{ background: W, border: `1.5px solid #6EE7B7`, borderRadius: 20, overflow: 'hidden', boxShadow: SH }}>
            <div style={{ background: 'linear-gradient(135deg, #065F46, #047857)', padding: '18px 24px' }}>
              <p style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>Zyphix</p>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {zyphixLines.map(({ label, value, note, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${BD}` }}>
                  <div>
                    <span style={{ fontSize: 13.5, color: T1, fontWeight: 500 }}>{label}</span>
                    {note && <span style={{ marginLeft: 6, fontSize: 10.5, background: note === 'NEVER' ? `${G}20` : '#F0FDF4', color: G, padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{note}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: T1 }}>TOTAL</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.5rem', fontWeight: 900, color: G }}>₹322</span>
              </div>
              <p style={{ marginTop: 12, fontSize: 11.5, color: '#065F46', fontWeight: 600, textAlign: 'center', background: '#ECFDF5', borderRadius: 8, padding: '8px 12px' }}>What you see is what you pay</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.1rem,2.2vw,1.4rem)', color: T1, marginBottom: 20, letterSpacing: '-.02em' }}>
            You save <span style={{ color: G }}>₹103</span> on every order. That's <span style={{ color: G }}>₹2,060</span> every month. <span style={{ color: '#D97706' }}>₹24,720</span> every year.
          </p>
          <button onClick={scrollToWaitlist}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T1, color: '#fff', fontSize: 15, fontWeight: 800, padding: '15px 32px', borderRadius: 13, border: 'none', cursor: 'pointer', transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1F2937'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = T1}>
            Stop overpaying — Join Zyphix →
          </button>
        </div>
      </div>
      <style>{`@media(max-width:640px){.receipt-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   4. HOW IT WORKS (SIMPLE 3-STEP)
══════════════════════════════════════════ */
export function HowItWorksSimple() {
  const steps = [
    { num: '1', icon: '🔍', title: 'Search your kirana', desc: 'Find products from stores within 2 km of your location' },
    { num: '2', icon: '🛒', title: 'Order in 2 taps', desc: 'Add items, choose delivery or pickup, pay however you want' },
    { num: '3', icon: '🛵', title: 'Delivered in 30 minutes', desc: 'A local delivery partner brings it straight to your door' },
  ];
  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Simple & Fast</p>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.035em' }}>
            Order in 3 simple steps
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', position: 'relative' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #059669)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 8px 24px rgba(13,163,102,.3)`, position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: T1, color: '#fff', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{s.num}</div>
                <h3 style={{ fontWeight: 800, color: T1, fontSize: 15, marginBottom: 8, letterSpacing: '-.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: T2, lineHeight: 1.65 }}>{s.desc}</p>
              </motion.div>
              {i < 2 && (
                <div style={{ alignSelf: 'flex-start', marginTop: 34, color: T3, fontSize: 22, paddingTop: 0, flexShrink: 0 }}>
                  <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
                    <path d="M0 6 Q12 6 24 6 Q36 6 42 6" stroke={BD} strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M38 2 L46 6 L38 10" stroke={BD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.hiw-row{flex-direction:column !important;align-items:center !important;} .hiw-arrow{display:none !important;}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   5. WHY KIRANA NOT DARK STORES
══════════════════════════════════════════ */
export function WhyKirana() {
  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.035em', lineHeight: 1.15, marginBottom: 12 }}>
            We don't use dark stores.<br />We use your neighbourhood.
          </h2>
          <p style={{ fontSize: 15, color: T2, maxWidth: 520, margin: '0 auto' }}>
            Other quick commerce apps build expensive warehouses. We digitise the shops already near you.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          {/* Dark store */}
          <div style={{ background: W, border: `1.5px solid #FCA5A5`, borderRadius: 20, padding: '28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏭</div>
              <p style={{ fontWeight: 800, fontSize: 14, color: '#7F1D1D' }}>Other apps — dark stores</p>
            </div>
            {[
              '₹50–200L investment per warehouse',
              'Only works in 8–10 metro cities',
              'Kirana stores lose customers',
              'Cold, impersonal, corporate',
            ].map(pt => (
              <div key={pt} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ color: '#DC2626', fontWeight: 900, marginTop: 1, flexShrink: 0 }}>✗</span>
                <p style={{ fontSize: 13.5, color: T2, lineHeight: 1.5 }}>{pt}</p>
              </div>
            ))}
          </div>
          {/* Kirana */}
          <div style={{ background: '#ECFDF5', border: `1.5px solid #6EE7B7`, borderRadius: 20, padding: '28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${G}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏪</div>
              <p style={{ fontWeight: 800, fontSize: 14, color: '#065F46' }}>Zyphix — your local kirana</p>
            </div>
            {[
              '₹0 capex — shops already exist',
              'Works in any Indian city or town',
              'Kirana owners earn more digitally',
              'Warm, local, trusted neighbours',
            ].map(pt => (
              <div key={pt} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ color: G, fontWeight: 900, marginTop: 1, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 13.5, color: '#065F46', lineHeight: 1.5 }}>{pt}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', background: W, borderRadius: 16, border: `1px solid ${BD}`, boxShadow: SH }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', color: T1 }}>
            <span style={{ color: G }}>14,000,000+</span> kirana stores in India.<br />
            <span style={{ color: T2, fontWeight: 600, fontSize: '0.75em' }}>All waiting to go digital.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   6. LIVE WAITLIST COUNTER
══════════════════════════════════════════ */
export function LiveCounter() {
  const [count, setCount] = useState(500);
  const [display, setDisplay] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as unknown[];
      setCount(500 + stored.length);
    } catch {}
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = Math.max(1, Math.ceil(count / 60));
        const t = setInterval(() => {
          cur = Math.min(cur + step, count);
          setDisplay(cur);
          if (cur >= count) clearInterval(t);
        }, 24);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [count]);

  const cities = [
    { name: 'Delhi NCR',  pct: 38 },
    { name: 'Mumbai',     pct: 28 },
    { name: 'Bengaluru',  pct: 20 },
    { name: 'Other Cities', pct: 14 },
  ];

  return (
    <div ref={sectionRef} style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '72px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>

        {/* Badge */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', border: `1px solid #A7F3D0`, borderRadius: 999, padding: '5px 14px', fontSize: 11.5, fontWeight: 700, color: '#065F46', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 18 }}>
          🔴 Live Counter
        </span>

        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.04em', lineHeight: 1.15, marginBottom: 24 }}>
          Your neighbours are already waiting
        </h2>

        {/* Big number */}
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(3.2rem,9vw,5.5rem)', color: G, letterSpacing: '-.05em', lineHeight: 1 }}>
            {display.toLocaleString('en-IN')}
          </span>
        </div>
        <p style={{ fontSize: 15, color: T2, marginBottom: 40, lineHeight: 1.6 }}>people have joined the Zyphix waitlist</p>

        {/* City breakdown card */}
        <div style={{ background: W, border: `1.5px solid ${BD}`, borderRadius: 20, padding: '28px 32px', marginBottom: 32, textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
          {cities.map(({ name, pct }, i) => {
            const cityCount = Math.round((pct / 100) * count);
            return (
              <div key={name} style={{ marginBottom: i < cities.length - 1 ? 22 : 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{name}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: G }}>{cityCount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ height: 8, background: BD, borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${G}, #10B981)`, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
          <p style={{ fontSize: 12, color: T3, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BD}`, fontWeight: 500 }}>
            Now serving across India · More cities being added every week
          </p>
        </div>

        {/* CTA */}
        <button onClick={scrollToWaitlist}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: G, color: '#fff', fontSize: 15, fontWeight: 800, padding: '15px 34px', borderRadius: 13, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(13,163,102,.35)', transition: 'filter .15s, transform .15s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.filter='brightness(1.1)'; el.style.transform='translateY(-1px)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.filter='brightness(1)'; el.style.transform='translateY(0)'; }}>
          Secure your spot now →
        </button>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   7. KIRANA OWNER QUOTES
══════════════════════════════════════════ */
const QUOTES = [
  {
    quote: 'Main bahut saalon se apni dukaan chalata hoon. Zyphix se pehli baar mujhe lagaa ki main bhi online aa sakta hoon bina kuch kharche ke.',
    name: 'Rajesh Sharma',
    shop: 'Sharma General Store',
    loc: 'Koramangala, Bengaluru',
  },
  {
    quote: 'Mere paas medicines hain, customers hain — bas ek platform chahiye tha jo unhe connect kare. Zyphix wahi kar raha hai.',
    name: 'Dr. Vikram Gupta',
    shop: 'City Medical & Pharmacy',
    loc: 'Banjara Hills, Hyderabad',
  },
  {
    quote: 'Ab customers ghar baithe order karenge aur main deliver karwa sakta hoon. Pehle ye possible nahi tha mere jaisa chhota dukandaar ke liye.',
    name: 'Rajan Khajuria',
    shop: 'Rajan Provision Store',
    loc: 'Lajpat Nagar, Delhi',
  },
];

export function KiranaQuotes() {
  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', border: `1px solid #A7F3D0`, borderRadius: 999, padding: '5px 14px', fontSize: 11.5, fontWeight: 700, color: '#065F46', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 16 }}>
            🏪 Real Merchants
          </span>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.04em', lineHeight: 1.15, marginBottom: 10 }}>
            Kirana stores across India are joining us
          </h2>
          <p style={{ fontSize: 15, color: T2, lineHeight: 1.6 }}>Real shop owners. Real excitement.</p>
        </div>

        {/* Quote cards */}
        <div className="quotes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {QUOTES.map(({ quote, name, shop, loc }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%' }}>
              <div style={{ background: BG, border: `1.5px solid ${BD}`, borderRadius: 20, padding: '28px 26px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
                {/* Quote mark */}
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 22, color: G, fontFamily: 'Georgia, serif', lineHeight: 1, marginTop: -4 }}>"</span>
                </div>
                <p style={{ fontSize: 14, color: T1, lineHeight: 1.8, marginBottom: 24, flex: 1 }}>{quote}</p>
                <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: T1, fontSize: 13.5, marginBottom: 2 }}>{name}</p>
                      <p style={{ fontSize: 12, color: T2, marginBottom: 3 }}>{shop}</p>
                      <p style={{ fontSize: 11.5, color: T3 }}>📍 {loc}</p>
                    </div>
                    <span style={{ background: '#ECFDF5', border: `1px solid #A7F3D0`, color: '#059669', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      Waitlisted ✓
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:767px){.quotes-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   8. APP PRODUCT PREVIEW MOCKUP
══════════════════════════════════════════ */
const GROC_ITEMS = [
  { emoji: '🥦', name: 'Fresh Vegetables 500g', price: '₹89' },
  { emoji: '🥛', name: 'Amul Milk 1L',          price: '₹68' },
  { emoji: '💊', name: 'Dolo 650 Strip',         price: '₹28' },
  { emoji: '🍪', name: 'Parle-G 800g',           price: '₹45' },
];
const RESTAURANT_ITEMS = [
  { emoji: '🍛', name: 'Sharma Dhaba',     rating: '★4.6', time: '28 min', tag: 'Free delivery' },
  { emoji: '🍗', name: 'Chicken Corner',   rating: '★4.5', time: '35 min', tag: 'North Indian' },
  { emoji: '🍮', name: 'Mithai Palace',    rating: '★4.7', time: '20 min', tag: 'Sweets' },
];

export function AppPreviewMockup() {
  return (
    <div style={{ background: BG, borderTop: `1px solid ${BD}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: G, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Coming Soon</p>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.1rem)', color: T1, letterSpacing: '-.035em' }}>
            Here's a peek at what's coming
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* ZyphixNow */}
          <div style={{ background: W, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${BD}`, boxShadow: '0 4px 24px rgba(0,0,0,.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #059669, #0DA366)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 17 }}>⚡</span>
              <p style={{ fontWeight: 800, color: '#fff', fontSize: 14, letterSpacing: '-.01em' }}>ZyphixNow · Groceries</p>
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {GROC_ITEMS.map(({ emoji, name, price }) => (
                <div key={name} style={{ background: BG, border: `1px solid ${BD}`, borderRadius: 14, padding: '12px 10px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 8 }}>{emoji}</div>
                  <p style={{ fontSize: 11.5, color: T2, lineHeight: 1.4, marginBottom: 6 }}>{name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: T1, fontSize: 13 }}>{price}</span>
                    <span style={{ background: G, color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 7 }}>+ Add</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ZyphixEats */}
          <div style={{ background: W, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${BD}`, boxShadow: '0 4px 24px rgba(0,0,0,.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #B45309, #D97706)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 17 }}>🍱</span>
              <p style={{ fontWeight: 800, color: '#fff', fontSize: 14, letterSpacing: '-.01em' }}>ZyphixEats · Food</p>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RESTAURANT_ITEMS.map(({ emoji, name, rating, time, tag }) => (
                <div key={name} style={{ background: BG, border: `1px solid ${BD}`, borderRadius: 14, padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{emoji}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: T1, fontSize: 13.5, marginBottom: 3 }}>{name}</p>
                    <p style={{ fontSize: 11.5, color: T2 }}>
                      <span style={{ color: '#D97706', fontWeight: 700 }}>{rating}</span> · {time} · {tag}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13.5, color: T3, fontWeight: 600 }}>
          Full app launching Q3 2025 across India
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   9. REFER AND EARN
══════════════════════════════════════════ */
export function ReferAndEarn() {
  const [copied, setCopied] = useState(false);
  const refLink = 'zyphix.in/ref/INDIA';

  const copyLink = () => {
    navigator.clipboard.writeText(refLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      "Hey! Zyphix is now live across India — order groceries from your local kirana store in 30 minutes. No surge pricing, no hidden fees. Join the waitlist and get ₹125 launch credit: https://zyphix.in 🎉"
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div style={{ background: W, borderTop: `1px solid ${BD}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2rem)', color: T1, textAlign: 'center', letterSpacing: '-.035em', marginBottom: 28 }}>
          Invite friends. Both of you earn ₹100.
        </h2>
        <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 55%, #047857 100%)', borderRadius: 24, padding: '40px 44px', display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          {/* Left */}
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
              Share Zyphix,<br />earn ₹100 launch credit
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: 24 }}>
              For every friend who joins the waitlist using your link, you both get ₹100 Zyphix Cash credited on launch day.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['1. Share your link', '2. Friend joins', '3. Both get ₹100'].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{s.replace(/^\d+\. /, '')}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.5)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Your referral link</p>
            <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '13px 18px', fontSize: 14, color: '#fff', fontFamily: 'monospace', letterSpacing: '.04em', wordBreak: 'break-all' }}>
              {refLink}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copyLink}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: copied ? '#059669' : 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 13.5, fontWeight: 700, padding: '12px', borderRadius: 11, cursor: 'pointer', transition: 'all .18s' }}>
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <button onClick={shareWhatsApp}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#25D366', border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 700, padding: '12px', borderRadius: 11, cursor: 'pointer', transition: 'filter .15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.12)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'}>
                💬 Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   10. TRUST / MEDIA BAR
══════════════════════════════════════════ */
export function TrustMediaBar() {
  return (
    <div style={{ background: '#F3F4F6', borderTop: `1px solid ${BD}`, padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 11.5, fontWeight: 700, color: T3, letterSpacing: '.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 20 }}>
          Built for Bharat · Backed by local trust
        </p>
        {/* Media mentions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T3, alignSelf: 'center' }}>Coverage coming soon</span>
          {['YourStory', 'Inc42', 'The Ken', 'NDTV India', 'Entrepreneur India'].map(m => (
            <span key={m} style={{ fontSize: 12, fontWeight: 700, color: '#C4C7CD', padding: '5px 14px', background: W, border: `1px solid ${BD}`, borderRadius: 8 }}>{m}</span>
          ))}
        </div>
        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '🔒', text: 'Secure Payments via Razorpay' },
            { icon: '📍', text: 'Verified Kirana Partners' },
            { icon: '🇮🇳', text: 'Made in India' },
            { icon: '⚡', text: '30-Min Delivery Promise' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: W, border: `1px solid ${BD}`, borderRadius: 12, boxShadow: SH }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: T2 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
