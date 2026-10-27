import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, EyeOff, Loader2, LogOut, RefreshCw, ShieldCheck, Store, UtensilsCrossed, Wrench, Bike, Package } from 'lucide-react';
import { FONT } from '@/ui/kit';
import { useNoIndex } from '@/lib/seo';

/* ────────────────────────────────────────────────────────────────────────────
   zyphix.in/admin — operations console.
   Sign-in is the Worker's ADMIN_TOKEN secret (never stored in the site's code);
   it is kept in this tab's sessionStorage only. Partners: approve / hide sign-ups.
   Orders: latest orders from the database.
──────────────────────────────────────────────────────────────────────────── */

const G = '#0DA366';
const KEY = 'zx-admin-token';

type Partner = { id: string; type: string; name: string; business_name: string; email: string; phone: string; city: string; locality: string; category: string; tags: string; details: string; status: 'live' | 'pending' | 'hidden'; created_at: string };
type Waiter = { id: number; product: string; name: string | null; phone: string; city: string | null; created_at: string };
type Order = { id: string; createdAt: string; status: string; items: { name?: string; qty?: number }[]; total: number; paymentMode: string; address: Record<string, string>; email?: string };

const TYPE_ICON: Record<string, React.ReactNode> = { store: <Store size={15} />, restaurant: <UtensilsCrossed size={15} />, service: <Wrench size={15} />, delivery: <Bike size={15} /> };

async function adminFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const r = await fetch(path, { ...init, headers: { authorization: `Bearer ${token}`, ...(init?.headers || {}) } });
  if (r.status === 401) throw new Error('unauthorized');
  if (!r.ok) throw new Error(`Request failed (${r.status})`);
  return r.json() as Promise<T>;
}

function Login({ onOk }: { onOk: (t: string) => void }) {
  const [t, setT] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await adminFetch('/admin/whoami', t.trim()); onOk(t.trim()); }
    catch (x) { setErr((x as Error).message === 'unauthorized' ? 'That key is not valid.' : 'Could not reach the server. Try again.'); }
    setBusy(false);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05080E] px-5" style={{ fontFamily: FONT }}>
      <form onSubmit={submit} className="w-full max-w-[400px] rounded-3xl bg-white p-8 shadow-2xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: G }}><ShieldCheck size={22} /></span>
        <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-gray-900">Zyphix admin</h1>
        <p className="mt-1.5 text-[14px] text-gray-500">Paste your admin key (the Worker's ADMIN_TOKEN secret).</p>
        <input type="password" value={t} onChange={e => setT(e.target.value)} autoFocus placeholder="Admin key" autoComplete="off"
          className="mt-6 h-12 w-full rounded-xl border-[1.5px] border-gray-200 px-4 text-[15px] outline-none focus:border-emerald-600" />
        {err && <p className="mt-2 text-[13px] font-medium text-red-600">{err}</p>}
        <button disabled={!t.trim() || busy} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white disabled:opacity-60" style={{ background: G }}>
          {busy && <Loader2 size={17} className="animate-spin" />} Sign in
        </button>
      </form>
    </div>
  );
}

