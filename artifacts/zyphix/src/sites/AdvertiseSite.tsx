import React from 'react';
import { Switch, Route } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Container, Mesh, Eyebrow, Display, Lead, Button } from '@/ui/kit';
import { Shell } from './advertise/Shell';
import { Hero } from './advertise/Hero';
import { Formats } from './advertise/Formats';
import { Audience } from './advertise/Audience';
import { Targeting } from './advertise/Targeting';
import { Reporting } from './advertise/Reporting';
import { Statement } from './advertise/Statement';
import { Pricing } from './advertise/Pricing';
import { Process } from './advertise/Process';
import { InquiryForm } from './advertise/InquiryForm';
import { Faq, FinalCta } from './advertise/Faq';
import { MAIN_SITE } from './advertise/shared';

/* ────────────────────────────────────────────────────────────────────────────
   advertise.zyphix.in — advertising site for brands and local businesses.
   Stripe / Linear direction on the shared kit (src/ui/kit.tsx).
──────────────────────────────────────────────────────────────────────────── */

function Home() {
  return (
    <Shell title="Advertise on Zyphix">
      <Hero />
      <Formats />
      <Audience />
      <Targeting />
      <Reporting />
      <Statement />
      <Pricing />
      <Process />
      <InquiryForm />
      <Faq />
      <FinalCta />
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell title="Page not found" sticky={false}>
      <section className="relative overflow-hidden">
        <Mesh intensity={0.7} />
        <Container narrow className="pb-24 pt-20 text-center md:pb-32 md:pt-28">
          <Eyebrow className="justify-center">Error 404</Eyebrow>
          <Display className="mt-4 text-gray-900">Page not found.</Display>
          <Lead className="mx-auto mt-5 max-w-[480px]">That page doesn't exist on advertise.zyphix.in. Head back to the overview or talk to partnerships.</Lead>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/">Advertising overview <ArrowRight size={15} /></Button>
            <Button href={MAIN_SITE} variant="secondary">Back to zyphix.in</Button>
          </div>
        </Container>
      </section>
    </Shell>
  );
}

export default function AdvertiseSite() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}
