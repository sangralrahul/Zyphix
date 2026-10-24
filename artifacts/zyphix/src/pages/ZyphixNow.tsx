import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Plus, Minus, Clock, ChevronRight, ChevronDown, Tag, Zap, ShoppingBag, SlidersHorizontal, ArrowRight, Store, MapPin } from 'lucide-react';
import { Link, useSearch } from 'wouter';
import { useCatalog, type Product, type Category } from '@/lib/catalog';
import { productImageFor, categoryTint } from '@/lib/productImage';
import { useCart } from '@/context/CartContext';
import { COUPONS } from '@/data/coupons';
import { usePartners, tagList, type PartnerListing } from '@/lib/partners';
import { Chip, IconTile } from '@/ui/kit';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'discount';

const G = '#0DA366';
const OUTFIT = { fontFamily: "'Outfit', sans-serif" } as const;
const ROW_LIMIT = 10;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const sectionId = (name: string) => `cat-${slug(name)}`;
/** Category photos are served at 200px; request a larger crop for banners/tiles. */
const hiRes = (url: string, size = 640) => url.replace(/w=\d+&h=\d+/, `w=${size}&h=${size}`);

const discountOf = (p: Product) => (p.origPrice && p.origPrice > p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0);

const PRODUCTS_SECTION_ID = 'now-products';

