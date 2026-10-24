import React, { useState } from 'react';
import { Link } from 'wouter';
import { Tag, Copy, Check, Zap, Users, ShoppingBag, Utensils, CalendarCheck, Store } from 'lucide-react';
import { offers } from '@/data/mockData';
import { FONT, IconTile } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

const OFFER_ICONS: Record<string, React.ReactNode> = {
  delivery: <Zap size={15} />,
  partner: <Users size={15} />,
};

const CATEGORIES = [
  { label: 'Grocery',  sub: 'Kirana and essentials', icon: <ShoppingBag size={16} />, href: '/now' },
  { label: 'Food',     sub: 'Restaurants and dhabas', icon: <Utensils size={16} />, href: '/eats' },
  { label: 'Services', sub: 'Home and personal', icon: <CalendarCheck size={16} />, href: '/book' },
  { label: 'Kirana',   sub: 'Stores near you', icon: <Store size={16} />, href: '/kirana-map' },
];

export function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <div className="flex items-baseline gap-3">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Offers</h1>
        <p className="text-[13px] text-gray-500">{offers.length} coupons</p>
      </div>

      {/* Categories */}
      <section className="mt-4">
        <h2 className="mb-3 text-[17px] font-semibold tracking-[-0.01em]">Browse by category</h2>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:gap-3">
          {CATEGORIES.map(c => (
            <Link key={c.label} href={c.href} className={`${card} flex items-center gap-3 px-3 py-2.5 no-underline transition hover:border-gray-300`}>
              <IconTile className="h-9 w-9 rounded-lg">{c.icon}</IconTile>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-semibold text-gray-900">{c.label}</span>
                <span className="block truncate text-[12px] text-gray-500">{c.sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Coupons */}
      <section className="mt-6">
        <h2 className="mb-3 text-[17px] font-semibold tracking-[-0.01em]">Coupons</h2>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:gap-3">
          {offers.map(offer => {
            const copied = copiedCode === offer.code;
            const icon = OFFER_ICONS[offer.type] ?? <Tag size={15} />;
            const meta = [
              offer.minOrder > 0 ? `Min order ₹${offer.minOrder}` : 'No minimum',
              offer.maxDiscount > 0 && offer.discount.includes('%') ? `Up to ₹${offer.maxDiscount}` : null,
            ].filter(Boolean).join(' · ');
            return (
              <div key={offer.code} className={`${card} flex items-center gap-3 p-3 transition ${copied ? 'border-emerald-500' : 'hover:border-gray-300'}`}>
                <IconTile className="h-9 w-9 rounded-lg">{icon}</IconTile>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11.5px] font-semibold tracking-wide text-emerald-700">{offer.code}</span>
                    <span className="text-[12px] text-gray-500">{offer.discount} off</span>
                  </div>
                  <p className="mt-1 truncate text-[13px] text-gray-900">{offer.description}</p>
                  <p className="text-[12px] text-gray-500">{meta}</p>
                </div>
                <button type="button" onClick={() => copyCode(offer.code)}
                  className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold transition ${copied ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-[#E6E8EC] bg-white text-gray-700 hover:border-gray-300'}`}>
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
