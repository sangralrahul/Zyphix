import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Bike, Smartphone, Wallet, BellRing } from 'lucide-react';
import { Dark, Light, Glow, Grain, Kicker, Sub, Reveal, VideoCard, PhotoTile, Counter } from '@/ui/cinema';
import { Accent } from '@/ui/motion2';
import { Container, Phone } from '@/ui/kit';
import { VIDEOS, landscape } from '@/data/media';
import { NUM, PARTNER_SITE, ADVERTISE_SITE, SUPPORT_SITE, Display } from './shared';

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
  { n: 3, format: n => `${Math.round(n)} in 1`, label: 'Now, Eats and Book' },
  { n: 1, format: n => `${Math.round(n)} wallet`, label: 'for every order' },
];

function PhoneScreen() {
  return (
    <div className="absolute inset-0">
      <VideoCard clip={VIDEOS.rider} ratio="auto" rounded="rounded-none" className="h-full" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.35) 0%, rgba(5,8,14,0) 30%, rgba(5,8,14,.85) 100%)' }} />
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-[44px] items-end justify-between px-6 pb-1 text-[11px] font-semibold text-white"><span>9:41</span><span className="tracking-tight">●●● ◔ ▮</span></div>
      <div className="absolute inset-x-3 top-14 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-medium text-white backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Delivering to Home · 1.2 km
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
            <Reveal delay={0.05}><Display light>Now, Eats and Book. <Accent green>One app.</Accent></Display></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-6 max-w-[48ch]">Everything already works in your browser. The native app adds push updates for every order and one-tap reordering of your weekly basket.</Sub></Reveal>

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

/* ── Partner / advertise / support split ────────────────────────────────── */
const BANDS = [
  { href: PARTNER_SITE, photo: landscape('shopOwner', 0), kicker: 'For businesses', title: 'Put your store, kitchen or skill on Zyphix.', body: 'Free to list. An onboarding manager calls within two working days.', cta: 'partner.zyphix.in' },
  { href: ADVERTISE_SITE, photo: landscape('kirana', 4), kicker: 'For brands', title: 'Reach local buyers the moment they shop.', body: 'Sponsored placements inside the Now, Eats and Book apps.', cta: 'advertise.zyphix.in' },
  { href: SUPPORT_SITE, photo: landscape('phone', 0), kicker: 'For customers', title: 'Help with an order, refund or booking.', body: 'Answers in under a minute, or a person by email.', cta: 'support.zyphix.in' },
];

export function PartnerBand() {
  return (
    <Light tone="soft" className="py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal><Kicker>Beyond ordering</Kicker></Reveal>
            <Reveal delay={0.05}><Display>Built with the <Accent green>neighbourhood</Accent>.</Display></Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5"><Sub className="max-w-[44ch]">Sell on Zyphix, advertise to local buyers, or get help with anything you ordered.</Sub></Reveal>
        </div>
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {BANDS.map((b, i) => (
            <Reveal key={b.href} delay={i * 0.08} y={32}>
              <a href={b.href} target="_blank" rel="noopener noreferrer" className="group block">
                <PhotoTile photo={b.photo} ratio="4/5" rounded="rounded-3xl" className="!bg-[#0B1220] shadow-[0_24px_60px_-20px_rgba(11,15,25,.25)]">
                  <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,8,14,.1) 0%, rgba(5,8,14,.2) 40%, rgba(5,8,14,.92) 100%)' }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
                    <p className="mb-3 inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-[#0DA366]" />{b.kicker}</p>
                    <h3 className="max-w-[18ch] text-balance text-[24px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[28px]">{b.title}</h3>
                    <p className="mt-3 max-w-[36ch] text-[14.5px] leading-[1.55] text-white/70">{b.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 border-t border-white/15 pt-4 text-[14.5px] font-semibold text-white">{b.cta}<ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
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
