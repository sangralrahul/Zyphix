import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, X, Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurants, menuItems, FOOD_CUISINE_TYPES } from '@/data/mockData';
import { usePartners, tagList } from '@/lib/partners';
import { Chip, Card, Button, G, FONT } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Eats — restaurants near you.
   Stripe-neutral app page: Inter, 13–15px UI type, 1px borders, the
   restaurants and dishes are the visual. No hero, no promo copy.
──────────────────────────────────────────────────────────────────────────── */

type CartState = Record<string, number>;
type MockRestaurant = typeof restaurants[0];
/** Mock restaurants plus live registrations (no rating / image until they go live). */
type Restaurant = Omit<MockRestaurant, 'rating' | 'tags'> & { rating?: number; tags?: string[]; registered?: boolean };
type MenuItem = typeof menuItems[0];

/** Best cuisine chip for a registered restaurant, from its tags/category text. Falls back to 'All'. */
function matchCuisineType(text: string): string {
  const t = text.toLowerCase();
  if (!t) return 'All';
  const direct = FOOD_CUISINE_TYPES.find(c => c !== 'All' && t.includes(c.toLowerCase()));
  if (direct) return direct;
  const hints: [RegExp, string][] = [
    [/biryani|mughlai|kebab/, 'Biryani'], [/pizza|pasta|italian/, 'Pizza'], [/burger|wrap|sandwich/, 'Burgers'],
    [/momo|dimsum|tibetan/, 'Momos'], [/chinese|noodle|manchurian|hakka/, 'Chinese'], [/sweet|mithai|dessert|bakery|cake/, 'Sweets'],
    [/chai|tea|coffee|snack|maggi|cafe|café/, 'Chai & Snacks'], [/health|salad|juice|vegan|bowl/, 'Healthy'],
    [/dosa|idli|sambhar|udupi|south/, 'South Indian'], [/dhaba|punjabi|dal|paneer|thali|tandoor|north|chole|roti/, 'North Indian'],
  ];
  return hints.find(([re]) => re.test(t))?.[1] ?? 'All';
}

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || '•';

