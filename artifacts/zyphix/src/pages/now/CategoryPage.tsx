import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { ChevronLeft, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { useCatalog, type Product } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { subcategoriesFor, categorySlug } from '@/lib/subcats';
import { discountOf } from '@/lib/merch';
import { num } from '@/lib/format';
import { ProductCard, CategoryIcon } from '@/components/now/ProductCard';
import { openCart } from '@/lib/cartEvents';
import { G } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix Now category page (now.zyphix.in/c/<slug>): subcategory rail on the
   left, product grid on the right, sort + offers filter in a sticky toolbar,
   other categories one tap away in the header strip.
──────────────────────────────────────────────────────────────────────────── */

type Sort = 'relevance' | 'price_asc' | 'price_desc' | 'discount';
const SORTS: { k: Sort; label: string }[] = [
  { k: 'relevance', label: 'Relevance' }, { k: 'price_asc', label: 'Price: low to high' },
  { k: 'price_desc', label: 'Price: high to low' }, { k: 'discount', label: 'Biggest discount' },
];
const NAV_H = 64;
const BAR_H = 56;

export default function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { products, categories, loading, partial } = useCatalog();
  const { items: cartItems, add: addToCart, remove: removeFromCart, totalItems, subtotal } = useCart();

  const category = categories.find(c => categorySlug(c.name) === slug);
  useSeo(category ? `${category.name} · Zyphix Now` : 'Category · Zyphix Now',
    category ? `Shop ${category.name.toLowerCase()} from stores near you on Zyphix Now, delivered in about 10 minutes at shelf prices.` : undefined);

  const inCat = useMemo(() => category ? products.filter(p => p.category === category.name) : [], [products, category]);
  const subs = useMemo(() => category ? subcategoriesFor(category.name, inCat) : [], [category, inCat]);
  const [sub, setSub] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('relevance');
  const [offersOnly, setOffersOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);

  useEffect(() => { setSub('all'); setOffersOnly(false); setSort('relevance'); window.scrollTo({ top: 0 }); }, [slug]);

  const shown = useMemo(() => {
    let list = sub === 'all' ? inCat : (subs.find(s => s.name === sub)?.products ?? []);
    if (offersOnly) list = list.filter(p => discountOf(p) > 0);
    const s = [...list];
    if (sort === 'price_asc') s.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') s.sort((a, b) => b.price - a.price);
    else if (sort === 'discount') s.sort((a, b) => discountOf(b) - discountOf(a));
    return s;
  }, [inCat, subs, sub, sort, offersOnly]);

  const cart = useMemo(() => { const m: Record<string, number> = {}; cartItems.forEach(i => { m[i.id] = i.qty; }); return m; }, [cartItems]);
  const byId = useMemo(() => new Map(inCat.map(p => [p.id, p])), [inCat]);
  const add = (id: string) => { const p = byId.get(id); if (p) addToCart({ id: p.id, name: p.name, brand: p.brand, price: p.price, origPrice: p.origPrice, image: p.image, weight: p.weight }); };

  const pickSub = (name: string) => {
    setSub(name);
    const top = (gridTop.current?.getBoundingClientRect().top ?? 0) + window.scrollY - NAV_H - BAR_H - 8;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  };

  // Unknown slug once the catalogue is fully in: say so (and offer the store).
  if (!category && !loading && !partial) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em]">We couldn't find that category</h1>
        <p className="mt-2 text-[14px] text-gray-500">It may have been renamed. Everything we stock is on the store page.</p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-xl px-6 text-[14px] font-bold text-white no-underline" style={{ background: G }}>Go to the store</Link>
      </div>
    );
  }

  const others = categories.filter(c => products.some(p => p.category === c.name));

  return (
    <div className="mx-auto w-full max-w-[1240px] pb-24 text-gray-900">
      {/* header: back + title, other categories in a strip */}
      <div className="sticky z-30 -mx-4 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl md:mx-[calc(50%-50vw)]" style={{ top: NAV_H }}>
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-3 md:px-4" style={{ height: BAR_H }}>
          <button type="button" onClick={() => (history.length > 1 ? history.back() : navigate('/'))} aria-label="Back" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
          <div className="min-w-0 shrink-0">
            <h1 className="truncate text-[16px] font-extrabold leading-tight tracking-[-0.02em] md:text-[18px]">{category?.name ?? 'Loading…'}</h1>
            <p className="text-[11.5px] font-medium text-gray-500">{inCat.length ? `${num(inCat.length)} items` : ' '}</p>
          </div>
          <div className="ml-2 hidden min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden">
            {others.map(c => {
              const on = c.name === category?.name;
              return (
                <Link key={c.name} href={`/c/${categorySlug(c.name)}`} aria-current={on ? 'page' : undefined}
                  className={`inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-[12.5px] font-semibold no-underline transition ${on ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-0 flex items-start md:mt-4 md:gap-5">
        {/* subcategory rail */}
        <aside className="sticky w-[84px] shrink-0 self-start overflow-y-auto border-r border-gray-200 bg-white [scrollbar-width:none] md:w-[220px] md:rounded-2xl md:border md:p-1.5 [&::-webkit-scrollbar]:hidden"
          style={{ top: NAV_H + BAR_H, maxHeight: `calc(100vh - ${NAV_H + BAR_H}px)` }} aria-label="Subcategories">
          {[{ name: 'all', label: 'All', icon: null as string | null, count: inCat.length }, ...subs.map(s => ({ name: s.name, label: s.name, icon: s.icon, count: s.products.length }))].map(s => {
            const on = sub === s.name;
            return (
              <button key={s.name} type="button" onClick={() => pickSub(s.name)} aria-pressed={on}
                className={`relative flex w-full flex-col items-center gap-1 px-1.5 py-2.5 text-center transition md:flex-row md:gap-3 md:rounded-xl md:px-2.5 md:py-2 md:text-left ${on ? 'bg-emerald-50/80' : 'hover:bg-gray-50'}`}>
                {on && <span aria-hidden className="absolute inset-y-2 right-0 w-[3px] rounded-l-full md:hidden" style={{ background: G }} />}
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-[20px] md:h-9 md:w-9 md:text-[17px] ${on ? 'bg-white ring-2 ring-[#0DA366]' : 'bg-[#F1F2F4]'}`}>
                  {s.icon ? (s.icon.length <= 2 && /\p{L}/u.test(s.icon) ? <span className="text-[14px] font-extrabold text-gray-600">{s.icon}</span> : s.icon) : category ? <CategoryIcon category={category} /> : null}
                </span>
                <span className={`line-clamp-2 text-[11px] leading-[1.2] md:flex-1 md:text-[13px] ${on ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{s.label}</span>
                <span className="hidden text-[11.5px] tabular-nums text-gray-400 md:inline">{s.count}</span>
              </button>
            );
          })}
        </aside>

        {/* products */}
        <section className="min-w-0 flex-1 px-3 pt-3 md:px-0 md:pt-0">
          <div ref={gridTop} className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[16px] font-extrabold tracking-[-0.02em] md:text-[18px]">{sub === 'all' ? `All ${category?.name ?? ''}` : sub} <span className="ml-1 text-[13px] font-medium text-gray-400">{shown.length}</span></h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setOffersOnly(v => !v)} aria-pressed={offersOnly}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition ${offersOnly ? 'border-[#0DA366] bg-emerald-50 text-[#0B8A57]' : 'border-gray-200 bg-white text-gray-700'}`}>
                {offersOnly && <Check size={14} />} Offers
              </button>
              <div className="relative">
                <button type="button" onClick={() => setSortOpen(v => !v)} aria-expanded={sortOpen} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 text-[13px] font-semibold text-gray-700">
                  <SlidersHorizontal size={14} /> {SORTS.find(s => s.k === sort)!.label} <ChevronDown size={14} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-[0_18px_40px_-12px_rgba(0,0,0,.25)]">
                    {SORTS.map(s => (
                      <button key={s.k} type="button" onClick={() => { setSort(s.k); setSortOpen(false); }} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13.5px] font-medium hover:bg-gray-50">
                        {s.label}{sort === s.k && <Check size={15} className="text-[#0B8A57]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading || (!category && partial) ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-[18px] bg-white ring-1 ring-gray-100" />)}
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-gray-200/80">
              <p className="text-[15px] font-bold">Nothing here {offersOnly ? 'on offer ' : ''}right now</p>
              <p className="mt-1 text-[13px] text-gray-500">{offersOnly ? 'Turn off "Offers" to see everything in this aisle.' : 'Try another subcategory.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {shown.map(p => (
                <ProductCard key={p.id} product={p} categories={categories} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onRemove={() => removeFromCart(p.id)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {totalItems > 0 && (
        <button type="button" onClick={openCart}
          className="fixed bottom-[84px] left-3 right-3 z-40 mx-auto flex h-14 max-w-[520px] items-center justify-between rounded-2xl px-4 text-white shadow-[0_14px_30px_-10px_rgba(13,163,102,.7)] md:bottom-6" style={{ background: G }}>
          <span className="text-left leading-tight"><span className="block text-[14px] font-extrabold">{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{num(subtotal)}</span><span className="block text-[11.5px] font-semibold text-white/80">Delivery in 10 minutes</span></span>
          <span className="text-[15px] font-extrabold">View cart ›</span>
        </button>
      )}
    </div>
  );
}

export type { Product };
