import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from '@/lib/motion';
import { Menu, X, Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { ZyphixLogo } from '@/components/ZyphixLogo';
import { Button, Container, Display, Eyebrow, Lead, Mesh, FONT, G as KIT_G, G_DEEP, INK as KIT_INK } from '@/ui/kit';
import { authUrl } from '@/lib/account';
import { useAuth } from '@/context/AuthContext';

/* ────────────────────────────────────────────────────────────────────────────
   Shared marketing chrome for zyphix.in — header, footer, page helpers.
   Stripe / Linear direction: Inter, tight tracking, white surfaces,
   1px #E6E8EC hairlines, pill buttons, green accent.
──────────────────────────────────────────────────────────────────────────── */

export const G = KIT_G;
export const G2 = G_DEEP;
export const INK = KIT_INK;
export const HEAD_FONT = FONT;

const BORDER = 'border-[#E6E8EC]';

type NavItem = { label: string; href: string; external?: boolean };
const NAV: NavItem[] = [
  { label: 'Products', href: '/#products' },
  { label: 'How it works', href: '/#how' },
  { label: 'Partners', href: 'https://partner.zyphix.in', external: true },
  { label: 'Advertise', href: 'https://advertise.zyphix.in', external: true },
  { label: 'About', href: '/about' },
  { label: 'Help', href: 'https://support.zyphix.in', external: true },
];

function NavLink({ item, onClick, className }: { item: NavItem; onClick?: () => void; className: string }) {
  if (item.external) return <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>{item.label}</a>;
  if (item.href.startsWith('/#')) return <a href={item.href} onClick={onClick} className={className}>{item.label}</a>;
  return <Link href={item.href} onClick={onClick} className={className}>{item.label}</Link>;
}

/* ── Header ───────────────────────────────────────────────────────────────── */
/**
 * `variant="transparent"`: white text over a video/photo hero, absolutely positioned;
 * turns into the solid white sticky header once the page scrolls 40px.
 */
export function SiteHeader({ variant = 'solid' }: { variant?: 'solid' | 'transparent' } = {}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (variant !== 'transparent') return;
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [variant]);
  const clear = variant === 'transparent' && !scrolled && !open;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const { user } = useAuth();
  // Signed-in visitors go straight to their account; everyone else to auth.zyphix.in and back here.
  const signIn = user ? { href: '/account', label: 'My account' } : { href: typeof window !== 'undefined' ? authUrl(window.location.href) : '/auth', label: 'Sign in' };

  const desktop = clear ? 'text-[14px] font-medium tracking-[-0.01em] text-white/80 transition-colors hover:text-white' : 'text-[14px] font-medium tracking-[-0.01em] text-gray-600 transition-colors hover:text-gray-900';
  const mobile = 'flex items-center justify-between py-3.5 text-[17px] font-medium tracking-[-0.01em] text-gray-900';

  return (
    <header className={`${variant === 'transparent' ? 'fixed' : 'sticky'} top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${clear ? 'border-transparent bg-transparent' : `${BORDER} bg-white/80 backdrop-blur-xl`}`} style={{ fontFamily: FONT }}>
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" aria-label="Zyphix home" className="flex items-center" onClick={() => setOpen(false)}>
          <ZyphixLogo size={30} ixColor={clear ? '#FFFFFF' : '#0A0F1A'} />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {NAV.map(n => <NavLink key={n.label} item={n} className={desktop} />)}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={signIn.href} sameTab variant="ghost" size="sm" className={clear ? 'text-white/85 hover:bg-white/10 hover:text-white' : ''}>{signIn.label}</Button>
          <Button href="/now" variant="primary" size="sm">Order now</Button>
        </div>

        <button className={`-mr-2 rounded-lg p-2 lg:hidden ${clear ? 'text-white' : 'text-gray-700'}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white lg:hidden">
          <Container className="flex flex-col pb-10 pt-2">
            <div className="divide-y divide-gray-100">
              {NAV.map(n => (
                <NavLink key={n.label} item={n} onClick={() => setOpen(false)} className={mobile} />
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="/now" variant="primary" size="lg" className="w-full">Order now</Button>
              <Button href={signIn.href} sameTab variant="secondary" size="lg" className="w-full">{signIn.label}</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
const FOOT: Array<[string, Array<[string, string]>]> = [
  ['Products', [['Zyphix Now', '/now'], ['Zyphix Eats', '/eats'], ['Zyphix Book', '/book'], ['Offers', '/offers'], ['Store map', '/kirana-map'], ['Mobile app', '/app']]],
  ['Partners', [['Partner portal', 'https://partner.zyphix.in'], ['Deliver with us', '/delivery-setup'], ['Register a restaurant', '/restaurant-setup'], ['Join as a professional', '/service-setup'], ['List your store', '/merchant-setup']]],
  ['Company', [['About', '/about'], ['Investors', '/investors'], ['Contact', '/contact'], ['Press', 'mailto:press@zyphix.in']]],
  ['Resources', [['Blog', '/blog'], ['Advertise', 'https://advertise.zyphix.in'], ['Help centre', 'https://support.zyphix.in'], ['Partnerships', 'mailto:partnerships@zyphix.in']]],
  ['Legal', [['Privacy', '/privacy'], ['Terms', '/terms'], ['Legal enquiries', 'mailto:legal@zyphix.in']]],
];
const SOCIALS: Array<[React.ReactNode, string, string]> = [
  [<Instagram size={15} />, 'https://instagram.com/zyphix.in', 'Instagram'],
  [<Linkedin size={15} />, 'https://linkedin.com/company/zyphix', 'LinkedIn'],
  [<Twitter size={15} />, 'https://x.com/zyphix_in', 'X'],
];

/**
 * Oversized serif-italic "Zyphix" that closes every footer.
 * Fully visible (descenders included). Letters rise in one by one when the footer scrolls into view,
 * a green shine sweeps through them on a loop, and each letter lifts under the cursor.
 */
const WORD = 'Zyphix'.split('');
export function FooterWordmark({ dark = false }: { dark?: boolean }) {
  const stat = typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || /noanim/.test(location.search) || !!(navigator as any).webdriver);
  const base = dark ? 'rgba(255,255,255,.14)' : '#D5DAE1';
  const shine = dark ? 'rgba(52,211,153,.75)' : '#0DA366';
  return (
    <div aria-label="Zyphix" role="img" className="relative select-none overflow-hidden px-4 pb-20 pt-2 md:pb-[2vw]">
      <div className="flex justify-center"
        style={{
          fontFamily: "'Instrument Serif', 'Instrument Serif Fallback', ui-serif, Georgia, serif",
          fontStyle: 'italic', fontWeight: 400, lineHeight: 1.04,
          fontSize: 'clamp(96px, 22vw, 400px)', letterSpacing: '-0.02em',
        }}>
        {WORD.map((ch, i) => (
          <motion.span key={i} aria-hidden className="zx-wm-letter inline-block cursor-default px-[0.02em] pb-[0.14em]"
            style={{
              backgroundImage: `linear-gradient(100deg, ${base} 0%, ${base} 40%, ${shine} 50%, ${base} 60%, ${base} 100%)`,
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              animationDelay: `${i * 0.14}s`,
            }}
            initial={stat ? false : { y: '45%', opacity: 0, rotate: -4 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={stat ? undefined : { y: '-6%', transition: { type: 'spring', stiffness: 300, damping: 15 } }}>
            {ch}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const link = 'inline-flex items-center gap-1 text-[13.5px] text-gray-600 transition-colors hover:text-gray-900';
  return (
    <footer className={`border-t ${BORDER} bg-white`} style={{ fontFamily: FONT }}>
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-3 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <ZyphixLogo size={28} />
          <p className="mt-4 max-w-[260px] text-[13.5px] leading-[1.6] text-gray-500">The SuperLocal app. Groceries, food and home services from the businesses already in your neighbourhood.</p>
        </div>
        {FOOT.map(([h, links]) => (
          <div key={h}>
            <p className="text-[12.5px] font-semibold tracking-[-0.01em] text-gray-900">{h}</p>
            <ul className="mt-3.5 space-y-2.5">
              {links.map(([l, href]) => (
                <li key={l}>
                  {href.startsWith('http')
                    ? <a href={href} target="_blank" rel="noopener noreferrer" className={link}>{l}<ArrowUpRight size={12} className="text-gray-400" /></a>
                    : href.startsWith('mailto:')
                      ? <a href={href} className={link}>{l}</a>
                      : <Link href={href} className={link}>{l}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className={`border-t ${BORDER}`}>
        <Container className="flex flex-col gap-4 py-5 text-[13px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2">
            <span>© {new Date().getFullYear()} Zyphix</span><span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: G }} />Built for every neighbourhood</span><span className="text-gray-300">·</span>
            <a href="mailto:hello@zyphix.in" className="font-medium text-gray-700 hover:text-gray-900">hello@zyphix.in</a>
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map(([ic, href, label]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`flex h-8 w-8 items-center justify-center rounded-full border ${BORDER} text-gray-500 transition hover:border-gray-300 hover:text-gray-900`}>{ic}</a>
            ))}
          </div>
        </Container>
      </div>
      <FooterWordmark />
    </footer>
  );
}

/* ── Shared page helpers (inner pages inherit the new type system) ────────── */
export function SectionHead({ eyebrow, title, sub, align = 'center' }: { eyebrow: string; title: string; sub?: string; align?: 'center' | 'left' }) {
  return (
    <div className={`max-w-[680px] ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`} style={{ fontFamily: FONT }}>
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <Display as="h2" size="lg" className="text-gray-900">{title}</Display>
      {sub && <Lead className="mt-4">{sub}</Lead>}
    </div>
  );
}

/** Page hero used by inner marketing pages. */
export function PageHero({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: string; children?: React.ReactNode }) {
  return (
    <section className={`relative overflow-hidden border-b ${BORDER}`} style={{ fontFamily: FONT }}>
      <Mesh intensity={0.7} />
      <Container className="pb-14 pt-16 md:pb-20 md:pt-24">
        <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
        <Display as="h1" size="xl" className="max-w-[820px] text-gray-900">{title}</Display>
        {sub && <Lead className="mt-6 max-w-[620px]">{sub}</Lead>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}

/** Wraps an inner marketing page with header + footer. */
export function SitePage({ children, title }: { children: React.ReactNode; title?: string }) {
  React.useEffect(() => { if (title) document.title = `${title} · Zyphix`; window.scrollTo(0, 0); }, [title]);
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased" style={{ fontFamily: FONT }}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-[14.5px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.2)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(13,163,102,.35)]';
export const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 h-11 text-[14.5px] font-semibold tracking-[-0.01em] text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,.04)] transition hover:-translate-y-px hover:border-gray-300';
export const card = 'rounded-2xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]';
