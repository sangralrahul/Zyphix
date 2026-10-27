import { FooterWordmark } from '@/components/layout/SiteChrome';
import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { SiteHeader } from '@/components/layout/SiteChrome';
import { Container, Button, Chip, FONT, G } from '@/ui/kit';
import { ScrollProgress } from '@/ui/cinema';
import { MAIN_SITE, PARTNER_SITE, PARTNERSHIPS_EMAIL } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   advertise.zyphix.in shell — shared Zyphix header (transparent over the video
   hero, solid on inner pages), scroll progress, advertiser footer and the
   mobile sticky CTA.
──────────────────────────────────────────────────────────────────────────── */

/* ── Footer ───────────────────────────────────────────────────────────────── */
const FOOT: Array<[string, Array<[string, string]>]> = [
  ['Advertise', [['Formats', '#formats'], ['Who it\'s for', '#audience'], ['Targeting', '#targeting'], ['Reporting', '#reporting'], ['Pricing', '#pricing']]],
  ['Resources', [['How it works', '#process'], ['FAQ', '#faq'], ['Send a brief', '#contact'], ['Partner portal', PARTNER_SITE]]],
  ['Company', [['zyphix.in', MAIN_SITE], ['Become a partner', PARTNER_SITE], ['Partnerships email', `mailto:${PARTNERSHIPS_EMAIL}`]]],
  ['Legal', [['Privacy', '/privacy'], ['Terms', '/terms']]],
];

export function Footer() {
  return (
    <footer className="border-t border-[#E6E8EC] bg-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-4 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <ZyphixLogo size={28} />
            <Chip tone="green">Advertise</Chip>
          </div>
          <p className="mt-4 max-w-[280px] text-[14px] leading-[1.6] text-gray-600">Labelled placements inside the Zyphix app, targeted by the delivery areas you serve.</p>
          <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="mt-4 inline-block text-[14px] font-semibold text-emerald-700 hover:text-emerald-800">{PARTNERSHIPS_EMAIL}</a>
        </div>
        {FOOT.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-semibold text-gray-900">{h}</p>
            <ul className="mt-3 space-y-2.5">
              {links.map(([l, href]) => (
                <li key={l}>
                  {href.startsWith('/')
                    ? <Link href={href} className="text-[14px] text-gray-600 hover:text-gray-900">{l}</Link>
                    : <a href={href} className="text-[14px] text-gray-600 hover:text-gray-900">{l}</a>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-[#E6E8EC]">
        <Container className="flex flex-col gap-2 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyphix. All sponsored placements are labelled to customers.</p>
          <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} /> Rolling out neighbourhood by neighbourhood</p>
        </Container>
      </div>
      <FooterWordmark />
    </footer>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8EC] bg-white/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-gray-900">Flat-rate placements</p>
          <p className="truncate text-[11.5px] text-gray-500">Written quote before anything goes live</p>
        </div>
        <Button href="#contact" size="sm" className="shrink-0">Send a brief <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}

/* ── Shell ────────────────────────────────────────────────────────────────── */
export function Shell({ children, title, sticky = true, hero = false }: { children: React.ReactNode; title: string; sticky?: boolean; hero?: boolean }) {
  useEffect(() => { document.title = `${title} · Zyphix Advertise`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className={`min-h-screen ${hero ? 'bg-[#05080E]' : 'bg-white'} text-gray-900 antialiased`} style={{ fontFamily: FONT }}>
      <ScrollProgress />
      <SiteHeader variant={hero ? 'transparent' : 'solid'} />
      <main>{children}</main>
      <Footer />
      {sticky && <div aria-hidden className="h-[72px] bg-white md:hidden" />}
      {sticky && <StickyCta />}
    </div>
  );
}
