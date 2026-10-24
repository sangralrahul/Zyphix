import React from 'react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { useCategories } from './home/shared';
import { Hero, SignalStrip } from './home/Hero';
import { Products } from './home/Products';
import { StoreShowcase } from './home/StoreShowcase';
import { HowItWorks } from './home/HowItWorks';
import { Why } from './home/Why';
import { Partners } from './home/Partners';
import { AppSection } from './home/AppSection';
import { Faq, FinalCta, StickyCta } from './home/Faq';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix — company landing page (zyphix.in)
   Sections live in ./home/*. Only the lightweight /api/categories call is
   made here (no product-list fetch); it is shared with every section.
──────────────────────────────────────────────────────────────────────────── */

export function Landing() {
  const categories = useCategories();
  React.useEffect(() => { document.title = 'Zyphix — Your neighbourhood, delivered in 30 minutes'; }, []);

  return (
    <div className="min-h-screen bg-white pb-[72px] text-gray-900 md:pb-0" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <SiteHeader />
      <main>
        <Hero categories={categories} />
        <SignalStrip categories={categories} />
        <Products />
        <StoreShowcase categories={categories} />
        <HowItWorks />
        <Why />
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
