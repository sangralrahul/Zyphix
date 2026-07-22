import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, MapPin, Wallet, CreditCard, Check } from 'lucide-react';
import { useCart, saveOrder, type Order } from '@/context/CartContext';
import { usePromo, maxWalletUsable, cashbackFor } from '@/context/PromoContext';
import { findCoupon, evaluateCoupon } from '@/data/coupons';

const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

export function Checkout() {
  const { items, subtotal, clear } = useCart();
  const {
    appliedCoupon, applyCoupon,
    walletBalance, useWalletAtCheckout, setUseWalletAtCheckout,
    debitWallet, creditWallet,
    hasPreviousOrders, recordOrderPlaced,
  } = usePromo();
  const [, navigate] = useLocation();

  const [name, setName] = useState(() => { try { return JSON.parse(localStorage.getItem('zyphix_user') || 'null')?.name || ''; } catch { return ''; } });
  const [phone, setPhone] = useState(() => { try { return JSON.parse(localStorage.getItem('zyphix_user') || 'null')?.phone || ''; } catch { return ''; } });
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<'COD' | 'ONLINE'>('COD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const baseDelivery = subtotal === 0 ? 0 : subtotal >= 149 ? 0 : 25;

  const activeCoupon = appliedCoupon ? findCoupon(appliedCoupon) : null;
  const evalResult = useMemo(() => activeCoupon ? evaluateCoupon(activeCoupon, subtotal, hasPreviousOrders) : null, [activeCoupon, subtotal, hasPreviousOrders]);
  const itemDiscount = evalResult?.ok ? evalResult.itemDiscount : 0;
  const shippingWaived = !!(evalResult?.ok && evalResult.shippingWaived);
  const deliveryFee = shippingWaived ? 0 : baseDelivery;

  const beforeWallet = Math.max(0, subtotal - itemDiscount + deliveryFee);
  const walletCap = maxWalletUsable(beforeWallet, walletBalance);
  const walletApplied = useWalletAtCheckout ? walletCap : 0;
  const grand = Math.max(0, beforeWallet - walletApplied);
  const totalSavings = itemDiscount + (shippingWaived ? baseDelivery : 0) + walletApplied;

  if (items.length === 0) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#F8F9FA', minHeight: '70vh' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900 }}>Your cart is empty</h1>
        <button onClick={() => navigate('/now')} style={{ background: G, color: '#fff', padding: '12px 22px', borderRadius: 12, fontWeight: 800, border: 'none', marginTop: 10, cursor: 'pointer' }}>Shop now</button>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your name';
    if (!/^\d{10}$/.test(phone.trim())) e.phone = 'Enter a valid 10-digit phone';
    if (!line1.trim()) e.line1 = 'Enter address';
    if (!city.trim()) e.city = 'Enter city';
    if (!/^\d{6}$/.test(pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    const id = 'ZNW' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    const cashback = cashbackFor(grand);
    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      deliveryFee,
      couponCode: activeCoupon?.code || null,
      couponDiscount: itemDiscount,
      walletUsed: walletApplied,
      cashbackEarned: cashback,
      total: grand,
      address: { name: name.trim(), phone: phone.trim(), line1: line1.trim(), city: city.trim(), pincode: pincode.trim(), notes: notes.trim() || undefined },
      paymentMode: payment,
      status: 'CONFIRMED',
      etaMinutes: 30,
    };
    saveOrder(order);

    // Ledger effects
    if (walletApplied > 0) debitWallet(walletApplied, `Paid for order`, id);
    if (cashback > 0)      creditWallet(cashback, `2% cashback on order`, id);

    // Reset promos for next order
    applyCoupon(null);
    setUseWalletAtCheckout(false);
    recordOrderPlaced();

    await new Promise(r => setTimeout(r, 450));
    clear();
    navigate(`/now/order/${id}`);
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 140 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '12px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate('/now/cart')} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #EAEAEA', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={18} />
        </button>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 18, color: '#111827', margin: 0 }}>Checkout</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, padding: '16px 4px' }} className="co-grid">
        <style>{`@media (max-width: 820px){ .co-grid { grid-template-columns: 1fr !important; } .co-sum { position: static !important; } }`}</style>

        <div>
          <Section title="Delivery Address" icon={<MapPin size={16} color={G} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Full Name" value={name} onChange={setName} error={errors.name} />
              <Field label="Phone" value={phone} onChange={v => setPhone(v.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder="10-digit mobile" />
            </div>
            <Field label="Address (House, Street, Landmark)" value={line1} onChange={setLine1} error={errors.line1} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="City" value={city} onChange={setCity} error={errors.city} />
              <Field label="Pincode" value={pincode} onChange={v => setPincode(v.replace(/\D/g, '').slice(0, 6))} error={errors.pincode} />
            </div>
            <Field label="Delivery notes (optional)" value={notes} onChange={setNotes} placeholder="e.g., Ring the bell twice" />
          </Section>

          <Section title="Payment Method">
            <PayOption
              active={payment === 'COD'} onClick={() => setPayment('COD')}
              icon={<Wallet size={18} color={payment === 'COD' ? G : '#6B7280'} />}
              title="Cash on Delivery" sub="Pay when your order arrives"
            />
            <PayOption
              active={payment === 'ONLINE'} onClick={() => setPayment('ONLINE')}
              icon={<CreditCard size={18} color={payment === 'ONLINE' ? G : '#6B7280'} />}
              title="Online Payment" sub="UPI / Cards / Netbanking (coming soon)"
            />
          </Section>
        </div>

        <div className="co-sum" style={{ position: 'sticky', top: 76, alignSelf: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 15, color: '#111827', marginBottom: 10 }}>Order Summary</div>
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
              {items.map(i => (
                <div key={i.id} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px dashed #F3F4F6' }}>
                  <img src={i.image} alt={i.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{i.weight} · Qty {i.qty}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: 13 }}>₹{i.price * i.qty}</div>
                </div>
              ))}
            </div>
            <SumRow label="Subtotal" value={`₹${subtotal}`} />
            {itemDiscount > 0 && <SumRow label={`Coupon (${activeCoupon?.code})`} value={`− ₹${itemDiscount}`} valueColor={G} />}
            <SumRow label="Delivery" value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`} valueColor={deliveryFee === 0 ? G : undefined} />
            {walletApplied > 0 && <SumRow label="Wallet" value={`− ₹${walletApplied}`} valueColor={G} />}
            <div style={{ borderTop: '1px dashed #E5E7EB', margin: '8px 0' }} />
            <SumRow label="Total" value={`₹${grand}`} bold />

            {totalSavings > 0 && (
              <div style={{ marginTop: 10, background: G_LIGHT, color: G, border: `1px dashed ${G_BORDER}`, borderRadius: 8, padding: '7px 10px', fontSize: 11.5, fontWeight: 800, textAlign: 'center' }}>
                🎉 You save ₹{totalSavings} on this order
              </div>
            )}
            {cashbackFor(grand) > 0 && (
              <div style={{ marginTop: 6, fontSize: 11.5, color: '#6B7280', textAlign: 'center' }}>
                You'll earn <strong style={{ color: G }}>₹{cashbackFor(grand)} cashback</strong> to your wallet
              </div>
            )}

            <button onClick={placeOrder} disabled={placing}
              style={{ width: '100%', marginTop: 14, padding: '14px', background: placing ? '#9CA3AF' : `linear-gradient(135deg, ${G}, #0A8C58)`, color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', borderRadius: 12, cursor: placing ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(13,163,102,.35)', fontFamily: "'Outfit',sans-serif" }}>
              {placing ? 'Placing order…' : `Place Order · ₹${grand}`}
            </button>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '8px 0 0', textAlign: 'center' }}>
              By placing this order you agree to our Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {icon}<div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', fontSize: 15 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder }: { label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <input
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', background: '#F9FAFB', border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 10, fontSize: 13.5, color: '#111827', outline: 'none' }}
        onFocus={e => (e.currentTarget.style.borderColor = G_BORDER)}
        onBlur={e => (e.currentTarget.style.borderColor = error ? '#FCA5A5' : '#E5E7EB')}
      />
      {error && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{error}</div>}
    </label>
  );
}

function PayOption({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 12, border: `1.5px solid ${active ? G_BORDER : '#E5E7EB'}`, background: active ? G_LIGHT : '#fff', borderRadius: 12, cursor: 'pointer', textAlign: 'left' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, color: '#111827', fontSize: 13.5 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: '#6B7280' }}>{sub}</div>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${active ? G : '#D1D5DB'}`, background: active ? G : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && <Check size={12} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

function SumRow({ label, value, valueColor, bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: bold ? 15 : 13, color: bold ? '#111827' : '#6B7280', fontWeight: bold ? 900 : 500, fontFamily: bold ? "'Outfit',sans-serif" : undefined }}>
      <span>{label}</span><span style={{ color: valueColor || '#111827', fontWeight: bold ? 900 : 700 }}>{value}</span>
    </div>
  );
}
