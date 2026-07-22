import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Truck, ShoppingBag, Home, MessageCircle, Share2 } from 'lucide-react';
import { getOrder, type Order } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationsContext';

const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

export function OrderConfirmation() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const { push } = useNotifications();
  const notified = useRef(false);

  useEffect(() => { setOrder(getOrder(params.id)); }, [params.id]);

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
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#F8F9FA', minHeight: '70vh' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900 }}>Order not found</h1>
        <p style={{ color: '#6B7280', marginBottom: 20 }}>We couldn't find that order.</p>
        <Link href="/now"><a style={{ background: G, color: '#fff', padding: '12px 22px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Back to store</a></Link>
      </div>
    );
  }

  const eta = new Date(new Date(order.createdAt).getTime() + order.etaMinutes * 60000);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 4px' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          style={{ background: '#fff', border: `1px solid ${G_BORDER}`, borderRadius: 20, padding: 24, textAlign: 'center' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            style={{ width: 72, height: 72, borderRadius: '50%', background: G_LIGHT, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${G_BORDER}` }}>
            <CheckCircle2 size={40} color={G} strokeWidth={2.2} />
          </motion.div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, color: '#111827', margin: '0 0 6px' }}>Order Confirmed!</h1>
          <p style={{ color: '#6B7280', margin: '0 0 4px', fontSize: 13.5 }}>Thanks {order.address.name.split(' ')[0]}, your order is on its way.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: G_LIGHT, color: G, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, marginTop: 10 }}>
            <Clock size={12} /> Arriving by {eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ marginTop: 6, fontSize: 11.5, color: '#6B7280' }}>Order ID: <strong style={{ color: '#111827' }}>{order.id}</strong></div>
        </motion.div>

        {/* Tracker */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 18, margin: '14px 0' }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 14 }}>Live status</div>
          {[
            { icon: <CheckCircle2 size={16} />, t: 'Order confirmed', d: 'We\'ve received your order', done: true },
            { icon: <ShoppingBag size={16} />, t: 'Packing your items', d: 'The store is preparing your order', done: true },
            { icon: <Truck size={16} />, t: 'Out for delivery', d: 'Your rider is on the way', done: false },
            { icon: <Home size={16} />, t: 'Delivered', d: `Estimated by ${eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, done: false },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: s.done ? G : '#F3F4F6', color: s.done ? '#fff' : '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                {i < arr.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: s.done ? G : '#E5E7EB', margin: '2px 0' }} />}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                <div style={{ fontWeight: 800, color: '#111827', fontSize: 13.5 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MapPin size={16} color={G} /><div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827' }}>Delivery to</div>
          </div>
          <div style={{ fontSize: 13.5, color: '#111827', fontWeight: 700 }}>{order.address.name} · {order.address.phone}</div>
          <div style={{ fontSize: 12.5, color: '#4B5563', marginTop: 2 }}>{order.address.line1}, {order.address.city} - {order.address.pincode}</div>
          {order.address.notes && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>Note: {order.address.notes}</div>}
        </div>

        {/* Items + bill */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', marginBottom: 10 }}>Order details</div>
          {order.items.map(i => (
            <div key={i.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px dashed #F3F4F6' }}>
              <img src={i.image} alt={i.name} style={{ width: 46, height: 46, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{i.name}</div>
                <div style={{ fontSize: 11.5, color: '#6B7280' }}>{i.weight} · Qty {i.qty}</div>
              </div>
              <div style={{ fontWeight: 800, color: '#111827' }}>₹{i.price * i.qty}</div>
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <Row label="Subtotal" value={`₹${order.subtotal}`} />
            {(order.couponDiscount ?? 0) > 0 && <Row label={`Coupon (${order.couponCode})`} value={`− ₹${order.couponDiscount}`} valueColor={G} />}
            <Row label="Delivery" value={order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`} valueColor={order.deliveryFee === 0 ? G : undefined} />
            {(order.walletUsed ?? 0) > 0 && <Row label="Wallet applied" value={`− ₹${order.walletUsed}`} valueColor={G} />}
            <Row label={`Payment · ${order.paymentMode === 'COD' ? 'Cash on Delivery' : 'Online'}`} value={`₹${order.total}`} bold />
            {(order.cashbackEarned ?? 0) > 0 && (
              <div style={{ marginTop: 10, background: G_LIGHT, color: G, border: `1px dashed ${G_BORDER}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 800, textAlign: 'center' }}>
                🎁 ₹{order.cashbackEarned} cashback credited to your wallet
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/now')} style={{ flex: '1 1 140px', padding: '13px', background: '#fff', color: '#111827', border: '1.5px solid #E5E7EB', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Continue Shopping</button>
          <button onClick={() => navigate('/account')} style={{ flex: '1 1 140px', padding: '13px', background: `linear-gradient(135deg, ${G}, #0A8C58)`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>My Orders</button>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(`My ZyphixNOW order ${order.id} is confirmed! Total ₹${order.total}. Track: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
             target="_blank" rel="noreferrer"
             style={{ flex: '1 1 140px', padding: '12px', background: '#25D366', color: '#fff', borderRadius: 12, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <MessageCircle size={16} /> Share on WhatsApp
          </a>
          <button onClick={() => {
            const url = typeof window !== 'undefined' ? window.location.href : '';
            if (typeof navigator !== 'undefined' && (navigator as any).share) (navigator as any).share({ title: 'ZyphixNOW Order', text: `Order ${order.id} confirmed`, url }).catch(() => {});
            else navigator.clipboard?.writeText(url);
          }} style={{ flex: '1 1 140px', padding: '12px', background: '#fff', color: '#111827', border: '1.5px solid #E5E7EB', borderRadius: 12, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Share2 size={16} /> Share link
          </button>
        </div>

      </div>
    </div>
  );
}

function Row({ label, value, valueColor, bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: bold ? 15 : 13, color: bold ? '#111827' : '#6B7280', fontWeight: bold ? 900 : 500, fontFamily: bold ? "'Outfit',sans-serif" : undefined }}>
      <span>{label}</span><span style={{ color: valueColor || '#111827', fontWeight: bold ? 900 : 700 }}>{value}</span>
    </div>
  );
}
