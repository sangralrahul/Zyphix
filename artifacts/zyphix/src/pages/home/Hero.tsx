import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, ChevronDown, Home, LayoutGrid, ShoppingBag, User, Bike, Tag, Clock } from 'lucide-react';
import { type Category } from '@/lib/catalog';
import { Container, Eyebrow, Display, GradientText, Lead, Button, Mesh, Aurora, Glass, Phone, SampleTag, Hairline, fade, G } from '@/ui/kit';
import { PRODUCT_COUNT, CATEGORY_NAMES, Swatch, NUM, SWATCH } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Hero — headline + a Phone mock of the Zyphix app home floating over a
   mesh/aurora, with two Glass satellite cards. Then a hairline signal row.
──────────────────────────────────────────────────────────────────────────── */

const MOCK_CATS: Array<[string, string]> = [['🥦', 'Fruits & Veg'], ['🥛', 'Dairy'], ['🍿', 'Snacks'], ['🌾', 'Atta & Dal'], ['🍞', 'Bakery']];
const MOCK_PRODUCTS: Array<{ name: string; qty: string; price: number; tone: keyof typeof SWATCH }> = [
  { name: 'Amul Taaza Milk', qty: '500 ml', price: 27, tone: 'blue' },
  { name: 'Bananas (Robusta)', qty: '6 pcs', price: 42, tone: 'amber' },
  { name: 'Aashirvaad Atta', qty: '5 kg', price: 265, tone: 'orange' },
  { name: 'Country Eggs', qty: '6 pcs', price: 54, tone: 'gray' },
];
const MOCK_EATS: Array<[string, string, string]> = [['Sharma Dhaba', 'North Indian', '22 min'], ['Dosa Corner', 'South Indian', '18 min']];

