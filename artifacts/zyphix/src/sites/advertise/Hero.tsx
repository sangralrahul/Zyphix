import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Tag } from 'lucide-react';
import { Container, Mesh, Aurora, Eyebrow, Display, GradientText, Lead, Button, Glass, Phone, SampleTag, fade } from '@/ui/kit';
import { AppHeader, AppSearch, AppBanner, AppDots, AppRow, AppTile } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Hero — headline + Phone mock of the Zyphix home with three sponsored slots,
   floating over Mesh + Aurora with two Glass satellites. Then a signal row.
──────────────────────────────────────────────────────────────────────────── */

function HomeMock() {
  return (
    <Phone>
      <AppHeader />
      <AppSearch />
      <AppBanner highlight />
      <AppDots />
      <AppRow title="Breakfast by YourBrand" sponsored>
        <AppTile name="Rolled oats 1kg" price="₹189" tone="green" />
        <AppTile name="Muesli 500g" price="₹249" tone="amber" />
        <AppTile name="Instant oats" price="₹99" tone="green" />
      </AppRow>
      <AppRow title="Tea & coffee">
        <AppTile name="Chai masala" price="₹65" tone="amber" spotlight />
        <AppTile name="Assam tea" price="₹120" />
        <AppTile name="Filter coffee" price="₹180" />
      </AppRow>
      <AppRow title="Dairy & eggs">
        <AppTile name="Toned milk" price="₹28" tone="blue" />
        <AppTile name="Curd 400g" price="₹35" tone="blue" />
        <AppTile name="Eggs ×6" price="₹48" tone="amber" />
      </AppRow>
      <SampleTag className="absolute bottom-3 right-3" />
    </Phone>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Mesh />
      <Container className="grid items-center gap-14 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:pb-28">
        <div className="max-w-[600px]">
          <motion.div {...fade(0)}><Eyebrow>Advertise on Zyphix</Eyebrow></motion.div>
          <motion.div {...fade(0.05)}>
            <Display className="mt-5 text-gray-900">Reach customers in <GradientText>the neighbourhoods they shop in.</GradientText></Display>
          </motion.div>
          <motion.div {...fade(0.1)}>
            <Lead className="mt-6 max-w-[520px]">Placements inside a shopping app — not a feed. Your brand appears on the home screen, in search and in categories, only in the delivery areas you choose, and always labelled Sponsored.</Lead>
          </motion.div>
          <motion.div {...fade(0.15)} className="mt-8 flex flex-wrap gap-3">
            <Button href="#contact" size="lg">Talk to partnerships <ArrowRight size={16} /></Button>
            <Button href="#formats" variant="secondary" size="lg">See formats</Button>
          </motion.div>
        </div>

        <motion.div {...fade(0.2, 24)} className="relative mx-auto w-full max-w-[460px] py-10">
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-[40px]"><Aurora className="opacity-60" /></div>
          <HomeMock />
          <Glass className="absolute left-0 top-[18%] hidden items-center gap-3 px-4 py-3 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><MapPin size={15} /></span>
            <div><p className="text-[13px] font-semibold text-gray-900">Shown in 6 pin codes</p><p className="text-[12px] text-gray-500">Dwarka, South-West Delhi</p></div>
          </Glass>
          <Glass className="absolute bottom-[14%] right-0 hidden items-center gap-3 px-4 py-3 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700"><Tag size={15} /></span>
            <div><p className="text-[13px] font-semibold text-gray-900">Always labelled Sponsored</p><p className="text-[12px] text-gray-500">On every placement, every screen</p></div>
          </Glass>
        </motion.div>
      </Container>

      <SignalRow />
    </section>
  );
}

const SIGNALS = ['Launching across India', 'Early advertiser programme', 'Flat rates', 'Placement-level reporting'];

function SignalRow() {
  return (
    <Container className="pb-14">
      <div className="grid grid-cols-2 divide-y divide-gray-200 border-y border-gray-200 md:grid-cols-4 md:divide-x md:divide-y-0">
        {SIGNALS.map((s, i) => (
          <motion.p key={s} {...fade(0.25 + i * 0.05)} className={`py-4 text-center text-[14px] font-medium text-gray-700 ${i % 2 === 1 ? 'border-l border-gray-200 md:border-l-0' : ''}`}>{s}</motion.p>
        ))}
      </div>
    </Container>
  );
}
