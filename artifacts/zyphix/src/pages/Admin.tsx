import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { num } from '@/lib/format';
import {
  ArrowRight, Bell, Moon, Sun, Bike, Check, ChevronRight, Clock, Eye, EyeOff, Inbox, LayoutDashboard, Loader2, LogOut, Mail, MapPin, MessageCircle,
  Package, Phone, RefreshCw, Search, ShieldCheck, ShoppingBag, Store, Undo2, Users, UtensilsCrossed, Wrench, X, XCircle,
} from 'lucide-react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from '@/lib/motion';
import { FONT } from '@/ui/kit';
import { useNoIndex } from '@/lib/seo';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { BgVideo } from '@/ui/cinema';
import { VIDEOS } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   zyphix.in/admin — Zyphix operations console.
   Sign-in: the Worker's ADMIN_TOKEN secret (kept only in this tab's sessionStorage).
   Partner applications arrive as "pending"; approve → live on the public sites,
   reject → never shown. Orders (Now) and requests (Eats / Book) + waitlist.
   Auto-refreshes every 20 s and announces new applications.
──────────────────────────────────────────────────────────────────────────── */

const G = '#0DA366';
const KEY = 'zx-admin-token';
const EASE = [0.22, 1, 0.36, 1] as const;
const POLL_MS = 20_000;
const THEME_KEY = 'zx-admin-theme';

type Status = 'live' | 'pending' | 'hidden' | 'rejected';
type Partner = { id: string; type: string; name: string; business_name: string; email: string; phone: string; city: string; locality: string; category: string; tags: string; details: string; status: Status; created_at: string; updated_at?: string };
type Order = { id: string; createdAt: string; status: string; items: { name?: string; qty?: number; note?: string }[]; total: number; paymentMode: string; address: Record<string, string>; email?: string };
type Waiter = { id: number; product: string; name: string | null; phone: string; city: string | null; created_at: string };
type View = 'overview' | 'partners' | 'orders' | 'waitlist' | 'inbox';
type Msg = { id: number; kind: string; name: string | null; email: string | null; phone: string | null; city: string | null; data: string | null; created_at: string };

const TYPES: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  store: { label: 'Store', icon: Store, color: '#0DA366' },
  restaurant: { label: 'Restaurant', icon: UtensilsCrossed, color: '#E11D48' },
  service: { label: 'Service pro', icon: Wrench, color: '#7C3AED' },
  delivery: { label: 'Delivery', icon: Bike, color: '#EA580C' },
};
const STATUS: Record<Status, { label: string; cls: string }> = {
  pending: { label: 'Waiting for review', cls: 'bg-amber-400/15 text-amber-300 ring-amber-400/30' },
  live: { label: 'Approved', cls: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30' },
  rejected: { label: 'Rejected', cls: 'bg-rose-400/15 text-rose-300 ring-rose-400/30' },
  hidden: { label: 'Hidden', cls: 'bg-white/10 text-white/60 ring-white/15' },
};
const PAY: Record<string, string> = { COD: 'Cash on delivery', CALL_TO_CONFIRM: 'Confirm by call', ONLINE: 'Online' };
const product = (id: string) => id.startsWith('ZET') ? { k: 'Eats', c: '#E11D48' } : id.startsWith('ZBK') ? { k: 'Book', c: '#7C3AED' } : { k: 'Now', c: G };

const toDate = (s: string) => new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
function ago(s: string) {
  const d = (Date.now() - toDate(s).getTime()) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
  if (d < 86400 * 7) return `${Math.floor(d / 86400)} d ago`;
  return toDate(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
const pretty = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
const parse = (s: string): Record<string, unknown> => { try { return JSON.parse(s || '{}'); } catch { return {}; } };

async function api<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const r = await fetch(path, { ...init, headers: { authorization: `Bearer ${token}`, ...(init?.headers || {}) } });
  if (r.status === 401) throw new Error('unauthorized');
  if (!r.ok) throw new Error(`Request failed (${r.status})`);
  return r.json() as Promise<T>;
}

/* ── Cinematic backdrop: vegetable market footage ───────────────────────── */
function MarketVideo({ dim = 0.4, priority = true }: { dim?: number; priority?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: 'radial-gradient(60% 70% at 85% 30%, rgba(13,163,102,.35), transparent 70%), radial-gradient(40% 50% at 60% 80%, rgba(132,204,22,.18), transparent 70%), #06080A' }}>
      <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
        <BgVideo clip={VIDEOS.vegFresh} dim={dim} priority={priority} />
      </motion.div>
    </div>
  );
}

/* soft moving light for pages without video */
function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="zx-glow absolute -left-40 -top-56 h-[520px] w-[520px] rounded-full bg-emerald-500/25 blur-[120px]" />
      <div className="zx-glow absolute -right-40 -top-64 h-[460px] w-[460px] rounded-full bg-lime-400/10 blur-[120px] [animation-delay:-9s]" />
      <style>{`.zx-glow{animation:zxDrift 22s ease-in-out infinite alternate}@keyframes zxDrift{to{transform:translate(8vw,6vh) scale(1.1)}}@media (prefers-reduced-motion:reduce){.zx-glow{animation:none}}`}</style>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => num(Math.round(v)));
  const [txt, setTxt] = useState('0');
  useEffect(() => rounded.on('change', setTxt), [rounded]);
  useEffect(() => { const c = animate(mv, value, { duration: 1.1, ease: EASE }); return () => c.stop(); }, [value, mv]);
  return <span className="tabular-nums">{txt}</span>;
}