function AppHomeMock({ categories }: { categories: Category[] }) {
  const cats = categories.length ? categories.slice(0, 5).map(c => [c.icon, c.name.split(' ')[0]] as [string, string]) : MOCK_CATS;
  return (
    <div className="relative h-full bg-[#FAFAFA] text-gray-900" style={{ fontFamily: 'inherit' }}>
      {/* location + search */}
      <div className="bg-white px-4 pb-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700"><MapPin size={10} /> Deliver in 30 min</p>
            <p className="flex items-center gap-1 text-[13px] font-semibold tracking-[-0.01em]">Sector 15, Dwarka <ChevronDown size={12} className="text-gray-400" /></p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"><User size={14} /></span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FAFAFA] px-3 py-2 text-[12px] text-gray-400">
          <Search size={13} /> Search "milk", "atta", "dosa"…
        </div>
      </div>

      {/* category row */}
      <div className="flex gap-2 overflow-hidden px-4 pt-3">
        {cats.map(([ic, n]) => (
          <div key={n} className="flex w-[52px] shrink-0 flex-col items-center gap-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[18px] ring-1 ring-gray-200">{ic}</span>
            <span className="w-full truncate text-center text-[9.5px] font-medium text-gray-600">{n}</span>
          </div>
        ))}
      </div>

      {/* products */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-semibold tracking-[-0.01em]">Daily essentials</p>
          <span className="text-[10.5px] font-medium text-emerald-700">{PRODUCT_COUNT} products</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {MOCK_PRODUCTS.map(p => (
            <div key={p.name} className="rounded-xl border border-gray-200 bg-white p-2">
              <Swatch tone={p.tone} className="h-14 w-full" />
              <p className="mt-1.5 truncate text-[11px] font-semibold tracking-[-0.01em]">{p.name}</p>
              <p className="text-[9.5px] text-gray-500">{p.qty}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11.5px] font-semibold" style={NUM}>₹{p.price}</span>
                <span className="flex h-6 w-9 items-center justify-center rounded-md text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">ADD</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* eats row */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-semibold tracking-[-0.01em]">Zyphix Eats</p>
          <span className="inline-flex items-center gap-1 text-[10.5px] text-gray-500"><Clock size={10} /> near you</span>
        </div>
        <div className="mt-2 space-y-2">
          {MOCK_EATS.map(([n, c, t]) => (
            <div key={n} className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2">
              <Swatch tone="orange" className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold">{n}</p>
                <p className="text-[9.5px] text-gray-500">{c}</p>
              </div>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-700" style={NUM}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom nav */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-gray-200 bg-white px-2 pb-4 pt-2">
        {[[Home, 'Home', true], [LayoutGrid, 'Categories', false], [ShoppingBag, 'Cart', false], [User, 'Account', false]].map(([Ic, l, on]) => {
          const Icon = Ic as typeof Home;
          return (
            <span key={l as string} className={`flex flex-col items-center gap-0.5 text-[9px] font-medium ${on ? 'text-emerald-700' : 'text-gray-400'}`}><Icon size={16} />{l as string}</span>
          );
        })}
      </div>
      <SampleTag className="absolute right-3 top-1" />
    </div>
  );
}

export function Hero({ categories }: { categories: Category[] }) {
  return (
    <section className="relative overflow-hidden">
      <Mesh />
      <Container className="grid items-center gap-14 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:pb-28">
        <div>
          <motion.div {...fade(0)}><Eyebrow className="mb-5">India's SuperLocal App</Eyebrow></motion.div>
          <motion.div {...fade(0.05)}>
            <Display className="text-gray-900">Your neighbourhood,<br /><GradientText>delivered in 30 minutes.</GradientText></Display>
          </motion.div>
          <motion.div {...fade(0.1)}>
            <Lead className="mt-6 max-w-[520px]">Groceries, food and home services from the kirana stores, restaurants and professionals a few streets away. Shelf prices, zero surge.</Lead>
          </motion.div>
          <motion.div {...fade(0.15)} className="mt-8 flex flex-wrap gap-3">
            <Button href="/now" size="lg">Order now</Button>
            <Button href="#products" variant="secondary" size="lg">See products</Button>
          </motion.div>
          <motion.p {...fade(0.2)} className="mt-6 text-[13px] text-gray-500">Works in your browser today · iOS and Android apps coming soon</motion.p>
        </div>

        <motion.div {...fade(0.2, 24)} className="relative mx-auto w-full max-w-[460px] py-8">
          <div className="absolute inset-x-6 inset-y-10 rounded-[48px] opacity-80 blur-2xl" aria-hidden>
            <div className="relative h-full w-full overflow-hidden rounded-[48px]"><Aurora /></div>
          </div>
          <Phone className="relative z-10 scale-[.92] sm:scale-100">
            <AppHomeMock categories={categories} />
          </Phone>

          <Glass className="absolute left-0 top-16 z-20 hidden w-[200px] p-3.5 sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Bike size={16} /></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.01em] text-gray-900">Rider 2 min away</p>
                <p className="text-[11.5px] text-gray-500">Order #Z-1042 · on the way</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/70">
              <motion.div className="h-full rounded-full" style={{ background: G }} initial={{ width: '20%' }} animate={{ width: '82%' }} transition={{ duration: 2.4, delay: 0.8, ease: 'easeOut' }} />
            </div>
          </Glass>

          <Glass className="absolute bottom-20 right-0 z-20 hidden w-[210px] p-3.5 sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Tag size={16} /></span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.01em] text-gray-900">Shelf price = app price</p>
                <p className="text-[11.5px] text-gray-500">No markup, no surge</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-white/70 px-2.5 py-1.5 text-[11.5px] ring-1 ring-gray-200/70">
              <span className="text-gray-600">Amul Taaza 500 ml</span><span className="font-semibold text-gray-900" style={NUM}>₹27</span>
            </div>
          </Glass>
        </motion.div>
      </Container>
    </section>
  );
}

/* ── Signal row ───────────────────────────────────────────────────────────── */
export function SignalRow({ categories }: { categories: Category[] }) {
  const catCount = categories.length || CATEGORY_NAMES.length;
  const items: Array<[React.ReactNode, string]> = [
    [PRODUCT_COUNT, 'products listed'],
    [`${catCount}`, 'live categories'],
    ['30 min', 'delivery target'],
    ['Zero', 'surge pricing'],
  ];
  return (
    <section className="relative">
      <Hairline />
      <Container>
        <div className="grid grid-cols-2 divide-gray-200 md:grid-cols-4 md:divide-x">
          {items.map(([v, l], i) => (
            <motion.div key={l} {...fade(i * 0.05)} className="flex flex-col gap-0.5 px-2 py-7 md:items-center md:px-6">
              <span className="text-[26px] font-semibold tracking-[-0.03em] text-gray-900" style={NUM}>{v}</span>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-500"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />{l}</span>
            </motion.div>
          ))}
        </div>
      </Container>
      <Hairline />
    </section>
  );
}
