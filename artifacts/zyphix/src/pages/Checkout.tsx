import { useSeo } from '@/lib/seo';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, MapPin, Wallet, CreditCard, Check } from 'lucide-react';
import { useCart, saveOrder, type Order } from '@/context/CartContext';
import { usePromo, maxWalletUsable, cashbackFor } from '@/context/PromoContext';
import { findCoupon, evaluateCoupon } from '@/data/coupons';
import { useAuth } from '@/context/AuthContext';
import { createOrder, listAddresses, type SavedAddress } from '@/lib/account';
import { Button, FONT } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

export function Checkout() {
  useSeo('Checkout · Zyphix Now');
  const { items, subtotal, clear } = useCart();
  const {
    appliedCoupon, applyCoupon,
    walletBalance, useWalletAtCheckout, setUseWalletAtCheckout,
    debitWallet, creditWallet,
    hasPreviousOrders, recordOrderPlaced,
  } = usePromo();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [name, setName] = useState(() => { try { return JSON.parse(localStorage.getItem('zyphix_user') || 'null')?.name || ''; } catch { return ''; } });
  const [phone, setPhone] = useState(() => { try { return JSON.parse(localStorage.getItem('zyphix_user') || 'null')?.phone || ''; } catch { return ''; } });

  // Saved addresses (signed-in users): one tap fills the form.
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [savedPick, setSavedPick] = useState<string | null>(null);
  useEffect(() => {
    if (!user?.id) { setSaved([]); return; }
    let alive = true;
    listAddresses().then(l => { if (alive) setSaved(l); }).catch(() => {});
    return () => { alive = false; };
  }, [user?.id]);
  const useSaved = (a: SavedAddress) => {
    setSavedPick(a.id);
    if (a.name) setName(a.name);
    if (a.phone) setPhone(a.phone.replace(/\D/g, '').slice(-10));
    setLine1([a.line1, a.line2].filter(Boolean).join(', ').replace(/ \| /g, ', '));
    setCity(a.city); setPincode(a.pincode);
    setErrors({});
  };
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<'COD' | 'ONLINE'>('COD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

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
      <div className="mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
        <div className={`${card} px-6 py-14 text-center`}>
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Your cart is empty</h1>
          <p className="mt-1 text-[13px] text-gray-500">Add a few products before checking out.</p>
          <div className="mt-4"><Button size="sm" onClick={() => navigate('/now')}>Go to store</Button></div>
        </div>
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
    setPlacing(true); setPlaceError('');
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
    // The order only counts once our server has it. If it can't be sent, nothing is charged,
    // the cart stays as it is, and the shopper is told to retry.
    try {
      await createOrder(order);
    } catch {
      setPlacing(false);
      setPlaceError("We couldn't place your order. Check your internet connection and try again. You have not been charged.");
      return;
    }
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
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => navigate('/now/cart')} aria-label="Back to cart"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E8EC] bg-white text-gray-600 transition hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Checkout</h1>
        <p className="text-[13px] text-gray-500">{items.length} item{items.length > 1 ? 's' : ''}</p>
      </div>

      <div className="mt-4 grid items-start gap-4 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Section title="Delivery address" icon={<MapPin size={14} className="text-emerald-700" />}>
            {saved.length > 0 && (
              <div>
                <p className="mb-2 text-[12px] font-medium text-gray-500">Saved addresses</p>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {saved.map(a => {
                    const active = savedPick === a.id;
                    return (
                      <button key={a.id} type="button" onClick={() => useSaved(a)}
                        className={`w-[200px] shrink-0 rounded-lg border px-3 py-2 text-left transition ${active ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-[#E6E8EC] bg-white hover:border-gray-300'}`}>
                        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-900">
                          <span className="truncate">{a.label || 'Address'}</span>
                          {a.isDefault && <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">Default</span>}
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-gray-500">
                          {[a.line1, a.line2, a.city].filter(Boolean).join(', ').replace(/ \| /g, ', ')}{a.pincode ? ` – ${a.pincode}` : ''}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
              <Field label="Phone" value={phone} onChange={v => setPhone(v.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder="10-digit mobile" inputMode="numeric" autoComplete="tel" />
            </div>
            <Field label="Address (house, street, landmark)" value={line1} onChange={setLine1} error={errors.line1} autoComplete="street-address" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="City" value={city} onChange={setCity} error={errors.city} autoComplete="address-level2" />
              <Field label="Pincode" value={pincode} onChange={v => setPincode(v.replace(/\D/g, '').slice(0, 6))} error={errors.pincode} inputMode="numeric" autoComplete="postal-code" />
            </div>
            <Field label="Delivery notes (optional)" value={notes} onChange={setNotes} placeholder="e.g. Ring the bell twice" />
          </Section>

          <Section title="Payment">
            <PayOption
              active={payment === 'COD'} onClick={() => setPayment('COD')}
              icon={<Wallet size={16} />}
              title="Cash on delivery" sub="Pay when your order arrives"
            />
            <PayOption
              active={payment === 'ONLINE'} onClick={() => setPayment('ONLINE')}
              icon={<CreditCard size={16} />}
              title="Online payment" sub="UPI, cards, netbanking (coming soon)"
            />
          </Section>
        </div>

        {/* Summary */}
        <div className={`${card} p-4 md:sticky md:top-[80px]`}>
          <p className="flex items-baseline justify-between text-[14px] font-semibold">Order summary <span className="text-[12.5px] font-normal text-gray-500">{items.reduce((a, i) => a + i.qty, 0)} items{items.length > 4 ? ', scroll for all' : ''}</span></p>
          <div className="mt-2 max-h-[320px] divide-y divide-gray-100 overflow-y-auto [scrollbar-width:thin]">
            {items.map(i => (
              <div key={i.id} className="flex items-center gap-2.5 py-2">
                <img src={i.image} alt={i.name} className="h-10 w-10 shrink-0 rounded-lg border border-[#E6E8EC] bg-white object-contain p-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-gray-900">{i.name}</p>
                  <p className="text-[12px] text-gray-500">{[i.weight, `Qty ${i.qty}`].filter(Boolean).join(' · ')}</p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums">₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-[#E6E8EC] pt-2">
            <Row label="Item total" value={`₹${subtotal}`} />
            {itemDiscount > 0 && <Row label={`Coupon (${activeCoupon?.code})`} value={`− ₹${itemDiscount}`} green />}
            <Row label="Delivery fee" value={deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`} green={deliveryFee === 0} />
            {walletApplied > 0 && <Row label="Wallet" value={`− ₹${walletApplied}`} green />}
          </div>
          <div className="my-3 border-t border-[#E6E8EC]" />
          <div className="flex items-center justify-between text-[15px] font-semibold">
            <span>To pay</span><span>₹{grand}</span>
          </div>
          {totalSavings > 0 && <p className="mt-1 text-[12.5px] font-medium text-emerald-700">You save ₹{totalSavings} on this order</p>}
          {cashbackFor(grand) > 0 && <p className="mt-1 text-[12px] text-gray-500">₹{cashbackFor(grand)} cashback will be added to your wallet</p>}

          <Button onClick={placeOrder} className={`mt-3 w-full justify-between ${placing ? 'pointer-events-none opacity-60' : ''}`}>
            <span>{placing ? 'Placing order' : 'Place order'}</span><span>₹{grand}</span>
          </Button>
          {placeError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] leading-[1.5] text-red-700">{placeError}</p>}
          <p className="mt-2 text-center text-[11.5px] text-gray-400">By placing this order you agree to our Terms.</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={`${card} p-4`}>
      <div className="flex items-center gap-2 text-[14px] font-semibold">{icon}{title}</div>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder, inputMode, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-gray-600">{label}</span>
      <input
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} autoComplete={autoComplete}
        className={`h-9 w-full rounded-lg border bg-white px-3 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 ${error ? 'border-red-300' : 'border-[#E6E8EC]'}`}
      />
      {error && <span className="mt-1 block text-[12px] text-red-600">{error}</span>}
    </label>
  );
}

function PayOption({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${active ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-[#E6E8EC] bg-white hover:border-gray-300'}`}>
      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${active ? 'border-emerald-200 bg-white text-emerald-700' : 'border-[#E6E8EC] bg-[#FAFAFA] text-gray-500'}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold text-gray-900">{title}</span>
        <span className="block text-[12px] text-gray-500">{sub}</span>
      </span>
      <span className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white'}`}>
        {active && <Check size={11} strokeWidth={3} />}
      </span>
    </button>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between py-1 text-[13px]">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium tabular-nums ${green ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}
