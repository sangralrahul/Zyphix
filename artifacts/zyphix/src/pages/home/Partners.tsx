import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Bike, UtensilsCrossed, Wrench, Megaphone, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Section, Container, SectionTitle, Card, IconTile, Button, Hairline, fade } from '@/ui/kit';
import { PARTNER_SITE, ADVERTISE_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Partners + advertise mini-band.
──────────────────────────────────────────────────────────────────────────── */

const TRACKS: Array<{ icon: React.ReactNode; tone: 'green' | 'orange' | 'blue'; title: string; line: string; href: string }> = [
  { icon: <Bike size={18} />, tone: 'green', title: 'Deliver with Zyphix', line: 'Short local trips, weekly payouts.', href: '/delivery-setup' },
  { icon: <UtensilsCrossed size={18} />, tone: 'orange', title: 'Register your restaurant', line: 'Your menu, your prices, no listing fee.', href: '/restaurant-setup' },
  { icon: <Wrench size={18} />, tone: 'blue', title: 'Join as a professional', line: 'Get verified and take bookings nearby.', href: '/service-setup' },
];

export function Partners() {
  return (
    <Section id="partners" className="scroll-mt-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow="Partners" title="Run your business on Zyphix." lead="Stores, restaurants, riders and professionals. Applying is free and an onboarding manager calls you back." />
          <Button href={PARTNER_SITE} variant="secondary">Partner portal <ArrowUpRight size={15} /></Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TRACKS.map((t, i) => (
            <motion.div key={t.title} {...fade(i * 0.06)}>
              <Link href={t.href} className="block h-full">
                <Card className="group flex h-full items-start gap-4 p-5">
                  <IconTile tone={t.tone}>{t.icon}</IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[15.5px] font-semibold tracking-[-0.02em] text-gray-900">{t.title}<ArrowRight size={14} className="text-gray-400 transition-transform group-hover:translate-x-0.5" /></p>
                    <p className="mt-1 text-[14px] leading-[1.55] text-gray-600">{t.line}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10"><Hairline /></div>
        <motion.div {...fade(0.2)} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <IconTile tone="violet"><Megaphone size={18} /></IconTile>
            <div>
              <p className="text-[15.5px] font-semibold tracking-[-0.02em] text-gray-900">Advertise to a neighbourhood, not a country.</p>
              <p className="text-[14px] text-gray-600">Sponsored placements in the app, targeted by area and category.</p>
            </div>
          </div>
          <Button href={ADVERTISE_SITE} variant="ghost" className="sm:shrink-0">advertise.zyphix.in <ArrowUpRight size={15} /></Button>
        </motion.div>
      </Container>
    </Section>
  );
}
