import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from '@/lib/motion';
import { CheckCircle2, Clock, MapPin, Truck, ShoppingBag, Home, MessageCircle, Share2, Check } from 'lucide-react';
import { getOrder, type Order } from '@/context/CartContext';
import { getOrderRemote, toLocalOrder } from '@/lib/account';
import { useNotifications } from '@/context/NotificationsContext';
import { Button, FONT } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

export function OrderConfirmation() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [looking, setLooking] = useState(true);
  const { push } = useNotifications();
  const notified = useRef(false);

  // Local copy first (instant), otherwise ask the Worker (orders on another device / after clearing storage).
  useEffect(() => {
    let alive = true;
    const local = getOrder(params.id);
    if (local) { setOrder(local); setLooking(false); return; }
    setLooking(true);
    getOrderRemote(params.id).then(r => { if (alive) { setOrder(r ? toLocalOrder(r) : null); setLooking(false); } });
    return () => { alive = false; };
  }, [params.id]);

  useEffect(() => {
    if (order && !notified.current) {
      notified.current = true;
      push({
        kind: 'order',
        title: `Order ${order.id} confirmed`,
        body: `Arriving in ~${order.etaMinutes} min. Total ₹${order.total} · ${order.paymentMode}.`,
        href: `/now/order/${order.id}`,
      });
    }
  }, [order, push]);

  if (!order) {
    if (looking) {
      return (
        <div className="mx-auto w-full max-w-[720px] pt-4" style={{ fontFamily: FONT }}>
          <div className={`${card} space-y-3 p-4`}>
            <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-64 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-52 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      );
    }
    return (
      <div className="mx-auto w-full max-w-[720px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
        <div className={`${card} px-6 py-14 text-center`}>
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Order not found</h1>
          <p className="mt-1 text-[13px] text-gray-500">We couldn't find an order with that ID.</p>
          <div className="mt-4"><Button href="/now" size="sm">Back to store</Button></div>
        </div>
      </div>
    );
  }

  const eta = new Date(new Date(order.createdAt).getTime() + order.etaMinutes * 60000);
  const etaText = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const steps = [
    { icon: <CheckCircle2 size={14} />, t: 'Order confirmed', d: 'We have received your order', done: true },
    { icon: <ShoppingBag size={14} />, t: 'Packing', d: 'The store is preparing your items', done: true },
    { icon: <Truck size={14} />, t: 'Out for delivery', d: 'Your rider is on the way', done: false },
    { icon: <Home size={14} />, t: 'Delivered', d: `Estimated by ${etaText}`, done: false },
  ];

  return (
    <div className="mx-auto w-full max-w-[720px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
        className={`${card} flex items-start gap-3 p-4`}>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"><Check size={20} strokeWidth={2.5} /></span>
        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Order confirmed</h1>
          <p className="mt-0.5 text-[13px] text-gray-500">Thanks {order.address.name.split(' ')[0]}, your order is on its way.</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700"><Clock size={12} /> Arriving by {etaText}</span>
            <span className="text-gray-500">Order ID <span className="font-medium text-gray-900">{order.id}</span></span>
          </div>
        </div>
      </motion.div>

      {/* Tracker */}
      <div className={`${card} mt-3 p-4`}>
        <p className="text-[14px] font-semibold">Status</p>
        <ol className="mt-3">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${s.done ? 'bg-emerald-600 text-white' : 'border border-[#E6E8EC] bg-[#FAFAFA] text-gray-400'}`}>{s.icon}</span>
                {i < steps.length - 1 && <span className={`my-1 w-px flex-1 ${s.done && steps[i + 1].done ? 'bg-emerald-600' : 'bg-[#E6E8EC]'}`} style={{ minHeight: 18 }} />}
              </div>
              <div className={i < steps.length - 1 ? 'pb-4' : ''}>
                <p className={`text-[13.5px] ${s.done ? 'font-semibold text-gray-900' : 'font-medium text-gray-500'}`}>{s.t}</p>
                <p className="text-[12px] text-gray-500">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Address */}
      <div className={`${card} mt-3 p-4`}>
        <div className="flex items-center gap-2 text-[14px] font-semibold"><MapPin size={14} className="text-emerald-700" /> Delivering to</div>
        <p className="mt-2 text-[13.5px] font-medium">{order.address.name} · {order.address.phone}</p>
        <p className="mt-0.5 text-[13px] text-gray-600">{order.address.line1}, {order.address.city} – {order.address.pincode}</p>
        {order.address.notes && <p className="mt-1 text-[12px] text-gray-500">Note: {order.address.notes}</p>}
      </div>

      {/* Items + bill */}
      <div className={`${card} mt-3 p-4`}>
        <p className="text-[14px] font-semibold">Order details</p>
        <div className="mt-2 divide-y divide-gray-100">
          {order.items.map(i => (
            <div key={i.id} className="flex items-center gap-2.5 py-2">
              <img src={i.image} alt={i.name} className="h-10 w-10 shrink-0 rounded-lg border border-[#E6E8EC] bg-white object-contain p-0.5" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{i.name}</p>
                <p className="text-[12px] text-gray-500">{[i.weight, `Qty ${i.qty}`].filter(Boolean).join(' · ')}</p>
              </div>
              <span className="text-[13px] font-semibold tabular-nums">₹{i.price * i.qty}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-[#E6E8EC] pt-2">
          <Row label="Item total" value={`₹${order.subtotal}`} />
          {(order.couponDiscount ?? 0) > 0 && <Row label={`Coupon (${order.couponCode})`} value={`− ₹${order.couponDiscount}`} green />}
          <Row label="Delivery fee" value={order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`} green={order.deliveryFee === 0} />
          {(order.walletUsed ?? 0) > 0 && <Row label="Wallet" value={`− ₹${order.walletUsed}`} green />}
        </div>
        <div className="my-2 border-t border-[#E6E8EC]" />
        <div className="flex items-center justify-between text-[15px] font-semibold">
          <span>{order.paymentMode === 'COD' ? 'Pay on delivery' : 'Paid online'}</span><span>₹{order.total}</span>
        </div>
        {(order.cashbackEarned ?? 0) > 0 && (
          <p className="mt-1 text-[12.5px] font-medium text-emerald-700">₹{order.cashbackEarned} cashback added to your wallet</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => navigate('/now')}>Continue shopping</Button>
        <Button onClick={() => navigate('/account?tab=orders')}>My orders</Button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`My Zyphix Now order ${order.id} is confirmed. Total ₹${order.total}. Track: ${shareUrl}`)}`}
          target="_blank" rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E6E8EC] bg-white text-[14px] font-semibold text-gray-900 no-underline transition hover:border-gray-300">
          <MessageCircle size={15} /> WhatsApp
        </a>
        <Button variant="secondary" onClick={() => {
          if (typeof navigator !== 'undefined' && (navigator as any).share) (navigator as any).share({ title: 'Zyphix Now order', text: `Order ${order.id} confirmed`, url: shareUrl }).catch(() => {});
          else navigator.clipboard?.writeText(shareUrl);
        }}>
          <Share2 size={15} /> Share link
        </Button>
      </div>
    </div>
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
