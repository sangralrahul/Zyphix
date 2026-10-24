import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ChevronDown, ShoppingBag, ArrowRight, Store, X, Search } from 'lucide-react';
import { Link, useSearch, useLocation } from 'wouter';
import { useCatalog, type Product, type Category } from '@/lib/catalog';
import { productImageFor } from '@/lib/productImage';
import { useCart } from '@/context/CartContext';
import { COUPONS } from '@/data/coupons';
import { usePartners, type PartnerListing } from '@/lib/partners';
import { Button, IconTile, FONT, G } from '@/ui/kit';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'discount';

/** Products shown per category before "View all" (one row on desktop, two on mobile). */
const ROW_LIMIT = 6;
const NAV_H = 64;               // app Navbar height
const MOBILE_RAIL_H = 86;       // sticky icon rail height on mobile
const COUPON_DISMISS_KEY = 'zyphix_now_coupon_dismissed';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sectionId = (name: string) => `cat-${slug(name)}`;
const discountOf = (p: Product) => (p.origPrice && p.origPrice > p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0);
const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
/** Offset under the sticky chrome: Navbar on desktop, Navbar + icon rail on mobile. */
const scrollOffset = () => (isDesktop() ? NAV_H + 16 : NAV_H + MOBILE_RAIL_H + 8);

export function ZyphixNow() {
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
  const clearSearch = useCallback(() => navigate(path || '/'), [navigate, path]);

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

  /* ── Category navigation ── */
  const jumpTo = useCallback((name: string) => {
    setActiveCat(name);
    const go = () => {
      const el = document.getElementById(sectionId(name));
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    };
    if (q) { clearSearch(); setTimeout(go, 50); } else requestAnimationFrame(go);
  }, [q, clearSearch]);

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
    const els = categories.map(c => document.getElementById(sectionId(c.name))).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const threshold = scrollOffset() + 16;
        let best: HTMLElement | null = null;
        for (const el of els) {
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
    <div className="relative mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>

      {/* ── Store header: one compact row ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-[-0.01em]">Zyphix Now</h1>
          <p className="text-[13px] text-gray-500">
            Delivery in 30 min · {catalogLoading ? 'Loading catalogue' : `${productCount} products`}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SortControls sortBy={sortBy} setSortBy={setSortBy} onlyDiscounted={onlyDiscounted} setOnlyDiscounted={setOnlyDiscounted} />
        </div>
      </div>

      {/* ── Coupon strip (single, slim, dismissible) ── */}
      {showStore && coupon && !couponDismissed && (
        <div className="mt-3 flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px]">
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold tracking-wide text-emerald-700">{coupon.code}</span>
          <span className="min-w-0 flex-1 truncate text-gray-700">{coupon.desc}</span>
          <button type="button" onClick={dismissCoupon} aria-label="Dismiss offer"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Mobile category rail (sticky under the Navbar) ── */}
      {showStore && categories.length > 0 && (
        <div className="sticky z-30 -mx-4 mt-3 border-b border-gray-200 bg-[#FAFAFA]/95 backdrop-blur md:hidden" style={{ top: NAV_H }}>
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

      <div className="mt-4 flex items-start gap-6">

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
                <button type="button" onClick={clearSearch} className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">
                  <X size={14} /> Clear
                </button>
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

              {/* Stores near you — live partner directory, only when there are entries */}
              {stores.length > 0 && (
                <section>
                  <SectionHead title="Stores near you" sub={`${stores.length} on Zyphix`} />
                  <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
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
                categories.map(c => {
                  const list = byCategory.get(c.name) || [];
                  if (!list.length) return null;
                  const isOpen = expanded.has(c.name);
                  const canExpand = list.length > ROW_LIMIT;
                  const shown = isOpen || !canExpand ? list : list.slice(0, ROW_LIMIT);
                  return (
                    <section key={c.name} id={sectionId(c.name)} data-cat={c.name}>
                      <SectionHead
                        title={c.name}
                        sub={`${list.length} ${list.length === 1 ? 'product' : 'products'}`}
                        action={canExpand ? (
                          <button type="button" onClick={() => toggleExpanded(c.name)}
                            className="group inline-flex items-center gap-1 text-[13.5px] font-semibold text-emerald-700 hover:text-emerald-800">
                            {isOpen ? <>Show less <ChevronDown size={14} className="rotate-180" /></> : <>View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></>}
                          </button>
                        ) : undefined}
                      />
                      <ProductGrid products={shown} categories={categories} cart={cart} add={add} remove={remove} />
                    </section>
                  );
                })
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
                <p className="text-[12px] text-gray-500">Delivery in 30 min · Free above ₹149</p>
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
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="flex min-w-0 items-baseline gap-2">
        <h2 className="truncate text-[17px] font-semibold tracking-[-0.01em] md:text-[18px]">{title}</h2>
        {sub && <span className="shrink-0 text-[12.5px] text-gray-500">{sub}</span>}
      </div>
      {action}
    </div>
  );
}

/* ─── Registered store row (data from /api/partners) ─── */
function StoreRow({ store: s }: { store: PartnerListing }) {
  const where = [s.locality, s.city].filter(Boolean).join(', ');
  return (
    <div className="flex w-[240px] shrink-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 md:w-[260px]">
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
    <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
      {products.map(p => (
        <ProductCard key={p.id} product={p} categories={categories} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onRemove={() => remove(p.id)} />
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

const ProductCard = React.memo(function ProductCard({ product: p, categories, qty, onAdd, onRemove }: {
  product: Product; categories: Category[]; qty: number; onAdd: () => void; onRemove: () => void;
}) {
  const discount = discountOf(p);
  const { src, isFallback } = productImageFor(p, categories);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300">
      <Link href={`/now/product/${p.id}`} className="relative block aspect-square overflow-hidden bg-[#FAFAFA] no-underline">
        <img src={src} alt={p.name} loading="lazy" decoding="async" draggable={false}
          className={isFallback ? 'h-full w-full object-cover' : 'h-full w-full bg-white object-contain p-2'} />
        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10.5px] font-semibold leading-none text-white">{discount}% off</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5">
        <Link href={`/now/product/${p.id}`} className="line-clamp-2 min-h-[2.5em] text-[13px] font-medium leading-[1.25] text-gray-900 no-underline">{p.name}</Link>
        <p className="mt-0.5 truncate text-[12px] text-gray-500">{p.weight || p.brand}</p>

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
