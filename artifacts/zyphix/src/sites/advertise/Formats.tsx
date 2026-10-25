import React from 'react';
import { LayoutPanelTop, Rows3, Sparkles, Search, Star, TicketPercent, Plus, Clock, Check, ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { Container, Phone, Browser, G, G_DEEP } from '@/ui/kit';
import { Kicker } from '@/ui/cinema';
import { HScrollGallery } from '@/ui/motion2';
import { AppHeader, AppSearch, AppBanner, AppDots, AppRow, AppTile, AppGhost, SponsoredTag, IllustrativeTag } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Ad formats — pinned horizontal gallery of six cards (dark band). Each card
   shows the placement as an illustrative in-app mock (Phone / Browser), then
   what / best for, with where / specs / billing behind a disclosure.
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
  </Phone>
);

const RowPreview = () => (
  <Phone>
    <AppHeader /><AppSearch />
    <AppRow title="Breakfast by YourBrand" sponsored highlight>
      <AppTile name="Rolled oats 1kg" price="₹189" tone="green" /><AppTile name="Muesli 500g" price="₹249" tone="green" /><AppTile name="Instant oats" price="₹99" tone="green" />
    </AppRow>
    <AppRow title="Dairy & eggs"><AppTile name="Toned milk" price="₹28" tone="blue" /><AppTile name="Curd 400g" price="₹35" tone="blue" /><AppTile name="Eggs ×6" price="₹48" tone="amber" /></AppRow>
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
  </Phone>
);

const SearchPreview = () => (
  <Phone>
    <AppHeader /><AppSearch value="atta" />
    <p className="mx-4 mt-3 text-[9.5px] font-medium uppercase tracking-wider text-gray-400">Results for "atta"</p>
    <div className="relative mx-4 mt-1.5 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-white p-2 ring-2 ring-emerald-100">
      <SponsoredTag className="absolute right-2 top-2" />
      <div className="h-10 w-10 shrink-0 rounded-lg" style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)' }} />
      <div className="min-w-0 flex-1"><p className="truncate text-[10.5px] font-semibold text-gray-900">YourBrand Chakki Atta 5kg</p><p className="text-[9.5px] text-gray-500">Local kirana · 0.8 km</p><p className="text-[10px] font-semibold">₹265</p></div>
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-300 text-emerald-700"><Plus size={11} /></span>
    </div>
    {[['Whole wheat atta 5kg', '₹240'], ['Multigrain atta 1kg', '₹85'], ['Besan 500g', '₹58']].map(([n, p]) => (
      <div key={n} className="mx-4 mt-1.5 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
        <div className="min-w-0 flex-1"><p className="truncate text-[10.5px] font-semibold text-gray-800">{n}</p><p className="text-[9.5px] text-gray-500">Local shelf · 1.1 km</p><p className="text-[10px] font-semibold">{p}</p></div>
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500"><Plus size={11} /></span>
      </div>
    ))}
  </Phone>
);

