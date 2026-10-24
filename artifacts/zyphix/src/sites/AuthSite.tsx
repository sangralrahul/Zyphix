import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, ChevronLeft, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { Card, Mesh, Button, FONT, G } from '@/ui/kit';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { verifyOtp, updateProfile, logout as apiLogout, safeNext, type AccountUser } from '@/lib/account';

/* ────────────────────────────────────────────────────────────────────────────
   auth.zyphix.in — one sign-in for every Zyphix product. Email → 6-digit OTP;
   the Worker verifies the code and sets the `zsid` cookie for .zyphix.in, then we
   send the visitor back to `?next=` (only https://*.zyphix.in or same-origin).
──────────────────────────────────────────────────────────────────────────── */

type Step = 'checking' | 'signed-in' | 'email' | 'otp' | 'name' | 'done';

const inputCls = 'h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10';
const labelCls = 'mb-1.5 block text-[13px] font-semibold text-gray-700';

function OtpBoxes({ value, onChange, disabled }: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
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
  return (
    <div className="flex justify-between gap-2">
      {value.map((v, i) => (
        <input key={i} ref={el => { refs.current[i] = el; }} value={v} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} disabled={disabled}
          onChange={e => set(i, e.target.value)}
          onKeyDown={e => { if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus(); }}
          className="h-14 w-full rounded-xl border border-gray-200 bg-white text-center text-[22px] font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          style={{ borderColor: v ? G : undefined }} />
      ))}
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 flex items-center gap-1.5 text-[13px] text-red-600"><AlertCircle size={13} />{children}</p>;
}

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

  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAFAFA] text-gray-900" style={{ fontFamily: FONT }}>
      <Mesh intensity={0.9} />

      <header className="flex items-center justify-center px-5 pt-10">
        <a href="https://zyphix.in" aria-label="Zyphix"><ZyphixLogo size={34} /></a>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-8 sm:items-center sm:pt-0">
        <Card hover={false} className="w-full max-w-[440px] p-7 sm:p-9 shadow-[0_20px_60px_rgba(11,15,25,.08)]">

          {step === 'checking' && (
            <div className="flex flex-col items-center gap-4 py-10 text-gray-500">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-emerald-500/20" style={{ borderTopColor: G }} />
              <p className="text-[14px]">Checking your session…</p>
            </div>
          )}

          {step === 'signed-in' && signedInAs && (
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"><ShieldCheck size={22} color={G} /></div>
              <h1 className="text-[24px] font-semibold tracking-[-0.03em]">You're signed in</h1>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                as <span className="font-semibold text-gray-900">{signedInAs.name || signedInAs.email}</span>{signedInAs.name ? <> ({signedInAs.email})</> : null}.
              </p>
              <div className="mt-7 flex flex-col gap-2.5">
                <Button onClick={() => go(next)} size="lg" className="w-full">Continue to {nextHost} <ArrowRight size={16} /></Button>
                <Button onClick={switchAccount} variant="secondary" size="lg" className="w-full">Switch account</Button>
              </div>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={send} noValidate>
              <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Sign in or create your Zyphix account</h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">We'll email you a one-time code. No password to remember.</p>
              <div className="mt-7">
                <label htmlFor="email" className={labelCls}>Email address</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="email" type="email" autoComplete="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputCls} pl-11`} />
                </div>
                {error && <ErrorNote>{error}</ErrorNote>}
              </div>
              <Button type="submit" size="lg" className="mt-5 w-full">{busy ? 'Sending code…' : <>Continue <ArrowRight size={16} /></>}</Button>
              <p className="mt-5 text-center text-[12.5px] leading-relaxed text-gray-500">
                By continuing you agree to our <a href="https://zyphix.in/terms" className="font-medium text-gray-700 underline-offset-2 hover:underline">Terms</a> and <a href="https://zyphix.in/privacy" className="font-medium text-gray-700 underline-offset-2 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verify} noValidate>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"><Mail size={20} color={G} /></div>
              <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Check your inbox</h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. It expires in a few minutes.
              </p>
              <div className="mt-7">
                <OtpBoxes value={otp} onChange={v => { setOtp(v); setError(''); }} disabled={busy} />
                {error && <ErrorNote>{error}</ErrorNote>}
              </div>
              <Button type="submit" size="lg" className="mt-5 w-full">{busy ? 'Verifying…' : <>Verify and sign in <ArrowRight size={16} /></>}</Button>
              <div className="mt-5 flex items-center justify-between text-[13px]">
                <button type="button" onClick={() => { setStep('email'); setError(''); }} className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900"><ChevronLeft size={14} /> Change email</button>
                {resendIn > 0
                  ? <span className="text-gray-400">Resend in {resendIn}s</span>
                  : <button type="button" onClick={() => send()} disabled={busy} className="font-semibold text-emerald-700 hover:text-emerald-800">Resend code</button>}
              </div>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={saveName} noValidate>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"><Check size={22} color={G} /></div>
              <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Welcome to Zyphix</h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">Your account is ready. What should we call you?</p>
              <div className="mt-7">
                <label htmlFor="name" className={labelCls}>Your name</label>
                <input id="name" autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" className={inputCls} />
                {error && <ErrorNote>{error}</ErrorNote>}
              </div>
              <Button type="submit" size="lg" className="mt-5 w-full">{busy ? 'Saving…' : <>Finish <ArrowRight size={16} /></>}</Button>
            </form>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"><Check size={26} color={G} /></div>
              <h1 className="text-[22px] font-semibold tracking-[-0.03em]">You're in</h1>
              <p className="text-[14px] text-gray-500">Taking you to {nextHost}…</p>
            </div>
          )}

          {(step === 'email' || step === 'otp' || step === 'name') && (
            <p className="mt-7 border-t border-gray-100 pt-5 text-center text-[12.5px] text-gray-500">
              One account for <span className="font-semibold text-gray-700">now</span>, <span className="font-semibold text-gray-700">eats</span> and <span className="font-semibold text-gray-700">book</span> — sign in once, use it everywhere.
            </p>
          )}
        </Card>
      </main>

      <footer className="flex items-center justify-center gap-4 px-5 pb-8 text-[12.5px] text-gray-500">
        <span>© {new Date().getFullYear()} Zyphix</span>
        <span className="h-3 w-px bg-gray-300" />
        <a href="https://zyphix.in/privacy" className="hover:text-gray-900">Privacy</a>
        <a href="https://zyphix.in/terms" className="hover:text-gray-900">Terms</a>
      </footer>
    </div>
  );
}
