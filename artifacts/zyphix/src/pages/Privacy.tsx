import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Shield } from 'lucide-react';

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

export function Privacy() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: W, borderBottom: `1px solid ${BD}`, padding: '0 0 0 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/">
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: T3, padding: '7px 12px', borderRadius: 8, border: `1px solid ${BD}`, background: W }}>
              <ArrowLeft size={14} /> Back to Home
            </button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(13,163,102,.08)', border: '1px solid rgba(13,163,102,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color={G} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '2rem', color: T1, letterSpacing: '-.04em', marginBottom: 4 }}>Privacy Policy</h1>
            <p style={{ fontSize: 13, color: T3 }}>Last updated: 11 April 2025 · Effective: 11 April 2025</p>
          </div>
        </div>

        <div style={{ background: 'rgba(13,163,102,.05)', border: '1px solid rgba(13,163,102,.18)', borderRadius: 14, padding: '16px 20px', marginBottom: 36, display: 'flex', gap: 12 }}>
          <Shield size={18} color={G} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13.5, color: '#065F46', lineHeight: 1.6 }}>
            <strong>Your privacy matters.</strong> Zyphix Technologies Pvt. Ltd. ("Zyphix", "we", "us") is committed to protecting your personal data. This policy explains what we collect, how we use it, and your rights.
          </p>
        </div>

        <div style={{ background: W, borderRadius: 20, border: `1px solid ${BD}`, padding: '36px 40px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <Section title="1. Information We Collect">
            <p><strong>Account Information:</strong> Name, email address, phone number, and profile photo when you register.</p>
            <p style={{ marginTop: 10 }}><strong>Location Data:</strong> Your delivery address and, with your permission, real-time GPS location to find nearby stores and track deliveries.</p>
            <p style={{ marginTop: 10 }}><strong>Order History:</strong> Products ordered, restaurants visited, services booked, and transaction details.</p>
            <p style={{ marginTop: 10 }}><strong>Device Information:</strong> IP address, browser type, operating system, and app version for analytics and security.</p>
            <p style={{ marginTop: 10 }}><strong>Payment Information:</strong> We do not store full card numbers. Payments are processed securely via PCI-DSS compliant partners (Razorpay/Stripe).</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Fulfilling your grocery, food, and service orders',
                'Sending real-time delivery tracking and notifications',
                'Processing payments and issuing refunds',
                'Personalising your experience and recommendations',
                'Sending promotional offers (you may opt out anytime)',
                'Detecting and preventing fraud and abuse',
                'Improving our platform through aggregate analytics',
                'Complying with Indian legal and regulatory obligations',
              ].map(i => <li key={i} style={{ display: 'flex', gap: 10 }}><span style={{ color: G, fontWeight: 700, flexShrink: 0 }}>✓</span>{i}</li>)}
            </ul>
          </Section>

          <Section title="3. Sharing Your Data">
            <p>We do not sell your personal data. We share information only with:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Delivery Partners:</strong> Name and delivery address to complete your order.</li>
              <li><strong>Partner Stores / Restaurants:</strong> Order details necessary for fulfilment.</li>
              <li><strong>Payment Processors:</strong> Transaction data for secure payment processing.</li>
              <li><strong>Government Authorities:</strong> When required by law, court order, or regulatory demand.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>We retain your account data for as long as your account is active, plus 5 years after deletion as required under Indian tax and business laws. Order data is retained for 7 years per GST regulations. You may request deletion of non-legally-required data anytime.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>Under the Digital Personal Data Protection Act, 2023 (India), you have the right to:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Erase your data (subject to legal retention obligations)</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Nominate another person to exercise your rights on your behalf</li>
            </ul>
            <p style={{ marginTop: 10 }}>To exercise these rights, email us at <a href="mailto:privacy@zyphix.in" style={{ color: G, fontWeight: 600 }}>privacy@zyphix.in</a>. We will respond within 72 hours.</p>
          </Section>

          <Section title="6. Cookies & Tracking">
            <p>We use essential cookies for authentication and session management, and optional analytics cookies (Google Analytics, Mixpanel) to improve our service. You may disable analytics cookies at any time through our cookie preferences centre.</p>
          </Section>

          <Section title="7. Security">
            <p>We implement industry-standard security including 256-bit TLS encryption in transit, AES-256 encryption at rest, two-factor authentication, regular penetration testing, and SOC 2 Type II compliant infrastructure. Despite these measures, no system is 100% secure — we encourage you to use a strong, unique password.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>Zyphix is not intended for users under 18 years of age. We do not knowingly collect personal data from minors. If we discover we have collected data from a child, we will delete it promptly. Please contact us at <a href="mailto:privacy@zyphix.in" style={{ color: G, fontWeight: 600 }}>privacy@zyphix.in</a> if you believe this has occurred.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or an in-app notification at least 7 days before the change takes effect. Continued use of Zyphix after the effective date constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>For privacy-related questions or to exercise your rights:</p>
            <div style={{ marginTop: 12, background: BG, borderRadius: 12, padding: '16px 18px', display: 'inline-block' }}>
              <p><strong>Data Protection Officer</strong></p>
              <p>Zyphix Technologies Pvt. Ltd.</p>
              <p>12th Floor, RMZ Infinity, Old Madras Road</p>
              <p>Bengaluru, Karnataka 560016, India</p>
              <p style={{ marginTop: 6 }}>Email: <a href="mailto:privacy@zyphix.in" style={{ color: G, fontWeight: 600 }}>privacy@zyphix.in</a></p>
              <p>Phone: <a href="tel:+918001234567" style={{ color: G, fontWeight: 600 }}>+91 800 123 4567</a></p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
