import React, { useState } from 'react';
import { CheckCircle2, Clock, Loader2, Package, Search, Ticket, MessageSquarePlus } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   Support help desk (support.zyphix.in): look up an order, raise a ticket and
   check a ticket. Orders come from /api/orders/:id; tickets from /api/tickets.
──────────────────────────────────────────────────────────────────────────── */

type Tab = 'order' | 'raise' | 'check';
type Order = { id: string; createdAt: string; status: string; items: { name?: string; qty?: number; note?: string }[]; total: number; paymentMode: string; address?: Record<string, string> };
type TicketInfo = { id: string; topic: string; status: string; reply: string; orderId: string; createdAt: string; updatedAt: string };

const TOPICS = ['Order not delivered', 'Missing or wrong item', 'Refund', 'Payment issue', 'Booking (Zyphix Book)', 'Account & sign-in', 'Something else'];
const ORDER_STATUS: Record<string, string> = { placed: 'Order placed', requested: 'Received, confirming by phone', confirmed: 'Confirmed', packed: 'Packed', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled' };
const TICKET_STATUS: Record<string, { l: string; c: string }> = { open: { l: 'Open', c: 'bg-amber-50 text-amber-800' }, in_progress: { l: 'In progress', c: 'bg-sky-50 text-sky-800' }, resolved: { l: 'Resolved', c: 'bg-emerald-50 text-emerald-800' } };
const product = (id: string) => (id.startsWith('ZET') ? 'Zyphix Eats order' : id.startsWith('ZBK') ? 'Zyphix Book booking' : 'Zyphix Now order');
const when = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const input = 'h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100';
const btn = 'inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0DA366] px-5 text-[15px] font-semibold text-white transition hover:brightness-105 disabled:opacity-60';

async function post<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { error?: string }).error || 'Something went wrong. Please try again.');
  return d as T;
}

