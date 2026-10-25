import React from 'react';
import { Timer, BadgeIndianRupee, ShoppingBasket, ChefHat, Bike, CreditCard, BadgeCheck, CalendarCheck, ShieldCheck } from 'lucide-react';
import { type Category } from '@/lib/catalog';
import { Dark, Light, Glow, Grain, Kicker, Headline, Sub, Reveal, Stagger, VideoCard, ParallaxImage, PhotoTile, Counter, Tilt } from '@/ui/cinema';
import { Container, ArrowLink } from '@/ui/kit';
import { VIDEOS, PHOTOS, landscape } from '@/data/media';
import { NOW_SITE, EATS_SITE, BOOK_SITE, PRODUCT_COUNT_N, CATEGORY_NAMES, Proof, TileLabel, NUM } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Three product chapters: Now (dark, text-left) → Eats (white, reversed) →
   Book (dark, bento). The `products` anchor sits on the first chapter.
──────────────────────────────────────────────────────────────────────────── */

/* ── NOW ─────────────────────────────────────────────────────────────────── */
export function NowChapter({ categories }: { categories: Category[] }) {
  const names = categories.length ? categories.map(c => c.name) : CATEGORY_NAMES;
  const shown = names.slice(0, 10);
  const rest = names.length - shown.length;
  return (
    <Dark id="products" className="scroll-mt-16 py-24 md:py-36">
      <Glow x="8%" y="15%" size={900} alpha={0.2} />
      <Grain />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal><Kicker light>Zyphix Now · Groceries</Kicker></Reveal>
            <Reveal delay={0.05}><Headline light size="lg">The kirana, at your door in 30 minutes.</Headline></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-6 max-w-[480px]">Real shelves from stores near you, at shelf prices. Milk at 7am, atta on Sunday, the chips you forgot — on the way before the kettle boils.</Sub></Reveal>
            <Stagger className="mt-8 flex flex-wrap gap-2" step={0.03} y={8}>
              {shown.map(n => <span key={n} className="inline-flex h-9 items-center rounded-full border border-white/12 bg-white/[.05] px-3.5 text-[13px] font-medium text-white/80">{n}</span>)}
              {rest > 0 && <span className="inline-flex h-9 items-center rounded-full border border-dashed border-white/20 px-3.5 text-[13px] font-medium text-white/50">+{rest} more</span>}
            </Stagger>
            <ul className="mt-9 space-y-4">
              <Reveal as="li" delay={0.1} className="contents"><Proof light icon={<Timer size={18} />}>30-minute delivery promise, tracked live</Proof></Reveal>
              <Reveal as="li" delay={0.15} className="contents"><Proof light icon={<BadgeIndianRupee size={18} />}>₹0 delivery above ₹199, no surge</Proof></Reveal>
              <Reveal as="li" delay={0.2} className="contents"><Proof light icon={<ShoppingBasket size={18} />}><span style={NUM}><Counter to={PRODUCT_COUNT_N} format={n => `${Math.round(n).toLocaleString('en-IN')}+`} /></span> products from local stores</Proof></Reveal>
            </ul>
            <Reveal delay={0.25} className="mt-9"><ArrowLink href={NOW_SITE} dark>Shop on now.zyphix.in</ArrowLink></Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal y={32}>
              <Tilt max={3}>
                <VideoCard clip={VIDEOS.groceryShelf} ratio="16/10" rounded="rounded-3xl" className="ring-1 ring-white/10">
                  <TileLabel title="Every aisle, every day" meta="Live stock from partner stores" />
                </VideoCard>
              </Tilt>
            </Reveal>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Reveal delay={0.1} y={32}>
                <VideoCard clip={VIDEOS.grocery} ratio="4/5" rounded="rounded-3xl" className="ring-1 ring-white/10">
                  <TileLabel title="Handed over, not dropped" />
                </VideoCard>
              </Reveal>
              <Reveal delay={0.18} y={32}>
                <ParallaxImage photo={PHOTOS.produce[0]} ratio="4/5" className="ring-1 ring-white/10">
                  <TileLabel title="Fresh from the mandi" />
                </ParallaxImage>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Dark>
  );
}

