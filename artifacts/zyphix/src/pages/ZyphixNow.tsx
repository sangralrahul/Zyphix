import { useSeo } from '@/lib/seo';
import { num } from '@/lib/format';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from '@/lib/motion';
import { Plus, Minus, ChevronDown, ShoppingBag, ArrowRight, Store, X, Search, Clock, Copy, Check, Zap, Percent } from 'lucide-react';
import { Link, useSearch, useLocation } from 'wouter';
import { useCatalog, type Product, type Category } from '@/lib/catalog';
import { productImageFor } from '@/lib/productImage';
import { ProductCard, CategoryIcon } from '@/components/now/ProductCard';
import { categorySlug } from '@/lib/subcats';
import { openCart } from '@/lib/cartEvents';
import { useCart } from '@/context/CartContext';
import { COUPONS } from '@/data/coupons';
import { usePartners, type PartnerListing } from '@/lib/partners';
import { Button, IconTile, G } from '@/ui/kit';
import { Reveal, isStatic } from '@/ui/cinema';
import { useRotatingWord } from './now/bands';
import { landscape, type Photo } from '@/data/media';
import {
  discountOf, buildOffers, dealsOfTheDay, bestsellers as pickBestsellers, underPrice, topBrands, freshProduce,
  type Offer, type OfferTheme,
} from '@/lib/merch';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'discount';

/** Products shown per category before "View all" (one row on desktop, two on mobile). */
const ROW_LIMIT = 6;
const NAV_H = 64;               // app Navbar height
const STRIP_H = 82;             // sticky category strip under the Navbar
const COUPON_DISMISS_KEY = 'zyphix_now_coupon_dismissed';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sectionId = (name: string) => `cat-${slug(name)}`;
const PRODUCE_CATEGORY = 'Fruits & Veg';
/** Offset under the sticky chrome: Navbar + category strip. */
const scrollOffset = () => NAV_H + STRIP_H + 12;

