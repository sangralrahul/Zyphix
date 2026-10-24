import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, UtensilsCrossed, Wrench, Package } from 'lucide-react';
import { Section, Container, SectionTitle, Bento, Card, IconTile, Chip, fade } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   Who it's for — bento of four tiles: IconTile + title + one line + 2 chips.
──────────────────────────────────────────────────────────────────────────── */

const TILES: Array<{ icon: React.ReactNode; tone: 'green' | 'orange' | 'blue' | 'violet'; title: string; line: string; chips: string[]; span: string }> = [
  { icon: <ShoppingBasket size={18} />, tone: 'green', title: 'FMCG brands', line: 'Put a range in front of shoppers at the kirana shelf where it is already stocked.', chips: ['Sponsored row', 'Spotlight'], span: 'md:col-span-7' },
  { icon: <UtensilsCrossed size={18} />, tone: 'orange', title: 'Local restaurants', line: 'Be the featured card for the neighbourhood you deliver to.', chips: ['Featured in Eats', 'Search'], span: 'md:col-span-5' },
  { icon: <Wrench size={18} />, tone: 'blue', title: 'Home-service businesses', line: 'Salons, cleaners and repair pros, shown inside their own service radius.', chips: ['Featured in Book', 'Home banner'], span: 'md:col-span-5' },
  { icon: <Package size={18} />, tone: 'violet', title: 'D2C brands', line: 'Test a locality before committing to a city, with a coupon to earn the first order.', chips: ['Home banner', 'Offers & coupons'], span: 'md:col-span-7' },
];

export function Audience() {
  return (
    <Section id="audience" tone="soft" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="Who it's for" title="Built for businesses that sell by neighbourhood." lead="If your customers are decided by a delivery radius, the placement should be too." />
        <Bento className="mt-12">
          {TILES.map((t, i) => (
            <motion.div key={t.title} {...fade(i * 0.06)} className={t.span}>
              <Card className="flex h-full flex-col p-6">
                <IconTile tone={t.tone}>{t.icon}</IconTile>
                <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-gray-900">{t.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-gray-600">{t.line}</p>
                <div className="mt-5 flex flex-wrap gap-2">{t.chips.map(c => <Chip key={c}>{c}</Chip>)}</div>
              </Card>
            </motion.div>
          ))}
        </Bento>
      </Container>
    </Section>
  );
}
