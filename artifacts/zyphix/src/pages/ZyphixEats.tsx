import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Clock, UtensilsCrossed, X, Plus, Minus, ShoppingCart, Zap, ChevronLeft, ChevronRight,
  Bike, BadgeIndianRupee, Sparkles, MapPin, ArrowRight, Leaf,
} from 'lucide-react';
import { restaurants, menuItems, FOOD_CUISINE_TYPES } from '@/data/mockData';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Eats — food delivery from neighbourhood restaurants
   Light, photographic, orange accent (#EA580C) on white cards.
──────────────────────────────────────────────────────────────────────────── */

type CartState = Record<string, number>;
type Restaurant = typeof restaurants[0];
type MenuItem = typeof menuItems[0];

const OR = '#EA580C';
const G = '#0DA366';
const HEAD: React.CSSProperties = { fontFamily: "'Outfit', sans-serif" };

const CUISINE_EMOJI: Record<string, string> = {
  'North Indian': '🍛', 'South Indian': '🥞', Biryani: '🍚', Pizza: '🍕', Burgers: '🍔',
  Momos: '🥟', Chinese: '🥡', Sweets: '🍬', 'Chai & Snacks': '☕', Healthy: '🥗',
};

const TAG_STYLE: Record<string, string> = {
  'Free Delivery': 'bg-emerald-600',
  Trending: 'bg-orange-600',
  New: 'bg-violet-600',
  Bestseller: 'bg-amber-500',
  '#1 Rated': 'bg-gray-900',
  Popular: 'bg-blue-600',
  Healthy: 'bg-emerald-600',
  Fast: 'bg-sky-600',
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .45, ease: 'easeOut' as const, delay },
});

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

  const popular = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const showPopular = activeCuisine === 'All' && !search;

  const activeR = activeRestaurant ? restaurants.find(r => r.id === activeRestaurant) : null;
  const activeMenu = activeRestaurant ? menuItems.filter(m => m.restaurantId === activeRestaurant) : [];

  const heroImage = restaurants[2]?.image || restaurants[0]?.image;

  return (
    <div className="relative min-h-[80vh]">
      <AnimatePresence mode="wait">
        {activeR ? (
          /* ── Restaurant detail / menu ── */
          <motion.div key="detail" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            {/* Photo header */}
            <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:mt-5 sm:rounded-3xl">
              <img src={activeR.image} alt={activeR.name} loading="lazy" className="h-[240px] w-full object-cover sm:h-[300px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
              <button onClick={() => setActiveRestaurant(null)}
                className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-bold text-gray-900 shadow transition hover:bg-white">
                <ChevronLeft size={15} /> All restaurants
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  {activeR.tags?.map(tag => (
                    <span key={tag} className={`rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-white ${TAG_STYLE[tag] || 'bg-gray-900'}`}>{tag}</span>
                  ))}
                </div>
                <h2 className="mt-2 text-[26px] font-black leading-tight tracking-[-0.03em] text-white sm:text-[34px]" style={HEAD}>{activeR.name}</h2>
                <p className="mt-1 text-[13.5px] text-white/80">{activeR.cuisine}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-gray-900">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {activeR.rating}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
                    <Clock size={12} /> {activeR.eta}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur ${activeR.deliveryFee === 0 ? 'bg-emerald-600' : 'bg-white/15'}`}>
                    <Bike size={12} /> {activeR.deliveryFee === 0 ? 'Free delivery' : `₹${activeR.deliveryFee} delivery`}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
                    Min order ₹{activeR.minOrder}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[.12em] text-orange-600">Menu</p>
                <h3 className="mt-0.5 text-[20px] font-black tracking-[-0.02em] text-gray-900" style={HEAD}>What's cooking</h3>
              </div>
              <span className="text-[13px] font-semibold text-gray-500">{activeMenu.length} items</span>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-4 flex flex-col gap-3">
              {activeMenu.map(item => (
                <motion.div key={item.id} variants={fadeUp}>
                  <MenuCard item={item} qty={cart[item.id] || 0} onAdd={() => add(item.id)} onRemove={() => remove(item.id)} />
                </motion.div>
              ))}
              {activeMenu.length === 0 && (
                <div className="rounded-3xl border border-gray-200 bg-white px-5 py-14 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><UtensilsCrossed size={26} /></span>
                  <p className="mt-4 text-[16px] font-black text-gray-900" style={HEAD}>Menu coming soon</p>
                  <p className="mt-1 text-[13.5px] text-gray-500">This restaurant is still setting up their menu.</p>
                </div>
              )}
            </motion.div>
          </motion.div>

        ) : (
          /* ── Restaurant list ── */
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Hero banner */}
            <section className="relative -mx-4 overflow-hidden sm:mx-0 sm:mt-5 sm:rounded-3xl">
              <img src={heroImage} alt="Food from neighbourhood restaurants" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="relative px-5 pb-7 pt-10 sm:px-10 sm:pb-10 sm:pt-16 lg:pt-20">
                <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[12.5px] font-bold text-white backdrop-blur">
                  <UtensilsCrossed size={14} className="text-orange-300" /> Zyphix Eats · Food delivery
                </motion.div>
                <motion.h1 {...fade(.05)} className="mt-4 max-w-[640px] text-[2.1rem] font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-[3rem] lg:text-[3.5rem]" style={HEAD}>
                  Food from your favourite local places
                </motion.h1>
                <motion.p {...fade(.1)} className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/85 sm:text-[16.5px]">
                  Dhabas, cloud kitchens and neighbourhood restaurants — delivered hot, with fair commissions so your favourite spots stay in business.
                </motion.p>

                {/* Search */}
                <motion.div {...fade(.15)} className="mt-6 flex max-w-[560px] items-center gap-2 rounded-2xl bg-white p-1.5 shadow-[0_12px_40px_rgba(0,0,0,.25)]">
                  <Search size={18} className="ml-3 shrink-0 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setActiveRestaurant(null); }}
                    placeholder="Search restaurants, dishes, cuisines…"
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-[14.5px] text-gray-900 outline-none placeholder:text-gray-400"
                  />
                  {search ? (
                    <button onClick={() => setSearch('')} aria-label="Clear search" className="mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200">
                      <X size={15} />
                    </button>
                  ) : (
                    <span className="hidden shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-white sm:inline-flex" style={{ background: OR }}>
                      Search
                    </span>
                  )}
                </motion.div>

                <motion.ul {...fade(.2)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-white/90">
                  <li className="flex items-center gap-1.5"><Clock size={14} className="text-orange-300" /> 25–40 min target</li>
                  <li className="flex items-center gap-1.5"><BadgeIndianRupee size={14} className="text-orange-300" /> Zero surge pricing</li>
                  <li className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-300" /> {restaurants.length} neighbourhood restaurants</li>
                </motion.ul>
              </div>
            </section>

            {/* Cuisine chips */}
            <motion.div {...fade(.25)} className="-mx-4 mt-5 flex items-center gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
              {FOOD_CUISINE_TYPES.map(c => {
                const active = activeCuisine === c;
                return (
                  <button key={c}
                    onClick={() => { setActiveCuisine(c); setActiveRestaurant(null); }}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition ${
                      active ? 'border-transparent text-white shadow-[0_6px_18px_rgba(234,88,12,.3)]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    style={active ? { background: OR } : undefined}>
                    {c === 'All'
                      ? <Sparkles size={14} className={active ? 'text-white' : 'text-orange-600'} />
                      : <span className="text-[15px] leading-none">{CUISINE_EMOJI[c] || '🍽️'}</span>}
                    {c}
                  </button>
                );
              })}
            </motion.div>

            {/* Popular near you */}
            {showPopular && (
              <section className="mt-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[.12em] text-orange-600">Popular near you</p>
                    <h2 className="mt-0.5 text-[22px] font-black tracking-[-0.03em] text-gray-900 sm:text-[26px]" style={HEAD}>Top-rated this week</h2>
                  </div>
                  <span className="hidden items-center gap-1 text-[13px] font-bold text-gray-500 sm:inline-flex">Scroll <ArrowRight size={14} /></span>
                </div>
                <motion.div variants={stagger} initial="hidden" animate="visible" className="-mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:px-0">
                  {popular.map(r => (
                    <motion.div key={r.id} variants={fadeUp} className="w-[270px] shrink-0 sm:w-[300px]">
                      <PopularCard restaurant={r} onClick={() => setActiveRestaurant(r.id)} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Full grid */}
            <section className="mt-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[.12em] text-orange-600">
                    {activeCuisine === 'All' ? 'All restaurants' : activeCuisine}
                  </p>
                  <h2 className="mt-0.5 text-[22px] font-black tracking-[-0.03em] text-gray-900 sm:text-[26px]" style={HEAD}>
                    {search ? `Results for “${search}”` : 'Order from nearby'}
                  </h2>
                </div>
                <span className="text-[13px] font-semibold text-gray-500">{filteredRestaurants.length} places</span>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="mt-4 rounded-3xl border border-gray-200 bg-white px-5 py-16 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><Search size={26} /></span>
                  <p className="mt-4 text-[17px] font-black text-gray-900" style={HEAD}>No restaurants found</p>
                  <p className="mt-1 text-[13.5px] text-gray-500">Try a different cuisine or search term.</p>
                  <button onClick={() => { setSearch(''); setActiveCuisine('All'); }} className="mt-5 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-white" style={{ background: OR }}>Clear filters</button>
                </div>
              ) : (
                <motion.div key={`${activeCuisine}-${search}`} variants={stagger} initial="hidden" animate="visible"
                  className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRestaurants.map(r => (
                    <motion.div key={r.id} variants={fadeUp}>
                      <RestaurantCard restaurant={r} onClick={() => setActiveRestaurant(r.id)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>

            {/* Partner band */}
            <section className="mt-10 overflow-hidden rounded-3xl p-6 text-white sm:p-8" style={{ background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)' }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[.12em] text-orange-100">Why Zyphix Eats</p>
                  <h3 className="mt-1 text-[20px] font-black tracking-[-0.02em] sm:text-[24px]" style={HEAD}>Fair commissions. Real neighbourhood kitchens.</h3>
                  <p className="mt-1.5 max-w-[520px] text-[14px] text-orange-50/90">No dark kitchens, no surge pricing — the restaurants you see are the ones around the corner.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[[<Clock size={14} />, '25–40 min target'], [<Leaf size={14} />, 'Veg clearly marked'], [<Bike size={14} />, 'Free delivery picks']].map(([icon, t], i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] font-bold backdrop-blur">{icon}{t}</span>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[998] bg-black/45 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 right-0 top-0 z-[999] flex w-full max-w-[380px] flex-col bg-white shadow-[-8px_0_40px_rgba(0,0,0,.12)]">

              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h3 className="text-[18px] font-black tracking-[-0.02em] text-gray-900" style={HEAD}>Your order</h3>
                  {totalItems > 0 && <p className="mt-0.5 text-[12.5px] font-medium text-gray-500">{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}</p>}
                </div>
                <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>

              {totalItems > 0 && (
                <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50 px-5 py-2.5 text-[12.5px] font-semibold text-orange-700">
                  <Zap size={13} /> Estimated delivery: <strong>{activeR?.eta || '30–40 min'}</strong>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4">
                {Object.entries(cart).map(([id, qty]) => {
                  const m = menuItems.find(x => x.id === id);
                  if (!m) return null;
                  return (
                    <motion.div key={id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                      <img src={m.image} alt={m.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-gray-900">{m.name}</p>
                        <p className="text-[11.5px] text-gray-500">₹{m.price} each</p>
                        <p className="mt-0.5 text-[13.5px] font-extrabold text-gray-900">₹{m.price * qty}</p>
                      </div>
                      <QtyStepper qty={qty} onAdd={() => add(id)} onRemove={() => remove(id)} />
                    </motion.div>
                  );
                })}
                {totalItems === 0 && (
                  <div className="pt-16 text-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ShoppingCart size={26} /></span>
                    <p className="mt-4 text-[16px] font-black text-gray-900" style={HEAD}>No items yet</p>
                    <p className="mt-1 text-[13px] text-gray-500">Browse restaurants and add dishes.</p>
                  </div>
                )}
              </div>

              {totalItems > 0 && (
                <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-5 py-4">
                  <div className="flex justify-between text-[13px] font-medium text-gray-500">
                    <span>Item total</span><span className="font-bold text-gray-900">₹{totalPrice}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-[13px] font-medium text-gray-500">
                    <span>Delivery fee</span><span className="font-bold" style={{ color: G }}>FREE</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-[15px] font-black text-gray-900" style={HEAD}>
                    <span>Grand total</span><span>₹{totalPrice}</span>
                  </div>
                  <button onClick={() => setCartOpen(false)}
                    className="mt-4 flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(234,88,12,.35)] transition hover:-translate-y-0.5"
                    style={{ background: OR, ...HEAD }}>
                    <span>Place order</span>
                    <span className="inline-flex items-center gap-1">₹{totalPrice} <ChevronRight size={16} /></span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Sticky "View cart" bar ── */}
      <AnimatePresence>
        {totalItems > 0 && !cartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-[76px] left-3 right-3 z-[90] mx-auto max-w-[520px] sm:bottom-6">
            <button onClick={() => setCartOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-white shadow-[0_12px_36px_rgba(234,88,12,.4)] transition hover:-translate-y-0.5"
              style={{ background: OR }}>
              <span className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-[13px] font-black">{totalItems}</span>
                <span className="text-left">
                  <span className="block text-[13.5px] font-bold">{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
                  <span className="block text-[11.5px] font-medium text-white/75">View cart</span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[16px] font-black" style={HEAD}>₹{totalPrice}</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20"><ShoppingCart size={15} /></span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Shared bits ─── */
function QtyStepper({ qty, onAdd, onRemove, size = 'sm' }: { qty: number; onAdd: () => void; onRemove: () => void; size?: 'sm' | 'md' }) {
  const btn = size === 'md' ? 'h-9 w-9' : 'h-8 w-8';
  return (
    <div className="inline-flex shrink-0 items-center overflow-hidden rounded-xl border border-orange-200 bg-orange-50">
      <button onClick={onRemove} aria-label="Remove one" className={`${btn} inline-flex items-center justify-center text-orange-700 transition hover:bg-orange-100`}><Minus size={14} strokeWidth={2.5} /></button>
      <span className="min-w-[22px] text-center text-[13px] font-black text-orange-700">{qty}</span>
      <button onClick={onAdd} aria-label="Add one" className={`${btn} inline-flex items-center justify-center text-orange-700 transition hover:bg-orange-100`}><Plus size={14} strokeWidth={2.5} /></button>
    </div>
  );
}

function DeliveryChip({ fee }: { fee: number }) {
  return fee === 0
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-bold text-emerald-700"><Bike size={12} /> Free delivery</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11.5px] font-semibold text-gray-600"><Bike size={12} /> ₹{fee} delivery</span>;
}

/* ─── Popular card (horizontal row) ─── */
function PopularCard({ restaurant: r, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group block w-full overflow-hidden rounded-3xl border border-gray-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.12)]">
      <div className="relative h-[180px] overflow-hidden">
        <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {r.tags?.slice(0, 2).map(tag => (
            <span key={tag} className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white ${TAG_STYLE[tag] || 'bg-gray-900'}`}>{tag}</span>
          ))}
        </div>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold text-gray-900 shadow">
          <Clock size={11} className="text-orange-600" /> {r.eta}
        </span>
        <div className="absolute bottom-3 left-3 right-24">
          <p className="truncate text-[17px] font-black tracking-[-0.02em] text-white" style={HEAD}>{r.name}</p>
          <p className="truncate text-[12px] text-white/80">{r.cuisine}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <DeliveryChip fee={r.deliveryFee} />
        <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-gray-900">
          <Star size={12} className="fill-amber-400 text-amber-400" /> {r.rating}
        </span>
      </div>
    </button>
  );
}

