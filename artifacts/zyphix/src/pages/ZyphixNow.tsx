import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, Clock, ChevronRight, Zap, Tag, Truck, SlidersHorizontal } from 'lucide-react';
import { products, GROCERY_CATEGORIES } from '@/data/mockData';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'discount';



const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

export function ZyphixNow() {
  const initCat = () => {
    try { return localStorage.getItem('zyphix_groc_cat') || 'Fruits & Veg'; } catch { return 'Fruits & Veg'; }
  };

  const [activeCat, setActiveCat] = useState<string>(initCat);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const sideRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const { items: cartItems, add: addToCart, remove: removeFromCart, totalItems, subtotal: totalPrice } = useCart();
  const cart: Record<string, number> = useMemo(() => {
    const m: Record<string, number> = {};
    cartItems.forEach(i => { m[i.id] = i.qty; });
    return m;
  }, [cartItems]);

  const add = (id: string) => {
    const p = products.find(x => x.id === id); if (!p) return;
    addToCart({ id: p.id, name: p.name, brand: p.brand, price: p.price, origPrice: p.origPrice, image: p.image, weight: p.weight });
  };
  const remove = (id: string) => removeFromCart(id);

  const catData = GROCERY_CATEGORIES.find(c => c.name === activeCat);

  const sortFn = (a: typeof products[number], b: typeof products[number]) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'discount') {
      const da = a.origPrice ? (1 - a.price / a.origPrice) : 0;
      const db = b.origPrice ? (1 - b.price / b.origPrice) : 0;
      return db - da;
    }
    return 0;
  };

  const filtered = useMemo(() => products
    .filter(p => p.category === activeCat)
    .filter(p => !onlyDiscounted || (p.origPrice && p.price < p.origPrice))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .slice().sort(sortFn), [activeCat, onlyDiscounted, search, sortBy]);

  const allSearched = useMemo(() => search ? products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !onlyDiscounted || (p.origPrice && p.price < p.origPrice))
    .slice().sort(sortFn) : [], [search, onlyDiscounted, sortBy]);

  const displayProducts = search ? allSearched : filtered;



  const scrollCatIntoView = (name: string) => {
    if (!sideRef.current) return;
    const btn = sideRef.current.querySelector(`[data-cat="${name}"]`) as HTMLElement;
    btn?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const pickCat = (name: string) => {
    setActiveCat(name);
    setSearch('');
    scrollCatIntoView(name);
  };

  return (
    <div style={{ minHeight: '80vh', position: 'relative', background: '#F8F9FA' }}>

      {/* ── Hero strip ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '10px 0', marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0DA366, #0A8C58)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(13,163,102,0.3)' }}>
              <Zap size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1 style={{ fontSize: 18, fontWeight: 900, color: '#111827', letterSpacing: '-.03em', fontFamily: "'Outfit',sans-serif", margin: 0 }}>ZyphixNow</h1>
                <span style={{ fontSize: 10, fontWeight: 700, background: G_LIGHT, color: G, border: `1px solid ${G_BORDER}`, borderRadius: 99, padding: '2px 8px' }}>GROCERY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: G }}>
                  <Clock size={10} /> 30 min delivery
                </span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D1D5DB' }} />
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>300+ products</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D1D5DB' }} />
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>6 stores near you</span>
              </div>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, color: G, background: G_LIGHT, border: `1px solid ${G_BORDER}`, borderRadius: 8, padding: '5px 10px' }}>
            <Truck size={12} /> FREE delivery
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ background: '#fff', padding: '10px 0 12px', borderBottom: '1px solid #EAEAEA', marginBottom: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for products, brands and more…"
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 40, paddingRight: search ? 36 : 14, paddingTop: 10, paddingBottom: 10, borderRadius: 10, background: '#F3F4F6', border: '1.5px solid transparent', color: '#111827', fontSize: 13, outline: 'none', transition: 'all .2s', fontFamily: "'Inter',sans-serif" }}
            onFocus={e => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = G_BORDER; e.target.style.boxShadow = '0 0 0 3px rgba(13,163,102,0.06)'; }}
            onBlur={e => { e.target.style.background = '#F3F4F6'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#E5E7EB', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', cursor: 'pointer' }}>
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'flex', minHeight: 520 }}>

        {/* ─ Category Sidebar ─ */}
        {!search && (
          <div ref={sideRef} style={{ width: 96, flexShrink: 0, background: '#FFFFFF', borderRight: '1px solid #EAEAEA', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)', position: 'sticky', top: 64, scrollbarWidth: 'none' }}>
            <style>{`
              .zn-sidebar::-webkit-scrollbar { display: none; }
              .cat-btn { transition: all .12s ease; }
              .cat-btn:hover { background: #F9FAFB !important; }
            `}</style>
            <div className="zn-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
              {GROCERY_CATEGORIES.map(cat => {
                const isActive = activeCat === cat.name;
                const count = products.filter(p => p.category === cat.name).length;
                return (
                  <button
                    key={cat.name}
                    data-cat={cat.name}
                    onClick={() => pickCat(cat.name)}
                    className="cat-btn"
                    style={{
                      padding: '11px 8px 10px',
                      textAlign: 'center',
                      background: isActive ? '#F0FDF8' : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${isActive ? G : 'transparent'}`,
                      cursor: 'pointer',
                      opacity: count > 0 ? 1 : 0.4,
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, margin: '0 auto 6px',
                      overflow: 'hidden',
                      background: isActive ? G_LIGHT : '#F3F4F6',
                      border: isActive ? `1.5px solid ${G_BORDER}` : '1.5px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .12s',
                    }}>
                      <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: 9.5, fontWeight: isActive ? 700 : 500, color: isActive ? G : '#6B7280', lineHeight: 1.3, wordBreak: 'break-word' }}>
                      {cat.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─ Products area ─ */}
        <div style={{ flex: 1, minWidth: 0, padding: '0 0 80px' }}>

          {/* Category header */}
          {!search && (
            <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 64, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, overflow: 'hidden', flexShrink: 0, border: '1px solid #EAEAEA' }}>
                  <img src={catData?.image} alt={activeCat} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, color: '#111827', margin: 0, letterSpacing: '-.02em' }}>{activeCat}</h2>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: 0, marginTop: 1 }}>{filtered.length} items available</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setOnlyDiscounted(v => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: onlyDiscounted ? '#fff' : G, background: onlyDiscounted ? G : G_LIGHT, border: `1px solid ${G_BORDER}`, borderRadius: 20, padding: '5px 10px', cursor: 'pointer' }}>
                  <Tag size={11} /> Deals
                </button>
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                  <SlidersHorizontal size={11} style={{ position: 'absolute', left: 8, color: '#6B7280', pointerEvents: 'none' }} />
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
                    style={{ appearance: 'none', border: '1px solid #E5E7EB', background: '#fff', borderRadius: 20, padding: '5px 22px 5px 24px', fontSize: 11, fontWeight: 700, color: '#111827', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <option value="featured">Featured</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                    <option value="discount">Discount</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Search results header */}
          {search && (
            <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '12px 14px' }}>
              <p style={{ fontSize: 13, color: '#111827', fontWeight: 700, margin: 0 }}>
                {allSearched.length > 0
                  ? <>{allSearched.length} results for <span style={{ color: G }}>"{search}"</span></>
                  : <>No results for "{search}"</>}
              </p>
            </div>
          )}

          {/* Products grid */}
          <div style={{ padding: '12px 10px' }}>
            {displayProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Nothing found</p>
                <p style={{ fontSize: 13 }}>Try a different search or browse categories</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 10 }}>
                {displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} qty={cart[product.id] || 0} onAdd={() => add(product.id)} onRemove={() => remove(product.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─ Cart Drawer ─ */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 998, backdropFilter: 'blur(4px)' }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, background: '#FFFFFF', zIndex: 999, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}>

              {/* Header */}
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: '#111827', fontFamily: "'Outfit',sans-serif", margin: 0 }}>Your Cart</h3>
                  {totalItems > 0 && <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0', fontWeight: 500 }}>{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}</p>}
                </div>
                <button onClick={() => setCartOpen(false)} style={{ width: 32, height: 32, borderRadius: 10, background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Delivery info strip */}
              {totalItems > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: '#F0FDF8', borderBottom: '1px solid #D1FAE5', fontSize: 12, fontWeight: 600, color: G }}>
                  <Zap size={12} /> Estimated delivery: <strong>28–30 min</strong>
                </div>
              )}

              {/* Items */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(cart).map(([id, qty]) => {
                  const p = products.find(x => x.id === id)!;
                  if (!p) return null;
                  return (
                    <motion.div key={id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#FAFAFA', borderRadius: 14, border: '1px solid #F3F4F6' }}>
                      <img src={p.image} alt={p.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid #EAEAEA' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 4px', fontWeight: 500 }}>{p.weight}</p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: 0 }}>₹{p.price * qty}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: G_LIGHT, border: `1.5px solid ${G_BORDER}`, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <button onClick={() => remove(id)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: G, cursor: 'pointer', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>−</button>
                        <span style={{ fontSize: 13, fontWeight: 900, color: G, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                        <button onClick={() => add(id)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: G, cursor: 'pointer', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
                      </div>
                    </motion.div>
                  );
                })}
                {totalItems === 0 && (
                  <div style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
                    <p style={{ fontWeight: 800, color: '#111827', marginBottom: 6, fontSize: 16, fontFamily: "'Outfit',sans-serif" }}>Cart is empty</p>
                    <p style={{ fontSize: 13, color: '#6B7280' }}>Add items from the store to get started</p>
                  </div>
                )}
              </div>

              {/* Checkout footer */}
              {totalItems > 0 && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #EAEAEA', background: '#FAFAFA', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                    <span>Item total</span><span style={{ color: '#111827', fontWeight: 700 }}>₹{totalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                    <span>Delivery fee</span><span style={{ color: G, fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14, color: '#111827', fontWeight: 900, borderTop: '1px solid #EAEAEA', paddingTop: 10, marginTop: 10, fontFamily: "'Outfit',sans-serif" }}>
                    <span>Grand Total</span><span>₹{totalPrice}</span>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); navigate('/offers'); }}
                    style={{ width: '100%', padding: '14px', borderRadius: 14, background: `linear-gradient(135deg, ${G}, #0A8C58)`, color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(13,163,102,.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'Outfit',sans-serif" }}>
                    <span>Proceed to Checkout</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>₹{totalPrice} <ChevronRight size={16} /></span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─ Floating Cart Bar ─ */}
      <AnimatePresence>
        {totalItems > 0 && !cartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ position: 'fixed', bottom: 76, left: 12, right: 12, maxWidth: 480, margin: '0 auto', zIndex: 90 }}>
            <button onClick={() => setCartOpen(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: '14px 20px', background: `linear-gradient(135deg, ${G}, #0A8C58)`, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(13,163,102,.45)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff' }}>{totalItems}</div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#fff' }}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</p>
                  <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>Delivery in ~30 min</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: 15, fontFamily: "'Outfit',sans-serif" }}>₹{totalPrice}</p>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={15} color="#fff" />
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Product Card ─── */
type Product = { id: string; name: string; brand: string; price: number; origPrice: number | null; category: string; weight: string; image: string; tag: string | null; storeName: string; distance: string };

function ProductCard({ product: p, qty, onAdd, onRemove }: { product: Product; qty: number; onAdd: () => void; onRemove: () => void }) {
  const discount = p.origPrice ? Math.round((1 - p.price / p.origPrice) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.15 }}
      style={{ borderRadius: 16, background: '#FFFFFF', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #F0F0F0' }}>

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: '#F8F9FA' }}>
        <img src={p.image} alt={p.name} draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }}
          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
        />
        {/* Top-left badge: discount takes priority over tag */}
        {discount > 0 ? (
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#EF4444', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '4px 7px', borderBottomRightRadius: 10 }}>
            {discount}% OFF
          </div>
        ) : p.tag && !p.tag.includes('%') ? (
          <div style={{
            position: 'absolute', top: 0, left: 0, fontSize: 9.5, fontWeight: 800, padding: '4px 7px', borderBottomRightRadius: 10,
            background: p.tag === 'Bestseller' ? '#F59E0B' : p.tag === 'Fresh' ? G : '#8B5CF6',
            color: '#fff'
          }}>
            {p.tag}
          </div>
        ) : null}
        {/* Weight pill */}
        <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: 'rgba(0,0,0,0.62)', color: '#fff', backdropFilter: 'blur(6px)', letterSpacing: '.02em' }}>
          {p.weight}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 10px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginBottom: 3, letterSpacing: '.03em', textTransform: 'uppercase' }}>{p.brand}</p>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1F2937', lineHeight: 1.35, marginBottom: 8, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</p>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#111827', fontFamily: "'Outfit',sans-serif" }}>₹{p.price}</span>
          {p.origPrice && (
            <span style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through', fontWeight: 500 }}>₹{p.origPrice}</span>
          )}
        </div>

        {/* Add/Remove stepper */}
        {qty > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 34, background: G_LIGHT, border: `1.5px solid ${G_BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <button onClick={onRemove} style={{ width: 34, height: '100%', background: 'none', border: 'none', color: G, cursor: 'pointer', fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              {qty === 1 ? <span style={{ fontSize: 14 }}><X size={13} /></span> : '−'}
            </button>
            <span style={{ fontSize: 14, fontWeight: 900, color: G, fontFamily: "'Outfit',sans-serif" }}>{qty}</span>
            <button onClick={onAdd} style={{ width: 34, height: '100%', background: 'none', border: 'none', color: G, cursor: 'pointer', fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            style={{ height: 34, background: '#fff', border: `1.5px solid ${G_BORDER}`, borderRadius: 10, color: G, fontWeight: 800, fontSize: 13, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all .15s', fontFamily: "'Outfit',sans-serif", letterSpacing: '.01em' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = G_LIGHT; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
          >
            <Plus size={14} strokeWidth={2.5} /> ADD
          </button>
        )}
      </div>
    </motion.div>
  );
}
