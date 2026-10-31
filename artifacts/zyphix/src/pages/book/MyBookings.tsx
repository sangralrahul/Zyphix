import React, { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, Loader2, Search } from 'lucide-react';

/* "My bookings" on book.zyphix.in: bookings made on this device (saved locally) plus a lookup by booking number. */
type Booking = { id: string; createdAt: string; status: string; items: { name?: string; note?: string }[]; address?: Record<string, string> };
const KEY = 'zx-bookings';
const STATUS: Record<string, string> = { requested: 'Confirming by phone', confirmed: 'Confirmed', assigned: 'Pro assigned', completed: 'Completed', cancelled: 'Cancelled' };

export function rememberBooking(id: string) {
  try { const list: string[] = JSON.parse(localStorage.getItem(KEY) || '[]'); localStorage.setItem(KEY, JSON.stringify([id, ...list.filter(x => x !== id)].slice(0, 10))); } catch { /* storage blocked */ }
}
const stored = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
async function fetchBooking(id: string): Promise<Booking | null> {
  const r = await fetch(`/api/orders/${encodeURIComponent(id)}`, { credentials: 'include' });
  return r.ok ? r.json() : null;
}

export function MyBookings({ refresh = 0 }: { refresh?: number }) {
  const [rows, setRows] = useState<Booking[]>([]);
  const [q, setQ] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  useEffect(() => {
    let alive = true;
    Promise.all(stored().map(id => fetchBooking(id).catch(() => null))).then(list => { if (alive) setRows(list.filter((b): b is Booking => !!b)); });
    return () => { alive = false; };
  }, [refresh]);
  const lookup = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    const id = q.trim().toUpperCase();
    if (!id.startsWith('ZBK')) return setErr('Booking numbers start with ZBK.');
    setBusy(true);
    const b = await fetchBooking(id).catch(() => null);
    setBusy(false);
    if (!b) return setErr('No booking matches that number.');
    rememberBooking(b.id); setRows(r => [b, ...r.filter(x => x.id !== b.id)]); setQ('');
  };
  return (
    <section id="my-bookings" className="mt-14 scroll-mt-24 md:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-gray-900 md:text-[28px]">My bookings</h2>
          <p className="mt-1 text-[14px] text-gray-500 md:text-[15px]">Bookings made on this device, or look one up by its number.</p>
        </div>
        <form onSubmit={lookup} className="flex w-full gap-2 sm:w-auto">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Booking number (ZBK…)" aria-label="Booking number"
            className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3.5 text-[14px] uppercase outline-none placeholder:normal-case focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-[220px]" />
          <button type="submit" disabled={busy} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-[14px] font-semibold text-white disabled:opacity-60">{busy ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} Find</button>
        </form>
      </div>
      {err && <p className="mt-3 text-[13.5px] font-medium text-rose-600">{err}</p>}
      {rows.length === 0 ? (
        <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-dashed border-gray-300 bg-white p-6">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><CalendarClock size={20} /></span>
          <p className="text-[14px] text-gray-500">No bookings yet. Pick a service above and your bookings will show here with their status.</p>
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map(b => (
            <li key={b.id} className="rounded-[22px] border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-gray-900">{b.items[0]?.name ?? 'Booking'}</p>
                  <p className="text-[13px] text-gray-500">{b.items[0]?.note || b.address?.slot || ''}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-800"><CheckCircle2 size={13} />{STATUS[b.status] ?? b.status}</span>
              </div>
              <p className="mt-3 text-[12.5px] text-gray-400">{b.id} · booked {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
