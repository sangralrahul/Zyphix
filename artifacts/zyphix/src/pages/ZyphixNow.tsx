import { useSeo } from '@/lib/seo';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from '@/lib/motion';
import { Plus, Minus, ChevronDown, ShoppingBag, ArrowRight, Store, X, Search, Clock, Truck, Package, MapPin } from 'lucide-react';
import { Link, useSearch, useLocation } from 'wouter';
import { useCatalog, type Product, type Category } from '@/lib/catalog';
import { productImageFor } from '@/lib/productImage';
import { useCart } from '@/context/CartContext';
import { COUPONS } from '@/data/coupons';
import { usePartners, type PartnerListing } from '@/lib/partners';
import { Button, IconTile, FONT, G } from '@/ui/kit';
import { BgVideo, Reveal, Kicker, Grain, isStatic } from '@/ui/cinema';
import { Magnetic, SplitHeadline } from '@/ui/motion2';
import { HeroLiveOrder, MarketBand, TrackBand, useRotatingWord, DISPLAY } from './now/bands';
import { VIDEOS, landscape, type Photo } from '@/data/media';
import {
  discountOf, buildOffers, dealsOfTheDay, bestsellers as pickBestsellers, underPrice, topBrands, freshProduce,
  type Offer, type OfferTheme,
} from '@/lib/merch';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'discount';

/** Products shown per category before "View all" (one row on desktop, two on mobile). */
const ROW_LIMIT = 6;
const NAV_H = 64;               // app Navbar height
const MOBILE_RAIL_H = 86;       // sticky icon rail height on mobile
const COUPON_DISMISS_KEY = 'zyphix_now_coupon_dismissed';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sectionId = (name: string) => `cat-${slug(name)}`;
const PRODUCE_CATEGORY = 'Fruits & Veg';
const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
/** Offset under the sticky chrome: Navbar on desktop, Navbar + icon rail on mobile. */
const scrollOffset = () => (isDesktop() ? NAV_H + 16 : NAV_H + MOBILE_RAIL_H + 8);

