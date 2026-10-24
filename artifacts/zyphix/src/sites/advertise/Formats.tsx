import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutPanelTop, Rows3, Sparkles, Search, Star, TicketPercent, Plus, Clock, Check } from 'lucide-react';
import { Section, Container, SectionTitle, Phone, SampleTag, Chip, ArrowLink, G, G_DEEP } from '@/ui/kit';
import { AppHeader, AppSearch, AppBanner, AppDots, AppRow, AppTile, AppGhost, SponsoredTag } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Ad formats — six tabs. Left: in-app preview inside a Phone. Right: what /
   where / best for / specs / billing. Copy kept to 2–3 short lines each.
──────────────────────────────────────────────────────────────────────────── */

type Format = {
  id: string; icon: React.ReactNode; label: string; product: string;
  what: string; where: string; bestFor: string[];
  specs: Array<[string, string]>; billing: string; preview: React.ReactNode;
};

/* ── Previews ─────────────────────────────────────────────────────────────── */
const BannerPreview = () => (
  <Phone>
    <AppHeader /><AppSearch />
    <AppBanner highlight /><AppDots />
    <AppRow title="Fruits & vegetables"><AppTile name="Bananas" price="₹45" tone="amber" /><AppTile name="Tomatoes" price="₹32" tone="rose" /><AppTile name="Spinach" price="₹18" tone="green" /></AppRow>
    <AppGhost className="h-16" />
    <SampleTag className="absolute bottom-3 right-3" />
  </Phone>
);

const RowPreview = () => (
  <Phone>
    <AppHeader /><AppSearch />
    <AppGhost className="h-16" />
    <AppRow title="Breakfast by YourBrand" sponsored highlight>
      <AppTile name="Rolled oats 1kg" price="₹189" tone="green" /><AppTile name="Muesli 500g" price="₹249" tone="green" /><AppTile name="Instant oats" price="₹99" tone="green" />
    </AppRow>
    <AppRow title="Dairy & eggs"><AppTile name="Toned milk" price="₹28" tone="blue" /><AppTile name="Curd 400g" price="₹35" tone="blue" /><AppTile name="Eggs ×6" price="₹48" tone="amber" /></AppRow>
    <SampleTag className="absolute bottom-3 right-3" />
  </Phone>
);

