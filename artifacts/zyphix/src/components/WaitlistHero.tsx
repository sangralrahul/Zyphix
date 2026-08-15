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

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Other'];
const PARTNER_ROLES = ['restaurant', 'merchant', 'delivery'];
const ROLES = [
  { id: 'customer', label: 'Customer', Icon: ShoppingBag },
  { id: 'restaurant', label: 'Restaurant', Icon: UtensilsCrossed },
  { id: 'merchant', label: 'Merchant', Icon: Store },
  { id: 'delivery', label: 'Delivery', Icon: Bike },
];
const PERKS = [
  { Icon: Zap, title: 'Free delivery', sub: 'First 10 orders', accent: '#0DA366', bg: '#ECFDF5' },
  { Icon: Gift, title: '₹125 credit', sub: 'Code ZYPHIX125', accent: '#D97706', bg: '#FFFBEB' },
  { Icon: Crown, title: 'Priority access', sub: 'First in line', accent: '#7C3AED', bg: '#F5F3FF' },
  { Icon: Star, title: 'First to order', sub: 'In your city', accent: '#EA580C', bg: '#FFF7ED' },
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
    width: '100%', height: 52, paddingLeft: 44, paddingRight: 14, borderRadius: 13, fontSize: 14.5,
    color: INK, fontWeight: 500, background: focus === name ? '#fff' : '#F7FAF8', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    border: `1.5px solid ${err ? '#EF4444' : focus === name ? G : '#E3EAE6'}`,
    boxShadow: focus === name ? `0 0 0 4px ${G}1c` : 'none', transition: 'border-color .15s, box-shadow .15s, background .15s',
  });

  const IconWrap = ({ children, active }: { children: React.ReactNode; active: boolean }) => (
    <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: active ? G : '#9AA8A1', pointerEvents: 'none', transition: 'color .15s' }}>{children}</span>
  );

  return (
    <section id="waitlist" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#FFFFFF 0%,#EEF7F2 100%)', padding: 'clamp(56px,8vw,110px) 24px' }}>
      <style>{`
        @keyframes wh-pulse { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.35)} }
        @keyframes wh-shim { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes wh-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        .wh-inp::placeholder { color:#9AA8A1; font-weight:500; }
        @media (max-width: 920px){ .wh-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* backdrop */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div animate={{ y: [0, -24, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-22%', right: '-6%', width: '46vw', height: '46vw', borderRadius: '50%', background: `radial-gradient(circle, ${G}26 0%, transparent 66%)`, filter: 'blur(14px)' }} />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '-28%', left: '-10%', width: '42vw', height: '42vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,.09) 0%, transparent 66%)', filter: 'blur(14px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(10,22,17,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,17,.04) 1px, transparent 1px)', backgroundSize: '46px 46px', maskImage: 'radial-gradient(circle at 28% 25%, black, transparent 72%)', WebkitMaskImage: 'radial-gradient(circle at 28% 25%, black, transparent 72%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: .5, mixBlendMode: 'multiply', backgroundImage: GRAIN }} />
      </div>

      <div className="wh-grid" style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'clamp(36px,4vw,64px)', alignItems: 'center' }}>

        {/* ── Left ── */}
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', border: `1px solid ${G}33`, borderRadius: 99, padding: '7px 16px', marginBottom: 26, boxShadow: '0 8px 24px rgba(13,163,102,.12)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: G, animation: 'wh-pulse 1.6s ease-in-out infinite', boxShadow: `0 0 8px ${G}` }} />
            <span style={{ fontSize: 11.5, fontWeight: 800, color: G, letterSpacing: '.11em', textTransform: 'uppercase' }}>Early access · Now across India</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .6 }}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: INK, lineHeight: 0.96, letterSpacing: '-.05em', fontSize: 'clamp(2.6rem,5.6vw,4.6rem)', margin: '0 0 22px' }}>
            Your neighbourhood,<br />
            <span style={{ background: `linear-gradient(90deg,${G},${G2} 50%,${G})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'wh-shim 3.2s linear infinite' }}>delivered in 30 minutes.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .55 }}
            style={{ color: '#4E5F57', fontSize: 'clamp(15px,1.5vw,17.5px)', lineHeight: 1.7, maxWidth: 510, margin: '0 0 32px' }}>
            Groceries, food and pharmacy from real kirana stores and local kitchens — one app, zero surge pricing. Reserve your spot for launch-day perks.
          </motion.p>

          {/* perks */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .55 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 510, marginBottom: 30 }}>
            {PERKS.map(({ Icon, title, sub, accent, bg }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + i * .06 }}
                whileHover={{ y: -4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(231,238,234,.9)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 6px 20px rgba(10,22,17,.05)', cursor: 'default', transition: 'box-shadow .2s' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 0 1px ${accent}22` }}>
                  <Icon size={19} color={accent} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: INK, letterSpacing: '-.01em' }}>{title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#8A988F' }}>{sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* live counter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid #E7EEEA', borderRadius: 99, padding: '8px 20px 8px 10px', boxShadow: '0 8px 24px rgba(10,22,17,.06)' }}>
            <div style={{ display: 'flex' }}>
              {['R', 'A', 'S', 'P', 'K'].map((c, i) => (
                <div key={c} style={{ width: 31, height: 31, borderRadius: '50%', background: `linear-gradient(135deg,${G},${G2})`, border: '2.5px solid #fff', marginLeft: i ? -11 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, boxShadow: '0 2px 8px rgba(13,163,102,.3)' }}>{c}</div>
              ))}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, color: INK }}><b style={{ fontWeight: 800 }}>{disp.toLocaleString()}+</b> on the waitlist</p>
              <p style={{ margin: 0, fontSize: 11.5, color: '#8A988F' }}>Delhi · Mumbai · Bengaluru & more</p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: form ── */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', background: '#fff', borderRadius: 26, border: '1px solid #E7EEEA', boxShadow: '0 40px 90px rgba(10,22,17,.14)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${G}14 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ height: 6, background: `linear-gradient(90deg,${G},${G2},${G})`, backgroundSize: '200% auto', animation: 'wh-shim 3s linear infinite' }} />
          <div style={{ position: 'relative', padding: 'clamp(26px,3vw,36px)' }}>
            {!submitted ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 24, borderRadius: 3, background: `linear-gradient(${G},${G2})` }} />
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.45rem,2.4vw,1.8rem)', color: INK, letterSpacing: '-.03em', margin: 0 }}>Reserve your spot</h3>
                </div>
                <p style={{ fontSize: 13, color: '#8A988F', margin: '4px 0 24px', paddingLeft: 16 }}>Takes 30 seconds · Free forever · No spam</p>

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
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px', borderRadius: 13, cursor: 'pointer', background: active ? `${G}12` : '#F7FAF8', border: `1.5px solid ${active ? G : '#E3EAE6'}`, transition: 'all .15s', boxShadow: active ? `0 6px 16px ${G}22` : 'none' }}>
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

                  <motion.button whileHover={loading ? {} : { scale: 1.015, y: -1 }} whileTap={loading ? {} : { scale: .985 }} type="button" data-testid="wl-submit" onClick={submit} disabled={loading}
                    style={{ marginTop: 4, height: 56, borderRadius: 15, border: 'none', cursor: loading ? 'wait' : 'pointer', background: `linear-gradient(135deg,${G},${G2})`, color: '#fff', fontSize: 15.5, fontWeight: 800, fontFamily: "'Outfit',sans-serif", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: `0 16px 34px ${G}4d` }}>
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
                  style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${G},${G2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 16px 38px ${G}5c` }}>
                  <Check size={34} color="#fff" strokeWidth={3} />
                </motion.div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.7rem', color: INK, letterSpacing: '-.03em', margin: '0 0 8px' }}>You're on the list!</h3>
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
