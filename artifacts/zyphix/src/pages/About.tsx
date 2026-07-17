import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Users, MapPin, Star, ArrowRight } from 'lucide-react';

import { motion } from 'framer-motion';
import { ZyphixLogo } from '../components/ZyphixLogo';

const T1 = '#111827'; const T2 = '#6B7280'; const T3 = '#9CA3AF';
const G = '#0DA366'; const G2 = '#0A8C58'; const BD = '#E5E7EB'; const BG = '#F8F9FA'; const W = '#FFFFFF';

export function About() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Navbar stub */}
      <div style={{ background: W, borderBottom: `1px solid ${BD}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <ZyphixLogo size={30} wordmarkColor={T1} wordmarkHighlight={G} />
          </Link>
          <Link href="/">
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: T2, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: W }}>
              <ArrowLeft size={13} /> Back
            </button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #064E3B, #065F46, #047857)`, padding: '72px 24px 80px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6EE7B7', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Our Story</p>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.4rem)', color: '#fff', letterSpacing: '-.05em', lineHeight: 1.06, marginBottom: 18, maxWidth: 700, margin: '0 auto 18px' }}>
            Built for India's<br />neighbourhood economy.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Zyphix started with a simple belief: your local kirana store, favourite dhaba, and trusted plumber deserve world-class technology.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/"><button style={{ background: W, color: G2, fontSize: 14, fontWeight: 800, padding: '12px 28px', borderRadius: 12 }}>Order Now →</button></Link>
            <a href="mailto:partnerships@zyphix.in"><button style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,.2)' }}>Partner with Us</button></a>
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 56 }}>
          {[
            { v: '2024', l: 'Founded', color: G },
            { v: '100+', l: 'Cities', color: '#7C3AED' },
            { v: '5 Lakh+', l: 'Customers', color: '#EA580C' },
            { v: '200+', l: 'Partner Stores', color: G },
          ].map(({ v, l, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}>
              <div style={{ background: W, border: `1px solid ${BD}`, borderRadius: 18, padding: '24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.9rem', color, letterSpacing: '-.04em', lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 12.5, color: T3, marginTop: 6 }}>{l}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 56 }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.9rem', color: T1, letterSpacing: '-.04em', marginBottom: 16 }}>Our mission</h2>
            <p style={{ fontSize: 15, color: T2, lineHeight: 1.75, marginBottom: 14 }}>India has 12 million kirana stores, 7.5 million food businesses, and millions of independent service professionals. They power our economy but lack the technology that large chains enjoy.</p>
            <p style={{ fontSize: 15, color: T2, lineHeight: 1.75, marginBottom: 14 }}>Zyphix gives every local business a digital storefront, smart inventory management, and access to customers at hyperlocal scale — while delivering the best prices and fastest service to you.</p>
            <p style={{ fontSize: 15, color: T2, lineHeight: 1.75 }}>We are the superapp for India's <em>SuperLocal</em> economy.</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=700&h=480&fit=crop&q=85" alt="Local store" style={{ width: '100%', borderRadius: 20, objectFit: 'cover', height: '100%', maxHeight: 340 }} />
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.9rem', color: T1, letterSpacing: '-.04em', marginBottom: 8 }}>What we stand for</h2>
          <p style={{ fontSize: 14.5, color: T2, marginBottom: 32 }}>Every decision we make is guided by four principles.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { em: '⚡', title: 'Speed without compromise', desc: '30-minute delivery is a promise, not a marketing line. Our operations are built around it.' },
              { em: '🤝', title: 'Partners first', desc: 'We charge zero onboarding fee and the lowest commission in the industry — so local businesses thrive.' },
              { em: '🛡️', title: 'Radical transparency', desc: 'No surge pricing. No hidden fees. The price you see is the price you pay, always.' },
              { em: '🌱', title: 'Sustainable growth', desc: 'We are committed to carbon-neutral deliveries by 2027 through electric vehicle partnerships.' },
            ].map(({ em, title, desc }) => (
              <div key={title} style={{ background: W, border: `1px solid ${BD}`, borderRadius: 18, padding: '24px 22px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{em}</span>
                <h3 style={{ fontWeight: 800, color: T1, fontSize: 15, marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: T2, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, #064E3B, #047857)`, borderRadius: 22, padding: '44px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: '1.6rem', letterSpacing: '-.03em', marginBottom: 6 }}>Want to partner with us?</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14 }}>List your store, restaurant, or services on Zyphix for free.</p>
          </div>
          <a href="mailto:partnerships@zyphix.in">
            <button style={{ background: W, color: G2, fontSize: 14, fontWeight: 800, padding: '13px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              Get in touch <ArrowRight size={15} />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