/* ── Login ───────────────────────────────────────────────────────────────── */
function Login({ onOk }: { onOk: (t: string) => void }) {
  const [t, setT] = useState(''); const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [shake, setShake] = useState(0);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await api('/admin/whoami', t.trim()); onOk(t.trim()); }
    catch (x) { setErr((x as Error).message === 'unauthorized' ? 'That key is not valid.' : 'Could not reach the server. Try again.'); setShake(s => s + 1); }
    setBusy(false);
  };
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#06080A] text-white" style={{ fontFamily: FONT }}>
      <MarketVideo dim={0.3} />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(6,8,10,.92) 0%, rgba(6,8,10,.55) 45%, rgba(6,8,10,.25) 100%), linear-gradient(0deg, rgba(6,8,10,.9) 0%, transparent 40%)' }} />
      <header className="relative flex items-center justify-between px-6 py-6 sm:px-10">
        <ZyphixLogo size={30} ixColor="#FFFFFF" />
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/80 ring-1 ring-white/15 backdrop-blur-md">Operations</span>
      </header>
      <div className="relative mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-10 px-6 pb-14 sm:px-10 lg:grid-cols-[1fr_440px]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="hidden lg:block">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Zyphix admin</p>
          <h1 className="mt-4 max-w-[13ch] text-[64px] font-semibold leading-[0.98] tracking-[-0.045em]">Every partner, <span className="font-serif-accent text-emerald-300">fresh</span> from the market.</h1>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.65] text-white/70">Approve stores, restaurants, riders and service pros. Call back Eats and Book requests. All in one place, updated live.</p>
        </motion.div>
        <motion.form key={shake} onSubmit={submit}
          initial={shake ? { x: 0 } : { opacity: 0, y: 30 }} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: shake ? 0.4 : 0.8, delay: shake ? 0 : 0.15, ease: EASE }}
          className="w-full rounded-[30px] border border-white/15 bg-[#0B0F12]/60 p-8 shadow-[0_50px_120px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_14px_40px_-10px_rgba(13,163,102,.9)]" style={{ background: 'linear-gradient(160deg,#22D38A,#0DA366)' }}><ShieldCheck size={22} /></span>
          <h2 className="mt-6 text-[28px] font-semibold tracking-[-0.03em]">Sign in</h2>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-white/60">Use your admin key to open the console.</p>
          <label className="mt-7 flex h-[54px] items-center rounded-2xl border border-white/15 bg-black/30 transition focus-within:border-emerald-400 focus-within:shadow-[0_0_0_4px_rgba(52,211,153,.15)]">
            <input type={show ? 'text' : 'password'} value={t} onChange={e => setT(e.target.value)} autoFocus placeholder="Admin key" autoComplete="off" aria-label="Admin key"
              className="h-full min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/35" />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide key' : 'Show key'} className="mr-3 text-white/50 hover:text-white">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </label>
          <AnimatePresence>{err && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2.5 text-[13px] font-medium text-rose-300">{err}</motion.p>}</AnimatePresence>
          <button disabled={!t.trim() || busy} className="group relative mt-6 inline-flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-[15px] font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(180deg,#19C27C,#0DA366)' }}>
            <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
            {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />} Open console
          </button>
          <p className="mt-5 text-center text-[12px] text-white/40">Your key stays in this browser tab only.</p>
        </motion.form>
      </div>
    </div>
  );
}