/** "Joined today / 3 days ago / 2 months ago" from an ISO date. */
function relativeDate(iso: string) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const days = Math.floor((Date.now() - t) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} wk ago`;
  if (days < 365) return `${Math.floor(days / 30)} mo ago`;
  return `${Math.floor(days / 365)} yr ago`;
}

export function ZyphixNow() {
  const { products, categories: allCategories, loading: catalogLoading } = useCatalog();
  const { partners: stores, loading: storesLoading } = usePartners('store');
  // Hide categories that have no products yet so the store never shows empty tiles/sections.
  const categories = useMemo(() => {
    const has = new Set(products.map(p => p.category));
    return allCategories.filter(c => has.has(c.name));
  }, [allCategories, products]);
  const searchString = useSearch();
  const urlQuery = useMemo(() => new URLSearchParams(searchString).get('q') || '', [searchString]);

  const [search, setSearch] = useState(urlQuery);
  useEffect(() => { setSearch(urlQuery); }, [urlQuery]);

  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [activeCat, setActiveCat] = useState<string>('');
  const pillBarRef = useRef<HTMLDivElement>(null);

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

  const q = search.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return [];
    return visible.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }, [visible, q]);

  /* ── Category navigation ── */
  const jumpTo = useCallback((name: string) => {
    setSearch('');
    setActiveCat(name);
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId(name));
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 124;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }, []);

  const toggleExpanded = useCallback((name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  // Scroll-spy: highlight the pill of the section nearest the top of the viewport.
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
        let best: HTMLElement | null = null;
        for (const el of els) {
          if (el.getBoundingClientRect().top - 140 <= 0) best = el; else break;
        }
        if (best) setActiveCat(best.dataset.cat || '');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories, q, catalogLoading]);

  // Keep the active pill visible in the sticky bar.
  useEffect(() => {
    if (!activeCat || !pillBarRef.current) return;
    const btn = pillBarRef.current.querySelector<HTMLElement>(`[data-pill="${CSS.escape(activeCat)}"]`);
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeCat]);

  const firstOrderCoupon = COUPONS.find(c => c.firstOrderOnly) || COUPONS[0];
  const catByName = (name: string) => categories.find(c => c.name === name);
  const banners = [
    { cat: catByName('Fruits & Veg'), title: 'Fresh fruits & veg, farm to door', sub: 'Picked today, delivered in 30 minutes', cls: 'from-emerald-600 to-green-500', chip: firstOrderCoupon ? `${firstOrderCoupon.code} · ${firstOrderCoupon.title}` : null },
    { cat: catByName('Snacks & Munchies'), title: 'Snacks night? Sorted.', sub: 'Chips, namkeen, chocolates and cold drinks', cls: 'from-orange-500 to-amber-400', chip: null },
    { cat: catByName('Pharmacy'), title: 'Pharmacy essentials in 30 min', sub: 'OTC medicines, first aid and wellness', cls: 'from-blue-600 to-sky-500', chip: null },
  ].filter(b => b.cat) as { cat: Category; title: string; sub: string; cls: string; chip: string | null }[];

  const showStore = !q;

  return (
    <div className="relative min-h-[80vh]">

      {/* ── Store header strip ── */}
      <div className="bg-white border-b border-gray-200 -mx-4 px-4 pt-4 pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30" style={{ background: G }}>
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-[22px] md:text-[26px] font-black tracking-[-0.03em] text-gray-900 leading-none" style={OUTFIT}>Zyphix Now</h1>
              <p className="text-[12.5px] md:text-[13px] text-gray-500 font-medium mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 font-bold" style={{ color: G }}><Clock size={12} /> Groceries in 30 minutes</span>
                <span className="text-gray-300">·</span>
                <span>{catalogLoading ? 'Loading catalogue…' : `${products.length.toLocaleString('en-IN')} products`}</span>
                <span className="text-gray-300">·</span>
                <span>{categories.length} categories</span>
              </p>
            </div>
          </div>

          <div className="relative w-full md:max-w-[460px]">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search 'atta', 'milk', 'chips'…"
              className="w-full h-12 pl-11 pr-11 rounded-2xl bg-gray-100 border border-transparent text-[14px] text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky category pill bar + controls ── */}
      {showStore && (
        <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur border-b border-gray-200 -mx-4 px-4">
          <div className="flex flex-col gap-2 py-2.5 md:flex-row md:items-center">
            <div ref={pillBarRef} className="flex-1 min-w-0 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map(c => {
                const active = activeCat === c.name;
                return (
                  <button key={c.name} data-pill={c.name} onClick={() => jumpTo(c.name)}
                    className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap border transition ${active ? 'text-white border-transparent shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    style={active ? { background: G } : undefined}>
                    <span className="text-[14px] leading-none">{c.icon}</span>{c.name}
                  </button>
                );
              })}
            </div>
            <SortControls sortBy={sortBy} setSortBy={setSortBy} onlyDiscounted={onlyDiscounted} setOnlyDiscounted={setOnlyDiscounted} />
          </div>
        </div>
      )}

      {/* ══════════════ SEARCH MODE ══════════════ */}
      {!showStore && (
        <div className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[20px] font-black tracking-[-0.03em] text-gray-900" style={OUTFIT}>
                {searchResults.length > 0 ? `${searchResults.length.toLocaleString('en-IN')} results` : 'No results'} for <span style={{ color: G }}>"{search.trim()}"</span>
              </h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Searched across all {products.length.toLocaleString('en-IN')} products by name and brand</p>
            </div>
            <div className="flex items-center gap-2">
              <SortControls sortBy={sortBy} setSortBy={setSortBy} onlyDiscounted={onlyDiscounted} setOnlyDiscounted={setOnlyDiscounted} />
              <button onClick={() => setSearch('')} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-bold bg-gray-900 text-white hover:bg-gray-800 transition">
                <X size={14} /> Clear
              </button>
            </div>
          </div>
          {searchResults.length === 0 ? (
            <EmptyState title="Nothing found" sub="Try a different spelling, a brand name, or browse the categories." action={<button onClick={() => setSearch('')} className="mt-4 inline-flex items-center gap-1.5 h-10 px-5 rounded-full text-white text-[13px] font-bold" style={{ background: G }}>Browse store <ArrowRight size={14} /></button>} />
          ) : (
            <ProductGrid products={searchResults} categories={categories} cart={cart} add={add} remove={remove} />
          )}
        </div>
      )}

      {/* ══════════════ STORE MODE ══════════════ */}
      {showStore && (
        <div className="pt-5 space-y-10">

          {/* ── Promo banners ── */}
          <div className="grid gap-4 md:grid-cols-3">
            {banners.map((b, i) => (
              <motion.button key={b.title} type="button" onClick={() => jumpTo(b.cat.name)}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.07 }}
                className={`relative overflow-hidden rounded-3xl text-left text-white bg-gradient-to-br ${b.cls} min-h-[150px] md:min-h-[180px] p-5 flex flex-col justify-between shadow-lg shadow-black/5 group`}>
                <img src={hiRes(b.cat.image)} alt="" loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute -right-6 -bottom-6 w-[150px] h-[150px] md:w-[170px] md:h-[170px] object-cover rounded-full ring-8 ring-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-105" />
                <div className="relative z-10 pr-28">
                  {b.chip && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[11px] font-bold tracking-wide mb-2"><Tag size={11} /> {b.chip}</span>
                  )}
                  <h3 className="text-[20px] md:text-[22px] font-black tracking-[-0.03em] leading-tight" style={OUTFIT}>{b.title}</h3>
                  <p className="text-[12.5px] text-white/85 mt-1 font-medium">{b.sub}</p>
                </div>
                <span className="relative z-10 inline-flex items-center gap-1 text-[12.5px] font-bold bg-white text-gray-900 rounded-full px-3.5 h-8 w-fit shadow">Shop now <ChevronRight size={14} /></span>
              </motion.button>
            ))}
          </div>

          {/* ── Registered stores (live partner directory) ── */}
          <section>
            <SectionHeading eyebrow="Local partners" title="Stores on Zyphix near you"
              sub={storesLoading ? 'Checking the partner directory…' : stores.length ? `${stores.length} registered store${stores.length > 1 ? 's' : ''} · delivered by Zyphix riders` : 'Kiranas and marts that have joined the network'} />
            {storesLoading ? (
              <div className="carousel -mx-4 px-4" style={{ gap: 12 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="shrink-0 w-[250px] rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-3 flex gap-1.5"><div className="h-6 w-14 rounded-full bg-gray-100 animate-pulse" /><div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" /></div>
                    <div className="mt-4 h-9 w-full rounded-full bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : stores.length === 0 ? (
              <a href="https://partner.zyphix.in/store" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-3.5 transition hover:bg-emerald-50">
                <IconTile><Store size={18} /></IconTile>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-gray-900">Be the first store in your area</span>
                  <span className="block text-[12.5px] text-gray-500">List your kirana on Zyphix — free to join, settled weekly.</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] font-bold shrink-0" style={{ color: G }}>List your kirana <ArrowRight size={14} /></span>
              </a>
            ) : (
              <div className="carousel -mx-4 px-4" style={{ gap: 12 }}>
                {stores.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                    className="snap-start shrink-0 w-[250px] sm:w-[270px]">
                    <StoreCard store={s} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ── Shop by category ── */}
          <section>
            <SectionHeading eyebrow="Browse" title="Shop by category" sub={`${categories.length} categories · ${products.length.toLocaleString('en-IN')} products`} />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {categories.map((c, i) => (
                <motion.button key={c.name} type="button" onClick={() => jumpTo(c.name)}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.4) }}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 bg-white text-left group shadow-sm hover:shadow-md transition-shadow">
                  <img src={hiRes(c.image, 400)} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/95 flex items-center justify-center text-[15px] mb-1.5 shadow">{c.icon}</div>
                    <div className="text-white text-[12.5px] font-bold leading-tight" style={OUTFIT}>{c.name}</div>
                    <div className="text-white/70 text-[10.5px] font-semibold mt-0.5">{countByCategory.get(c.name) || 0} items</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* ── All products, one section per category ── */}
          <section id={PRODUCTS_SECTION_ID} className="scroll-mt-[124px]">
            <SectionHeading eyebrow="Everything" title="All products" sub={onlyDiscounted ? 'Showing deals only' : 'Every category, every product'} />
            {catalogLoading ? (
              <div className="space-y-10">{[0, 1, 2, 3].map(i => <SkeletonRow key={i} />)}</div>
            ) : (
              <div className="space-y-10">
                {categories.map(c => {
                  const list = byCategory.get(c.name) || [];
                  if (!list.length) return null;
                  const isOpen = expanded.has(c.name);
                  return (
                    <div key={c.name} id={sectionId(c.name)} data-cat={c.name} className="scroll-mt-[124px]">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                            <img src={c.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[17px] md:text-[19px] font-black tracking-[-0.03em] text-gray-900 truncate" style={OUTFIT}>
                              <span className="mr-1.5">{c.icon}</span>{c.name}
                            </h3>
                            <p className="text-[12px] text-gray-500 font-medium">{list.length} products</p>
                          </div>
                        </div>
                        <button onClick={() => toggleExpanded(c.name)}
                          className="shrink-0 inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-[12.5px] font-bold border transition"
                          style={isOpen ? { background: G, color: '#fff', borderColor: G } : { background: '#fff', color: G, borderColor: 'rgba(13,163,102,0.3)' }}>
                          {isOpen ? <>Show less <ChevronDown size={14} className="rotate-180" /></> : <>View all <ChevronRight size={14} /></>}
                        </button>
                      </div>

                      {isOpen ? (
                        <ProductGrid products={list} categories={categories} cart={cart} add={add} remove={remove} />
                      ) : (
                        <div className="carousel -mx-4 px-4" style={{ gap: 12 }}>
                          {list.slice(0, ROW_LIMIT).map(p => (
                            <div key={p.id} className="snap-start shrink-0 w-[158px] sm:w-[176px]">
                              <ProductCard product={p} categories={categories} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onRemove={() => remove(p.id)} />
                            </div>
                          ))}
                          {list.length > ROW_LIMIT && (
                            <button onClick={() => toggleExpanded(c.name)}
                              className="snap-start shrink-0 w-[158px] sm:w-[176px] rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 flex flex-col items-center justify-center gap-2 text-center p-4 hover:bg-emerald-50 transition">
                              <span className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md" style={{ background: G }}><ArrowRight size={20} /></span>
                              <span className="text-[14px] font-black text-gray-900" style={OUTFIT}>View all {list.length}</span>
                              <span className="text-[11.5px] text-gray-500 font-medium">in {c.name}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── Floating cart bar ── */}
      {totalItems > 0 && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed left-3 right-3 bottom-[84px] md:bottom-6 z-40 mx-auto max-w-[560px]">
          <Link href="/now/cart"
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-white shadow-xl shadow-emerald-600/35 no-underline"
            style={{ background: `linear-gradient(135deg, ${G}, #0A8C58)` }}>
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><ShoppingBag size={17} /></span>
              <span className="leading-tight">
                <span className="block text-[14px] font-black" style={OUTFIT}>{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{subtotal.toLocaleString('en-IN')}</span>
                <span className="block text-[11px] text-white/75 font-medium">Delivery in ~30 min · Free above ₹149</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-[14px] font-bold" style={OUTFIT}>View cart <ArrowRight size={16} /></span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <div className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">{eyebrow}</div>
      <h2 className="text-[22px] md:text-[26px] font-black tracking-[-0.03em] text-gray-900 leading-tight" style={OUTFIT}>{title}</h2>
      {sub && <p className="text-[13px] text-gray-500 font-medium mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Registered store card (data from /api/partners) ─── */
function StoreCard({ store: s }: { store: PartnerListing }) {
  const tags = tagList(s.tags).slice(0, 3);
  const joined = relativeDate(s.joinedAt);
  const shop = () => {
    const el = document.getElementById(PRODUCTS_SECTION_ID);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 124, behavior: 'smooth' });
  };
  return (
    <div className="h-full flex flex-col rounded-2xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      <div className="flex items-start gap-3">
        <IconTile><Store size={18} /></IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold text-gray-900 leading-snug truncate">{s.name}</p>
          {s.category && <p className="text-[12px] text-gray-500 font-medium truncate">{s.category}</p>}
        </div>
      </div>
      {(s.locality || s.city) && (
        <p className="mt-2.5 inline-flex items-center gap-1 text-[12px] text-gray-600 font-medium truncate">
          <MapPin size={12} className="shrink-0 text-gray-400" />
          {[s.locality, s.city].filter(Boolean).join(' · ')}
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map(t => <Chip key={t} tone="green">{t}</Chip>)}
        </div>
      )}
      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-400 font-medium">{joined ? `Joined ${joined}` : 'Registered partner'}</span>
        <button type="button" onClick={shop}
          className="inline-flex items-center gap-1 h-8 px-3.5 rounded-full text-[12.5px] font-bold text-white shadow-sm transition hover:-translate-y-px"
          style={{ background: G }}>
          Shop <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function SortControls({ sortBy, setSortBy, onlyDiscounted, setOnlyDiscounted }: {
  sortBy: SortKey; setSortBy: (s: SortKey) => void; onlyDiscounted: boolean; setOnlyDiscounted: (f: (v: boolean) => boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button onClick={() => setOnlyDiscounted(v => !v)}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[12.5px] font-bold border transition whitespace-nowrap"
        style={onlyDiscounted ? { background: G, color: '#fff', borderColor: G } : { background: '#fff', color: G, borderColor: 'rgba(13,163,102,0.3)' }}>
        <Tag size={13} /> Deals only
      </button>
      <label className="relative inline-flex items-center">
        <SlidersHorizontal size={13} className="absolute left-3 text-gray-500 pointer-events-none" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} aria-label="Sort products"
          className="appearance-none h-9 pl-8 pr-7 rounded-full border border-gray-200 bg-white text-[12.5px] font-bold text-gray-900 cursor-pointer outline-none focus:border-emerald-500">
          <option value="featured">Featured</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="discount">Biggest discount</option>
        </select>
        <ChevronDown size={13} className="absolute right-2.5 text-gray-500 pointer-events-none" />
      </label>
    </div>
  );
}

function ProductGrid({ products, categories, cart, add, remove }: {
  products: Product[]; categories: Category[]; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {products.map(p => (
        <ProductCard key={p.id} product={p} categories={categories} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onRemove={() => remove(p.id)} />
      ))}
    </div>
  );
}

function EmptyState({ title, sub, action }: { title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4"><Search size={24} /></div>
      <p className="text-[18px] font-black text-gray-900" style={OUTFIT}>{title}</p>
      <p className="text-[13px] text-gray-500 mt-1 max-w-sm mx-auto">{sub}</p>
      {action}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
        <div className="space-y-2"><div className="h-4 w-40 rounded bg-gray-200 animate-pulse" /><div className="h-3 w-20 rounded bg-gray-200 animate-pulse" /></div>
      </div>
      <div className="carousel -mx-4 px-4" style={{ gap: 12 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="shrink-0 w-[158px] sm:w-[176px] rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-8 w-full rounded-xl bg-gray-100 animate-pulse mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Product Card ─── */

const ProductCard = React.memo(function ProductCard({ product: p, categories, qty, onAdd, onRemove }: {
  product: Product; categories: Category[]; qty: number; onAdd: () => void; onRemove: () => void;
}) {
  const discount = discountOf(p);
  const { src, isFallback } = productImageFor(p, categories);
  const tint = categoryTint(categories, p.category);
  const tagColor = p.tag === 'Bestseller' ? '#F59E0B' : p.tag === 'Fresh' ? G : '#8B5CF6';

  return (
    <div className="h-full flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      <Link href={`/now/product/${p.id}`} className="relative block aspect-square overflow-hidden bg-gray-50 no-underline group">
        {isFallback ? (
          <>
            <img src={src} alt={p.name} loading="lazy" decoding="async" draggable={false}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 mix-blend-multiply" style={{ background: tint, opacity: 0.18 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute left-2 bottom-2 max-w-[80%] truncate rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-800 shadow">
              {p.brand}
            </span>
          </>
        ) : (
          <img src={src} alt={p.name} loading="lazy" decoding="async" draggable={false}
            className="w-full h-full object-contain bg-white p-2 transition-transform duration-300 group-hover:scale-105" />
        )}

        {discount > 0 ? (
          <span className="absolute top-2 left-2 rounded-lg bg-red-500 text-white text-[10px] font-black px-2 py-1 shadow">{discount}% OFF</span>
        ) : p.tag && !p.tag.includes('%') ? (
          <span className="absolute top-2 left-2 rounded-lg text-white text-[10px] font-black px-2 py-1 shadow" style={{ background: tagColor }}>{p.tag}</span>
        ) : null}
      </Link>

      <div className="p-3 flex-1 flex flex-col">
        <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.6em]">{p.name}</p>
        <p className="text-[11px] text-gray-500 font-medium mt-1 truncate">{p.brand}{p.weight ? ` · ${p.weight}` : ''}</p>

        <div className="mt-auto pt-2.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[15px] font-black text-gray-900 leading-none" style={OUTFIT}>₹{p.price.toLocaleString('en-IN')}</div>
            {p.origPrice && p.origPrice > p.price && (
              <div className="text-[11px] text-gray-400 line-through font-medium mt-0.5">₹{p.origPrice.toLocaleString('en-IN')}</div>
            )}
          </div>

          {qty > 0 ? (
            <div className="flex items-center h-9 rounded-xl text-white overflow-hidden shrink-0 shadow-sm" style={{ background: G }}>
              <button onClick={onRemove} aria-label="Remove one" className="w-8 h-full flex items-center justify-center hover:bg-black/10 transition"><Minus size={14} strokeWidth={3} /></button>
              <span className="min-w-[22px] text-center text-[13px] font-black" style={OUTFIT}>{qty}</span>
              <button onClick={onAdd} aria-label="Add one" className="w-8 h-full flex items-center justify-center hover:bg-black/10 transition"><Plus size={14} strokeWidth={3} /></button>
            </div>
          ) : (
            <button onClick={onAdd}
              className="h-9 px-3.5 rounded-xl border-[1.5px] bg-white text-[12.5px] font-black tracking-wide inline-flex items-center gap-1 shrink-0 transition hover:bg-emerald-50"
              style={{ color: G, borderColor: 'rgba(13,163,102,0.4)', ...OUTFIT }}>
              <Plus size={14} strokeWidth={3} /> ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
