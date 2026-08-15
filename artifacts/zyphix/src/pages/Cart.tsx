import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight, Clock, Tag, X, Wallet as WalletIcon, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePromo, maxWalletUsable } from '@/context/PromoContext';
import { findCoupon, evaluateCoupon, COUPONS } from '@/data/coupons';

const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

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
      <div style={{ background: '#F8F9FA', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🛒</div>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, color: '#111827', margin: '0 0 6px' }}>Your cart is empty</h1>
        <p style={{ color: '#6B7280', marginBottom: 22 }}>Fresh groceries are just a tap away.</p>
        <Link href="/now" style={{ background: G, color: '#fff', padding: '13px 24px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ShoppingCart size={16} /> Start Shopping
        </Link>
      </div>
    );
  }

  const visibleCoupons = showAll ? COUPONS : COUPONS.slice(0, 3);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 140 }}>
      <div style={{ padding: '18px 4px 8px' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>Your Cart</h1>
        <p style={{ color: '#6B7280', fontSize: 13, margin: '2px 0 0' }}>{totalItems} item{totalItems > 1 ? 's' : ''} · Delivery in ~30 min</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, padding: '8px 4px' }} className="cart-grid">
        <style>{`@media (max-width: 820px){ .cart-grid { grid-template-columns: 1fr !important; } .cart-sum { position: static !important; } }`}</style>

        <div>
          <AnimatePresence initial={false}>
            {items.map(i => (
              <motion.div key={i.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 12, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link href={`/now/product/${i.id}`} style={{ flexShrink: 0 }}>
                  <img src={i.image} alt={i.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid #EAEAEA' }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>{i.brand}</div>
                  <Link href={`/now/product/${i.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
                  </Link>
                  <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6 }}>{i.weight}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: G_LIGHT, border: `1.5px solid ${G_BORDER}`, borderRadius: 10 }}>
                      <button onClick={() => remove(i.id)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: G, cursor: 'pointer' }}><Minus size={13} /></button>
                      <span style={{ fontWeight: 900, color: G, minWidth: 20, textAlign: 'center', fontSize: 13 }}>{i.qty}</span>
                      <button onClick={() => add(i)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: G, cursor: 'pointer' }}><Plus size={13} /></button>
                    </div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827' }}>₹{i.price * i.qty}</div>
                  </div>
                </div>
                <button onClick={() => setQty(i.id, 0)} title="Remove"
                  style={{ width: 34, height: 34, background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Coupons panel */}
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 14, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Tag size={16} color={G} />
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', fontSize: 14 }}>Apply Coupon</div>
            </div>

            {activeCoupon && evalResult?.ok ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: G_LIGHT, border: `1.5px dashed ${G_BORDER}`, borderRadius: 10, padding: 10 }}>
                <div style={{ background: G, color: '#fff', fontWeight: 900, padding: '5px 9px', borderRadius: 7, fontSize: 12 }}>{activeCoupon.code}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: 13 }}>Coupon applied</div>
                  <div style={{ fontSize: 11.5, color: '#4B5563' }}>
                    You saved ₹{itemDiscount + (shippingWaived ? baseDelivery : 0)} on this order
                  </div>
                </div>
                <button onClick={() => applyCoupon(null)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={codeInput} onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(null); }}
                    onKeyDown={e => e.key === 'Enter' && tryApply(codeInput)}
                    placeholder="Enter coupon code"
                    style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${codeError ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 10, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', outline: 'none', background: '#F9FAFB' }} />
                  <button onClick={() => tryApply(codeInput)}
                    style={{ padding: '0 16px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>Apply</button>
                </div>
                {codeError && <div style={{ color: '#EF4444', fontSize: 11.5, marginTop: 5 }}>{codeError}</div>}

                <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                  {visibleCoupons.map(c => {
                    const ev = evaluateCoupon(c, subtotal, hasPreviousOrders);
                    return (
                      <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px dashed #E5E7EB', borderRadius: 10, padding: 10, background: ev.ok ? G_LIGHT : '#F9FAFB', opacity: ev.ok ? 1 : 0.75 }}>
                        <div style={{ background: ev.ok ? G : '#9CA3AF', color: '#fff', fontWeight: 900, padding: '5px 9px', borderRadius: 7, fontSize: 11.5 }}>{c.code}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, color: '#111827', fontSize: 12.5 }}>{c.title}</div>
                          <div style={{ fontSize: 11, color: ev.ok ? '#4B5563' : '#9CA3AF' }}>{ev.ok ? c.desc : (ev.reason || c.desc)}</div>
                        </div>
                        <button disabled={!ev.ok} onClick={() => tryApply(c.code)}
                          style={{ padding: '6px 12px', background: ev.ok ? '#fff' : '#F3F4F6', color: ev.ok ? G : '#9CA3AF', border: `1.5px solid ${ev.ok ? G_BORDER : '#E5E7EB'}`, borderRadius: 8, fontWeight: 800, cursor: ev.ok ? 'pointer' : 'not-allowed', fontSize: 11.5 }}>
                          Apply
                        </button>
                      </div>
                    );
                  })}
                </div>
                {COUPONS.length > 3 && (
                  <button onClick={() => setShowAll(s => !s)}
                    style={{ marginTop: 10, background: 'none', border: 'none', color: G, fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}>
                    {showAll ? 'Show fewer' : `View all ${COUPONS.length} coupons`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Wallet toggle */}
          {walletBalance > 0 && (
            <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 14, marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: G_LIGHT, color: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WalletIcon size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: '#111827', fontSize: 13.5 }}>Use Zyphix Wallet</div>
                <div style={{ fontSize: 11.5, color: '#6B7280' }}>
                  Balance: ₹{walletBalance} · Apply up to <strong>₹{walletCap}</strong> on this order
                </div>
              </div>
              <button onClick={() => setUseWalletAtCheckout(!useWalletAtCheckout)} disabled={walletCap === 0}
                style={{ position: 'relative', width: 46, height: 26, borderRadius: 999, background: useWalletAtCheckout ? G : '#D1D5DB', border: 'none', cursor: walletCap === 0 ? 'not-allowed' : 'pointer', opacity: walletCap === 0 ? 0.5 : 1, transition: 'background .18s' }}>
                <span style={{ position: 'absolute', top: 3, left: useWalletAtCheckout ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
              </button>
            </div>
          )}
        </div>

        <div className="cart-sum" style={{ position: 'sticky', top: 76, alignSelf: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 18 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 15, color: '#111827', marginBottom: 12 }}>Bill details</div>
            <Row label="Item total" value={`₹${subtotal}`} />
            {itemDiscount > 0 && <Row label={`Coupon (${activeCoupon?.code})`} value={`− ₹${itemDiscount}`} valueColor={G} />}
            <Row label="Delivery fee" value={deliveryFee === 0 ? (baseDelivery > 0 ? `FREE (was ₹${baseDelivery})` : 'FREE') : `₹${deliveryFee}`} valueColor={deliveryFee === 0 ? G : '#111827'} />
            {!shippingWaived && baseDelivery > 0 && (
              <div style={{ fontSize: 11.5, color: G, background: G_LIGHT, border: `1px solid ${G_BORDER}`, borderRadius: 8, padding: '6px 8px', margin: '4px 0 10px' }}>
                Add ₹{149 - subtotal} more for FREE delivery
              </div>
            )}
            {walletApplied > 0 && <Row label="Wallet applied" value={`− ₹${walletApplied}`} valueColor={G} />}
            <div style={{ borderTop: '1px dashed #E5E7EB', margin: '10px 0' }} />
            <Row label="Grand total" value={`₹${grand}`} bold />

            {(itemDiscount + (shippingWaived ? baseDelivery : 0) + walletApplied) > 0 && (
              <div style={{ marginTop: 10, background: G_LIGHT, color: G, border: `1px dashed ${G_BORDER}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 800, textAlign: 'center' }}>
                🎉 You save ₹{itemDiscount + (shippingWaived ? baseDelivery : 0) + walletApplied} on this order
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12, color: G, fontWeight: 700 }}>
              <Clock size={12} /> Delivery in ~30 min
            </div>
            <button onClick={() => navigate('/now/checkout')}
              style={{ width: '100%', marginTop: 14, padding: '14px', background: `linear-gradient(135deg, ${G}, #0A8C58)`, color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 6px 20px rgba(13,163,102,.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'Outfit',sans-serif" }}>
              <span>Proceed to Checkout</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>₹{grand} <ChevronRight size={16} /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: bold ? 15 : 13, color: bold ? '#111827' : '#6B7280', fontWeight: bold ? 900 : 500, fontFamily: bold ? "'Outfit',sans-serif" : undefined }}>
      <span>{label}</span><span style={{ color: valueColor || (bold ? '#111827' : '#111827'), fontWeight: bold ? 900 : 700 }}>{value}</span>
    </div>
  );
}
