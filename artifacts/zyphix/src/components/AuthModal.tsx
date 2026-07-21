import { apiFetch } from '@/lib/api';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Phone, Check, AlertCircle, Zap, ShoppingCart, CalendarCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ZyphixLogo } from './ZyphixLogo';

const G = '#0DA366';
const G2 = '#0A8C58';
const T1 = '#111827';
const T2 = '#6B7280';
const T3 = '#9CA3AF';
const BD = '#E5E7EB';
const BG = '#F8F9FA';
const W = '#FFFFFF';
const ERR = '#EF4444';

/* ─────────────────────────────────────────────────────────
   Ken Burns slideshow for the left panel
───────────────────────────────────────────────────────── */
const SHOWCASE_IMGS = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&h=960&fit=crop&q=85',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=960&fit=crop&q=85',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&h=960&fit=crop&q=85',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&h=960&fit=crop&q=85',
];

const KB_AUTH_VARIANTS = [
  { x: '0%', y: '0%', tx: '-2%', ty: '-2%' },
  { x: '2%', y: '2%', tx: '0%',  ty: '0%'  },
  { x: '0%', y: '2%', tx: '2%',  ty: '-1%' },
  { x: '-2%',y: '0%', tx: '1%',  ty: '2%'  },
];

function KenBurnsPanel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SHOWCASE_IMGS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <AnimatePresence mode="sync">
        {SHOWCASE_IMGS.map((src, i) => {
          if (i !== idx) return null;
          const v = KB_AUTH_VARIANTS[i % KB_AUTH_VARIANTS.length];
          return (
            <motion.div key={src}
              style={{ position: 'absolute', inset: '-10%', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', willChange: 'transform, opacity' }}
              initial={{ opacity: 0, x: v.x, y: v.y, scale: 1.0 }}
              animate={{ opacity: 1, x: v.tx, y: v.ty, scale: 1.14 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.8, ease: 'easeInOut' }, x: { duration: 7, ease: 'linear' }, y: { duration: 7, ease: 'linear' }, scale: { duration: 7, ease: 'linear' } }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Clean cinematic left panel
───────────────────────────────────────────────────────── */
const PANEL_PERKS = [
  { icon: '⚡', text: 'Grocery in 30 minutes' },
  { icon: '🍽️', text: 'Food from local restaurants' },
  { icon: '🏠', text: 'Verified home services' },
];

function ShowcasePanel() {
  return (
    <div style={{ width: 300, flexShrink: 0, position: 'relative', overflow: 'hidden', borderRadius: '28px 0 0 28px' }}>
      {/* Animated Ken Burns background */}
      <KenBurnsPanel />

      {/* Rich dark overlay — stronger at bottom for text legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(2,20,12,.55) 0%, rgba(2,18,10,.7) 40%, rgba(1,12,7,.94) 100%)' }} />

      {/* Top green accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #0DA366, #10D678, #0DA366)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', padding: '32px 28px 28px' }}>

        {/* Logo */}
        <motion.div style={{ marginBottom: 'auto' }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(145deg,#10D678,#059E5C)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(16,214,120,.5), 0 1px 0 rgba(255,255,255,.25) inset' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 15, color: '#fff', lineHeight: 1, letterSpacing: '-0.06em' }}>//</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.35rem', color: '#fff', letterSpacing: '-0.055em', lineHeight: 1 }}>ZYPH</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.35rem', color: '#10D678', letterSpacing: '-0.055em', lineHeight: 1 }}>IX</span>
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,.4)', letterSpacing: '.14em', textTransform: 'uppercase' as const, marginTop: 1 }}>India's SuperLocal App</p>
            </div>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
          style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.95rem', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.045em', marginBottom: 10 }}>
            Your city,<br /><span style={{ color: '#10D678' }}>supercharged.</span>
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.65 }}>
            Groceries, food & home services — all from local businesses near you.
          </p>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 32 }}>
          {PANEL_PERKS.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.38, delay: 0.35 + i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(16,214,120,.14)', border: '1px solid rgba(16,214,120,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                {p.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.82)', lineHeight: 1.4 }}>{p.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.55 }}
          style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18, display: 'flex', gap: 0 }}>
          {[{ v: '5L+', l: 'Users' }, { v: '30 min', l: 'Delivery' }, { v: '4.8★', l: 'Rating' }].map(({ v, l }, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1rem', color: '#10D678', letterSpacing: '-.03em', lineHeight: 1 }}>{v}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.38)', marginTop: 3 }}>{l}</p>
            </div>
          ))}
        </motion.div>

        {/* Clavix credit */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', marginTop: 14, letterSpacing: '.04em', textAlign: 'center' }}>
          A Clavix Technologies product
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, icon, error, placeholder }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; error?: string; placeholder: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T2, marginBottom: 5, letterSpacing: '.02em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: error ? ERR : T3 }}>{icon}</div>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: '100%', paddingLeft: 42, paddingRight: 14, paddingTop: 11, paddingBottom: 11, borderRadius: 10, border: `1.5px solid ${error ? ERR + '80' : BD}`, background: error ? '#FFF5F5' : W, fontSize: 14, color: T1, fontFamily: 'inherit', outline: 'none', transition: 'all .18s', boxSizing: 'border-box' }}
          onFocus={e => { e.target.style.borderColor = error ? ERR : G; e.target.style.boxShadow = `0 0 0 3px ${error ? ERR : G}18`; }}
          onBlur={e => { e.target.style.borderColor = error ? ERR + '80' : BD; e.target.style.boxShadow = 'none'; }}
        />
      </div>
      {error && <p style={{ fontSize: 11.5, color: ERR, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

function OtpInput({ value, onChange, error }: { value: string[]; onChange: (v: string[]) => void; error?: string }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handleChange = (i: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length) {
      const next = paste.split('').concat(Array(6).fill('')).slice(0, 6);
      onChange(next);
      refs.current[Math.min(paste.length, 5)]?.focus();
      e.preventDefault();
    }
  };
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T2, marginBottom: 8, letterSpacing: '.02em', textTransform: 'uppercase' }}>Enter 6-digit OTP</label>
      <div style={{ display: 'flex', gap: 8 }}>
        {value.map((v, i) => (
          <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={v}
            onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
            style={{ width: 44, height: 50, textAlign: 'center', fontSize: 20, fontWeight: 800, fontFamily: "'Outfit',sans-serif", borderRadius: 10, border: `1.5px solid ${error ? ERR + '80' : v ? G : BD}`, background: v ? `${G}08` : W, color: T1, outline: 'none', transition: 'all .15s' }}
            onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 0 3px ${G}20`; }}
            onBlur={e => { e.target.style.borderColor = error ? ERR + '80' : v ? G : BD; e.target.style.boxShadow = 'none'; }}
          />
        ))}
      </div>
      {error && <p style={{ fontSize: 11.5, color: ERR, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

function Countdown({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onDone]);
  const m = String(Math.floor(left / 60)).padStart(2, '0');
  const s = String(left % 60).padStart(2, '0');
  return <span style={{ color: T3, fontWeight: 600 }}>{m}:{s}</span>;
}

const PERKS = [
  { icon: <Zap size={14} fill="#6EE7B7" color="#6EE7B7" />, text: 'Grocery delivered in 30 minutes' },
  { icon: <ShoppingCart size={14} color="#6EE7B7" />, text: 'Local restaurants near you' },
  { icon: <CalendarCheck size={14} color="#6EE7B7" />, text: 'Verified home service pros' },
];

type AuthMethod = 'phone' | 'google' | 'email';
type PhoneStep = 'enter' | 'otp';
type EmailStep = 'enter' | 'otp';

export function AuthModal() {
  const { showModal, closeModal, login } = useAuth();
  const [method, setMethod]         = useState<AuthMethod>('phone');
  const [phoneStep, setPhoneStep]   = useState<PhoneStep>('enter');
  const [emailStep, setEmailStep]   = useState<EmailStep>('enter');
  const [phoneNum, setPhoneNum]     = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [emailOtp, setEmailOtp]     = useState(['', '', '', '', '', '']);
  const [canResend, setCanResend]   = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [apiError, setApiError]     = useState('');
  const [form, setForm]             = useState({ name: '', email: '' });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [emailOtpToken, setEmailOtpToken] = useState('');

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const resetAll = () => {
    setPhoneStep('enter'); setEmailStep('enter');
    setPhoneNum(''); setOtp(['', '', '', '', '', '']); setEmailOtp(['', '', '', '', '', '']);
    setErrors({}); setApiError(''); setSuccess(false); setCanResend(false);
    setForm({ name: '', email: '' });
    setLoading(false); setGoogleLoading(false);
  };

  const switchMethod = (m: AuthMethod) => { resetAll(); setMethod(m); };

  /* ── Phone OTP (UI only for now) ── */
  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleaned = phoneNum.replace(/\D/g, '');
    if (cleaned.length < 10) { setErrors({ phone: 'Enter a valid 10-digit mobile number' }); return; }
    setErrors({}); setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false); setPhoneStep('otp'); setCanResend(false); setCountdownKey(k => k + 1);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setErrors({ otp: 'Enter the complete 6-digit OTP' }); return; }
    setErrors({}); setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false); setSuccess(true);
    await new Promise(r => setTimeout(r, 900));
    const num = phoneNum.replace(/\D/g, '');
    login({ name: 'Zyphix User', email: '', phone: `+91 ${num.slice(-10)}` });
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']); setCanResend(false); setCountdownKey(k => k + 1);
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setGoogleLoading(false);
    login({ name: 'Google User', email: 'user@gmail.com', avatar: 'G' });
  };

  /* ── Email OTP (real) ── */
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setApiError(''); setLoading(true);
    try {
      const res = await apiFetch('/api/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() || undefined }),
      });
      const data = await res.json() as { success?: boolean; error?: string; token?: string };
      if (!res.ok || !data.success || !data.token) { setApiError(data.error ?? 'Failed to send OTP. Please try again.'); setLoading(false); return; }
      setEmailOtpToken(data.token);
      setLoading(false); setEmailStep('otp'); setCanResend(false); setCountdownKey(k => k + 1);
    } catch {
      setApiError('Network error. Please check your connection.'); setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = emailOtp.join('');
    if (code.length < 6) { setErrors({ emailOtp: 'Enter the complete 6-digit OTP' }); return; }
    setErrors({}); setApiError(''); setLoading(true);
    try {
      const res = await apiFetch('/api/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), otp: code, token: emailOtpToken }),
      });
      const data = await res.json() as { success?: boolean; name?: string | null; error?: string };
      if (!res.ok || !data.success) { setErrors({ emailOtp: data.error ?? 'Incorrect OTP. Please try again.' }); setLoading(false); return; }
      setLoading(false); setSuccess(true);
      await new Promise(r => setTimeout(r, 900));
      const displayName = data.name || form.name || form.email.split('@')[0];
      login({ name: displayName.charAt(0).toUpperCase() + displayName.slice(1), email: form.email.trim() });
    } catch {
      setApiError('Network error. Please check your connection.'); setLoading(false);
    }
  };

  const handleEmailResend = async () => {
    if (!canResend) return;
    setEmailOtp(['', '', '', '', '', '']); setApiError('');
    setLoading(true);
    try {
      const res = await apiFetch('/api/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() || undefined }),
      });
      const data = await res.json() as { success?: boolean; error?: string; token?: string };
      if (!res.ok || !data.success || !data.token) { setApiError(data.error ?? 'Failed to resend OTP.'); }
      else { setEmailOtpToken(data.token); }
    } catch {
      setApiError('Network error.');
    }
    setLoading(false); setCanResend(false); setCountdownKey(k => k + 1);
  };

  const maskedPhone = phoneNum.replace(/\D/g, '').slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2');
  const maskedEmail = form.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '●') + c);

  const headings: Record<string, string> = {
    phone:  phoneStep === 'enter' ? 'Enter mobile number' : 'Verify OTP',
    google: 'Continue with Google',
    email:  emailStep === 'enter' ? 'Sign in with email' : 'Verify your email',
  };
  const subheadings: Record<string, string> = {
    phone:  phoneStep === 'enter' ? "We'll send a one-time password to your number" : `OTP sent to +91 ${maskedPhone}`,
    google: 'Sign in instantly using your Google account',
    email:  emailStep === 'enter'
      ? 'Get a one-time code sent to your inbox — no password needed.'
      : `OTP sent to ${maskedEmail}`,
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(10,20,30,.72)', backdropFilter: 'blur(8px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>

          <motion.div initial={{ opacity: 0, scale: .93, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .93, y: 28 }} transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            style={{ display: 'flex', width: '100%', maxWidth: 840, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06)', position: 'relative' }}>

            {/* ── LEFT PANEL — animated showcase ── */}
            <ShowcasePanel />

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex: 1, background: W, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 34, height: 34, borderRadius: '50%', background: BG, border: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T2, cursor: 'pointer' }}>
                <X size={15} />
              </button>

              <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', maxHeight: '88vh' }}>

                {/* Title */}
                <div style={{ marginBottom: 22 }}>
                  <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: T1, fontSize: '1.55rem', letterSpacing: '-.04em', marginBottom: 4 }}>
                    {headings[method]}
                  </h2>
                  <p style={{ fontSize: 13.5, color: T2 }}>{subheadings[method]}</p>
                </div>

                {/* ── Method selector ── */}
                {!success && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                    {([
                      { id: 'phone' as AuthMethod, label: 'Phone', icon: <Phone size={14} /> },
                      { id: 'google' as AuthMethod, label: 'Google', icon: <svg width="14" height="14" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg> },
                      { id: 'email' as AuthMethod, label: 'Email', icon: <Mail size={14} /> },
                    ]).map(({ id, label, icon }) => (
                      <button key={id} onClick={() => switchMethod(id)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 700, transition: 'all .18s', cursor: 'pointer', border: `1.5px solid ${method === id ? G : BD}`, background: method === id ? `${G}0F` : W, color: method === id ? G : T2 }}>
                        {icon}{label}
                      </button>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {/* ── Success ── */}
                  {success ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '28px 0' }}>
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(13,163,102,.08)', border: '2px solid rgba(13,163,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                        <Check size={32} color={G} />
                      </div>
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: T1, fontSize: 20, marginBottom: 6 }}>You're in! 🎉</p>
                      <p style={{ fontSize: 14, color: T2 }}>Welcome to Zyphix</p>
                    </motion.div>

                  ) : method === 'phone' ? (
                    /* ── Phone OTP ── */
                    <motion.div key={`phone-${phoneStep}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .18 }}>
                      {phoneStep === 'enter' ? (
                        <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T2, marginBottom: 5, letterSpacing: '.02em', textTransform: 'uppercase' }}>Mobile Number</label>
                            <div style={{ display: 'flex', gap: 0, border: `1.5px solid ${errors.phone ? ERR + '80' : BD}`, borderRadius: 10, overflow: 'hidden', background: W, transition: 'all .18s' }}
                              onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = G; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px ${G}18`; }}
                              onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = errors.phone ? ERR + '80' : BD; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 14px', borderRight: `1.5px solid ${BD}`, background: BG, flexShrink: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: T2, letterSpacing: '.04em' }}>IN</span>
                                <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>+91</span>
                              </div>
                              <input type="tel" value={phoneNum} onChange={e => setPhoneNum(e.target.value.replace(/[^\d\s\-]/g, ''))}
                                placeholder="98765 43210" maxLength={13}
                                style={{ flex: 1, padding: '11px 14px', border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: T1, fontFamily: 'inherit', background: 'transparent', letterSpacing: '.04em' }} />
                            </div>
                            {errors.phone && <p style={{ fontSize: 11.5, color: ERR, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{errors.phone}</p>}
                          </div>
                          <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
                            style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? G + 'BB' : `linear-gradient(135deg, ${G}, ${G2})`, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'wait' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : `0 4px 18px ${G}40` }}>
                            {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />Sending OTP…</> : <>Send OTP <ArrowRight size={15} /></>}
                          </motion.button>
                          <p style={{ fontSize: 12, color: T3, textAlign: 'center', lineHeight: 1.6 }}>
                            By continuing you agree to our <a href="/terms" onClick={closeModal} style={{ color: T2, fontWeight: 600 }}>Terms</a> & <a href="/privacy" onClick={closeModal} style={{ color: T2, fontWeight: 600 }}>Privacy Policy</a>
                          </p>
                        </form>
                      ) : (
                        <form onSubmit={verifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                          <OtpInput value={otp} onChange={setOtp} error={errors.otp} />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button type="button" onClick={() => { setPhoneStep('enter'); setOtp(['','','','','','']); setErrors({}); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: T2, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                              <ChevronLeft size={14} /> Change number
                            </button>
                            <span style={{ fontSize: 13, color: T2 }}>
                              {canResend
                                ? <button type="button" onClick={handleResend} style={{ color: G, fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}>Resend OTP</button>
                                : <span>Resend in <Countdown key={countdownKey} seconds={30} onDone={() => setCanResend(true)} /></span>
                              }
                            </span>
                          </div>
                          <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
                            style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? G + 'BB' : `linear-gradient(135deg, ${G}, ${G2})`, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'wait' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : `0 4px 18px ${G}40` }}>
                            {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />Verifying…</> : <>Verify & Continue <ArrowRight size={15} /></>}
                          </motion.button>
                        </form>
                      )}
                    </motion.div>

                  ) : method === 'google' ? (
                    /* ── Google ── */
                    <motion.div key="google" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .18 }}>
                      <button onClick={handleGoogle} disabled={googleLoading}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '15px', borderRadius: 14, border: `1.5px solid ${BD}`, background: W, fontSize: 15, fontWeight: 700, color: T1, transition: 'all .18s', cursor: googleLoading ? 'wait' : 'pointer', opacity: googleLoading ? .7 : 1, boxShadow: '0 2px 8px rgba(0,0,0,.07)' }}
                        onMouseEnter={e => { if (!googleLoading) { (e.currentTarget as HTMLElement).style.background = BG; (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB'; } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = W; (e.currentTarget as HTMLElement).style.borderColor = BD; }}>
                        {googleLoading
                          ? <span style={{ width: 20, height: 20, border: '2.5px solid #CBD5E1', borderTopColor: G, borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
                          : <svg width="20" height="20" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>}
                        {googleLoading ? 'Signing you in…' : 'Continue with Google'}
                      </button>
                      <p style={{ fontSize: 12, color: T3, textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
                        We'll use your Google profile to create or sign in to your Zyphix account.
                      </p>
                    </motion.div>

                  ) : (
                    /* ── Email OTP ── */
                    <motion.div key={`email-${emailStep}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .18 }}>
                      {emailStep === 'enter' ? (
                        <form onSubmit={handleSendEmailOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <Field label="Your Name (optional)" type="text" value={form.name} onChange={set('name')}
                            icon={<User size={15} />} placeholder="Rahul Sharma" />
                          <Field label="Email Address" type="email" value={form.email} onChange={set('email')}
                            icon={<Mail size={15} />} error={errors.email} placeholder="you@example.com" />

                          {/* Info note */}
                          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Mail size={14} color={G} style={{ flexShrink: 0 }} />
                            <p style={{ margin: 0, fontSize: 12.5, color: '#065F46', lineHeight: 1.5 }}>
                              A <strong>6-digit OTP</strong> will be sent to your inbox from <strong>noreply@zyphix.in</strong>
                            </p>
                          </div>

                          {apiError && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <AlertCircle size={14} />{apiError}
                            </div>
                          )}

                          <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
                            style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? G + 'BB' : `linear-gradient(135deg, ${G}, ${G2})`, color: '#fff', fontSize: 15, fontWeight: 800, marginTop: 2, cursor: loading ? 'wait' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : `0 4px 18px ${G}40` }}>
                            {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />Sending OTP…</> : <>Send OTP to my Email <ArrowRight size={15} /></>}
                          </motion.button>
                          <p style={{ fontSize: 11, color: T3, textAlign: 'center', lineHeight: 1.6 }}>
                            By continuing you agree to our{' '}
                            <a href="/terms" onClick={closeModal} style={{ color: T2, fontWeight: 600 }}>Terms</a>{' '}&{' '}
                            <a href="/privacy" onClick={closeModal} style={{ color: T2, fontWeight: 600 }}>Privacy Policy</a>.
                          </p>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyEmailOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                          <div style={{ background: BG, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${G}12`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Mail size={16} color={G} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: 12, color: T3, fontWeight: 600, letterSpacing: '.03em', textTransform: 'uppercase' }}>OTP sent to</p>
                              <p style={{ margin: 0, fontSize: 13.5, color: T1, fontWeight: 700 }}>{form.email}</p>
                            </div>
                          </div>

                          <OtpInput value={emailOtp} onChange={setEmailOtp} error={errors.emailOtp} />

                          {apiError && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <AlertCircle size={14} />{apiError}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button type="button" onClick={() => { setEmailStep('enter'); setEmailOtp(['','','','','','']); setErrors({}); setApiError(''); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: T2, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                              <ChevronLeft size={14} /> Change email
                            </button>
                            <span style={{ fontSize: 13, color: T2 }}>
                              {canResend
                                ? <button type="button" onClick={handleEmailResend} style={{ color: G, fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}>Resend OTP</button>
                                : <span>Resend in <Countdown key={countdownKey} seconds={60} onDone={() => setCanResend(true)} /></span>
                              }
                            </span>
                          </div>

                          <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
                            style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? G + 'BB' : `linear-gradient(135deg, ${G}, ${G2})`, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'wait' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : `0 4px 18px ${G}40` }}>
                            {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />Verifying…</> : <>Verify & Sign In <ArrowRight size={15} /></>}
                          </motion.button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
