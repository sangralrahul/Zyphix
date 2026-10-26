import { apiFetch } from '@/lib/api';
import { verifyOtp as verifyOtpRemote } from '@/lib/account';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { X, Mail, User, Phone, Check, AlertCircle, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ZyphixLogo } from './ZyphixLogo';
import { FONT, G } from '@/ui/kit';

const BD = '#E6E8EC';

/* ── shared field styles ── */
const labelCls = 'mb-1.5 block text-[13px] font-medium text-gray-700';
const inputCls = (err?: boolean) =>
  `h-10 w-full rounded-xl border bg-white text-[14px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-[3px] focus:ring-gray-900/5 ${err ? 'border-red-300' : 'border-[#E6E8EC]'}`;

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 flex items-center gap-1 text-[12px] text-red-600"><AlertCircle size={12} />{children}</p>;
}

function Alert({ children, tone = 'red' }: { children: React.ReactNode; tone?: 'red' | 'gray' }) {
  const t = tone === 'red' ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#E6E8EC] bg-[#FAFAFA] text-gray-600';
  return <div className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[13px] leading-[1.5] ${t}`}>{tone === 'red' && <AlertCircle size={14} className="mt-0.5 shrink-0" />}<span>{children}</span></div>;
}

function PrimaryButton({ children, loading, disabled, type = 'submit', onClick }: { children: React.ReactNode; loading?: boolean; disabled?: boolean; type?: 'submit' | 'button'; onClick?: () => void }) {
  const off = disabled || loading;
  return (
    <button type={type} onClick={onClick} disabled={off}
      className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition ${off ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90'}`}
      style={{ background: disabled && !loading ? '#9CA3AF' : G }}>
      {loading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E6E8EC] bg-white text-[14px] font-semibold text-gray-900 transition hover:bg-gray-50">
      {children}
    </button>
  );
}

