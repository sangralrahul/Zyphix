import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { Button, FONT } from '@/ui/kit';
import { ScrollProgress } from '@/ui/cinema';

/* ────────────────────────────────────────────────────────────────────────────
   partner.zyphix.in shell — shared Zyphix chrome (transparent header over the
   video hero, solid on inner pages), scroll progress and the mobile sticky CTA.
──────────────────────────────────────────────────────────────────────────── */

/* ── Sticky mobile CTA ───────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8EC] bg-white/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Partner with Zyphix</p>
          <p className="truncate text-[11.5px] text-gray-500">Free to apply · No joining fee</p>
        </div>
        <Button href="#tracks" size="sm" className="shrink-0">Apply now <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */
export function Shell({ children, hero = false, sticky = false }: { children: React.ReactNode; hero?: boolean; sticky?: boolean }) {
  return (
    <div className={`min-h-screen ${hero ? 'bg-[#05080E]' : 'bg-white'} text-gray-900 antialiased`} style={{ fontFamily: FONT }}>
      <ScrollProgress />
      <SiteHeader variant={hero ? 'transparent' : 'solid'} />
      <main>{children}</main>
      <SiteFooter />
      {sticky && <div aria-hidden className="h-[72px] bg-white md:hidden" />}
      {sticky && <StickyCta />}
    </div>
  );
}
