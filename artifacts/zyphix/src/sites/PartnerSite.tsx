import React from 'react';
import { Route, Switch } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button, Container, Display, Eyebrow, Lead } from '@/ui/kit';
import { DeliverySetup } from '@/pages/DeliverySetup';
import { RestaurantSetup } from '@/pages/RestaurantSetup';
import { MerchantSetup } from '@/pages/MerchantSetup';
import { ServiceProSetup } from '@/pages/ServiceProSetup';
import { Shell } from './partner/Shell';
import { Hero, Signals } from './partner/Hero';
import { TrackBento, ListedAutomatically, LiveDirectory } from './partner/Tracks';
import { WhatYouGet, TermsBand, Steps } from './partner/Terms';
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
      <Signals />
      <TrackBento />
      <WhatYouGet />
      <ListedAutomatically />
      <LiveDirectory />
      <TermsBand />
      <Steps />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ── Not found ───────────────────────────────────────────────────────────── */
function PartnerNotFound() {
  React.useEffect(() => { document.title = 'Page not found · Zyphix Partners'; }, []);
  return (
    <Container narrow className="py-28 text-center">
      <Eyebrow className="justify-center">404</Eyebrow>
      <Display as="h1" size="lg" className="mt-4 text-gray-900">This page doesn't exist.</Display>
      <Lead className="mx-auto mt-4 max-w-[460px]">The link may be old or mistyped. Head back to the partner portal to pick your track.</Lead>
      <Button href="/" className="mt-8">Back to partner home <ArrowRight size={15} /></Button>
    </Container>
  );
}

/* ── Site ────────────────────────────────────────────────────────────────── */
export default function PartnerSite() {
  return (
    <Switch>
      <Route path="/"><Shell sticky hero><PartnerHome /></Shell></Route>
      <Route path="/delivery" component={DeliverySetup} />
      <Route path="/restaurant" component={RestaurantSetup} />
      <Route path="/store" component={MerchantSetup} />
      <Route path="/services" component={ServiceProSetup} />
      <Route><Shell><PartnerNotFound /></Shell></Route>
    </Switch>
  );
}

export { PartnerSite };
