import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, FileText } from 'lucide-react';

const T1 = '#111827'; const T2 = '#374151'; const T3 = '#6B7280';
const G = '#0DA366'; const BD = '#E5E7EB'; const BG = '#F8F9FA'; const W = '#FFFFFF';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: T1, letterSpacing: '-.02em', marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${BD}` }}>{title}</h2>
      <div style={{ fontSize: 14.5, color: T2, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

export function Terms() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div style={{ background: W, borderBottom: `1px solid ${BD}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '16px 24px' }}>
          <Link href="/">
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: T3, padding: '7px 12px', borderRadius: 8, border: `1px solid ${BD}`, background: W }}>
              <ArrowLeft size={14} /> Back to Home
            </button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(13,163,102,.08)', border: '1px solid rgba(13,163,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color={G} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '2rem', color: T1, letterSpacing: '-.04em', marginBottom: 4 }}>Terms of Service</h1>
            <p style={{ fontSize: 13, color: T3 }}>Last updated: 11 April 2025 · Governing law: India</p>
          </div>
        </div>

        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 14, padding: '16px 20px', marginBottom: 36 }}>
          <p style={{ fontSize: 13.5, color: '#9A3412', lineHeight: 1.6 }}>
            <strong>Please read these Terms carefully.</strong> By accessing or using Zyphix, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
          </p>
        </div>

        <div style={{ background: W, borderRadius: 20, border: `1px solid ${BD}`, padding: '36px 40px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <Section title="1. Acceptance of Terms">
            <p>These Terms of Service ("Terms") constitute a legally binding agreement between you and Zyphix Technologies Pvt. Ltd. (CIN: U74999KA2024PTC001234), a company incorporated under the Companies Act 2013, having its registered office at 12th Floor, RMZ Infinity, Old Madras Road, Bengaluru 560016 ("Zyphix", "we", "us", "our").</p>
            <p style={{ marginTop: 10 }}>By registering, accessing, or using the Zyphix website, mobile application, or any associated service, you ("User", "you") agree to comply with and be bound by these Terms along with our Privacy Policy.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>To use Zyphix, you must be at least 18 years of age and capable of forming a legally binding contract under the Indian Contract Act, 1872. By using the platform, you represent that you meet these requirements.</p>
          </Section>

          <Section title="3. Our Services">
            <p>Zyphix provides a technology platform connecting users with:</p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>ZyphixNow:</strong> Grocery and essential items delivered in approximately 30 minutes from partner stores.</li>
              <li><strong>ZyphixEats:</strong> Food delivery from restaurants, dhabas, and cloud kitchens.</li>
            </ul>
            <p style={{ marginTop: 10 }}>Zyphix is a marketplace platform. We are not the seller of goods nor the employer of service professionals. Responsibility for product quality and service lies with the respective partner store or professional.</p>
          </Section>

          <Section title="4. Account Registration">
            <p>You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at <a href="mailto:support@zyphix.in" style={{ color: G, fontWeight: 600 }}>support@zyphix.in</a> if you suspect unauthorised access.</p>
          </Section>

          <Section title="5. Pricing, Payment & Taxes">
            <p>All prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise. Zyphix reserves the right to change prices at any time without prior notice. Payment must be made at the time of ordering via approved payment methods. We do not charge surge pricing.</p>
            <p style={{ marginTop: 10 }}>GST invoices are available for download in your order history within 24 hours of delivery.</p>
          </Section>

          <Section title="6. Cancellation & Refund Policy">
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Groceries (ZyphixNow):</strong> Orders may be cancelled within 2 minutes of placement at no charge. After preparation begins, cancellation charges may apply up to 100% of the order value.</li>
              <li><strong>Food (ZyphixEats):</strong> Orders confirmed by the restaurant cannot be cancelled. Refunds are issued if the restaurant cancels or if delivery is delayed beyond 60 minutes.</li>
              <li><strong>Refunds:</strong> Approved refunds are credited to your original payment method within 5–7 business days, or immediately to your Zyphix Wallet.</li>
            </ul>
          </Section>

          <Section title="7. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Use the platform for any unlawful purpose or in violation of any Indian law</li>
              <li>Place fraudulent orders or provide false information</li>
              <li>Attempt to reverse-engineer, scrape, or disrupt the platform</li>
              <li>Harass, threaten, or abuse delivery partners or service professionals</li>
              <li>Create multiple accounts to abuse promotional offers</li>
              <li>Use the platform to order prohibited or regulated substances</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content on Zyphix — including the logo, design, software, text, images, and trademarks — is the exclusive property of Zyphix Technologies Pvt. Ltd. and is protected under Indian and international intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, Zyphix's total liability for any claim arising from the use of our services shall not exceed the amount you paid for the specific order giving rise to the claim. Zyphix is not liable for indirect, incidental, special, or consequential damages including loss of profits, data, or goodwill.</p>
          </Section>

          <Section title="10. Governing Law & Dispute Resolution">
            <p>These Terms are governed by the laws of India. Any dispute arising from or in connection with these Terms shall first be attempted to be resolved amicably. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.</p>
            <p style={{ marginTop: 10 }}>For disputes under ₹10 lakh, we offer free online arbitration through our partner platform in compliance with the Arbitration and Conciliation Act, 1996.</p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. We will provide at least 7 days' notice of material changes via email or in-app notification. Your continued use after the effective date constitutes acceptance.</p>
          </Section>

          <Section title="12. Contact">
            <p>For any questions about these Terms:</p>
            <div style={{ marginTop: 12, background: BG, borderRadius: 12, padding: '16px 18px', display: 'inline-block' }}>
              <p><strong>Legal Department — Zyphix Technologies Pvt. Ltd.</strong></p>
              <p>Email: <a href="mailto:legal@zyphix.in" style={{ color: G, fontWeight: 600 }}>legal@zyphix.in</a></p>
              <p>Address: 12th Floor, RMZ Infinity, Old Madras Road, Bengaluru 560016</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
