import React from 'react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { FONT } from '@/ui/kit';
import { ScrollProgress } from '@/ui/cinema';
import { useCategories } from './home/shared';
import { Hero, PromiseTicker } from './home/Hero';
import { NowChapter, EatsChapter, BookChapter } from './home/Products';
import { HowItWorks, LiveProof } from './home/HowItWorks';
import { AppSection, PartnerBand } from './home/AppSection';
import { Faq, FinalCta, StickyCta } from './home/Faq';

/* ────────────────────────────────────────────────────────────────────────────
   Zyphix — company landing page (zyphix.in), cinematic direction.
   Sections live in ./home/*. Only the lightweight /api/categories and
   /api/partners calls are made here (no product-list fetch).
──────────────────────────────────────────────────────────────────────────── */

export function Landing() {
  const categories = useCategories();
  React.useEffect(() => { document.title = 'Zyphix — Your neighbourhood, delivered in 30 minutes'; }, []);

  return (
    <div className="min-h-screen bg-[#05080E] pb-[72px] text-gray-900 antialiased md:pb-0" style={{ fontFamily: FONT }}>
      <ScrollProgress />
      <SiteHeader variant="transparent" />
      <main>
        <Hero />
        <PromiseTicker />
        <NowChapter categories={categories} />
        <EatsChapter />
        <BookChapter />
        <HowItWorks />
        <LiveProof />
        <AppSection />
        <PartnerBand />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}

export default Landing;
