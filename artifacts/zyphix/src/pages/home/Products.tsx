import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, UtensilsCrossed, Wrench, Radar, Receipt, MapPin, Check, Search, Star, Clock, CalendarDays, ShieldCheck } from 'lucide-react';
import { Section, Container, SectionTitle, Bento, Card, IconTile, Chip, SampleTag, Browser, Phone, Eyebrow, Display, Lead, ArrowLink, fade, G } from '@/ui/kit';
import { PRODUCT_COUNT, Swatch, NUM } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   #products — Bento of six feature tiles, then three alternating feature
   stories (Now / Eats / Book) with Browser or Phone mock-ups.
──────────────────────────────────────────────────────────────────────────── */

const Row = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] ${className}`}>{children}</div>
);

function Tile({ icon, tone, title, line, children, className = '', delay = 0 }: { icon: React.ReactNode; tone: React.ComponentProps<typeof IconTile>['tone']; title: string; line: string; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div {...fade(delay)} className={className}>
      <Card className="flex h-full flex-col p-6">
        <IconTile tone={tone}>{icon}</IconTile>
        <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-gray-900">{title}</h3>
        <p className="mt-1 text-[14px] leading-[1.55] text-gray-600">{line}</p>
        <div className="relative mt-5 flex-1 rounded-xl bg-[#FAFAFA] p-3 ring-1 ring-gray-100">
          {children}
          <SampleTag className="absolute right-2 top-2" />
        </div>
      </Card>
    </motion.div>
  );
}

export function Features() {
  return (
    <Section id="products" className="scroll-mt-16">
      <Container>
        <SectionTitle eyebrow="Products" title="Everything local, in one app." lead="Three products on one account. Each one runs on the businesses already in your area." />

        <Bento className="mt-14">
          <Tile className="md:col-span-4" tone="green" icon={<ShoppingBasket size={18} />} title="Groceries" line={`${PRODUCT_COUNT} products from kirana stores near you.`}>
            <div className="space-y-2 pt-5">
              {[['Amul Taaza Milk 500 ml', 'blue', 27], ['Tata Salt 1 kg', 'gray', 28], ['Maggi 2-min 70 g', 'amber', 14]].map(([n, t, p]) => (
                <Row key={n as string}><span className="flex items-center gap-2 truncate"><Swatch tone={t as 'blue'} className="h-6 w-6" />{n as string}</span><span className="font-semibold" style={NUM}>₹{p as number}</span></Row>
              ))}
            </div>
          </Tile>

          <Tile className="md:col-span-4" tone="orange" icon={<UtensilsCrossed size={18} />} title="Food" line="Restaurants and dhabas at their own menu prices." delay={0.05}>
            <div className="space-y-2 pt-5">
              {[['Sharma Dhaba', '22 min'], ['Dosa Corner', '18 min'], ['Biryani House', '28 min']].map(([n, t]) => (
                <Row key={n}><span className="flex items-center gap-2"><Swatch tone="orange" className="h-6 w-6" />{n}</span><Chip tone="green"><Clock size={11} />{t}</Chip></Row>
              ))}
            </div>
          </Tile>

          <Tile className="md:col-span-4" tone="blue" icon={<Wrench size={18} />} title="Home services" line="Verified electricians, plumbers, cleaners and more." delay={0.1}>
            <div className="flex flex-wrap gap-2 pt-5">
              {['Electrician', 'Plumber', 'Cleaning', 'AC service', 'Carpenter', 'Salon at home', 'Pest control'].map(s => <Chip key={s}>{s}</Chip>)}
            </div>
          </Tile>

          <Tile className="md:col-span-5" tone="teal" icon={<Radar size={18} />} title="Live tracking" line="Watch your order move from shelf to doorstep." delay={0.15}>
            <div className="pt-5">
              <div className="flex items-center justify-between text-[11.5px] font-medium text-gray-600">
                {['Placed', 'Packed', 'Picked up', 'Delivered'].map((s, i) => <span key={s} className={i < 3 ? 'text-gray-900' : ''}>{s}</span>)}
              </div>
              <div className="relative mt-2 h-1.5 rounded-full bg-gray-200">
                <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: G }} initial={{ width: '10%' }} whileInView={{ width: '72%' }} viewport={{ once: true }} transition={{ duration: 1.6, ease: 'easeOut' }} />
              </div>
              <p className="mt-3 text-[12.5px] text-gray-600">Rider is <span className="font-semibold text-gray-900">2 min</span> away</p>
            </div>
          </Tile>

          <Tile className="md:col-span-4" tone="violet" icon={<Receipt size={18} />} title="Transparent pricing" line="The price on the shelf is the price in the app." delay={0.2}>
            <div className="space-y-1.5 pt-5 text-[12.5px]">
              {[['Items (3)', '₹69'], ['Surge', '₹0'], ['Handling', '₹0'], ['Delivery', 'shown at checkout']].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-gray-500">{k}</span><span className={`font-medium ${v === '₹0' ? 'text-emerald-700' : 'text-gray-900'}`} style={NUM}>{v}</span></div>
              ))}
            </div>
          </Tile>

          <Tile className="md:col-span-3" tone="ink" icon={<MapPin size={18} />} title="Local-first" line="Fulfilled from within a few km." delay={0.25}>
            <div className="space-y-2 pt-5">
              {[['Gupta Kirana', '0.4 km'], ['Fresh Mart', '0.9 km'], ['Daily Needs', '1.2 km']].map(([n, d]) => (
                <div key={n} className="flex items-center justify-between text-[12.5px]"><span className="flex items-center gap-1.5 text-gray-900"><Check size={12} className="text-emerald-600" />{n}</span><span className="text-gray-500" style={NUM}>{d}</span></div>
              ))}
            </div>
          </Tile>
        </Bento>
      </Container>
    </Section>
  );
}

/* ── Feature stories ──────────────────────────────────────────────────────── */
function Story({ eyebrow, title, lead, bullets, href, cta, visual, flip = false }: { eyebrow: string; title: string; lead: string; bullets: string[]; href: string; cta: string; visual: React.ReactNode; flip?: boolean }) {
  return (
    <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <motion.div {...fade(0)}>
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <Display as="h3" size="lg" className="text-gray-900">{title}</Display>
        <Lead className="mt-5">{lead}</Lead>
        <ul className="mt-6 space-y-3">
          {bullets.map(b => <li key={b} className="flex items-start gap-3 text-[15px] text-gray-700"><span className="mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Check size={11} /></span>{b}</li>)}
        </ul>
        <ArrowLink href={href} className="mt-7">{cta}</ArrowLink>
      </motion.div>
      <motion.div {...fade(0.1, 20)} className="relative">
        <div aria-hidden className="absolute inset-0 -z-10 rounded-[40px] opacity-70 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(13,163,102,.25), transparent 70%)' }} />
        {visual}
      </motion.div>
    </div>
  );
}

function NowMock() {
  const items: Array<[string, string, number, 'blue' | 'amber' | 'green' | 'gray' | 'orange' | 'red']> = [
    ['Amul Taaza Milk', '500 ml', 27, 'blue'], ['Bananas', '6 pcs', 42, 'amber'], ['Tomatoes', '500 g', 24, 'red'], ['Aashirvaad Atta', '5 kg', 265, 'orange'], ['Tata Salt', '1 kg', 28, 'gray'], ['Coriander', '1 bunch', 10, 'green'],
  ];
  return (
    <Browser url="zyphix.in/now">
      <div className="relative bg-[#FAFAFA] p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-400"><Search size={13} /> Search 2,900+ products</div>
          <Chip tone="green"><MapPin size={11} /> Gupta Kirana · 0.4 km</Chip>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {items.map(([n, q, p, t]) => (
            <div key={n} className="rounded-xl border border-gray-200 bg-white p-2.5">
              <Swatch tone={t} className="h-16 w-full" />
              <p className="mt-2 truncate text-[12px] font-semibold tracking-[-0.01em] text-gray-900">{n}</p>
              <p className="text-[10.5px] text-gray-500">{q}</p>
              <div className="mt-1.5 flex items-center justify-between"><span className="text-[12.5px] font-semibold" style={NUM}>₹{p}</span><span className="rounded-md px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-200">ADD</span></div>
            </div>
          ))}
        </div>
        <SampleTag className="absolute right-3 top-3" />
      </div>
    </Browser>
  );
}

function EatsMock() {
  return (
    <Phone className="scale-[.9] sm:scale-100">
      <div className="relative h-full bg-[#FAFAFA]">
        <div className="bg-white px-4 pb-3 pt-1">
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-gray-900">Sharma Dhaba</p>
          <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500"><span className="inline-flex items-center gap-0.5"><Star size={10} className="text-emerald-600" /> North Indian</span>·<span className="inline-flex items-center gap-0.5"><Clock size={10} /> 22 min</span>·<span>1.1 km</span></p>
          <div className="mt-3 flex gap-2">{['Recommended', 'Thali', 'Breads', 'Dal'].map((c, i) => <Chip key={c} tone={i === 0 ? 'ink' : 'gray'}>{c}</Chip>)}</div>
        </div>
        <div className="space-y-2 p-4">
          {[['Dal Makhani', 'Menu price', 180], ['Paneer Butter Masala', 'Menu price', 220], ['Butter Naan', 'Menu price', 40], ['Jeera Rice', 'Menu price', 120]].map(([n, s, p]) => (
            <div key={n as string} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5">
              <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-gray-900">{n as string}</p><p className="text-[10px] text-gray-500">{s as string}</p><p className="mt-0.5 text-[12px] font-semibold" style={NUM}>₹{p as number}</p></div>
              <Swatch tone="orange" className="h-14 w-14" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-4 bottom-5 flex items-center justify-between rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white" style={{ background: G }}><span>2 items · ₹400</span><span>View cart →</span></div>
        <SampleTag className="absolute right-3 top-1" />
      </div>
    </Phone>
  );
}

function BookMock() {
  return (
    <Browser url="zyphix.in/book">
      <div className="relative grid gap-4 bg-[#FAFAFA] p-4 sm:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100"><Wrench size={16} /></span>
            <div><p className="text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Electrician · Ramesh K.</p><p className="flex items-center gap-1 text-[11.5px] text-gray-500"><ShieldCheck size={11} className="text-emerald-600" /> ID verified · 1.3 km away</p></div>
          </div>
          <div className="mt-4 space-y-1.5 text-[12.5px]">
            {[['Fan / light installation', '₹199'], ['Switchboard repair', '₹249'], ['Inverter check', '₹299']].map(([k, v]) => <div key={k} className="flex justify-between rounded-lg bg-[#FAFAFA] px-3 py-2"><span className="text-gray-700">{k}</span><span className="font-semibold text-gray-900" style={NUM}>{v}</span></div>)}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-900"><CalendarDays size={13} /> Pick a slot</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {['9:00', '10:00', '11:00', '2:00', '3:00', '5:00'].map((t, i) => <span key={t} className={`rounded-md py-1.5 text-center text-[11.5px] font-medium ring-1 ${i === 3 ? 'text-white ring-transparent' : 'bg-white text-gray-700 ring-gray-200'}`} style={i === 3 ? { background: G } : undefined}>{t}</span>)}
          </div>
          <div className="mt-3 rounded-lg py-2 text-center text-[12px] font-semibold text-white" style={{ background: G }}>Book for today, 2:00 PM</div>
        </div>
        <SampleTag className="absolute right-3 top-3" />
      </div>
    </Browser>
  );
}

export function Stories() {
  return (
    <Section tone="soft">
      <Container className="space-y-24 md:space-y-32">
        <Story eyebrow="Zyphix Now" title="Groceries from the kirana, not a warehouse." lead="Real shelves, real stock. Order from stores a few hundred metres away and get it in about 30 minutes."
          bullets={[`${PRODUCT_COUNT} products across live categories`, 'Shelf prices with no markup', 'Schedule for now or a later slot']} href="/now" cta="Shop groceries" visual={<NowMock />} />
        <Story flip eyebrow="Zyphix Eats" title="Dinner from the dhaba down the road." lead="Restaurants list their own menu prices. We never surge, and the rider comes from your area."
          bullets={['Menu prices, no inflated listings', 'Live prep and delivery status', 'Neighbourhood restaurants first']} href="/eats" cta="Order food" visual={<EatsMock />} />
        <Story eyebrow="Zyphix Book" title="A verified professional for the weekend job." lead="Electricians, plumbers, cleaners and more, each ID-checked before they can accept a booking."
          bullets={['ID and address verified', 'Upfront service prices', 'Pick a time slot that suits you']} href="/book" cta="Book a service" visual={<BookMock />} />
      </Container>
    </Section>
  );
}
