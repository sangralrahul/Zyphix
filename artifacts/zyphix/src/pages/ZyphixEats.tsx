import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, Utensils, X, Plus, Minus, ShoppingCart, Zap, ChevronLeft, ChevronRight, Flame, Tag } from 'lucide-react';
import { restaurants, menuItems, FOOD_CUISINE_TYPES } from '@/data/mockData';

type CartState = Record<string, number>;

const OR = '#F97316';
const OR_LIGHT = 'rgba(249,115,22,0.08)';
const OR_BORDER = 'rgba(249,115,22,0.25)';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

export function ZyphixEats() {
  const initCuisine = () => {
    try { return localStorage.getItem('zyphix_food_cat') || 'All'; } catch { return 'All'; }
  };

  const [activeCuisine, setActiveCuisine] = useState<string>(initCuisine);
  const [search, setSearch] = useState('');
  const [activeRestaurant, setActiveRestaurant] = useState<string | null>(null);
  const [cart, setCart] = useState<CartState>({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try { localStorage.removeItem('zyphix_food_cat'); } catch {}
  }, []);

  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id: string) => setCart(c => {
    const n = { ...c };
    if ((n[id] || 0) > 1) n[id]--;
    else delete n[id];
    return n;
  });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const m = menuItems.find(x => x.id === id);
    return sum + (m ? m.price * qty : 0);
  }, 0);

  const filteredRestaurants = restaurants.filter(r => {
    const cuisineMatch = activeCuisine === 'All' || r.cuisineType === activeCuisine;
    const searchMatch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    return cuisineMatch && searchMatch;
  });

  const activeR = activeRestaurant ? restaurants.find(r => r.id === activeRestaurant) : null;
  const activeMenu = activeRestaurant ? menuItems.filter(m => m.restaurantId === activeRestaurant) : [];

  return (
    <div style={{ minHeight: '80vh', position: 'relative', background: '#F8F9FA' }}>

      {/* ── Hero strip ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
            <Utensils size={19} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: '#111827', letterSpacing: '-.03em', fontFamily: "'Outfit',sans-serif", margin: 0 }}>ZyphixEats</h1>
              <span style={{ fontSize: 10, fontWeight: 700, background: OR_LIGHT, color: OR, border: `1px solid ${OR_BORDER}`, borderRadius: 99, padding: '2px 8px' }}>FOOD</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: OR }}>
                <Clock size={10} /> 25–40 min delivery
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D1D5DB' }} />
              <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{restaurants.length} restaurants</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, color: OR, background: OR_LIGHT, border: `1px solid ${OR_BORDER}`, borderRadius: 8, padding: '5px 10px' }}>
            <Flame size={12} /> Hot deals
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ background: '#fff', padding: '10px 0 0', borderBottom: '1px solid #EAEAEA' }}>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveRestaurant(null); }}
            placeholder="Search restaurants, dishes, cuisines…"
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 40, paddingRight: search ? 36 : 14, paddingTop: 10, paddingBottom: 10, borderRadius: 10, background: '#F3F4F6', border: '1.5px solid transparent', color: '#111827', fontSize: 13, outline: 'none', fontFamily: "'Inter',sans-serif" }}
            onFocus={e => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = OR_BORDER; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.06)'; }}
            onBlur={e => { e.target.style.background = '#F3F4F6'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#E5E7EB', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', cursor: 'pointer' }}>
              <X size={11} />
            </button>
          )}
        </div>

        {/* Cuisine filter pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          <style>{`.cuisine-scroll::-webkit-scrollbar{display:none}`}</style>
          <div className="cuisine-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 0 }}>
            {FOOD_CUISINE_TYPES.map(c => {
              const active = activeCuisine === c;
              return (
                <button key={c}
                  onClick={() => { setActiveCuisine(c); setActiveRestaurant(null); }}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 99, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                    border: `1.5px solid ${active ? OR : '#E5E7EB'}`,
                    background: active ? OR : '#fff',
                    color: active ? '#fff' : '#374151',
                  }}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '14px 0 80px' }}>
        <AnimatePresence mode="wait">
          {activeR ? (
            /* ── Restaurant Detail View ── */
            <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
              {/* Back */}
              <button onClick={() => setActiveRestaurant(null)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, color: '#374151', cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 14, padding: '7px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <ChevronLeft size={15} /> All restaurants
              </button>

              {/* Restaurant hero banner */}
              <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 16, position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                <img src={activeR.image} alt={activeR.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 35%, rgba(0,0,0,.1) 70%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Outfit',sans-serif", marginBottom: 4, margin: '0 0 4px' }}>{activeR.name}</h2>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)', margin: '0 0 12px' }}>{activeR.cuisine}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#fff', background: 'rgba(34,197,94,0.9)', padding: '4px 10px', borderRadius: 8 }}>
                      <Star size={11} style={{ fill: '#fff' }} />{activeR.rating}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 8, backdropFilter: 'blur(8px)' }}>
                      <Clock size={11} />{activeR.eta}
                    </span>
                    <span style={{ fontSize: 12, color: activeR.deliveryFee === 0 ? '#fff' : '#fff', background: activeR.deliveryFee === 0 ? 'rgba(13,163,102,0.9)' : 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>
                      {activeR.deliveryFee === 0 ? '🚴 Free delivery' : `₹${activeR.deliveryFee} delivery`}
                    </span>
                    <span style={{ fontSize: 12, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 8, backdropFilter: 'blur(8px)' }}>
                      Min ₹{activeR.minOrder}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>Menu</h3>
                <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{activeMenu.length} items</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeMenu.map(item => (
                  <MenuCard key={item.id} item={item} qty={cart[item.id] || 0} onAdd={() => add(item.id)} onRemove={() => remove(item.id)} />
                ))}
                {activeMenu.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🍽️</div>
                    <p style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>Menu coming soon</p>
                    <p style={{ fontSize: 13 }}>This restaurant is setting up their menu</p>
                  </div>
                )}
              </div>
            </motion.div>

          ) : (
            /* ── Restaurant List ── */
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { icon: <Utensils size={11} />, label: `${filteredRestaurants.length} restaurants`, color: OR },
                  { icon: <Clock size={11} />, label: '25–40 min delivery', color: '#0DA366' },
                  { icon: <Tag size={11} />, label: 'Free delivery available', color: '#6366F1' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: s.color, background: `${s.color}12`, border: `1px solid ${s.color}28`, borderRadius: 99, padding: '4px 10px' }}>
                    {s.icon}{s.label}
                  </div>
                ))}
              </div>

              {filteredRestaurants.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🍽️</div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>No restaurants found</p>
                  <p style={{ fontSize: 13, color: '#6B7280' }}>Try a different cuisine filter or search term</p>
                </div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="visible"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                  {filteredRestaurants.map(r => (
                    <motion.div key={r.id} variants={fadeUp}>
                      <RestaurantCard restaurant={r} onClick={() => setActiveRestaurant(r.id)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: '#111827', fontFamily: "'Outfit',sans-serif", margin: 0 }}>Your Order</h3>
                  {totalItems > 0 && <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0', fontWeight: 500 }}>{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}</p>}
                </div>
                <button onClick={() => setCartOpen(false)} style={{ width: 32, height: 32, borderRadius: 10, background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280' }}>
                  <X size={16} />
                </button>
              </div>

              {totalItems > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: '#FFF7ED', borderBottom: '1px solid #FFEDD5', fontSize: 12, fontWeight: 600, color: OR }}>
                  <Zap size={12} /> Estimated delivery: <strong>{activeR?.eta || '30–40 min'}</strong>
                </div>
              )}

              {/* Items */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(cart).map(([id, qty]) => {
                  const m = menuItems.find(x => x.id === id);
                  if (!m) return null;
                  return (
                    <motion.div key={id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#FAFAFA', borderRadius: 14, border: '1px solid #F3F4F6' }}>
                      <img src={m.image} alt={m.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid #EAEAEA' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{m.name}</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 4px' }}>₹{m.price} each</p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: 0 }}>₹{m.price * qty}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', background: OR_LIGHT, border: `1.5px solid ${OR_BORDER}`, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <button onClick={() => remove(id)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: OR, cursor: 'pointer', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: 13, fontWeight: 900, color: OR, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                        <button onClick={() => add(id)} style={{ width: 30, height: 30, background: 'none', border: 'none', color: OR, cursor: 'pointer', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </motion.div>
                  );
                })}
                {totalItems === 0 && (
                  <div style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ fontSize: 52, marginBottom: 14 }}>🍽️</div>
                    <p style={{ fontWeight: 800, color: '#111827', marginBottom: 6, fontSize: 16, fontFamily: "'Outfit',sans-serif" }}>No items yet</p>
                    <p style={{ fontSize: 13, color: '#6B7280' }}>Browse restaurants and add dishes</p>
                  </div>
                )}
              </div>

              {/* Checkout */}
              {totalItems > 0 && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #EAEAEA', background: '#FAFAFA', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                    <span>Item total</span><span style={{ color: '#111827', fontWeight: 700 }}>₹{totalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                    <span>Delivery fee</span><span style={{ color: '#0DA366', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14, color: '#111827', fontWeight: 900, borderTop: '1px solid #EAEAEA', paddingTop: 10, marginTop: 10, fontFamily: "'Outfit',sans-serif" }}>
                    <span>Grand Total</span><span>₹{totalPrice}</span>
                  </div>
                  <button onClick={() => setCartOpen(false)}
                    style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(249,115,22,.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'Outfit',sans-serif" }}>
                    <span>Place Order</span>
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
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: '14px 20px', background: 'linear-gradient(135deg, #F97316, #EA580C)', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(249,115,22,.45)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff' }}>{totalItems}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#fff' }}>{totalItems} item{totalItems > 1 ? 's' : ''} added</p>
                  <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>View your order</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 15, fontFamily: "'Outfit',sans-serif" }}>₹{totalPrice}</p>
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

/* ─── Restaurant Card ─── */
type Restaurant = typeof restaurants[0];

function RestaurantCard({ restaurant: r, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  const menuCount = menuItems.filter(m => m.restaurantId === r.id).length;
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      style={{ borderRadius: 18, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', cursor: 'pointer', border: '1px solid #F0F0F0' }}>

      {/* Image */}
      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
        <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }}
          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'}
          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55) 20%, transparent 65%)' }} />
        {/* Tag badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {r.tags?.slice(0, 2).map(tag => (
            <span key={tag} style={{ fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: '.02em',
              background: tag === 'Free Delivery' ? '#0DA366' : tag === 'Trending' ? '#F97316' : tag === 'New' ? '#8B5CF6' : '#1D4ED8',
              color: '#fff' }}>
              {tag}
            </span>
          ))}
        </div>
        {/* ETA pill on image */}
        <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '4px 9px', borderRadius: 8, backdropFilter: 'blur(8px)' }}>
          <Clock size={10} /> {r.eta}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
          <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, color: '#111827', margin: 0, flex: 1, minWidth: 0, marginRight: 8 }}>{r.name}</h4>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 800, color: '#fff', background: '#22C55E', padding: '3px 8px', borderRadius: 7, flexShrink: 0 }}>
            <Star size={10} style={{ fill: '#fff', stroke: 'none' }} />{r.rating}
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.cuisine}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderTop: '1px solid #F3F4F6', paddingTop: 10 }}>
          <span style={{ fontSize: 11.5, color: r.deliveryFee === 0 ? '#0DA366' : '#6B7280', fontWeight: r.deliveryFee === 0 ? 700 : 500, flex: 1 }}>
            {r.deliveryFee === 0 ? '🚴 Free delivery' : `₹${r.deliveryFee} delivery`}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>Min ₹{r.minOrder}</span>
          {menuCount > 0 && (
            <span style={{ fontSize: 11, color: '#F97316', fontWeight: 700, marginLeft: 10 }}>{menuCount} dishes</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Menu Item Card ─── */
type MenuItem = typeof menuItems[0];

function MenuCard({ item: m, qty, onAdd, onRemove }: { item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void }) {
  const discount = m.origPrice ? Math.round((1 - m.price / m.origPrice) * 100) : 0;
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0F0F0', alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      {/* Thumb */}
      <div style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid #F3F4F6' }}>
        <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {discount > 0 && (
          <div style={{ position: 'absolute', top: 0, right: 0, background: '#EF4444', color: '#fff', fontSize: 8.5, fontWeight: 800, padding: '3px 6px', borderBottomLeftRadius: 8 }}>
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, border: `2px solid ${m.isVeg ? '#22c55e' : '#ef4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.isVeg ? '#22c55e' : '#ef4444', display: 'block' }} />
          </span>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, flex: 1 }}>{m.name}</p>
          {m.tag && (
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5, background: m.tag === 'Bestseller' ? '#F59E0B' : '#8B5CF6', color: '#fff', flexShrink: 0 }}>{m.tag}</span>
          )}
        </div>
        <p style={{ fontSize: 11.5, color: '#6B7280', marginBottom: 10, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 10px' }}>{m.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#111827', fontFamily: "'Outfit',sans-serif" }}>₹{m.price}</span>
            {m.origPrice && <span style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through' }}>₹{m.origPrice}</span>}
          </div>
          {qty > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', background: OR_LIGHT, border: `1.5px solid ${OR_BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={onRemove} style={{ width: 32, height: 32, background: 'none', border: 'none', color: OR, cursor: 'pointer', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: 13, fontWeight: 900, color: OR, minWidth: 20, textAlign: 'center' }}>{qty}</span>
              <button onClick={onAdd} style={{ width: 32, height: 32, background: 'none', border: 'none', color: OR, cursor: 'pointer', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          ) : (
            <button onClick={onAdd}
              style={{ height: 32, padding: '0 16px', borderRadius: 10, background: '#fff', border: `1.5px solid ${OR_BORDER}`, color: OR, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Outfit',sans-serif", transition: 'all .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = OR_LIGHT}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff'}>
              <Plus size={13} strokeWidth={2.5} /> ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
