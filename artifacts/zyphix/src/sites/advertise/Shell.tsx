import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Menu, X, ExternalLink, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { G, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, MAIN_SITE, PARTNER_SITE, PARTNERSHIPS_EMAIL } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   Header / footer / sticky CTA for advertise.zyphix.in
──────────────────────────────────────────────────────────────────────────── */

const NAV = [
  { label: 'Ad formats',   href: '#formats' },
  { label: 'Who it\'s for', href: '#audience' },
  { label: 'Targeting',    href: '#targeting' },
  { label: 'Reporting',    href: '#reporting' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'FAQ',          href: '#faq' },
];

function AdvertiseBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span className={`rounded-full border border-emerald-200 bg-emerald-50 font-bold uppercase tracking-wider text-emerald-700 ${size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-[11.5px]'}`}>
      Advertise
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = NAV.map(n => (
    <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-[14px] font-semibold text-gray-600 transition-colors hover:text-gray-900">{n.label}</a>
  ));

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled || open ? 'bg-white shadow-[0_8px_30px_rgba(11,18,32,.08)] border-b border-gray-200' : 'bg-white/85 backdrop-blur-md border-b border-gray-200'}`}>
      <div className={`${CONTAINER} h-[68px] flex items-center justify-between gap-6`}>
        <Link href="/" aria-label="Zyphix Advertise home" className="flex items-center gap-2.5">
          <ZyphixLogo size={32} wordmarkColor={INK} wordmarkHighlight={G} />
          <AdvertiseBadge />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">{items}</nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={MAIN_SITE} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-[14px] font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
            Back to zyphix.in <ExternalLink size={14} />
          </a>
          <a href="#contact" className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[14px] font-bold text-white transition hover:opacity-90" style={{ background: G }}>
            Talk to partnerships <ArrowRight size={15} />
          </a>
        </div>

        <button className="lg:hidden rounded-lg p-2 text-gray-700" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden flex flex-col gap-4 border-t border-gray-200 bg-white px-5 py-5">
          {items}
          <div className="flex gap-3 pt-2">
            <a href={MAIN_SITE} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-[14px] font-semibold text-gray-700">Back to zyphix.in</a>
            <a href="#contact" onClick={() => setOpen(false)} className="flex-1 rounded-xl px-4 py-2.5 text-center text-[14px] font-bold text-white" style={{ background: G }}>Talk to partnerships</a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
const FOOT: Array<[string, Array<[string, string]>]> = [
  ['Advertise', [['Ad formats', '#formats'], ['Who it\'s for', '#audience'], ['How targeting works', '#targeting'], ['Reporting', '#reporting'], ['Pricing', '#pricing'], ['Request a quote', '#contact']]],
  ['Resources', [['Creative specs', '#formats'], ['How it works', '#process'], ['FAQ', '#faq'], ['Partner portal', PARTNER_SITE], ['Become a partner', PARTNER_SITE]]],
  ['Company', [['zyphix.in', MAIN_SITE], ['About', `${MAIN_SITE}/about`], ['Contact', `${MAIN_SITE}/contact`], ['Investors', `${MAIN_SITE}/investors`], ['Blog', `${MAIN_SITE}/blog`]]],
  ['Legal', [['Privacy policy', '/privacy'], ['Terms of service', '/terms'], ['Advertising guidelines', '#faq']]],
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className={`${CONTAINER} grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]`}>
        <div>
          <div className="flex items-center gap-2.5">
            <ZyphixLogo size={30} wordmarkColor={INK} wordmarkHighlight={G} />
            <AdvertiseBadge size="sm" />
          </div>
          <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-gray-600">
            Hyperlocal, clearly-labelled placements inside Zyphix Now, Eats and Book — targeted by the delivery areas you serve.
          </p>
          <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-emerald-700 hover:text-emerald-800">
            <Mail size={15} /> {PARTNERSHIPS_EMAIL}
          </a>
          <div className="mt-5 flex gap-3">
            {[[<Instagram size={16} />, 'https://instagram.com/zyphix.in', 'Instagram'], [<Linkedin size={16} />, 'https://linkedin.com/company/zyphix', 'LinkedIn'], [<Twitter size={16} />, 'https://x.com/zyphix_in', 'X']].map(([ic, href, label]) => (
              <a key={label as string} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900">{ic}</a>
            ))}
          </div>
        </div>
        {FOOT.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-gray-400">{h}</p>
            <ul className="mt-4 space-y-2.5">
              {links.map(([l, href]) => (
                <li key={l}>
                  {href.startsWith('http') || href.startsWith('#')
                    ? <a href={href} className="text-[14px] font-medium text-gray-700 hover:text-gray-900">{l}</a>
                    : <Link href={href} className="text-[14px] font-medium text-gray-700 hover:text-gray-900">{l}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200">
        <div className={`${CONTAINER} flex flex-col gap-2 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between`}>
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved. All sponsored placements are labelled to customers.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Made in India · <a href={MAIN_SITE} className="font-semibold text-gray-700">zyphix.in</a></p>
        </div>
      </div>
    </footer>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur md:hidden" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-gray-900">Flat-rate placements, your areas</p>
          <p className="truncate text-[11.5px] text-gray-500">Reply within 2 working days</p>
        </div>
        <a href="#contact" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-white" style={{ background: G }}>
          Get a quote <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

/* ── Shell ────────────────────────────────────────────────────────────────── */
export function Shell({ children, title, sticky = true }: { children: React.ReactNode; title: string; sticky?: boolean }) {
  useEffect(() => { document.title = `${title} · Zyphix Advertise`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className={`min-h-screen bg-white text-gray-900 ${sticky ? 'pb-20 md:pb-0' : ''}`} style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <Header />
      <main>{children}</main>
      <Footer />
      {sticky && <StickyCta />}
    </div>
  );
}
