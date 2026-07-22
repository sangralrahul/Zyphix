import React, { useMemo } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Minus, Clock, Truck, ShieldCheck, Star, Heart, Share2 } from 'lucide-react';
import { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useReviews } from '@/context/ReviewsContext';
import { Reviews } from '@/components/Reviews';


const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

export function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { qty, add, remove } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const { summary } = useReviews();

  const product = useMemo(() => products.find(p => p.id === params.id), [params.id]);
  const related = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [product]);

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#F8F9FA', minHeight: '70vh' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 22, color: '#111827' }}>Product not found</h1>
        <p style={{ color: '#6B7280', marginBottom: 20 }}>The item you're looking for isn't available.</p>
        <Link href="/now">
          <a style={{ background: G, color: '#fff', padding: '12px 22px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Back to store</a>
        </Link>
      </div>
    );
  }

  const q = qty(product.id);
  const discount = product.origPrice ? Math.round((1 - product.price / product.origPrice) * 100) : 0;
  const snap = { id: product.id, name: product.name, brand: product.brand, price: product.price, origPrice: product.origPrice, image: product.image, weight: product.weight };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 120 }}>
      {/* top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '12px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => window.history.length > 1 ? window.history.back() : navigate('/now')}
          style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #EAEAEA', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
          <Link href="/now"><a style={{ color: G, textDecoration: 'none' }}>ZyphixNow</a></Link> · {product.category}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 420px) 1fr', gap: 24, padding: '20px 4px', alignItems: 'start' }}
        className="pd-grid">
        <style>{`@media (max-width: 720px){ .pd-grid { grid-template-columns: 1fr !important; } }`}</style>

        {/* image */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 16, border: '1px solid #EAEAEA', position: 'relative' }}>
          <div style={{ aspectRatio: '1', borderRadius: 14, overflow: 'hidden', background: '#F3F4F6', position: 'relative' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {discount > 0 && (
              <div style={{ position: 'absolute', top: 12, left: 12, background: '#EF4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '5px 10px', borderRadius: 8 }}>
                {discount}% OFF
              </div>
            )}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => toggleWish(snap)} title={isWished(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Heart size={18} fill={isWished(product.id) ? '#EF4444' : 'none'} stroke={isWished(product.id) ? '#EF4444' : '#374151'} />
              </button>
              <button title="Share" onClick={() => {
                const url = window.location.href;
                if (navigator.share) { navigator.share({ title: product.name, url }).catch(() => {}); }
                else { navigator.clipboard?.writeText(url); }
              }} style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Share2 size={16} color="#374151" />
              </button>
            </div>
          </div>
        </div>


        {/* info */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>{product.brand}</div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 900, color: '#111827', margin: '4px 0 6px', letterSpacing: '-.02em' }}>
            {product.name}
          </h1>
          {(() => {
            const s = summary(product.id);
            const display = s.count > 0 ? s.avg.toFixed(1) : '4.4';
            const countText = s.count > 0 ? ` (${s.count})` : '';
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, fontWeight: 500 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: G_LIGHT, color: G, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                  <Star size={11} fill={G} stroke={G} /> {display}{countText}
                </span>
                <span>· {product.weight} · {product.storeName}</span>
              </div>
            );
          })()}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '18px 0 4px' }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 30, fontWeight: 900, color: '#111827' }}>₹{product.price}</span>
            {product.origPrice && (
              <>
                <span style={{ fontSize: 15, color: '#9CA3AF', textDecoration: 'line-through', fontWeight: 500 }}>₹{product.origPrice}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: G }}>Save ₹{product.origPrice - product.price}</span>
              </>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 20 }}>Inclusive of all taxes</div>

          {/* Delivery card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
            {[
              { icon: <Clock size={16} color={G} />, t: '~30 min', s: 'Delivery' },
              { icon: <Truck size={16} color={G} />, t: 'FREE', s: 'Above ₹149' },
              { icon: <ShieldCheck size={16} color={G} />, t: '100%', s: 'Fresh' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{f.t}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{f.s}</div>
              </div>
            ))}
          </div>

          {/* Add to cart */}
          {q === 0 ? (
            <button onClick={() => add(snap)}
              style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${G}, #0A8C58)`, color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', borderRadius: 14, cursor: 'pointer', boxShadow: '0 6px 20px rgba(13,163,102,.35)', fontFamily: "'Outfit',sans-serif" }}>
              Add to Cart
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: G_LIGHT, border: `1.5px solid ${G_BORDER}`, borderRadius: 12, overflow: 'hidden', flex: 1 }}>
                <button onClick={() => remove(product.id)} style={{ width: 44, height: 46, background: 'none', border: 'none', color: G, cursor: 'pointer' }}><Minus size={16} /></button>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: G, fontSize: 16 }}>{q} in cart</span>
                <button onClick={() => add(snap)} style={{ width: 44, height: 46, background: 'none', border: 'none', color: G, cursor: 'pointer' }}><Plus size={16} /></button>
              </div>
              <button onClick={() => navigate('/now/cart')}
                style={{ flex: 1, padding: '14px', background: `linear-gradient(135deg, ${G}, #0A8C58)`, color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                Go to Cart
              </button>
            </div>
          )}

          {/* description */}
          <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 14, padding: 16, marginTop: 22 }}>
            <div style={{ fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 6, color: '#111827' }}>About this product</div>
            <p style={{ margin: 0, color: '#4B5563', fontSize: 13, lineHeight: 1.55 }}>
              Handpicked {product.name.toLowerCase()} from trusted local suppliers. Sourced daily to bring you
              the freshest quality at the best price. Quantity: <strong>{product.weight}</strong>.
              Delivered in ~30 minutes to your doorstep.
            </p>
          </div>

          {/* reviews */}
          <Reviews productId={product.id} />
        </div>
      </div>


      {/* related */}
      {related.length > 0 && (
        <div style={{ padding: '10px 4px' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 18, color: '#111827', margin: '10px 0 12px' }}>You might also like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 10 }}>
            {related.map(r => (
              <Link key={r.id} href={`/now/product/${r.id}`}>
                <a style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div whileHover={{ y: -3 }} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0F0F0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                    <img src={r.image} alt={r.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                    <div style={{ padding: 10 }}>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>{r.brand}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1F2937', margin: '3px 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.name}</div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827' }}>₹{r.price}</div>
                    </div>
                  </motion.div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