function Field({ label, type, value, onChange, icon, error, placeholder }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; error?: string; placeholder: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <div className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${error ? 'text-red-500' : 'text-gray-400'}`}>{icon}</div>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`${inputCls(!!error)} pl-9 pr-3`} style={{ fontFamily: FONT }} />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
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
      <label className={labelCls}>6-digit code</label>
      <div className="flex gap-2">
        {value.map((v, i) => (
          <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={v}
            onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
            className={`h-11 w-full rounded-xl border text-center text-[18px] font-semibold text-gray-900 outline-none transition focus:border-gray-400 focus:ring-[3px] focus:ring-gray-900/5 ${error ? 'border-red-300' : v ? 'border-gray-400' : 'border-[#E6E8EC]'}`}
            style={{ fontFamily: FONT }}
          />
        ))}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
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
  return <span className="font-medium text-gray-400">{m}:{s}</span>;
}

const GoogleMark = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
);

type AuthMethod = 'phone' | 'google' | 'email';
type PhoneStep = 'enter' | 'otp';
type EmailStep = 'enter' | 'otp';

export function AuthModal() {
  const { showModal, closeModal, login } = useAuth();
  const [method, setMethod]         = useState<AuthMethod>('email');
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

  /* ── Phone OTP — coming soon. The form stays visible but is disabled; SMS delivery is not wired yet. ── */
  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({ phone: 'Phone sign-in is coming soon — please use Email for now.' });
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ otp: 'Phone sign-in is coming soon — please use Email for now.' });
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']); setCanResend(false); setCountdownKey(k => k + 1);
  };

  /* ── Google — not wired yet; nudge to email ── */
  const handleGoogle = async () => {
    setGoogleLoading(false);
    switchMethod('email');
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
      // The Worker checks the OTP with the email-otp function and sets the shared `zsid` session cookie.
      const user = await verifyOtpRemote({ email: form.email.trim(), otp: code, token: emailOtpToken, name: form.name.trim() || undefined });
      setLoading(false); setSuccess(true);
      await new Promise(r => setTimeout(r, 900));
      const displayName = user.name || form.name || form.email.split('@')[0];
      login({ id: user.id, name: displayName.charAt(0).toUpperCase() + displayName.slice(1), email: user.email, phone: user.phone || undefined });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg && !/failed to fetch|network/i.test(msg)) setErrors({ emailOtp: msg });
      else setApiError('Network error. Please check your connection.');
      setLoading(false);
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
    phone:  phoneStep === 'enter' ? 'Sign in with phone' : 'Verify OTP',
    google: 'Continue with Google',
    email:  emailStep === 'enter' ? 'Sign in' : 'Check your email',
  };
  const subheadings: Record<string, string> = {
    phone:  phoneStep === 'enter' ? 'Coming soon. Use email for now.' : `OTP sent to +91 ${maskedPhone}`,
    google: 'Coming soon. Use email for now.',
    email:  emailStep === 'enter'
      ? 'We will email you a one-time code. No password needed.'
      : `Code sent to ${maskedEmail}`,
  };

  const legal = (
    <p className="text-center text-[12px] leading-[1.6] text-gray-400">
      By continuing you agree to our{' '}
      <a href="/terms" onClick={closeModal} className="font-medium text-gray-600 hover:text-gray-900">Terms</a>{' '}and{' '}
      <a href="/privacy" onClick={closeModal} className="font-medium text-gray-600 hover:text-gray-900">Privacy Policy</a>.
    </p>
  );

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
          style={{ fontFamily: FONT }}
          onClick={e => e.target === e.currentTarget && closeModal()}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .18, ease: 'easeOut' }}
            className="relative w-full max-w-[420px] overflow-hidden rounded-xl border bg-white shadow-[0_16px_48px_rgba(11,15,25,.14)]" style={{ borderColor: BD }}>

            <button type="button" onClick={closeModal} aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
              <X size={16} />
            </button>

            <div className="max-h-[88vh] overflow-y-auto px-6 pb-6 pt-6">

              <div className="mb-5">
                <ZyphixLogo size={28} ixColor="#000000" />
              </div>

              {/* Title */}
              <div className="mb-4">
                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-gray-900">{headings[method]}</h2>
                <p className="mt-0.5 text-[13px] text-gray-600">{subheadings[method]}</p>
              </div>

              {/* ── Method selector ── */}
              {!success && (
                <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1">
                  {([
                    { id: 'email' as AuthMethod, label: 'Email', icon: <Mail size={14} /> },
                    { id: 'phone' as AuthMethod, label: 'Phone', icon: <Phone size={14} /> },
                    { id: 'google' as AuthMethod, label: 'Google', icon: <GoogleMark /> },
                  ]).map(({ id, label, icon }) => (
                    <button key={id} type="button" onClick={() => switchMethod(id)}
                      className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition ${method === id ? 'bg-white text-gray-900 shadow-[0_1px_2px_rgba(11,15,25,.06)]' : 'text-gray-600 hover:text-gray-900'}`}>
                      {icon}{label}
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* ── Success ── */}
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <Check size={22} />
                    </div>
                    <p className="text-[15px] font-semibold text-gray-900">Signed in</p>
                    <p className="mt-0.5 text-[13px] text-gray-600">Taking you back</p>
                  </motion.div>

                ) : method === 'phone' ? (
                  /* ── Phone OTP ── */
                  <motion.div key={`phone-${phoneStep}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .12 }}>
                    {phoneStep === 'enter' ? (
                      <form onSubmit={sendOtp} className="flex flex-col gap-3.5">
                        <div>
                          <label className={labelCls}>Mobile number</label>
                          <div className={`flex h-10 overflow-hidden rounded-xl border bg-white ${errors.phone ? 'border-red-300' : 'border-[#E6E8EC]'}`}>
                            <div className="flex shrink-0 items-center gap-1.5 border-r border-[#E6E8EC] bg-[#FAFAFA] px-3 text-[13px] font-medium text-gray-600">
                              +91
                            </div>
                            <input type="tel" value={phoneNum} onChange={e => setPhoneNum(e.target.value.replace(/[^\d\s\-]/g, ''))}
                              placeholder="98765 43210" maxLength={13} disabled
                              className="flex-1 bg-transparent px-3 text-[14px] text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-60"
                              style={{ fontFamily: FONT }} />
                          </div>
                          {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                        </div>
                        <Alert tone="gray">Phone sign-in is not available yet. Sign in with your email instead.</Alert>
                        <PrimaryButton type="button" disabled>Send OTP</PrimaryButton>
                        <SecondaryButton onClick={() => switchMethod('email')}><Mail size={15} /> Continue with email</SecondaryButton>
                        {legal}
                      </form>
                    ) : (
                      <form onSubmit={verifyOtp} className="flex flex-col gap-4">
                        <OtpInput value={otp} onChange={setOtp} error={errors.otp} />
                        <div className="flex items-center justify-between text-[13px]">
                          <button type="button" onClick={() => { setPhoneStep('enter'); setOtp(['','','','','','']); setErrors({}); }}
                            className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900">
                            <ChevronLeft size={14} /> Change number
                          </button>
                          <span className="text-gray-600">
                            {canResend
                              ? <button type="button" onClick={handleResend} className="font-semibold" style={{ color: G }}>Resend OTP</button>
                              : <span>Resend in <Countdown key={countdownKey} seconds={30} onDone={() => setCanResend(true)} /></span>
                            }
                          </span>
                        </div>
                        <PrimaryButton loading={loading}>{loading ? 'Verifying' : <>Verify and continue <ArrowRight size={15} /></>}</PrimaryButton>
                      </form>
                    )}
                  </motion.div>

                ) : method === 'google' ? (
                  /* ── Google ── */
                  <motion.div key="google" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .12 }} className="flex flex-col gap-3.5">
                    <button type="button" onClick={handleGoogle} disabled={googleLoading}
                      className={`flex h-10 w-full items-center justify-center gap-2.5 rounded-xl border border-[#E6E8EC] bg-white text-[14px] font-semibold text-gray-900 transition hover:bg-gray-50 ${googleLoading ? 'cursor-wait opacity-70' : ''}`}>
                      {googleLoading
                        ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        : <GoogleMark size={18} />}
                      {googleLoading ? 'Signing you in' : 'Continue with Google'}
                    </button>
                    <Alert tone="gray">Google sign-in is not available yet. This button takes you to email sign-in.</Alert>
                    {legal}
                  </motion.div>

                ) : (
                  /* ── Email OTP ── */
                  <motion.div key={`email-${emailStep}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .12 }}>
                    {emailStep === 'enter' ? (
                      <form onSubmit={handleSendEmailOtp} className="flex flex-col gap-3.5">
                        <Field label="Name (optional)" type="text" value={form.name} onChange={set('name')}
                          icon={<User size={15} />} placeholder="Your name" />
                        <Field label="Email" type="email" value={form.email} onChange={set('email')}
                          icon={<Mail size={15} />} error={errors.email} placeholder="you@example.com" />

                        {apiError && <Alert>{apiError}</Alert>}

                        <PrimaryButton loading={loading}>{loading ? 'Sending code' : <>Send code <ArrowRight size={15} /></>}</PrimaryButton>
                        <p className="text-center text-[12px] text-gray-400">The code comes from noreply@zyphix.in</p>
                        {legal}
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyEmailOtp} className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5 rounded-xl border border-[#E6E8EC] bg-[#FAFAFA] px-3 py-2.5">
                          <Mail size={16} className="shrink-0 text-gray-400" />
                          <div className="min-w-0">
                            <p className="m-0 text-[12px] text-gray-600">Code sent to</p>
                            <p className="m-0 truncate text-[13px] font-medium text-gray-900">{form.email}</p>
                          </div>
                        </div>

                        <OtpInput value={emailOtp} onChange={setEmailOtp} error={errors.emailOtp} />

                        {apiError && <Alert>{apiError}</Alert>}

                        <div className="flex items-center justify-between text-[13px]">
                          <button type="button" onClick={() => { setEmailStep('enter'); setEmailOtp(['','','','','','']); setErrors({}); setApiError(''); }}
                            className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900">
                            <ChevronLeft size={14} /> Change email
                          </button>
                          <span className="text-gray-600">
                            {canResend
                              ? <button type="button" onClick={handleEmailResend} className="font-semibold" style={{ color: G }}>Resend code</button>
                              : <span>Resend in <Countdown key={countdownKey} seconds={60} onDone={() => setCanResend(true)} /></span>
                            }
                          </span>
                        </div>

                        <PrimaryButton loading={loading}>{loading ? 'Verifying' : <>Verify and sign in <ArrowRight size={15} /></>}</PrimaryButton>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
