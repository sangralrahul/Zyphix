import React from 'react';
import { Link, Route, Switch } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { btnPrimary, G, HEAD_FONT } from '@/components/layout/SiteChrome';
import { DeliverySetup } from '@/pages/DeliverySetup';
import { RestaurantSetup } from '@/pages/RestaurantSetup';
import { MerchantSetup } from '@/pages/MerchantSetup';
import { ServiceProSetup } from '@/pages/ServiceProSetup';
import { Shell } from './partner/Shell';
import { Hero, TrustStrip, TrackGrid } from './partner/Hero';
import { Tracks } from './partner/Tracks';
import { Compare, InkBand, Support } from './partner/Compare';
import { Timeline } from './partner/Timeline';
import { Faq, FinalCta } from './partner/Faq';

/* ────────────────────────────────────────────────────────────────────────────
   partner.zyphix.in — partner portal. Mounted at the root for that hostname.
   Landing is composed from src/sites/partner/*; the four application flows
   keep their existing pages and submit contracts.
──────────────────────────────────────────────────────────────────────────── */

function PartnerHome() {
  React.useEffect(() => { document.title = 'Partner with Zyphix · Zyphix Partners'; window.scrollTo(0, 0); }, []);
  return (
    <>
      <Hero />
      <TrustStrip />
      <TrackGrid />
      <Tracks />
      <Compare />
      <Timeline />
      <InkBand />
      <Support />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ── Not found ───────────────────────────────────────────────────────────── */
function PartnerNotFound() {
  React.useEffect(() => { document.title = 'Page not found · Zyphix Partners'; }, []);
  return (
    <section className="mx-auto max-w-[640px] px-5 py-24 text-center">
      <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">404</p>
      <h1 className="mt-3 text-[2rem] font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>This page doesn't exist.</h1>
      <p className="mt-3 text-[15px] text-gray-600">The link may be old or mistyped. Head back to the partner portal to pick your track.</p>
      <Link href="/" className={`${btnPrimary} mt-7`} style={{ background: G }}>Back to partner home <ArrowRight size={16} /></Link>
    </section>
  );
}

/* ── Site ────────────────────────────────────────────────────────────────── */
export default function PartnerSite() {
  return (
    <Switch>
      <Route path="/"><Shell sticky><PartnerHome /></Shell></Route>
      <Route path="/delivery" component={DeliverySetup} />
      <Route path="/restaurant" component={RestaurantSetup} />
      <Route path="/store" component={MerchantSetup} />
      <Route path="/services" component={ServiceProSetup} />
      <Route><Shell><PartnerNotFound /></Shell></Route>
    </Switch>
  );
}

export { PartnerSite };
