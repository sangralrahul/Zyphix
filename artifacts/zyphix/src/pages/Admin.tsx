import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell, Bike, Check, ChevronRight, Clock, Eye, EyeOff, Inbox, LayoutDashboard, Loader2, LogOut, Mail, MapPin, MessageCircle,
  Package, Phone, RefreshCw, Search, ShieldCheck, ShoppingBag, Store, Undo2, Users, UtensilsCrossed, Wrench, X, XCircle,
} from 'lucide-react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from '@/lib/motion';
import { FONT } from '@/ui/kit';
import { useNoIndex } from '@/lib/seo';

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

type Status = 'live' | 'pending' | 'hidden' | 'rejected';
type Partner = { id: string; type: string; name: string; business_name: string; email: string; phone: string; city: string; locality: string; category: string; tags: string; details: string; status: Status; created_at: string; updated_at?: string };
type Order = { id: string; createdAt: string; status: string; items: { name?: string; qty?: number; note?: string }[]; total: number; paymentMode: string; address: Record<string, string>; email?: string };
type Waiter = { id: number; product: string; name: string | null; phone: string; city: string | null; created_at: string };
type View = 'overview' | 'partners' | 'orders' | 'waitlist';

const TYPES: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  store: { label: 'Store', icon: Store, color: '#0DA366' },
  restaurant: { label: 'Restaurant', icon: UtensilsCrossed, color: '#E11D48' },
  service: { label: 'Service pro', icon: Wrench, color: '#7C3AED' },
  delivery: { label: 'Delivery', icon: Bike, color: '#EA580C' },
};
const STATUS: Record<Status, { label: string; cls: string }> = {
  pending: { label: 'Waiting for review', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  live: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  hidden: { label: 'Hidden', cls: 'bg-gray-100 text-gray-600 ring-gray-200' },
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

/* ── Animated backdrop (login + sidebar) ────────────────────────────────── */
function Aurora({ dim = false }: { dim?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="zx-aurora zx-a1" /><div className="zx-aurora zx-a2" /><div className="zx-aurora zx-a3" />
      <div className="zx-grid" />
      {!dim && Array.from({ length: 22 }, (_, i) => <span key={i} className="zx-spark" style={{ left: `${(i * 47) % 100}%`, top: `${(i * 31) % 100}%`, animationDelay: `${(i * 0.6) % 7}s` }} />)}
      <style>{`
        .zx-aurora{position:absolute;border-radius:50%;filter:blur(90px);opacity:${dim ? .35 : .55};animation:zxFloat 18s ease-in-out infinite alternate}
        .zx-a1{width:55vmax;height:55vmax;left:-15vmax;top:-20vmax;background:#0DA366}
        .zx-a2{width:40vmax;height:40vmax;right:-10vmax;top:0;background:#2563EB;opacity:${dim ? .2 : .32};animation-duration:24s;animation-delay:-8s}
        .zx-a3{width:38vmax;height:38vmax;left:25vmax;bottom:-22vmax;background:#7C3AED;opacity:${dim ? .18 : .28};animation-duration:28s;animation-delay:-14s}
        .zx-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse at 50% 35%,#000 25%,transparent 75%);animation:zxPan 40s linear infinite}
        .zx-spark{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:0;animation:zxSpark 7s ease-in-out infinite}
        @keyframes zxFloat{0%{transform:translate(0,0) scale(1)}50%{transform:translate(5vmax,4vmax) scale(1.08)}100%{transform:translate(-4vmax,7vmax) scale(.94)}}
        @keyframes zxPan{to{background-position:48px 48px,48px 48px}}
        @keyframes zxSpark{0%,100%{opacity:0;transform:translateY(0)}40%{opacity:.9}80%{opacity:0;transform:translateY(-70px)}}
        @media (prefers-reduced-motion:reduce){.zx-aurora,.zx-grid,.zx-spark{animation:none}}
      `}</style>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.round(v).toLocaleString('en-IN'));
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05080E] px-5" style={{ fontFamily: FONT }}>
      <Aurora />
      <motion.form key={shake} onSubmit={submit}
        initial={shake ? { x: 0 } : { opacity: 0, y: 30, scale: 0.98 }} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shake ? 0.4 : 0.8, ease: EASE }}
        className="relative w-full max-w-[420px] rounded-[28px] border border-white/10 bg-white/[.06] p-8 text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)] backdrop-blur-2xl sm:p-10">
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 18 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_14px_40px_-10px_rgba(13,163,102,.9)]" style={{ background: 'linear-gradient(160deg,#19C27C,#0DA366)' }}>
          <ShieldCheck size={26} />
        </motion.span>
        <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Zyphix operations</p>
        <h1 className="mt-2 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em]">Admin <span className="font-serif-accent text-emerald-300">console</span></h1>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-white/60">Review partner applications, orders and requests. Sign in with your admin key.</p>
        <label className="mt-7 flex h-[52px] items-center rounded-2xl border border-white/15 bg-white/[.06] transition focus-within:border-emerald-400 focus-within:shadow-[0_0_0_4px_rgba(52,211,153,.15)]">
          <input type={show ? 'text' : 'password'} value={t} onChange={e => setT(e.target.value)} autoFocus placeholder="Admin key" autoComplete="off" aria-label="Admin key"
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/35" />
          <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide key' : 'Show key'} className="mr-3 text-white/50 hover:text-white">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </label>
        <AnimatePresence>{err && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2.5 text-[13px] font-medium text-rose-300">{err}</motion.p>}</AnimatePresence>
        <button disabled={!t.trim() || busy} className="group relative mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(180deg,#19C27C,#0DA366)' }}>
          <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />} Sign in
        </button>
        <p className="mt-5 text-center text-[12px] text-white/40">Your key stays in this browser tab only.</p>
      </motion.form>
    </div>
  );
}

