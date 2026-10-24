import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { Button, Chip, Container, FONT, G, INK } from '@/ui/kit';
import { ADVERTISE_SITE, MAIN_SITE, NAV, PARTNERSHIPS_EMAIL } from './shared';

/* ── Header (64px, translucent, hairline) ───────────────────────────────── */
export function PartnerHeader() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();

  const links = (cls: string) => NAV.map(n => (
    <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`${cls} ${loc === n.href ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>{n.label}</Link>
  ));

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" aria-label="Zyphix Partners home" className="flex items-center gap-2.5">
          <ZyphixLogo size={30} wordmarkColor={INK} wordmarkHighlight={G} />
          <Chip tone="green">Partners</Chip>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {links('text-[14px] font-medium transition-colors')}
          <a href={MAIN_SITE} className="inline-flex items-center gap-0.5 text-[14px] font-medium text-gray-600 transition-colors hover:text-gray-900">zyphix.in <ArrowUpRight size={14} /></a>
        </nav>

        <div className="hidden lg:flex">
          <Button href="#tracks" size="sm">Apply now <ArrowRight size={14} /></Button>
        </div>

        <button className="rounded-lg p-2 text-gray-700 lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {links('text-[15px] font-medium')}
            <a href={MAIN_SITE} className="inline-flex items-center gap-0.5 text-[15px] font-medium text-gray-600">zyphix.in <ArrowUpRight size={14} /></a>
            <div className="flex gap-3 pt-1">
              <Button href={`mailto:${PARTNERSHIPS_EMAIL}`} variant="secondary" className="flex-1">Talk to us</Button>
              <div className="flex flex-1" onClick={() => setOpen(false)}><Button href="#tracks" className="flex-1">Apply now</Button></div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

/* ── Sticky mobile CTA ───────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/90 px-5 py-3 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-gray-900">Partner with Zyphix</p>
          <p className="truncate text-[12px] text-gray-500">Free to apply · No joining fee</p>
        </div>
        <Button href="#tracks" size="sm">Apply now <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}

/* ── Footer (compact) ────────────────────────────────────────────────────── */
const COLS: Array<[string, Array<[string, string]>]> = [
  ['Join as', [['Delivery partner', '/delivery'], ['Restaurant & kitchen', '/restaurant'], ['Zyphix Book professional', '/services'], ['Kirana & store owner', '/store']]],
  ['Resources', [['How onboarding works', '#onboarding'], ['Terms we work by', '#terms'], ['FAQ', '#faq'], ['Partner support', `mailto:${PARTNERSHIPS_EMAIL}`]]],
  ['Company', [['zyphix.in', MAIN_SITE], ['Advertise with us', ADVERTISE_SITE], ['Contact partnerships', `mailto:${PARTNERSHIPS_EMAIL}`]]],
  ['Legal', [['Privacy policy', '/privacy'], ['Terms of service', '/terms']]],
];

export function PartnerFooter() {
  const item = (l: string, href: string) => {
    const cls = 'text-[14px] text-gray-600 transition-colors hover:text-gray-900';
    if (href.startsWith('http')) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{l}</a>;
    if (href.startsWith('#') || href.startsWith('mailto:')) return <a href={href} className={cls}>{l}</a>;
    return <Link href={href} className={cls}>{l}</Link>;
  };
  return (
    <footer className="border-t border-gray-200 bg-white pb-20 lg:pb-0">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <ZyphixLogo size={28} wordmarkColor={INK} wordmarkHighlight={G} />
            <Chip tone="green">Partners</Chip>
          </div>
          <p className="mt-4 max-w-[280px] text-[14px] leading-relaxed text-gray-600">The partner portal for delivery partners, restaurants, Zyphix Book professionals and neighbourhood stores.</p>
          <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="mt-4 inline-block text-[14px] font-semibold text-gray-900 hover:text-emerald-700">{PARTNERSHIPS_EMAIL}</a>
        </div>
        {COLS.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-semibold text-gray-900">{h}</p>
            <ul className="mt-3.5 space-y-2.5">{links.map(([l, href]) => <li key={l}>{item(l, href)}</li>)}</ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-gray-200">
        <Container className="flex flex-col gap-2 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} /> Onboarding across India</p>
        </Container>
      </div>
    </footer>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */
export function Shell({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased" style={{ fontFamily: FONT }}>
      <PartnerHeader />
      <main>{children}</main>
      <PartnerFooter />
      {sticky && <StickyCta />}
    </div>
  );
}
