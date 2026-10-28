import React from 'react';
import { Link } from 'wouter';
import { FileText, AlertTriangle } from 'lucide-react';
import { SitePage, PageHero, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Terms of Service — zyphix.in/terms
   Light legal page: PageHero + sticky table of contents + prose in white cards.
──────────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'acceptance',   title: '1. Acceptance of Terms' },
  { id: 'eligibility',  title: '2. Eligibility' },
  { id: 'services',     title: '3. Our Services' },
  { id: 'account',      title: '4. Account Registration' },
  { id: 'pricing',      title: '5. Pricing, Payment & Taxes' },
  { id: 'cancellation', title: '6. Cancellation & Refund Policy' },
  { id: 'conduct',      title: '7. Prohibited Conduct' },
  { id: 'ip',           title: '8. Intellectual Property' },
  { id: 'liability',    title: '9. Limitation of Liability' },
  { id: 'law',          title: '10. Governing Law & Dispute Resolution' },
  { id: 'changes',      title: '11. Changes to Terms' },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
      <h2 className="text-[20px] font-black tracking-[-0.02em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-[1.75] text-gray-600 [&_strong]:font-bold [&_strong]:text-gray-900 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc">
        {children}
      </div>
    </section>
  );
}

const mail = 'font-semibold text-emerald-700 hover:underline';

export function Terms() {
  return (
    <SitePage title="Terms of Service">
      <PageHero eyebrow="Legal" title="Terms of Service" sub="The agreement between you and Zyphix when you use our website, app and services.">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-gray-600">
          <FileText size={14} className="text-emerald-600" /> Last updated: 11 April 2025 · Governing law: India
        </span>
      </PageHero>

      <div className="mx-auto max-w-[1180px] px-5 py-12 md:py-16 grid gap-10 lg:grid-cols-[260px_1fr] items-start">
        {/* Table of contents */}
        <aside className="lg:sticky lg:top-24">
          <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700">On this page</p>
          <nav className="mt-4 rounded-2xl border border-gray-200 bg-white p-2">
            <ul className="space-y-0.5">
              {SECTIONS.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block rounded-xl px-3 py-2 text-[13.5px] font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-4 text-[13px] leading-relaxed text-gray-500">
            Questions? Email <a href="mailto:legal@zyphix.in" className={mail}>legal@zyphix.in</a> or read our <Link href="/privacy" className={mail}>Privacy Policy</Link>.
          </p>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-5">
          <div className="flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-orange-600" />
            <p className="text-[14.5px] leading-relaxed text-orange-900">
              <strong className="font-bold">Please read these Terms carefully.</strong> By accessing or using Zyphix, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </div>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>These Terms of Service ("Terms") constitute a legally binding agreement between you and Zyphix ("Zyphix", "we", "us", "our").</p>
            <p>By registering, accessing, or using the Zyphix website, mobile application, or any associated service, you ("User", "you") agree to comply with and be bound by these Terms along with our Privacy Policy.</p>
          </Section>

          <Section id="eligibility" title="2. Eligibility">
            <p>To use Zyphix, you must be at least 18 years of age and capable of forming a legally binding contract under the Indian Contract Act, 1872. By using the platform, you represent that you meet these requirements.</p>
          </Section>

          <Section id="services" title="3. Our Services">
            <p>Zyphix provides a technology platform connecting users with:</p>
            <ul>
              <li><strong>ZyphixNow:</strong> Grocery and essential items delivered in approximately 10 minutes from partner stores.</li>
              <li><strong>ZyphixEats:</strong> Food delivery from restaurants, dhabas, and cloud kitchens.</li>
            </ul>
            <p>Zyphix is a marketplace platform. We are not the seller of goods nor the employer of service professionals. Responsibility for product quality and service lies with the respective partner store or professional.</p>
          </Section>

          <Section id="account" title="4. Account Registration">
            <p>You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at <a href="mailto:support@zyphix.in" className={mail}>support@zyphix.in</a> if you suspect unauthorised access.</p>
          </Section>

          <Section id="pricing" title="5. Pricing, Payment & Taxes">
            <p>All prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise. Zyphix reserves the right to change prices at any time without prior notice. Payment must be made at the time of ordering via approved payment methods. We do not charge surge pricing.</p>
            <p>GST invoices are available for download in your order history within 24 hours of delivery.</p>
          </Section>

          <Section id="cancellation" title="6. Cancellation & Refund Policy">
            <ul>
              <li><strong>Groceries (ZyphixNow):</strong> Orders may be cancelled within 2 minutes of placement at no charge. After preparation begins, cancellation charges may apply up to 100% of the order value.</li>
              <li><strong>Food (ZyphixEats):</strong> Orders confirmed by the restaurant cannot be cancelled. Refunds are issued if the restaurant cancels or if delivery is delayed beyond 60 minutes.</li>
              <li><strong>Refunds:</strong> Approved refunds are credited to your original payment method within 5–7 business days, or immediately to your Zyphix Wallet.</li>
            </ul>
          </Section>

          <Section id="conduct" title="7. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any unlawful purpose or in violation of any Indian law</li>
              <li>Place fraudulent orders or provide false information</li>
              <li>Attempt to reverse-engineer, scrape, or disrupt the platform</li>
              <li>Harass, threaten, or abuse delivery partners or service professionals</li>
              <li>Create multiple accounts to abuse promotional offers</li>
              <li>Use the platform to order prohibited or regulated substances</li>
            </ul>
          </Section>

          <Section id="ip" title="8. Intellectual Property">
            <p>All content on Zyphix — including the logo, design, software, text, images, and trademarks — is the exclusive property of Zyphix and is protected under Indian and international intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.</p>
          </Section>

          <Section id="liability" title="9. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, Zyphix's total liability for any claim arising from the use of our services shall not exceed the amount you paid for the specific order giving rise to the claim. Zyphix is not liable for indirect, incidental, special, or consequential damages including loss of profits, data, or goodwill.</p>
          </Section>

          <Section id="law" title="10. Governing Law & Dispute Resolution">
            <p>These Terms are governed by the laws of India. Any dispute arising from or in connection with these Terms shall first be attempted to be resolved amicably. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.</p>
            <p>For disputes under ₹10 lakh, we offer free online arbitration through our partner platform in compliance with the Arbitration and Conciliation Act, 1996.</p>
          </Section>

          <Section id="changes" title="11. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. We will provide at least 7 days' notice of material changes via email or in-app notification. Your continued use after the effective date constitutes acceptance.</p>
          </Section>
        </div>
      </div>
    </SitePage>
  );
}

export default Terms;
