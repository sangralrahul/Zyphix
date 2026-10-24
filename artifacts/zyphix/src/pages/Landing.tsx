import React from 'react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { FONT } from '@/ui/kit';
import { useCategories } from './home/shared';
import { Hero, SignalRow } from './home/Hero';
import { Features, Stories } from './home/Products';
import { Statement, HowItWorks, Categories } from './home/HowItWorks';
import { Partners } from './home/Partners';
import { AppSection } from './home/AppSection';
import { Faq, FinalCta, StickyCta } from './home/Faq';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix — company landing page (zyphix.in), Stripe / Linear direction.
   Sections live in ./home/*. Only the lightweight /api/categories call is
   made here (no product-list fetch); it is shared with every section.
──────────────────────────────────────────────────────────────────────────── */

export function Landing() {
  const categories = useCategories();
  React.useEffect(() => { document.title = 'Zyphix — Your neighbourhood, delivered in 30 minutes'; }, []);

  return (
    <div className="min-h-screen bg-white pb-[72px] text-gray-900 antialiased md:pb-0" style={{ fontFamily: FONT }}>
      <SiteHeader />
      <main>
        <Hero categories={categories} />
        <SignalRow categories={categories} />
        <Features />
        <Stories />
        <Statement />
        <HowItWorks />
        <Categories categories={categories} />
        <Partners />
        <AppSection />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}

export default Landing;
