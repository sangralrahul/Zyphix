import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Clock, ShieldCheck, Wallet, Store, Megaphone, LifeBuoy, ShoppingBasket, UtensilsCrossed, CalendarCheck, Check } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { FONT, Container } from '@/ui/kit';
import { pexelsPhoto } from '@/data/media';
import { StepCards, SectionTitle } from '@/components/StepCards';
import { useCategories } from './home/shared';
import { Faq, StickyCta } from './home/Faq';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix — company landing page (zyphix.in). Clean, light, photo-led: the same
   app-style language as Zyphix Now, Eats and Book. Only /api/categories is
   fetched here (for the category artwork).
──────────────────────────────────────────────────────────────────────────── */

const NOW = 'https://now.zyphix.in';
const EATS = 'https://eats.zyphix.in';
const BOOK = 'https://book.zyphix.in';
const slug = (n: string) => n.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const photo = (id: number, w = 960) => pexelsPhoto(id, w);

const APPS = [
  { key: 'now', name: 'Zyphix Now', tag: 'Groceries in 10 minutes', desc: 'Fresh produce, dairy, staples and daily essentials from shops near you, at shelf prices.', points: ['3,000+ products', 'Free delivery above ₹149', 'Cash or UPI on delivery'], href: NOW, cta: 'Shop groceries', icon: ShoppingBasket, bg: '#E9F7F0', ink: '#0B7F50', img: 0 },
  { key: 'eats', name: 'Zyphix Eats', tag: 'Food from local kitchens', desc: 'Biryani houses, pizza ovens, momo stalls and cafés near you, cooked to order.', points: ['Menu prices from the kitchen', 'Live order tracking', 'Opening area by area'], href: EATS, cta: 'Order food', icon: UtensilsCrossed, bg: '#FFF1E8', ink: '#C2410C', img: 2147491 },
  { key: 'book', name: 'Zyphix Book', tag: 'Home services by verified pros', desc: 'Plumbers, electricians, cleaners and more from your own neighbourhood.', points: ['ID & police-verified pros', 'Price shown before you confirm', '7-day work guarantee'], href: BOOK, cta: 'Book a service', icon: CalendarCheck, bg: '#EEF0FF', ink: '#4338CA', img: 27928761 },
] as const;

const STEPS = [
  { photo: 16052344, t: 'Set your location', s: 'We only show stores, kitchens and pros that serve your street.' },
  { photo: 6969967, t: 'Pick from local partners', s: 'Real shelves, real menus and real slots from the partner’s own prices.' },
  { photo: 5077068, t: 'Pay how you like', s: 'UPI, cards, wallets or cash on delivery. No hidden charges.' },
  { photo: 31332062, t: 'Track it live', s: 'Watch the rider or pro on the map, right to your door.' },
];

const PROMISES = [
  { icon: Clock, t: '10-minute grocery delivery', s: 'From stores already on your street.' },
  { icon: Wallet, t: 'Shelf prices, no markup', s: 'You pay what the store charges.' },
  { icon: ShieldCheck, t: 'Verified partners', s: 'Every pro is ID and police-verified.' },
  { icon: Check, t: 'One account for everything', s: 'One login, wallet and order history.' },
];

const PARTNERS = [
  { icon: Store, t: 'For businesses', h: 'Put your store, kitchen or skill on Zyphix.', s: 'Free to list. An onboarding manager calls within two working days.', href: 'https://partner.zyphix.in', cta: 'partner.zyphix.in' },
  { icon: Megaphone, t: 'For brands', h: 'Reach local buyers the moment they shop.', s: 'Sponsored placements inside the Now, Eats and Book apps.', href: 'https://advertise.zyphix.in', cta: 'advertise.zyphix.in' },
  { icon: LifeBuoy, t: 'For customers', h: 'Help with an order, refund or booking.', s: 'Answers in a minute, or a person by email.', href: 'https://support.zyphix.in', cta: 'support.zyphix.in' },
];

