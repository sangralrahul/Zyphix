import React from 'react';
import { Switch, Route } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Container, Button } from '@/ui/kit';
import { Headline, Kicker, Light, Sub } from '@/ui/cinema';
import { Shell } from './advertise/Shell';
import { Hero, Signals } from './advertise/Hero';
import { Formats } from './advertise/Formats';
import { Audience } from './advertise/Audience';
import { Reporting } from './advertise/Reporting';
import { Statement } from './advertise/Statement';
import { Pricing } from './advertise/Pricing';
import { Process } from './advertise/Process';
import { InquiryForm } from './advertise/InquiryForm';
import { Faq, FinalCta } from './advertise/Faq';
import { MAIN_SITE } from './advertise/shared';

/* ────────────────────────────────────────────────────────────────────────────
   advertise.zyphix.in — advertising site for brands and local businesses.
   Cinematic direction on src/ui/cinema.tsx (same family as partner.zyphix.in).
   Anchors: #formats #audience #targeting #reporting #pricing #process
            #contact (inquiry form) #faq
──────────────────────────────────────────────────────────────────────────── */

function Home() {
  return (
    <Shell title="Advertise on Zyphix" hero>
      <Hero />
      <Signals />
      <Formats />
      <Reporting />
      <Audience />
      <Process />
      <Statement />
      <Pricing />
      <InquiryForm />
      <Faq />
      <FinalCta />
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell title="Page not found" sticky={false}>
      <Light>
        <Container narrow className="pb-28 pt-24 text-center md:pb-36 md:pt-32">
          <Kicker className="justify-center">Error 404</Kicker>
          <Headline as="h1" size="lg">Page not found.</Headline>
          <Sub className="mx-auto mt-5 max-w-[480px]">That page doesn't exist on advertise.zyphix.in. Head back to the overview or talk to partnerships.</Sub>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/" size="lg">Advertising overview <ArrowRight size={15} /></Button>
            <Button href={MAIN_SITE} variant="secondary" size="lg">Back to zyphix.in</Button>
          </div>
        </Container>
      </Light>
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