export function HelpDesk() {
  const [tab, setTab] = useState<Tab>('order');
  const TABS: { k: Tab; l: string; icon: React.ElementType }[] = [
    { k: 'order', l: 'Track an order', icon: Package },
    { k: 'raise', l: 'Raise a ticket', icon: MessageSquarePlus },
    { k: 'check', l: 'Check a ticket', icon: Ticket },
  ];
  return (
    <section id="help-desk" className="mt-16 scroll-mt-24 md:mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Help desk</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.035em] text-gray-900 md:text-[40px]">Get help with an order</h2>
          <p className="mt-2 max-w-[56ch] text-[15px] text-gray-500">Look up any Now, Eats or Book order by its number, raise a ticket, or check on one you've already sent.</p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_24px_60px_-40px_rgba(16,24,40,.35)]">
        <div role="tablist" className="flex overflow-x-auto border-b border-gray-100 [scrollbar-width:none]">
          {TABS.map(t => (
            <button key={t.k} role="tab" aria-selected={tab === t.k} type="button" onClick={() => setTab(t.k)}
              className={`relative inline-flex h-14 shrink-0 items-center gap-2 px-5 text-[14.5px] font-semibold transition md:px-7 ${tab === t.k ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
              <t.icon size={17} />{t.l}
              {tab === t.k && <span className="absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-emerald-500" />}
            </button>
          ))}
        </div>
        <div className="p-5 md:p-8">
          {tab === 'order' && <OrderLookup onRaise={() => setTab('raise')} />}
          {tab === 'raise' && <RaiseTicket />}
          {tab === 'check' && <CheckTicket />}
        </div>
      </div>
    </section>
  );
}

function OrderLookup({ onRaise }: { onRaise: () => void }) {
  const [id, setId] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [o, setO] = useState<Order | null>(null);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setO(null);
    const v = id.trim().toUpperCase();
    if (v.length < 6) return setErr('Enter the order number from your confirmation (it starts with ZNW, ZET or ZBK).');
    setBusy(true);
    try {
      const r = await fetch(`/api/orders/${encodeURIComponent(v)}`, { credentials: 'include' });
      if (r.status === 404) throw new Error('No order matches that number. If you are signed in on another account, sign in with the one you ordered from.');
      if (!r.ok) throw new Error('Something went wrong. Please try again.');
      setO(await r.json());
    } catch (e2) { setErr((e2 as Error).message); }
    setBusy(false);
  };
  return (
    <div>
      <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
        <input value={id} onChange={e => setId(e.target.value)} placeholder="Order number, e.g. ZNW…" aria-label="Order number" className={`${input} uppercase placeholder:normal-case`} />
        <button type="submit" disabled={busy} className={btn}>{busy ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />} Look up</button>
      </form>
      {err && <p className="mt-3 text-[13.5px] font-medium text-rose-600">{err}</p>}
      {o && (
        <div className="mt-6 rounded-2xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12.5px] font-semibold text-emerald-700">{product(o.id)}</p>
              <p className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-gray-900">{o.id}</p>
              <p className="text-[13px] text-gray-500">Placed {when(o.createdAt)}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12.5px] font-semibold text-emerald-800"><CheckCircle2 size={14} />{ORDER_STATUS[o.status] ?? o.status}</span>
          </div>
          <ul className="mt-4 divide-y divide-gray-100 text-[14px]">
            {o.items.map((it, i) => <li key={i} className="flex justify-between gap-3 py-2"><span className="text-gray-800">{it.qty ?? 1} × {it.name}</span>{it.note && <span className="text-gray-500">{it.note}</span>}</li>)}
          </ul>
          {o.total > 0 && <p className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-[15px] font-semibold"><span>Total</span><span>₹{o.total}</span></p>}
          <button type="button" onClick={onRaise} className="mt-5 text-[14px] font-semibold text-emerald-700 hover:text-emerald-800">Something wrong with this order? Raise a ticket →</button>
        </div>
      )}
    </div>
  );
}

function RaiseTicket() {
  const [f, setF] = useState({ topic: TOPICS[0], orderId: '', name: '', email: '', phone: '', message: '', website: '' });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [done, setDone] = useState('');
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const r = await post<{ id: string }>('/api/tickets', f); setDone(r.id); }
    catch (e2) { setErr((e2 as Error).message); }
    setBusy(false);
  };
  if (done) return (
    <div className="py-6 text-center">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={26} /></span>
      <p className="mt-4 text-[15px] text-gray-600">Your ticket number is</p>
      <p className="mt-1 text-[26px] font-semibold tracking-wide text-gray-900">{done}</p>
      <p className="mx-auto mt-3 max-w-[46ch] text-[14px] text-gray-500">We reply Monday to Saturday, 9 AM to 9 PM IST. Use this number and your email under "Check a ticket" to see our reply.</p>
    </div>
  );
  return (
    <form onSubmit={go} className="grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="mb-1.5 block text-[13px] font-semibold text-gray-700">What do you need help with?</span>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button key={t} type="button" onClick={() => setF({ ...f, topic: t })} aria-pressed={f.topic === t}
              className={`h-9 rounded-full border px-3.5 text-[13px] font-medium transition ${f.topic === t ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t}</button>
          ))}
        </div>
      </label>
      <input value={f.orderId} onChange={e => setF({ ...f, orderId: e.target.value.toUpperCase() })} placeholder="Order number (optional)" className={input} />
      <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Your name" autoComplete="name" className={input} />
      <input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} type="email" placeholder="Email (for our reply)" autoComplete="email" className={input} />
      <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} inputMode="numeric" placeholder="Mobile (optional)" autoComplete="tel-national" className={input} />
      <textarea value={f.message} onChange={e => setF({ ...f, message: e.target.value })} rows={4} placeholder="Tell us what happened" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:col-span-2" />
      <input value={f.website} onChange={e => setF({ ...f, website: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {err && <p className="text-[13.5px] font-medium text-rose-600 sm:col-span-2">{err}</p>}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className={btn}>{busy ? <Loader2 size={17} className="animate-spin" /> : <MessageSquarePlus size={17} />} Send ticket</button>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-500"><Clock size={14} />Replies Mon–Sat, 9 AM–9 PM IST</span>
      </div>
    </form>
  );
}

function CheckTicket() {
  const [id, setId] = useState(''); const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [t, setT] = useState<TicketInfo | null>(null);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setT(null);
    if (!id.trim() || !email.includes('@')) return setErr('Enter your ticket number and the email you used.');
    setBusy(true);
    try { setT(await post<TicketInfo>(`/api/tickets/${encodeURIComponent(id.trim().toUpperCase())}`, { email })); }
    catch (e2) { setErr((e2 as Error).message); }
    setBusy(false);
  };
  const s = t ? TICKET_STATUS[t.status] ?? { l: t.status, c: 'bg-gray-100 text-gray-700' } : null;
  return (
    <div>
      <form onSubmit={go} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input value={id} onChange={e => setId(e.target.value)} placeholder="Ticket number, e.g. ZTK…" aria-label="Ticket number" className={`${input} uppercase placeholder:normal-case`} />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" aria-label="Email" className={input} />
        <button type="submit" disabled={busy} className={btn}>{busy ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />} Check</button>
      </form>
      {err && <p className="mt-3 text-[13.5px] font-medium text-rose-600">{err}</p>}
      {t && s && (
        <div className="mt-6 rounded-2xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12.5px] font-semibold text-emerald-700">{t.topic}{t.orderId ? ` · ${t.orderId}` : ''}</p>
              <p className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-gray-900">{t.id}</p>
              <p className="text-[13px] text-gray-500">Raised {when(t.createdAt)} · updated {when(t.updatedAt)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${s.c}`}>{s.l}</span>
          </div>
          <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-[14px] leading-[1.6] text-gray-700">
            {t.reply ? <><p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">Our reply</p><p className="mt-1 whitespace-pre-wrap">{t.reply}</p></> : 'We have your ticket and will reply soon.'}
          </div>
        </div>
      )}
    </div>
  );
}