export function Landing() {
  const categories = useCategories();
  React.useEffect(() => { document.title = 'Zyphix — Groceries, food and home services from your neighbourhood'; }, []);
  const art = (name: string) => categories.find(c => c.name === name)?.image || '';
  const tiles = categories.filter(c => (c.image || '').includes('/img/categories/')).slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F7F8F7] pb-[72px] text-gray-900 antialiased md:pb-0" style={{ fontFamily: FONT }}>
      <SiteHeader />
      <main>
        {/* ── Hero ── */}
        <section className="border-b border-gray-200/70 bg-white">
          <Container className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12.5px] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-100">The SuperLocal app</span>
              <h1 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-gray-900 sm:text-[52px] md:text-[60px]">Your neighbourhood,<br /> <span className="text-[#0DA366]">delivered.</span></h1>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-[1.6] text-gray-500 md:text-[18px]">Groceries from the corner store, dinner from your favourite kitchen and a verified pro for the weekend. One app, one account, every shop near you.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={NOW} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0DA366] px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(13,163,102,.6)] transition hover:-translate-y-px">Order on Zyphix Now <ArrowRight size={16} /></a>
                <Link href="/app" className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-[15px] font-semibold text-gray-900 transition hover:border-gray-300">Get the app</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {APPS.map(a => (
                  <a key={a.key} href={a.href} className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white pl-1.5 pr-3.5 text-[13.5px] font-semibold text-gray-800 transition hover:border-gray-300">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full" style={{ background: a.bg, color: a.ink }}><a.icon size={14} /></span>{a.name}
                  </a>
                ))}
              </div>
            </div>
            {/* collage: one tile per app */}
            <div aria-hidden className="grid h-[380px] grid-cols-2 grid-rows-2 gap-3 md:h-[460px]">
              <div className="row-span-2 overflow-hidden rounded-[28px] bg-[#E9F7F0]">
                {art('Fruits & Veg') ? <img src={art('Fruits & Veg')} alt="" className="h-full w-full scale-[1.15] object-cover mix-blend-multiply" /> : null}
              </div>
              <div className="overflow-hidden rounded-[28px] bg-[#FFF1E8]"><img src={photo(12737656, 640)} alt="" className="h-full w-full object-cover" /></div>
              <div className="overflow-hidden rounded-[28px] bg-[#EEF0FF]"><img src={photo(7703296, 640)} alt="" className="h-full w-full object-cover" /></div>
            </div>
          </Container>
        </section>

        {/* ── Promise strip ── */}
        <section className="border-b border-gray-200/70 bg-white">
          <Container className="grid grid-cols-2 divide-gray-200/70 py-6 md:grid-cols-4 md:divide-x md:py-8">
            {PROMISES.map(p => (
              <div key={p.t} className="flex items-start gap-3 px-1 py-3 md:px-6 md:py-1 md:first:pl-0">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><p.icon size={18} /></span>
                <div>
                  <p className="text-[14px] font-semibold tracking-[-0.01em] text-gray-900">{p.t}</p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">{p.s}</p>
                </div>
              </div>
            ))}
          </Container>
        </section>

        {/* ── Three apps ── */}
        <section id="products" className="scroll-mt-20 py-14 md:py-20">
          <Container>
            <SectionTitle title="Three apps, one account" sub="Everything local, one tap away." />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {APPS.map(a => (
                <a key={a.key} href={a.href} className="group flex flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(16,24,40,.35)]">
                  <div className="relative aspect-[16/10] overflow-hidden" style={{ background: a.bg }}>
                    {a.img
                      ? <img src={photo(a.img, 960)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      : art('Dairy & Eggs') && <img src={art('Dairy & Eggs')} alt="" loading="lazy" className="h-full w-full scale-[1.1] object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.16]" />}
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold shadow-sm" style={{ color: a.ink }}><a.icon size={14} /> {a.name}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[20px] font-semibold tracking-[-0.025em] text-gray-900">{a.tag}</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-gray-500">{a.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {a.points.map(pt => <li key={pt} className="flex items-center gap-2 text-[13.5px] text-gray-700"><Check size={15} style={{ color: a.ink }} />{pt}</li>)}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: a.ink }}>{a.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Shop by category ── */}
        {tiles.length >= 6 && (
          <section className="border-y border-gray-200/70 bg-white py-14 md:py-20">
            <Container>
              <SectionTitle title="Shop by category" sub="Every aisle of the corner store, on Zyphix Now."
                action={<a href={NOW} className="inline-flex items-center gap-1 text-[14px] font-semibold text-emerald-700 hover:text-emerald-800">See all categories <ArrowRight size={15} /></a>} />
              <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-6">
                {tiles.map(c => (
                  <a key={c.name} href={`${NOW}/c/${slug(c.name)}`} className="group text-center">
                    <span className="block aspect-square overflow-hidden rounded-2xl bg-[#F1F3F5]">
                      <img src={c.image} alt="" loading="lazy" className="h-full w-full scale-[1.2] object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.28]" />
                    </span>
                    <span className="mt-2 block text-[13px] font-semibold leading-tight text-gray-800">{c.name}</span>
                  </a>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ── How it works ── */}
        <section id="how" className="scroll-mt-20 py-14 md:py-20">
          <Container>
            <SectionTitle title="How it works" sub="The same four steps for groceries, food and services." />
            <StepCards steps={STEPS} />
          </Container>
        </section>

        {/* ── Beyond ordering ── */}
        <section className="border-y border-gray-200/70 bg-white py-14 md:py-20">
          <Container>
            <SectionTitle title="Built with the neighbourhood" sub="Sell on Zyphix, advertise to local buyers, or get help with an order." />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {PARTNERS.map(p => (
                <a key={p.t} href={p.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-[24px] border border-gray-200 bg-[#FAFBFA] p-6 transition hover:border-gray-300 hover:bg-white">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 ring-1 ring-gray-200"><p.icon size={19} /></span>
                  <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-emerald-700">{p.t}</p>
                  <p className="mt-1.5 text-[19px] font-semibold leading-[1.2] tracking-[-0.02em] text-gray-900">{p.h}</p>
                  <p className="mt-2 text-[14px] leading-[1.55] text-gray-500">{p.s}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[13.5px] font-semibold text-gray-900">{p.cta} <ArrowUpRight size={14} className="text-gray-400 transition group-hover:text-gray-900" /></span>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* ── App ── */}
        <section className="py-14 md:py-20">
          <Container>
            <div className="grid items-center gap-8 overflow-hidden rounded-[32px] bg-[#0B7F50] p-7 text-white md:grid-cols-[1.2fr_1fr] md:p-12">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-200">The Zyphix app</p>
                <h2 className="mt-3 max-w-[18ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[42px]">Now, Eats and Book in one app.</h2>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-white/75">Everything already works in your browser. The app adds push updates for every order and one-tap reordering of your weekly basket.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {[{ src: '/images/appstore.webp', s: 'Coming soon on the', b: 'App Store' }, { src: '/images/googleplay.webp', s: 'Coming soon on', b: 'Google Play' }].map(x => (
                    <Link key={x.b} href="/app" className="inline-flex h-[52px] items-center gap-3 rounded-xl bg-white/10 px-4 ring-1 ring-white/20 transition hover:bg-white/15">
                      <img src={x.src} alt="" className="h-6 w-6 object-contain" />
                      <span className="leading-tight"><span className="block text-[10.5px] text-white/70">{x.s}</span><span className="block text-[15px] font-semibold">{x.b}</span></span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {APPS.map(a => (
                  <a key={a.key} href={a.href} className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15 transition hover:bg-white/15">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white" style={{ color: a.ink }}><a.icon size={22} /></span>
                    <span className="text-[13px] font-semibold">{a.name.replace('Zyphix ', '')}</span>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <Faq />
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}

export default Landing;
