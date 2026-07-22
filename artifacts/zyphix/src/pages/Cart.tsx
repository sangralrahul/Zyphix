import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

export function Cart() {
  const { items, add, remove, setQty, subtotal, totalItems } = useCart();
  const [, navigate] = useLocation();

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 149 ? 0 : 25;
  const grand = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div style={{ background: '#F8F9FA', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🛒</div>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, color: '#111827', margin: '0 0 6px' }}>Your cart is empty</h1>
        <p style={{ color: '#6B7280', marginBottom: 22 }}>Fresh groceries are just a tap away.</p>
        <Link href="/now">
          <a style={{ background: G, color: '#fff', padding: '13px 24px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={16} /> Start Shopping
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 140 }}>
      <div style={{ padding: '18px 4px 8px' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>Your Cart</h1>
        <p style={{ color: '#6B7280', fontSize: 13, margin: '2px 0 0' }}>{totalItems} item{totalItems > 1 ? 's' : ''} · Delivery in ~30 min</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, padding: '8px 4px' }} className="cart-grid">
        <style>{`@media (max-width: 780px){ .cart-grid { grid-template-columns: 1fr !important; } .cart-sum { position: static !important; } }`}</style>

        <div>
          <AnimatePresence initial={false}>
            {items.map(i => (
              <motion.div key={i.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 12, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link href={`/now/product/${i.id}`}>
                  <a style={{ flexShrink: 0 }}>
                    <img src={i.image} alt={i.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid #EAEAEA' }} />
                  </a>
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>{i.brand}</div>
                  <Link href={`/now/product/${i.id}`}>
                    <a style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
                    </a>
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
        </div>

        <div className="cart-sum" style={{ position: 'sticky', top: 76, alignSelf: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 18 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 15, color: '#111827', marginBottom: 12 }}>Bill details</div>
            <Row label="Item total" value={`₹${subtotal}`} />
            <Row label="Delivery fee" value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`} valueColor={deliveryFee === 0 ? G : '#111827'} />
            {deliveryFee > 0 && (
              <div style={{ fontSize: 11.5, color: G, background: G_LIGHT, border: `1px solid ${G_BORDER}`, borderRadius: 8, padding: '6px 8px', margin: '4px 0 10px' }}>
                Add ₹{149 - subtotal} more for FREE delivery
              </div>
            )}
            <div style={{ borderTop: '1px dashed #E5E7EB', margin: '10px 0' }} />
            <Row label="Grand total" value={`₹${grand}`} bold />
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
