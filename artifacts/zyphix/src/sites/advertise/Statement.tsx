import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Store, Tag } from 'lucide-react';
import { Section, Container, Grid, Eyebrow, Display, Lead, fade } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   INK statement — large claim + three columns over Grid lines.
──────────────────────────────────────────────────────────────────────────── */

const COLS = [
  { icon: <ShoppingCart size={18} />, title: 'A shopping app, not a feed', text: 'People open Zyphix to buy groceries, order food or book a service. A placement meets that intent instead of interrupting something else.' },
  { icon: <Store size={18} />, title: 'The shelf is real', text: 'Rows and spotlights link to products stocked by partner stores nearby, at the local price. A tap can become an order in the same session.' },
  { icon: <Tag size={18} />, title: 'Labelled, capped, honest', text: 'Every placement is marked Sponsored. We cap sponsored content per screen and never remove organic results to make room.' },
];

export function Statement() {
  return (
    <Section tone="ink" className="overflow-hidden">
      <Grid dark />
      <Container>
        <div className="max-w-[720px]">
          <Eyebrow dark>Why it works</Eyebrow>
          <Display as="h2" size="lg" className="mt-4 text-white">Intent at the point of purchase.</Display>
          <Lead dark className="mt-5">The closer a message sits to the basket, the less it has to shout.</Lead>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {COLS.map((c, i) => (
            <motion.div key={c.title} {...fade(0.1 + i * 0.08)} className="border-t border-white/10 pt-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] text-emerald-300 ring-1 ring-white/10">{c.icon}</span>
              <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em] text-white">{c.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.65] text-white/60">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