/* ── EATS ────────────────────────────────────────────────────────────────── */
export function EatsChapter() {
  return (
    <Light className="py-24 md:py-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <Reveal y={32}>
              <Tilt max={3}>
                <VideoCard clip={VIDEOS.food} ratio="16/10" rounded="rounded-3xl" className="shadow-[0_30px_80px_rgba(11,15,25,.14)]">
                  <TileLabel title="Cooked when you order" meta="Local kitchens, local prices" />
                </VideoCard>
              </Tilt>
            </Reveal>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Reveal delay={0.1} y={32}>
                <PhotoTile photo={landscape('indianFood')} ratio="4/5" rounded="rounded-3xl">
                  <TileLabel title="Thali, biryani, momos" />
                </PhotoTile>
              </Reveal>
              <Reveal delay={0.18} y={32}>
                <VideoCard clip={VIDEOS.foodDelivery} ratio="4/5" rounded="rounded-3xl">
                  <TileLabel title="Still hot at the door" />
                </VideoCard>
              </Reveal>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <Reveal><Kicker>Zyphix Eats · Food</Kicker></Reveal>
            <Reveal delay={0.05}><Headline size="lg">Dinner from the dhaba you already love.</Headline></Reveal>
            <Reveal delay={0.1}><Sub className="mt-6 max-w-[480px]">Restaurants, cafés and home kitchens around you list their own menus at their own prices. No markup, no hidden packaging fee, no surge.</Sub></Reveal>
            <ul className="mt-9 space-y-4">
              <Reveal as="li" delay={0.1} className="contents"><Proof icon={<ChefHat size={18} />}>Menu prices as in the restaurant</Proof></Reveal>
              <Reveal as="li" delay={0.15} className="contents"><Proof icon={<Bike size={18} />}>Riders from the same area, tracked live</Proof></Reveal>
              <Reveal as="li" delay={0.2} className="contents"><Proof icon={<CreditCard size={18} />}>UPI, cards or cash on delivery</Proof></Reveal>
            </ul>
            <Reveal delay={0.25} className="mt-9"><ArrowLink href={EATS_SITE}>Order on eats.zyphix.in</ArrowLink></Reveal>
            <Reveal delay={0.3} y={32} className="mt-10 hidden lg:block">
              <ParallaxImage photo={landscape('restaurant', 1)} ratio="16/9" rounded="rounded-3xl" strength={8}>
                <TileLabel title="Jammu's favourite tables" meta="Street stalls to family restaurants" />
              </ParallaxImage>
            </Reveal>
          </div>
        </div>
      </Container>
    </Light>
  );
}

/* ── BOOK ────────────────────────────────────────────────────────────────── */
export function BookChapter() {
  return (
    <Dark className="py-24 md:py-36">
      <Glow x="85%" y="10%" size={1000} alpha={0.22} />
      <Grain />
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal><Kicker light>Zyphix Book · Home services</Kicker></Reveal>
            <Reveal delay={0.05}><Headline light size="lg">Verified professionals, booked in a minute.</Headline></Reveal>
            <Reveal delay={0.1}><Sub light className="mt-6 max-w-[560px]">Cleaners, electricians, plumbers, AC technicians and salon artists who have shown us their ID and their work. Pick a slot, get a fixed quote, pay when it is done.</Sub></Reveal>
          </div>
          <div className="lg:col-span-5">
            <ul className="space-y-4">
              <Reveal as="li" delay={0.1} className="contents"><Proof light icon={<BadgeCheck size={18} />}>ID-verified, background-checked pros</Proof></Reveal>
              <Reveal as="li" delay={0.15} className="contents"><Proof light icon={<CalendarCheck size={18} />}>Pick a slot, same-day where available</Proof></Reveal>
              <Reveal as="li" delay={0.2} className="contents"><Proof light icon={<ShieldCheck size={18} />}>Fixed quote before anyone arrives</Proof></Reveal>
            </ul>
            <Reveal delay={0.25} className="mt-8"><ArrowLink href={BOOK_SITE} dark>Book on book.zyphix.in</ArrowLink></Reveal>
          </div>
        </div>

        <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-12">
          <Reveal y={32} className="col-span-2 row-span-2 md:col-span-7">
            <VideoCard clip={VIDEOS.cleaning} ratio="auto" rounded="rounded-3xl" className="h-full ring-1 ring-white/10">
              <TileLabel title="Home cleaning" meta="Deep clean, kitchen, bathroom, sofa" />
            </VideoCard>
          </Reveal>
          <Reveal y={32} delay={0.08} className="col-span-1 md:col-span-5">
            <ParallaxImage photo={PHOTOS.plumbing[0]} ratio="auto" className="h-full ring-1 ring-white/10" strength={8}>
              <TileLabel title="Plumbing" />
            </ParallaxImage>
          </Reveal>
          <Reveal y={32} delay={0.14} className="col-span-1 md:col-span-5">
            <PhotoTile photo={PHOTOS.appliance[0]} ratio="auto" rounded="rounded-3xl" className="h-full ring-1 ring-white/10">
              <TileLabel title="AC & appliance repair" />
            </PhotoTile>
          </Reveal>
          <Reveal y={32} delay={0.2} className="col-span-1 md:col-span-4">
            <VideoCard clip={VIDEOS.electrician} ratio="auto" rounded="rounded-3xl" className="h-full ring-1 ring-white/10">
              <TileLabel title="Electrician" />
            </VideoCard>
          </Reveal>
          <Reveal y={32} delay={0.26} className="col-span-1 md:col-span-4">
            <VideoCard clip={VIDEOS.salon} ratio="auto" rounded="rounded-3xl" className="h-full ring-1 ring-white/10">
              <TileLabel title="Salon at home" />
            </VideoCard>
          </Reveal>
          <Reveal y={32} delay={0.32} className="col-span-2 md:col-span-4">
            <PhotoTile photo={PHOTOS.cleaning[1]} ratio="auto" rounded="rounded-3xl" className="h-full ring-1 ring-white/10">
              <TileLabel title="Kitchen & bathroom deep clean" />
            </PhotoTile>
          </Reveal>
        </div>
      </Container>
    </Dark>
  );
}
