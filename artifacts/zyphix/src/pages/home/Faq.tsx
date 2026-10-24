import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, UtensilsCrossed, ShoppingBag, Mail } from 'lucide-react';
import { G, INK, HEAD_FONT, SectionHead } from '@/components/layout/SiteChrome';
import { CONTAINER, PHOTOS, fade } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion, final CTA band and the sticky mobile bottom CTA.
──────────────────────────────────────────────────────────────────────────── */

const FAQ = [
  { q: 'Where is Zyphix available?', a: 'We are onboarding stores, restaurants and professionals across India, neighbourhood by neighbourhood. Set your location in the app to see live partners near you. If we are not live in your area yet, join early access above and we will email you the moment we are.' },
  { q: 'Are prices the same as in the store?', a: 'Yes. Partners list their own shelf and menu prices and we do not mark them up. There is no surge pricing and no hidden handling or packaging charge. If a delivery fee applies to your order, it is shown on the checkout screen before you pay.' },
  { q: 'How do you deliver in 30 minutes?', a: 'Every order is fulfilled by a business within a few kilometres of you and carried by a delivery partner from the same area. Short distances, real inventory and a quick store-side packing flow are what make the 30-minute target possible — without building warehouses that compete with local shops.' },
  { q: 'What is the minimum order value?', a: 'Each store sets its own minimum, if any, and you will see it on the store page before you add items. Small orders are welcome — we would rather you order milk from the kirana than drive to it.' },
  { q: 'How do I pay?', a: 'UPI, debit and credit cards, net banking and popular wallets are supported online. Cash on delivery is available on eligible orders — the option is shown at checkout.' },
  { q: 'What if an item is missing, damaged or wrong?', a: 'Report it from the order screen within the app. Our support team verifies with the store and rider and issues a refund for the affected items to your original payment method or Zyphix wallet. For food orders, report within a few hours of delivery.' },
  { q: 'Can I schedule an order for later?', a: 'Yes. On checkout you can choose "deliver now" or pick a later slot during the store\'s opening hours — useful for the morning milk run or a weekend restock.' },
  { q: 'Are the service professionals on Zyphix Book verified?', a: 'Every professional completes ID verification, address proof and a background check before they receive the verified badge and can accept bookings. You can see the badge on their profile along with their service area.' },
  { q: 'How can my store, restaurant or service business join?', a: 'Apply at partner.zyphix.in or through the Partners section above. Applying is free, there is no joining fee, and an onboarding manager calls you within two working days to verify your business, help list your catalogue or menu and take you live.' },
  { q: 'Is there a Zyphix app?', a: 'Native iOS and Android apps are on the way. Until then everything works in your browser at zyphix.in — add it to your home screen for a full-screen, app-like experience, and join early access to hear when the apps launch.' },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className={`${CONTAINER} scroll-mt-20 pb-20 md:pb-24`}>
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <SectionHead align="left" eyebrow="FAQ" title="Questions, answered." sub="Everything you might want to know before your first order. Still stuck? Our support team reads every email." />
          <div className="mt-6 flex flex-col gap-2">
            <a href="mailto:support@zyphix.in" className="inline-flex items-center gap-2 text-[14px] font-bold text-gray-900 hover:text-emerald-700"><Mail size={15} className="text-emerald-700" /> support@zyphix.in</a>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-emerald-700">Contact page <ArrowRight size={14} /></Link>
          </div>
        </div>
        <motion.div {...fade(.05)} className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
                <span className="text-[15.5px] font-bold text-gray-900">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="-mt-1 px-6 pb-6 text-[14.5px] leading-relaxed text-gray-600">{f.a}</p>}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Final CTA band ───────────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden text-white" style={{ background: INK }}>
      <img src={PHOTOS.bag} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,18,32,.95) 0%, rgba(11,18,32,.75) 60%, rgba(11,18,32,.5) 100%)' }} />
      <div className={`${CONTAINER} relative grid items-center gap-8 py-20 md:grid-cols-[1.2fr_.8fr] md:py-24`}>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Ready when you are</p>
          <h2 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-[-0.035em] md:text-[3rem]" style={{ fontFamily: HEAD_FONT }}>Your neighbourhood is already on Zyphix.<br className="hidden md:block" /> Place your first order.</h2>
          <p className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-white/70">Groceries from the kirana, dinner from the dhaba, an electrician for the weekend — all from the people a few streets away.</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <Link href="/now" className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}><ShoppingBag size={17} /> Order groceries <ArrowRight size={16} /></Link>
          <Link href="/eats" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15"><UtensilsCrossed size={17} className="text-orange-400" /> Order food</Link>
          <Link href="/book" className="inline-flex items-center justify-center gap-1.5 text-[13.5px] font-bold text-white/70 hover:text-white">Or book a home service <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ── Sticky mobile CTA ────────────────────────────────────────────────────── */
export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-extrabold text-gray-900" style={{ fontFamily: HEAD_FONT }}>Groceries in ~30 min</p>
          <p className="truncate text-[11px] text-gray-500">Shelf prices · zero surge · local stores</p>
        </div>
        <Link href="/now" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-[14px] font-bold text-white" style={{ background: G }}>Order now <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}
