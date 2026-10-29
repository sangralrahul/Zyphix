import React from 'react';
import { Link } from 'wouter';
import { Plus, Minus } from 'lucide-react';
import type { Product, Category } from '@/lib/catalog';
import { productImageFor } from '@/lib/productImage';
import { discountOf } from '@/lib/merch';
import { num } from '@/lib/format';
import { G } from '@/ui/kit';

/* Zyphix Now product card and category icon, shared by the store home, the category
   page and search. */

/** Category icon from the API (often an emoji); falls back to the initial. */
export function CategoryIcon({ category: c }: { category: Category }) {
  const icon = (c.icon || '').trim();
  return icon
    ? <span className="text-[16px] leading-none">{icon}</span>
    : <span className="text-[12px] font-semibold text-gray-600">{c.name.charAt(0).toUpperCase()}</span>;
}

export const ProductCard = React.memo(function ProductCard({ product: p, categories, qty, onAdd, onRemove, tagTone = 'green' }: {
  product: Product; categories: Category[]; qty: number; onAdd: () => void; onRemove: () => void; tagTone?: 'green' | 'red';
}) {
  const discount = discountOf(p);
  const { src, isFallback } = productImageFor(p, categories);
  const brand = (p.brand || '').trim();
  const showBrand = !!brand && brand !== 'Local Farm';
  // Catalogue names usually start with the brand ("Amul Butter Salted"); drop it when the brand line is shown.
  const stripped = showBrand && p.name.toLowerCase().startsWith(brand.toLowerCase() + ' ') ? p.name.slice(brand.length + 1) : p.name;
  const displayName = stripped.trim() || p.name;
  const save = p.origPrice && p.origPrice > p.price ? p.origPrice - p.price : 0;

  return (
    <div className="group flex h-full flex-col rounded-[18px] bg-white p-2 ring-1 ring-gray-200/80 transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-[0_18px_34px_-16px_rgba(11,15,25,.22)] hover:ring-gray-300">
      <div className="relative">
        <Link href={`/now/product/${p.id}`} aria-label={p.name} className="block aspect-square overflow-hidden rounded-[14px] bg-[#F4F5F7] no-underline">
          <img src={src} alt={p.name} loading="lazy" decoding="async" draggable={false}
            className={`transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05] ${isFallback ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-3 mix-blend-multiply'}`} />
        </Link>
        {discount > 0 && (
          <span className={`absolute left-0 top-2.5 rounded-r-lg px-1.5 py-[3px] text-[10.5px] font-extrabold uppercase leading-none tracking-wide text-white ${tagTone === 'red' ? 'bg-rose-600' : 'bg-[#2563EB]'}`}>{discount}% off</span>
        )}
        {/* ADD sits on the photo, bottom-right */}
        <div className="absolute -bottom-3 right-1.5">
          {qty > 0 ? (
            <div className="flex h-8 items-center overflow-hidden rounded-[10px] text-white shadow-[0_6px_16px_-6px_rgba(13,163,102,.7)]" style={{ background: G }}>
              <button type="button" onClick={onRemove} aria-label={`Remove one ${p.name}`} className="flex h-full w-8 items-center justify-center transition hover:bg-black/10"><Minus size={13} strokeWidth={3} /></button>
              <span className="min-w-[18px] text-center text-[13px] font-bold tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" onClick={onAdd} aria-label={`Add one more ${p.name}`} className="flex h-full w-8 items-center justify-center transition hover:bg-black/10"><Plus size={13} strokeWidth={3} /></button>
            </div>
          ) : (
            <button type="button" onClick={onAdd} aria-label={`Add ${p.name} to cart`}
              className="inline-flex h-8 items-center rounded-[10px] border border-[#0DA366] bg-white px-4 text-[12.5px] font-extrabold tracking-[0.04em] text-[#0B8A57] shadow-[0_4px_12px_-6px_rgba(11,15,25,.25)] transition hover:bg-emerald-50">
              ADD
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="text-[15px] font-extrabold tracking-[-0.01em] text-gray-900">₹{num(p.price)}</span>
          {save > 0 && <span className="text-[12px] font-medium text-gray-400 line-through">₹{num(p.origPrice!)}</span>}
        </div>
        {save > 0 && <p className="mt-1 text-[11px] font-bold text-[#0B8A57]">Save ₹{num(save)}</p>}
        <Link href={`/now/product/${p.id}`} className="mt-1.5 line-clamp-2 min-h-[2.5em] text-[13px] font-semibold leading-[1.25] text-gray-900 no-underline">{displayName}</Link>
        <p className="mt-auto truncate pt-1 text-[11.5px] font-medium text-gray-500">{[p.weight, showBrand ? brand : ''].filter(Boolean).join(' · ')}</p>
      </div>
    </div>
  );
});
