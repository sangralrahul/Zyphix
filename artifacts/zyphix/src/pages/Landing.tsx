import React from 'react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { FONT } from '@/ui/kit';
import { useCategories } from './home/shared';
import { Hero, IntroMarquee } from './home/Hero';
import { ProductStory, AislesGallery } from './home/Products';
import { HowItWorks, LiveProof } from './home/HowItWorks';
import { CityWall, SuperLocalBand } from './home/City';
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
      <SiteHeader variant="transparent" />
      <main>
        <Hero />
        <IntroMarquee />
        <ProductStory />
        <HowItWorks />
        <LiveProof />
        <AislesGallery categories={categories} />
        <CityWall />
        <SuperLocalBand />
        <PartnerBand />
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
