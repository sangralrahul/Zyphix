import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Menu, X, ExternalLink, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { G, INK } from '@/components/layout/SiteChrome';
import { NAV } from './shared';

/* ── Header ──────────────────────────────────────────────────────────────── */
export function PartnerHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loc] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const link = (n: typeof NAV[number], cls: string) => (
    <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`${cls} ${loc === n.href ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>{n.label}</Link>
  );

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled || open ? 'bg-white shadow-[0_8px_30px_rgba(11,18,32,.08)] border-b border-gray-200' : 'bg-white/85 backdrop-blur-md border-b border-gray-200/70'}`}>
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Zyphix Partners home" className="flex items-center gap-2.5">
          <ZyphixLogo size={32} wordmarkColor={INK} wordmarkHighlight={G} />
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">Partners</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map(n => link(n, 'text-[14px] font-semibold transition-colors'))}
          <a href="https://zyphix.in" className="inline-flex items-center gap-1 text-[14px] font-semibold text-gray-500 transition-colors hover:text-gray-900">Back to zyphix.in <ExternalLink size={13} /></a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="mailto:partnerships@zyphix.in" className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-[14px] font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
            <Mail size={14} /> Talk to us
          </a>
          <a href="#tracks" className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[14px] font-bold text-white transition hover:opacity-90" style={{ background: G }}>
            Apply now <ArrowRight size={15} />
          </a>
        </div>

        <button className="rounded-lg p-2 text-gray-700 lg:hidden" aria-label="Menu" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-5 py-5 lg:hidden">
          {NAV.map(n => link(n, 'text-[15px] font-semibold'))}
          <a href="https://zyphix.in" className="inline-flex items-center gap-1 text-[15px] font-semibold text-gray-500">Back to zyphix.in <ExternalLink size={13} /></a>
          <div className="flex gap-3 pt-2">
            <a href="mailto:partnerships@zyphix.in" className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-[14px] font-semibold text-gray-700">Talk to us</a>
            <a href="#tracks" onClick={() => setOpen(false)} className="flex-1 rounded-xl px-4 py-2.5 text-center text-[14px] font-bold text-white" style={{ background: G }}>Apply now</a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Sticky mobile CTA ───────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-gray-900">Partner with Zyphix</p>
          <p className="truncate text-[11.5px] text-gray-500">Free to apply · Onboarding across India</p>
        </div>
        <a href="#tracks" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13.5px] font-bold text-white" style={{ background: G }}>
          Apply now <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
const COLS: Array<[string, Array<[string, string]>]> = [
  ['Join as', [['Delivery partner', '/delivery'], ['Restaurant & kitchen', '/restaurant'], ['Zyphix Book professional', '/services'], ['Kirana & store owner', '/store']]],
  ['Resources', [['How onboarding works', '#onboarding'], ['Partner model vs aggregators', '#compare'], ['Partner support', '#support'], ['FAQ', '#faq']]],
  ['Company', [['zyphix.in', 'https://zyphix.in'], ['About Zyphix', 'https://zyphix.in/about'], ['Advertise with us', 'https://advertise.zyphix.in'], ['Contact', 'https://zyphix.in/contact']]],
  ['Legal', [['Privacy policy', '/privacy'], ['Terms of service', '/terms'], ['Partner code of conduct', '/terms']]],
];

export function PartnerFooter() {
  const item = (l: string, href: string) => {
    const cls = 'text-[14px] font-medium text-gray-700 hover:text-gray-900';
    if (href.startsWith('http') || href.startsWith('#')) return <a href={href} className={cls}>{l}</a>;
    return <Link href={href} className={cls}>{l}</Link>;
  };
  return (
    <footer className="border-t border-gray-200 bg-white pb-20 lg:pb-0">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <ZyphixLogo size={30} wordmarkColor={INK} wordmarkHighlight={G} />
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">Partners</span>
          </div>
          <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-gray-600">The partner portal for delivery partners, restaurants, Zyphix Book professionals and neighbourhood stores across India.</p>
          <div className="mt-5 space-y-1.5 text-[13.5px]">
            <a href="mailto:partnerships@zyphix.in" className="flex items-center gap-2 font-semibold text-gray-800 hover:text-gray-900"><Mail size={14} className="text-emerald-700" /> partnerships@zyphix.in</a>
            <a href="mailto:support@zyphix.in" className="flex items-center gap-2 font-semibold text-gray-800 hover:text-gray-900"><Mail size={14} className="text-emerald-700" /> support@zyphix.in</a>
          </div>
          <div className="mt-5 flex gap-3">
            {[[<Instagram size={16} />, 'https://instagram.com/zyphix.in', 'Instagram'], [<Linkedin size={16} />, 'https://linkedin.com/company/zyphix', 'LinkedIn'], [<Twitter size={16} />, 'https://x.com/zyphix_in', 'X']].map(([ic, href, label]) => (
              <a key={label as string} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900">{ic}</a>
            ))}
          </div>
        </div>
        {COLS.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-gray-400">{h}</p>
            <ul className="mt-4 space-y-2.5">{links.map(([l, href]) => <li key={l}>{item(l, href)}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Made in India · Onboarding across India</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */
export function Shell({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <PartnerHeader />
      <main>{children}</main>
      <PartnerFooter />
      {sticky && <StickyCta />}
    </div>
  );
}
