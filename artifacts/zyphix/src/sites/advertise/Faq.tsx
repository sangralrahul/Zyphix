import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Mail } from 'lucide-react';
import { G, HEAD_FONT, INK } from '@/components/layout/SiteChrome';
import { CONTAINER, Eyebrow, H2, PARTNERSHIPS_EMAIL, PARTNER_SITE } from './shared';

/* ────────────────────────────────────────────────────────────────────────────
   FAQ accordion + final CTA band.
──────────────────────────────────────────────────────────────────────────── */

const FAQ = [
  { q: 'Where can I advertise right now?', a: 'Zyphix is launching across India area by area. When you send a brief, partnerships replies with the neighbourhoods and cities where the app and partner stores are live today, and the ones opening next. Early advertisers get first choice of placements as new areas open.' },
  { q: 'How is pricing decided if there are no auctions?', a: 'Each placement has a flat rate for a period (7, 14 or 30 days) in one delivery area. Your quote is the sum of the placements, areas and periods you pick. It is written down before go-live and does not change mid-campaign, regardless of how many customers see it or tap it.' },
  { q: 'Do I need to be a Zyphix partner to advertise?', a: 'Not for banners, rows, spotlights, search or coupons — those promote products already stocked by partner stores. For a Featured placement in Eats or Book, your restaurant or service business must be a live, verified Zyphix partner so customers can actually order. Partner onboarding is free at partner.zyphix.in.' },
  { q: 'My product is not stocked by stores in the area. Can I still run a row or spotlight?', a: 'Rows and spotlights link to live inventory, so the SKU needs to be on at least one partner shelf in the area. If it is not, we can help you work out which partner stores to approach first and run a home banner in the meantime.' },
  { q: 'What counts as an "attributed order"?', a: 'An order placed by a customer who tapped your placement and bought the promoted product, dish or service in the same session, or redeemed your coupon. We do not count view-through conversions or orders from customers who never interacted with the placement.' },
  { q: 'How are sponsored placements shown to customers?', a: 'Every paid placement carries a visible "Sponsored" label. We cap sponsored content per screen, never remove organic results to make room for it, and reject creative that could be mistaken for a store\'s own listing. This keeps customers trusting the app, which is what makes the placement worth paying for.' },
  { q: 'What creative do I need to supply?', a: 'Usually one image to the spec shown under each format, a short headline and a CTA label. For rows and spotlights we also need the exact SKUs. Our team checks everything against the spec and local-language fit and suggests changes if needed; one revision round is included in every plan.' },
  { q: 'Can I target specific pin codes, or only whole cities?', a: 'Pin codes, sectors or a radius around specific partner stores — whichever matches how you distribute. A single delivery area is typically 4 to 8 pin codes. You can add or remove areas between periods without a new contract.' },
  { q: 'Can I change or cancel a campaign once it is live?', a: 'Creative swaps and daypart changes can be made during a run with one working day\'s notice. Areas and formats change between periods. If you need to stop a live placement early, unused full weeks are credited to your next booking.' },
  { q: 'Do agencies get different terms?', a: 'Agencies can book on behalf of multiple brands under one account, receive consolidated reports and invoices, and get a dedicated partnerships contact. Choose "Agency" in the form and we will set this up.' },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className={`${CONTAINER} scroll-mt-20 py-20 md:py-24`}>
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <H2>Questions advertisers ask first.</H2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">Not answered here? Partnerships replies to every email within 2 working days.</p>
          <a href={`mailto:${PARTNERSHIPS_EMAIL}`} className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-gray-900 hover:bg-gray-50"><Mail size={15} /> {PARTNERSHIPS_EMAIL}</a>
        </div>
        <div className="divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
                <span className="text-[15.5px] font-bold text-gray-900">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="-mt-1 px-6 pb-6 text-[14.5px] leading-relaxed text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className={`${CONTAINER} pb-20 md:pb-24`}>
      <div className="relative overflow-hidden rounded-[32px] px-8 py-12 text-white md:px-14 md:py-16" style={{ background: INK }}>
        <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(800px 400px at 90% 0%, rgba(13,163,102,.5), transparent 60%), radial-gradient(500px 300px at 0% 100%, rgba(249,115,22,.18), transparent 60%)' }} />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_.7fr]">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Early advertiser programme</p>
            <h2 className="mt-3 text-[2rem] font-black tracking-[-0.03em] leading-[1.06] md:text-[2.8rem]" style={{ fontFamily: HEAD_FONT }}>Be in the app when your neighbourhood opens.</h2>
            <p className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-white/70">Send a brief today and get a written plan, the live areas near you and a flat quote within 2 working days. First choice of placements goes to the advertisers already on the list.</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(13,163,102,.45)] transition hover:-translate-y-0.5" style={{ background: G }}>Talk to partnerships <ArrowRight size={17} /></a>
            <a href={PARTNER_SITE} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-[15px] font-bold text-white backdrop-blur transition hover:bg-white/15">Become a partner instead</a>
          </div>
        </div>
      </div>
    </section>
  );
}
