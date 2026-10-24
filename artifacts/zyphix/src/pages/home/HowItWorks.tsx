import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Store, Bike, Wrench, MapPin, ShoppingBag, PackageCheck, Home } from 'lucide-react';
import { type Category } from '@/lib/catalog';
import { Section, Container, SectionTitle, Grid, Display, Lead, Eyebrow, ArrowLink, fade, G } from '@/ui/kit';
import { CATEGORY_NAMES } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   INK statement with grid lines, the 4-step "how it works" row, and the
   compact "shop by category" tile row (icon + name, no photos).
──────────────────────────────────────────────────────────────────────────── */

export function Statement() {
  const cols: Array<[React.ReactNode, string, string]> = [
    [<Store size={18} />, 'Kirana stores', 'List the shelf as it is. No warehouse competes with them, no marketplace fee eats the margin.'],
    [<Bike size={18} />, 'Local riders', 'Short trips inside one area. Predictable hours, predictable payouts.'],
    [<Wrench size={18} />, 'Professionals', 'Verified once, booked directly. The price they quote is the price you pay.'],
  ];
  return (
    <Section tone="ink" className="overflow-hidden">
      <Grid dark />
      <Container>
        <motion.div {...fade(0)} className="max-w-[760px]">
          <Eyebrow dark className="mb-5">Why local</Eyebrow>
          <Display as="h2" size="lg" className="text-white">Built for the people who already run your neighbourhood.</Display>
          <Lead dark className="mt-6 max-w-[560px]">Zyphix does not open dark stores. It gives the businesses that are already there the software to deliver in 30 minutes.</Lead>
        </motion.div>
        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-8">
          {cols.map(([ic, t, d], i) => (
            <motion.div key={t} {...fade(0.1 + i * 0.06)}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10">{ic}</span>
              <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-white">{t}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-white/60">{d}</p>
            </motion.div>
          ))}
        </div>
        <motion.div {...fade(0.3)} className="mt-12"><ArrowLink dark href="/about">Read how we work</ArrowLink></motion.div>
      </Container>
    </Section>
  );
}

/* ── How it works ─────────────────────────────────────────────────────────── */
const STEPS: Array<[React.ReactNode, string, string]> = [
  [<MapPin size={18} />, 'Set your location', 'We show only the stores, restaurants and pros that actually serve your area.'],
  [<ShoppingBag size={18} />, 'Pick what you need', 'Groceries, a meal or a service. Prices are the partner\'s own.'],
  [<PackageCheck size={18} />, 'Partner packs it', 'The store confirms stock and packs; a nearby rider picks it up.'],
  [<Home size={18} />, 'Delivered in ~30 min', 'Track the rider live. Pay online or cash on eligible orders.'],
];

export function HowItWorks() {
  return (
    <Section id="how" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="How it works" title="Four steps, about thirty minutes." align="center" className="text-center" />
        <div className="relative mt-14">
          <div aria-hidden className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent lg:block" />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(([ic, t, d], i) => (
              <motion.li key={t} {...fade(i * 0.07)} className="relative">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700 ring-1 ring-gray-200 shadow-[0_1px_2px_rgba(0,0,0,.04)]">{ic}</span>
                  <span className="text-[12px] font-semibold text-gray-400" style={{ fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.02em] text-gray-900">{t}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-gray-600">{d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ── Shop by category ─────────────────────────────────────────────────────── */
export function Categories({ categories }: { categories: Category[] }) {
  const list: Array<{ name: string; icon?: string }> = categories.length ? categories : CATEGORY_NAMES.map(name => ({ name }));
  return (
    <Section tone="soft" className="!py-16 md:!py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Shop by category" title="Live categories near you." />
          <ArrowLink href="/now">Browse all</ArrowLink>
        </div>
        <div className="mt-10 flex flex-wrap gap-2.5">
          {list.map((c, i) => (
            <motion.div key={c.name} {...fade(Math.min(i, 12) * 0.02, 8)}>
              <Link href="/now" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-2 pl-2.5 pr-3.5 text-[13.5px] font-medium tracking-[-0.01em] text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,.03)] transition hover:-translate-y-px hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(11,15,25,.06)]">
                {c.icon ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[13px]">{c.icon}</span> : <span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />}
                {c.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
