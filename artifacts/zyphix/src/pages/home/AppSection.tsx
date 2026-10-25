import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Bike, Smartphone, Wallet, BellRing } from 'lucide-react';
import { Dark, Light, Glow, Grain, Kicker, Headline, Sub, Reveal, VideoCard, PhotoTile, Counter } from '@/ui/cinema';
import { Container, Phone } from '@/ui/kit';
import { VIDEOS, PHOTOS, landscape } from '@/data/media';
import { NUM, PARTNER_SITE, ADVERTISE_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   App section (phone mock-up with a looping clip) and the partner / advertise
   split band.
──────────────────────────────────────────────────────────────────────────── */

const STORES = [
  { src: '/images/appstore.webp', small: 'Coming soon on the', big: 'App Store' },
  { src: '/images/googleplay.webp', small: 'Coming soon on', big: 'Google Play' },
];

const PROMISES: { n: number; format: (n: number) => string; label: string }[] = [
  { n: 30, format: n => `${Math.round(n)} min`, label: 'grocery delivery promise' },
  { n: 199, format: n => `₹${Math.round(n)}`, label: 'and above ships for ₹0' },
  { n: 3, format: n => `${Math.round(n)} apps` , label: 'one login, one wallet' },
];

function PhoneScreen() {
  return (
    <div className="absolute inset-0">
      <VideoCard clip={VIDEOS.rider} ratio="auto" rounded="rounded-none" className="h-full" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.35) 0%, rgba(5,8,14,0) 30%, rgba(5,8,14,.85) 100%)' }} />
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-[44px] items-end justify-between px-6 pb-1 text-[11px] font-semibold text-white"><span>9:41</span><span className="tracking-tight">●●● ◔ ▮</span></div>
      <div className="absolute inset-x-3 top-14 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-medium text-white backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Delivering to Gandhi Nagar, Jammu
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-white backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200"><Bike size={17} /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">Rider on the way</p>
            <p className="text-[11.5px] text-white/60">Live tracking · pay on delivery</p>
          </div>
          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">Order</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15"><span className="block h-full w-2/3 rounded-full bg-emerald-400" /></div>
      </div>
    </div>
  );
}

export function AppSection() {
  return (
    <Dark className="border-t border-white/[.06] py-24 md:py-36">
      <Glow x="80%" y="50%" size={1000} alpha={0.28} />
      <Grain />
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal><Kicker light>The Zyphix app</Kicker></Reveal>
            <Reveal delay={0.05}><Headline light size="lg">Now, Eats and Book. One app, one account.</Headline></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-6 max-w-[500px]">Everything already works in your browser. The native app adds push updates for every order and one-tap reordering of your weekly basket.</Sub></Reveal>

            <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-3">
              {STORES.map(s => (
                <Link key={s.big} href="/app" className="inline-flex h-[52px] items-center gap-3 rounded-xl border border-white/15 bg-white/[.06] px-4 text-white transition hover:bg-white/10">
                  <img src={s.src} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
                  <span className="leading-none">
                    <span className="block text-[10px] font-medium text-white/60">{s.small}</span>
                    <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.01em]">{s.big}</span>
                  </span>
                </Link>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {PROMISES.map(p => (
                <div key={p.label}>
                  <p className="text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[36px]" style={NUM}><Counter to={p.n} format={p.format} /></p>
                  <p className="mt-1 text-[13px] leading-[1.45] text-white/55">{p.label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.25} className="mt-10 grid gap-4 sm:grid-cols-3">
              {[[<Smartphone size={17} key="a" />, 'Add zyphix.in to your home screen today'], [<BellRing size={17} key="b" />, 'Order updates as notifications'], [<Wallet size={17} key="c" />, 'One wallet across all three apps']].map(([ic, t], i) => (
                <div key={i} className="flex items-start gap-3 text-[13.5px] leading-[1.5] text-white/70">
                  <span className="mt-0.5 text-emerald-300">{ic}</span>{t}
                </div>
              ))}
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal y={40} scale={0.96} className="relative">
              <div aria-hidden className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(13,163,102,.4), transparent 70%)', filter: 'blur(30px)' }} />
              <Phone dark className="relative">
                <PhoneScreen />
              </Phone>
            </Reveal>
          </div>
        </div>
      </Container>
    </Dark>
  );
}

/* ── Partner / advertise split band ─────────────────────────────────────── */
const BANDS = [
  { href: PARTNER_SITE, photo: PHOTOS.restaurant[2], kicker: 'For businesses', title: 'Put your store, kitchen or skill on Zyphix.', body: 'Free to list. An onboarding manager calls within two working days.', cta: 'partner.zyphix.in' },
  { href: ADVERTISE_SITE, photo: landscape('city'), kicker: 'For brands', title: 'Reach Jammu at the moment they are buying.', body: 'Sponsored placements inside the Now, Eats and Book apps.', cta: 'advertise.zyphix.in' },
];

export function PartnerBand() {
  return (
    <Light className="py-24 md:py-36">
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          {BANDS.map((b, i) => (
            <Reveal key={b.href} delay={i * 0.1} y={32}>
              <a href={b.href} target="_blank" rel="noopener noreferrer" className="group block">
                <PhotoTile photo={b.photo} ratio="4/3" rounded="rounded-3xl" className="shadow-[0_24px_60px_rgba(11,15,25,.12)]">
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.15) 0%, rgba(5,8,14,.25) 45%, rgba(5,8,14,.9) 100%)' }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                    <p className="mb-3 inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-[#0DA366]" />{b.kicker}</p>
                    <h3 className="max-w-[420px] text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] text-white sm:text-[32px]">{b.title}</h3>
                    <p className="mt-3 max-w-[420px] text-[15px] leading-[1.55] text-white/70">{b.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white">{b.cta}<ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  </div>
                </PhotoTile>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </Light>
  );
}
