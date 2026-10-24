import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Menu, X, Instagram, Linkedin, Twitter } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';

/* ────────────────────────────────────────────────────────────────────────────
   Shared marketing chrome for zyphix.in — header, footer, page helpers.
   Design tokens: white surfaces, gray-200 borders, green accent, Outfit headings.
──────────────────────────────────────────────────────────────────────────── */

export const G  = '#0DA366';
export const G2 = '#0A8C58';
export const INK = '#0B1220';
export const HEAD_FONT = "'Outfit', sans-serif";

const NAV = [
  { label: 'Products',     href: '/#products' },
  { label: 'How it works', href: '/#how' },
  { label: 'Partners',     href: '/partner' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

/* ── Nav ──────────────────────────────────────────────────────────────────── */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const item = (n: typeof NAV[number]) =>
    n.href.startsWith('/#')
      ? <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">{n.label}</a>
      : <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">{n.label}</Link>;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-[1180px] px-5 h-[68px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Zyphix home" className="flex items-center">
          <ZyphixLogo size={32} wordmarkColor={INK} wordmarkHighlight={G} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">{NAV.map(item)}</nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/partner" className="text-[14px] font-semibold text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
            Become a partner
          </Link>
          <Link href="/now" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-white px-4 py-2 rounded-xl transition hover:opacity-90" style={{ background: G }}>
            Order now <ArrowRight size={15} />
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-gray-700" aria-label="Menu" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 flex flex-col gap-4">
          {NAV.map(item)}
          <div className="flex gap-3 pt-2">
            <Link href="/partner" className="flex-1 text-center text-[14px] font-semibold text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200">Become a partner</Link>
            <Link href="/now" className="flex-1 text-center text-[14px] font-bold text-white px-4 py-2.5 rounded-xl" style={{ background: G }}>Order now</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
const FOOT: Array<[string, Array<[string, string]>]> = [
  ['Products', [['Zyphix Now — groceries', '/now'], ['Zyphix Eats — food', '/eats'], ['Zyphix Book — services', '/book'], ['Offers', '/offers'], ['Kirana map', '/kirana-map'], ['Mobile app', '/app']]],
  ['Partners', [['Partner portal', 'https://partner.zyphix.in'], ['Deliver with us', '/delivery-setup'], ['Register restaurant', '/restaurant-setup'], ['Join as a professional', '/service-setup'], ['List your store', '/merchant-setup'], ['Partner dashboard', '/partner-dashboard']]],
  ['Advertise', [['Advertise with us', 'https://advertise.zyphix.in'], ['Ad formats', 'https://advertise.zyphix.in/#formats'], ['Pricing', 'https://advertise.zyphix.in/#pricing'], ['Talk to partnerships', 'mailto:partnerships@zyphix.in']]],
  ['Company', [['About', '/about'], ['Investors', '/investors'], ['Blog', '/blog'], ['Contact', '/contact'], ['Press', 'mailto:press@zyphix.in']]],
  ['Legal', [['Privacy policy', '/privacy'], ['Terms of service', '/terms'], ['Legal enquiries', 'mailto:legal@zyphix.in']]],
];
const SOCIALS: Array<[React.ReactNode, string, string]> = [
  [<Instagram size={16} />, 'https://instagram.com/zyphix.in', 'Instagram'],
  [<Linkedin size={16} />, 'https://linkedin.com/company/zyphix', 'LinkedIn'],
  [<Twitter size={16} />, 'https://x.com/zyphix_in', 'X'],
];
const CONTACTS: Array<[string, string]> = [['General', 'hello@zyphix.in'], ['Support', 'support@zyphix.in'], ['Partnerships', 'partnerships@zyphix.in']];

export function SiteFooter() {
  const ext = (href: string) => href.startsWith('http') || href.startsWith('mailto:');
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* brand + contact row */}
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 pt-14 pb-10 md:grid-cols-[1.3fr_1fr] md:items-start">
        <div>
          <ZyphixLogo size={30} wordmarkColor={INK} wordmarkHighlight={G} />
          <p className="mt-4 max-w-[420px] text-[14px] leading-relaxed text-gray-600">India's SuperLocal App — groceries, food, pharmacy and home services from the real kirana stores, restaurants and professionals in your neighbourhood. Shelf prices, zero surge, 30-minute target.</p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map(([ic, href, label]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:text-gray-900">{ic}</a>
            ))}
            <span className="ml-1 hidden text-[12.5px] text-gray-400 sm:inline">@zyphix.in</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[['/images/appstore.webp', 'App Store'], ['/images/googleplay.webp', 'Google Play']].map(([src, big]) => (
              <Link key={big} href="/app" className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-white transition hover:opacity-90" style={{ background: INK }}>
                <img src={src} alt="" className="h-5 w-5 object-contain" loading="lazy" />
                <span className="leading-tight"><span className="block text-[9px] font-medium text-white/70">Coming soon on</span><span className="block text-[12.5px] font-bold">{big}</span></span>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {CONTACTS.map(([l, e]) => (
            <a key={e} href={`mailto:${e}`} className="rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-gray-300 hover:bg-gray-50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{l}</p>
              <p className="mt-1 truncate text-[13.5px] font-semibold text-gray-800">{e}</p>
            </a>
          ))}
        </div>
      </div>

      {/* link columns */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-8 border-t border-gray-100 px-5 py-10 sm:grid-cols-3 lg:grid-cols-5">
        {FOOT.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-gray-400">{h}</p>
            <ul className="mt-4 space-y-2.5">
              {links.map(([l, href]) => (
                <li key={l}>
                  {ext(href)
                    ? <a href={href} className="text-[14px] font-medium text-gray-700 hover:text-gray-900">{l}</a>
                    : <Link href={href} className="text-[14px] font-medium text-gray-700 hover:text-gray-900">{l}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyphix. All rights reserved. Founded 2024.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: G }} /> Made in India · <a href="mailto:hello@zyphix.in" className="font-semibold text-gray-700">hello@zyphix.in</a></p>
        </div>
      </div>
    </footer>
  );
}

/* ── Shared ───────────────────────────────────────────────────────────────── */
export function SectionHead({ eyebrow, title, sub, align = 'center' }: { eyebrow: string; title: string; sub?: string; align?: 'center' | 'left' }) {
  const c = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-[640px] ${c}`}>
      <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-[1.9rem] md:text-[2.5rem] font-black tracking-[-0.03em] leading-[1.08] text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
      {sub && <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">{sub}</p>}
    </div>
  );
}


/** Page hero used by inner marketing pages. */
export function PageHero({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(249,115,22,.08), transparent 60%)' }} />
      <div className="mx-auto max-w-[1180px] px-5 pt-14 pb-12 md:pt-20 md:pb-16">
        <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">{eyebrow}</p>
        <h1 className="mt-3 max-w-[780px] font-black tracking-[-0.04em] leading-[1.04] text-[2.3rem] sm:text-[3rem] lg:text-[3.5rem]" style={{ fontFamily: HEAD_FONT, color: INK }}>{title}</h1>
        {sub && <p className="mt-5 max-w-[620px] text-[16.5px] leading-relaxed text-gray-600">{sub}</p>}
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

/** Wraps an inner marketing page with header + footer. */
export function SitePage({ children, title }: { children: React.ReactNode; title?: string }) {
  React.useEffect(() => { if (title) document.title = `${title} · Zyphix`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export const btnPrimary = 'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5 hover:opacity-95';
export const btnSecondary = 'inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[14.5px] font-bold text-gray-900 transition hover:bg-gray-50';
export const card = 'rounded-3xl border border-gray-200 bg-white';
