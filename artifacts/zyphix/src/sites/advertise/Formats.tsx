import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutPanelTop, Rows3, Sparkles, Search, Star, TicketPercent, MapPin, ChevronDown, Plus,
  ArrowRight, Clock, Copy, Check, Info, Ruler, Type, Receipt, Wrench,
} from 'lucide-react';
import { G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2, SponsoredTag } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Ad formats — tabbed, each tab with a dedicated in-app placement preview.
──────────────────────────────────────────────────────────────────────────── */

type Format = {
  id: string;
  icon: React.ReactNode;
  label: string;
  product: string;
  what: string;
  where: string;
  bestFor: string[];
  specs: Array<[string, string]>;
  billing: string;
  preview: React.ReactNode;
};

/* ── Preview scaffolding ─────────────────────────────────────────────────── */
function Screen({ children, title = 'Zyphix Now', area = 'Sector 12, Dwarka', accent = G }: { children: React.ReactNode; title?: string; area?: string; accent?: string }) {
  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[28px] border border-gray-200 bg-[#F8F9FA] shadow-[0_24px_60px_rgba(11,18,32,.12)]">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="flex items-center gap-1 text-[12.5px] font-black" style={{ fontFamily: HEAD_FONT }}><MapPin size={11} style={{ color: accent }} /> {area} <ChevronDown size={12} className="text-gray-400" /></p>
        </div>
        <span className="rounded-full px-2 py-1 text-[10.5px] font-black" style={{ background: `${accent}14`, color: accent }}>~22 min</span>
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

function SearchBar({ value }: { value?: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-[11.5px] ${value ? 'border-emerald-300 text-gray-900 ring-2 ring-emerald-100' : 'border-gray-200 text-gray-400'}`}>
      <Search size={13} className="text-gray-400" /> {value ?? 'Search "atta", "milk", "poha"…'}
    </div>
  );
}

function Tile({ name, price, tone = 'gray', highlight = false, badge }: { name: string; price: string; tone?: string; highlight?: boolean; badge?: string }) {
  const bg: Record<string, string> = {
    gray: 'linear-gradient(135deg,#F3F4F6,#E5E7EB)', green: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)', amber: 'linear-gradient(135deg,#FDE68A,#F59E0B)',
    red: 'linear-gradient(135deg,#FECACA,#F87171)', blue: 'linear-gradient(135deg,#DBEAFE,#93C5FD)', purple: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)',
  };
  return (
    <div className={`relative rounded-xl border bg-white p-2 ${highlight ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
      {badge && <span className="absolute -top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white"><Sparkles size={8} /> {badge}</span>}
      <div className="h-12 rounded-lg" style={{ background: bg[tone] }} />
      <p className="mt-1.5 truncate text-[10.5px] font-bold">{name}</p>
      <div className="mt-0.5 flex items-center justify-between">
        <p className="text-[10.5px] font-black">{price}</p>
        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={10} /></span>
      </div>
    </div>
  );
}

function Row({ title, sponsored = false, children }: { title: string; sponsored?: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[12px] font-bold">{title} {sponsored && <SponsoredTag />}</p>
        <span className="text-[10.5px] font-semibold text-emerald-700">See all</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">{children}</div>
    </div>
  );
}

function Ghost({ h = 'h-10' }: { h?: string }) {
  return <div className={`${h} rounded-xl border border-dashed border-gray-200 bg-white/60`} />;
}

/* ── Individual previews ──────────────────────────────────────────────────── */
function HomeBannerPreview() {
  return (
    <Screen>
      <SearchBar />
      <div className="relative mt-3 overflow-hidden rounded-2xl p-3.5 text-white ring-4 ring-emerald-200/70" style={{ background: `linear-gradient(135deg, ${G}, #047857)` }}>
        <div aria-hidden className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/15" />
        <SponsoredTag dark className="absolute right-2.5 top-2.5" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75">Your brand</p>
        <p className="mt-1 max-w-[180px] text-[15px] font-black leading-tight" style={{ fontFamily: HEAD_FONT }}>Fresh oats, now at your local kirana</p>
        <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-emerald-700">Shop the range <ArrowRight size={10} /></span>
      </div>
      <div className="mt-2 flex justify-center gap-1">{[0, 1, 2].map(i => <span key={i} className={`h-1 rounded-full ${i === 0 ? 'w-4 bg-emerald-600' : 'w-1 bg-gray-300'}`} />)}</div>
      <Row title="Fruits & vegetables"><Tile name="Bananas" price="₹45" tone="amber" /><Tile name="Tomatoes" price="₹32" tone="red" /><Tile name="Spinach" price="₹18" tone="green" /></Row>
      <div className="mt-3"><Ghost /></div>
    </Screen>
  );
}

function CategoryRowPreview() {
  return (
    <Screen>
      <SearchBar />
      <div className="mt-3"><Ghost h="h-16" /></div>
      <div className="mt-3 rounded-2xl p-1.5 ring-4 ring-emerald-200/70">
        <div className="flex items-center justify-between px-1">
          <p className="flex items-center gap-1.5 text-[12px] font-bold">Breakfast by YourBrand <SponsoredTag /></p>
          <span className="text-[10.5px] font-semibold text-emerald-700">See all</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Tile name="Rolled oats 1kg" price="₹189" tone="green" /><Tile name="Muesli 500g" price="₹249" tone="green" /><Tile name="Instant oats" price="₹99" tone="green" />
        </div>
      </div>
      <Row title="Dairy & eggs"><Tile name="Toned milk" price="₹28" tone="blue" /><Tile name="Curd 400g" price="₹35" tone="blue" /><Tile name="Eggs ×6" price="₹48" tone="amber" /></Row>
    </Screen>
  );
}

function SpotlightPreview() {
  return (
    <Screen>
      <SearchBar />
      <div className="mt-3 flex gap-2 overflow-hidden">
        {['All', 'Tea & coffee', 'Snacks', 'Staples'].map((c, i) => <span key={c} className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${i === 1 ? 'bg-emerald-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{c}</span>)}
      </div>
      <Row title="Tea & coffee">
        <Tile name="Chai masala 100g" price="₹65" tone="amber" highlight badge="Spotlight" />
        <Tile name="Assam tea 250g" price="₹120" tone="gray" />
        <Tile name="Filter coffee" price="₹180" tone="gray" />
        <Tile name="Green tea ×25" price="₹140" tone="gray" />
        <Tile name="Ginger tea" price="₹95" tone="gray" />
        <Tile name="Jaggery 500g" price="₹60" tone="gray" />
      </Row>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-[10.5px] text-emerald-800"><Info size={12} /> Spotlight sits first in its category with a badge and tinted card.</div>
    </Screen>
  );
}

function SearchPreview() {
  return (
    <Screen>
      <SearchBar value="atta" />
      <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Results for "atta" · 14 items</p>
      <div className="relative mt-2 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-white p-2.5 ring-4 ring-emerald-200/70">
        <SponsoredTag className="absolute right-2 top-2" />
        <div className="h-12 w-12 shrink-0 rounded-xl" style={{ background: 'linear-gradient(135deg,#FDE68A,#F59E0B)' }} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11.5px] font-bold">YourBrand Chakki Atta 5kg</p>
          <p className="text-[10.5px] text-gray-500">Sharma Kirana · 0.8 km</p>
          <p className="text-[11px] font-black">₹265</p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-300 text-emerald-700"><Plus size={12} /></span>
      </div>
      {[['Whole wheat atta 5kg', '₹240'], ['Multigrain atta 1kg', '₹85'], ['Besan 500g', '₹58']].map(([n, p]) => (
        <div key={n} className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2.5">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-100" />
          <div className="min-w-0 flex-1"><p className="truncate text-[11.5px] font-bold text-gray-800">{n}</p><p className="text-[10.5px] text-gray-500">Local shelf · 1.1 km</p><p className="text-[11px] font-black">{p}</p></div>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500"><Plus size={12} /></span>
        </div>
      ))}
    </Screen>
  );
}

function FeaturedPreview() {
  return (
    <Screen title="Zyphix Eats" accent="#EA580C">
      <SearchBar value={undefined} />
      <p className="mt-3 flex items-center gap-1.5 text-[12px] font-bold">Featured near you <SponsoredTag /></p>
      <div className="relative mt-2 overflow-hidden rounded-2xl border border-orange-200 bg-white ring-4 ring-orange-100">
        <div className="h-20" style={{ background: 'linear-gradient(135deg,#FED7AA,#FB923C)' }} />
        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[9.5px] font-bold text-orange-700 shadow">Featured</span>
        <div className="p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold">Biryani House</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600"><Clock size={10} /> 25 min</span>
          </div>
          <p className="text-[10.5px] text-gray-500">Hyderabadi · Mughlai · 1.4 km · Free delivery over ₹299</p>
          <div className="mt-2 flex gap-1.5">{['Chicken biryani', 'Veg biryani', 'Kebabs'].map(d => <span key={d} className="rounded-full border border-gray-200 px-2 py-0.5 text-[9.5px] text-gray-600">{d}</span>)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[['Dosa Corner', '18 min'], ['Punjabi Dhaba', '30 min']].map(([n, t]) => (
          <div key={n} className="rounded-2xl border border-gray-200 bg-white p-2">
            <div className="h-12 rounded-xl bg-gray-100" />
            <p className="mt-1.5 text-[11px] font-bold">{n}</p><p className="text-[10px] text-gray-500">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2 text-[10.5px] text-blue-800"><Wrench size={12} /> Same slot exists in Zyphix Book for salons, repair and cleaning pros.</div>
    </Screen>
  );
}

function OffersPreview() {
  return (
    <Screen title="Offers" area="Sector 12, Dwarka">
      <p className="text-[12px] font-bold">Offers near you</p>
      <div className="relative mt-2 overflow-hidden rounded-2xl border border-emerald-300 bg-white ring-4 ring-emerald-200/70">
        <div className="flex">
          <div className="flex w-[84px] shrink-0 flex-col items-center justify-center p-2 text-center text-white" style={{ background: `linear-gradient(180deg, ${G}, #047857)` }}>
            <p className="text-[18px] font-black leading-none" style={{ fontFamily: HEAD_FONT }}>₹50</p>
            <p className="text-[9.5px] font-semibold text-white/85">off first order</p>
          </div>
          <div className="min-w-0 flex-1 p-2.5">
            <div className="flex items-center justify-between"><p className="truncate text-[11.5px] font-bold">YourBrand oats range</p><SponsoredTag /></div>
            <p className="mt-0.5 text-[10px] text-gray-500">Min. order ₹199 · valid till 31 Oct · 6 pin codes</p>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-2 py-1">
              <span className="text-[10.5px] font-black tracking-wider text-emerald-800">OATS50</span>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700"><Copy size={10} /> Copy</span>
            </div>
          </div>
        </div>
      </div>
      {[['Free delivery on Eats', 'Zyphix', 'Till Sunday'], ['10% off at Sharma Kirana', 'Store offer', '2 days left']].map(([n, s, t]) => (
        <div key={n} className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500"><TicketPercent size={15} /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-bold text-gray-800">{n}</p><p className="text-[10px] text-gray-500">{s} · {t}</p></div>
        </div>
      ))}
      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">At checkout</p>
        <div className="mt-1 flex items-center justify-between text-[11px]"><span className="flex items-center gap-1 font-semibold text-emerald-700"><Check size={12} /> OATS50 applied</span><span className="font-black">−₹50</span></div>
      </div>
    </Screen>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */
const FORMATS: Format[] = [
  {
    id: 'banner', icon: <LayoutPanelTop size={17} />, label: 'Home banner', product: 'Zyphix Now · Eats · Book',
    what: 'A full-width carousel banner at the top of the home screen — the first thing a customer sees after opening the app in your chosen areas.',
    where: 'Home screen of Zyphix Now, Eats or Book, directly under the search bar. Up to three banners rotate; yours holds a fixed slot for the booked period.',
    bestFor: ['Product launches in a new locality', 'Brand awareness with a single strong visual', 'Driving a seasonal range or festive campaign'],
    specs: [['Image', '1200 × 600 px (2:1), JPG or PNG, under 400 KB'], ['Headline', 'Up to 40 characters'], ['CTA label', 'Up to 18 characters'], ['Link', 'In-app category, store, product or coupon']],
    billing: 'Flat rate per placement per period (7, 14 or 30 days), per delivery area.',
    preview: <HomeBannerPreview />,
  },
  {
    id: 'row', icon: <Rows3 size={17} />, label: 'Sponsored category row', product: 'Zyphix Now',
    what: 'A named product row on the grocery home screen that carries only your SKUs — "Breakfast by YourBrand" — pulled from partner kirana inventory nearby.',
    where: 'Second or third row on the Zyphix Now home screen, above organic category rows. Items link to the live product page at the local store\'s price.',
    bestFor: ['FMCG ranges with 3–9 SKUs stocked locally', 'Cross-selling a full line, not one product', 'Keeping a range top-of-mind during a promotion'],
    specs: [['Row title', 'Up to 28 characters, brand name included'], ['Products', '3 to 9 SKUs that are stocked by partner stores in the target area'], ['Tile image', '600 × 600 px (1:1), white or plain background'], ['Ordering', 'Fixed or rotating, your choice']],
    billing: 'Flat rate per placement per period, per delivery area. Price does not change with the number of SKUs.',
    preview: <CategoryRowPreview />,
  },
  {
    id: 'spotlight', icon: <Sparkles size={17} />, label: 'Product spotlight', product: 'Zyphix Now',
    what: 'One SKU pinned to the first tile of its category with a "Spotlight" badge and tinted card, so it stands out from items on the same local shelf.',
    where: 'Inside the category listing (e.g. Tea & coffee, Snacks, Staples) in Zyphix Now. One spotlight per category per area at a time.',
    bestFor: ['Hero SKU trial and first-basket adoption', 'Defending a category against substitutes', 'New pack size or flavour'],
    specs: [['Product', 'One SKU, already listed by partner stores in the area'], ['Tile image', '600 × 600 px (1:1)'], ['Badge text', '"Spotlight" (fixed) — brand name shows on the tile'], ['Optional', 'First-order discount applied at checkout']],
    billing: 'Flat rate per category per period, per delivery area.',
    preview: <SpotlightPreview />,
  },
  {
    id: 'search', icon: <Search size={17} />, label: 'Search placement', product: 'Zyphix Now · Eats',
    what: 'Your product or restaurant shown as the first result for the search terms you choose — "atta", "chai", "biryani" — clearly marked Sponsored.',
    where: 'Top of search results in Zyphix Now (products) or Eats (restaurants). Organic results follow unchanged.',
    bestFor: ['High-intent categories where customers search by generic name', 'Winning the moment a customer is comparing options', 'Restaurants competing on a signature dish'],
    specs: [['Keywords', 'Up to 10 terms per placement, incl. Hinglish spellings'], ['Result card', 'Uses the live product or restaurant listing'], ['Exclusivity', 'One sponsored result per term per area'], ['Eligibility', 'Item must be available from a partner in the area']],
    billing: 'Flat rate per keyword set per period, per delivery area. Not per click.',
    preview: <SearchPreview />,
  },
  {
    id: 'featured', icon: <Star size={17} />, label: 'Featured in Eats / Book', product: 'Zyphix Eats · Book',
    what: 'A large featured card for your restaurant, cloud kitchen, salon or service business at the top of the Eats or Book home screen in your own neighbourhood.',
    where: '"Featured near you" slot on the Zyphix Eats home screen, or the equivalent slot in Zyphix Book for services. Shown only inside your delivery or service radius.',
    bestFor: ['Restaurants wanting more weekend and dinner orders', 'Salons, cleaners, electricians and repair pros building a local base', 'New outlets announcing themselves to the area'],
    specs: [['Cover image', '1200 × 675 px (16:9), food or workspace photography'], ['Highlights', 'Up to 3 dish or service chips, 16 characters each'], ['Listing', 'Must be a live, verified Zyphix partner'], ['Radius', 'Matches your delivery / service area']],
    billing: 'Flat rate per placement per period, per neighbourhood.',
    preview: <FeaturedPreview />,
  },
  {
    id: 'offers', icon: <TicketPercent size={17} />, label: 'Offers & coupons push', product: 'Offers tab · Checkout',
    what: 'A coupon card in the Offers tab plus automatic surfacing at checkout when a customer\'s cart qualifies. The most direct way to drive a first order.',
    where: 'Offers tab (top position for the period) and the checkout "Apply coupon" sheet, for customers in your chosen areas.',
    bestFor: ['Sampling and first-order trial', 'Clearing seasonal stock through partner stores', 'Pairing with a banner or row to convert attention into orders'],
    specs: [['Coupon', 'Flat ₹ off or % off, with min. order value'], ['Code', 'Up to 10 characters, alphanumeric'], ['Validity', 'Date range within the booked period'], ['Funding', 'Discount funded by you; Zyphix applies it at checkout']],
    billing: 'Flat placement rate per period, per delivery area. The discount itself is settled separately against redeemed orders.',
    preview: <OffersPreview />,
  },
];

/* ── Section ─────────────────────────────────────────────────────────────── */
export function Formats() {
  const [active, setActive] = useState(0);
  const f = FORMATS[active];

  return (
    <section id="formats" className={`${CONTAINER} scroll-mt-20 py-20 md:py-24`}>
      <div className="max-w-[720px]">
        <Eyebrow>Ad formats</Eyebrow>
        <H2>Six placements, each built into the shopping journey.</H2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">Every format lives inside the app at the moment a decision is being made. All of them are labelled "Sponsored" to customers, all are priced flat, and all are reported individually.</p>
      </div>

      {/* tabs */}
      <div className="mt-10 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist" aria-label="Ad formats">
        <div className="flex w-max gap-2 md:w-auto md:flex-wrap">
          {FORMATS.map((t, i) => (
            <button key={t.id} role="tab" aria-selected={active === i} onClick={() => setActive(i)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13.5px] font-bold transition ${active === i ? 'border-transparent text-white shadow-[0_8px_24px_rgba(13,163,102,.3)]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
              style={active === i ? { background: G } : undefined}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* panel */}
      <motion.div key={f.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}
        className="mt-6 grid overflow-hidden rounded-[32px] border border-gray-200 bg-white lg:grid-cols-[.9fr_1.1fr]" role="tabpanel">
        <div className="relative flex items-center justify-center border-b border-gray-200 bg-gray-50 p-6 md:p-10 lg:border-b-0 lg:border-r">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.5]" style={{ backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          <div className="relative">{f.preview}</div>
          <span className="absolute left-5 top-5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">Preview · {f.product}</span>
        </div>

        <div className="p-7 md:p-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{f.icon}</span>
            <h3 className="text-[24px] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>{f.label}</h3>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">{f.what}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-400"><MapPin size={13} /> Where it appears</p>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{f.where}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-400"><Star size={13} /> Best for</p>
              <ul className="mt-2 space-y-1.5">
                {f.bestFor.map(b => <li key={b} className="flex items-start gap-2 text-[14px] leading-snug text-gray-600"><Check size={14} className="mt-[3px] shrink-0 text-emerald-600" />{b}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-400"><Ruler size={13} /> Creative specs</p>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {f.specs.map(([k, v]) => (
                <div key={k} className="flex gap-2 text-[13.5px]">
                  <dt className="w-[86px] shrink-0 font-bold text-gray-800">{k}</dt>
                  <dd className="text-gray-600">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <span className="mt-0.5 text-emerald-700"><Receipt size={16} /></span>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-emerald-800">How it's billed</p>
              <p className="mt-1 text-[14px] leading-relaxed text-emerald-900/80">{f.billing}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-bold text-white transition hover:-translate-y-0.5" style={{ background: G }}>Get a quote for {f.label.toLowerCase()} <ArrowRight size={15} /></a>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-gray-500"><Type size={13} /> Copy and artwork reviewed before go-live</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
