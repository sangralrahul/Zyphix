import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Store, Flame } from 'lucide-react';
import { type Category } from '@/lib/catalog';
import { G, HEAD_FONT, SectionHead } from '@/components/layout/SiteChrome';
import { CONTAINER, SampleTag, SWATCH, fade, MONO, PRODUCT_COUNT } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Shop by category (photo tiles from the live category list) + a horizontal
   "popular right now" row of sample product cards.
──────────────────────────────────────────────────────────────────────────── */

type Sample = { name: string; unit: string; price: string; cat: string; store: string; tone: keyof typeof SWATCH; badge?: string };
const POPULAR: Sample[] = [
  { name: 'Amul Taaza Toned Milk', unit: '500 ml', price: '₹28', cat: 'Dairy & Eggs', store: 'Sharma Kirana', tone: 'blue', badge: 'Bought daily' },
  { name: 'Bananas (Robusta)', unit: '6 pc', price: '₹42', cat: 'Fruits & Veg', store: 'Fresh Basket', tone: 'amber' },
  { name: 'Aashirvaad Atta', unit: '5 kg', price: '₹265', cat: 'Atta, Rice & Dal', store: 'Gupta General', tone: 'green' },
  { name: 'Tata Tea Gold', unit: '250 g', price: '₹145', cat: 'Tea & Coffee', store: 'Sharma Kirana', tone: 'orange' },
  { name: 'Maggi 2-Minute Noodles', unit: '12 pack', price: '₹168', cat: 'Noodles & Pasta', store: 'Gupta General', tone: 'red', badge: 'Popular' },
  { name: 'Dettol Handwash', unit: '200 ml', price: '₹99', cat: 'Personal Care', store: 'Apna Medical', tone: 'teal' },
  { name: 'Haldiram Aloo Bhujia', unit: '400 g', price: '₹95', cat: 'Snacks & Munchies', store: 'Sharma Kirana', tone: 'purple' },
  { name: 'Fortune Sunflower Oil', unit: '1 L', price: '₹142', cat: 'Oils & Ghee', store: 'Gupta General', tone: 'amber' },
  { name: 'Crocin Advance', unit: '15 tabs', price: '₹34', cat: 'Pharmacy', store: 'Apna Medical', tone: 'gray' },
  { name: 'Amul Butter', unit: '100 g', price: '₹58', cat: 'Dairy & Eggs', store: 'Fresh Basket', tone: 'pink' },
];

export function StoreShowcase({ categories }: { categories: Category[] }) {
  const cats = categories.slice(0, 12);
  const total = categories.length || 26;
  return (
    <section id="categories" className="scroll-mt-20 border-y border-gray-200 bg-gray-50">
      <div className={`${CONTAINER} py-20 md:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead align="left" eyebrow="Shop by category" title="Everything your kitchen and home needs." sub={`${total} categories and ${PRODUCT_COUNT} products — all from stores within a few kilometres of you, at the price on the shelf.`} />
          <Link href="/now" className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-900 hover:bg-gray-100">Browse all {total} <ArrowRight size={15} /></Link>
        </div>

        {cats.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cats.map((c, i) => (
              <motion.div key={c.name} {...fade(Math.min(i, 6) * .04)} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <Link href="/now" className={`group relative block h-full overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,18,32,.12)] ${i === 0 ? 'min-h-[260px] lg:min-h-[320px]' : 'min-h-[150px]'}`}>
                  <img src={c.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0) 30%, rgba(11,18,32,.88) 100%)' }} />
                  <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white" style={{ background: c.color || G }}>{i === 0 ? 'Most ordered' : 'Zyphix Now'}</span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <div>
                      <span className="text-[20px]">{c.icon}</span>
                      <p className={`font-black tracking-tight ${i === 0 ? 'text-[26px]' : 'text-[16px]'}`} style={{ fontFamily: HEAD_FONT }}>{c.name}</p>
                      {i === 0 && <p className="mt-1 max-w-[320px] text-[13px] text-white/75">Daily fresh stock from the vegetable vendor and kirana nearest to you.</p>}
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-gray-900"><ArrowRight size={16} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className={`animate-pulse rounded-3xl bg-gray-200 ${i === 0 ? 'col-span-2 row-span-2 min-h-[260px]' : 'min-h-[150px]'}`} />)}
          </div>
        )}

        {/* popular right now */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700"><Flame size={13} /> Popular right now</p>
            <h3 className="mt-2 text-[22px] font-black tracking-tight text-gray-900 md:text-[26px]" style={{ fontFamily: HEAD_FONT }}>What neighbourhoods reorder every week.</h3>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-gray-500"><SampleTag /> Illustrative items and prices — the live catalogue shows your local store's shelf.</div>
        </div>
        <div className="-mx-5 mt-6 overflow-x-auto px-5 pb-2 [scrollbar-width:thin]">
          <div className="flex w-max gap-3.5">
            {POPULAR.map((p, i) => (
              <motion.div key={p.name} {...fade(Math.min(i, 5) * .04)} className="w-[196px] shrink-0 rounded-2xl border border-gray-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,18,32,.10)]">
                <div className="relative h-[110px] rounded-xl" style={{ background: SWATCH[p.tone] }}>
                  {p.badge && <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 shadow">{p.badge}</span>}
                </div>
                <p className="mt-2.5 truncate text-[13px] font-bold text-gray-900">{p.name}</p>
                <p className="text-[11px] text-gray-500">{p.unit} · {p.cat}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-gray-500"><Store size={11} /> {p.store}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <p className="text-[15px] font-black text-gray-900" style={MONO}>{p.price}</p>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 px-2 py-1 text-[11px] font-bold text-emerald-700"><Plus size={11} /> Add</span>
                </div>
              </motion.div>
            ))}
            <Link href="/now" className="flex w-[160px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-4 text-center text-[13px] font-bold text-gray-700 transition hover:bg-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: G }}><ArrowRight size={16} /></span>
              Browse {PRODUCT_COUNT} products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