/* ── Small UI ───────────────────────────────────────────────────────────── */
function Pill({ status }: { status: Status }) {
  return <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${STATUS[status].cls}`}>
    {status === 'pending' && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" /><span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" /></span>}
    {STATUS[status].label}
  </span>;
}
function TypeIcon({ type, size = 40 }: { type: string; size?: number }) {
  const t = TYPES[type] ?? { icon: Package, color: '#9CA3AF' };
  const I = t.icon;
  return <span className="flex shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10" style={{ width: size, height: size, color: t.color, background: `color-mix(in srgb, ${t.color} 16%, transparent)` }}><I size={Math.round(size * 0.45)} strokeWidth={1.9} /></span>;
}
function Empty({ icon: I, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[.06] text-white/60 ring-1 ring-white/10"><I size={22} /></motion.span>
      <p className="mt-4 text-[15px] font-semibold text-white">{title}</p><p className="mt-1 max-w-[34ch] text-[13.5px] text-white/50">{body}</p>
    </div>
  );
}
const PANEL = 'rounded-[26px] border border-white/[.08] bg-white/[.035] backdrop-blur-xl';
type Toast = { id: number; text: string; tone: 'ok' | 'info' | 'err' };

/* ── Console ─────────────────────────────────────────────────────────────── */
export function Admin() {
  useNoIndex();
  useEffect(() => { document.title = 'Admin · Zyphix'; }, []);
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } });
  const [view, setView] = useState<View>('overview');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [waitlist, setWaitlist] = useState<Waiter[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [mailOk, setMailOk] = useState(true);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState<Date | null>(null);
  const [open, setOpen] = useState<Partner | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const seen = useRef<Set<string> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => { try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; } });
  const toggleTheme = () => setTheme(t => { const n = t === 'dark' ? 'light' : 'dark'; try { localStorage.setItem(THEME_KEY, n); } catch { /* ignore */ } return n; });
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);

  const toast = useCallback((text: string, tone: Toast['tone'] = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, text, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  }, []);
  const signOut = useCallback(() => { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } setToken(''); seen.current = null; }, []);

  const load = useCallback(async (quiet = false) => {
    if (!token) return;
    if (!quiet) setLoading(true);
    try {
      const [p, o, w, msgs, mail] = await Promise.all([
        api<Partner[]>('/admin/partners', token), api<Order[]>('/admin/orders', token), api<Waiter[]>('/admin/waitlist', token).catch(() => [] as Waiter[]),
        api<Msg[]>('/admin/messages', token).catch(() => [] as Msg[]), api<{ configured: boolean }>('/admin/mail-status', token).catch(() => ({ configured: true })),
      ]);
      setMessages(msgs.filter(m => m.kind !== 'client-error')); setMailOk(mail.configured);
      if (seen.current) {
        const added = p.filter(x => !seen.current!.has(x.id));
        if (added.length) {
          setFresh(f => new Set([...f, ...added.map(a => a.id)]));
          added.slice(0, 3).forEach(a => toast(`New application: ${a.business_name || a.name} (${TYPES[a.type]?.label ?? a.type})`, 'info'));
          setTimeout(() => setFresh(new Set()), 12_000);
        }
      }
      seen.current = new Set(p.map(x => x.id));
      setPartners(p); setOrders(o); setWaitlist(w); setSynced(new Date());
    } catch (x) {
      if ((x as Error).message === 'unauthorized') signOut(); else if (!quiet) toast((x as Error).message, 'err');
    }
    setLoading(false);
  }, [token, toast, signOut]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => { if (document.visibilityState === 'visible') load(true); }, POLL_MS);
    return () => clearInterval(id);
  }, [token, load]);

  const setStatus = async (p: Partner, status: Status) => {
    const prev = p.status;
    setPartners(ps => ps.map(x => x.id === p.id ? { ...x, status } : x));
    setOpen(o => o && o.id === p.id ? { ...o, status } : o);
    // a decision on a new application closes the drawer so the next one is a click away
    if (prev === 'pending' && (status === 'live' || status === 'rejected')) setTimeout(() => setOpen(o => (o && o.id === p.id ? null : o)), 900);
    try {
      const r = await api<{ updated: number; emailed?: boolean }>(`/admin/partners/${encodeURIComponent(p.id)}/status?status=${status}`, token, { method: 'POST' });
      const name = p.business_name || p.name;
      const mailed = r?.emailed ? ' Applicant emailed.' : '';
      toast(status === 'live' ? `${name} approved. It's now visible on Zyphix.${mailed}` : status === 'rejected' ? `${name} rejected.${mailed}` : status === 'hidden' ? `${name} hidden from the sites.` : `${name} moved back to review.`);
    } catch (x) {
      setPartners(ps => ps.map(x2 => x2.id === p.id ? { ...x2, status: prev } : x2));
      toast(`Couldn't update: ${(x as Error).message}`, 'err');
    }
  };

  const pending = partners.filter(p => p.status === 'pending');
  const today = new Date().toDateString();
  const kpis = [
    { label: 'Waiting for review', value: pending.length, icon: Inbox, color: '#D97706', go: 'partners' as View },
    { label: 'Approved partners', value: partners.filter(p => p.status === 'live').length, icon: Users, color: G, go: 'partners' as View },
    { label: 'Orders today', value: orders.filter(o => toDate(o.createdAt).toDateString() === today).length, icon: ShoppingBag, color: '#2563EB', go: 'orders' as View },
    { label: 'Requests to call', value: orders.filter(o => o.status === 'requested').length, icon: Phone, color: '#7C3AED', go: 'orders' as View },
    { label: 'On the waitlist', value: waitlist.length, icon: Bell, color: '#E11D48', go: 'waitlist' as View },
  ];

  if (!token) return <Login onOk={t => { try { sessionStorage.setItem(KEY, t); } catch { /* ignore */ } setToken(t); }} />;

  const NAV: { k: View; label: string; icon: React.ElementType; badge?: number }[] = [
    { k: 'overview', label: 'Overview', icon: LayoutDashboard },
    { k: 'partners', label: 'Partners', icon: Users, badge: pending.length },
    { k: 'orders', label: 'Orders & requests', icon: ShoppingBag, badge: orders.filter(o => o.status === 'requested').length },
    { k: 'inbox', label: 'Inbox', icon: Mail, badge: messages.filter(m => m.kind !== 'notify' && toDate(m.created_at).toDateString() === new Date().toDateString()).length },
    { k: 'waitlist', label: 'Waitlist', icon: Bell },
  ];
  const hour = new Date().getHours();
  const greeting = `Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}`;

  return (
    <div data-theme={theme} className="zx-admin relative min-h-screen bg-[#06080A] text-white [color-scheme:dark]" style={{ fontFamily: FONT }}>
      <style>{LIGHT_CSS}</style>
      {/* ── Top bar ── */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-300 ${view === 'overview' && !scrolled ? 'zx-dark border-b border-transparent bg-gradient-to-b from-black/60 to-transparent' : 'border-b border-white/[.06] bg-[#06080A]/80 backdrop-blur-xl'}`}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3.5 sm:px-8">
          <button onClick={() => setView('overview')} className="flex shrink-0 items-center gap-2.5" aria-label="Overview">
            <ZyphixLogo size={26} ixColor={theme === 'light' && !(view === 'overview' && !scrolled) ? '#0A0F1A' : '#FFFFFF'} />
            <span className="hidden rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 ring-1 ring-white/15 sm:inline">Admin</span>
          </button>
          <nav className="mx-auto hidden items-center gap-1 rounded-full bg-black/30 p-1 ring-1 ring-white/10 backdrop-blur-xl md:flex">
            {NAV.map(n => <NavBtn key={n.k} n={n} on={view === n.k} onClick={() => setView(n.k)} />)}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <span className="hidden items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-[12px] text-white/70 ring-1 ring-white/10 backdrop-blur-xl lg:inline-flex" title="Refreshes every 20 seconds">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
              Live{synced && <span className="tabular-nums text-white/45">· {synced.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>}
            </span>
            <button onClick={() => load()} aria-label="Refresh" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/80 ring-1 ring-white/10 backdrop-blur-xl hover:text-white"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /></button>
            <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Light theme' : 'Dark theme'} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/80 ring-1 ring-white/10 backdrop-blur-xl hover:text-white">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</motion.span>
              </AnimatePresence>
            </button>
            <button onClick={signOut} aria-label="Sign out" className="flex h-9 items-center gap-2 rounded-full bg-black/30 px-3 text-[13px] text-white/80 ring-1 ring-white/10 backdrop-blur-xl hover:text-white"><LogOut size={15} /><span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden [scrollbar-width:none]">
          {NAV.map(n => <NavBtn key={n.k} n={n} on={view === n.k} onClick={() => setView(n.k)} />)}
        </nav>
      </header>

      {!mailOk && (
        <div className="zx-dark fixed inset-x-0 bottom-0 z-40 border-t border-amber-400/30 bg-amber-500/95 px-4 py-2.5 text-center text-[13px] font-medium text-gray-950">
          Sign-in emails are off: add your Brevo API key to the Worker (<code className="font-mono">npx wrangler secret put BREVO_API_KEY</code>) so customers can sign in.
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.main key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="min-w-0">
          {view === 'overview' ? (
            <Overview greeting={greeting} kpis={kpis} pending={pending} orders={orders} onGo={setView} onOpen={setOpen} onStatus={setStatus} fresh={fresh} />
          ) : (
            <div className="relative">
              <Glow />
              <div className="relative mx-auto max-w-[1400px] px-4 pb-24 pt-36 sm:px-8 md:pt-28">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-emerald-300">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mb-8 mt-2 text-[34px] font-semibold tracking-[-0.04em] sm:text-[44px]">
                  {NAV.find(n => n.k === view)?.label}
                </motion.h1>
                {view === 'partners' && <Partners partners={partners} onOpen={setOpen} onStatus={setStatus} fresh={fresh} loading={loading} />}
                {view === 'orders' && <Orders orders={orders} loading={loading} />}
                {view === 'waitlist' && <Waitlist rows={waitlist} loading={loading} />}
                {view === 'inbox' && <><EmailHealth token={token} /><InboxView rows={messages} loading={loading} /></>}
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      <Drawer partner={open} onClose={() => setOpen(null)} onStatus={setStatus} />

      {/* ── Toasts ── */}
      <div className="zx-dark pointer-events-none fixed bottom-5 left-1/2 z-[80] flex w-[min(380px,calc(100vw-40px))] -translate-x-1/2 flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-[#11161A]/95 px-4 py-3.5 text-[13.5px] leading-[1.45] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] ring-1 ring-white/10 backdrop-blur-xl">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${t.tone === 'err' ? 'bg-rose-500' : t.tone === 'info' ? 'bg-amber-400 text-gray-900' : 'bg-emerald-500'}`}>
                {t.tone === 'err' ? <X size={12} strokeWidth={3} /> : t.tone === 'info' ? <Bell size={11} strokeWidth={2.6} /> : <Check size={12} strokeWidth={3} />}
              </span>
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NavBtn({ n, on, onClick }: { n: { k: View; label: string; icon: React.ElementType; badge?: number }; on: boolean; onClick: () => void }) {
  const I = n.icon;
  return (
    <button onClick={onClick} className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${on ? 'text-gray-950' : 'text-white/70 hover:text-white'}`}>
      {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
      <I size={15} className="relative" /><span className="relative whitespace-nowrap">{n.label}</span>
      {!!n.badge && <span className="relative rounded-full bg-amber-400 px-1.5 text-[11px] font-bold leading-[18px] text-gray-950">{n.badge}</span>}
    </button>
  );
}

/* ── Overview ───────────────────────────────────────────────────────────── */
function Overview({ greeting, kpis, pending, orders, onGo, onOpen, onStatus, fresh }: {
  greeting: string; kpis: { label: string; value: number; icon: React.ElementType; color: string; go: View }[]; pending: Partner[]; orders: Order[];
  onGo: (v: View) => void; onOpen: (p: Partner) => void; onStatus: (p: Partner, s: Status) => void; fresh: Set<string>;
}) {
  const waiting = pending.length;
  return (
    <>
      {/* Hero: live vegetable-market footage */}
      <section className="zx-dark relative isolate overflow-hidden text-white">
        <MarketVideo dim={0.25} />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(0deg, var(--zx-bg, #06080A) 0%, var(--zx-fade, rgba(6,8,10,.6)) 22%, transparent 55%), linear-gradient(90deg, rgba(6,8,10,.85) 0%, rgba(6,8,10,.35) 55%, rgba(6,8,10,.1) 100%)' }} />
        <div className="relative mx-auto flex min-h-[540px] max-w-[1400px] flex-col justify-end px-4 pb-36 pt-36 sm:min-h-[600px] sm:px-8 sm:pb-40">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: EASE }} className="mt-3 text-[46px] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[76px]">
            {greeting}<span className="text-emerald-400">.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="mt-4 max-w-[48ch] text-[16px] leading-[1.6] text-white/75 sm:text-[18px]">
            {waiting ? <><span className="font-semibold text-white">{waiting} partner application{waiting > 1 ? 's are' : ' is'}</span> waiting for your review.</> : 'Everything is reviewed. New partner applications appear here the moment they arrive.'}
          </motion.p>
          {waiting > 0 && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ease: EASE }} onClick={() => onGo('partners')}
              className="group mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[14.5px] font-semibold text-gray-950 shadow-[0_20px_50px_-15px_rgba(0,0,0,.6)]">
              Review applications <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          )}
        </div>
      </section>

      <div className="relative mx-auto -mt-28 max-w-[1400px] px-4 pb-24 sm:px-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 [&>*]:min-w-0 [&>*:last-child]:col-span-2 md:grid-cols-3 md:[&>*:last-child]:col-span-1 xl:grid-cols-5">
          {kpis.map((k, i) => {
            const I = k.icon;
            return (
              <motion.button key={k.label} onClick={() => onGo(k.go)} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + 0.06 * i, duration: 0.6, ease: EASE }}
                whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D1215]/70 p-5 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl">
                <span aria-hidden className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-60" style={{ background: k.color }} />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/10" style={{ color: k.color, background: `color-mix(in srgb, ${k.color} 18%, transparent)` }}><I size={19} /></span>
                <p className="relative mt-6 text-[36px] font-semibold leading-none tracking-[-0.04em]"><CountUp value={k.value} /></p>
                <p className="relative mt-2 flex items-center justify-between text-[13px] text-white/55">{k.label}<ChevronRight size={15} className="opacity-0 transition-opacity group-hover:opacity-100" /></p>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 [&>*]:min-w-0 xl:grid-cols-[1.25fr_1fr]">
          <section className={`${PANEL} p-5 sm:p-6`}>
            <PanelHead title="Needs your review" sub="New partner applications, oldest first." cta="All partners" onCta={() => onGo('partners')} />
            {pending.length === 0 ? <Empty icon={Check} title="You're all caught up" body="New applications will appear here automatically." /> : (
              <ul className="divide-y divide-white/[.06]">
                <AnimatePresence initial={false}>
                  {[...pending].reverse().slice(0, 6).map(p => (
                    <motion.li key={p.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30, height: 0 }} transition={{ duration: 0.35, ease: EASE }}
                      className={`flex items-center gap-3 py-3 ${fresh.has(p.id) ? 'rounded-xl bg-amber-400/10 px-2' : ''}`}>
                      <TypeIcon type={p.type} size={40} />
                      <button onClick={() => onOpen(p)} className="min-w-0 flex-1 text-left">
                        <p className="truncate text-[14.5px] font-semibold">{p.business_name || p.name}</p>
                        <p className="truncate text-[12.5px] text-white/50">{TYPES[p.type]?.label ?? p.type} · {p.city || 'City not given'} · {ago(p.created_at)}</p>
                      </button>
                      <button onClick={() => onStatus(p, 'rejected')} className="hidden h-9 items-center rounded-full px-3.5 text-[13px] font-medium text-white/60 hover:bg-rose-500/15 hover:text-rose-300 sm:inline-flex">Reject</button>
                      <button onClick={() => onStatus(p, 'live')} className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white" style={{ background: G }}><Check size={15} /> Approve</button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>

          <section className={`${PANEL} p-5 sm:p-6`}>
            <PanelHead title="Latest orders" sub="Now orders and Eats / Book requests." cta="All" onCta={() => onGo('orders')} />
            {orders.length === 0 ? <Empty icon={ShoppingBag} title="No orders yet" body="Orders and requests show up here the moment they're placed." /> : (
              <ul className="divide-y divide-white/[.06]">
                {orders.slice(0, 6).map(o => { const pr = product(o.id); return (
                  <li key={o.id} className="flex items-center gap-3 py-3">
                    <ProductTag pr={pr} />
                    <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-medium">{o.address?.name || 'Customer'}</p><p className="truncate text-[12.5px] text-white/50">{o.items.map(i => i.name).join(', ')}</p></div>
                    <div className="text-right"><p className="text-[13.5px] font-semibold tabular-nums">{o.total ? `₹${o.total}` : 'Call'}</p><p className="text-[12px] text-white/40">{ago(o.createdAt)}</p></div>
                  </li>
                ); })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function PanelHead({ title, sub, cta, onCta }: { title: string; sub: string; cta: string; onCta: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div><h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2><p className="text-[13px] text-white/50">{sub}</p></div>
      <button onClick={onCta} className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold text-emerald-300 ring-1 ring-white/10 hover:bg-white/5">{cta} <ChevronRight size={15} /></button>
    </div>
  );
}
function ProductTag({ pr }: { pr: { k: string; c: string } }) {
  return <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-white/10" style={{ color: `color-mix(in srgb, ${pr.c} var(--zx-tag, 55%), white)`, background: `color-mix(in srgb, ${pr.c} 18%, transparent)` }}>{pr.k}</span>;
}

/* ── Partners ───────────────────────────────────────────────────────────── */
function Partners({ partners, onOpen, onStatus, fresh, loading }: { partners: Partner[]; onOpen: (p: Partner) => void; onStatus: (p: Partner, s: Status) => void; fresh: Set<string>; loading: boolean }) {
  const [status, setStatus] = useState<Status | 'all'>('pending');
  const [type, setType] = useState<string>('all');
  const [q, setQ] = useState('');
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: partners.length, pending: 0, live: 0, rejected: 0, hidden: 0 };
    partners.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [partners]);
  const shown = partners.filter(p => (status === 'all' || p.status === status) && (type === 'all' || p.type === type) &&
    (!q.trim() || `${p.business_name} ${p.name} ${p.phone} ${p.email} ${p.city} ${p.locality} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/[.04] p-1">
          {(['pending', 'live', 'rejected', 'hidden', 'all'] as const).map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`relative h-9 rounded-full px-3.5 text-[13.5px] font-medium transition-colors ${status === s ? 'text-gray-950' : 'text-white/60 hover:text-white'}`}>
              {status === s && <motion.span layoutId="status-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{s === 'all' ? 'All' : s === 'live' ? 'Approved' : s === 'pending' ? 'To review' : STATUS[s].label} <span className="opacity-60">{counts[s] || 0}</span></span>
            </button>
          ))}
        </div>
        <select value={type} onChange={e => setType(e.target.value)} className="h-11 rounded-full border border-white/10 bg-white/[.04] px-4 text-[13.5px] text-white outline-none" aria-label="Partner type">
          <option value="all">All types</option>{Object.entries(TYPES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
        </select>
        <label className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 focus-within:border-emerald-400">
          <Search size={16} className="text-white/40" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, city…" aria-label="Search partners" className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/35" />
        </label>
      </div>

      <div className="mt-5">
        {shown.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-white/15 bg-white/[.02]"><Empty icon={status === 'pending' ? Check : Users} title={loading ? 'Loading…' : status === 'pending' ? 'Nothing to review' : 'No partners here'} body={status === 'pending' ? 'When someone applies on partner.zyphix.in, they appear here automatically.' : 'Try another filter.'} /></div>
        ) : (
          <motion.div layout className="grid gap-3 [&>*]:min-w-0 md:grid-cols-2 2xl:grid-cols-3">
            <AnimatePresence initial={false}>
              {shown.map((p, i) => (
                <motion.article key={p.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03, ease: EASE }}
                  className={`group relative flex flex-col rounded-[26px] border bg-white/[.035] p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[.055] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] ${fresh.has(p.id) ? 'border-amber-400/60 ring-4 ring-amber-400/15' : 'border-white/[.08]'}`}>
                  {fresh.has(p.id) && <span className="absolute -top-2.5 left-5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-gray-900">NEW</span>}
                  <button onClick={() => onOpen(p)} className="flex items-start gap-3.5 text-left">
                    <TypeIcon type={p.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold tracking-[-0.01em]">{p.business_name || p.name}</p>
                      <p className="mt-0.5 truncate text-[13px] text-white/50">{TYPES[p.type]?.label ?? p.type}{p.category ? ` · ${p.category}` : ''}</p>
                    </div>
                    <Pill status={p.status} />
                  </button>
                  <div className="mt-4 space-y-1.5 text-[13px] text-white/65">
                    <p className="flex items-center gap-2"><Users size={14} className="text-white/35" />{p.name}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-white/35" />+91 {p.phone}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-white/35" /><span className="truncate">{[p.locality, p.city].filter(Boolean).join(', ') || '—'}</span></p>
                    <p className="flex items-center gap-2"><Clock size={14} className="text-white/35" />Applied {ago(p.created_at)}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 border-t border-white/[.06] pt-4">
                    <button onClick={() => onOpen(p)} className="h-9 rounded-full px-3 text-[13px] font-medium text-white/60 hover:bg-white/10 hover:text-white">Details</button>
                    <div className="ml-auto flex gap-2">
                      {p.status !== 'rejected' && p.status !== 'hidden' && <button onClick={() => onStatus(p, p.status === 'live' ? 'hidden' : 'rejected')} className="h-9 rounded-full border border-white/15 px-3.5 text-[13px] font-medium text-white/75 hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-300">{p.status === 'live' ? 'Hide' : 'Reject'}</button>}
                      {p.status !== 'live' && <button onClick={() => onStatus(p, 'live')} className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white" style={{ background: G }}><Check size={15} /> Approve</button>}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}

/* ── Partner detail drawer ──────────────────────────────────────────────── */
function Drawer({ partner: p, onClose, onStatus }: { partner: Partner | null; onClose: () => void; onStatus: (p: Partner, s: Status) => void }) {
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { setConfirm(false); }, [p?.id]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  const d = p ? parse(p.details) : {};
  const t = p ? TYPES[p.type] : undefined;
  const TI = t?.icon ?? Package;
  return (
    <AnimatePresence>
      {p && (
        <>
          <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />
          <motion.aside key="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[520px] flex-col bg-[#0B0F12] text-white shadow-[-30px_0_80px_-30px_rgba(0,0,0,.9)] ring-1 ring-white/10" role="dialog" aria-label="Partner details">
            <div className="zx-dark relative isolate overflow-hidden border-b border-white/[.06] bg-[#06080A] px-6 pb-6 pt-5 text-white">
              <div aria-hidden className="absolute -right-16 -top-20 h-60 w-60 rounded-full opacity-50 blur-[70px]" style={{ background: t?.color ?? G }} />
              <div className="relative flex items-center justify-between">
                <Pill status={p.status} />
                <button onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close"><X size={18} /></button>
              </div>
              <div className="relative mt-5 flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><TI size={26} /></span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-300">{t?.label ?? p.type} application</p>
                  <h2 className="truncate text-[24px] font-semibold tracking-[-0.03em]">{p.business_name || p.name}</h2>
                  <p className="text-[13px] text-white/60">Applied {toDate(p.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>
              <div className="relative mt-5 grid grid-cols-3 gap-2">
                <a href={`tel:+91${p.phone}`} className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-2.5 text-[12px] font-medium ring-1 ring-white/10 hover:bg-white/15"><Phone size={17} />Call</a>
                <a href={`https://wa.me/91${p.phone}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-2.5 text-[12px] font-medium ring-1 ring-white/10 hover:bg-white/15"><MessageCircle size={17} />WhatsApp</a>
                <a href={p.email ? `mailto:${p.email}` : undefined} aria-disabled={!p.email} className={`flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-2.5 text-[12px] font-medium ring-1 ring-white/10 ${p.email ? 'hover:bg-white/15' : 'pointer-events-none opacity-40'}`}><Mail size={17} />Email</a>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <Block title="Contact" rows={[['Name', p.name], ['Mobile', `+91 ${p.phone}`], ['Email', p.email || 'Not given'], ['City', p.city], ['Area', p.locality]]} />
              <Block title="Business" rows={[['Business name', p.business_name], ['Category', p.category], ['Tags', p.tags]]} />
              {Object.keys(d).length > 0 && <Block title="Everything they submitted" rows={Object.entries(d).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [pretty(k), Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : String(v)] as [string, string])} />}
              <p className="mt-2 text-[12px] text-white/35">Reference {p.id}</p>
            </div>

            <div className="border-t border-white/[.06] bg-[#0B0F12] px-6 py-4">
              <AnimatePresence mode="wait">
                {confirm ? (
                  <motion.div key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <p className="mr-auto text-[13.5px] text-white/75">Reject this application?</p>
                    <button onClick={() => setConfirm(false)} className="h-11 rounded-xl px-4 text-[14px] font-medium text-white/60 hover:bg-white/10">Cancel</button>
                    <button onClick={() => { onStatus(p, 'rejected'); setConfirm(false); }} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-rose-600 px-4 text-[14px] font-semibold text-white"><XCircle size={16} /> Reject</button>
                  </motion.div>
                ) : (
                  <motion.div key="a" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-2">
                    {p.status === 'pending' && <button onClick={() => setConfirm(true)} className="h-11 rounded-xl border border-white/15 px-4 text-[14px] font-medium text-white/80 hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-300">Reject</button>}
                    {p.status === 'live' && <button onClick={() => onStatus(p, 'hidden')} className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-white/15 px-4 text-[14px] font-medium text-white/80 hover:bg-white/5"><EyeOff size={16} /> Hide from sites</button>}
                    {(p.status === 'rejected' || p.status === 'hidden') && <button onClick={() => onStatus(p, 'pending')} className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-white/15 px-4 text-[14px] font-medium text-white/80 hover:bg-white/5"><Undo2 size={16} /> Back to review</button>}
                    {p.status !== 'live' && (
                      <button onClick={() => onStatus(p, 'live')} className="group relative ml-auto inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-xl px-5 text-[14px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(13,163,102,.8)]" style={{ background: 'linear-gradient(180deg,#19C27C,#0DA366)' }}>
                        <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
                        <Check size={16} /> Approve and publish
                      </button>
                    )}
                    {p.status === 'live' && <p className="ml-auto text-[13px] text-emerald-300">Visible on Zyphix</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Block({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  const r = rows.filter(([, v]) => v && String(v).trim());
  if (!r.length) return null;
  return (
    <section className="mb-6">
      <h3 className="mb-3 border-b border-white/[.06] pb-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/45">{title}</h3>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
        {r.map(([k, v]) => <div key={k} className="min-w-0"><dt className="text-[12px] text-white/45">{k}</dt><dd className="break-words text-[14px] font-medium text-white">{v}</dd></div>)}
      </dl>
    </section>
  );
}

/* ── Orders ─────────────────────────────────────────────────────────────── */
function Orders({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const [f, setF] = useState<'all' | 'Now' | 'Eats' | 'Book' | 'call'>('all');
  const shown = orders.filter(o => f === 'all' || (f === 'call' ? o.status === 'requested' : product(o.id).k === f));
  return (
    <>
      <div className="mb-5 flex w-fit flex-wrap gap-1 rounded-full border border-white/10 bg-white/[.04] p-1">
        {(['all', 'Now', 'Eats', 'Book', 'call'] as const).map(k => (
          <button key={k} onClick={() => setF(k)} className={`relative h-9 rounded-full px-3.5 text-[13.5px] font-medium ${f === k ? 'text-gray-950' : 'text-white/60 hover:text-white'}`}>
            {f === k && <motion.span layoutId="order-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">{k === 'all' ? 'All' : k === 'call' ? 'To call' : k}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 ? <div className="rounded-[26px] border border-dashed border-white/15 bg-white/[.02]"><Empty icon={ShoppingBag} title={loading ? 'Loading…' : 'No orders here'} body="New orders and requests appear automatically." /></div> : (
        <div className="grid gap-3">
          {shown.map((o, i) => { const pr = product(o.id); const a = o.address || {}; return (
            <motion.article key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.025 }}
              className="grid gap-4 rounded-[26px] border border-white/[.08] bg-white/[.035] p-5 backdrop-blur-xl md:grid-cols-[150px_1fr_1fr_auto] md:items-center">
              <div><ProductTag pr={pr} />
                <p className="mt-2 font-mono text-[12px] text-white/45">{o.id}</p><p className="text-[12px] text-white/35">{ago(o.createdAt)}</p></div>
              <div className="min-w-0"><p className="text-[14.5px] font-semibold">{a.name || 'Customer'}</p>
                <p className="text-[13px] text-white/65">+91 {a.phone}</p><p className="truncate text-[12.5px] text-white/45">{[a.line1, a.city, a.pincode].filter(Boolean).join(', ')}</p></div>
              <p className="text-[13.5px] text-white/75">{o.items.map(it => `${it.name ?? 'Item'}${(it.qty ?? 1) > 1 ? ` × ${it.qty}` : ''}${it.note ? ` (${it.note})` : ''}`).join(', ')}</p>
              <div className="flex items-center gap-3 md:flex-col md:items-end">
                <p className="text-[15px] font-semibold tabular-nums">{o.total ? `₹${o.total}` : 'Quote by call'}</p>
                <p className="text-[12px] text-white/45">{PAY[o.paymentMode] ?? o.paymentMode}</p>
                {a.phone && <a href={`tel:+91${a.phone}`} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold text-white" style={{ background: o.status === 'requested' ? '#7C3AED' : G }}><Phone size={13} /> Call</a>}
              </div>
            </motion.article>
          ); })}
        </div>
      )}
    </>
  );
}

/* ── Waitlist ───────────────────────────────────────────────────────────── */
function Waitlist({ rows, loading }: { rows: Waiter[]; loading: boolean }) {
  const by = useMemo(() => ['eats', 'book', 'now'].map(k => ({ k, n: rows.filter(r => r.product === k).length })), [rows]);
  return (
    <>
      <div className="mb-5 grid grid-cols-3 gap-3 sm:max-w-[560px]">
        {by.map(b => <div key={b.k} className="rounded-[22px] border border-white/[.08] bg-white/[.035] p-4"><p className="text-[30px] font-semibold tracking-[-0.03em]"><CountUp value={b.n} /></p><p className="text-[12.5px] capitalize text-white/50">Waiting for {b.k}</p></div>)}
      </div>
      {rows.length === 0 ? <div className="rounded-[26px] border border-dashed border-white/15 bg-white/[.02]"><Empty icon={Bell} title={loading ? 'Loading…' : 'Nobody yet'} body="People who ask to be told when Eats or Book opens near them appear here." /></div> : (
        <div className="overflow-x-auto rounded-[26px] border border-white/[.08] bg-white/[.035]">
          <table className="w-full min-w-[620px] text-left text-[13.5px]">
            <thead className="border-b border-white/[.06] text-[11.5px] uppercase tracking-[0.1em] text-white/45"><tr><th className="px-5 py-3.5">Product</th><th className="px-5 py-3.5">Name</th><th className="px-5 py-3.5">Phone</th><th className="px-5 py-3.5">City / area</th><th className="px-5 py-3.5">Joined</th></tr></thead>
            <tbody className="divide-y divide-white/[.06]">
              {rows.map(w => (
                <tr key={w.id} className="hover:bg-white/[.03]">
                  <td className="px-5 py-3.5 capitalize">{w.product}</td><td className="px-5 py-3.5 font-medium">{w.name || '—'}</td>
                  <td className="px-5 py-3.5"><a href={`tel:+91${w.phone}`} className="tabular-nums text-emerald-300 hover:underline">+91 {w.phone}</a></td>
                  <td className="px-5 py-3.5">{w.city || '—'}</td><td className="px-5 py-3.5 text-white/45">{ago(w.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Inbox: support, advertisers, notify-me ─────────────────────────────── */
const KIND: Record<string, { label: string; c: string }> = {
  contact: { label: 'Contact form', c: '#0891B2' }, support: { label: 'Support', c: '#2563EB' }, advertise: { label: 'Advertiser', c: '#D97706' }, notify: { label: 'Notify me', c: G }, 'partner-other': { label: 'Partner (other)', c: '#7C3AED' },
};
type MailRow = { id: number; to_addr: string; subject: string; ok: number; detail: string; created_at: string };
function EmailHealth({ token }: { token: string }) {
  const [rows, setRows] = useState<MailRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [events, setEvents] = useState<{ email: string; event: string; subject?: string; reason?: string; date: string }[] | null>(null);
  const [senders, setSenders] = useState<{ email: string; active: boolean }[]>([]);
  const [evErr, setEvErr] = useState('');
  const load = useCallback(() => {
    api<MailRow[]>('/admin/mail-log', token).then(setRows).catch(() => {});
    api<{ events: typeof events; senders: typeof senders; error?: string }>('/admin/mail-events', token)
      .then(r => { setEvents(r.events ?? []); setSenders(r.senders ?? []); setEvErr(''); })
      .catch(e => setEvErr((e as Error).message));
  }, [token]);
  useEffect(() => { load(); }, [load]);
  const EV: Record<string, { label: string; c: string }> = {
    delivered: { label: 'Delivered', c: 'bg-emerald-400' }, opened: { label: 'Opened', c: 'bg-emerald-400' }, clicks: { label: 'Clicked', c: 'bg-emerald-400' }, requests: { label: 'Accepted by Brevo', c: 'bg-sky-400' },
    deferred: { label: 'Deferred (retrying)', c: 'bg-amber-400' }, softBounces: { label: 'Soft bounce', c: 'bg-amber-400' }, hardBounces: { label: 'Hard bounce', c: 'bg-rose-400' },
    blocked: { label: 'Blocked by Brevo', c: 'bg-rose-400' }, invalid: { label: 'Invalid address', c: 'bg-rose-400' }, spam: { label: 'Marked as spam', c: 'bg-rose-400' }, unsubscribed: { label: 'Unsubscribed', c: 'bg-rose-400' }, error: { label: 'Error', c: 'bg-rose-400' },
  };
  const test = async () => {
    setBusy(true); setResult('');
    try { const r = await api<{ sentTo: string; ok: boolean }>('/admin/mail-test', token, { method: 'POST' }); setResult(r.ok ? `Test email sent to ${r.sentTo}. Check your inbox (and spam).` : 'The test email failed. See the reason in the log below.'); }
    catch (e) { setResult((e as Error).message); }
    setBusy(false); load();
  };
  return (
    <section className={`${PANEL} mb-6 p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto"><h2 className="text-[17px] font-semibold">Email delivery</h2><p className="text-[13px] text-white/50">Every email the site sends (partner confirmations, your notifications, sign-in codes are not listed).</p></div>
        <button onClick={test} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold text-white disabled:opacity-60" style={{ background: G }}>{busy ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />} Send test email</button>
      </div>
      {result && <p className="mt-3 rounded-2xl bg-white/[.06] px-4 py-2.5 text-[13.5px] text-white/80">{result}</p>}
      {(senders.length > 0 || evErr) && (
        <p className="mt-3 text-[12.5px] text-white/50">
          {evErr ? `Brevo delivery status unavailable: ${evErr}` : <>Senders verified in Brevo: {senders.map(s => <span key={s.email} className={`ml-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${s.active ? 'bg-emerald-400/15 text-emerald-200' : 'bg-rose-400/15 text-rose-200'}`}>{s.email}{s.active ? '' : ' (not verified)'}</span>)}{senders.length === 0 ? ' none' : ''}</>}
        </p>
      )}
      {events && events.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40">What Brevo did with them (last 7 days)</p>
          <ul className="divide-y divide-white/[.06]">
            {events.slice(0, 12).map((e, i) => { const k = EV[e.event] ?? { label: e.event, c: 'bg-white/40' }; return (
              <li key={i} className="flex items-start gap-3 py-2 text-[13px]">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${k.c}`} />
                <div className="min-w-0 flex-1"><p className="truncate text-white"><b>{k.label}</b> · {e.email}{e.subject ? ` · ${e.subject}` : ''}</p>{e.reason && <p className="truncate text-rose-200/80">{e.reason}</p>}</div>
                <span className="shrink-0 text-white/40">{ago(e.date)}</span>
              </li>); })}
          </ul>
        </div>
      )}
      {events && events.length === 0 && !evErr && <p className="mt-3 text-[13px] text-white/50">Brevo has no delivery events in the last 7 days.</p>}
      {rows.length > 0 && (
        <ul className="mt-4 divide-y divide-white/[.06]">
          {rows.slice(0, 8).map(r => (
            <li key={r.id} className="flex items-start gap-3 py-2.5 text-[13px]">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${r.ok ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <div className="min-w-0 flex-1"><p className="truncate font-medium text-white">{r.subject}</p><p className="truncate text-white/50">to {r.to_addr} · {r.detail}</p></div>
              <span className="shrink-0 text-white/40">{ago(r.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function InboxView({ rows, loading }: { rows: Msg[]; loading: boolean }) {
  const [f, setF] = useState<string>('all');
  const kinds = ['all', ...Object.keys(KIND).filter(k => rows.some(r => r.kind === k))];
  const shown = rows.filter(r => f === 'all' || r.kind === f);
  return (
    <>
      <div className="mb-5 flex w-fit flex-wrap gap-1 rounded-full border border-white/10 bg-white/[.04] p-1">
        {kinds.map(k => (
          <button key={k} onClick={() => setF(k)} className={`relative h-9 rounded-full px-3.5 text-[13.5px] font-medium ${f === k ? 'text-gray-950' : 'text-white/60 hover:text-white'}`}>
            {f === k && <motion.span layoutId="inbox-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">{k === 'all' ? 'All' : KIND[k].label} <span className="opacity-60">{k === 'all' ? rows.length : rows.filter(r => r.kind === k).length}</span></span>
          </button>
        ))}
      </div>
      {shown.length === 0 ? <div className="rounded-[26px] border border-dashed border-white/15 bg-white/[.02]"><Empty icon={Mail} title={loading ? 'Loading…' : 'Inbox is empty'} body="Support requests, advertiser inquiries and notify-me sign-ups appear here." /></div> : (
        <div className="grid gap-3">
          {shown.map((m, i) => { const k = KIND[m.kind] ?? { label: m.kind, c: '#6B7280' }; const d = parse(m.data ?? ''); const det = (d.details ?? {}) as Record<string, unknown>; const extra = { ...d, ...det }; delete (extra as Record<string, unknown>).details; return (
            <motion.article key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.025 }}
              className="rounded-[26px] border border-white/[.08] bg-white/[.035] p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3">
                <ProductTag pr={{ k: k.label, c: k.c }} />
                <p className="text-[15px] font-semibold">{m.name || m.email || 'Someone'}</p>
                <p className="ml-auto text-[12px] text-white/45">{ago(m.created_at)}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-white/65">
                {m.email && <a href={`mailto:${m.email}`} className="text-emerald-300 hover:underline">{m.email}</a>}
                {m.phone && <a href={`tel:+91${m.phone}`} className="hover:underline">+91 {m.phone}</a>}
                {m.city && <span>{m.city}</span>}
              </div>
              {typeof extra.message === 'string' && <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.6] text-white/80">{extra.message}</p>}
              {Object.entries(extra).filter(([kk, v]) => kk !== 'message' && kk !== 'role' && v !== '' && v != null && typeof v !== 'object').length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
                  {Object.entries(extra).filter(([kk, v]) => kk !== 'message' && kk !== 'role' && v !== '' && v != null && typeof v !== 'object').map(([kk, v]) => (
                    <div key={kk} className="min-w-0"><dt className="text-[11.5px] text-white/45">{pretty(kk)}</dt><dd className="truncate text-[13.5px] text-white">{String(v)}</dd></div>
                  ))}
                </dl>
              )}
            </motion.article>
          ); })}
        </div>
      )}
    </>
  );
}

/* Light theme: remaps the dark palette; anything inside .zx-dark (video hero, drawer header, toasts) stays dark. */
const LIGHT_CSS = '.zx-admin[data-theme=light]{background:#F4F5F2;color:rgb(11,15,18);--zx-bg:#F4F5F2;--zx-tag:100%;--zx-fade:rgba(244,245,242,.35)}\n.zx-admin[data-theme=light] .text-white:not(.zx-dark *):not(.zx-dark){color:rgb(11,15,18)}\n.zx-admin[data-theme=light] .text-white\\/35:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.50)}\n.zx-admin[data-theme=light] .text-white\\/40:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.55)}\n.zx-admin[data-theme=light] .text-white\\/45:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.60)}\n.zx-admin[data-theme=light] .text-white\\/50:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.65)}\n.zx-admin[data-theme=light] .text-white\\/55:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.70)}\n.zx-admin[data-theme=light] .text-white\\/60:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.75)}\n.zx-admin[data-theme=light] .text-white\\/65:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.80)}\n.zx-admin[data-theme=light] .text-white\\/70:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.85)}\n.zx-admin[data-theme=light] .text-white\\/75:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.90)}\n.zx-admin[data-theme=light] .text-white\\/80:not(.zx-dark *):not(.zx-dark){color:rgba(11,15,18,0.95)}\n.zx-admin[data-theme=light] .hover\\:text-white:not(.zx-dark *):not(.zx-dark):hover{color:rgb(11,15,18)}\n.zx-admin[data-theme=light] .ring-white\\/10:not(.zx-dark *):not(.zx-dark){--tw-ring-color:rgba(11,15,18,.09)}\n.zx-admin[data-theme=light] .ring-white\\/15:not(.zx-dark *):not(.zx-dark){--tw-ring-color:rgba(11,15,18,.09)}\n.zx-admin[data-theme=light] .border-white\\/15:not(.zx-dark *):not(.zx-dark){border-color:rgba(11,15,18,.09)}\n.zx-admin[data-theme=light] .border-white\\/10:not(.zx-dark *):not(.zx-dark){border-color:rgba(11,15,18,.09)}\n.zx-admin[data-theme=light] .border-white\\/\\[\\.08\\]:not(.zx-dark *):not(.zx-dark){border-color:rgba(11,15,18,.09)}\n.zx-admin[data-theme=light] .border-white\\/\\[\\.06\\]:not(.zx-dark *):not(.zx-dark){border-color:rgba(11,15,18,.09)}\n.zx-admin[data-theme=light] .divide-white\\/\\[\\.06\\]:not(.zx-dark *):not(.zx-dark){border-color:rgba(11,15,18,.07)}\n.zx-admin[data-theme=light] .divide-white\\/\\[\\.06\\]:not(.zx-dark *):not(.zx-dark)>:not(:last-child){border-color:rgba(11,15,18,.07)}\n.zx-admin[data-theme=light] .bg-white\\/\\[\\.035\\]:not(.zx-dark *):not(.zx-dark){background-color:#fff;box-shadow:0 1px 2px rgba(16,24,40,.04),0 18px 40px -30px rgba(16,24,40,.25)}\n.zx-admin[data-theme=light] .bg-white\\/\\[\\.04\\]:not(.zx-dark *):not(.zx-dark){background-color:#fff;box-shadow:0 1px 2px rgba(16,24,40,.04),0 18px 40px -30px rgba(16,24,40,.25)}\n.zx-admin[data-theme=light] .bg-white\\/\\[\\.02\\]:not(.zx-dark *):not(.zx-dark){background-color:#fff;box-shadow:0 1px 2px rgba(16,24,40,.04),0 18px 40px -30px rgba(16,24,40,.25)}\n.zx-admin[data-theme=light] .bg-white\\/\\[\\.06\\]:not(.zx-dark *):not(.zx-dark){background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .bg-white\\/10:not(.zx-dark *):not(.zx-dark){background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .hover\\:bg-white\\/5:not(.zx-dark *):not(.zx-dark):hover{background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .hover\\:bg-white\\/\\[\\.03\\]:not(.zx-dark *):not(.zx-dark):hover{background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .hover\\:bg-white\\/10:not(.zx-dark *):not(.zx-dark):hover{background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .hover\\:bg-white\\/15:not(.zx-dark *):not(.zx-dark):hover{background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .hover\\:bg-white\\/\\[\\.055\\]:not(.zx-dark *):not(.zx-dark):hover{background-color:rgba(11,15,18,.05)}\n.zx-admin[data-theme=light] .bg-black\\/30:not(.zx-dark *):not(.zx-dark){background-color:rgba(255,255,255,.9)}\n.zx-admin[data-theme=light] .bg-\\[\\#0D1215\\]\\/70:not(.zx-dark *):not(.zx-dark){background-color:rgba(255,255,255,.88)}\n.zx-admin[data-theme=light] .bg-\\[\\#06080A\\]\\/80:not(.zx-dark *):not(.zx-dark){background-color:rgba(250,250,248,.85)}\n.zx-admin[data-theme=light] .bg-\\[\\#0B0F12\\]:not(.zx-dark *):not(.zx-dark){background-color:#fff}\n.zx-admin[data-theme=light] .bg-\\[\\#06080A\\]:not(.zx-dark *):not(.zx-dark){background-color:#F4F5F2}\n.zx-admin[data-theme=light] .placeholder\\:text-white\\/35:not(.zx-dark *):not(.zx-dark)::placeholder{color:rgba(11,15,18,.4)}\n.zx-admin[data-theme=light] .text-emerald-300:not(.zx-dark *):not(.zx-dark){color:#047857}\n.zx-admin[data-theme=light] .text-amber-300:not(.zx-dark *):not(.zx-dark){color:#B45309}\n.zx-admin[data-theme=light] .text-rose-300:not(.zx-dark *):not(.zx-dark){color:#BE123C}\n.zx-admin[data-theme=light] .hover\\:text-rose-300:not(.zx-dark *):not(.zx-dark):hover{color:#BE123C}\n.zx-admin[data-theme=light] button.text-gray-950:not(.zx-dark *):not(.zx-dark){color:#fff}\n.zx-admin[data-theme=light] button.text-gray-950:not(.zx-dark *):not(.zx-dark)>span.bg-white{background:#0B0F12}\n.zx-admin[data-theme=light]{color-scheme:light}';
