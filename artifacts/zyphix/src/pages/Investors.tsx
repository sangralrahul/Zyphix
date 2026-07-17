import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, TrendingUp, MapPin, Users, Zap,
  Package, BadgeCheck, Building, Globe, BarChart3, Mail
} from 'lucide-react';
import { ZyphixLogo } from '../components/ZyphixLogo';

const T1 = '#111827'; const T2 = '#6B7280'; const T3 = '#9CA3AF';
const G = '#0DA366'; const G2 = '#0A8C58'; const BD = '#E5E7EB'; const BG = '#F8F9FA'; const W = '#FFFFFF';

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay, duration: .45 } });

export function Investors() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div style={{ background: W, borderBottom: `1px solid ${BD}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/"><ZyphixLogo size={30} ixColor={T1} /></Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a href="mailto:investors@zyphix.in" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: W, padding: '7px 16px', borderRadius: 9, background: G, border: 'none', cursor: 'pointer' }}>
                <Mail size={13} /> Request Deck
              </button>
            </a>
            <Link href="/">
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: T2, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: W, cursor: 'pointer' }}>
                <ArrowLeft size={13} /> Back
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0B1829 0%, #0F2340 60%, #0A1F38 100%)', padding: '80px 24px 90px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 25% 40%, rgba(13,163,102,.15) 0%, transparent 55%), radial-gradient(circle at 75% 70%, rgba(37,99,235,.1) 0%, transparent 55%)' }} />
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,163,102,.15)', border: '1px solid rgba(13,163,102,.3)', borderRadius: 99, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: G, display: 'block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6EE7B7', letterSpacing: '.06em', textTransform: 'uppercase' as const }}>Investor Relations</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', color: '#fff', letterSpacing: '-.055em', lineHeight: 1.05, marginBottom: 20 }}>
            Building India's<br /><span style={{ background: 'linear-gradient(135deg,#34D399,#0DC268)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SuperLocal</span> Commerce Layer
          </h1>
          <p style={{ fontSize: 16.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.72, maxWidth: 580, margin: '0 auto 36px' }}>
            Zyphix by Clavix Technologies is the only hyperlocal delivery platform purpose-built for Tier-2 India and beyond — combining 30-minute grocery delivery, food delivery, and kirana digitisation in one superapp.
          </p>
          <a href="mailto:investors@zyphix.in" style={{ textDecoration: 'none' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
              style={{ background: G, color: '#fff', fontSize: 15, fontWeight: 800, padding: '14px 32px', borderRadius: 13, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              Request Investor Deck <ArrowRight size={16} />
            </motion.button>
          </a>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 60 }}>
          {[
            { v: '₹7.2L Cr', l: 'India quick-commerce TAM by 2030', color: G,         bg: '#ECFDF5' },
            { v: '12M+',    l: 'Kirana stores awaiting digitisation', color: '#2563EB', bg: '#EFF6FF' },
            { v: '500+',    l: 'Waitlist signups before launch',       color: '#7C3AED', bg: '#F5F3FF' },
            { v: '0',       l: 'Surge pricing. Ever.',                  color: '#EA580C', bg: '#FFF7ED' },
          ].map(({ v, l, color, bg }, i) => (
            <motion.div key={l} {...fade(i * .07)}
              style={{ background: W, border: `1px solid ${BD}`, borderRadius: 20, padding: '28px 24px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 8 }}>{v}</p>
              <p style={{ fontSize: 12.5, color: T2, lineHeight: 1.5 }}>{l}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 60 }}>
          <motion.div {...fade()} style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '36px 36px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.55rem', color: T1, letterSpacing: '-.04em', marginBottom: 8 }}>The Problem</h2>
            <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.75, marginBottom: 16 }}>
              Swiggy, Zepto, and Blinkit have penetrated 8–10 metro cities and ignored the rest of India. Over 400 Tier-2 and Tier-3 cities with 300 million urban consumers have no reliable quick-commerce option.
            </p>
            <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.75 }}>
              Meanwhile, local kirana stores — the backbone of neighbourhood retail — are losing customers to online platforms that don't include them at all.
            </p>
          </motion.div>

          <motion.div {...fade(.08)} style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '36px 36px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.55rem', color: T1, letterSpacing: '-.04em', marginBottom: 8 }}>Our Solution</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { Icon: Zap,        text: 'ZyphixNow: 30-min grocery delivery from local kirana stores' },
                { Icon: Package,    text: 'ZyphixEats: Food delivery from restaurants and dhabas' },
                { Icon: Building,   text: 'Partner dashboard: Free digital storefront for local businesses' },
                { Icon: BadgeCheck, text: 'Zero surge pricing and lowest merchant commission in market' },
              ].map(({ Icon, text }) => (
                <li key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon size={14} color={G} strokeWidth={2.3} />
                  </div>
                  <p style={{ fontSize: 14, color: T2, lineHeight: 1.6 }}>{text}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div {...fade()} style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '36px 36px', marginBottom: 60, boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.55rem', color: T1, letterSpacing: '-.04em', marginBottom: 28 }}>Business Model</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { title: 'Delivery Fee',      desc: '₹20–40 per order, waived for early access members.', pct: '45%', color: G },
              { title: 'Merchant Commission', desc: '8–12% vs 18–25% charged by competitors.',       pct: '30%', color: '#2563EB' },
              { title: 'ZyphixPlus',        desc: 'Monthly subscription for free delivery & priority.', pct: '15%', color: '#7C3AED' },
              { title: 'Ads & Promotions',  desc: 'Sponsored placements and hyperlocal ad network.',   pct: '10%', color: '#EA580C' },
            ].map(({ title, desc, pct, color }) => (
              <div key={title} style={{ background: BG, borderRadius: 16, padding: '20px 18px', border: `1px solid ${BD}` }}>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.6rem', color, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 6 }}>{pct}</p>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: T1, marginBottom: 6 }}>{title}</p>
                <p style={{ fontSize: 12.5, color: T2, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade()} style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '36px 36px', marginBottom: 60, boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.55rem', color: T1, letterSpacing: '-.04em', marginBottom: 28 }}>Market Opportunity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { Icon: Globe,      label: 'Total Addressable Market', v: '₹7.2L Cr', sub: 'India quick-commerce TAM by 2030 (Redseer)', color: G, bg: '#ECFDF5' },
              { Icon: MapPin,     label: 'Serviceable Market (India)', v: '₹1.2L Cr',  sub: 'Annual grocery + food market in Tier-2+ India', color: '#2563EB', bg: '#EFF6FF' },
              { Icon: BarChart3,  label: 'Year-1 Revenue Target',    v: '₹2.4 Cr',  sub: 'Based on 500 daily orders at ₹450 AOV', color: '#7C3AED', bg: '#F5F3FF' },
            ].map(({ Icon, label, v, sub, color, bg }) => (
              <div key={label} style={{ background: BG, borderRadius: 16, padding: '22px 20px', border: `1px solid ${BD}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={18} color={color} strokeWidth={2.1} />
                </div>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: T3, textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.7rem', color, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: 4 }}>{v}</p>
                <p style={{ fontSize: 12, color: T2, lineHeight: 1.5 }}>{sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade()} style={{ background: W, border: `1px solid ${BD}`, borderRadius: 22, padding: '36px 36px', marginBottom: 60, boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.55rem', color: T1, letterSpacing: '-.04em', marginBottom: 28 }}>Founding Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { name: 'Rahul', role: 'Founder & CEO', bio: "Building Clavix Technologies with a vision to digitise India\u2019s neighbourhood economy. Previously worked in tech & logistics across Tier-2 India.", initials: 'R', color: G, bg: '#ECFDF5' },
              { name: 'Tech Team', role: 'Engineering',   bio: "Full-stack engineers specialising in React, Node.js, and mobile-first architecture for Tier-2 connectivity environments.", initials: 'T', color: '#2563EB', bg: '#EFF6FF' },
              { name: 'Operations', role: 'Ops & Logistics', bio: "Ground operations team with deep knowledge of India\u2019s city networks, store ecosystems, and last-mile delivery infrastructure.", initials: 'O', color: '#7C3AED', bg: '#F5F3FF' },
            ].map(({ name, role, bio, initials, color, bg }) => (
              <div key={name} style={{ background: BG, borderRadius: 18, padding: '24px 22px', border: `1px solid ${BD}` }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: `2px solid ${color}30` }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 20, color }}>{initials}</span>
                </div>
                <p style={{ fontWeight: 800, fontSize: 15, color: T1, marginBottom: 3 }}>{name}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{role}</p>
                <p style={{ fontSize: 13, color: T2, lineHeight: 1.65 }}>{bio}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade()}
          style={{ background: 'linear-gradient(135deg, #0B1829 0%, #0F2340 100%)', borderRadius: 24, padding: '52px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6EE7B7', letterSpacing: '.08em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Ready to invest?</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing: '-.04em', marginBottom: 8, lineHeight: 1.1 }}>Let's build India's SuperLocal<br />economy together.</p>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, maxWidth: 480, lineHeight: 1.6 }}>
              We're raising a pre-seed round. Our investor deck, financial model, and cap table are available under NDA. Contact us to schedule a call.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <a href="mailto:investors@zyphix.in" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                style={{ background: G, color: '#fff', fontSize: 14.5, fontWeight: 800, padding: '14px 30px', borderRadius: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}>
                <Mail size={15} /> investors@zyphix.in
              </motion.button>
            </a>
            <a href="https://wa.me/919682394363?text=Hi%20Rahul%2C%20I%27m%20interested%20in%20investing%20in%20Zyphix." target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontWeight: 700, padding: '13px 30px', borderRadius: 13, border: '1px solid rgba(255,255,255,.18)', cursor: 'pointer', width: '100%' }}>
                WhatsApp Rahul →
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