/** Flat initials tile used in place of a photo for registered restaurants. */
function InitialsTile({ name, className = '', size = 'lg' }: { name: string; className?: string; size?: 'sm' | 'lg' }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-700 ${className}`} aria-hidden>
      <span className={`font-semibold tracking-[-0.02em] ${size === 'sm' ? 'text-[15px]' : 'text-[22px]'}`}>{initialsOf(name)}</span>
    </div>
  );
}

const feeLabel = (fee: number) => (fee === 0 ? 'Free delivery' : `₹${fee} delivery`);

const enter = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, ease: 'easeOut' as const } };

export function ZyphixEats() {
  const initCuisine = () => {
    try { return localStorage.getItem('zyphix_food_cat') || 'All'; } catch { return 'All'; }
  };

  const [activeCuisine, setActiveCuisine] = useState<string>(initCuisine);
  const [search, setSearch] = useState('');
  const [activeRestaurant, setActiveRestaurant] = useState<string | null>(null);
  const [cart, setCart] = useState<CartState>({});
  const [cartOpen, setCartOpen] = useState(false);

  /* Live registrations from the partner directory, shown ahead of the mock list. */
  const { partners } = usePartners('restaurant');
  const registered: Restaurant[] = partners.map(p => ({
    id: 'p-' + p.id,
    name: p.name,
    cuisine: p.tags || p.category || 'Neighbourhood restaurant',
    cuisineType: matchCuisineType([...tagList(p.tags || ''), p.category || ''].join(' ')),
    rating: undefined,
    eta: '30–40 min',
    deliveryFee: 0,
    minOrder: 149,
    image: '',
    tags: ['New on Zyphix'],
    registered: true,
  }));
  const allRestaurants: Restaurant[] = [...registered, ...restaurants];

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

  const filteredRestaurants = allRestaurants.filter(r => {
    const cuisineMatch = activeCuisine === 'All' || r.cuisineType === activeCuisine;
    const searchMatch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    return cuisineMatch && searchMatch;
  });

  const popular = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const showPopular = activeCuisine === 'All' && !search;

  const activeR = activeRestaurant ? allRestaurants.find(r => r.id === activeRestaurant) : null;
  const activeMenu = activeRestaurant ? menuItems.filter(m => m.restaurantId === activeRestaurant) : [];

  return (
    <div className="relative mx-auto min-h-[70vh] w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
      {activeR ? (
        /* ── Restaurant detail / menu ── */
        <motion.div key={activeR.id} {...enter}>
          <button onClick={() => setActiveRestaurant(null)}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-600 transition hover:text-gray-900">
            <ChevronLeft size={15} /> All restaurants
          </button>

          <Card hover={false} className="mt-3 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-[120px] shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:w-[160px]" style={{ aspectRatio: '16 / 10' }}>
                {activeR.image
                  ? <img src={activeR.image} alt={activeR.name} loading="lazy" className="h-full w-full object-cover" />
                  : <InitialsTile name={activeR.name} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-gray-900">{activeR.name}</h1>
                  {activeR.registered && <Chip tone="green">New</Chip>}
                </div>
                <p className="mt-0.5 truncate text-[13px] text-gray-500">{activeR.cuisine}</p>
                <p className="mt-2 text-[12px] text-gray-600">
                  {activeR.eta} · Min order ₹{activeR.minOrder} · {feeLabel(activeR.deliveryFee)}
                  {activeR.rating !== undefined && (
                    <span className="ml-2 inline-flex items-center gap-1 text-gray-900"><Star size={11} className="fill-gray-900 text-gray-900" />{activeR.rating}</span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-5 flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-gray-900">Menu</h2>
            <span className="text-[13px] text-gray-500">{activeMenu.length} item{activeMenu.length === 1 ? '' : 's'}</span>
          </div>

          {activeMenu.length > 0 ? (
            <Card hover={false} className="mt-3 divide-y divide-gray-100 rounded-xl">
              {activeMenu.map(item => (
                <MenuRow key={item.id} item={item} qty={cart[item.id] || 0} onAdd={() => add(item.id)} onRemove={() => remove(item.id)} />
              ))}
            </Card>
          ) : (
            <Card hover={false} className="mt-3 rounded-xl px-4 py-5">
              <p className="text-[14px] font-semibold text-gray-900">Menu coming soon</p>
              <p className="mt-0.5 text-[13px] text-gray-500">
                {activeR.registered ? 'This restaurant just joined Zyphix — their menu is being set up.' : 'This restaurant is still setting up their menu.'}
              </p>
            </Card>
          )}
        </motion.div>
      ) : (
        /* ── Restaurant list ── */
        <motion.div key="list" {...enter}>
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-gray-900">Zyphix Eats</h1>
              <span className="text-[13px] text-gray-500">Restaurants near you · {allRestaurants.length} open</span>
            </div>
            <label className="ml-auto flex h-9 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 sm:w-[240px]">
              <Search size={14} className="shrink-0 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveRestaurant(null); }}
                placeholder="Search restaurants"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-gray-900 outline-none placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search" className="text-gray-400 transition hover:text-gray-700"><X size={14} /></button>
              )}
            </label>
          </div>

          {/* Cuisine chips */}
          <div className="-mx-4 mt-3 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
            {FOOD_CUISINE_TYPES.map(c => {
              const active = activeCuisine === c;
              return (
                <button key={c}
                  onClick={() => { setActiveCuisine(c); setActiveRestaurant(null); }}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                    active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}>
                  {c}
                </button>
              );
            })}
          </div>

          {/* Popular */}
          {showPopular && (
            <section className="mt-6">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-gray-900">Popular</h2>
              <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
                {popular.map(r => (
                  <div key={r.id} className="w-[220px] shrink-0">
                    <RestaurantCard restaurant={r} onClick={() => setActiveRestaurant(r.id)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Grid */}
          <section className="mt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-gray-900">
                {search ? `Results for “${search}”` : activeCuisine === 'All' ? 'All restaurants' : activeCuisine}
              </h2>
              <span className="text-[13px] text-gray-500">{filteredRestaurants.length} place{filteredRestaurants.length === 1 ? '' : 's'}</span>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="mt-3 py-10 text-[13px] text-gray-500">
                No restaurants match.{' '}
                <button onClick={() => { setSearch(''); setActiveCuisine('All'); }} className="font-semibold text-emerald-700 hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredRestaurants.map(r => (
                  <RestaurantCard key={r.id} restaurant={r} onClick={() => setActiveRestaurant(r.id)} />
                ))}
              </div>
            )}
          </section>
        </motion.div>
      )}

      {/* ── Cart drawer ── */}
      {cartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
            onClick={() => setCartOpen(false)} className="fixed inset-0 z-[998] bg-gray-900/40" />
          <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-0 right-0 top-0 z-[999] flex w-full max-w-[380px] flex-col border-l border-gray-200 bg-white" style={{ fontFamily: FONT }}>
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900">Your order</h3>
                {totalItems > 0 && <p className="text-[12px] text-gray-500">{totalItems} item{totalItems > 1 ? 's' : ''} · Delivery in {activeR?.eta || '30–40 min'}</p>}
              </div>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {totalItems === 0 ? (
                <p className="px-4 py-10 text-center text-[13px] text-gray-500">No items yet. Browse a menu and add dishes.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {Object.entries(cart).map(([id, qty]) => {
                    const m = menuItems.find(x => x.id === id);
                    if (!m) return null;
                    return (
                      <div key={id} className="flex items-center gap-3 px-4 py-3">
                        <img src={m.image} alt={m.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-gray-900">{m.name}</p>
                          <p className="text-[12px] text-gray-500">₹{m.price} × {qty}</p>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-900">₹{m.price * qty}</span>
                        <QtyStepper qty={qty} onAdd={() => add(id)} onRemove={() => remove(id)} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {totalItems > 0 && (
              <div className="shrink-0 border-t border-gray-200 bg-[#FAFAFA] px-4 py-3">
                <div className="flex justify-between text-[13px] text-gray-600"><span>Item total</span><span className="text-gray-900">₹{totalPrice}</span></div>
                <div className="mt-1 flex justify-between text-[13px] text-gray-600"><span>Delivery fee</span><span className="font-medium text-emerald-700">Free</span></div>
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-[14px] font-semibold text-gray-900"><span>Total</span><span>₹{totalPrice}</span></div>
                <Button size="sm" className="mt-3 w-full" onClick={() => setCartOpen(false)}>Place order · ₹{totalPrice}</Button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ── Sticky "View cart" bar ── */}
      {totalItems > 0 && !cartOpen && (
        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}
          className="fixed bottom-[76px] left-3 right-3 z-[90] mx-auto max-w-[480px] sm:bottom-5">
          <button onClick={() => setCartOpen(true)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-white shadow-[0_8px_24px_rgba(11,15,25,.18)]"
            style={{ background: G }}>
            <span className="flex items-center gap-2 text-[13px] font-medium">
              <ShoppingBag size={15} /> {totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}
            </span>
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold">View cart <ChevronRight size={15} /></span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Shared bits ─── */
function QtyStepper({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className="inline-flex h-7 shrink-0 items-center overflow-hidden rounded-full border text-white" style={{ background: G, borderColor: G }}>
      <button onClick={onRemove} aria-label="Remove one" className="inline-flex h-7 w-7 items-center justify-center transition hover:bg-white/15"><Minus size={13} strokeWidth={2.5} /></button>
      <span className="min-w-[18px] text-center text-[12.5px] font-semibold">{qty}</span>
      <button onClick={onAdd} aria-label="Add one" className="inline-flex h-7 w-7 items-center justify-center transition hover:bg-white/15"><Plus size={13} strokeWidth={2.5} /></button>
    </div>
  );
}

/* ─── Restaurant card ─── */
function RestaurantCard({ restaurant: r, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group block w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:border-gray-300">
      <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '16 / 10' }}>
        {r.image
          ? <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover" />
          : <InitialsTile name={r.name} />}
        {r.registered && <Chip tone="green" className="absolute left-2 top-2">New</Chip>}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-[-0.01em] text-gray-900">{r.name}</p>
          {r.rating !== undefined && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-gray-900">
              <Star size={11} className="fill-gray-900 text-gray-900" />{r.rating}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[13px] text-gray-500">{r.cuisine}</p>
        <p className="mt-1.5 truncate text-[12px] text-gray-600">{r.eta} · Min ₹{r.minOrder} · {feeLabel(r.deliveryFee)}</p>
      </div>
    </button>
  );
}

/* ─── Menu row ─── */
function MenuRow({ item: m, qty, onAdd, onRemove }: { item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className={`mt-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${m.isVeg ? 'border-emerald-600' : 'border-red-600'}`} aria-label={m.isVeg ? 'Veg' : 'Non-veg'} title={m.isVeg ? 'Veg' : 'Non-veg'}>
        <span className={`h-1.5 w-1.5 rounded-full ${m.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-gray-900">{m.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-[1.5] text-gray-500">{m.desc}</p>
        <p className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[14px] font-semibold text-gray-900">₹{m.price}</span>
          {m.origPrice && <span className="text-[12px] text-gray-400 line-through">₹{m.origPrice}</span>}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <img src={m.image} alt={m.name} loading="lazy" className="h-[72px] w-[72px] rounded-lg border border-gray-200 object-cover" />
        {qty > 0 ? (
          <QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
        ) : (
          <button onClick={onAdd}
            className="inline-flex h-7 items-center rounded-full border bg-white px-3.5 text-[12.5px] font-semibold transition hover:bg-emerald-50"
            style={{ borderColor: G, color: G }}>
            ADD
          </button>
        )}
      </div>
    </div>
  );
}
