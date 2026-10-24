import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Store, UtensilsCrossed, Wrench, Bike } from 'lucide-react';
import { Bento, Button, Card, Chip, Container, Eyebrow, Display, Lead, IconTile, Section, SectionTitle, fade, Phone, Browser } from '@/ui/kit';
import { SERVICES, TRACKS, type Track } from './shared';
import { PartnerAppScreen, RestaurantDashboard, BookingScreen } from './Mockups';
import { usePartners, type PartnerListing, type PartnerType } from '@/lib/partners';

/* ── Recently joined (live partner directory) ────────────────────────────── */
const TYPE_META: Record<PartnerType, { label: string; tone: 'green' | 'orange' | 'violet' | 'blue'; icon: typeof Store }> = {
  store: { label: 'Store', tone: 'green', icon: Store },
  restaurant: { label: 'Restaurant', tone: 'orange', icon: UtensilsCrossed },
  service: { label: 'Professional', tone: 'violet', icon: Wrench },
  delivery: { label: 'Rider', tone: 'blue', icon: Bike },
};

export function RecentlyJoined() {
  const store = usePartners('store');
  const restaurant = usePartners('restaurant');
  const service = usePartners('service');
  const delivery = usePartners('delivery');
  const groups: { type: PartnerType; list: PartnerListing[] }[] = [
    { type: 'store', list: store.partners }, { type: 'restaurant', list: restaurant.partners },
    { type: 'service', list: service.partners }, { type: 'delivery', list: delivery.partners },
  ];
  const total = groups.reduce((n, g) => n + g.list.length, 0);
  if (total === 0) return null;

  const latest = groups.flatMap(g => g.list)
    .sort((a, b) => (Date.parse(b.joinedAt) || 0) - (Date.parse(a.joinedAt) || 0))
    .slice(0, 6);

  return (
    <motion.div {...fade(0.24)} className="mt-10">
      <Card hover={false} className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Eyebrow>Recently joined</Eyebrow>
            <p className="mt-2 text-[15px] text-gray-600">{total.toLocaleString('en-IN')} partner{total > 1 ? 's' : ''} registered so far.</p>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {groups.filter(g => g.list.length > 0).map(g => {
              const m = TYPE_META[g.type];
              return <li key={g.type}><Chip tone={m.tone}><m.icon size={12} /> {g.list.length} {m.label}{g.list.length > 1 ? 's' : ''}</Chip></li>;
            })}
          </ul>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {latest.map(p => {
            const m = TYPE_META[p.type];
            const place = p.locality || p.city;
            return (
              <li key={`${p.type}-${p.id}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] text-gray-700">
                <Chip tone={m.tone} className="!px-2"><m.icon size={11} /> {m.label}</Chip>
                <span className="truncate font-semibold text-gray-900">{p.name}</span>
                {place && <><span className="text-gray-300">·</span><span className="truncate text-gray-500">{place}</span></>}
              </li>
            );
          })}
        </ul>
      </Card>
    </motion.div>
  );
}

/* ── Bento of tracks ─────────────────────────────────────────────────────── */
function Tile({ tr, className = '', delay = 0, compact = false, children }: { tr: Track; className?: string; delay?: number; compact?: boolean; children?: React.ReactNode }) {
  return (
    <motion.div {...fade(delay)} className={className}>
      <Link href={tr.href} className="group block h-full">
        <Card className={`flex h-full flex-col ${compact ? 'p-6' : 'p-7 md:p-8'}`}>
          <div className="flex items-center justify-between">
            <IconTile tone={tr.tone}><tr.icon size={18} /></IconTile>
            <span className="text-[12px] font-medium text-gray-400">{tr.product}</span>
          </div>
          <h3 className={`mt-5 font-semibold tracking-[-0.02em] text-gray-900 ${compact ? 'text-[20px]' : 'text-[22px] md:text-[24px]'}`}>{tr.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{tr.line}</p>
          {children}
          <ul className="mt-5 space-y-2">
            {tr.bullets.map(b => (
              <li key={b} className="flex items-start gap-2 text-[14px] text-gray-700"><Check size={15} className="mt-0.5 shrink-0 text-emerald-600" /> {b}</li>
            ))}
          </ul>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14.5px] font-semibold text-emerald-700">{tr.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
        </Card>
      </Link>
    </motion.div>
  );
}

export function TrackBento() {
  const [delivery, restaurant, services, store] = TRACKS;
  return (
    <Section id="tracks" tone="soft" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="Choose your track" title="Three ways to partner. One neighbourhood network." lead="Pick the track that matches how you work. Each has a short guided application and its own onboarding manager." />
        <Bento className="mt-12">
          <Tile tr={delivery} className="md:col-span-7" delay={0} />
          <Tile tr={restaurant} className="md:col-span-5" delay={0.06} />
          <Tile tr={services} className="md:col-span-8" delay={0.12}>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {SERVICES.map(s => <li key={s}><Chip tone="violet">{s}</Chip></li>)}
            </ul>
          </Tile>
          <Tile tr={store} className="md:col-span-4" delay={0.18} compact />
        </Bento>
        <RecentlyJoined />
      </Container>
    </Section>
  );
}

/* ── Feature stories ─────────────────────────────────────────────────────── */
interface Story { tr: Track; eyebrow: string; title: string; lead: string; bullets: string[]; visual: React.ReactNode; flip?: boolean }

function StoryRow({ s, index }: { s: Story; index: number }) {
  const text = (
    <motion.div {...fade(0)} className="max-w-[480px]">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <Display as="h3" size="md" className="mt-4 text-gray-900">{s.title}</Display>
      <Lead className="mt-4">{s.lead}</Lead>
      <ul className="mt-6 space-y-2.5">
        {s.bullets.map(b => <li key={b} className="flex items-start gap-2.5 text-[15px] text-gray-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-600" /> {b}</li>)}
      </ul>
      <Button href={s.tr.href} variant="secondary" className="mt-8">{s.tr.cta} <ArrowRight size={15} /></Button>
    </motion.div>
  );
  const visual = <motion.div {...fade(0.1, 20)} className="relative">{s.visual}</motion.div>;
  return (
    <div className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${index > 0 ? 'mt-24 md:mt-32' : ''}`}>
      {s.flip ? <>{visual}{text}</> : <>{text}{visual}</>}
    </div>
  );
}

export function Stories() {
  const [delivery, restaurant, services] = TRACKS;
  const stories: Story[] = [
    {
      tr: delivery, eyebrow: 'Delivery partner',
      title: 'Every order shows its payout before you accept.',
      lead: 'Short hyperlocal runs in the streets you already know. Your week is summarised in the app and settled to your bank every Monday.',
      bullets: ['Per-order payout visible up front', 'No forced login hours or penalty targets', 'Dedicated onboarding manager and training'],
      visual: (
        <div className="relative mx-auto w-fit">
          <Phone><PartnerAppScreen /></Phone>
        </div>
      ),
    },
    {
      tr: restaurant, eyebrow: 'Restaurant & kitchen partner', flip: true,
      title: 'Your menu, your prices, your counter.',
      lead: 'A live dashboard built for the kitchen counter. Toggle items, set prep time and accept orders in a tap — riders are timed to arrive when food is ready.',
      bullets: ['Commission explained before you go live', 'Menu, prices and hours stay in your control', 'Customer names and order history shared with you'],
      visual: (
        <div className="relative">
          <Browser url="partner.zyphix.in/eats"><RestaurantDashboard /></Browser>
        </div>
      ),
    },
    {
      tr: services, eyebrow: 'Zyphix Book professional',
      title: 'Verified badge. Local bookings. Your rate card.',
      lead: 'Booking requests only from your chosen area and radius. Once ID and background checks are complete, customers see your verified badge.',
      bullets: ['You set your days, slots and rates', 'Job checklist and customer confirmation on every booking', 'Solo professionals and small teams both welcome'],
      visual: (
        <div className="relative mx-auto w-fit">
          <Phone><BookingScreen /></Phone>
        </div>
      ),
    },
  ];
  return (
    <Section>
      <Container>
        {stories.map((s, i) => <StoryRow key={s.tr.id} s={s} index={i} />)}
      </Container>
    </Section>
  );
}
