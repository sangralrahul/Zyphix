import { OrderRequestForm, WaitlistForm } from '@/components/RequestForms';
import { useSeo } from '@/lib/seo';
import React, { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import { Search, Star, X, Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight, ChefHat, Flame, Bike } from 'lucide-react';
import { restaurants, menuItems, FOOD_CUISINE_TYPES } from '@/data/localData';
import { usePartners, tagList } from '@/lib/partners';
import { Chip, Card, Button, G, FONT } from '@/ui/kit';
import { VideoHero, Reveal, Kicker, BgVideo } from '@/ui/cinema';
import { StepCards, SectionTitle } from '@/components/StepCards';
import { pexelsPhoto } from '@/data/media';
import { Spotlight, SplitHeadline } from '@/ui/motion2';
import { VIDEOS } from '@/data/media';
import { TonightsPicks, CuisineTiles, PartnerStrip, RestaurantCta, photoForCuisine, fallbackPhoto, EatsHeroLiveOrder, HungryBand, EatsTrackBand, DISPLAY } from './eats/picks';

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
  useSeo('Zyphix Eats — Food from your favourite local kitchens', 'Restaurants, cafés, dhabas and home kitchens near you, cooked to order at menu prices and tracked to your door.');
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
  // Only real, approved restaurants are listed (the old sample list is not shown publicly).
  const allRestaurants: Restaurant[] = registered;

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

  const popular = allRestaurants.slice(0, 6) as unknown as typeof restaurants;
  const showPopular = activeCuisine === 'All' && !search && allRestaurants.length > 0;
  const openingSoon = allRestaurants.length === 0;

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
            <Card hover={false} className="mt-3 rounded-2xl p-5 md:p-6">
              <p className="text-[16px] font-semibold text-gray-900">Order by request</p>
              <p className="mt-1 mb-4 text-[13.5px] text-gray-500">{activeR.name} is setting up its full menu on Zyphix. Tell us what you'd like and we'll call you to confirm it with the kitchen.</p>
              <OrderRequestForm restaurant={activeR.name} />
            </Card>
          )}
        </motion.div>
      ) : (
        /* ── Restaurant list ── */
        <motion.div key="list" {...enter}>
          {/* Hero: headline + search on a warm card, food footage framed on the right */}
          <section className="mt-4 overflow-hidden rounded-[24px] bg-[#FFF3EA] md:mt-2">
            <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6 md:p-5">
              <div className="order-2 flex flex-col justify-center px-2 pb-3 sm:px-3 md:order-1 md:py-6 md:pl-5">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#B4410C] ring-1 ring-inset ring-orange-100">
                  {openingSoon ? 'Opening soon near you' : `${allRestaurants.length} kitchens open now`}
                </span>
                <h1 className="mt-4 max-w-[15ch] text-[32px] font-semibold leading-[1.05] tracking-[-0.04em] text-gray-900 sm:text-[42px] md:text-[50px]">Food from the best kitchens near you.</h1>
                <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.55] text-gray-600 md:text-[16px]">Biryani houses, pizza ovens, momo stalls and cafés, cooked to order and brought to your door.</p>
                <form role="search" onSubmit={e => e.preventDefault()}
                  className="mt-5 flex h-12 max-w-[560px] items-center gap-2 rounded-2xl border border-orange-100 bg-white pl-4 pr-1.5 shadow-[0_10px_30px_-18px_rgba(120,53,15,.4)] md:h-14">
                  <Search size={18} className="shrink-0 text-gray-400" />
                  <input value={search} onChange={e => { setSearch(e.target.value); setActiveRestaurant(null); }}
                    placeholder="Search restaurants or dishes" aria-label="Search restaurants"
                    className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400 md:text-[16px]" />
                  {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={15} /></button>}
                  <button type="button" onClick={() => document.getElementById('eats-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="inline-flex h-9 shrink-0 items-center rounded-xl bg-[#E2562B] px-4 text-[13.5px] font-semibold text-white md:h-11 md:px-5">
                    {openingSoon ? 'Notify me' : 'Search'}
                  </button>
                </form>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-gray-600">
                  {['Cooked to order', 'Live order tracking', 'Kitchens from your area'].map(t => (
                    <li key={t} className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#E2562B]" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="relative order-1 h-[170px] overflow-hidden rounded-[18px] bg-[#2A140A] sm:h-[220px] md:order-2 md:h-auto md:min-h-[330px]">
                <BgVideo clip={VIDEOS.food} dim={0} priority />
              </div>
            </div>
          </section>

          {/* What's on your mind? (round cuisine photos) */}
          <section className="mt-8 md:mt-10" aria-label="Cuisines">
            <SectionTitle title="What's on your mind?" sub="Pick a cuisine to see kitchens that cook it." />
            <div className="-mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-10 md:gap-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              {FOOD_CUISINE_TYPES.filter(c => c !== 'All').map((c, i) => {
                const on = activeCuisine === c;
                const ph = photoForCuisine(c, i);
                return (
                  <button key={c} type="button" aria-pressed={on}
                    onClick={() => { if (!openingSoon) { setActiveCuisine(on ? 'All' : c); setActiveRestaurant(null); } document.getElementById('eats-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    className="group flex w-[84px] shrink-0 flex-col items-center text-center md:w-auto">
                    <span className={`block aspect-square w-full overflow-hidden rounded-full bg-gray-100 ring-offset-2 transition ${on ? 'ring-2 ring-[#E2562B]' : 'ring-1 ring-black/5'}`}>
                      <img src={ph.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]" />
                    </span>
                    <span className={`mt-2 text-[12.5px] leading-tight ${on ? 'font-semibold text-gray-900' : 'font-medium text-gray-600 group-hover:text-gray-900'}`}>{c}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Popular dishes: a visual menu of what's coming */}
          <section className="mt-10 md:mt-14" aria-label="Popular dishes">
            <SectionTitle title="Favourite dishes" sub="A taste of what local kitchens will serve on Zyphix Eats." />
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {DISHES.map(d => (
                <figure key={d.id} className="group overflow-hidden rounded-3xl border border-gray-200 bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={pexelsPhoto(d.id, 640)} alt={d.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 p-3.5 md:p-4">
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px] font-semibold tracking-[-0.01em] text-gray-900">{d.name}</span>
                      <span className="block truncate text-[12.5px] text-gray-500">{d.cuisine}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${d.veg ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{d.veg ? 'Veg' : 'Non-veg'}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Tonight's picks (when kitchens are live) */}
          {showPopular && <TonightsPicks picks={popular.slice(0, 3)} onOpen={setActiveRestaurant} />}

          {openingSoon && (
            <section id="eats-grid" className="mt-8 scroll-mt-20 md:mt-10">
              <div className="grid gap-6 overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 md:grid-cols-[1fr_1.1fr] md:gap-10 md:p-10">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C2410C]">Opening soon near you</p>
                  <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-gray-900 md:text-[34px]">Your favourite kitchens are joining Zyphix Eats.</h2>
                  <p className="mt-3 text-[15px] leading-[1.6] text-gray-500">We're onboarding restaurants neighbourhood by neighbourhood. Leave your number and we'll tell you the day Eats opens where you live.</p>
                </div>
                <div className="md:pt-2"><WaitlistForm product="eats" cta="Notify me when Eats opens" /></div>
              </div>
            </section>
          )}

          {/* Grid */}
          {!openingSoon && <section id="eats-grid" className="mt-8 scroll-mt-20 md:mt-10">
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
          </section>}

          {/* How it works + restaurant owners (light) */}
          <section className="mt-12 md:mt-16">
            <SectionTitle title="How Zyphix Eats works" sub="From a kitchen down the road to your door." />
            <StepCards steps={EATS_STEPS} accent="#C2410C" />
          </section>

          <section className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white md:mt-16">
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C2410C]">For restaurants</p>
                <h2 className="mt-2 max-w-[18ch] text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-gray-900 md:text-[34px]">Put your kitchen on every phone nearby.</h2>
                <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-gray-500">No joining fee, commission explained before you go live, and a real-time order dashboard.{registered.length > 0 ? ` ${registered.length} kitchen${registered.length === 1 ? ' has' : 's have'} already joined.` : ''}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="https://partner.zyphix.in/restaurant">List your restaurant <ChevronRight size={15} /></Button>
                </div>
              </div>
              <div className="relative min-h-[220px] bg-gray-100"><img src={fallbackPhoto(0).src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /></div>
            </div>
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

const EATS_STEPS = [
  { photo: 36870973, t: 'A local kitchen cooks it', s: 'The restaurant confirms your order and starts cooking right away.' },
  { photo: 6969967, t: 'Packed hot at the counter', s: 'Sealed the moment it leaves the pan, so it travels well.' },
  { photo: 31332062, t: 'Brought to your gate', s: 'Follow your rider with a live ETA until it arrives.' },
];

const DISHES = [
  { id: 12737656, name: 'Chicken biryani', cuisine: 'Biryani', veg: false },
  { id: 9609844, name: 'Butter chicken', cuisine: 'North Indian', veg: false },
  { id: 5560763, name: 'Masala dosa', cuisine: 'South Indian', veg: true },
  { id: 2147491, name: 'Margherita pizza', cuisine: 'Pizza', veg: true },
  { id: 1639557, name: 'Cheeseburger', cuisine: 'Burgers', veg: false },
  { id: 5409010, name: 'Steamed momos', cuisine: 'Momos', veg: true },
  { id: 2347311, name: 'Hakka noodles', cuisine: 'Chinese', veg: true },
  { id: 15014918, name: 'Gulab jamun', cuisine: 'Sweets', veg: true },
];
