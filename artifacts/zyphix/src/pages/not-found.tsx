import { Link } from 'wouter';
import { ArrowRight, Home, Store, UtensilsCrossed, Mail } from 'lucide-react';
import { SitePage, btnPrimary, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   404 — page not found. Light, uses the shared site chrome.
──────────────────────────────────────────────────────────────────────────── */

const LINKS = [
  { icon: <Home size={20} />, t: 'Home', d: 'Back to zyphix.in', href: '/' },
  { icon: <Store size={20} />, t: 'Zyphix Now', d: 'Groceries & essentials', href: '/now' },
  { icon: <UtensilsCrossed size={20} />, t: 'Zyphix Eats', d: 'Food from local restaurants', href: '/eats' },
  { icon: <Mail size={20} />, t: 'Contact', d: 'Talk to the Zyphix team', href: '/contact' },
];

export default function NotFound() {
  return (
    <SitePage title="Page not found">
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 420px at 15% -10%, rgba(13,163,102,.14), transparent 60%), radial-gradient(700px 380px at 95% 10%, rgba(249,115,22,.08), transparent 60%)' }} />
        <div className="mx-auto max-w-[1180px] px-5 pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">Error 404</p>
            <h1 className="mt-3 font-black tracking-[-0.04em] leading-[1.02] text-[2.8rem] sm:text-[3.6rem] lg:text-[4.2rem]" style={{ fontFamily: HEAD_FONT, color: INK }}>
              Page not found.
            </h1>
            <p className="mt-5 text-[16.5px] leading-relaxed text-gray-600">
              The page you're looking for doesn't exist, was moved, or the link is wrong. Here are a few places to go instead.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/" className={btnPrimary} style={{ background: G }}>Go to homepage <ArrowRight size={16} /></Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-[900px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} className="group rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.10)]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{l.icon}</span>
                <h3 className="mt-4 text-[16px] font-extrabold text-gray-900">{l.t}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-gray-600">{l.d}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-emerald-700">Open <ArrowRight size={14} className="transition group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SitePage>
  );
}
