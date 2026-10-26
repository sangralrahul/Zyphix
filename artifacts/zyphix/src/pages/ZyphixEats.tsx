import React, { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import { Search, Star, X, Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurants, menuItems, FOOD_CUISINE_TYPES } from '@/data/mockData';
import { usePartners, tagList } from '@/lib/partners';
import { Chip, Card, Button, G, FONT } from '@/ui/kit';
import { VideoHero, Reveal, Kicker } from '@/ui/cinema';
import { Spotlight, SplitHeadline } from '@/ui/motion2';
import { VIDEOS } from '@/data/media';
import { TonightsPicks, CuisineTiles, PartnerStrip, RestaurantCta, fallbackPhoto, EatsHeroLiveOrder, HungryBand, EatsTrackBand, DISPLAY } from './eats/picks';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Eats — restaurants near you.
   Cinematic top (video hero + search + cuisine chips, "Tonight's picks" bento,
   cuisine photo tiles), then the 13–15px UI shop: restaurant grid, menus, cart.
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
    <div className="relative mx-auto min-h-[70vh] w-full max-w-[1180px] pt-0 text-gray-900 md:pt-4" style={{ fontFamily: FONT }}>
      {activeR ? (
        /* ── Restaurant detail / menu ── */
        <motion.div key={activeR.id} {...enter} className="pt-4 md:pt-0">
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
          {/* Hero: video, headline, search, cuisine chips */}
          <div className="-mx-4 md:mx-0">
            <VideoHero clip={VIDEOS.food} height="min-h-[50svh] md:min-h-[60svh]" dim={0.4} className="md:rounded-3xl">
              <EatsHeroLiveOrder />
              <div className="px-4 pb-7 pt-14 md:px-10 md:pb-10 md:pt-16">
                <Kicker light>Zyphix Eats</Kicker>
                <SplitHeadline className={`${DISPLAY} max-w-[15ch] text-[38px] leading-[1.0] text-white sm:text-[48px] md:text-[64px]`}
                  parts={["Your city's best kitchens, at your", { accent: 'door.', green: true }]} />
                <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-white/75 md:text-[17px]">
                  Biryani houses, pizza ovens, momo stalls and cafés near you, cooked to order and tracked to your door.
                </p>
                <form role="search" onSubmit={e => e.preventDefault()}
                  className="relative z-10 mt-5 flex h-12 max-w-[640px] items-center gap-2 rounded-2xl bg-white pl-4 pr-1.5 text-gray-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,.6)] md:mt-6 md:h-14">
                  <Search size={18} className="shrink-0 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setActiveRestaurant(null); }}
                    placeholder="Search restaurants or dishes"
                    aria-label="Search restaurants"
                    className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400 md:text-[16px]"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={15} /></button>
                  )}
                  <span className="hidden h-9 items-center rounded-xl px-4 text-[13.5px] font-semibold text-white md:inline-flex md:h-11 md:px-5" style={{ background: `linear-gradient(180deg, #13B874 0%, ${G} 100%)` }}>
                    {allRestaurants.length} open
                  </span>
                </form>
                <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar xl:max-w-[calc(100%-340px)]">
                  {FOOD_CUISINE_TYPES.map(c => {
                    const active = activeCuisine === c;
                    return (
                      <button key={c} type="button" aria-pressed={active}
                        onClick={() => { setActiveCuisine(c); setActiveRestaurant(null); }}
                        className={`h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-medium backdrop-blur-md transition ${
                          active ? 'border-white bg-white text-gray-900' : 'border-white/20 bg-white/10 text-white/90 hover:bg-white/20'
                        }`}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </VideoHero>
          </div>

          {/* Tonight's picks + cuisine tiles (home state only) */}
          {showPopular && (
            <>
              <TonightsPicks picks={popular.slice(0, 3)} onOpen={setActiveRestaurant} />
              <CuisineTiles cuisines={FOOD_CUISINE_TYPES.filter(c => c !== 'All')} active={activeCuisine}
                onPick={c => { setActiveCuisine(c); setActiveRestaurant(null); document.getElementById('eats-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} />
              <HungryBand />
            </>
          )}

          {/* Grid */}
          <section id="eats-grid" className="mt-8 scroll-mt-20 md:mt-10">
            <Reveal y={12} amount={0.4} className="flex items-baseline justify-between gap-3">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-gray-900 md:text-[18px]">
                {search ? `Results for “${search}”` : activeCuisine === 'All' ? 'All restaurants' : activeCuisine}
              </h2>
              <span className="flex items-center gap-3 text-[13px] text-gray-500">
                {filteredRestaurants.length} place{filteredRestaurants.length === 1 ? '' : 's'}
                {(search || activeCuisine !== 'All') && (
                  <button type="button" onClick={() => { setSearch(''); setActiveCuisine('All'); }} className="font-semibold text-emerald-700 hover:text-emerald-800">Clear</button>
                )}
              </span>
            </Reveal>

            {filteredRestaurants.length === 0 ? (
              <div className="mt-3 py-10 text-[13px] text-gray-500">
                No restaurants match.{' '}
                <button onClick={() => { setSearch(''); setActiveCuisine('All'); }} className="font-semibold text-emerald-700 hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredRestaurants.map((r, i) => (
                  <Reveal key={r.id} delay={Math.min((i % 8) * 0.05, 0.4)} y={14} amount={0.1}>
                    <RestaurantCard restaurant={r} index={i} onClick={() => setActiveRestaurant(r.id)} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>

          {showPopular && (
            <>
              <EatsTrackBand />
              <PartnerStrip registeredCount={registered.length} />
              <RestaurantCta />
            </>
          )}
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
function RestaurantCard({ restaurant: r, index = 0, onClick }: { restaurant: Restaurant; index?: number; onClick: () => void }) {
  const photo = r.image || fallbackPhoto(index).src;
  return (
    <Spotlight dark={false} color="rgba(13,163,102,.14)" className="h-full !rounded-xl transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1">
    <button onClick={onClick} className="group block h-full w-full overflow-hidden rounded-xl text-left">
      <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '16 / 10' }}>
        <img src={photo} alt={r.image ? r.name : ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" />
        {r.registered && <Chip tone="green" className="absolute left-2 top-2">New</Chip>}
        {r.registered && (
          <span className="absolute bottom-2 left-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-[11px] font-semibold text-emerald-700 backdrop-blur">{initialsOf(r.name)}</span>
        )}
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
    </Spotlight>
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
