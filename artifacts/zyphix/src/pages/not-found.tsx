import { useNoIndex } from '@/lib/seo';
import { Link } from 'wouter';
import { ArrowRight, Home, Store, UtensilsCrossed, Mail } from 'lucide-react';
import { SitePage } from '@/components/layout/SiteChrome';
import { Button, IconTile } from '@/ui/kit';

/* ────────────────────────────────────────────────────────────────────────────
   404 — page not found. Light, uses the shared site chrome.
──────────────────────────────────────────────────────────────────────────── */

const LINKS = [
  { icon: <Home size={16} />, t: 'Home', d: 'Back to zyphix.in', href: '/' },
  { icon: <Store size={16} />, t: 'Zyphix Now', d: 'Groceries and essentials', href: '/now' },
  { icon: <UtensilsCrossed size={16} />, t: 'Zyphix Eats', d: 'Food from local restaurants', href: '/eats' },
  { icon: <Mail size={16} />, t: 'Contact', d: 'Talk to the Zyphix team', href: '/contact' },
];

export default function NotFound() {
  useNoIndex();
  return (
    <SitePage title="Page not found">
      <section className="mx-auto max-w-[1180px] px-4 pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-[520px] text-center">
          <p className="text-[13px] font-medium text-gray-500">404</p>
          <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-gray-900 sm:text-[34px]">Page not found</h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-gray-600">
            The page you're looking for doesn't exist, was moved, or the link is wrong.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/">Go to homepage <ArrowRight size={15} /></Button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[880px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="group flex items-center gap-3 rounded-xl border border-[#E6E8EC] bg-white px-3 py-3 no-underline transition hover:border-gray-300">
              <IconTile className="h-9 w-9 rounded-lg">{l.icon}</IconTile>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-gray-900">{l.t}</span>
                <span className="block truncate text-[12px] text-gray-500">{l.d}</span>
              </span>
              <ArrowRight size={14} className="shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-700" />
            </Link>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
