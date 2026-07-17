import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Utensils, Store, Bike, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

const PARTNERS = [
  {
    icon: Utensils,
    badge: '🍽️ Restaurant Partner',
    title: 'List your\nrestaurant.',
    sub: 'Reach thousands of hungry customers near you. Set your own menu, hours, and prices.',
    perks: ['Zero commission for first 3 months', 'Real-time order dashboard', 'Dedicated account manager'],
    cta: 'Join as Restaurant',
    href: '/restaurant-setup',
    bg: 'linear-gradient(160deg, #1a0a00 0%, #3b1200 60%, #7c2d00 100%)',
    accent: '#FF6435',
    accentLight: 'rgba(255,100,53,0.18)',
    borderColor: 'rgba(255,100,53,0.25)',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    footerNote: 'Be first in your city',
  },
  {
    icon: Store,
    badge: '🏪 Kirana / Merchant Partner',
    title: 'Sell from\nyour store.',
    sub: 'Your kirana, supermarket or shop — digitised overnight. Accept online orders, manage inventory, grow fast.',
    perks: ['Free onboarding & setup', '30-min hyperlocal delivery network', 'Weekly payouts, zero hidden fees'],
    cta: 'Join as Merchant',
    href: '/merchant-setup',
    bg: 'linear-gradient(160deg, #001a0c 0%, #002d18 60%, #004d28 100%)',
    accent: '#0DA366',
    accentLight: 'rgba(13,163,102,0.18)',
    borderColor: 'rgba(13,163,102,0.25)',
    img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
    footerNote: '200+ categories · Live across India',
  },
  {
    icon: Bike,
    badge: '🛵 Delivery Partner',
    title: 'Earn on\nyour schedule.',
    sub: 'Ride when you want, earn what you deserve. Join India\'s fastest growing hyperlocal delivery fleet.',
    perks: ['₹800–₹1,500/day potential', 'Flexible hours, no targets', 'Fuel & accident insurance'],
    cta: 'Join as Delivery Partner',
    href: '/delivery-setup',
    bg: 'linear-gradient(160deg, #00091a 0%, #001233 60%, #002966 100%)',
    accent: '#3B82F6',
    accentLight: 'rgba(59,130,246,0.18)',
    borderColor: 'rgba(59,130,246,0.25)',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    footerNote: 'Bike · Bicycle · Auto · Car',
  },
];

export function PartnerLanding() {
  return (
    <div style={{ minHeight: '100vh', background: '#060A14', fontFamily: "'Inter', sans-serif" }}>

      {/* Back nav */}
      <div style={{ padding: '20px 24px 0', maxWidth: 1280, margin: '0 auto' }}>
        <Link href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'color .15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
          <ChevronLeft size={15} />Back to home
        </Link>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '52px 24px 48px', maxWidth: 760, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,163,102,0.12)', border: '1px solid rgba(13,163,102,0.25)', borderRadius: 999, padding: '6px 18px', marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0DA366', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0DA366', letterSpacing: '.06em' }}>NOW ONBOARDING ACROSS INDIA</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-.04em', margin: '0 0 18px' }}>
            Grow your business<br />
            <span style={{ color: '#0DA366' }}>with ZYPHIX.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            India's fastest-growing hyperlocal network. Join as a restaurant, kirana store, or delivery partner and reach customers in 30 minutes.
          </p>
        </motion.div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {PARTNERS.map(({ icon: Icon, badge, title, sub, perks, cta, href, bg, accent, accentLight, borderColor, img, footerNote }, i) => (
          <motion.div key={badge}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.45, ease: [.22, 1, .36, 1] }}
            whileHover={{ y: -4 }}
            style={{ borderRadius: 24, overflow: 'hidden', border: `1px solid ${borderColor}`, boxShadow: `0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 ${borderColor}`, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative' }}>

            {/* Image with overlay */}
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              <img src={img} alt={badge} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: bg, opacity: 0.82 }} />
              {/* Badge pill */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: `1px solid ${borderColor}`, borderRadius: 999, padding: '5px 14px' }}>
                <Icon size={13} color={accent} strokeWidth={2.5} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', letterSpacing: '.03em' }}>{badge.split(' ').slice(1).join(' ')}</span>
              </div>
              {/* ZYPHIX watermark */}
              <div style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-.03em', border: '1px solid rgba(255,255,255,0.12)' }}>
                //
              </div>
              {/* Title overlaid on image */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 0' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: '#fff', margin: 0, lineHeight: 1.15, letterSpacing: '-.03em', whiteSpace: 'pre-line' }}>
                  {title}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div style={{ background: bg, padding: '16px 20px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: '0 0 18px' }}>{sub}</p>

              {/* Perks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22 }}>
                {perks.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <CheckCircle2 size={14} color={accent} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', fontWeight: 600, lineHeight: 1.45 }}>{p}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <Link href={href}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 14, background: accent, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', transition: 'opacity .15s, transform .15s', marginBottom: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}>
                {cta} <ArrowRight size={15} />
              </Link>

              {/* Footer note */}
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', textAlign: 'center', margin: '12px 0 20px', fontWeight: 600 }}>
                {footerNote}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom strip */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          Questions? WhatsApp us at{' '}
          <a href="https://wa.me/919682394363" target="_blank" rel="noopener noreferrer"
            style={{ color: '#0DA366', fontWeight: 700, textDecoration: 'none' }}>
            +91 96823 94363
          </a>
        </p>
      </div>
    </div>
  );
}
