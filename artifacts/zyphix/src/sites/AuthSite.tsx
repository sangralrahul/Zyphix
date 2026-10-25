import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, ChevronLeft, Check, AlertCircle, Lock, LogOut, MapPin, ShoppingBag, UtensilsCrossed, Wrench, Loader2 } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { FONT, G } from '@/ui/kit';
import { BgVideo, isStatic, EASE } from '@/ui/cinema';
import { SplitHeadline, LiveOrder } from '@/ui/motion2';
import { VIDEOS } from '@/data/media';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { verifyOtp, updateProfile, logout as apiLogout, safeNext, type AccountUser } from '@/lib/account';

/* ────────────────────────────────────────────────────────────────────────────
   auth.zyphix.in — one sign-in for every Zyphix product. Email → 6-digit OTP;
   the Worker verifies the code and sets the `zsid` cookie for .zyphix.in, then we
   send the visitor back to `?next=` (only https://*.zyphix.in or same-origin).
   Layout: cinematic video panel (left / top band on mobile) + clean form panel.
──────────────────────────────────────────────────────────────────────────── */

type Step = 'checking' | 'signed-in' | 'email' | 'otp' | 'name' | 'done';

const inputCls = 'h-[52px] w-full rounded-2xl border border-gray-200 bg-white px-4 text-[16px] text-gray-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#0DA366] focus:ring-4 focus:ring-[#0DA366]/15';
const labelCls = 'mb-2 block text-[13.5px] font-medium text-gray-700';

/* ── Visual panel ────────────────────────────────────────────────────────── */
const CLIPS = [VIDEOS.doorHandoff, VIDEOS.cooking, VIDEOS.plumber];
const CHIPS = [
  { icon: ShoppingBag, label: 'Now', sub: 'Groceries in minutes' },
  { icon: UtensilsCrossed, label: 'Eats', sub: 'Local kitchens' },
  { icon: Wrench, label: 'Book', sub: 'Verified home pros' },
];

function AuthVisual() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (isStatic()) return;
    const id = window.setInterval(() => setIdx(i => (i + 1) % CLIPS.length), 6000);
    return () => window.clearInterval(id);
  }, []);
  const stat = isStatic();
  return (
    <aside className="relative isolate h-[38svh] min-h-[300px] overflow-hidden bg-[#05080E] text-white lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-[640px]">
      {/* cross-fading clips */}
      <AnimatePresence initial={false}>
        <motion.div key={idx} className="absolute inset-0"
          initial={stat ? false : { opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: EASE }, scale: { duration: 7, ease: 'linear' } }}>
          <BgVideo clip={CLIPS[idx]} dim={0.2} />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.7) 0%, rgba(5,8,14,.1) 30%, rgba(5,8,14,.35) 60%, rgba(5,8,14,.95) 100%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: 'radial-gradient(900px 600px at 0% 100%, rgba(13,163,102,.28), transparent 60%)' }} />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 pb-12 sm:p-8 sm:pb-14 lg:p-12 xl:p-14">
        <a href="https://zyphix.in" aria-label="Zyphix home" className="inline-flex w-fit"><ZyphixLogo size={30} ixColor="#FFFFFF" /></a>

        <div>
          <SplitHeadline as="h2" delay={0.15}
            parts={['One account for', { accent: 'everything', green: true }, 'nearby.']}
            className="max-w-[14ch] text-balance text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[44px] lg:text-[64px] xl:text-[72px]" />
          <p className="mt-5 hidden max-w-[44ch] text-[17px] leading-[1.6] text-white/70 lg:block">Groceries, food from local kitchens and trusted home pros. Sign in once and it works across every Zyphix app.</p>
          <ul className="mt-5 flex flex-wrap gap-2 lg:mt-9">
            {CHIPS.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-[13px] backdrop-blur-md lg:py-2 lg:pl-2 lg:pr-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full lg:h-7 lg:w-7" style={{ background: G }}><Icon size={13} /></span>
                <span className="font-semibold">{label}</span>
                <span className="hidden text-white/60 xl:inline">· {sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* floating live card (desktop only) */}
      <div className="absolute right-10 top-[16%] z-10 hidden w-[300px] lg:block xl:right-14">
        <motion.div initial={stat ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}>
          <motion.div animate={stat ? undefined : { y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <LiveOrder dark items={['Fresh milk 1 L', 'Sourdough loaf', 'Bananas · 6']} />
          </motion.div>
        </motion.div>
      </div>

      {/* clip progress */}
      <div className="absolute right-12 top-[66px] z-10 hidden gap-1.5 lg:flex xl:right-14">
        {CLIPS.map((c, i) => (
          <span key={c.id} className="h-1 w-8 overflow-hidden rounded-full bg-white/20">
            <span className="block h-full rounded-full transition-all duration-500" style={{ width: i === idx ? '100%' : '0%', background: '#fff' }} />
          </span>
        ))}
      </div>
    </aside>
  );
}

/* ── OTP boxes ───────────────────────────────────────────────────────────── */
function OtpBoxes({ value, onChange, disabled, invalid }: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean; invalid?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);
  const set = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length > 1) { // paste
      const next = digits.slice(0, 6).split('').concat(Array(6).fill('')).slice(0, 6);
      onChange(next); refs.current[Math.min(digits.length, 5)]?.focus(); return;
    }
    const next = [...value]; next[i] = digits; onChange(next);
    if (digits && i < 5) refs.current[i + 1]?.focus();
  };
  const stat = isStatic();
  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-2.5" role="group" aria-label="6-digit code">
      {value.map((v, i) => (
        <motion.div key={i} animate={v && !stat ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 0.25, ease: EASE }}>
          <input ref={el => { refs.current[i] = el; }} value={v} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            onChange={e => set(i, e.target.value)}
            onKeyDown={e => { if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus(); }}
            className={`h-14 w-full rounded-2xl border bg-white text-center text-[24px] font-semibold tabular-nums text-gray-900 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-[#0DA366] focus:ring-4 focus:ring-[#0DA366]/15 disabled:opacity-60 ${invalid ? 'border-red-300' : v ? 'border-[#0DA366] bg-emerald-50/40' : 'border-gray-200 hover:border-gray-300'}`} />
        </motion.div>
      ))}
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="mt-2.5 flex items-center gap-1.5 text-[13.5px] text-red-600"><AlertCircle size={14} />{children}</p>;
}

