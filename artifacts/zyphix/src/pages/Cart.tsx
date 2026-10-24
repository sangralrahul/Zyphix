import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ChevronRight, Clock, Tag, X, Wallet as WalletIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePromo, maxWalletUsable } from '@/context/PromoContext';
import { findCoupon, evaluateCoupon, COUPONS } from '@/data/coupons';
import { Button, FONT, G } from '@/ui/kit';

const card = 'rounded-xl border border-gray-200 bg-white';

export function Cart() {
  const { items, add, remove, setQty, subtotal, totalItems } = useCart();
  const { appliedCoupon, applyCoupon, walletBalance, useWalletAtCheckout, setUseWalletAtCheckout, hasPreviousOrders } = usePromo();
  const [, navigate] = useLocation();

  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const baseDelivery = subtotal === 0 ? 0 : subtotal >= 149 ? 0 : 25;

  const activeCoupon = appliedCoupon ? findCoupon(appliedCoupon) : null;
  const evalResult = useMemo(() => {
    if (!activeCoupon) return null;
    return evaluateCoupon(activeCoupon, subtotal, hasPreviousOrders);
  }, [activeCoupon, subtotal, hasPreviousOrders]);

  // Auto-remove coupon if it becomes invalid
  React.useEffect(() => {
    if (activeCoupon && evalResult && !evalResult.ok) applyCoupon(null);
  }, [activeCoupon, evalResult, applyCoupon]);

  const itemDiscount = evalResult?.itemDiscount ?? 0;
  const shippingWaived = evalResult?.shippingWaived ?? false;
  const deliveryFee = shippingWaived ? 0 : baseDelivery;

  const beforeWallet = Math.max(0, subtotal - itemDiscount + deliveryFee);
  const walletCap = maxWalletUsable(beforeWallet, walletBalance);
  const walletApplied = useWalletAtCheckout ? walletCap : 0;
  const grand = Math.max(0, beforeWallet - walletApplied);
  const totalSavings = itemDiscount + (shippingWaived ? baseDelivery : 0) + walletApplied;

  const tryApply = (raw: string) => {
    setCodeError(null);
    const c = findCoupon(raw);
    if (!c) { setCodeError('Invalid coupon code'); return; }
    const ev = evaluateCoupon(c, subtotal, hasPreviousOrders);
    if (!ev.ok) { setCodeError(ev.reason || 'Coupon not applicable'); return; }
    applyCoupon(c.code);
    setCodeInput('');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
        <div className={`${card} px-6 py-14 text-center`}>
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Your cart is empty</h1>
          <p className="mt-1 text-[13px] text-gray-500">Groceries delivered in 30 minutes.</p>
          <div className="mt-4"><Button href="/now" size="sm">Start shopping</Button></div>
        </div>
      </div>
    );
  }

  const visibleCoupons = showAll ? COUPONS : COUPONS.slice(0, 3);
  const codeChip = (code: string, ok = true) => (
    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11.5px] font-semibold tracking-wide ${ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>{code}</span>
  );

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900" style={{ fontFamily: FONT }}>
      <div className="flex items-baseline gap-3">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Cart</h1>
        <p className="text-[13px] text-gray-500">{totalItems} item{totalItems > 1 ? 's' : ''} · Delivery in 30 min</p>
      </div>

      <div className="mt-4 grid items-start gap-4 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className={`${card} divide-y divide-gray-100`}>
            <AnimatePresence initial={false}>
              {items.map(i => (
                <motion.div key={i.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                  className="flex items-center gap-3 p-3">
                  <Link href={`/now/product/${i.id}`} className="shrink-0">
                    <img src={i.image} alt={i.name} className="h-16 w-16 rounded-lg border border-gray-200 bg-white object-contain p-1" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/now/product/${i.id}`} className="block truncate text-[13.5px] font-medium text-gray-900 no-underline">{i.name}</Link>
                    <p className="mt-0.5 text-[12px] text-gray-500">{[i.brand, i.weight].filter(Boolean).join(' · ')}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex h-7 items-center overflow-hidden rounded-full text-white" style={{ background: G }}>
                        <button type="button" onClick={() => remove(i.id)} aria-label="Remove one" className="flex h-full w-7 items-center justify-center transition hover:bg-black/10"><Minus size={12} strokeWidth={2.5} /></button>
                        <span className="min-w-[18px] text-center text-[12.5px] font-semibold tabular-nums">{i.qty}</span>
                        <button type="button" onClick={() => add(i)} aria-label="Add one" className="flex h-full w-7 items-center justify-center transition hover:bg-black/10"><Plus size={12} strokeWidth={2.5} /></button>
                      </div>
                      <span className="text-[14px] font-semibold">₹{i.price * i.qty}</span>
                      {i.origPrice && i.origPrice > i.price && <span className="text-[12px] text-gray-400 line-through">₹{i.origPrice * i.qty}</span>}
                    </div>
                  </div>
                  <button type="button" onClick={() => setQty(i.id, 0)} title="Remove" aria-label="Remove item"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Coupons */}
          <div className={`${card} p-4`}>
            <div className="flex items-center gap-2 text-[14px] font-semibold"><Tag size={14} className="text-emerald-700" /> Coupons</div>

            {activeCoupon && evalResult?.ok ? (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                {codeChip(activeCoupon.code)}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">Coupon applied</p>
                  <p className="text-[12px] text-gray-600">You save ₹{itemDiscount + (shippingWaived ? baseDelivery : 0)} on this order</p>
                </div>
                <button type="button" onClick={() => applyCoupon(null)} aria-label="Remove coupon"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-gray-900">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="mt-3 flex gap-2">
                  <input value={codeInput} onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(null); }}
                    onKeyDown={e => e.key === 'Enter' && tryApply(codeInput)}
                    placeholder="Enter coupon code" aria-label="Coupon code"
                    className={`h-9 min-w-0 flex-1 rounded-lg border bg-white px-3 text-[13px] uppercase tracking-wide outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:border-emerald-500 ${codeError ? 'border-red-300' : 'border-gray-200'}`} />
                  <Button size="sm" variant="secondary" onClick={() => tryApply(codeInput)}>Apply</Button>
                </div>
                {codeError && <p className="mt-1.5 text-[12px] text-red-600">{codeError}</p>}

                <div className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-200">
                  {visibleCoupons.map(c => {
                    const ev = evaluateCoupon(c, subtotal, hasPreviousOrders);
                    return (
                      <div key={c.code} className={`flex items-center gap-3 px-3 py-2.5 ${ev.ok ? '' : 'opacity-70'}`}>
                        {codeChip(c.code, ev.ok)}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{c.title}</p>
                          <p className="truncate text-[12px] text-gray-500">{ev.ok ? c.desc : (ev.reason || c.desc)}</p>
                        </div>
                        <button type="button" disabled={!ev.ok} onClick={() => tryApply(c.code)}
                          className="shrink-0 text-[13px] font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-gray-400">
                          Apply
                        </button>
                      </div>
                    );
                  })}
                </div>
                {COUPONS.length > 3 && (
                  <button type="button" onClick={() => setShowAll(v => !v)} className="mt-2.5 text-[13px] font-semibold text-emerald-700 hover:text-emerald-800">
                    {showAll ? 'Show fewer' : `View all ${COUPONS.length} coupons`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Wallet toggle */}
          {walletBalance > 0 && (
            <div className={`${card} flex items-center gap-3 p-4`}>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700"><WalletIcon size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">Use Zyphix Wallet</p>
                <p className="text-[12px] text-gray-500">Balance ₹{walletBalance} · up to ₹{walletCap} on this order</p>
              </div>
              <button type="button" role="switch" aria-checked={useWalletAtCheckout} onClick={() => setUseWalletAtCheckout(!useWalletAtCheckout)} disabled={walletCap === 0}
                className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${useWalletAtCheckout ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${useWalletAtCheckout ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          )}
        </div>

        {/* Bill */}
        <div className={`${card} p-4 md:sticky md:top-[80px]`}>
          <p className="text-[14px] font-semibold">Bill details</p>
          <div className="mt-2">
            <Row label="Item total" value={`₹${subtotal}`} />
            {itemDiscount > 0 && <Row label={`Coupon (${activeCoupon?.code})`} value={`− ₹${itemDiscount}`} green />}
            <Row label="Delivery fee" value={deliveryFee === 0 ? (baseDelivery > 0 ? `Free (was ₹${baseDelivery})` : 'Free') : `₹${deliveryFee}`} green={deliveryFee === 0} />
            {walletApplied > 0 && <Row label="Wallet" value={`− ₹${walletApplied}`} green />}
          </div>
          {!shippingWaived && baseDelivery > 0 && (
            <p className="mt-1 rounded-md bg-[#FAFAFA] px-2.5 py-1.5 text-[12px] text-gray-600">Add ₹{149 - subtotal} more for free delivery</p>
          )}
          <div className="my-3 border-t border-gray-200" />
          <div className="flex items-center justify-between text-[15px] font-semibold">
            <span>To pay</span><span>₹{grand}</span>
          </div>
          {totalSavings > 0 && <p className="mt-1 text-[12.5px] font-medium text-emerald-700">You save ₹{totalSavings} on this order</p>}
          <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-gray-500"><Clock size={12} /> Delivery in 30 min</p>
          <Button onClick={() => navigate('/now/checkout')} className="mt-3 w-full justify-between">
            <span>Proceed to checkout</span><span className="inline-flex items-center gap-1">₹{grand} <ChevronRight size={15} /></span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between py-1 text-[13px]">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${green ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}
