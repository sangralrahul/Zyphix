import React from 'react';
import { Switch, Route, Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { btnPrimary, btnSecondary, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';
import { Shell } from './advertise/Shell';
import { Hero } from './advertise/Hero';
import { Formats } from './advertise/Formats';
import { Audience } from './advertise/Audience';
import { Targeting } from './advertise/Targeting';
import { Reporting } from './advertise/Reporting';
import { Comparison } from './advertise/Comparison';
import { Process } from './advertise/Process';
import { Pricing } from './advertise/Pricing';
import { Statement } from './advertise/Statement';
import { InquiryForm } from './advertise/InquiryForm';
import { Faq, FinalCta } from './advertise/Faq';
import { MAIN_SITE } from './advertise/shared';

/* ────────────────────────────────────────────────────────────────────────────
   advertise.zyphix.in — advertising site for brands and local businesses.
   Sections live in ./advertise/*. White / green / ink system, Outfit headings.
──────────────────────────────────────────────────────────────────────────── */

function Home() {
  return (
    <Shell title="Advertise on Zyphix">
      <Hero />
      <Formats />
      <Audience />
      <Targeting />
      <Reporting />
      <Comparison />
      <Process />
      <Pricing />
      <Statement />
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
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(249,115,22,.08), transparent 60%)' }} />
        <div className="mx-auto max-w-[640px] px-5 pb-24 pt-20 text-center md:pb-32 md:pt-28">
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Error 404</p>
          <h1 className="mt-3 font-black tracking-[-0.04em] leading-[1.02] text-[2.8rem] sm:text-[3.6rem]" style={{ fontFamily: HEAD_FONT, color: INK }}>Page not found.</h1>
          <p className="mt-5 text-[16.5px] leading-relaxed text-gray-600">That page doesn't exist on advertise.zyphix.in. Head back to the overview or talk to our partnerships team.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className={btnPrimary} style={{ background: G }}>Advertising overview <ArrowRight size={16} /></Link>
            <a href={MAIN_SITE} className={btnSecondary}>Back to zyphix.in</a>
          </div>
        </div>
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