export function Admin() {
  useNoIndex();
  useEffect(() => { document.title = 'Admin · Zyphix'; }, []);
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } });
  const [tab, setTab] = useState<'partners' | 'orders' | 'waitlist'>('partners');
  const [waitlist, setWaitlist] = useState<Waiter[]>([]);
  const [filter, setFilter] = useState<'pending' | 'live' | 'hidden' | 'all'>('pending');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [busyId, setBusyId] = useState('');

  const signOut = () => { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } setToken(''); };
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setErr('');
    try {
      const [p, o, w] = await Promise.all([adminFetch<Partner[]>('/admin/partners', token), adminFetch<Order[]>('/admin/orders', token), adminFetch<Waiter[]>('/admin/waitlist', token).catch(() => [] as Waiter[])]);
      setPartners(p); setOrders(o); setWaitlist(w);
    } catch (x) { if ((x as Error).message === 'unauthorized') signOut(); else setErr((x as Error).message); }
    setLoading(false);
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: Partner['status']) => {
    setBusyId(id);
    try { await adminFetch(`/admin/partners/${encodeURIComponent(id)}/status?status=${status}`, token, { method: 'POST' }); setPartners(ps => ps.map(p => p.id === id ? { ...p, status } : p)); }
    catch (x) { setErr((x as Error).message); }
    setBusyId('');
  };

  const counts = useMemo(() => ({
    pending: partners.filter(p => p.status === 'pending').length,
    live: partners.filter(p => p.status === 'live').length,
    hidden: partners.filter(p => p.status === 'hidden').length,
    all: partners.length,
  }), [partners]);
  const shown = filter === 'all' ? partners : partners.filter(p => p.status === filter);

  if (!token) return <Login onOk={t => { try { sessionStorage.setItem(KEY, t); } catch { /* ignore */ } setToken(t); }} />;

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-gray-900" style={{ fontFamily: FONT }}>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: G }}><ShieldCheck size={17} /></span>
          <p className="text-[15px] font-semibold">Zyphix admin</p>
          <nav className="ml-6 flex gap-1">
            {(['partners', 'orders', 'waitlist'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`h-9 rounded-lg px-3.5 text-[14px] font-medium capitalize ${tab === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {t}{t === 'partners' && counts.pending > 0 && <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold text-gray-900">{counts.pending}</span>}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex gap-2">
            <button onClick={load} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13.5px] text-gray-600 hover:bg-gray-100"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
            <button onClick={signOut} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13.5px] text-gray-600 hover:bg-gray-100"><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-8">
        {err && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{err}</p>}

        {tab === 'partners' && (
          <>
            <div className="mb-5 flex flex-wrap gap-2">
              {(['pending', 'live', 'hidden', 'all'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`h-9 rounded-full px-4 text-[13.5px] font-medium capitalize ${filter === f ? 'text-white' : 'border border-gray-200 bg-white text-gray-700'}`} style={filter === f ? { background: G } : undefined}>
                  {f === 'pending' ? 'Waiting for review' : f} · {counts[f]}
                </button>
              ))}
            </div>
            {shown.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-[14px] text-gray-500">{loading ? 'Loading…' : 'Nothing here.'}</p>
            ) : (
              <div className="grid gap-3">
                {shown.map(p => {
                  let d: Record<string, unknown> = {}; try { d = JSON.parse(p.details || '{}'); } catch { /* ignore */ }
                  return (
                    <article key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="flex flex-wrap items-start gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">{TYPE_ICON[p.type] ?? <Package size={15} />}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[16px] font-semibold">{p.business_name || p.name} <span className="ml-1 text-[12.5px] font-normal capitalize text-gray-500">{p.type}{p.category ? ` · ${p.category}` : ''}</span></p>
                          <p className="mt-1 text-[13.5px] text-gray-600">{p.name} · +91 {p.phone}{p.email ? ` · ${p.email}` : ''}</p>
                          <p className="mt-0.5 text-[13px] text-gray-500">{[p.locality, p.city].filter(Boolean).join(', ')} · signed up {new Date(p.created_at.replace(' ', 'T') + 'Z').toLocaleString('en-IN')}</p>
                          {p.tags && <p className="mt-2 text-[12.5px] text-gray-500">{p.tags}</p>}
                          {Object.keys(d).length > 0 && (
                            <details className="mt-2 text-[12.5px] text-gray-500"><summary className="cursor-pointer font-medium text-gray-700">All details</summary>
                              <dl className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">{Object.entries(d).filter(([, v]) => v !== '' && v != null).map(([k, v]) => <div key={k}><dt className="inline text-gray-400">{k}: </dt><dd className="inline">{String(v)}</dd></div>)}</dl>
                            </details>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${p.status === 'live' ? 'bg-emerald-50 text-emerald-700' : p.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{p.status === 'pending' ? 'Waiting' : p.status}</span>
                          {p.status !== 'live' && <button disabled={busyId === p.id} onClick={() => setStatus(p.id, 'live')} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13.5px] font-semibold text-white disabled:opacity-60" style={{ background: G }}><Check size={15} /> Approve</button>}
                          {p.status !== 'hidden' && <button disabled={busyId === p.id} onClick={() => setStatus(p.id, 'hidden')} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 text-[13.5px] font-medium text-gray-700 disabled:opacity-60"><EyeOff size={15} /> Hide</button>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === 'waitlist' && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead className="border-b border-gray-200 bg-gray-50 text-[12px] uppercase tracking-[0.08em] text-gray-500">
                <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">City / area</th><th className="px-4 py-3">Joined</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {waitlist.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">{loading ? 'Loading…' : 'Nobody on the waitlist yet.'}</td></tr>}
                {waitlist.map(w => (
                  <tr key={w.id}><td className="px-4 py-3 capitalize">{w.product}</td><td className="px-4 py-3">{w.name || '—'}</td><td className="px-4 py-3 tabular-nums">+91 {w.phone}</td><td className="px-4 py-3">{w.city || '—'}</td><td className="px-4 py-3 text-gray-600">{new Date(w.created_at.replace(' ', 'T') + 'Z').toLocaleString('en-IN')}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-[13.5px]">
              <thead className="border-b border-gray-200 bg-gray-50 text-[12px] uppercase tracking-[0.08em] text-gray-500">
                <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Placed</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3 text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">{loading ? 'Loading…' : 'No orders yet.'}</td></tr>}
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${o.id.startsWith('ZET') ? 'bg-rose-50 text-rose-700' : o.id.startsWith('ZBK') ? 'bg-violet-50 text-violet-700' : 'bg-emerald-50 text-emerald-700'}`}>{o.id.startsWith('ZET') ? 'Eats' : o.id.startsWith('ZBK') ? 'Book' : 'Now'}</span>{o.status === 'requested' && <span className="ml-1.5 text-[11.5px] text-amber-700">call to confirm</span>}</td>
                    <td className="px-4 py-3 font-mono text-[12.5px]">{o.id}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(o.createdAt).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">{o.address?.name}<span className="block text-[12px] text-gray-500">{o.address?.phone} · {[o.address?.line1, o.address?.city, o.address?.pincode].filter(Boolean).join(', ')}</span></td>
                    <td className="px-4 py-3 text-gray-600">{o.items.map(i => `${i.name ?? 'Item'} × ${i.qty ?? 1}${(i as { note?: string }).note ? ` (${(i as { note?: string }).note})` : ''}`).join(', ')}</td>
                    <td className="px-4 py-3">{({ COD: 'Cash on delivery', CALL_TO_CONFIRM: 'Confirm by call', ONLINE: 'Online' } as Record<string, string>)[o.paymentMode] ?? o.paymentMode}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">₹{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
