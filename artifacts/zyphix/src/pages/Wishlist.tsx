import React from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Trash2, ShoppingCart, Plus } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const G = '#0DA366';

export function Wishlist() {
  const { items, remove, clear } = useWishlist();
  const { add, qty } = useCart();
  const [, navigate] = useLocation();

  if (items.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', background: '#F8F9FA', minHeight: '70vh' }}>
        <Heart size={64} color="#E5E7EB" style={{ margin: '0 auto 14px' }} />
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827' }}>Your wishlist is empty</h1>
        <p style={{ color: '#6B7280', marginBottom: 20 }}>Tap the heart on any product to save it here.</p>
        <Link href="/now">
          <a style={{ background: G, color: '#fff', padding: '12px 22px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Explore products</a>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ padding: '20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>
          Wishlist <span style={{ color: '#6B7280', fontWeight: 700, fontSize: 14 }}>· {items.length}</span>
        </h1>
        <button onClick={clear} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', color: '#EF4444', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          Clear all
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {items.map(p => {
          const q = qty(p.id);
          return (
            <div key={p.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', position: 'relative' }}>
              <button onClick={() => remove(p.id)} title="Remove"
                style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1 }}>
                <Trash2 size={14} color="#EF4444" />
              </button>
              <Link href={`/now/product/${p.id}`}>
                <a style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>{p.brand}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1F2937', margin: '3px 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827' }}>₹{p.price}</div>
                      {p.origPrice && <div style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through' }}>₹{p.origPrice}</div>}
                    </div>
                  </div>
                </a>
              </Link>
              <div style={{ padding: '0 10px 10px' }}>
                {q === 0 ? (
                  <button onClick={() => add({ id: p.id, name: p.name, brand: p.brand, price: p.price, origPrice: p.origPrice, image: p.image, weight: p.weight })}
                    style={{ width: '100%', padding: '8px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Plus size={13} /> Add
                  </button>
                ) : (
                  <button onClick={() => navigate('/now/cart')}
                    style={{ width: '100%', padding: '8px', background: 'rgba(13,163,102,0.08)', color: G, border: '1px solid rgba(13,163,102,0.25)', borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ShoppingCart size={13} /> {q} in cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
