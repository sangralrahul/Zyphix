import { useSeo } from '@/lib/seo';
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, X, ShoppingCart, Plus } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button, FONT } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

export function Wishlist() {
  useSeo('Wishlist · Zyphix');
  const { items, remove, clear } = useWishlist();
  const { add, qty } = useCart();
  const [, navigate] = useLocation();

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
        <div className={`${card} px-6 py-14 text-center`}>
          <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E8EC] bg-[#FAFAFA] text-gray-400"><Heart size={18} /></span>
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Your wishlist is empty</h1>
          <p className="mt-1 text-[13px] text-gray-500">Tap the heart on any product to save it here.</p>
          <div className="mt-4"><Button href="/now" size="sm">Browse products</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Wishlist</h1>
        <p className="text-[13px] text-gray-500">{items.length} item{items.length > 1 ? 's' : ''}</p>
        <button type="button" onClick={clear} className="ml-auto text-[13px] font-semibold text-gray-600 transition hover:text-red-600">Clear all</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
        {items.map(p => {
          const q = qty(p.id);
          return (
            <div key={p.id} className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E6E8EC] bg-white transition hover:border-gray-300">
              <Link href={`/now/product/${p.id}`} className="relative block aspect-square overflow-hidden bg-[#FAFAFA] no-underline">
                <img src={p.image} alt={p.name} loading="lazy" draggable={false} className="h-full w-full bg-white object-contain p-2" />
                <button type="button" onClick={e => { e.preventDefault(); remove(p.id); }} aria-label="Remove from wishlist"
                  className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-gray-500 transition hover:text-red-600">
                  <X size={13} />
                </button>
              </Link>
              <div className="flex flex-1 flex-col p-2.5">
                <Link href={`/now/product/${p.id}`} className="line-clamp-2 min-h-[2.5em] text-[13px] font-medium leading-[1.25] text-gray-900 no-underline">{p.name}</Link>
                <p className="mt-0.5 truncate text-[12px] text-gray-500">{p.weight || p.brand}</p>
                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                  <div className="min-w-0 leading-none">
                    <span className="text-[14px] font-semibold text-gray-900">₹{p.price}</span>
                    {p.origPrice && p.origPrice > p.price && <span className="ml-1 text-[12px] text-gray-400 line-through">₹{p.origPrice}</span>}
                  </div>
                  {q === 0 ? (
                    <button type="button" onClick={() => add({ id: p.id, name: p.name, brand: p.brand, price: p.price, origPrice: p.origPrice, image: p.image, weight: p.weight })}
                      className="inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full border border-emerald-500 bg-white px-2.5 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-50">
                      <Plus size={12} strokeWidth={2.5} /> Add
                    </button>
                  ) : (
                    <button type="button" onClick={() => navigate('/now/cart')}
                      className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-2.5 text-[12px] font-semibold text-white transition hover:bg-emerald-700">
                      <ShoppingCart size={12} /> {q}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