/* ── Small UI ───────────────────────────────────────────────────────────── */
function Pill({ status }: { status: Status }) {
  return <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${STATUS[status].cls}`}>
    {status === 'pending' && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" /><span className="relative h-1.5 w-1.5 rounded-full bg-amber-500" /></span>}
    {STATUS[status].label}
  </span>;
}
function TypeIcon({ type, size = 40 }: { type: string; size?: number }) {
  const t = TYPES[type] ?? { icon: Package, color: '#6B7280' };
  const I = t.icon;
  return <span className="flex shrink-0 items-center justify-center rounded-xl" style={{ width: size, height: size, color: t.color, background: `color-mix(in srgb, ${t.color} 11%, white)` }}><I size={Math.round(size * 0.45)} strokeWidth={1.9} /></span>;
}
function Empty({ icon: I, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500"><I size={22} /></motion.span>
      <p className="mt-4 text-[15px] font-semibold">{title}</p><p className="mt-1 max-w-[34ch] text-[13.5px] text-gray-500">{body}</p>
    </div>
  );
}

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
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState<Date | null>(null);
  const [open, setOpen] = useState<Partner | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const seen = useRef<Set<string> | null>(null);

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
      const [p, o, w] = await Promise.all([
        api<Partner[]>('/admin/partners', token), api<Order[]>('/admin/orders', token), api<Waiter[]>('/admin/waitlist', token).catch(() => [] as Waiter[]),
      ]);
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
      await api(`/admin/partners/${encodeURIComponent(p.id)}/status?status=${status}`, token, { method: 'POST' });
      const name = p.business_name || p.name;
      toast(status === 'live' ? `${name} approved. It's now visible on Zyphix.` : status === 'rejected' ? `${name} rejected.` : status === 'hidden' ? `${name} hidden from the sites.` : `${name} moved back to review.`);
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
    { k: 'waitlist', label: 'Waitlist', icon: Bell },
  ];
  const hour = new Date().getHours();

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 lg:grid lg:grid-cols-[260px_1fr]" style={{ fontFamily: FONT }}>
      {/* ── Sidebar ── */}
      <aside className="relative isolate overflow-hidden bg-[#05080E] text-white lg:sticky lg:top-0 lg:h-screen">
        <Aurora dim />
        <div className="relative flex h-full flex-col px-4 py-4 lg:px-5 lg:py-7">
          <div className="flex items-center gap-2.5 px-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(160deg,#19C27C,#0DA366)' }}><ShieldCheck size={18} /></span>
            <div><p className="text-[15px] font-semibold leading-tight">Zyphix</p><p className="text-[12px] text-white/50">Operations console</p></div>
            <button onClick={signOut} className="ml-auto rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Sign out"><LogOut size={17} /></button>
          </div>
          <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-10 lg:flex-col [scrollbar-width:none]">
            {NAV.map(n => {
              const on = view === n.k; const I = n.icon;
              return (
                <button key={n.k} onClick={() => setView(n.k)} className={`relative flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${on ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                  {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/15" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <I size={17} className="relative" /><span className="relative whitespace-nowrap">{n.label}</span>
                  {!!n.badge && <span className="relative ml-auto rounded-full bg-amber-400 px-2 text-[11.5px] font-bold text-gray-900">{n.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto hidden space-y-3 lg:block">
            <div className="rounded-2xl bg-white/[.06] p-4 ring-1 ring-white/10">
              <p className="flex items-center gap-2 text-[13px] font-medium"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>Live</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-white/50">Refreshes every 20 seconds.{synced && <><br />Updated {synced.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>}</p>
            </div>
            <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14px] text-white/60 hover:bg-white/10 hover:text-white"><LogOut size={17} /> Sign out</button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="min-w-0 px-4 pb-24 pt-6 sm:px-8 lg:px-10 lg:pt-9">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <AnimatePresence mode="wait">
              <motion.h1 key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}
                className="mt-1 text-[30px] font-semibold tracking-[-0.035em] sm:text-[34px]">
                {view === 'overview' ? <>Good {hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}<span className="text-emerald-600">.</span></> : NAV.find(n => n.k === view)?.label}
              </motion.h1>
            </AnimatePresence>
          </div>
          <button onClick={() => load()} className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[13.5px] font-medium text-gray-700 shadow-sm transition hover:border-gray-300">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
            {view === 'overview' && <Overview kpis={kpis} pending={pending} orders={orders} onGo={setView} onOpen={setOpen} onStatus={setStatus} fresh={fresh} />}
            {view === 'partners' && <Partners partners={partners} onOpen={setOpen} onStatus={setStatus} fresh={fresh} loading={loading} />}
            {view === 'orders' && <Orders orders={orders} loading={loading} />}
            {view === 'waitlist' && <Waitlist rows={waitlist} loading={loading} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Drawer partner={open} onClose={() => setOpen(null)} onStatus={setStatus} />

      {/* ── Toasts ── */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 flex w-[min(380px,calc(100vw-40px))] flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-gray-900 px-4 py-3.5 text-[13.5px] leading-[1.45] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,.5)]">
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

/* ── Overview ───────────────────────────────────────────────────────────── */
function Overview({ kpis, pending, orders, onGo, onOpen, onStatus, fresh }: {
  kpis: { label: string; value: number; icon: React.ElementType; color: string; go: View }[]; pending: Partner[]; orders: Order[];
  onGo: (v: View) => void; onOpen: (p: Partner) => void; onStatus: (p: Partner, s: Status) => void; fresh: Set<string>;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 [&>*]:min-w-0 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k, i) => {
          const I = k.icon;
          return (
            <motion.button key={k.label} onClick={() => onGo(k.go)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}
              whileHover={{ y: -3 }} className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-5 text-left shadow-[0_1px_2px_rgba(16,24,40,.04)] transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(16,24,40,.35)]">
              <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[.08] transition-transform duration-500 group-hover:scale-125" style={{ background: k.color }} />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ color: k.color, background: `color-mix(in srgb, ${k.color} 11%, white)` }}><I size={19} /></span>
              <p className="mt-5 text-[32px] font-semibold leading-none tracking-[-0.03em]"><CountUp value={k.value} /></p>
              <p className="mt-2 text-[13px] text-gray-500">{k.label}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 [&>*]:min-w-0 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="text-[17px] font-semibold tracking-[-0.01em]">Needs your review</h2><p className="text-[13px] text-gray-500">New partner applications, oldest first.</p></div>
            <button onClick={() => onGo('partners')} className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-emerald-700">All partners <ChevronRight size={15} /></button>
          </div>
          {pending.length === 0 ? <Empty icon={Check} title="You're all caught up" body="New applications will appear here automatically." /> : (
            <ul className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {[...pending].reverse().slice(0, 6).map(p => (
                  <motion.li key={p.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30, height: 0 }} transition={{ duration: 0.35, ease: EASE }}
                    className={`flex items-center gap-3 py-3 ${fresh.has(p.id) ? 'rounded-xl bg-amber-50/70 px-2' : ''}`}>
                    <TypeIcon type={p.type} size={38} />
                    <button onClick={() => onOpen(p)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[14.5px] font-semibold">{p.business_name || p.name}</p>
                      <p className="truncate text-[12.5px] text-gray-500">{TYPES[p.type]?.label ?? p.type} · {p.city || 'City not given'} · {ago(p.created_at)}</p>
                    </button>
                    <button onClick={() => onStatus(p, 'rejected')} className="hidden h-9 items-center rounded-lg px-3 text-[13px] font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-700 sm:inline-flex">Reject</button>
                    <button onClick={() => onStatus(p, 'live')} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold text-white" style={{ background: G }}><Check size={15} /> Approve</button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="text-[17px] font-semibold tracking-[-0.01em]">Latest orders</h2><p className="text-[13px] text-gray-500">Now orders and Eats / Book requests.</p></div>
            <button onClick={() => onGo('orders')} className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-emerald-700">All <ChevronRight size={15} /></button>
          </div>
          {orders.length === 0 ? <Empty icon={ShoppingBag} title="No orders yet" body="Orders and requests show up here the moment they're placed." /> : (
            <ul className="divide-y divide-gray-100">
              {orders.slice(0, 6).map(o => { const pr = product(o.id); return (
                <li key={o.id} className="flex items-center gap-3 py-3">
                  <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ color: pr.c, background: `color-mix(in srgb, ${pr.c} 10%, white)` }}>{pr.k}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-medium">{o.address?.name || 'Customer'}</p><p className="truncate text-[12.5px] text-gray-500">{o.items.map(i => i.name).join(', ')}</p></div>
                  <div className="text-right"><p className="text-[13.5px] font-semibold tabular-nums">{o.total ? `₹${o.total}` : 'Call'}</p><p className="text-[12px] text-gray-400">{ago(o.createdAt)}</p></div>
                </li>
              ); })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
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
        <div className="flex flex-wrap gap-1 rounded-2xl border border-gray-200 bg-white p-1">
          {(['pending', 'live', 'rejected', 'hidden', 'all'] as const).map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`relative h-9 rounded-xl px-3.5 text-[13.5px] font-medium transition-colors ${status === s ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              {status === s && <motion.span layoutId="status-pill" className="absolute inset-0 rounded-xl bg-gray-900" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{s === 'all' ? 'All' : s === 'live' ? 'Approved' : s === 'pending' ? 'To review' : STATUS[s].label} <span className="opacity-60">{counts[s] || 0}</span></span>
            </button>
          ))}
        </div>
        <select value={type} onChange={e => setType(e.target.value)} className="h-11 rounded-2xl border border-gray-200 bg-white px-3.5 text-[13.5px] outline-none" aria-label="Partner type">
          <option value="all">All types</option>{Object.entries(TYPES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
        </select>
        <label className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-emerald-600">
          <Search size={16} className="text-gray-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, city…" aria-label="Search partners" className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </label>
      </div>

      <div className="mt-5">
        {shown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white"><Empty icon={status === 'pending' ? Check : Users} title={loading ? 'Loading…' : status === 'pending' ? 'Nothing to review' : 'No partners here'} body={status === 'pending' ? 'When someone applies on partner.zyphix.in, they appear here automatically.' : 'Try another filter.'} /></div>
        ) : (
          <motion.div layout className="grid gap-3 [&>*]:min-w-0 md:grid-cols-2 2xl:grid-cols-3">
            <AnimatePresence initial={false}>
              {shown.map((p, i) => (
                <motion.article key={p.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03, ease: EASE }}
                  className={`group relative flex flex-col rounded-3xl border bg-white p-5 transition-shadow hover:shadow-[0_24px_50px_-28px_rgba(16,24,40,.35)] ${fresh.has(p.id) ? 'border-amber-300 ring-4 ring-amber-100' : 'border-gray-200/80'}`}>
                  {fresh.has(p.id) && <span className="absolute -top-2.5 left-5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-gray-900">NEW</span>}
                  <button onClick={() => onOpen(p)} className="flex items-start gap-3.5 text-left">
                    <TypeIcon type={p.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold tracking-[-0.01em]">{p.business_name || p.name}</p>
                      <p className="mt-0.5 truncate text-[13px] text-gray-500">{TYPES[p.type]?.label ?? p.type}{p.category ? ` · ${p.category}` : ''}</p>
                    </div>
                    <Pill status={p.status} />
                  </button>
                  <div className="mt-4 space-y-1.5 text-[13px] text-gray-600">
                    <p className="flex items-center gap-2"><Users size={14} className="text-gray-400" />{p.name}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" />+91 {p.phone}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /><span className="truncate">{[p.locality, p.city].filter(Boolean).join(', ') || '—'}</span></p>
                    <p className="flex items-center gap-2"><Clock size={14} className="text-gray-400" />Applied {ago(p.created_at)}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
                    <button onClick={() => onOpen(p)} className="h-9 rounded-lg px-3 text-[13px] font-medium text-gray-600 hover:bg-gray-100">Details</button>
                    <div className="ml-auto flex gap-2">
                      {p.status !== 'rejected' && p.status !== 'hidden' && <button onClick={() => onStatus(p, p.status === 'live' ? 'hidden' : 'rejected')} className="h-9 rounded-lg border border-gray-200 px-3.5 text-[13px] font-medium text-gray-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">{p.status === 'live' ? 'Hide' : 'Reject'}</button>}
                      {p.status !== 'live' && <button onClick={() => onStatus(p, 'live')} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold text-white" style={{ background: G }}><Check size={15} /> Approve</button>}
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
          <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-gray-950/40 backdrop-blur-[2px]" />
          <motion.aside key="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[520px] flex-col bg-white shadow-[-30px_0_80px_-30px_rgba(0,0,0,.4)]" role="dialog" aria-label="Partner details">
            <div className="relative isolate overflow-hidden bg-[#05080E] px-6 pb-6 pt-5 text-white">
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
              <p className="mt-2 text-[12px] text-gray-400">Reference {p.id}</p>
            </div>

            <div className="border-t border-gray-100 bg-white px-6 py-4">
              <AnimatePresence mode="wait">
                {confirm ? (
                  <motion.div key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <p className="mr-auto text-[13.5px] text-gray-700">Reject this application?</p>
                    <button onClick={() => setConfirm(false)} className="h-11 rounded-xl px-4 text-[14px] font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button onClick={() => { onStatus(p, 'rejected'); setConfirm(false); }} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-rose-600 px-4 text-[14px] font-semibold text-white"><XCircle size={16} /> Reject</button>
                  </motion.div>
                ) : (
                  <motion.div key="a" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-2">
                    {p.status === 'pending' && <button onClick={() => setConfirm(true)} className="h-11 rounded-xl border border-gray-200 px-4 text-[14px] font-medium text-gray-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">Reject</button>}
                    {p.status === 'live' && <button onClick={() => onStatus(p, 'hidden')} className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-gray-200 px-4 text-[14px] font-medium text-gray-700"><EyeOff size={16} /> Hide from sites</button>}
                    {(p.status === 'rejected' || p.status === 'hidden') && <button onClick={() => onStatus(p, 'pending')} className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-gray-200 px-4 text-[14px] font-medium text-gray-700"><Undo2 size={16} /> Back to review</button>}
                    {p.status !== 'live' && (
                      <button onClick={() => onStatus(p, 'live')} className="group relative ml-auto inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-xl px-5 text-[14px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(13,163,102,.8)]" style={{ background: 'linear-gradient(180deg,#19C27C,#0DA366)' }}>
                        <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
                        <Check size={16} /> Approve and publish
                      </button>
                    )}
                    {p.status === 'live' && <p className="ml-auto text-[13px] text-emerald-700">Visible on Zyphix</p>}
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
      <h3 className="mb-3 border-b border-gray-100 pb-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-gray-500">{title}</h3>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
        {r.map(([k, v]) => <div key={k} className="min-w-0"><dt className="text-[12px] text-gray-500">{k}</dt><dd className="break-words text-[14px] font-medium text-gray-900">{v}</dd></div>)}
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
      <div className="mb-5 flex flex-wrap gap-1 rounded-2xl border border-gray-200 bg-white p-1 sm:w-fit">
        {(['all', 'Now', 'Eats', 'Book', 'call'] as const).map(k => (
          <button key={k} onClick={() => setF(k)} className={`relative h-9 rounded-xl px-3.5 text-[13.5px] font-medium ${f === k ? 'text-white' : 'text-gray-600'}`}>
            {f === k && <motion.span layoutId="order-pill" className="absolute inset-0 rounded-xl bg-gray-900" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">{k === 'all' ? 'All' : k === 'call' ? 'To call' : k}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 ? <div className="rounded-3xl border border-dashed border-gray-300 bg-white"><Empty icon={ShoppingBag} title={loading ? 'Loading…' : 'No orders here'} body="New orders and requests appear automatically." /></div> : (
        <div className="grid gap-3">
          {shown.map((o, i) => { const pr = product(o.id); const a = o.address || {}; return (
            <motion.article key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.025 }}
              className="grid gap-4 rounded-3xl border border-gray-200/80 bg-white p-5 md:grid-cols-[150px_1fr_1fr_auto] md:items-center">
              <div><span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ color: pr.c, background: `color-mix(in srgb, ${pr.c} 10%, white)` }}>{pr.k}</span>
                <p className="mt-2 font-mono text-[12px] text-gray-500">{o.id}</p><p className="text-[12px] text-gray-400">{ago(o.createdAt)}</p></div>
              <div className="min-w-0"><p className="text-[14.5px] font-semibold">{a.name || 'Customer'}</p>
                <p className="text-[13px] text-gray-600">+91 {a.phone}</p><p className="truncate text-[12.5px] text-gray-500">{[a.line1, a.city, a.pincode].filter(Boolean).join(', ')}</p></div>
              <p className="text-[13.5px] text-gray-700">{o.items.map(it => `${it.name ?? 'Item'}${(it.qty ?? 1) > 1 ? ` × ${it.qty}` : ''}${it.note ? ` (${it.note})` : ''}`).join(', ')}</p>
              <div className="flex items-center gap-3 md:flex-col md:items-end">
                <p className="text-[15px] font-semibold tabular-nums">{o.total ? `₹${o.total}` : 'Quote by call'}</p>
                <p className="text-[12px] text-gray-500">{PAY[o.paymentMode] ?? o.paymentMode}</p>
                {a.phone && <a href={`tel:+91${a.phone}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold text-white" style={{ background: o.status === 'requested' ? '#7C3AED' : G }}><Phone size={13} /> Call</a>}
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
        {by.map(b => <div key={b.k} className="rounded-2xl border border-gray-200/80 bg-white p-4"><p className="text-[26px] font-semibold"><CountUp value={b.n} /></p><p className="text-[12.5px] capitalize text-gray-500">Waiting for {b.k}</p></div>)}
      </div>
      {rows.length === 0 ? <div className="rounded-3xl border border-dashed border-gray-300 bg-white"><Empty icon={Bell} title={loading ? 'Loading…' : 'Nobody yet'} body="People who ask to be told when Eats or Book opens near them appear here." /></div> : (
        <div className="overflow-x-auto rounded-3xl border border-gray-200/80 bg-white">
          <table className="w-full min-w-[620px] text-left text-[13.5px]">
            <thead className="border-b border-gray-100 text-[11.5px] uppercase tracking-[0.1em] text-gray-500"><tr><th className="px-5 py-3.5">Product</th><th className="px-5 py-3.5">Name</th><th className="px-5 py-3.5">Phone</th><th className="px-5 py-3.5">City / area</th><th className="px-5 py-3.5">Joined</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(w => (
                <tr key={w.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 capitalize">{w.product}</td><td className="px-5 py-3.5 font-medium">{w.name || '—'}</td>
                  <td className="px-5 py-3.5"><a href={`tel:+91${w.phone}`} className="tabular-nums text-emerald-700 hover:underline">+91 {w.phone}</a></td>
                  <td className="px-5 py-3.5">{w.city || '—'}</td><td className="px-5 py-3.5 text-gray-500">{ago(w.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