/** Eats on the web — featured restaurant card inside a Browser frame. */
const FeaturedPreview = () => (
  <Browser url="eats.zyphix.in" className="w-full">
    <div className="bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Zyphix Eats</p>
          <p className="flex items-center gap-1 text-[12.5px] font-semibold text-gray-900"><MapPin size={12} className="text-orange-600" /> Gandhi Nagar, Jammu <ChevronDown size={12} className="text-gray-400" /></p>
        </div>
        <div className="hidden flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-[#FAFAFA] px-3 py-1.5 text-[11px] text-gray-400 sm:flex sm:max-w-[220px]"><Search size={12} /> Search dishes or restaurants</div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-900">Featured near you <SponsoredTag /></p>
      <div className="mt-2 grid gap-2.5 sm:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-orange-200 bg-white ring-2 ring-orange-100">
          <div className="h-20 sm:h-24" style={{ background: 'linear-gradient(135deg,#FFEDD5,#FED7AA)' }} />
          <div className="p-2.5">
            <div className="flex items-center justify-between"><p className="text-[12.5px] font-semibold text-gray-900">Biryani House</p><span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"><Clock size={10} /> 25 min</span></div>
            <p className="text-[10.5px] text-gray-500">Hyderabadi · 1.4 km</p>
            <div className="mt-1.5 flex flex-wrap gap-1">{['Chicken biryani', 'Veg biryani', 'Kebabs'].map(d => <span key={d} className="rounded-full border border-gray-200 px-1.5 py-0.5 text-[9.5px] text-gray-600">{d}</span>)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {[['Dosa Corner', '18 min'], ['Punjabi Dhaba', '30 min']].map(([n, t]) => (
            <div key={n} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
              <div className="min-w-0"><p className="truncate text-[11px] font-semibold text-gray-900">{n}</p><p className="text-[10px] text-gray-500">{t}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Browser>
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
        <div className="mt-1.5 flex items-center justify-between rounded-md bg-emerald-50 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-800 ring-1 ring-emerald-200"><span className="tracking-wider">OATS50</span><span>Copy</span></div>
      </div>
    </div>
    {[['Free delivery on Eats', 'Till Sunday'], ['10% off at your local kirana', '2 days left']].map(([n, t]) => (
      <div key={n} className="mx-4 mt-1.5 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500"><TicketPercent size={13} /></span>
        <div className="min-w-0 flex-1"><p className="truncate text-[10.5px] font-semibold text-gray-800">{n}</p><p className="text-[9px] text-gray-500">{t}</p></div>
      </div>
    ))}
    <div className="mx-4 mt-3 rounded-xl border border-gray-200 bg-white p-2">
      <p className="text-[9px] font-medium uppercase tracking-wider text-gray-400">At checkout</p>
      <div className="mt-0.5 flex items-center justify-between text-[10px]"><span className="flex items-center gap-1 font-medium text-emerald-700"><Check size={11} /> OATS50 applied</span><span className="font-semibold">−₹50</span></div>
    </div>
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

/* ── Card pieces ─────────────────────────────────────────────────────────── */
/** Soft stage that crops the top of a mock and fades it into the card. */
function Stage({ children, phone = true }: { children: React.ReactNode; phone?: boolean }) {
  return (
    <div className="relative h-[230px] overflow-hidden bg-[#F3F5F4] sm:h-[270px]">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 30%, rgba(13,163,102,.16), transparent 70%)' }} />
      <div className={phone ? 'flex justify-center pt-7' : 'px-4 pt-7 sm:px-6'}>
        <div className="origin-top transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">{children}</div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20" style={{ background: 'linear-gradient(180deg, rgba(243,245,244,0), #F3F5F4 85%)' }} />
      <IllustrativeTag className="absolute right-3 top-3" />
    </div>
  );
}

function Details({ f, i }: { f: Format; i: number }) {
  return (
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{f.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-gray-400">{f.product}</p>
          <h3 className="text-[20px] font-semibold leading-tight tracking-[-0.03em] text-gray-900">{f.label}</h3>
        </div>
        <span className="text-[12.5px] font-semibold tabular-nums text-gray-300">0{i + 1}</span>
      </div>
      <p className="mt-3.5 text-[14.5px] leading-[1.55] text-gray-700">{f.what}</p>
      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {f.bestFor.map(b => <li key={b} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-gray-700"><Check size={12} className="text-emerald-600" />{b}</li>)}
      </ul>
      <details className="group/d mt-4 rounded-xl border border-gray-200 bg-[#FAFAFA] open:bg-white">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 text-[13.5px] font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
          Where, specs &amp; billing <ChevronDown size={16} className="text-gray-400 transition-transform group-open/d:rotate-180" />
        </summary>
        <div className="max-h-[220px] overflow-y-auto border-t border-gray-200 px-4 pb-4 pt-3">
          <p className="mb-3 text-[13px] leading-[1.55] text-gray-600"><span className="font-semibold text-gray-900">Where it appears. </span>{f.where}</p>
          <dl className="grid gap-y-1.5">
            {f.specs.map(([k, v]) => (
              <div key={k} className="flex gap-3 text-[13px]"><dt className="w-[84px] shrink-0 font-medium text-gray-900">{k}</dt><dd className="text-gray-600">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-3 border-t border-gray-200 pt-3 text-[13px] text-gray-600"><span className="font-medium text-gray-900">Billing</span> · {f.billing}</p>
        </div>
      </details>
      <a href="#contact" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-semibold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-800">
        Get a quote <ArrowRight size={15} />
      </a>
    </div>
  );
}

function FormatCard({ f, i }: { f: Format; i: number }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,.6)] ring-1 ring-white/10">
      <Stage phone={f.id !== 'featured'}>{f.preview}</Stage>
      <Details f={f} i={i} />
    </article>
  );
}

/* ── Section: pinned horizontal gallery of the six formats ───────────────── */
export function Formats() {
  return (
    <HScrollGallery
      id="formats"
      cardClass="w-[84vw] sm:w-[400px]"
      header={
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker light>Formats</Kicker>
            <h2 className="max-w-[18ch] text-balance text-[32px] font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-[46px] md:text-[56px]">
              Six placements, built into the shopping journey.
            </h2>
          </div>
          <p className="hidden max-w-[46ch] text-[17px] leading-[1.6] text-white/65 lg:col-span-5 lg:block">Each one sits where a decision is being made. All are labelled Sponsored, priced flat and reported individually.</p>
        </div>
      }
      items={FORMATS.map((f, i) => <FormatCard key={f.id} f={f} i={i} />)}
    />
  );
}
