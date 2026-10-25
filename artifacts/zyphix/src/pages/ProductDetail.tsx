import React, { useMemo } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { ChevronLeft, Plus, Minus, Clock, Truck, ShieldCheck, Star, Heart, Share2 } from 'lucide-react';
import { useCatalog } from '@/lib/catalog';
import { productImageFor } from '@/lib/productImage';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useReviews } from '@/context/ReviewsContext';
import { Reviews } from '@/components/Reviews';
import { Button, FONT, G } from '@/ui/kit';

export function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { qty, add, remove } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const { summary } = useReviews();

  const { products, categories } = useCatalog();
  const product = useMemo(() => products.find(p => p.id === params.id), [products, params.id]);
  const mainImage = useMemo(() => product ? productImageFor(product, categories, 'full') : null, [product, categories]);
  const related = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [products, product]);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-[1180px] pt-4 text-gray-900" style={{ fontFamily: FONT }}>
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
          <h1 className="text-[18px] font-semibold tracking-[-0.02em]">Product not found</h1>
          <p className="mt-1 text-[13px] text-gray-500">The item you're looking for isn't available.</p>
          <div className="mt-4"><Button href="/now" size="sm" variant="secondary">Back to store</Button></div>
        </div>
      </div>
    );
  }

  const q = qty(product.id);
  const discount = product.origPrice ? Math.round((1 - product.price / product.origPrice) * 100) : 0;
  const snap = { id: product.id, name: product.name, brand: product.brand, price: product.price, origPrice: product.origPrice, image: product.image, weight: product.weight };
  const wished = isWished(product.id);
  const s = summary(product.id);
  const share = () => {
    const url = window.location.href;
    if (navigator.share) { navigator.share({ title: product.name, url }).catch(() => {}); }
    else { navigator.clipboard?.writeText(url); }
  };

  const iconBtn = 'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50';

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900" style={{ fontFamily: FONT }}>
      {/* top bar */}
      <div className="flex items-center gap-2.5 text-[13px] text-gray-500">
        <button type="button" onClick={() => window.history.length > 1 ? window.history.back() : navigate('/now')} aria-label="Back" className={iconBtn}>
          <ChevronLeft size={16} />
        </button>
        <Link href="/now" className="font-medium text-emerald-700 no-underline hover:text-emerald-800">Zyphix Now</Link>
        <span className="text-gray-300">/</span>
        <span className="truncate">{product.category}</span>
      </div>

      <div className="mt-5 grid items-start gap-6 md:grid-cols-[minmax(260px,440px)_1fr] md:gap-10">
        {/* image */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="relative aspect-square bg-[#FAFAFA]">
            <img src={mainImage?.src || product.image} alt={product.name}
              className={mainImage?.isFallback ? 'h-full w-full object-cover' : 'h-full w-full bg-white object-contain p-4'} />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">{discount}% off</span>
            )}
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <button type="button" onClick={() => toggleWish(snap)} title={wished ? 'Remove from wishlist' : 'Add to wishlist'} className={iconBtn}>
                <Heart size={15} fill={wished ? '#DC2626' : 'none'} stroke={wished ? '#DC2626' : 'currentColor'} />
              </button>
              <button type="button" title="Share" onClick={share} className={iconBtn}><Share2 size={14} /></button>
            </div>
          </div>
        </div>

        {/* info */}
        <div>
          <p className="text-[12.5px] font-medium text-gray-500">{product.brand}</p>
          <h1 className="mt-1 text-balance text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] md:text-[28px]">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-gray-500">
            {s.count > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[12px] font-semibold text-gray-900">
                <Star size={11} fill={G} stroke={G} /> {s.avg.toFixed(1)} <span className="font-normal text-gray-500">({s.count})</span>
              </span>
            )}
            {product.weight && <span>{product.weight}</span>}
            {product.storeName && <><span className="text-gray-300">·</span><span>{product.storeName}</span></>}
          </div>

          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-[26px] font-semibold tabular-nums tracking-[-0.03em]">₹{product.price}</span>
            {product.origPrice && product.origPrice > product.price && (
              <>
                <span className="text-[14px] text-gray-400 line-through">₹{product.origPrice}</span>
                <span className="text-[13px] font-semibold text-emerald-700">Save ₹{product.origPrice - product.price}</span>
              </>
            )}
          </div>
          <p className="mt-0.5 text-[12px] text-gray-500">Inclusive of all taxes</p>

          {/* delivery facts */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: <Clock size={14} />, t: '30 min', s: 'Delivery' },
              { icon: <Truck size={14} />, t: 'Free', s: 'Above ₹149' },
              { icon: <ShieldCheck size={14} />, t: 'Fresh', s: 'Quality checked' },
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold"><span className="text-emerald-700">{f.icon}</span>{f.t}</div>
                <div className="mt-0.5 text-[12px] text-gray-500">{f.s}</div>
              </div>
            ))}
          </div>

          {/* add to cart */}
          <div className="mt-5">
            {q === 0 ? (
              <Button onClick={() => add(snap)} className="w-full sm:w-auto sm:min-w-[200px]">Add to cart</Button>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex h-11 items-center overflow-hidden rounded-full text-white" style={{ background: G }}>
                  <button type="button" onClick={() => remove(product.id)} aria-label="Remove one" className="flex h-full w-11 items-center justify-center transition hover:bg-black/10"><Minus size={15} /></button>
                  <span className="min-w-[72px] text-center text-[14px] font-semibold tabular-nums">{q} in cart</span>
                  <button type="button" onClick={() => add(snap)} aria-label="Add one" className="flex h-full w-11 items-center justify-center transition hover:bg-black/10"><Plus size={15} /></button>
                </div>
                <Button variant="secondary" onClick={() => navigate('/now/cart')}>Go to cart</Button>
              </div>
            )}
          </div>

          {/* description */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
            <p className="text-[14px] font-semibold">About this product</p>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-gray-600">
              {product.name} by {product.brand}{product.weight ? `, ${product.weight}` : ''}. Sourced daily from trusted local suppliers and delivered in about 30 minutes.
            </p>
          </div>

          <Reviews productId={product.id} />
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-10 border-t border-gray-200 pt-8 md:mt-14">
          <h2 className="mb-4 text-[18px] font-semibold tracking-[-0.02em] md:text-[20px]">You might also like</h2>
          <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
            {related.map(r => {
              const img = productImageFor(r, categories);
              const d = r.origPrice && r.origPrice > r.price ? Math.round((1 - r.price / r.origPrice) * 100) : 0;
              return (
                <Link key={r.id} href={`/now/product/${r.id}`} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-inherit no-underline transition hover:border-gray-300">
                  <div className="relative aspect-square bg-[#FAFAFA]">
                    <img src={img.src} alt={r.name} loading="lazy" className={img.isFallback ? 'h-full w-full object-cover' : 'h-full w-full bg-white object-contain p-2'} />
                    {d > 0 && <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10.5px] font-semibold leading-none text-white">{d}% off</span>}
                  </div>
                  <div className="p-2.5">
                    <p className="line-clamp-2 min-h-[2.5em] text-[13px] font-medium leading-[1.25]">{r.name}</p>
                    <p className="mt-0.5 truncate text-[12px] text-gray-500">{r.weight || r.brand}</p>
                    <p className="mt-1.5 text-[14px] font-semibold">₹{r.price}{r.origPrice && r.origPrice > r.price && <span className="ml-1 text-[12px] font-normal text-gray-400 line-through">₹{r.origPrice}</span>}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