export function ZyphixNow() {
  useSeo('Zyphix Now — Groceries delivered in 10 minutes', 'Fresh produce, dairy, snacks and daily staples from stores near you, delivered in about 10 minutes at shelf prices.');
  const { products, categories: allCategories, loading: catalogLoading, total } = useCatalog();
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
    const go = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    };
    if (q) { clearSearch(); setTimeout(go, 50); } else requestAnimationFrame(go);
  }, [q, clearSearch]);

  // Categories open their own page (subcategory rail + grid), like a quick-commerce app.
  const jumpTo = useCallback((name: string) => {
    navigate(`/c/${categorySlug(name)}`);
  }, [navigate]);

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
        setActiveCat(best?.dataset.cat || '');
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
  const productCount = num(total || products.length);

  const maxDeal = dealsRow.reduce((m, p) => Math.max(m, discountOf(p)), 0);
  // Grouped tiles show only categories that have products (new, empty ones stay hidden).
  const groups = useMemo(() => groupCategories(categories), [categories]);

  return (
    <div className="relative mx-auto w-full max-w-[1240px] pt-0 text-gray-900">

      {/* ── Sticky category strip (store mode) / compact search (search mode) ── */}
      {showStore ? (
        <CategoryStrip categories={categories} active={activeCat} onPick={jumpTo} railRef={mobileRailRef} loading={catalogLoading && categories.length === 0} />
      ) : (
        <div className="pt-4">
          <SearchField initial={urlQuery.trim()} onSearch={goSearch} compact />
        </div>
      )}

      {/* ── Search results ── */}
      {!showStore && (
        <section className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-[18px] font-bold tracking-[-0.02em]">
              {searchResults.length > 0 ? `${num(searchResults.length)} results` : 'No results'} for “{urlQuery.trim()}”
            </h1>
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
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
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
        <div className="space-y-9 pt-4 md:space-y-11 md:pt-5">

          <div className="space-y-3">
          {/* Phones: a proper full-width search (the header one is too narrow there) */}
          <div className="md:hidden"><SearchField onSearch={goSearch} compact /></div>

          {/* ── Banner row: main promise + coupon + deals ── */}
          <BannerRow
            productCount={catalogLoading ? '' : productCount}
            hero={bestsellerRow.slice(0, 4)}
            deals={dealsRow.slice(0, 3)}
            art={artFor(categories, ['Fruits & Veg', 'Dairy & Eggs', 'Snacks & Munchies', 'Atta, Rice & Dal', 'Cold Drinks & Juices', 'Bakery & Biscuits', 'Oils & Ghee', 'Chocolates & Sweets', 'Tea & Coffee', 'Personal Care', 'Dry Fruits & Nuts', 'Ice Creams'])}
            dealArt={artFor(categories, ['Snacks & Munchies', 'Chocolates & Sweets'])}
            maxDeal={maxDeal}
            coupon={coupon && !couponDismissed ? coupon : undefined}
            categories={categories}
            onShopDeals={() => { if (dealsRow[0]) { setSortBy('discount'); setOnlyDiscounted(true); jumpTo(dealsRow[0].category); } }}
            onShopAll={() => categories[0] && jumpTo(categories[0].name)}
            onDismissCoupon={dismissCoupon}
          />
          <PromoCards categories={categories} onPick={jumpTo} />
          </div>

          {/* ── Category tiles, grouped like the store's own aisles ── */}
          {categories.length === 0 ? (
            <SkeletonCategories />
          ) : packRows(groups).map(row => (
            // Wide screens: small groups share a row on one 11-column grid, so tiles stay the same size
            // and line up, with no half-empty rows. Smaller screens stack the groups.
            <div key={row.map(g => g.title).join('|')} className="space-y-9 md:space-y-11 lg:grid lg:grid-cols-11 lg:gap-x-3 lg:space-y-0">
              {row.map(g => (
                <section key={g.title} aria-labelledby={`grp-${slug(g.title)}`} style={{ '--n': row.length > 1 ? g.items.length : ROW_TILES } as React.CSSProperties}
                  className="min-w-0 lg:[grid-column:span_var(--n)]">
                  <h2 id={`grp-${slug(g.title)}`} className="mb-3 truncate text-[17px] font-bold tracking-[-0.025em] md:text-[20px]">{g.title}</h2>
                  <CategoryTiles categories={g.items} counts={countByCategory} onPick={jumpTo} span={row.length > 1} />
                </section>
              ))}
            </div>
          ))}

          {/* ── Merchandised rows (all computed from the live catalogue) ── */}
          {!catalogLoading && products.length > 0 && (
            <>
              {dealsRow.length > 0 && (
                <section id="home-deals">
                  <SectionHead title="Deals of the day" sub={`${num(dealsCount)} on offer`}
                    action={<SeeAll onClick={() => { setSortBy('discount'); setOnlyDiscounted(true); jumpTo(dealsRow[0].category); }} />} />
                  <ProductRow products={dealsRow} categories={categories} cart={cart} add={add} remove={remove} tagTone="red" />
                </section>
              )}

              {bestsellerRow.length > 0 && (
                <section id="home-bestsellers">
                  <SectionHead title="Bestsellers" sub="what the neighbourhood buys most" />
                  <ProductRow products={bestsellerRow} categories={categories} cart={cart} add={add} remove={remove} />
                </section>
              )}

              {offers.length > 0 && <OfferCarousel offers={offers} categories={categories} onShop={openOffer} />}

              {(under49.length > 0 || under99.length > 0) && (
                <section>
                  <SectionHead title="Budget picks" sub={`${num(priceTab === 49 ? under49Count : under99Count)} products`}
                    action={<SeeAll label="Low to high" onClick={() => { setSortBy('price_asc'); jumpTo((priceTab === 49 ? under49 : under99)[0]?.category || categories[0].name); }} />} />
                  <div className="mb-3 flex gap-1.5">
                    {([49, 99] as const).map(v => (
                      <button key={v} type="button" onClick={() => setPriceTab(v)} aria-pressed={priceTab === v}
                        className={`h-8 rounded-full border px-3.5 text-[13px] font-semibold transition ${priceTab === v ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                        Under ₹{v}
                      </button>
                    ))}
                  </div>
                  <ProductRow products={priceTab === 49 ? under49 : under99} categories={categories} cart={cart} add={add} remove={remove} />
                </section>
              )}

              {produceRow.length > 0 && (
                <section>
                  <SectionHead title="Fresh from local farms" sub={`${num(countByCategory.get(PRODUCE_CATEGORY) || 0)} products`}
                    action={<SeeAll onClick={() => jumpTo(PRODUCE_CATEGORY)} />} />
                  <ProductRow products={produceRow} categories={categories} cart={cart} add={add} remove={remove} />
                </section>
              )}

              {brands.length > 0 && (
                <section>
                  <SectionHead title="Popular brands" />
                  <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
                    {brands.map(b => (
                      <button key={b.brand} type="button" onClick={() => searchBrand(b.brand)}
                        className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white pl-1.5 pr-3.5 text-[13px] font-semibold text-gray-800 transition hover:border-gray-300 hover:shadow-sm">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">{b.brand.charAt(0)}</span>
                        {b.brand}<span className="text-[11.5px] font-medium tabular-nums text-gray-400">{b.count}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Stores near you: live partner directory, only when there are entries */}
          {stores.length > 0 && (
            <section>
              <SectionHead title="Shop by store" sub={`${stores.length} near you on Zyphix`} />
              <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                {stores.map(s => <StoreRow key={s.id} store={s} />)}
              </div>
            </section>
          )}

          {/* ── One row per category, "See all" opens the category page ── */}
          {!catalogLoading && categories.filter(c => (byCategory.get(c.name) || []).length > 0).map((c, i) => {
            const list = (byCategory.get(c.name) || []).slice(0, 14);
            const feature = FEATURES.find(f => f.after === i);
            return (
              <React.Fragment key={c.name}>
                <section id={sectionId(c.name)} data-cat={c.name}>
                  <SectionHead title={c.name} sub={`${num(countByCategory.get(c.name) || 0)} items`} action={<SeeAll onClick={() => jumpTo(c.name)} />} />
                  <ProductRow products={list} categories={categories} cart={cart} add={add} remove={remove} />
                </section>
                {feature && <FeatureBanner feature={feature} categories={categories} onPick={jumpTo} />}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ── Floating cart bar ── */}
      {totalItems > 0 && (
        <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-[84px] left-3 right-3 z-40 mx-auto max-w-[520px] md:bottom-6">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-[0_8px_30px_rgba(11,15,25,.12)]">
            <div className="flex min-w-0 items-center gap-3">
              <IconTile className="h-9 w-9 rounded-lg"><ShoppingBag size={16} /></IconTile>
              <div className="min-w-0 leading-tight">
                <p className="text-[13.5px] font-semibold">{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{num(subtotal)}</p>
                <p className="text-[12px] text-gray-500">Delivery in 10 min · Free above ₹149</p>
              </div>
            </div>
            <Button size="sm" onClick={openCart}>View cart <ArrowRight size={14} /></Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

/** Category icon from the API (often an emoji) rendered small; falls back to the initial. */

function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <Reveal y={12} amount={0.4} className="mb-3 flex items-end justify-between gap-3">
      <div className="flex min-w-0 items-baseline gap-2">
        <h2 className="truncate text-[19px] font-bold tracking-[-0.025em] md:text-[22px]">{title}</h2>
        {sub && <span className="shrink-0 text-[12.5px] text-gray-500">{sub}</span>}
      </div>
      {action}
    </Reveal>
  );
}


/* ─── Sticky category strip: every aisle one tap away (replaces the side rail) ─── */
function CategoryStrip({ categories, active, onPick, railRef, loading }: {
  categories: Category[]; active: string; onPick: (name: string) => void; railRef: React.RefObject<HTMLDivElement | null>; loading: boolean;
}) {
  return (
    <div className="sticky z-30 -mx-4 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl md:mx-[calc(50%-50vw)]" style={{ top: NAV_H }}>
      <div ref={railRef} className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-3 [scrollbar-width:none] md:px-4 [&::-webkit-scrollbar]:hidden" style={{ height: STRIP_H }}>
        {loading ? Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex w-[72px] shrink-0 flex-col items-center justify-center gap-1.5"><div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" /><div className="h-2.5 w-12 animate-pulse rounded bg-gray-100" /></div>
        )) : categories.map(c => {
          const on = active === c.name;
          return (
            <button key={c.name} type="button" data-pill={c.name} onClick={() => onPick(c.name)} aria-current={on || undefined}
              className="group relative flex w-[76px] shrink-0 flex-col items-center justify-center gap-1 px-1 md:w-[84px]">
              <span className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F1F3F5] transition ${on ? 'ring-2 ring-[#0DA366] ring-offset-2' : 'group-hover:scale-105'}`}>
                {c.image ? <img src={c.image} alt="" loading="lazy" decoding="async" draggable={false} className={`h-full w-full object-cover ${c.image.includes('/img/categories/') ? 'scale-[1.3] mix-blend-multiply' : ''}`} /> : <CategoryIcon category={c} />}
              </span>
              <span className={`line-clamp-2 w-full text-center text-[11px] leading-[1.15] ${on ? 'font-bold text-gray-900' : 'font-medium text-gray-600 group-hover:text-gray-900'}`}>{shortName(c.name)}</span>
              {on && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full" style={{ background: G }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Shorter labels for the sticky strip, where space is tight. */
const SHORT_NAMES: Record<string, string> = {
  'Sauces, Spreads & Ketchup': 'Sauces & Spreads', 'Cold Drinks & Juices': 'Cold Drinks', 'Snacks & Munchies': 'Snacks',
  'Chocolates & Sweets': 'Chocolates', 'Bakery & Biscuits': 'Bakery', 'Beauty & Cosmetics': 'Beauty', 'Breakfast & Soya': 'Breakfast',
};
const shortName = (name: string) => SHORT_NAMES[name] || name;

/* ─── Banner row: the main promise (wide) + coupon and deals tiles ─── */
/** Our generated category artwork (when it exists) for the given categories, in order. */
function artFor(categories: Category[], names: string[]): string[] {
  return names.map(n => categories.find(c => c.name === n)?.image ?? '').filter(src => src.includes('/img/categories/'));
}

function ArtTile({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div className={`aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,.35)] ${className}`}>
      <img src={src} alt="" loading="eager" decoding="async" draggable={false} className="h-full w-full scale-[1.18] object-cover" />
    </div>
  );
}

function BannerRow({ productCount, hero, deals, art = [], dealArt = [], maxDeal, coupon, categories, onShopDeals, onShopAll, onDismissCoupon }: {
  productCount: string; hero: Product[]; deals: Product[]; art?: string[]; dealArt?: string[]; maxDeal: number; coupon?: { code: string; desc: string };
  categories: Category[]; onShopDeals: () => void; onShopAll: () => void; onDismissCoupon: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => { if (!coupon) return; navigator.clipboard?.writeText(coupon.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {}); };
  return (
    <section aria-label="Today on Zyphix Now" className="grid gap-3 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] md:gap-4">
      {/* main banner */}
      <div className="relative isolate flex min-h-[236px] overflow-hidden rounded-[22px] text-white md:min-h-[320px]"
        style={{ background: 'radial-gradient(120% 140% at 0% 0%, #0E8A58 0%, #08623F 45%, #053D28 100%)' }}>
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2CC584]/25 blur-3xl" />
        <HeroArt images={art} />        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-5 pb-[104px] sm:max-w-[58%] sm:pb-5 md:p-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.08em] backdrop-blur"><Zap size={12} className="fill-current" /> Delivery in 10 minutes</span>
            <h1 className="mt-3 max-w-[14ch] text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] md:mt-4 md:text-[46px]">Your corner store,<br className="max-sm:hidden" /> in minutes.</h1>
            <p className="mt-2.5 max-w-[38ch] text-[13.5px] font-medium leading-snug text-white/85 md:text-[15.5px]">
              {productCount ? `${productCount} products` : 'Fresh produce, dairy and daily staples'} from shops near you, at shelf prices.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onShopAll} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-bold text-[#0B7F50] shadow-[0_8px_20px_-8px_rgba(0,0,0,.35)] transition hover:-translate-y-px">Start shopping <ArrowRight size={14} /></button>
            <span className="hidden h-10 items-center gap-1.5 rounded-full border border-white/30 px-3.5 text-[12.5px] font-semibold text-white/90 sm:inline-flex"><Clock size={13} /> Free delivery above ₹149</span>
          </div>
        </div>
      </div>

      {/* side tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
        <div className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#FFF3D6] p-4 md:p-5">
          <span aria-hidden className="absolute right-4 top-4 hidden h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-amber-700 md:inline-flex"><Percent size={18} /></span>
          {coupon ? (
            <>
              <div className="relative min-w-0 md:pr-12">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-700">First order</p>
                <p className="mt-1 line-clamp-3 text-[14px] font-bold leading-tight tracking-[-0.02em] text-gray-900 md:line-clamp-2 md:text-[18px]">{coupon.desc}</p>
              </div>
              <div className="relative mt-3 flex items-center gap-2">
                <button type="button" onClick={copy} aria-label={`Copy code ${coupon.code}`} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-amber-600/60 bg-white px-2.5 text-[11.5px] font-extrabold tracking-wide text-amber-800 md:px-3 md:text-[12.5px]">
                  {coupon.code}{copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button type="button" onClick={onDismissCoupon} aria-label="Hide offer" className="ml-auto hidden h-7 w-7 items-center justify-center rounded-full text-amber-800/60 transition hover:bg-white/70 md:inline-flex"><X size={13} /></button>
              </div>
            </>
          ) : (
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-700">Every day</p>
              <p className="mt-1 text-[16px] font-bold leading-tight tracking-[-0.02em] text-gray-900 md:text-[18px]">No markup on shelf prices</p>
            </div>
          )}
        </div>
        <button type="button" onClick={onShopDeals} disabled={!deals.length}
          className="group relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#FDE8EC] p-4 text-left md:p-5">
          <div className="relative z-10 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-rose-700">Deals of the day</p>
            <p className="mt-1 text-[15px] font-bold leading-tight tracking-[-0.02em] text-gray-900 md:text-[18px]">{maxDeal > 0 ? <>Up to {maxDeal}% off</> : 'Fresh offers daily'}</p>
          </div>
          <span className="relative z-10 mt-3 inline-flex h-9 w-fit items-center gap-1 rounded-full bg-gray-900 px-3.5 text-[12.5px] font-bold text-white transition group-hover:-translate-y-px"><Percent size={12} /> Shop deals</span>
          {(dealArt.length >= 2 || deals.length > 0) && (
            <div aria-hidden className="absolute bottom-4 right-4 hidden w-[40%] max-w-[176px] gap-2 md:flex">
              {dealArt.length >= 2
                ? dealArt.slice(0, 2).map(src => <ArtTile key={src} src={src} className="flex-1" />)
                : deals.slice(0, 2).map(p => <BannerTile key={p.id} p={p} categories={categories} className="flex-1" />)}
            </div>
          )}
        </button>
      </div>
    </section>
  );
}

/* ─── Full-width picture banners that break up the long run of product rows ─── */
type Feature = { after: number; eyebrow: string; title: string; sub: string; cats: string[]; bg: string; ink: string };
const FEATURES: Feature[] = [
  { after: 2, eyebrow: 'Kitchen staples', title: 'Stock up your kitchen', sub: 'Atta, rice, dal, oils and masalas at shelf prices', cats: ['Atta, Rice & Dal', 'Oils & Ghee', 'Masalas & Spices', 'Dry Fruits & Nuts'], bg: '#FFF3DF', ink: '#8A4B08' },
  { after: 7, eyebrow: 'Snack time', title: 'Cravings, covered', sub: 'Chips, chocolates, cold drinks and ice creams', cats: ['Snacks & Munchies', 'Chocolates & Sweets', 'Cold Drinks & Juices', 'Ice Creams'], bg: '#F1EBFF', ink: '#5B2DA8' },
  { after: 13, eyebrow: 'Self-care', title: 'Look after yourself', sub: 'Skincare, haircare, bath and grooming essentials', cats: ['Skincare', 'Haircare', 'Bath & Body', "Men's Grooming"], bg: '#FDEBF1', ink: '#9D174D' },
  { after: 20, eyebrow: 'For the home', title: 'Home, sorted', sub: 'Cleaning supplies, kitchenware and everyday home needs', cats: ['Cleaning Essentials', 'Kitchenware & Appliances', 'Home Needs', 'Pooja Needs'], bg: '#E4F3F6', ink: '#155E75' },
  { after: 28, eyebrow: 'Just for fun', title: 'Gifts, toys and more', sub: 'Party supplies, toys, stationery and books', cats: ['Party & Gifting', 'Toys & Games', 'Stationery & Crafts', 'Books'], bg: '#FFF0E8', ink: '#9A3412' },
];
function FeatureBanner({ feature: f, categories, onPick }: { feature: Feature; categories: Category[]; onPick: (name: string) => void }) {
  const tiles = f.cats.map(n => ({ n, img: categories.find(c => c.name === n)?.image ?? '' })).filter(t => t.img.includes('/img/categories/'));
  if (tiles.length < 3) return null;
  return (
    <Reveal y={16} amount={0.25}>
      <section aria-label={f.title} className="relative overflow-hidden rounded-[24px] p-5 md:p-7" style={{ background: f.bg }}>
        <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: f.ink, opacity: 0.75 }}>{f.eyebrow}</p>
            <h2 className="mt-1.5 text-[24px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[34px]" style={{ color: f.ink }}>{f.title}</h2>
            <p className="mt-2 max-w-[34ch] text-[13.5px] font-medium leading-snug text-gray-600 md:text-[15px]">{f.sub}</p>
            <button type="button" onClick={() => onPick(tiles[0].n)} className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-bold text-white transition hover:-translate-y-px" style={{ background: f.ink }}>Shop now <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {tiles.slice(0, 4).map(t => (
              <button key={t.n} type="button" onClick={() => onPick(t.n)} className="group text-center">
                <span className="block aspect-[4/5] overflow-hidden rounded-2xl bg-white/70 shadow-[0_14px_30px_-20px_rgba(0,0,0,.45)]">
                  <img src={t.img} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full scale-[1.18] object-cover mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.26]" />
                </span>
                <span className="mt-1.5 line-clamp-2 block text-[11px] font-semibold leading-tight text-gray-700 md:text-[12.5px]">{t.n}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/* ─── Three image cards under the banner (category artwork as the picture) ─── */
const PROMOS: { cat: string; title: string; sub: string; bg: string; ink: string }[] = [
  { cat: 'Pharmacy', title: 'Pharmacy at your door', sub: 'Medicines, vitamins and first aid from chemists near you', bg: '#E3F4F1', ink: '#0F5F55' },
  { cat: 'Pet Care', title: 'Everything for your pet', sub: 'Food, treats and care in a few taps', bg: '#FFF0D9', ink: '#8A4B08' },
  { cat: 'Baby Care', title: 'Baby care, sorted', sub: 'Diapers, wipes, baby food and more', bg: '#E8EDFF', ink: '#2F3F8F' },
];
function PromoCards({ categories, onPick }: { categories: Category[]; onPick: (name: string) => void }) {
  const cards = PROMOS.map(p => ({ ...p, img: categories.find(c => c.name === p.cat)?.image ?? '' })).filter(p => p.img.includes('/img/categories/'));
  if (cards.length < 3) return null;
  return (
    <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
      {cards.map(p => (
        <button key={p.cat} type="button" onClick={() => onPick(p.cat)}
          className="group relative isolate flex h-[150px] w-[84%] shrink-0 snap-start overflow-hidden rounded-[20px] text-left md:h-[172px] md:w-auto"
          style={{ background: p.bg }}>
          <img src={p.img} alt="" loading="lazy" decoding="async" draggable={false}
            className="absolute inset-y-0 right-0 -z-10 h-full w-[50%] scale-[1.12] object-cover mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [mask-image:linear-gradient(90deg,transparent,#000_38%)] group-hover:scale-[1.2]" />
          <div className="relative flex w-[60%] flex-col justify-between p-4 md:p-5">
            <div>
              <p className="text-[16px] font-extrabold leading-tight tracking-[-0.02em] md:text-[18px]" style={{ color: p.ink }}>{p.title}</p>
              <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-snug text-gray-600 md:text-[13px]">{p.sub}</p>
            </div>
            <span className="inline-flex h-8 w-fit items-center gap-1 rounded-full px-3 text-[12px] font-bold text-white transition group-hover:-translate-y-px" style={{ background: p.ink }}>Order now <ArrowRight size={12} /></span>
          </div>
        </button>
      ))}
    </div>
  );
}

/** Endless columns of our category artwork on the right of the banner (a strip on phones).
    Pure CSS motion; it pauses on hover and stays still for reduced-motion users. */
function HeroArt({ images }: { images: string[] }) {
  if (images.length < 6) return null;
  const cols = [0, 1, 2].map(k => images.filter((_, i) => i % 3 === k));
  const Tile = ({ src }: { src: string }) => (
    <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F5F2] shadow-[0_18px_40px_-18px_rgba(0,0,0,.55)] ring-1 ring-white/10">
      <img src={src} alt="" decoding="async" draggable={false} className="h-full w-full scale-[1.14] object-cover" />
    </div>
  );
  return (
    <>
      {/* wide screens: three columns drifting in opposite directions */}
      <div aria-hidden className="zx-marquee absolute inset-y-0 right-0 hidden w-[46%] sm:block [mask-image:linear-gradient(90deg,transparent,#000_22%),linear-gradient(180deg,transparent,#000_14%,#000_86%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]">
        <div className="absolute -inset-y-10 right-6 grid w-[min(100%,420px)] rotate-[-8deg] grid-cols-3 gap-3 md:right-10">
          {cols.map((col, k) => (
            <div key={k} className="relative overflow-hidden">
              <div className={`flex flex-col gap-3 ${k === 1 ? 'zx-col-down' : 'zx-col-up'}`} style={{ '--d': `${36 + k * 7}s` } as React.CSSProperties}>
                {[...col, ...col].map((src, i) => <Tile key={i} src={src} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* phones: one strip along the bottom */}
      <div aria-hidden className="zx-marquee absolute inset-x-0 bottom-0 h-[86px] overflow-hidden opacity-90 sm:hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="zx-row-left flex w-max gap-2.5 px-2" style={{ '--d': '46s' } as React.CSSProperties}>
          {[...images, ...images].map((src, i) => (
            <div key={i} className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-xl bg-[#F4F5F2]"><img src={src} alt="" decoding="async" draggable={false} className="h-full w-full scale-[1.14] object-cover" /></div>
          ))}
        </div>
      </div>
    </>
  );
}

function BannerTile({ p, categories, className = '' }: { p: Product; categories: Category[]; className?: string }) {
  const { src, isFallback } = productImageFor(p, categories);
  return (
    <div className={`aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,.35)] ${className}`}>
      <img src={src} alt="" loading="eager" decoding="async" draggable={false} className={isFallback ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-2.5'} />
    </div>
  );
}

/* ─── Category groups ("Grocery & Kitchen", "Snacks & Drinks"…). The API says which group each
   category belongs to; the name patterns are only a fallback for categories it doesn't know. ─── */
const GROUP_ORDER = ['Grocery & Kitchen', 'Snacks & Drinks', 'Beauty & Personal Care', 'Household Essentials', 'Fashion & Lifestyle', 'Hobbies & Interests', 'More to explore'];
const GROUP_FALLBACK: { title: string; re: RegExp }[] = [
  { title: 'Snacks & Drinks', re: /snack|munch|drink|juice|tea|coffee|chocolate|sweet|ice cream|namkeen|beverage|paan/i },
  { title: 'Beauty & Personal Care', re: /personal|beauty|cosmetic|skin|hair|bath|baby|pharma|health|wellness|hygiene|fragrance/i },
  { title: 'Household Essentials', re: /household|clean|home|pet|kitchenware|appliance|electronic|laundry/i },
  { title: 'Fashion & Lifestyle', re: /apparel|fashion|jewel|accessor/i },
  { title: 'Hobbies & Interests', re: /toy|game|stationery|craft|sport|fitness|book/i },
  { title: 'Grocery & Kitchen', re: /./ },
];
function groupCategories(categories: Category[]): { title: string; items: Category[] }[] {
  const by = new Map<string, Category[]>();
  for (const c of categories) {
    const g = c.group || GROUP_FALLBACK.find(x => x.re.test(c.name))!.title;
    if (!by.has(g)) by.set(g, []);
    by.get(g)!.push(c);
  }
  return [...by.entries()]
    .sort(([a], [b]) => (GROUP_ORDER.indexOf(a) + 99 * +(GROUP_ORDER.indexOf(a) < 0)) - (GROUP_ORDER.indexOf(b) + 99 * +(GROUP_ORDER.indexOf(b) < 0)))
    .map(([title, items]) => ({ title, items }));
}

/** Packs category groups into rows of at most 11 tiles (wide screens); big groups get a row each. */
const ROW_TILES = 11;
function packRows<T extends { items: unknown[] }>(groups: T[]): T[][] {
  const left = [...groups];
  const rows: T[][] = [];
  while (left.length) {
    const first = left.shift()!;
    const row = [first];
    let room = ROW_TILES - first.items.length;
    // Fill the rest of the row with the largest later groups that still fit.
    while (room > 0 && first.items.length < ROW_TILES) {
      let best = -1;
      left.forEach((g, i) => { if (g.items.length <= room && (best < 0 || g.items.length > left[best].items.length)) best = i; });
      if (best < 0) break;
      const [g] = left.splice(best, 1);
      row.push(g); room -= g.items.length;
    }
    rows.push(row);
  }
  return rows;
}

function CategoryTiles({ categories, onPick, span = false }: { categories: Category[]; counts?: Map<string, number>; onPick: (name: string) => void; span?: boolean }) {
  return (
    <div className={`grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 md:grid-cols-8 md:gap-x-3 ${span ? 'lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]' : 'lg:grid-cols-11'}`}>
      {categories.map(c => (
        <button key={c.name} type="button" onClick={() => onPick(c.name)} className="group flex flex-col items-center text-center">
          <span className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-[#F1F3F5] ring-1 ring-inset ring-black/[0.03] transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_22px_-12px_rgba(11,15,25,.35)]">
            {c.image
              ? <img src={c.image} alt="" loading="lazy" decoding="async" draggable={false} className={`h-full w-full object-cover transition-transform duration-500 ${c.image.includes('/img/categories/') ? 'scale-[1.22] mix-blend-multiply group-hover:scale-[1.3]' : 'group-hover:scale-[1.06]'}`} />
              : <span className="flex h-full w-full items-center justify-center [&>span]:!text-[30px]"><CategoryIcon category={c} /></span>}
          </span>
          <span className="mt-2 line-clamp-2 text-[11.5px] font-semibold leading-[1.25] text-gray-800 md:text-[12.5px]">{c.name}</span>
        </button>
      ))}
    </div>
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
      <SearchSubmit compact={compact} />
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
  // Keyed on the products so a refreshed list starts at the beginning (scroll snapping would otherwise
  // follow the previously first card to its new position).
  const rowKey = products.slice(0, 4).map(p => p.id).join('|');
  return (
    <div key={rowKey} className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
      {products.map((p, i) => (
        <Reveal key={p.id} delay={Math.min(i * 0.05, 0.4)} y={14} amount={0.1} className="w-[148px] shrink-0 snap-start md:w-[178px]">
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

function ProductGrid({ products, categories, cart, add, remove }: {
  products: Product[]; categories: Category[]; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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


