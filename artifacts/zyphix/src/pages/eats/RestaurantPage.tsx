import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Minus, Plus, ShoppingBag, X, Check, Leaf, MapPin, Clock } from 'lucide-react';
import { sendRequest, OFFLINE_MSG } from '@/lib/requests';
import { OrderRequestForm } from '@/components/RequestForms';
import { pexelsPhoto } from '@/data/media';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Eats restaurant page: a live restaurant partner with its menu (from
   /api/restaurants/:id, managed in admin). Veg filter, sections, a cart and a
   checkout that saves the order (status "requested"; the kitchen confirms by
   phone). With no menu yet, the "order by request" form is shown instead.
──────────────────────────────────────────────────────────────────────────── */

type MenuItem = { id: string; name: string; description: string; price: number; veg: boolean; section: string; image: string };
type Detail = { id: string; name: string; city: string; locality: string; type: string; cuisines: string; menu: MenuItem[] };

const ORANGE = '#E2562B';
const cover = (seed: string) => [12737656, 9609844, 5560763, 2147491, 5409010, 2347311][Math.abs([...seed].reduce((a, c) => a + c.charCodeAt(0), 0)) % 6];

function VegMark({ veg }: { veg: boolean }) {
  return (
    <span aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'} className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] ${veg ? 'border-emerald-600' : 'border-rose-600'}`}>
      <span className={`h-2 w-2 rounded-full ${veg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
    </span>
  );
}

export function RestaurantPage({ partnerId, fallbackName, onBack }: { partnerId: string; fallbackName: string; onBack: () => void }) {
  const [data, setData] = useState<Detail | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    let alive = true;
    setState('loading');
    fetch(`/api/restaurants/${encodeURIComponent(partnerId)}`, { headers: { accept: 'application/json' } })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Detail) => { if (alive) { setData(d); setState('ready'); } })
      .catch(() => { if (alive) setState('error'); });
    window.scrollTo({ top: 0 });
    return () => { alive = false; };
  }, [partnerId]);

  const menu = data?.menu ?? [];
  const shown = vegOnly ? menu.filter(m => m.veg) : menu;
  const sections = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const m of shown) { if (!map.has(m.section)) map.set(m.section, []); map.get(m.section)!.push(m); }
    return [...map.entries()];
  }, [shown]);
  const lines = menu.filter(m => cart[m.id]);
  const count = lines.reduce((a, m) => a + cart[m.id], 0);
  const total = lines.reduce((a, m) => a + cart[m.id] * m.price, 0);
  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const sub = (id: string) => setCart(c => { const n = { ...c }; if ((n[id] || 0) > 1) n[id]--; else delete n[id]; return n; });

  const name = data?.name || fallbackName;
  const place = [data?.locality, data?.city].filter(Boolean).join(', ');

  return (
    <div className="pt-4 md:pt-2">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-gray-600 transition hover:text-gray-900">
        <ChevronLeft size={16} /> All restaurants
      </button>

      {/* header */}
      <section className="mt-3 overflow-hidden rounded-[24px] border border-gray-200 bg-white">
        <div className="relative h-[150px] bg-gray-100 md:h-[200px]">
          <img src={pexelsPhoto(cover(partnerId), 1280)} alt="" className="h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 p-5 md:p-6">
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-gray-900 md:text-[32px]">{name}</h1>
            <p className="mt-1 text-[14px] text-gray-500">{[data?.type, data?.cuisines].filter(Boolean).join(' · ') || 'Neighbourhood kitchen'}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[12.5px] font-semibold text-gray-700">
              {place && <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"><MapPin size={13} />{place}</span>}
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"><Clock size={13} />Cooked to order</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">New on Zyphix</span>
            </div>
          </div>
          {menu.length > 0 && (
            <button type="button" onClick={() => setVegOnly(v => !v)} aria-pressed={vegOnly}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-bold transition ${vegOnly ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
              <Leaf size={15} /> Veg only
            </button>
          )}
        </div>
      </section>

      {/* menu */}
      {state === 'loading' && (
        <div className="mt-6 space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-gray-200" />)}</div>
      )}

      {state !== 'loading' && menu.length === 0 && (
        <section className="mt-6 rounded-[24px] border border-gray-200 bg-white p-5 md:p-7">
          <p className="text-[18px] font-bold text-gray-900">Order by request</p>
          <p className="mb-4 mt-1 text-[14px] text-gray-500">{name} is setting up its full menu on Zyphix. Tell us what you'd like and we'll call you to confirm it with the kitchen.</p>
          <OrderRequestForm restaurant={name} />
        </section>
      )}

      {menu.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-8">
            {sections.map(([sec, items]) => (
              <section key={sec}>
                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-gray-900">{sec} <span className="text-[13px] font-semibold text-gray-400">({items.length})</span></h2>
                <ul className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-[20px] border border-gray-200 bg-white">
                  {items.map(m => (
                    <li key={m.id} className="flex gap-4 p-4 md:p-5">
                      <div className="min-w-0 flex-1">
                        <VegMark veg={m.veg} />
                        <p className="mt-1.5 text-[15.5px] font-bold text-gray-900">{m.name}</p>
                        <p className="mt-0.5 text-[14px] font-semibold text-gray-800">₹{m.price}</p>
                        {m.description && <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-gray-500">{m.description}</p>}
                      </div>
                      <div className="relative w-[118px] shrink-0">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                          {m.image ? <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-[26px] font-bold text-gray-300">{m.name.charAt(0)}</div>}
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                          {cart[m.id] ? (
                            <div className="inline-flex h-9 items-center overflow-hidden rounded-xl bg-white text-[14px] font-bold shadow-[0_6px_16px_-6px_rgba(0,0,0,.3)] ring-1 ring-gray-200" style={{ color: ORANGE }}>
                              <button type="button" onClick={() => sub(m.id)} aria-label={`Remove one ${m.name}`} className="inline-flex h-9 w-9 items-center justify-center"><Minus size={15} strokeWidth={2.6} /></button>
                              <span className="min-w-[20px] text-center">{cart[m.id]}</span>
                              <button type="button" onClick={() => add(m.id)} aria-label={`Add one ${m.name}`} className="inline-flex h-9 w-9 items-center justify-center"><Plus size={15} strokeWidth={2.6} /></button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => add(m.id)} className="inline-flex h-9 w-[92px] items-center justify-center rounded-xl bg-white text-[14px] font-extrabold shadow-[0_6px_16px_-6px_rgba(0,0,0,.3)] ring-1 ring-gray-200 transition hover:bg-orange-50" style={{ color: ORANGE }}>ADD</button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {sections.length === 0 && <p className="rounded-2xl bg-white p-6 text-[14px] text-gray-500 ring-1 ring-gray-200">No vegetarian dishes on this menu yet.</p>}
          </div>

          {/* cart (desktop) */}
          <aside className="hidden rounded-[22px] border border-gray-200 bg-white p-5 lg:sticky lg:top-24 lg:block">
            <CartSummary lines={lines} cart={cart} total={total} add={add} sub={sub} onCheckout={() => setCheckout(true)} />
          </aside>
        </div>
      )}

      {/* cart bar (phones) */}
      {count > 0 && !checkout && (
        <div className="fixed bottom-[76px] left-3 right-3 z-[90] mx-auto max-w-[480px] lg:hidden">
          <button type="button" onClick={() => setCheckout(true)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,.45)]" style={{ background: ORANGE }}>
            <span className="flex items-center gap-2 text-[14px] font-bold"><ShoppingBag size={16} />{count} item{count > 1 ? 's' : ''} · ₹{total}</span>
            <span className="text-[14px] font-extrabold">Checkout</span>
          </button>
        </div>
      )}

      {checkout && <Checkout restaurant={name} lines={lines} cart={cart} total={total} onClose={() => setCheckout(false)} onDone={() => setCart({})} />}
    </div>
  );
}

function CartSummary({ lines, cart, total, add, sub, onCheckout }: { lines: MenuItem[]; cart: Record<string, number>; total: number; add: (id: string) => void; sub: (id: string) => void; onCheckout: () => void }) {
  if (!lines.length) return (
    <div className="py-6 text-center">
      <ShoppingBag size={28} className="mx-auto text-gray-300" />
      <p className="mt-3 text-[15px] font-bold text-gray-900">Your cart is empty</p>
      <p className="mt-1 text-[13px] text-gray-500">Add dishes from the menu to place an order.</p>
    </div>
  );
  return (
    <>
      <p className="text-[16px] font-extrabold text-gray-900">Your order</p>
      <ul className="mt-3 space-y-3">
        {lines.map(m => (
          <li key={m.id} className="flex items-center gap-3 text-[13.5px]">
            <VegMark veg={m.veg} />
            <span className="min-w-0 flex-1 truncate font-semibold text-gray-800">{m.name}</span>
            <span className="inline-flex h-7 items-center rounded-lg ring-1 ring-gray-200" style={{ color: ORANGE }}>
              <button type="button" onClick={() => sub(m.id)} aria-label="Remove one" className="px-1.5"><Minus size={13} /></button>
              <span className="min-w-[16px] text-center font-bold">{cart[m.id]}</span>
              <button type="button" onClick={() => add(m.id)} aria-label="Add one" className="px-1.5"><Plus size={13} /></button>
            </span>
            <span className="w-14 text-right font-semibold text-gray-900">₹{cart[m.id] * m.price}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-[15px] font-extrabold text-gray-900"><span>Item total</span><span>₹{total}</span></div>
      <p className="mt-1 text-[12px] text-gray-500">Delivery fee and taxes are confirmed by phone with the kitchen.</p>
      <button type="button" onClick={onCheckout} className="mt-4 h-12 w-full rounded-2xl text-[15px] font-extrabold text-white" style={{ background: ORANGE }}>Checkout</button>
    </>
  );
}

function Checkout({ restaurant, lines, cart, total, onClose, onDone }: { restaurant: string; lines: MenuItem[]; cart: Record<string, number>; total: number; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [address, setAddress] = useState(''); const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [orderId, setOrderId] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Add your name.');
    if (!/^\d{10}$/.test(phone)) return setErr('Enter a 10-digit mobile number.');
    if (address.trim().length < 6) return setErr('Add your delivery address.');
    setBusy(true); setErr('');
    try {
      const id = await sendRequest('eats', { name, phone, address, notes }, lines.map(m => ({ name: m.name, qty: cart[m.id], note: `₹${m.price} each` })), { restaurant, itemTotal: `₹${total}` });
      setOrderId(id); onDone();
    } catch { setErr(OFFLINE_MSG); }
    setBusy(false);
  };
  const input = 'h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100';
  return (
    <div role="dialog" aria-modal="true" aria-label="Checkout" className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] bg-white p-6 sm:rounded-[28px]" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: ORANGE }}>{restaurant}</p>
            <p className="mt-1 text-[20px] font-extrabold tracking-[-0.02em] text-gray-900">{orderId ? 'Order placed' : 'Checkout'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"><X size={16} /></button>
        </div>
        {orderId ? (
          <div className="mt-5 text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={26} strokeWidth={2.6} /></span>
            <p className="mt-4 text-[15px] text-gray-700">Your order number is</p>
            <p className="mt-1 text-[24px] font-extrabold tracking-wide text-gray-900">{orderId}</p>
            <p className="mx-auto mt-3 max-w-[34ch] text-[13.5px] leading-[1.55] text-gray-500">The kitchen will call you to confirm the order, delivery fee and time. Keep this number to check on it at support.zyphix.in.</p>
            <button type="button" onClick={onClose} className="mt-6 h-12 w-full rounded-2xl text-[15px] font-extrabold text-white" style={{ background: ORANGE }}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4 text-[13.5px]">
              {lines.map(m => <div key={m.id} className="flex justify-between py-0.5"><span className="text-gray-700">{cart[m.id]} × {m.name}</span><span className="font-semibold">₹{cart[m.id] * m.price}</span></div>)}
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-extrabold"><span>Item total</span><span>₹{total}</span></div>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" className={input} />
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white pl-4 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
              <span className="text-[15px] font-semibold text-gray-500">+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Mobile number" autoComplete="tel-national" className="h-12 min-w-0 flex-1 bg-transparent pr-4 text-[15px] outline-none" />
            </div>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="Delivery address (house, street, area)" autoComplete="street-address" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Cooking notes (optional)" className={input} />
            {err && <p className="text-[13px] font-semibold text-rose-600">{err}</p>}
            <button type="submit" disabled={busy} className="h-12 w-full rounded-2xl text-[15px] font-extrabold text-white disabled:opacity-60" style={{ background: ORANGE }}>{busy ? 'Placing order…' : `Place order · ₹${total}`}</button>
            <p className="text-center text-[12px] text-gray-500">Pay on delivery. Nothing is charged now.</p>
          </form>
        )}
      </div>
    </div>
  );
}
