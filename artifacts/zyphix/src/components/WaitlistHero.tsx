import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Mail, User, Phone, ArrowRight, Check, Zap, Gift,
  Crown, ShoppingBag, UtensilsCrossed, Store, Bike, ShieldCheck, Star, Clock,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const INK = '#0B0F14';
const G = '#0DA366';
const G2 = '#00E28A';
const MINT = '#6EE7B7';

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";
const HERO_IMG = 'https://images.unsplash.com/photo-1755406180852-e761fa197e27?w=1100&q=80&auto=format&fit=crop';

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
    width: '100%', height: 52, paddingLeft: 46, paddingRight: 14, borderRadius: 14, fontSize: 14.5,
    color: '#fff', fontWeight: 500, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    background: focus === name ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.05)',
    border: `1.5px solid ${err ? '#F87171' : focus === name ? `${G2}` : 'rgba(255,255,255,.14)'}`,
    boxShadow: focus === name ? `0 0 0 4px ${G}2e` : 'none', transition: 'all .15s',
  });

  const IconWrap = ({ children, active }: { children: React.ReactNode; active: boolean }) => (
    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: active ? MINT : 'rgba(255,255,255,.4)', pointerEvents: 'none', transition: 'color .15s' }}>{children}</span>
  );

  return (
    <section id="waitlist" style={{ position: 'relative', overflow: 'hidden', background: INK, padding: 'clamp(56px,8vw,110px) 24px' }}>
      <style>{`
        @keyframes wl-pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes wl-shim { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes wl-spin { to { transform: rotate(360deg); } }
        .wl-inp::placeholder { color:rgba(255,255,255,.4); font-weight:500; }
        .wl-inp option { color:#0A1611; }
        @media (max-width: 940px){ .wl-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Background layers ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* faint warm photo */}
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: '55%', height: '120%', backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: .16, filter: 'blur(2px)', maskImage: 'radial-gradient(circle at 70% 40%, black, transparent 72%)', WebkitMaskImage: 'radial-gradient(circle at 70% 40%, black, transparent 72%)' }} />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [.35, .55, .35] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-25%', left: '-12%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.05) 0%, transparent 62%)', filter: 'blur(20px)' }} />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [.3, .5, .3] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 64%)', filter: 'blur(20px)' }} />
        {/* grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at 40% 35%, black, transparent 78%)', WebkitMaskImage: 'radial-gradient(circle at 40% 35%, black, transparent 78%)' }} />
        {/* grain */}
        <div style={{ position: 'absolute', inset: 0, opacity: .5, mixBlendMode: 'overlay', backgroundImage: GRAIN }} />
      </div>

      <div className="wl-grid" style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'clamp(36px,4vw,64px)', alignItems: 'center' }}>

        {/* ── Left ── */}
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `${G}1f`, border: `1px solid ${G}45`, borderRadius: 99, padding: '7px 16px', marginBottom: 26, backdropFilter: 'blur(8px)' }}>
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: G2, animation: 'wl-pulse 1.6s ease-in-out infinite' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: G2, boxShadow: `0 0 10px ${G2}` }} />
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: MINT, letterSpacing: '.12em', textTransform: 'uppercase' }}>Early access · Now across India</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06, duration: .65 }}
            style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-.055em', fontSize: 'clamp(2.7rem,5.8vw,4.7rem)', margin: '0 0 22px' }}>
            Your neighbourhood,<br />
            <span style={{ background: `linear-gradient(105deg,${G2} 0%,${MINT} 55%,#a7f3d0 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>delivered in 30 minutes.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .55 }}
            style={{ color: 'rgba(255,255,255,.6)', fontSize: 'clamp(15px,1.5vw,17.5px)', lineHeight: 1.7, maxWidth: 510, margin: '0 0 32px' }}>
            Groceries, food and pharmacy from real kirana stores and local kitchens — one app, zero surge pricing. Reserve your spot for launch-day perks.
          </motion.p>

          {/* perks */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .55 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, maxWidth: 510, marginBottom: 30 }}>
            {PERKS.map(({ Icon, title, sub }, i) => (
              <motion.div key={title} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .22 + i * .06 }}
                whileHover={{ y: -4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 15, padding: '13px 15px', backdropFilter: 'blur(8px)', cursor: 'default', transition: 'transform .2s' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${G}22`, border: `1px solid ${G}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color={MINT} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: '#fff', letterSpacing: '-.01em' }}>{title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.45)' }}>{sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* live counter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 13, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 99, padding: '8px 20px 8px 10px', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex' }}>
              {['R', 'A', 'S', 'P', 'K'].map((c, i) => (
                <div key={c} style={{ width: 31, height: 31, borderRadius: '50%', background: `linear-gradient(135deg,${G},${G2})`, border: `2.5px solid ${INK}`, marginLeft: i ? -11 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800 }}>{c}</div>
              ))}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, color: '#fff' }}><b style={{ fontWeight: 800, color: MINT }}>{disp.toLocaleString()}+</b> on the waitlist</p>
              <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(255,255,255,.45)' }}>Delhi · Mumbai · Bengaluru & more</p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: glass form ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .65, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderRadius: 28, border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 40px 100px rgba(0,0,0,.5)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -90, right: -70, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ height: 6, background: `linear-gradient(90deg,${G},${G2},${MINT},${G})`, backgroundSize: '200% auto', animation: 'wl-shim 3s linear infinite' }} />
          <div style={{ position: 'relative', padding: 'clamp(26px,3vw,36px)' }}>
            {!submitted ? (
              <>
                {/* floating status chip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 5, height: 26, borderRadius: 3, background: `linear-gradient(${G2},${G})` }} />
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem,2.4vw,1.85rem)', color: '#fff', letterSpacing: '-.03em', margin: 0 }}>Reserve your spot</h3>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 700, color: MINT, background: `${G}1f`, border: `1px solid ${G}44`, padding: '5px 10px', borderRadius: 99 }}>
                    <Clock size={11} /> 30s
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', margin: '4px 0 24px', paddingLeft: 16 }}>Free forever · No spam · Launch-day perks</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ position: 'relative' }}>
                    <IconWrap active={focus === 'name'}><User size={16} /></IconWrap>
                    <input className="wl-inp" data-testid="wl-name" value={form.name} onChange={e => set('name', e.target.value)} onFocus={() => setFocus('name')} onBlur={() => setFocus('')} placeholder="Full name" style={inputStyle('name', errors.name)} />
                    {errors.name && <p style={{ color: '#F87171', fontSize: 11.5, margin: '5px 0 0' }}>{errors.name}</p>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <IconWrap active={focus === 'email'}><Mail size={16} /></IconWrap>
                    <input className="wl-inp" data-testid="wl-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} onFocus={() => setFocus('email')} onBlur={() => setFocus('')} placeholder="Email address" style={inputStyle('email', errors.email)} />
                    {errors.email && <p style={{ color: '#F87171', fontSize: 11.5, margin: '5px 0 0' }}>{errors.email}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 150 }}>
                      <IconWrap active={focus === 'phone'}><Phone size={16} /></IconWrap>
                      <input className="wl-inp" data-testid="wl-phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} onFocus={() => setFocus('phone')} onBlur={() => setFocus('')} placeholder="10-digit mobile" style={inputStyle('phone', errors.phone)} />
                      {errors.phone && <p style={{ color: '#F87171', fontSize: 11.5, margin: '5px 0 0' }}>{errors.phone}</p>}
                    </div>
                    <div style={{ position: 'relative', flex: 1, minWidth: 150 }}>
                      <IconWrap active={focus === 'city'}><MapPin size={16} /></IconWrap>
                      <select className="wl-inp" data-testid="wl-city" value={form.city} onChange={e => set('city', e.target.value)} onFocus={() => setFocus('city')} onBlur={() => setFocus('')} style={{ ...inputStyle('city', errors.city), appearance: 'none', color: form.city ? '#fff' : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>
                        <option value="">Select city</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p style={{ color: '#F87171', fontSize: 11.5, margin: '5px 0 0' }}>{errors.city}</p>}
                    </div>
                  </div>

                  {/* role */}
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.45)', letterSpacing: '.1em', textTransform: 'uppercase', margin: '4px 0 9px' }}>I am a</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                      {ROLES.map(({ id, label, Icon }) => {
                        const active = form.role === id;
                        return (
                          <button key={id} type="button" data-testid={`wl-role-${id}`} onClick={() => set('role', id)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px', borderRadius: 13, cursor: 'pointer', background: active ? `${G}22` : 'rgba(255,255,255,.04)', border: `1.5px solid ${active ? G2 : 'rgba(255,255,255,.12)'}`, transition: 'all .15s' }}>
                            <Icon size={17} color={active ? MINT : 'rgba(255,255,255,.5)'} />
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: active ? MINT : 'rgba(255,255,255,.6)' }}>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {PARTNER_ROLES.includes(form.role) && (
                      <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.5)', margin: '9px 0 0' }}>You'll continue to a quick partner setup after this.</p>
                    )}
                  </div>

                  {apiError && <p style={{ color: '#F87171', fontSize: 12.5, margin: 0 }}>{apiError}</p>}

                  <motion.button whileHover={loading ? {} : { scale: 1.015, y: -1 }} whileTap={loading ? {} : { scale: .985 }} type="button" data-testid="wl-submit" onClick={submit} disabled={loading}
                    style={{ marginTop: 4, height: 56, borderRadius: 15, border: 'none', cursor: loading ? 'wait' : 'pointer', background: `linear-gradient(135deg,${G},${G2})`, color: '#fff', fontSize: 15.5, fontWeight: 800, fontFamily: "'Outfit',sans-serif", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: `0 16px 36px ${G}55` }}>
                    {loading ? 'Reserving…' : <>{PARTNER_ROLES.includes(form.role) ? 'Continue' : 'Join the Waitlist'} <ArrowRight size={17} /></>}
                  </motion.button>

                  <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11.5, color: 'rgba(255,255,255,.4)', margin: '2px 0 0' }}>
                    <ShieldCheck size={13} color={MINT} /> Your details are safe. We'll only email you at launch.
                  </p>
                </div>
              </>
            ) : (
              <div data-testid="wl-success" style={{ textAlign: 'center', padding: '18px 4px' }}>
                <motion.div initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${G},${G2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 16px 40px ${G}66` }}>
                  <Check size={34} color="#fff" strokeWidth={3} />
                </motion.div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.7rem', color: '#fff', letterSpacing: '-.03em', margin: '0 0 8px' }}>You're on the list!</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Your spot: <span style={{ color: MINT, fontWeight: 800 }}>#{count.toLocaleString()}</span>. We'll email <b style={{ color: '#fff' }}>{form.email}</b> the moment Zyphix goes live in {form.city || 'your city'} — with your launch-day perks.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${G}1f`, border: `1px solid ${G}44`, borderRadius: 12, padding: '10px 16px', fontSize: 12.5, color: MINT, fontWeight: 700 }}>
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