/* ─── Restaurant card (grid) ─── */
function RestaurantCard({ restaurant: r, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  const menuCount = menuItems.filter(m => m.restaurantId === r.id).length;
  return (
    <button onClick={onClick} className="group block w-full overflow-hidden rounded-3xl border border-gray-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.10)]">
      <div className="relative h-[170px] overflow-hidden">
        <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {r.tags?.slice(0, 2).map(tag => (
            <span key={tag} className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white ${TAG_STYLE[tag] || 'bg-gray-900'}`}>{tag}</span>
          ))}
        </div>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold text-gray-900 shadow">
          <Clock size={11} className="text-orange-600" /> {r.eta}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="min-w-0 flex-1 truncate text-[16px] font-black tracking-[-0.02em] text-gray-900" style={HEAD}>{r.name}</h4>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-2 py-0.5 text-[12px] font-extrabold text-white">
            <Star size={10} className="fill-white text-white" /> {r.rating}
          </span>
        </div>
        <p className="mt-1 truncate text-[12.5px] text-gray-500">{r.cuisine}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
          <DeliveryChip fee={r.deliveryFee} />
          <span className="text-[11.5px] text-gray-500">Min ₹{r.minOrder}</span>
          {menuCount > 0 && <span className="ml-auto text-[11.5px] font-bold text-orange-600">{menuCount} dishes</span>}
        </div>
      </div>
    </button>
  );
}

/* ─── Menu item ─── */
function MenuCard({ item: m, qty, onAdd, onRemove }: { item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void }) {
  const discount = m.origPrice ? Math.round((1 - m.price / m.origPrice) * 100) : 0;
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-gray-200 bg-white p-4 transition hover:shadow-[0_8px_24px_rgba(11,18,32,.06)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-100 sm:h-28 sm:w-28">
        <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
        {discount > 0 && (
          <span className="absolute right-0 top-0 rounded-bl-lg bg-rose-600 px-1.5 py-0.5 text-[9.5px] font-extrabold text-white">{discount}% OFF</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-2 ${m.isVeg ? 'border-emerald-600' : 'border-rose-600'}`} aria-label={m.isVeg ? 'Veg' : 'Non-veg'}>
            <span className={`h-1.5 w-1.5 rounded-full ${m.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
          </span>
          <p className="min-w-0 flex-1 truncate text-[14.5px] font-bold text-gray-900">{m.name}</p>
          {m.tag && (
            <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white ${m.tag === 'Bestseller' ? 'bg-amber-500' : 'bg-violet-600'}`}>{m.tag}</span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-gray-500">{m.desc}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-black text-gray-900" style={HEAD}>₹{m.price}</span>
            {m.origPrice && <span className="text-[11.5px] text-gray-400 line-through">₹{m.origPrice}</span>}
          </div>
          {qty > 0 ? (
            <QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} size="md" />
          ) : (
            <button onClick={onAdd}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-orange-200 bg-white px-4 text-[13px] font-extrabold text-orange-700 transition hover:bg-orange-50"
              style={HEAD}>
              <Plus size={14} strokeWidth={2.5} /> ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