function PrimaryBtn({ children, busy, onClick, type = 'submit' }: { children: React.ReactNode; busy?: boolean; onClick?: () => void; type?: 'submit' | 'button' }) {
  return (
    <button type={type} onClick={onClick} disabled={busy}
      className="group inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15.5px] font-semibold tracking-[-0.01em] text-white shadow-[0_0_0_1px_rgba(13,163,102,.25),0_12px_32px_-8px_rgba(13,163,102,.55)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_0_1px_rgba(13,163,102,.3),0_18px_40px_-8px_rgba(13,163,102,.65)] disabled:translate-y-0 disabled:opacity-70"
      style={{ background: `linear-gradient(180deg, #19C27C 0%, ${G} 100%)` }}>
      {busy && <Loader2 size={17} className="animate-spin" />}{children}
    </button>
  );
}
const secondaryBtn = 'inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-[15px] font-semibold tracking-[-0.01em] text-gray-900 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60';

function StepIcon({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">{children}</div>;
}
const titleCls = 'text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-gray-900 sm:text-[32px]';
const subCls = 'mt-3 text-[15.5px] leading-[1.6] text-gray-600';

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AuthSite() {
  const { user: ctxUser, login, ready } = useAuth();
  const [step, setStep] = useState<Step>('checking');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [account, setAccount] = useState<AccountUser | null>(null);

  const next = safeNext(typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null);
  const nextHost = (() => { try { return new URL(next).hostname; } catch { return 'zyphix.in'; } })();

  useEffect(() => { document.title = 'Sign in · Zyphix'; }, []);

  // Wait for AuthContext to check the cookie; a server-backed user (has id) is already signed in.
  useEffect(() => {
    if (!ready) return;
    if (step !== 'checking') return;
    setStep(ctxUser?.id ? 'signed-in' : 'email');
  }, [ready, ctxUser?.id, step]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const go = (url: string) => { window.location.replace(url); };

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const em = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError('Enter a valid email address'); return; }
    setError(''); setBusy(true);
    try {
      const res = await apiFetch('/api/send-email-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em }) });
      const data = await res.json() as { success?: boolean; token?: string; error?: string };
      if (!res.ok || !data.success || !data.token) { setError(data.error ?? 'Could not send the code. Please try again.'); setBusy(false); return; }
      setEmail(em); setToken(data.token); setOtp(['', '', '', '', '', '']); setStep('otp'); setResendIn(45);
    } catch { setError('Network error. Please check your connection.'); }
    setBusy(false);
  };

  const verify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code'); return; }
    setError(''); setBusy(true);
    try {
      const u = await verifyOtp({ email, otp: code, token });
      setAccount(u);
      if (!u.name) { setStep('name'); setBusy(false); return; }
      finish(u);
    } catch (err) {
      setError(err instanceof Error && !/failed to fetch/i.test(err.message) ? err.message : 'Network error. Please try again.');
      setBusy(false);
    }
  };

  const saveName = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const n = name.trim();
    if (n.length < 2) { setError('Tell us what to call you'); return; }
    setError(''); setBusy(true);
    try {
      const u = await updateProfile({ name: n });
      finish(u);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save your name.'); setBusy(false); }
  };

  const finish = (u: AccountUser) => {
    login({ id: u.id, name: u.name || u.email.split('@')[0], email: u.email, phone: u.phone || undefined });
    setStep('done');
    setTimeout(() => go(next), 500);
  };

  const switchAccount = async () => {
    setBusy(true);
    await apiLogout();
    try { localStorage.removeItem('zyphix_user'); } catch {}
    setAccount(null); setEmail(''); setStep('email'); setBusy(false);
  };

  const signedInAs = account ?? (ctxUser ? { id: ctxUser.id ?? '', email: ctxUser.email, name: ctxUser.name, phone: ctxUser.phone ?? '' } : null);
  const stat = isStatic();
  const slide = stat ? {} : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.35, ease: EASE } };

  return (
    <div className="min-h-[100svh] bg-white text-gray-900 antialiased lg:grid lg:grid-cols-[55fr_45fr]" style={{ fontFamily: FONT }}>
      <AuthVisual />

      <div className="relative -mt-7 flex min-h-[62svh] flex-col rounded-t-[28px] bg-white lg:mt-0 lg:min-h-[100svh] lg:rounded-none">
        <div className="flex items-center justify-end px-5 pt-5 sm:px-8 lg:px-12 lg:pt-8">
          <a href="https://support.zyphix.in" className="text-[13.5px] font-medium text-gray-500 transition hover:text-gray-900">Need help?</a>
        </div>

        <main className="flex flex-1 items-start justify-center px-5 pb-10 pt-4 sm:px-8 lg:items-center lg:pb-16 lg:pt-0">
          <div className="w-full max-w-[400px]">
            <AnimatePresence mode="wait" initial={false}>
              {step === 'checking' && (
                <motion.div key="checking" {...slide} className="flex flex-col items-center gap-4 py-16 text-gray-500">
                  <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-emerald-500/20" style={{ borderTopColor: G }} />
                  <p className="text-[14px]">Checking your session…</p>
                </motion.div>
              )}

              {step === 'signed-in' && signedInAs && (
                <motion.div key="signed-in" {...slide}>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Signed in</p>
                  <h1 className={`${titleCls} mt-3`}>Welcome back{signedInAs.name ? `, ${signedInAs.name.split(' ')[0]}` : ''}.</h1>
                  <div className="mt-7 flex items-center gap-4 rounded-3xl border border-gray-200 bg-[#F6F7F9] p-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[19px] font-semibold text-white" style={{ background: `linear-gradient(160deg, #19C27C, ${G})` }}>
                      {(signedInAs.name || signedInAs.email).charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      {signedInAs.name && <p className="truncate text-[15.5px] font-semibold tracking-[-0.01em] text-gray-900">{signedInAs.name}</p>}
                      <p className="truncate text-[14px] text-gray-500">{signedInAs.email}</p>
                    </div>
                    <Check size={18} className="ml-auto shrink-0" color={G} />
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <PrimaryBtn type="button" onClick={() => go(next)}>Continue to {nextHost} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></PrimaryBtn>
                    <a href="https://zyphix.in/account" className={secondaryBtn}><MapPin size={16} /> Manage addresses &amp; orders</a>
                  </div>
                  <button type="button" onClick={switchAccount} disabled={busy} className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-gray-500 transition hover:text-gray-900 disabled:opacity-60">
                    <LogOut size={15} /> {busy ? 'Signing out…' : 'Sign out or use another account'}
                  </button>
                </motion.div>
              )}

              {step === 'email' && (
                <motion.form key="email" {...slide} onSubmit={send} noValidate>
                  <h1 className={titleCls}>Sign in or create your account</h1>
                  <p className={subCls}>Enter your email and we'll send a 6-digit code. No password to remember.</p>
                  <div className="mt-8">
                    <label htmlFor="email" className={labelCls}>Email address</label>
                    <div className="relative">
                      <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input id="email" type="email" autoComplete="email" autoFocus value={email} onChange={e => { setEmail(e.target.value); if (error) setError(''); }} placeholder="you@example.com" aria-invalid={!!error} className={`${inputCls} pl-11 ${error ? 'border-red-300' : ''}`} />
                    </div>
                    {error && <ErrorNote>{error}</ErrorNote>}
                  </div>
                  <div className="mt-5"><PrimaryBtn busy={busy}>{busy ? 'Sending code…' : <>Continue <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>}</PrimaryBtn></div>
                  <p className="mt-6 text-[13px] leading-[1.6] text-gray-500">
                    By continuing you agree to the Zyphix <a href="https://zyphix.in/terms" className="font-medium text-gray-800 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-800">Terms</a> and <a href="https://zyphix.in/privacy" className="font-medium text-gray-800 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-800">Privacy Policy</a>.
                  </p>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form key="otp" {...slide} onSubmit={verify} noValidate>
                  <button type="button" onClick={() => { setStep('email'); setError(''); }} className="-ml-1 mb-6 inline-flex items-center gap-1 text-[14px] font-medium text-gray-500 transition hover:text-gray-900"><ChevronLeft size={16} /> Change email</button>
                  <h1 className={titleCls}>Check your inbox</h1>
                  <p className={subCls}>
                    Enter the 6-digit code we sent to <span className="font-semibold text-gray-900">{email}</span>. It expires in a few minutes.
                  </p>
                  <div className="mt-8">
                    <OtpBoxes value={otp} onChange={v => { setOtp(v); setError(''); }} disabled={busy} invalid={!!error} />
                    {error && <ErrorNote>{error}</ErrorNote>}
                  </div>
                  <div className="mt-5"><PrimaryBtn busy={busy}>{busy ? 'Verifying…' : <>Verify and sign in <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>}</PrimaryBtn></div>
                  <div className="mt-5 flex items-center justify-center text-[14px]">
                    {resendIn > 0
                      ? <span className="tabular-nums text-gray-400">Didn't get it? Resend in {resendIn}s</span>
                      : <button type="button" onClick={() => send()} disabled={busy} className="font-semibold text-emerald-700 transition hover:text-emerald-800">Resend code</button>}
                  </div>
                </motion.form>
              )}

              {step === 'name' && (
                <motion.form key="name" {...slide} onSubmit={saveName} noValidate>
                  <StepIcon><Check size={22} color={G} /></StepIcon>
                  <h1 className={titleCls}>Welcome to Zyphix</h1>
                  <p className={subCls}>Your account is ready. What should we call you?</p>
                  <div className="mt-8">
                    <label htmlFor="name" className={labelCls}>Your name</label>
                    <input id="name" autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" className={inputCls} />
                    {error && <ErrorNote>{error}</ErrorNote>}
                  </div>
                  <div className="mt-5"><PrimaryBtn busy={busy}>{busy ? 'Saving…' : <>Finish <ArrowRight size={16} /></>}</PrimaryBtn></div>
                </motion.form>
              )}

              {step === 'done' && (
                <motion.div key="done" {...slide} className="flex flex-col items-center gap-3 py-12 text-center">
                  <motion.div initial={stat ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `linear-gradient(160deg, #19C27C, ${G})` }}>
                    <Check size={30} color="#fff" strokeWidth={2.5} />
                  </motion.div>
                  <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.035em]">You're in</h1>
                  <p className="text-[15px] text-gray-500">Taking you to {nextHost}…</p>
                </motion.div>
              )}
            </AnimatePresence>

            {(step === 'email' || step === 'otp' || step === 'name') && (
              <div className="mt-10 flex items-center gap-3 border-t border-gray-100 pt-6 text-[13px] text-gray-500">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600"><Lock size={14} /></span>
                <p><span className="font-medium text-gray-800">Encrypted</span> · OTP sign-in, no passwords. One account for Now, Eats and Book.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 pb-8 text-[13px] text-gray-500 lg:justify-between lg:px-12">
          <span>© {new Date().getFullYear()} Zyphix</span>
          <div className="flex items-center gap-5">
            <a href="https://zyphix.in/privacy" className="hover:text-gray-900">Privacy</a>
            <a href="https://zyphix.in/terms" className="hover:text-gray-900">Terms</a>
            <a href="https://support.zyphix.in" className="hover:text-gray-900">Help</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
