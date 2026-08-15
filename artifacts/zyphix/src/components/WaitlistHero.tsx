import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, User, Phone, ArrowRight, Check, Zap, Gift,
  Crown, ShoppingBag, UtensilsCrossed, Store, Bike, ShieldCheck, Star,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const G = '#0DA366';
const G2 = '#00C878';
const INK = '#0A1611';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Other'];
const PARTNER_ROLES = ['restaurant', 'merchant', 'delivery'];
const ROLES = [
  { id: 'customer', label: 'Customer', Icon: ShoppingBag },
  { id: 'restaurant', label: 'Restaurant', Icon: UtensilsCrossed },
  { id: 'merchant', label: 'Merchant', Icon: Store },
  { id: 'delivery', label: 'Delivery', Icon: Bike },
];
const PERKS = [
  { Icon: Zap, title: 'Free delivery', sub: 'First 10 orders' },
  { Icon: Gift, title: '₹125 credit', sub: 'Code ZYPHIX125' },
  { Icon: Crown, title: 'Priority access', sub: 'First in line' },
  { Icon: Star, title: 'First to order', sub: 'In your city' },
];

export function WaitlistHero() {
  const [, setLoc] = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', role: 'customer' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [count, setCount] = useState(500);
  const [disp, setDisp] = useState(500);
  const [focus, setFocus] = useState('');

  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    try {
      const real = 500 + (JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as unknown[]).length;
      setCount(real);
      let cur = 500;
      const s = Math.max(1, Math.ceil((real - 500) / 25));
      t = setInterval(() => { cur = Math.min(cur + s, real); setDisp(cur); if (cur >= real) clearInterval(t); }, 40);
    } catch {}
    return () => { if (t) clearInterval(t); };
  }, []);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.city) e.city = 'Please select a city';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    // Partners continue to a dedicated setup flow
    if (PARTNER_ROLES.includes(form.role)) {
      const q = new URLSearchParams({ name: form.name, email: form.email, phone: form.phone, city: form.city });
      setLoc(`/${form.role}-setup?${q.toString()}`);
      return;
    }
    setApiError('');
    setLoading(true);
    try {
      try {
        const stored = JSON.parse(localStorage.getItem('zyphix_waitlist') || '[]') as object[];
        stored.push({ ...form, ts: Date.now() });
        localStorage.setItem('zyphix_waitlist', JSON.stringify(stored));
        const nc = 500 + stored.length; setCount(nc); setDisp(nc);
      } catch {}
      try { await apiFetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, source: 'waitlist-hero' }) }); } catch {}
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const inputStyle = (name: string, err?: string): React.CSSProperties => ({
    width: '100%', height: 50, paddingLeft: 42, paddingRight: 14, borderRadius: 12, fontSize: 14.5,
    color: INK, fontWeight: 500, background: '#fff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    border: `1.5px solid ${err ? '#EF4444' : focus === name ? G : '#E3EAE6'}`,
    boxShadow: focus === name ? `0 0 0 4px ${G}18` : 'none', transition: 'border-color .15s, box-shadow .15s',
  });

  const IconWrap = ({ children, active }: { children: React.ReactNode; active: boolean }) => (
    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: active ? G : '#9AA8A1', pointerEvents: 'none' }}>{children}</span>
  );

  return (
    <section id="waitlist" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#FFFFFF 0%,#F4F9F6 100%)', padding: 'clamp(48px,7vw,96px) 24px' }}>
      <style>{`
        @keyframes wh-pulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes wh-shim { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .wh-inp::placeholder { color:#9AA8A1; font-weight:500; }
        @media (max-width: 920px){ .wh-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* backdrop */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-8%', width: '46vw', height: '46vw', borderRadius: '50%', background: `radial-gradient(circle, ${G}1f 0%, transparent 65%)`, filter: 'blur(10px)' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,.08) 0%, transparent 66%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(10,22,17,.05) 1px, transparent 1px)', backgroundSize: '22px 22px', maskImage: 'radial-gradient(circle at 30% 20%, black, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle at 30% 20%, black, transparent 75%)' }} />
      </div>

      <div className="wh-grid" style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'clamp(36px,4vw,60px)', alignItems: 'center' }}>

        {/* ── Left ── */}
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', border: `1px solid ${G}33`, borderRadius: 99, padding: '7px 15px', marginBottom: 24, boxShadow: '0 6px 20px rgba(13,163,102,.1)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: G, animation: 'wh-pulse 1.6s ease-in-out infinite' }} />
            <span style={{ fontSize: 11.5, fontWeight: 800, color: G, letterSpacing: '.1em', textTransform: 'uppercase' }}>Early access · Now across India</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .6 }}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: INK, lineHeight: 0.98, letterSpacing: '-.045em', fontSize: 'clamp(2.5rem,5.4vw,4.4rem)', margin: '0 0 20px' }}>
            Your neighbourhood,<br />
            <span style={{ background: `linear-gradient(90deg,${G},${G2} 55%,${G})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'wh-shim 3s linear infinite' }}>delivered in 30 minutes.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .55 }}
            style={{ color: '#5B6B63', fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.7, maxWidth: 500, margin: '0 0 30px' }}>
            Groceries, food and pharmacy from real kirana stores and local kitchens — one app, zero surge pricing. Reserve your spot for launch-day perks.
          </motion.p>

          {/* perks */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .55 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, marginBottom: 28 }}>
            {PERKS.map(({ Icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #E7EEEA', borderRadius: 14, padding: '13px 15px', boxShadow: '0 4px 14px rgba(10,22,17,.04)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${G}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={G} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: INK, letterSpacing: '-.01em' }}>{title}</p>
                  <p style={{ margin: '1px 0 0', fontSize: 11.5, color: '#8A988F' }}>{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* live counter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid #E7EEEA', borderRadius: 99, padding: '8px 18px 8px 10px', boxShadow: '0 4px 14px rgba(10,22,17,.05)' }}>
            <div style={{ display: 'flex' }}>
              {['R', 'A', 'S', 'P', 'K'].map((c, i) => (
                <div key={c} style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${G},${G2})`, border: '2px solid #fff', marginLeft: i ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800 }}>{c}</div>
              ))}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, color: INK }}><b style={{ fontWeight: 800 }}>{disp.toLocaleString()}+</b> on the waitlist</p>
              <p style={{ margin: 0, fontSize: 11.5, color: '#8A988F' }}>Delhi · Mumbai · Bengaluru & more</p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: form ── */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', background: '#fff', borderRadius: 24, border: '1px solid #E7EEEA', boxShadow: '0 30px 70px rgba(10,22,17,.12)', overflow: 'hidden' }}>
          <div style={{ height: 5, background: `linear-gradient(90deg,${G},${G2})` }} />
          <div style={{ padding: 'clamp(24px,3vw,34px)' }}>
            {!submitted ? (
              <>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem,2.4vw,1.7rem)', color: INK, letterSpacing: '-.03em', margin: 0 }}>Reserve your spot</h3>
                <p style={{ fontSize: 13, color: '#8A988F', margin: '6px 0 22px' }}>Takes 30 seconds · Free forever · No spam</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ position: 'relative' }}>
                    <IconWrap active={focus === 'name'}><User size={16} /></IconWrap>
                    <input className="wh-inp" data-testid="wl-name" value={form.name} onChange={e => set('name', e.target.value)} onFocus={() => setFocus('name')} onBlur={() => setFocus('')} placeholder="Full name" style={inputStyle('name', errors.name)} />
                    {errors.name && <p style={{ color: '#EF4444', fontSize: 11.5, margin: '5px 0 0' }}>{errors.name}</p>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <IconWrap active={focus === 'email'}><Mail size={16} /></IconWrap>
                    <input className="wh-inp" data-testid="wl-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} onFocus={() => setFocus('email')} onBlur={() => setFocus('')} placeholder="Email address" style={inputStyle('email', errors.email)} />
                    {errors.email && <p style={{ color: '#EF4444', fontSize: 11.5, margin: '5px 0 0' }}>{errors.email}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 150 }}>
                      <IconWrap active={focus === 'phone'}><Phone size={16} /></IconWrap>
                      <input className="wh-inp" data-testid="wl-phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} onFocus={() => setFocus('phone')} onBlur={() => setFocus('')} placeholder="10-digit mobile" style={inputStyle('phone', errors.phone)} />
                      {errors.phone && <p style={{ color: '#EF4444', fontSize: 11.5, margin: '5px 0 0' }}>{errors.phone}</p>}
                    </div>
                    <div style={{ position: 'relative', flex: 1, minWidth: 150 }}>
                      <IconWrap active={focus === 'city'}><MapPin size={16} /></IconWrap>
                      <select data-testid="wl-city" value={form.city} onChange={e => set('city', e.target.value)} onFocus={() => setFocus('city')} onBlur={() => setFocus('')} style={{ ...inputStyle('city', errors.city), appearance: 'none', color: form.city ? INK : '#9AA8A1', cursor: 'pointer' }}>
                        <option value="">Select city</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p style={{ color: '#EF4444', fontSize: 11.5, margin: '5px 0 0' }}>{errors.city}</p>}
                    </div>
                  </div>

                  {/* role */}
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#8A988F', letterSpacing: '.1em', textTransform: 'uppercase', margin: '4px 0 9px' }}>I am a</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                      {ROLES.map(({ id, label, Icon }) => {
                        const active = form.role === id;
                        return (
                          <button key={id} type="button" data-testid={`wl-role-${id}`} onClick={() => set('role', id)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '11px 4px', borderRadius: 12, cursor: 'pointer', background: active ? `${G}12` : '#fff', border: `1.5px solid ${active ? G : '#E3EAE6'}`, transition: 'all .15s' }}>
                            <Icon size={17} color={active ? G : '#8A988F'} />
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: active ? G : '#6B7A72' }}>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {PARTNER_ROLES.includes(form.role) && (
                      <p style={{ fontSize: 11.5, color: '#8A988F', margin: '9px 0 0' }}>You'll continue to a quick partner setup after this.</p>
                    )}
                  </div>

                  {apiError && <p style={{ color: '#EF4444', fontSize: 12.5, margin: 0 }}>{apiError}</p>}

                  <motion.button whileHover={loading ? {} : { scale: 1.015 }} whileTap={loading ? {} : { scale: .985 }} type="button" data-testid="wl-submit" onClick={submit} disabled={loading}
                    style={{ marginTop: 4, height: 54, borderRadius: 14, border: 'none', cursor: loading ? 'wait' : 'pointer', background: `linear-gradient(135deg,${G},${G2})`, color: '#fff', fontSize: 15.5, fontWeight: 800, fontFamily: "'Outfit',sans-serif", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: `0 14px 30px ${G}44` }}>
                    {loading ? 'Reserving…' : <>{PARTNER_ROLES.includes(form.role) ? 'Continue' : 'Join the Waitlist'} <ArrowRight size={17} /></>}
                  </motion.button>

                  <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11.5, color: '#9AA8A1', margin: '2px 0 0' }}>
                    <ShieldCheck size={13} color={G} /> Your details are safe. We'll only email you at launch.
                  </p>
                </div>
              </>
            ) : (
              <div data-testid="wl-success" style={{ textAlign: 'center', padding: '18px 4px' }}>
                <motion.div initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  style={{ width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg,${G},${G2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 14px 34px ${G}55` }}>
                  <Check size={32} color="#fff" strokeWidth={3} />
                </motion.div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.6rem', color: INK, letterSpacing: '-.03em', margin: '0 0 8px' }}>You're on the list!</h3>
                <p style={{ fontSize: 14, color: '#5B6B63', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Your spot: <span style={{ color: G, fontWeight: 800 }}>#{count.toLocaleString()}</span>. We'll email <b style={{ color: INK }}>{form.email}</b> the moment Zyphix goes live in {form.city || 'your city'} — with your launch-day perks.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${G}10`, border: `1px solid ${G}30`, borderRadius: 12, padding: '10px 16px', fontSize: 12.5, color: G, fontWeight: 700 }}>
                  <Gift size={15} /> ₹125 launch credit reserved · Code ZYPHIX125
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