const SpotlightPreview = () => (
  <Phone>
    <AppHeader /><AppSearch />
    <div className="mx-4 mt-3 flex gap-1.5 overflow-hidden">
      {['All', 'Tea & coffee', 'Snacks', 'Staples'].map((c, i) => <span key={c} className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-medium ${i === 1 ? 'text-white' : 'border border-gray-200 bg-white text-gray-600'}`} style={i === 1 ? { background: G } : undefined}>{c}</span>)}
    </div>
    <AppRow title="Tea & coffee">
      <AppTile name="Chai masala" price="₹65" tone="amber" spotlight /><AppTile name="Assam tea" price="₹120" /><AppTile name="Filter coffee" price="₹180" />
      <AppTile name="Green tea ×25" price="₹140" /><AppTile name="Ginger tea" price="₹95" /><AppTile name="Jaggery 500g" price="₹60" />
    </AppRow>
    <SampleTag className="absolute bottom-3 right-3" />
  </Phone>
);

const SearchPreview = () => (
  <Phone>
    <AppHeader /><AppSearch value="atta" />
    <p className="mx-4 mt-3 text-[9.5px] font-medium uppercase tracking-wider text-gray-400">Results for "atta"</p>
    <div className="relative mx-4 mt-1.5 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-white p-2 ring-2 ring-emerald-100">
      <SponsoredTag className="absolute right-2 top-2" />
      <div className="h-10 w-10 shrink-0 rounded-lg" style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)' }} />
      <div className="min-w-0 flex-1"><p className="truncate text-[10.5px] font-semibold text-gray-900">YourBrand Chakki Atta 5kg</p><p className="text-[9.5px] text-gray-500">Sharma Kirana · 0.8 km</p><p className="text-[10px] font-semibold">₹265</p></div>
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={11} /></span>
    </div>
    {[['Whole wheat atta 5kg', '₹240'], ['Multigrain atta 1kg', '₹85'], ['Besan 500g', '₹58']].map(([n, p]) => (
      <div key={n} className="mx-4 mt-1.5 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
        <div className="min-w-0 flex-1"><p className="truncate text-[10.5px] font-semibold text-gray-800">{n}</p><p className="text-[9.5px] text-gray-500">Local shelf · 1.1 km</p><p className="text-[10px] font-semibold">{p}</p></div>
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500"><Plus size={11} /></span>
      </div>
    ))}
    <SampleTag className="absolute bottom-3 right-3" />
  </Phone>
);

const FeaturedPreview = () => (
  <Phone>
    <AppHeader product="Zyphix Eats" accent="#EA580C" /><AppSearch />
    <p className="mx-4 mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-gray-900">Featured near you <SponsoredTag /></p>
    <div className="relative mx-4 mt-1.5 overflow-hidden rounded-xl border border-orange-200 bg-white ring-2 ring-orange-100">
      <div className="h-16" style={{ background: 'linear-gradient(135deg,#FFEDD5,#FED7AA)' }} />
      <div className="p-2">
        <div className="flex items-center justify-between"><p className="text-[11px] font-semibold text-gray-900">Biryani House</p><span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-600"><Clock size={9} /> 25 min</span></div>
        <p className="text-[9.5px] text-gray-500">Hyderabadi · 1.4 km</p>
        <div className="mt-1.5 flex gap-1">{['Chicken biryani', 'Veg biryani', 'Kebabs'].map(d => <span key={d} className="rounded-full border border-gray-200 px-1.5 py-0.5 text-[8.5px] text-gray-600">{d}</span>)}</div>
      </div>
    </div>
    <div className="mx-4 mt-2 grid grid-cols-2 gap-1.5">
      {[['Dosa Corner', '18 min'], ['Punjabi Dhaba', '30 min']].map(([n, t]) => (
        <div key={n} className="rounded-xl border border-gray-200 bg-white p-1.5"><div className="h-10 rounded-lg bg-gray-100" /><p className="mt-1 text-[10px] font-semibold text-gray-900">{n}</p><p className="text-[9px] text-gray-500">{t}</p></div>
      ))}
    </div>
    <SampleTag className="absolute bottom-3 right-3" />
  </Phone>
);

const OffersPreview = () => (
  <Phone>
    <AppHeader product="Offers" />
    <p className="mx-4 mt-2 text-[11px] font-semibold text-gray-900">Offers near you</p>
    <div className="mx-4 mt-1.5 flex overflow-hidden rounded-xl border border-emerald-300 bg-white ring-2 ring-emerald-100">
      <div className="flex w-[70px] shrink-0 flex-col items-center justify-center p-2 text-center text-white" style={{ background: `linear-gradient(180deg, ${G}, ${G_DEEP})` }}>
        <p className="text-[16px] font-semibold leading-none">₹50</p><p className="text-[8.5px] text-white/85">off first order</p>
      </div>
      <div className="min-w-0 flex-1 p-2">
        <div className="flex items-center justify-between"><p className="truncate text-[10.5px] font-semibold text-gray-900">YourBrand oats range</p><SponsoredTag /></div>
        <p className="mt-0.5 text-[9px] text-gray-500">Min. order ₹199 · 6 pin codes</p>
        <div className="mt-1.5 flex items-center justify-between rounded-md border border-dashed border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-800"><span className="tracking-wider">OATS50</span><span>Copy</span></div>
      </div>
    </div>
    {[['Free delivery on Eats', 'Till Sunday'], ['10% off at Sharma Kirana', '2 days left']].map(([n, t]) => (
      <div key={n} className="mx-4 mt-1.5 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500"><TicketPercent size={13} /></span>
        <div className="min-w-0 flex-1"><p className="truncate text-[10.5px] font-semibold text-gray-800">{n}</p><p className="text-[9px] text-gray-500">{t}</p></div>
      </div>
    ))}
    <div className="mx-4 mt-3 rounded-xl border border-gray-200 bg-white p-2">
      <p className="text-[9px] font-medium uppercase tracking-wider text-gray-400">At checkout</p>
      <div className="mt-0.5 flex items-center justify-between text-[10px]"><span className="flex items-center gap-1 font-medium text-emerald-700"><Check size={11} /> OATS50 applied</span><span className="font-semibold">−₹50</span></div>
    </div>
    <SampleTag className="absolute bottom-3 right-3" />
  </Phone>
);

/* ── Data ─────────────────────────────────────────────────────────────────── */
const FORMATS: Format[] = [
  {
    id: 'banner', icon: <LayoutPanelTop size={16} />, label: 'Home banner', product: 'Now · Eats · Book',
    what: 'A full-width banner at the top of the home screen — the first thing a customer sees in your chosen areas.',
    where: 'Home screen, under the search bar. Up to three banners rotate; yours holds a fixed slot for the period.',
    bestFor: ['Launches in a new locality', 'One strong visual, one message', 'Seasonal or festive ranges'],
    specs: [['Image', '2:1 (1200 × 600 px), under 400 KB'], ['Headline', 'Up to 40 characters'], ['CTA', 'Up to 18 characters'], ['Link', 'Category, store, product or coupon']],
    billing: 'Flat rate per placement per period.', preview: <BannerPreview />,
  },
  {
    id: 'row', icon: <Rows3 size={16} />, label: 'Sponsored row', product: 'Zyphix Now',
    what: 'A named product row on the grocery home screen carrying only your SKUs, pulled from partner stores nearby.',
    where: 'Second or third row on the home screen, above organic rows. Tiles link to the live product at local prices.',
    bestFor: ['Ranges with 3–9 SKUs stocked locally', 'Cross-selling a full line', 'Keeping a range top-of-mind'],
    specs: [['Row title', 'Up to 28 characters'], ['Products', '3–9 SKUs stocked in the area'], ['Tile image', '1:1 (600 × 600 px), plain background'], ['Order', 'Fixed or rotating']],
    billing: 'Flat rate per placement per period.', preview: <RowPreview />,
  },
  {
    id: 'spotlight', icon: <Sparkles size={16} />, label: 'Product spotlight', product: 'Zyphix Now',
    what: 'One SKU pinned to the first tile of its category with a Spotlight badge, so it stands out from the local shelf.',
    where: 'Inside a category listing such as Tea & coffee or Staples. One spotlight per category per area at a time.',
    bestFor: ['Hero SKU trial', 'Defending a category', 'New pack size or flavour'],
    specs: [['Product', 'One SKU listed by partner stores'], ['Tile image', '1:1 (600 × 600 px)'], ['Badge', '"Spotlight" (fixed)'], ['Optional', 'First-order discount at checkout']],
    billing: 'Flat rate per placement per period.', preview: <SpotlightPreview />,
  },
  {
    id: 'search', icon: <Search size={16} />, label: 'Search placement', product: 'Now · Eats',
    what: 'Your product or restaurant shown as the first result for the terms you choose, clearly marked Sponsored.',
    where: 'Top of search results. Organic results follow unchanged.',
    bestFor: ['High-intent generic searches', 'The moment of comparison', 'Signature dishes'],
    specs: [['Keywords', 'Up to 10 terms, Hinglish included'], ['Card', 'Uses the live listing'], ['Exclusivity', 'One sponsored result per term per area'], ['Eligibility', 'Available from a partner in the area']],
    billing: 'Flat rate per placement per period — not per click.', preview: <SearchPreview />,
  },
  {
    id: 'featured', icon: <Star size={16} />, label: 'Featured in Eats / Book', product: 'Eats · Book',
    what: 'A large featured card for your restaurant, cloud kitchen, salon or service business in its own neighbourhood.',
    where: '"Featured near you" on the Eats home screen, or the equivalent slot in Book. Shown only inside your service radius.',
    bestFor: ['More weekend and dinner orders', 'Salons, cleaners and repair pros', 'New outlets announcing themselves'],
    specs: [['Cover', '16:9 (1200 × 675 px)'], ['Highlights', 'Up to 3 chips, 16 characters each'], ['Listing', 'Live, verified Zyphix partner'], ['Radius', 'Matches your service area']],
    billing: 'Flat rate per placement per period.', preview: <FeaturedPreview />,
  },
  {
    id: 'offers', icon: <TicketPercent size={16} />, label: 'Offers & coupons', product: 'Offers · Checkout',
    what: 'A coupon card in the Offers tab, surfaced again at checkout when a cart qualifies. The most direct route to a first order.',
    where: 'Top of the Offers tab for the period, plus the checkout coupon sheet, in your chosen areas.',
    bestFor: ['Sampling and first-order trial', 'Moving seasonal stock', 'Pairing with a banner or row'],
    specs: [['Coupon', 'Flat ₹ or % off, with minimum order'], ['Code', 'Up to 10 characters'], ['Validity', 'Within the booked period'], ['Funding', 'Discount funded by you']],
    billing: 'Flat rate per placement per period. The discount is settled separately against redeemed orders.', preview: <OffersPreview />,
  },
];

/* ── Section ─────────────────────────────────────────────────────────────── */
export function Formats() {
  const [active, setActive] = useState(0);
  const f = FORMATS[active];

  return (
    <Section id="formats" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="Formats" title="Six placements, built into the shopping journey." lead="Each one sits where a decision is being made. All are labelled Sponsored, priced flat and reported individually." />

        <div className="-mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Ad formats">
          <div className="flex w-max gap-1.5 rounded-full border border-gray-200 bg-[#FAFAFA] p-1 sm:w-auto sm:flex-wrap">
            {FORMATS.map((t, i) => (
              <button key={t.id} role="tab" aria-selected={active === i} onClick={() => setActive(i)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition ${active === i ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(11,15,25,.08)] ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>
                <span className={active === i ? 'text-emerald-700' : 'text-gray-400'}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid overflow-hidden rounded-2xl border border-gray-200 bg-white lg:grid-cols-[.9fr_1.1fr]" role="tabpanel">
          <div className="relative flex items-center justify-center overflow-hidden border-b border-gray-200 bg-[#FAFAFA] px-6 pb-0 pt-10 lg:border-b-0 lg:border-r">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            <div className="relative max-h-[460px] overflow-hidden scale-[.92] origin-top">{f.preview}</div>
            <span className="absolute left-4 top-4"><Chip>Preview · {f.product}</Chip></span>
          </div>

          <div className="p-7 md:p-9">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{f.icon}</span>
              <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-900">{f.label}</h3>
            </div>
            <p className="mt-4 text-[15px] leading-[1.6] text-gray-600">{f.what}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[12.5px] font-semibold text-gray-900">Where it appears</p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-gray-600">{f.where}</p>
              </div>
              <div>
                <p className="text-[12.5px] font-semibold text-gray-900">Best for</p>
                <ul className="mt-1.5 space-y-1.5">
                  {f.bestFor.map(b => <li key={b} className="flex items-start gap-2 text-[14px] leading-snug text-gray-600"><Check size={14} className="mt-[3px] shrink-0 text-emerald-600" />{b}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-[#FAFAFA] p-4">
              <p className="text-[12.5px] font-semibold text-gray-900">Specs</p>
              <dl className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {f.specs.map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-[13.5px]"><dt className="w-[78px] shrink-0 font-medium text-gray-900">{k}</dt><dd className="text-gray-600">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-3 border-t border-gray-200 pt-3 text-[13.5px] text-gray-600"><span className="font-medium text-gray-900">Billing</span> · {f.billing}</p>
            </div>

            <ArrowLink href="#contact" className="mt-6">Get a quote for {f.label.toLowerCase()}</ArrowLink>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
