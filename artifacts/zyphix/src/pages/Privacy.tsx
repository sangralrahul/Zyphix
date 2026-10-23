import React from 'react';
import { Link } from 'wouter';
import { Shield, CheckCircle2 } from 'lucide-react';
import { SitePage, PageHero, G, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Privacy Policy — zyphix.in/privacy
   Light legal page: PageHero + sticky table of contents + prose in white cards.
──────────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'collect',   title: '1. Information We Collect' },
  { id: 'use',       title: '2. How We Use Your Information' },
  { id: 'sharing',   title: '3. Sharing Your Data' },
  { id: 'retention', title: '4. Data Retention' },
  { id: 'rights',    title: '5. Your Rights' },
  { id: 'cookies',   title: '6. Cookies & Tracking' },
  { id: 'security',  title: '7. Security' },
  { id: 'children',  title: "8. Children's Privacy" },
  { id: 'changes',   title: '9. Changes to This Policy' },
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

export function Privacy() {
  return (
    <SitePage title="Privacy Policy">
      <PageHero eyebrow="Legal" title="Privacy Policy" sub="How Zyphix collects, uses and protects your personal data — and the rights you have over it.">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-gray-600">
          <Shield size={14} className="text-emerald-600" /> Last updated: 11 April 2025 · Effective: 11 April 2025
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
            Questions? Email <a href="mailto:legal@zyphix.in" className={mail}>legal@zyphix.in</a> or read our <Link href="/terms" className={mail}>Terms of Service</Link>.
          </p>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-5">
          <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <Shield size={18} className="mt-0.5 shrink-0 text-emerald-700" />
            <p className="text-[14.5px] leading-relaxed text-emerald-900">
              <strong className="font-bold">Your privacy matters.</strong> Zyphix ("we", "us") is committed to protecting your personal data. This policy explains what we collect, how we use it, and your rights.
            </p>
          </div>

          <Section id="collect" title="1. Information We Collect">
            <p><strong>Account Information:</strong> Name, email address, phone number, and profile photo when you register.</p>
            <p><strong>Location Data:</strong> Your delivery address and, with your permission, real-time GPS location to find nearby stores and track deliveries.</p>
            <p><strong>Order History:</strong> Products ordered, restaurants visited, services booked, and transaction details.</p>
            <p><strong>Device Information:</strong> IP address, browser type, operating system, and app version for analytics and security.</p>
            <p><strong>Payment Information:</strong> We do not store full card numbers. Payments are processed securely via PCI-DSS compliant partners (Razorpay/Stripe).</p>
          </Section>

          <Section id="use" title="2. How We Use Your Information">
            <ul className="!list-none !pl-0">
              {[
                'Fulfilling your grocery, food, and service orders',
                'Sending real-time delivery tracking and notifications',
                'Processing payments and issuing refunds',
                'Personalising your experience and recommendations',
                'Sending promotional offers (you may opt out anytime)',
                'Detecting and preventing fraud and abuse',
                'Improving our platform through aggregate analytics',
                'Complying with Indian legal and regulatory obligations',
              ].map(i => (
                <li key={i} className="flex gap-2.5"><CheckCircle2 size={17} className="mt-[3px] shrink-0" style={{ color: G }} />{i}</li>
              ))}
            </ul>
          </Section>

          <Section id="sharing" title="3. Sharing Your Data">
            <p>We do not sell your personal data. We share information only with:</p>
            <ul>
              <li><strong>Delivery Partners:</strong> Name and delivery address to complete your order.</li>
              <li><strong>Partner Stores / Restaurants:</strong> Order details necessary for fulfilment.</li>
              <li><strong>Payment Processors:</strong> Transaction data for secure payment processing.</li>
              <li><strong>Government Authorities:</strong> When required by law, court order, or regulatory demand.</li>
            </ul>
          </Section>

          <Section id="retention" title="4. Data Retention">
            <p>We retain your account data for as long as your account is active, plus 5 years after deletion as required under Indian tax and business laws. Order data is retained for 7 years per GST regulations. You may request deletion of non-legally-required data anytime.</p>
          </Section>

          <Section id="rights" title="5. Your Rights">
            <p>Under the Digital Personal Data Protection Act, 2023 (India), you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Erase your data (subject to legal retention obligations)</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Nominate another person to exercise your rights on your behalf</li>
            </ul>
            <p>To exercise these rights, email us at <a href="mailto:privacy@zyphix.in" className={mail}>privacy@zyphix.in</a>. We will respond within 72 hours.</p>
          </Section>

          <Section id="cookies" title="6. Cookies & Tracking">
            <p>We use essential cookies for authentication and session management, and optional analytics cookies (Google Analytics, Mixpanel) to improve our service. You may disable analytics cookies at any time through our cookie preferences centre.</p>
          </Section>

          <Section id="security" title="7. Security">
            <p>We implement industry-standard security including 256-bit TLS encryption in transit, AES-256 encryption at rest, two-factor authentication, regular penetration testing, and SOC 2 Type II compliant infrastructure. Despite these measures, no system is 100% secure — we encourage you to use a strong, unique password.</p>
          </Section>

          <Section id="children" title="8. Children's Privacy">
            <p>Zyphix is not intended for users under 18 years of age. We do not knowingly collect personal data from minors. If we discover we have collected data from a child, we will delete it promptly. Please contact us at <a href="mailto:privacy@zyphix.in" className={mail}>privacy@zyphix.in</a> if you believe this has occurred.</p>
          </Section>

          <Section id="changes" title="9. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or an in-app notification at least 7 days before the change takes effect. Continued use of Zyphix after the effective date constitutes acceptance of the updated policy.</p>
          </Section>
        </div>
      </div>
    </SitePage>
  );
}

export default Privacy;
