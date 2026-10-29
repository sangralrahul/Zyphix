import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from '@/lib/motion';
import { X, Plus, Minus, Zap, ChevronRight, TicketPercent, Check, ShoppingBag, ReceiptText, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePromo } from '@/context/PromoContext';
import { COUPONS, findCoupon, evaluateCoupon } from '@/data/coupons';
import { num } from '@/lib/format';
import { G } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Quick-commerce cart drawer for Zyphix Now: slides in from the right with the
   items, a coupon, the bill and a single "Proceed" button. Open it from anywhere
   with openCart(); the floating cart bar and the header cart icon do.
──────────────────────────────────────────────────────────────────────────── */

import { CART_OPEN_EVENT as OPEN_EVENT } from '@/lib/cartEvents';
export { openCart } from '@/lib/cartEvents';

export const FREE_DELIVERY_AT = 149;
export const DELIVERY_FEE = 25;

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { items, add, remove, subtotal, totalItems } = useCart();
  const { appliedCoupon, applyCoupon, hasPreviousOrders } = usePromo();
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, on);
    return () => window.removeEventListener(OPEN_EVENT, on);
  }, []);
  // Esc closes; the page behind doesn't scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', key);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = prev; };
  }, [open]);

  const mrpTotal = useMemo(() => items.reduce((s, i) => s + (i.origPrice && i.origPrice > i.price ? i.origPrice : i.price) * i.qty, 0), [items]);
  const coupon = appliedCoupon ? findCoupon(appliedCoupon) : null;
  const ev = coupon ? evaluateCoupon(coupon, subtotal, hasPreviousOrders) : null;
  useEffect(() => { if (coupon && ev && !ev.ok) applyCoupon(null); }, [coupon, ev, applyCoupon]);
  const couponOff = ev?.ok ? ev.itemDiscount : 0;
  const baseDelivery = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  const delivery = ev?.ok && ev.shippingWaived ? 0 : baseDelivery;
  const total = Math.max(0, subtotal - couponOff + delivery);
  const saved = (mrpTotal - subtotal) + couponOff + (baseDelivery - delivery);
  const toFree = Math.max(0, FREE_DELIVERY_AT - subtotal);

  const tryCoupon = (code: string) => {
    const c = findCoupon(code); if (!c) return;
    const r = evaluateCoupon(c, subtotal, hasPreviousOrders);
    if (!r.ok) { setCouponMsg(r.reason || 'Not applicable on this cart'); return; }
    applyCoupon(c.code); setCouponMsg(''); setShowCoupons(false);
  };

  const proceed = () => { setOpen(false); navigate('/now/checkout'); };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Your cart">
          <motion.div className="absolute inset-0 bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-[#F4F5F7] shadow-[-20px_0_60px_-20px_rgba(0,0,0,.4)]"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
            <header className="flex h-16 shrink-0 items-center justify-between bg-white px-4">
              <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">My Cart</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"><X size={20} /></button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm"><ShoppingBag size={26} /></span>
                <p className="mt-4 text-[16px] font-bold">Your cart is empty</p>
                <p className="mt-1 text-[13.5px] text-gray-500">Add a few things and they'll be at your door in about 10 minutes.</p>
                <button type="button" onClick={() => setOpen(false)} className="mt-5 h-11 rounded-xl px-6 text-[14px] font-bold text-white" style={{ background: G }}>Start shopping</button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-3">
                  {/* delivery promise + items */}
                  <section className="rounded-2xl bg-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#0B8A57]"><Zap size={18} className="fill-current" /></span>
                      <div>
                        <p className="text-[15px] font-extrabold tracking-[-0.01em]">Delivery in 10 minutes</p>
                        <p className="text-[12.5px] text-gray-500">Shipment of {totalItems} item{totalItems > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {toFree > 0 && (
                      <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] font-medium text-amber-800">
                        Add items worth <b>₹{num(toFree)}</b> more for free delivery
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100)}%` }} /></div>
                      </div>
                    )}
                    <ul className="mt-3 divide-y divide-gray-100">
                      {items.map(i => (
                        <li key={i.id} className="flex items-center gap-3 py-3">
                          <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F4F5F7]"><img src={i.image} alt="" loading="lazy" className="h-full w-full object-contain p-1.5 mix-blend-multiply" /></span>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-[13px] font-semibold leading-snug">{i.name}</p>
                            {i.weight && <p className="text-[12px] text-gray-500">{i.weight}</p>}
                            <p className="mt-0.5 text-[13px] font-extrabold">₹{num(i.price * i.qty)}{i.origPrice && i.origPrice > i.price && <span className="ml-1.5 text-[11.5px] font-medium text-gray-400 line-through">₹{num(i.origPrice * i.qty)}</span>}</p>
                          </div>
                          <div className="flex h-8 shrink-0 items-center overflow-hidden rounded-[10px] text-white" style={{ background: G }}>
                            <button type="button" onClick={() => remove(i.id)} aria-label={`Remove one ${i.name}`} className="flex h-full w-8 items-center justify-center hover:bg-black/10"><Minus size={13} strokeWidth={3} /></button>
                            <span className="min-w-[18px] text-center text-[13px] font-bold tabular-nums">{i.qty}</span>
                            <button type="button" onClick={() => add(i)} aria-label={`Add one more ${i.name}`} className="flex h-full w-8 items-center justify-center hover:bg-black/10"><Plus size={13} strokeWidth={3} /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* coupon */}
                  <section className="rounded-2xl bg-white">
                    <button type="button" onClick={() => setShowCoupons(v => !v)} className="flex w-full items-center gap-3 p-4 text-left">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><TicketPercent size={18} /></span>
                      <div className="min-w-0 flex-1">
                        {coupon && ev?.ok
                          ? <><p className="text-[14px] font-bold">{coupon.code} applied</p><p className="text-[12.5px] font-semibold text-[#0B8A57]">You save ₹{num(couponOff || (baseDelivery - delivery))}</p></>
                          : <><p className="text-[14px] font-bold">Apply coupon</p><p className="text-[12.5px] text-gray-500">{COUPONS.length} offers available</p></>}
                      </div>
                      {coupon && ev?.ok
                        ? <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); applyCoupon(null); }} className="text-[13px] font-bold text-rose-600">Remove</span>
                        : <ChevronRight size={18} className={`text-gray-400 transition ${showCoupons ? 'rotate-90' : ''}`} />}
                    </button>
                    {showCoupons && (
                      <div className="border-t border-gray-100 p-3">
                        {couponMsg && <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">{couponMsg}</p>}
                        <ul className="space-y-2">
                          {COUPONS.map(c => {
                            const r = evaluateCoupon(c, subtotal, hasPreviousOrders);
                            return (
                              <li key={c.code} className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[12.5px] font-extrabold tracking-wide">{c.code}</p>
                                  <p className="text-[12px] text-gray-500">{r.ok ? c.desc : r.reason}</p>
                                </div>
                                <button type="button" disabled={!r.ok} onClick={() => tryCoupon(c.code)} className="shrink-0 text-[13px] font-bold text-[#0B8A57] disabled:text-gray-300">{appliedCoupon === c.code ? <Check size={16} /> : 'Apply'}</button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </section>

                  {/* bill */}
                  <section className="rounded-2xl bg-white p-4">
                    <p className="flex items-center gap-2 text-[15px] font-extrabold"><ReceiptText size={16} /> Bill details</p>
                    <dl className="mt-3 space-y-2 text-[13.5px]">
                      <div className="flex justify-between"><dt className="text-gray-600">Items total</dt><dd>{mrpTotal > subtotal && <span className="mr-1.5 text-gray-400 line-through">₹{num(mrpTotal)}</span>}<b>₹{num(subtotal)}</b></dd></div>
                      {couponOff > 0 && <div className="flex justify-between"><dt className="text-gray-600">Coupon ({coupon?.code})</dt><dd className="font-bold text-[#0B8A57]">− ₹{num(couponOff)}</dd></div>}
                      <div className="flex justify-between"><dt className="text-gray-600">Delivery charge</dt><dd>{delivery === 0 ? <><span className="mr-1.5 text-gray-400 line-through">₹{DELIVERY_FEE}</span><b className="text-[#0B8A57]">FREE</b></> : <b>₹{delivery}</b>}</dd></div>
                      <div className="flex justify-between border-t border-dashed border-gray-200 pt-2.5 text-[15px]"><dt className="font-extrabold">Grand total</dt><dd className="font-extrabold">₹{num(total)}</dd></div>
                    </dl>
                    {saved > 0 && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-[12.5px] font-bold text-[#0B8A57]">You're saving ₹{num(saved)} on this order</p>}
                  </section>

                  <section className="flex gap-3 rounded-2xl bg-white p-4 text-[12px] leading-relaxed text-gray-500">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gray-400" />
                    <p><b className="text-gray-700">Cancellation policy:</b> orders can't be cancelled once packed. If something is missing or damaged, we refund it from the order page.</p>
                  </section>
                </div>

                <footer className="shrink-0 bg-white p-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.15)]">
                  <button type="button" onClick={proceed} className="flex h-14 w-full items-center justify-between rounded-2xl px-4 text-white transition active:scale-[.99]" style={{ background: G }}>
                    <span className="text-left leading-tight"><span className="block text-[15px] font-extrabold">₹{num(total)}</span><span className="block text-[11px] font-semibold uppercase tracking-wide text-white/80">Total</span></span>
                    <span className="flex items-center gap-1 text-[15.5px] font-extrabold">Proceed <ChevronRight size={18} /></span>
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