export function ZyphixNow() {
  useSeo('Zyphix Now — Groceries delivered in 10 minutes', 'Fresh produce, dairy, snacks and daily staples from stores near you, delivered in about 10 minutes at shelf prices.');
  const { products, categories: allCategories, loading: catalogLoading } = useCatalog();
  const { partners: stores } = usePartners('store');
  // Hide categories that have no products yet so the rail never shows empty entries.
  const categories = useMemo(() => {
    const has = new Set(products.map(p => p.category));
    return allCategories.filter(c => has.has(c.name));
  }, [allCategories, products]);

  const searchString = useSearch();
  const [path, navigate] = useLocation();
  const urlQuery = useMemo(() => new URLSearchParams(searchString).get('q') || '', [searchString]);
  const q = urlQuery.trim().toLowerCase();
  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchString);
    params.delete('q');
    const qs = params.toString();
    navigate(`${path || '/'}${qs ? `?${qs}` : ''}`);
  }, [navigate, path, searchString]);

  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  /* Render the first few aisles straight away and the rest in idle time, so the
     page is usable before the whole catalogue is on screen. */
  const [allAisles, setAllAisles] = useState(false);
  const [activeCat, setActiveCat] = useState<string>('');
  const mobileRailRef = useRef<HTMLDivElement>(null);

  const [couponDismissed, setCouponDismissed] = useState(() => {
    try { return localStorage.getItem(COUPON_DISMISS_KEY) === '1'; } catch { return false; }
  });
  const dismissCoupon = () => {
    setCouponDismissed(true);
    try { localStorage.setItem(COUPON_DISMISS_KEY, '1'); } catch { /* ignore */ }
  };
  const coupon = COUPONS.find(c => c.firstOrderOnly) || COUPONS[0];

  const { items: cartItems, add: addToCart, remove: removeFromCart, totalItems, subtotal } = useCart();
  const cart = useMemo(() => {
    const m: Record<string, number> = {};
    cartItems.forEach(i => { m[i.id] = i.qty; });
    return m;
  }, [cartItems]);

  const productById = useMemo(() => {
    const m = new Map<string, Product>();
    products.forEach(p => m.set(p.id, p));
    return m;
  }, [products]);

  const add = useCallback((id: string) => {
    const p = productById.get(id); if (!p) return;
    addToCart({ id: p.id, name: p.name, brand: p.brand, price: p.price, origPrice: p.origPrice, image: p.image, weight: p.weight });
  }, [productById, addToCart]);
  const remove = useCallback((id: string) => removeFromCart(id), [removeFromCart]);

  /* ── Global filter + sort (applies to every section and to search) ── */
  const sortFn = useCallback((a: Product, b: Product) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'discount') return discountOf(b) - discountOf(a);
    return 0;
  }, [sortBy]);

  const visible = useMemo(() => {
    const list = onlyDiscounted ? products.filter(p => p.origPrice && p.price < p.origPrice) : products;
    return sortBy === 'featured' ? list : list.slice().sort(sortFn);
  }, [products, onlyDiscounted, sortBy, sortFn]);

  const byCategory = useMemo(() => {
    const m = new Map<string, Product[]>();
    categories.forEach(c => m.set(c.name, []));
    visible.forEach(p => { const arr = m.get(p.category); if (arr) arr.push(p); else m.set(p.category, [p]); });
    return m;
  }, [visible, categories]);

  const countByCategory = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach(p => m.set(p.category, (m.get(p.category) || 0) + 1));
    return m;
  }, [products]);

  const searchResults = useMemo(() => {
    if (!q) return [];
    return visible.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }, [visible, q]);

  /* ── Merchandised home layer (all derived from the live catalogue) ── */
  const bestsellerRow = useMemo(() => pickBestsellers(products, categories), [products, categories]);
  const offers = useMemo(() => buildOffers(products, categories, coupon, bestsellerRow), [products, categories, coupon, bestsellerRow]);
  const dealsRow = useMemo(() => dealsOfTheDay(products), [products]);
  const under49 = useMemo(() => underPrice(products, 49), [products]);
  const under99 = useMemo(() => underPrice(products, 99), [products]);
  const brands = useMemo(() => topBrands(products), [products]);
  const produceRow = useMemo(() => freshProduce(products, 12, PRODUCE_CATEGORY), [products]);
  const dealsCount = useMemo(() => products.filter(p => discountOf(p) > 0).length, [products]);
  const under49Count = useMemo(() => products.filter(p => p.price <= 49).length, [products]);
  const under99Count = useMemo(() => products.filter(p => p.price <= 99).length, [products]);
  const [priceTab, setPriceTab] = useState<49 | 99>(49);

  /* ── Category navigation ── */
  const scrollToId = useCallback((id: string) => {
    setAllAisles(true);
    const go = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    };
    if (q) { clearSearch(); setTimeout(go, 50); } else requestAnimationFrame(go);
  }, [q, clearSearch]);

  const jumpTo = useCallback((name: string) => {
    setActiveCat(name);
    scrollToId(sectionId(name));
  }, [scrollToId]);

  /** Route to ?q= the same way the Navbar does, keeping any other params (e.g. ?site=) intact. */
  const goSearch = useCallback((term: string) => {
    const t = term.trim();
    const params = new URLSearchParams(searchString);
    if (t) params.set('q', t); else params.delete('q');
    const qs = params.toString();
    navigate(`${path || '/'}${qs ? `?${qs}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate, path, searchString]);
  const searchBrand = goSearch;

  const openOffer = useCallback((o: Offer) => {
    if (o.target.kind === 'category') jumpTo(o.target.name); else scrollToId(o.target.id);
  }, [jumpTo, scrollToId]);

  const toggleExpanded = useCallback((name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  // Scroll-spy: highlight the rail entry of the section nearest the top of the viewport.
  useEffect(() => {
    if (q || catalogLoading) return;
    if (!categories.length) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const threshold = scrollOffset() + 16;
        let best: HTMLElement | null = null;
        for (const el of document.querySelectorAll<HTMLElement>('section[data-cat]')) {
          if (el.getBoundingClientRect().top - threshold <= 0) best = el; else break;
        }
        if (best) setActiveCat(best.dataset.cat || '');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories, q, catalogLoading]);

  // Keep the active tile visible in the mobile rail.
  useEffect(() => {
    if (!activeCat || !mobileRailRef.current) return;
    const btn = mobileRailRef.current.querySelector<HTMLElement>(`[data-pill="${CSS.escape(activeCat)}"]`);
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeCat]);

  const showStore = !q;
  const productCount = products.length.toLocaleString('en-IN');

  return (
    <div className="relative mx-auto w-full max-w-[1180px] pt-0 text-gray-900" style={{ fontFamily: FONT }}>

      {/* ── Cinematic hero (store mode) / compact search bar (search mode) ── */}
      {showStore ? (
        <Hero productCount={catalogLoading ? '' : productCount} onSearch={goSearch} />
      ) : (
        <div className="pt-4">
          <SearchField initial={urlQuery.trim()} onSearch={goSearch} compact />
        </div>
      )}

      {/* ── Category card overlapping the hero's bottom edge ── */}
      {showStore && (
        <div className="relative z-10 -mt-9 md:-mt-14">
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_18px_50px_-18px_rgba(11,15,25,.28)] md:p-4">
            <div className="mb-2.5 flex flex-wrap items-end justify-between gap-x-3 gap-y-2 md:mb-3">
              <div className="flex min-w-0 items-baseline gap-2">
                <h2 className="shrink-0 text-[15px] font-semibold tracking-[-0.01em] md:text-[17px]">Shop by category</h2>
                {categories.length > 0 && <span className="shrink-0 text-[12.5px] text-gray-500">{categories.length} categories</span>}
              </div>
              <SortControls sortBy={sortBy} setSortBy={setSortBy} onlyDiscounted={onlyDiscounted} setOnlyDiscounted={setOnlyDiscounted} />
            </div>
            {categories.length > 0
              ? <CategoryGrid categories={categories} counts={countByCategory} onPick={jumpTo} />
              : <SkeletonCategories />}
          </div>
        </div>
      )}

      {/* ── Coupon strip (single, slim, dismissible) ── */}
      {showStore && coupon && !couponDismissed && (
        <div className="mt-4 flex h-12 items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3.5 text-[13px]">
          <span className="rounded-md border border-emerald-200 bg-white px-2 py-0.5 text-[12px] font-semibold tracking-wide text-emerald-700">{coupon.code}</span>
          <span className="min-w-0 flex-1 truncate text-gray-700">{coupon.desc}</span>
          <button type="button" onClick={dismissCoupon} aria-label="Dismiss offer"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-white hover:text-gray-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Mobile category rail (sticky under the Navbar) ── */}
      {showStore && categories.length > 0 && (
        <div className="sticky z-30 -mx-4 mt-4 border-b border-gray-200 bg-[#F8F9FA]/95 backdrop-blur md:hidden" style={{ top: NAV_H }}>
          <div ref={mobileRailRef} className="flex gap-1.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(c => {
              const active = activeCat === c.name;
              return (
                <button key={c.name} type="button" data-pill={c.name} onClick={() => jumpTo(c.name)}
                  className="flex w-[56px] shrink-0 flex-col items-center gap-1">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${active ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 bg-white'}`}>
                    <CategoryIcon category={c} />
                  </span>
                  <span className={`line-clamp-2 w-full text-center text-[10.5px] leading-[1.15] ${active ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-start gap-6">

        {/* ── Desktop category rail ── */}
        {showStore && (
          <aside className="sticky hidden w-[208px] shrink-0 self-start md:block" style={{ top: NAV_H + 16 }}>
            <div className="max-h-[calc(100vh-96px)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 [scrollbar-width:thin]">
              {catalogLoading && categories.length === 0 ? (
                [0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="flex items-center gap-2.5 px-2 py-2">
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-100" />
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                  </div>
                ))
              ) : categories.map(c => {
                const active = activeCat === c.name;
                return (
                  <button key={c.name} type="button" onClick={() => jumpTo(c.name)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition ${active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${active ? 'border-emerald-200 bg-white' : 'border-gray-200 bg-[#FAFAFA]'}`}>
                      <CategoryIcon category={c} />
                    </span>
                    <span className={`min-w-0 flex-1 truncate text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>{c.name}</span>
                    <span className={`shrink-0 text-[11.5px] tabular-nums ${active ? 'text-emerald-700' : 'text-gray-400'}`}>{countByCategory.get(c.name) || 0}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ── Content ── */}
        <div className="min-w-0 flex-1">

          {/* Search results */}
          {!showStore && (
            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
                  {searchResults.length > 0 ? `${searchResults.length.toLocaleString('en-IN')} results` : 'No results'} for “{urlQuery.trim()}”
                </h2>
                <div className="flex items-center gap-2">
                  <SortControls sortBy={sortBy} setSortBy={setSortBy} onlyDiscounted={onlyDiscounted} setOnlyDiscounted={setOnlyDiscounted} />
                  <button type="button" onClick={clearSearch} className="inline-flex h-8 items-center gap-1 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">
                    <X size={14} /> Clear
                  </button>
                </div>
              </div>
              {catalogLoading ? (
                <SkeletonGrid />
              ) : searchResults.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
                  <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-[#FAFAFA] text-gray-400"><Search size={18} /></span>
                  <p className="text-[15px] font-semibold">Nothing matched “{urlQuery.trim()}”</p>
                  <p className="mt-1 text-[13px] text-gray-500">Try a different spelling or a brand name.</p>
                  <div className="mt-4"><Button size="sm" variant="secondary" onClick={clearSearch}>Browse the store</Button></div>
                </div>
              ) : (
                <ProductGrid products={searchResults} categories={categories} cart={cart} add={add} remove={remove} />
              )}
            </section>
          )}

          {showStore && (
            <div className="space-y-8">

              {/* ── Merchandised home layer ── */}
              {!catalogLoading && products.length > 0 && (
                <>
                  {offers.length > 0 && (
                    <OfferCarousel offers={offers} categories={categories} onShop={openOffer} />
                  )}

                  {dealsRow.length > 0 && (
                    <section id="home-deals">
                      <SectionHead title="Deals of the day" sub={`${dealsCount.toLocaleString('en-IN')} on offer`}
                        action={<SeeAll onClick={() => { setSortBy('discount'); setOnlyDiscounted(true); jumpTo(dealsRow[0].category); }} />} />
                      <ProductRow products={dealsRow} categories={categories} cart={cart} add={add} remove={remove} tagTone="red" />
                    </section>
                  )}

                  {bestsellerRow.length > 0 && (
                    <section id="home-bestsellers">
                      <SectionHead title="Bestsellers" sub={`${bestsellerRow.length} staples`} />
                      <ProductRow products={bestsellerRow} categories={categories} cart={cart} add={add} remove={remove} />
                    </section>
                  )}

                  <MarketBand onShopProduce={countByCategory.get(PRODUCE_CATEGORY) ? () => jumpTo(PRODUCE_CATEGORY) : undefined} />

                  {(under49.length > 0 || under99.length > 0) && (
                    <section>
                      <SectionHead title="Budget picks" sub={`${(priceTab === 49 ? under49Count : under99Count).toLocaleString('en-IN')} products`}
                        action={<SeeAll label="Low to high" onClick={() => { setSortBy('price_asc'); jumpTo((priceTab === 49 ? under49 : under99)[0]?.category || categories[0].name); }} />} />
                      <div className="mb-3 flex gap-1.5">
                        {([49, 99] as const).map(v => (
                          <button key={v} type="button" onClick={() => setPriceTab(v)} aria-pressed={priceTab === v}
                            className={`h-8 rounded-lg border px-3 text-[13px] font-medium transition ${priceTab === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                            Under ₹{v}
                          </button>
                        ))}
                      </div>
                      <ProductRow products={priceTab === 49 ? under49 : under99} categories={categories} cart={cart} add={add} remove={remove} />
                    </section>
                  )}

                  {brands.length > 0 && (
                    <section>
                      <SectionHead title="Popular brands" sub={`top ${brands.length}`} />
                      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
                        {brands.map(b => (
                          <button key={b.brand} type="button" onClick={() => searchBrand(b.brand)}
                            className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 text-[13px] font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">
                            {b.brand}<span className="text-[11.5px] tabular-nums text-gray-400">{b.count}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  <TrackBand />

                  {produceRow.length > 0 && (
                    <section>
                      <SectionHead title="Fresh from local farms" sub={`${(countByCategory.get(PRODUCE_CATEGORY) || 0).toLocaleString('en-IN')} products`}
                        action={<SeeAll onClick={() => jumpTo(PRODUCE_CATEGORY)} />} />
                      <ProductRow products={produceRow} categories={categories} cart={cart} add={add} remove={remove} />
                    </section>
                  )}
                </>
              )}

              {/* Stores near you — live partner directory, only when there are entries */}
              {stores.length > 0 && (
                <section>
                  <SectionHead title="Shop by store" sub={`${stores.length} near you on Zyphix`} />
                  <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                    {stores.map(s => <StoreRow key={s.id} store={s} />)}
                  </div>
                </section>
              )}

              {/* Category sections */}
              {catalogLoading ? (
                <div className="space-y-8">{[0, 1, 2].map(i => <SkeletonSection key={i} />)}</div>
              ) : categories.length === 0 ? (
                <SkeletonSection />
              ) : (
                <AisleList categories={categories} byCategory={byCategory} expanded={expanded} showAll={allAisles} toggle={toggleExpanded} cart={cart} add={add} remove={remove} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Floating cart bar ── */}
      {totalItems > 0 && (
        <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-[84px] left-3 right-3 z-40 mx-auto max-w-[520px] md:bottom-6">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-[0_8px_30px_rgba(11,15,25,.12)]">
            <div className="flex min-w-0 items-center gap-3">
              <IconTile className="h-9 w-9 rounded-lg"><ShoppingBag size={16} /></IconTile>
              <div className="min-w-0 leading-tight">
                <p className="text-[13.5px] font-semibold">{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{subtotal.toLocaleString('en-IN')}</p>
                <p className="text-[12px] text-gray-500">Delivery in 10 min · Free above ₹149</p>
              </div>
            </div>
            <Button href="/now/cart" size="sm">View cart <ArrowRight size={14} /></Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

/** Category icon from the API (often an emoji) rendered small; falls back to the initial. */
function CategoryIcon({ category: c }: { category: Category }) {
  const icon = (c.icon || '').trim();
  return icon
    ? <span className="text-[16px] leading-none">{icon}</span>
    : <span className="text-[12px] font-semibold text-gray-600">{c.name.charAt(0).toUpperCase()}</span>;
}

function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <Reveal y={12} amount={0.4} className="mb-3 flex items-end justify-between gap-3">
      <div className="flex min-w-0 items-baseline gap-2">
        <h2 className="truncate text-[17px] font-semibold tracking-[-0.01em] md:text-[18px]">{title}</h2>
        {sub && <span className="shrink-0 text-[12.5px] text-gray-500">{sub}</span>}
      </div>
      {action}
    </Reveal>
  );
}

/* ─── Hero: compact video hero with search, promise chips; the category card overlaps its bottom edge ─── */

function Hero({ productCount, onSearch }: { productCount: string; onSearch: (q: string) => void }) {
  const chips: { icon: React.ReactNode; text: string }[] = [
    { icon: <Clock size={13} />, text: 'Delivered in 10 min' },
    { icon: <Truck size={13} />, text: 'Free delivery on bigger baskets' },
    ...(productCount ? [{ icon: <Package size={13} />, text: `${productCount} products` }] : []),
    { icon: <MapPin size={13} />, text: 'Check if we deliver to you' },
  ];
  return (
    <section aria-label="Zyphix Now" className="zx-bleed relative isolate -mx-4 flex min-h-[56svh] items-end overflow-hidden bg-[#05080E] text-white md:min-h-[78svh]">
      <BgVideo clip={VIDEOS.groceryShelf} dim={0.35} position="center" priority />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.35) 0%, rgba(5,8,14,.05) 30%, rgba(5,8,14,.55) 65%, rgba(5,8,14,.92) 100%)' }} />
      <Grain opacity={0.05} />
      <HeroLiveOrder />
      <div className="zx-bleed-inner relative z-10 w-full px-4 pb-16 pt-14 md:pb-28 md:pt-24">
        <Kicker light>Zyphix Now</Kicker>
        <SplitHeadline className={`${DISPLAY} max-w-[13ch] text-[38px] leading-[1.0] text-white sm:text-[48px] md:text-[64px]`}
          parts={['Groceries in', { accent: '10', green: true }, 'minutes.']} />
        <p className="mt-4 max-w-[520px] text-[15px] leading-[1.55] text-white/75 md:text-[17px]">
          Fresh produce, dairy, snacks and daily staples from stores near you, at your door before the kettle boils.
        </p>
        <div className="mt-5 max-w-[640px] md:mt-6">
          <SearchField onSearch={onSearch} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map(c => (
            <span key={c.text} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[12.5px] font-medium text-white/90 backdrop-blur-md">
              <span className="text-emerald-300">{c.icon}</span>{c.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Big white search field. Submits to ?q= (same route the Navbar uses). */
const PLACEHOLDER_WORDS = ['milk', 'atta', 'bananas', 'paneer', 'maggi', 'onions', 'basmati rice', 'eggs'];

function SearchField({ onSearch, initial = '', compact = false }: { onSearch: (q: string) => void; initial?: string; compact?: boolean }) {
  const [v, setV] = useState(initial);
  const word = useRotatingWord(PLACEHOLDER_WORDS, 2000);
  useEffect(() => { setV(initial); }, [initial]);
  return (
    <form role="search" onSubmit={e => { e.preventDefault(); onSearch(v); }}
      className={`flex items-center gap-2 rounded-2xl bg-white pl-4 pr-1.5 text-gray-900 ${compact ? 'h-12 border border-gray-200' : 'h-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,.6)] md:h-14'}`}>
      <Search size={18} className="shrink-0 text-gray-400" />
      <input value={v} onChange={e => setV(e.target.value)} aria-label="Search products"
        placeholder={compact ? 'Search for atta, milk, chips…' : `Search for ${word}…`}
        className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400 md:text-[16px]" />
      {v && (
        <button type="button" onClick={() => { setV(''); if (compact) onSearch(''); }} aria-label="Clear" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={15} /></button>
      )}
      {compact ? <SearchSubmit compact /> : <Magnetic strength={0.2}><SearchSubmit /></Magnetic>}
    </form>
  );
}

function SearchSubmit({ compact = false }: { compact?: boolean }) {
  return (
    <button type="submit" className={`inline-flex shrink-0 items-center justify-center rounded-xl px-4 text-[13.5px] font-semibold text-white transition hover:brightness-105 ${compact ? 'h-9' : 'h-9 md:h-11 md:px-5'}`} style={{ background: `linear-gradient(180deg, #13B874 0%, ${G} 100%)` }}>
      Search
    </button>
  );
}

function SkeletonCategories() {
  // Mirrors CategoryGrid's geometry (2 rows on mobile, 8 columns on desktop) so nothing jumps when data lands.
  return (
    <div className="-mx-3 grid grid-flow-col grid-rows-2 gap-2 overflow-hidden px-3 pb-0.5 md:mx-0 md:grid-flow-row md:grid-cols-8 md:grid-rows-1 md:px-0"
      style={{ gridAutoColumns: '88px' }} aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className={`flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white ${i >= 8 ? 'md:hidden' : ''}`}>
          <div className="aspect-[4/3] w-full animate-pulse bg-gray-100" />
          <div className="px-2 py-1.5">
            <div className="h-[18px] py-[3px]"><div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" /></div>
            <div className="h-[15px] py-[3px]"><div className="h-2.5 w-1/3 animate-pulse rounded bg-gray-100" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SeeAll({ onClick, label = 'See all' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="group inline-flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">
      {label} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* ─── Offer carousel: photo-led tiles with a 3-image product collage, every number computed ─── */

/** Backdrop photo + accent per offer theme (snacks / dairy / produce / grocery). */
const OFFER_TONE: Record<OfferTheme, { photo: Photo; label: string; tint: string }> = {
  amber: { photo: landscape('snacks'),  label: 'text-amber-300',   tint: 'rgba(120,53,15,.55)' },
  sky:   { photo: landscape('dairy'),   label: 'text-sky-300',     tint: 'rgba(12,74,110,.55)' },
  green: { photo: landscape('produce'), label: 'text-emerald-300', tint: 'rgba(6,78,59,.55)' },
  rose:  { photo: landscape('grocery'), label: 'text-rose-300',    tint: 'rgba(136,19,55,.55)' },
};

/** Slow Ken-Burns drift for offer photos; stops for reduced-motion users. */
const KENBURNS_CSS = `
@keyframes zx-kb { 0% { transform: scale(1.04) translate3d(0,0,0); } 100% { transform: scale(1.16) translate3d(-2.5%,-1.5%,0); } }
.zx-kenburns { animation: zx-kb 16s ease-in-out infinite alternate; will-change: transform; }
@media (prefers-reduced-motion: reduce) { .zx-kenburns { animation: none; } }
`;

function OfferCarousel({ offers, categories, onShop }: { offers: Offer[]; categories: Category[]; onShop: (o: Offer) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track the snapped card for the dots.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 10 : el.clientWidth;
      setIndex(Math.round(el.scrollLeft / w));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = ref.current; if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  const kb = !isStatic();
  return (
    <section aria-label="Offers">
      {kb && <style>{KENBURNS_CSS}</style>}
      <div ref={ref} className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {offers.map((o, i) => {
          const t = OFFER_TONE[o.theme];
          return (
            <Reveal key={o.key} delay={i * 0.08} y={16} amount={0.3}
              className="group relative flex h-[184px] w-[86%] shrink-0 snap-start items-stretch justify-between overflow-hidden rounded-2xl bg-[#05080E] text-white md:h-[220px] md:w-[calc(50%-5px)]">
              <div aria-hidden className="absolute inset-0 overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]">
                <img src={t.photo.src} alt="" loading="lazy" decoding="async" draggable={false}
                  className={`h-full w-full object-cover ${kb ? 'zx-kenburns' : ''}`} style={kb ? { animationDelay: `${-i * 4}s`, animationDirection: i % 2 ? 'alternate-reverse' : 'alternate' } : undefined} />
              </div>
              <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(5,8,14,.92) 0%, rgba(5,8,14,.7) 48%, rgba(5,8,14,.25) 100%)` }} />
              <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ background: t.tint }} />
              <div className="relative flex min-w-0 flex-col justify-between p-4 md:p-5">
                <div className="min-w-0">
                  <p className={`truncate text-[12px] font-semibold uppercase tracking-[0.12em] ${t.label}`}>{o.label}</p>
                  <p className="mt-1.5 text-[26px] font-semibold leading-[1.02] tracking-[-0.03em] text-white [overflow-wrap:anywhere] md:text-[34px]">{o.headline}</p>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-white/70 md:text-[13.5px]">{o.sub}</p>
                </div>
                <div>
                  <button type="button" onClick={() => onShop(o)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold text-gray-900 transition hover:-translate-y-px hover:bg-emerald-50">
                    Shop <ArrowRight size={13} />
                  </button>
                </div>
              </div>
              <Collage products={o.images} categories={categories} />
            </Reveal>
          );
        })}
      </div>
      {offers.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5 md:hidden">
          {offers.map((o, i) => (
            <button key={o.key} type="button" aria-label={`Offer ${i + 1}`} onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-300'}`} />
          ))}
        </div>
      )}
    </section>
  );
}

/** Three product photos: one tall tile and two stacked, white on the pastel card. */
function Collage({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [a, b, c] = products;
  const tile = (p: Product | undefined, cls: string) => {
    if (!p) return <div className={`${cls} rounded-lg bg-white/20`} />;
    const { src, isFallback } = productImageFor(p, categories);
    return (
      <div className={`${cls} overflow-hidden rounded-lg bg-white shadow-[0_6px_20px_rgba(0,0,0,.25)]`}>
        <img src={src} alt="" loading="lazy" decoding="async" draggable={false}
          className={isFallback ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1.5'} />
      </div>
    );
  };
  return (
    <div className="relative flex w-[120px] shrink-0 gap-1.5 p-3 pl-0 md:w-[172px] md:p-4 md:pl-0">
      {tile(a, 'h-full flex-1')}
      <div className="flex flex-1 flex-col gap-1.5">
        {tile(b, 'flex-1')}
        {tile(c, 'flex-1')}
      </div>
    </div>
  );
}

/* ─── Shop by category: photo tiles. 8 across on desktop, two scrolling rows on mobile ─── */
function CategoryGrid({ categories, counts, onPick }: { categories: Category[]; counts: Map<string, number>; onPick: (name: string) => void }) {
  return (
    <div className="-mx-3 grid grid-flow-col grid-rows-2 gap-2 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none] md:mx-0 md:grid-flow-row md:grid-cols-8 md:grid-rows-1 md:px-0 [&::-webkit-scrollbar]:hidden"
      style={{ gridAutoColumns: '88px' }}>
      {categories.map((c, i) => (
        <button key={c.name} type="button" onClick={() => onPick(c.name)}
          className={`group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_10px_24px_rgba(11,15,25,.08)] ${i >= 8 ? 'md:hidden' : ''}`}>
          <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: `${c.color}1A` }}>
            {c.image
              ? <img src={c.image} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              : <div className="flex h-full w-full items-center justify-center"><CategoryIcon category={c} /></div>}
          </div>
          <div className="px-2 py-1.5">
            <p className="line-clamp-2 text-[12px] font-medium leading-[1.2] text-gray-900">{c.name}</p>
            <p className="mt-0.5 text-[11px] tabular-nums text-gray-400">{counts.get(c.name) || 0}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

/** Horizontal product row (deals, bestsellers, budget picks, produce). */
function ProductRow({ products, categories, cart, add, remove, tagTone }: {
  products: Product[]; categories: Category[]; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void; tagTone?: 'green' | 'red';
}) {
  return (
    <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
      {products.map((p, i) => (
        <Reveal key={p.id} delay={Math.min(i * 0.05, 0.4)} y={14} amount={0.1} className="w-[140px] shrink-0 snap-start md:w-[164px]">
          <ProductCard product={p} categories={categories} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onRemove={() => remove(p.id)} tagTone={tagTone} />
        </Reveal>
      ))}
    </div>
  );
}

/* ─── Registered store row (data from /api/partners) ─── */
function StoreRow({ store: s }: { store: PartnerListing }) {
  const where = [s.locality, s.city].filter(Boolean).join(', ');
  return (
    <div className="flex w-[240px] shrink-0 snap-start items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 md:w-[260px]">
      <IconTile className="h-9 w-9 rounded-lg"><Store size={16} /></IconTile>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold leading-snug">{s.name}</p>
        <p className="truncate text-[12px] text-gray-500">{[s.category, where].filter(Boolean).join(' · ')}</p>
      </div>
    </div>
  );
}

function SortControls({ sortBy, setSortBy, onlyDiscounted, setOnlyDiscounted }: {
  sortBy: SortKey; setSortBy: (s: SortKey) => void; onlyDiscounted: boolean; setOnlyDiscounted: (f: (v: boolean) => boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex items-center">
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} aria-label="Sort products"
          className="h-8 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-7 text-[13px] font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-emerald-500">
          <option value="featured">Featured</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="discount">Biggest discount</option>
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2 text-gray-400" />
      </label>
      <button type="button" onClick={() => setOnlyDiscounted(v => !v)} aria-pressed={onlyDiscounted}
        className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-[13px] font-medium transition ${onlyDiscounted ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${onlyDiscounted ? 'bg-emerald-500' : 'bg-gray-300'}`} />Deals
      </button>
    </div>
  );
}

/* Aisles render a few at a time in idle callbacks, inside their own component so
   each batch only touches the new aisles, not the whole page. */
const AisleList = React.memo(function AisleList({ categories, byCategory, expanded, showAll, toggle, cart, add, remove }: {
  categories: Category[]; byCategory: Map<string, Product[]>; expanded: Set<string>; showAll: boolean;
  toggle: (name: string) => void; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void;
}) {
  const [n, setN] = useState(2);
  const count = showAll ? categories.length : n;
  useEffect(() => {
    if (count >= categories.length) return;
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setN(v => v + 1), { timeout: 400 }) : setTimeout(() => setN(v => v + 1), 60);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, [count, categories.length]);
  return <>{categories.slice(0, count).map(c => (
    <Aisle key={c.name} cat={c} list={byCategory.get(c.name) || []} open={expanded.has(c.name)} toggle={toggle} categories={categories} cart={cart} add={add} remove={remove} />
  ))}</>;
});

const Aisle = React.memo(function Aisle({ cat, list, open, toggle, categories, cart, add, remove }: {
  cat: Category; list: Product[]; open: boolean; toggle: (name: string) => void;
  categories: Category[]; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void;
}) {
  if (!list.length) return null;
  const canExpand = list.length > ROW_LIMIT;
  const shown = open || !canExpand ? list : list.slice(0, ROW_LIMIT);
  return (
    <section id={sectionId(cat.name)} data-cat={cat.name} className="zx-aisle">
      <SectionHead
        title={cat.name}
        sub={`${list.length} ${list.length === 1 ? 'product' : 'products'}`}
        action={canExpand ? (
          <button type="button" onClick={() => toggle(cat.name)}
            className="group inline-flex items-center gap-1 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">
            {open ? <>Show less <ChevronDown size={14} className="rotate-180" /></> : <>View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></>}
          </button>
        ) : undefined}
      />
      <ProductGrid products={shown} categories={categories} cart={cart} add={add} remove={remove} />
    </section>
  );
});

function ProductGrid({ products, categories, cart, add, remove }: {
  products: Product[]; categories: Category[]; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
      {products.map((p, i) => (
        <Reveal key={p.id} delay={Math.min((i % 12) * 0.04, 0.4)} y={14} amount={0.1}>
          <ProductCard product={p} categories={categories} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onRemove={() => remove(p.id)} />
        </Reveal>
      ))}
    </div>
  );
}

function SkeletonGrid({ n = 12 }: { n?: number }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="aspect-square animate-pulse bg-gray-100" />
          <div className="space-y-2 p-2.5">
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="mt-3 flex items-center justify-between">
              <div className="h-3.5 w-10 animate-pulse rounded bg-gray-100" />
              <div className="h-7 w-14 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonSection() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
      </div>
      <SkeletonGrid n={6} />
    </div>
  );
}

/* ─── Product card ─── */

const ProductCard = React.memo(function ProductCard({ product: p, categories, qty, onAdd, onRemove, tagTone = 'green' }: {
  product: Product; categories: Category[]; qty: number; onAdd: () => void; onRemove: () => void; tagTone?: 'green' | 'red';
}) {
  const discount = discountOf(p);
  const { src, isFallback } = productImageFor(p, categories);
  const brand = (p.brand || '').trim();
  const showBrand = !!brand && brand !== 'Local Farm';
  const sub = p.weight || (showBrand ? '' : brand);
  // Catalogue names usually start with the brand ("Amul Butter Salted"); drop it when the brand line is shown.
  const stripped = showBrand && p.name.toLowerCase().startsWith(brand.toLowerCase() + ' ') ? p.name.slice(brand.length + 1) : p.name;
  const displayName = stripped.trim() || p.name;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_14px_30px_-8px_rgba(11,15,25,.16)]">
      <Link href={`/now/product/${p.id}`} className="relative block aspect-square overflow-hidden bg-[#F4F5F7] no-underline">
        <img src={src} alt={p.name} loading="lazy" decoding="async" draggable={false}
          className={`transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] ${isFallback ? 'h-full w-full object-cover' : 'h-full w-full rounded-[14px] object-contain p-3 mix-blend-multiply'}`} />
        {discount > 0 && (
          <span className={`absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold leading-none text-white ${tagTone === 'red' ? 'bg-red-600' : 'bg-emerald-600'}`}>{discount}% off</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5">
        {showBrand && <p className="mb-0.5 truncate text-[12px] text-gray-500">{brand}</p>}
        <Link href={`/now/product/${p.id}`} className="line-clamp-2 min-h-[2.5em] text-[13px] font-medium leading-[1.25] text-gray-900 no-underline">{displayName}</Link>
        {sub && <p className="mt-0.5 truncate text-[12px] text-gray-500">{sub}</p>}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0 leading-none">
            <span className="text-[14px] font-semibold text-gray-900">₹{p.price.toLocaleString('en-IN')}</span>
            {p.origPrice && p.origPrice > p.price && (
              <span className="ml-1 text-[12px] text-gray-400 line-through">₹{p.origPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          {qty > 0 ? (
            <div className="flex h-7 shrink-0 items-center overflow-hidden rounded-full text-white" style={{ background: G }}>
              <button type="button" onClick={onRemove} aria-label="Remove one" className="flex h-full w-7 items-center justify-center transition hover:bg-black/10"><Minus size={12} strokeWidth={2.5} /></button>
              <span className="min-w-[18px] text-center text-[12.5px] font-semibold tabular-nums">{qty}</span>
              <button type="button" onClick={onAdd} aria-label="Add one" className="flex h-full w-7 items-center justify-center transition hover:bg-black/10"><Plus size={12} strokeWidth={2.5} /></button>
            </div>
          ) : (
            <button type="button" onClick={onAdd}
              className="inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full border border-emerald-500 bg-white px-2.5 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-50">
              <Plus size={12} strokeWidth={2.5} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
