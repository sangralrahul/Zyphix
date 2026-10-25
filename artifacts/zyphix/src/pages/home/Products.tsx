import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { type Category } from '@/lib/catalog';
import { Kicker, PhotoTile } from '@/ui/cinema';
import { Accent, ScrollStory, HScrollGallery, type Chapter } from '@/ui/motion2';
import { ArrowLink } from '@/ui/kit';
import { VIDEOS } from '@/data/media';
import { NOW_SITE, EATS_SITE, BOOK_SITE, PRODUCT_COUNT, CATEGORY_NAMES, AISLES, aisleName, Display } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Products: a pinned three-chapter story (Now → Eats → Book, id="products")
   and a pinned horizontal gallery of the real Zyphix Now aisles.
──────────────────────────────────────────────────────────────────────────── */

function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(t => <li key={t} className="inline-flex h-9 items-center rounded-full border border-white/12 bg-white/[.06] px-3.5 text-[13px] font-medium text-white/80 backdrop-blur">{t}</li>)}
    </ul>
  );
}

const CHAPTERS: Chapter[] = [
  {
    kicker: '01 · Zyphix Now · Groceries',
    title: <>Your corner store, at your door in <Accent green>30 minutes</Accent>.</>,
    body: `Real shelves from stores near you, at shelf prices. ${PRODUCT_COUNT} products, packed the moment you order and tracked to your gate.`,
    clip: VIDEOS.packing,
    extra: <><Pills items={['30-min promise', 'Free delivery on bigger baskets', 'Cash on delivery']} /><div className="mt-6"><ArrowLink href={NOW_SITE} dark>Shop on now.zyphix.in</ArrowLink></div></>,
  },
  {
    kicker: '02 · Zyphix Eats · Food',
    title: <>Dinner from the kitchen you <Accent green>already love</Accent>.</>,
    body: 'Restaurants, cafés and home kitchens around you list their own menus at their own prices. No markup, no surge, still hot at the door.',
    clip: VIDEOS.cooking,
    extra: <><Pills items={['Menu prices', 'Riders from your area', 'Pay online or cash']} /><div className="mt-6"><ArrowLink href={EATS_SITE} dark>Order on eats.zyphix.in</ArrowLink></div></>,
  },
  {
    kicker: '03 · Zyphix Book · Home services',
    title: <>Verified pros, booked <Accent green>in a minute</Accent>.</>,
    body: 'Plumbers, electricians, AC technicians, cleaners and salon artists who have shown us their ID and their work. Fixed quote first, pay when it is done.',
    clip: VIDEOS.plumber,
    extra: <><Pills items={['ID-verified', 'Pick a slot', '7-day work guarantee']} /><div className="mt-6"><ArrowLink href={BOOK_SITE} dark>Book on book.zyphix.in</ArrowLink></div></>,
  },
];

export function ProductStory() {
  return <ScrollStory id="products" chapters={CHAPTERS} />;
}

/* ── Aisles gallery (8 curated aisles, each with its own photo) ─────────── */
export function AislesGallery({ categories }: { categories: Category[] }) {
  const total = categories.length || CATEGORY_NAMES.length;
  const items = AISLES.map((a, i) => {
    const name = aisleName(a, categories);
    return (
      <a key={a.name} href={NOW_SITE} className="group block" aria-label={`Shop ${name} on Zyphix Now`}>
        <PhotoTile photo={a.photo} ratio="4/5" rounded="rounded-3xl" className="!bg-[#0B1220] ring-1 ring-white/10">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#05080E]/90 via-[#05080E]/10 to-transparent" />
          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[12px] font-medium tabular-nums text-white/80 backdrop-blur-md">{String(i + 1).padStart(2, '0')}</span>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">{name}</p>
              <p className="mt-1 text-[13px] text-white/60">On Zyphix Now</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"><ArrowUpRight size={18} /></span>
          </div>
        </PhotoTile>
      </a>
    );
  });
  items.push(
    <a key="all" href={NOW_SITE} className="group flex aspect-[4/5] flex-col justify-between rounded-3xl p-7 text-white ring-1 ring-white/10" style={{ background: 'linear-gradient(160deg, #0DA366 0%, #077A46 100%)' }}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">All aisles</p>
      <div>
        <p className="text-[32px] font-semibold leading-[1.04] tracking-[-0.04em]">{total} categories, {PRODUCT_COUNT} products.</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold">Open now.zyphix.in <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
      </div>
    </a>,
  );
  return (
    <HScrollGallery
      id="aisles"
      items={items}
      cardClass="w-[74vw] sm:w-[280px]"
      header={
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker light>Zyphix Now aisles</Kicker>
            <Display light>Every aisle of the <Accent green>corner store</Accent>.</Display>
          </div>
          <p className="max-w-[40ch] text-[16px] leading-[1.6] text-white/60 md:text-right">The live catalogue, straight from partner shelves. Browse the aisles, then shop them in one basket.</p>
        </div>
      }
    />
  );
}
