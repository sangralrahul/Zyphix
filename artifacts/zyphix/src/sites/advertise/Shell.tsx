import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { Container, Button, Chip, FONT, G } from '@/ui/kit';
import { MAIN_SITE, PARTNER_SITE, PARTNERSHIPS_EMAIL } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Header / footer / sticky CTA for advertise.zyphix.in (Stripe-style shell)
──────────────────────────────────────────────────────────────────────────── */

const NAV = [
  { label: 'Formats', href: '#formats' },
  { label: 'Targeting', href: '#targeting' },
  { label: 'Reporting', href: '#reporting' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl ${open ? 'bg-white' : ''}`}>
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Zyphix Advertise home" className="flex items-center gap-2.5">
          <ZyphixLogo size={30} />
          <Chip tone="green">Advertise</Chip>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map(n => <a key={n.label} href={n.href} className="text-[14px] font-medium text-gray-600 transition-colors hover:text-gray-900">{n.label}</a>)}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={MAIN_SITE} className="inline-flex items-center gap-1 px-3 text-[14px] font-medium text-gray-600 hover:text-gray-900">zyphix.in <ArrowUpRight size={14} /></a>
          <Button href="#contact" size="sm">Talk to partnerships <ArrowRight size={14} /></Button>
        </div>

        <button className="rounded-lg p-2 text-gray-700 lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map(n => <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50">{n.label}</a>)}
            <a href={MAIN_SITE} className="flex items-center gap-1 rounded-lg px-2 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50">zyphix.in <ArrowUpRight size={14} /></a>
            <div className="pt-3" onClick={() => setOpen(false)}><Button href="#contact" className="w-full">Talk to partnerships <ArrowRight size={15} /></Button></div>
          </Container>
        </div>
      )}
    </header>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
const FOOT: Array<[string, Array<[string, string]>]> = [
  ['Advertise', [['Formats', '#formats'], ['Who it\'s for', '#audience'], ['Targeting', '#targeting'], ['Reporting', '#reporting'], ['Pricing', '#pricing']]],
  ['Resources', [['How it works', '#process'], ['FAQ', '#faq'], ['Send a brief', '#contact'], ['Partner portal', PARTNER_SITE]]],
  ['Company', [['zyphix.in', MAIN_SITE], ['Become a partner', PARTNER_SITE], ['Partnerships email', `mailto:${PARTNERSHIPS_EMAIL}`]]],
  ['Legal', [['Privacy', '/privacy'], ['Terms', '/terms']]],
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
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
            <ul className="mt-3 space-y-2">
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
      <div className="border-t border-gray-200">
        <Container className="flex flex-col gap-2 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyphix. All sponsored placements are labelled to customers.</p>
          <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} /> Launching across India</p>
        </Container>
      </div>
    </footer>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/90 p-3 backdrop-blur-xl md:hidden" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-gray-900">Flat-rate placements</p>
          <p className="truncate text-[12px] text-gray-500">Written quote before anything goes live</p>
        </div>
        <Button href="#contact" size="sm">Talk to partnerships <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}

/* ── Shell ────────────────────────────────────────────────────────────────── */
export function Shell({ children, title, sticky = true }: { children: React.ReactNode; title: string; sticky?: boolean }) {
  useEffect(() => { document.title = `${title} · Zyphix Advertise`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className={`min-h-screen bg-white text-gray-900 antialiased ${sticky ? 'pb-20 md:pb-0' : ''}`} style={{ fontFamily: FONT }}>
      <Header />
      <main>{children}</main>
      <Footer />
      {sticky && <StickyCta />}
    </div>
  );
}
