import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Tag, BookOpen, TrendingUp, Users, Zap } from 'lucide-react';
import { ZyphixLogo } from '../components/ZyphixLogo';

const T1 = '#111827'; const T2 = '#6B7280'; const T3 = '#9CA3AF';
const G = '#0DA366'; const BD = '#E5E7EB'; const BG = '#F8F9FA'; const W = '#FFFFFF';

interface Post {
  slug: string;
  category: string;
  catColor: string;
  catBg: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readMin: number;
  cover: string;
  featured?: boolean;
}

const POSTS: Post[] = [
  {
    slug: 'why-kirana-stores-are-indias-last-mile-advantage',
    category: 'Insights',
    catColor: '#065F46',
    catBg: '#D1FAE5',
    title: "Why Kirana Stores Are India\u2019s Last-Mile Advantage",
    excerpt: "India has 12 million kirana stores \u2014 one of the densest retail networks on Earth. Here\u2019s why we believe empowering them, not replacing them, is the winning strategy for hyperlocal delivery.",
    author: 'Rahul, Founder',
    date: '8 April 2025',
    readMin: 5,
    cover: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&h=480&fit=crop&q=85',
    featured: true,
  },
  {
    slug: 'tier2-india-the-untapped-delivery-market',
    category: 'Market',
    catColor: '#1E40AF',
    catBg: '#DBEAFE',
    title: 'Tier-2 India: The Untapped Delivery Market Big Tech Missed',
    excerpt: "While Swiggy and Zomato focussed on metros, India\u2019s 400+ Tier-2 cities with millions of urban residents have been underserved. We ran the numbers \u2014 and the opportunity is enormous.",
    author: 'Zyphix Research',
    date: '4 April 2025',
    readMin: 4,
    cover: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&h=480&fit=crop&q=85',
  },
  {
    slug: '30-minutes-or-less-the-logistics-behind-quick-commerce',
    category: 'Operations',
    catColor: '#7C3AED',
    catBg: '#EDE9FE',
    title: '30 Minutes or Less: The Logistics Behind Quick Commerce',
    excerpt: 'Delivering groceries in half an hour requires more than fast riders. It demands warehouse placement, inventory intelligence, and route optimisation working in perfect sync.',
    author: 'Zyphix Team',
    date: '28 March 2025',
    readMin: 6,
    cover: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=900&h=480&fit=crop&q=85',
  },
  {
    slug: 'zero-commission-myth-or-model',
    category: 'Business',
    catColor: '#EA580C',
    catBg: '#FFEDD5',
    title: 'Zero Commission: Myth or Viable Business Model?',
    excerpt: "Every delivery platform claims to be on the merchant\u2019s side. We break down how Zyphix\u2019s unit economics actually work \u2014 and why lower commissions are sustainable at scale.",
    author: 'Rahul, Founder',
    date: '20 March 2025',
    readMin: 7,
    cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=480&fit=crop&q=85',
  },
  {
    slug: 'building-in-jk-lessons-from-tier-2',
    category: 'Story',
    catColor: '#065F46',
    catBg: '#D1FAE5',
    title: 'Building in Tier-2 India: Lessons from the Ground',
    excerpt: 'Connectivity challenges, seasonal demand swings, and a fiercely loyal local customer base. Building Zyphix for Tier-2 India has taught us things no MBA course could.',
    author: 'Zyphix Team',
    date: '12 March 2025',
    readMin: 5,
    cover: 'https://images.unsplash.com/photo-1598005044410-a9e13af61bfc?w=900&h=480&fit=crop&q=85',
  },
  {
    slug: 'superlocal-vs-hyperlocal-whats-the-difference',
    category: 'Product',
    catColor: '#1E40AF',
    catBg: '#DBEAFE',
    title: "SuperLocal vs Hyperlocal: What\u2019s the Difference?",
    excerpt: "Hyperlocal delivery is a means. SuperLocal is a philosophy \u2014 building the complete digital layer for a neighbourhood\u2019s economy. Here\u2019s how Zyphix thinks about it.",
    author: 'Zyphix Research',
    date: '5 March 2025',
    readMin: 4,
    cover: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=900&h=480&fit=crop&q=85',
  },
];

const STATS = [
  { Icon: BookOpen,   v: '6',    l: 'Articles published' },
  { Icon: Users,      v: '2K+',  l: 'Monthly readers' },
  { Icon: TrendingUp, v: 'Top 3', l: 'Topics: kirana, delivery, Tier-2 India' },
  { Icon: Zap,        v: 'Weekly', l: 'New posts' },
];

export function Blog() {
  const [hovered, setHovered] = useState<string | null>(null);
  const featured = POSTS.find(p => p.featured)!;
  const rest = POSTS.filter(p => !p.featured);

  const CategoryBadge = ({ category, catColor, catBg }: { category: string; catColor: string; catBg: string }) => (
    <span style={{ fontSize: 11, fontWeight: 700, color: catColor, background: catBg, padding: '3px 10px', borderRadius: 99, letterSpacing: '.03em', textTransform: 'uppercase' as const }}>{category}</span>
  );

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div style={{ background: W, borderBottom: `1px solid ${BD}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/"><ZyphixLogo size={30} ixColor={T1} /></Link>
          <Link href="/">
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: T2, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: W, cursor: 'pointer' }}>
              <ArrowLeft size={13} /> Back to Home
            </button>
          </Link>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, #064E3B 0%, #065F46 60%, #047857 100%)`, padding: '60px 24px 72px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: '#6EE7B7', letterSpacing: '.1em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Zyphix Blog</p>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', letterSpacing: '-.05em', lineHeight: 1.08, marginBottom: 14 }}>
            Stories from India's<br />SuperLocal frontier
          </h1>
          <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.6)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Insights on kirana commerce, hyperlocal delivery, and building for Tier-2 India.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: '-28px auto 0', padding: '0 24px 20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {STATS.map(({ Icon, v, l }, i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .06 }}
            style={{ background: W, borderRadius: 14, border: `1px solid ${BD}`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color={G} strokeWidth={2.2} />
            </div>
            <div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 15, color: T1, letterSpacing: '-.02em', lineHeight: 1.1 }}>{v}</p>
              <p style={{ fontSize: 11, color: T3, fontWeight: 500 }}>{l}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: W, borderRadius: 22, border: `1px solid ${BD}`, overflow: 'hidden', marginBottom: 32, cursor: 'pointer',
            transform: hovered === featured.slug ? 'translateY(-3px)' : 'none', transition: 'all .2s',
            boxShadow: hovered === featured.slug ? '0 8px 32px rgba(0,0,0,.12)' : '0 2px 12px rgba(0,0,0,.07)' }}
          onMouseEnter={() => setHovered(featured.slug)} onMouseLeave={() => setHovered(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <img src={featured.cover} alt={featured.title} style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '40px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: G, background: '#ECFDF5', padding: '3px 10px', borderRadius: 99, letterSpacing: '.06em', textTransform: 'uppercase' as const }}>✦ Featured</span>
                <CategoryBadge {...featured} />
              </div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(1.3rem,2.2vw,1.7rem)', color: T1, letterSpacing: '-.04em', lineHeight: 1.18, marginBottom: 14 }}>{featured.title}</h2>
              <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.72, marginBottom: 24 }}>{featured.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{featured.author}</p>
                  <p style={{ fontSize: 11.5, color: T3 }}>{featured.date} · {featured.readMin} min read</p>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={16} color="#fff" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: T1, letterSpacing: '-.03em', marginBottom: 18 }}>Latest articles</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {rest.map((post, i) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}
              style={{ background: W, borderRadius: 18, border: `1px solid ${BD}`, overflow: 'hidden', cursor: 'pointer',
                transform: hovered === post.slug ? 'translateY(-4px)' : 'none', transition: 'all .2s',
                boxShadow: hovered === post.slug ? '0 8px 28px rgba(0,0,0,.11)' : '0 1px 6px rgba(0,0,0,.05)' }}
              onMouseEnter={() => setHovered(post.slug)} onMouseLeave={() => setHovered(null)}>
              <img src={post.cover} alt={post.title} style={{ width: '100%', height: 168, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '18px 20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CategoryBadge {...post} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T3 }}><Clock size={10} />{post.readMin} min</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15.5, color: T1, letterSpacing: '-.03em', lineHeight: 1.28, marginBottom: 8 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: T2, lineHeight: 1.65, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{post.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 11.5, color: T3 }}>{post.author} · {post.date}</p>
                  <ArrowRight size={14} color={G} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginTop: 48, background: `linear-gradient(135deg, #064E3B, #047857)`, borderRadius: 22, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#fff', fontSize: '1.5rem', letterSpacing: '-.03em', marginBottom: 6 }}>Want to write for us?</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14 }}>Share your perspective on kirana commerce, logistics, or India's startup ecosystem.</p>
          </div>
          <a href="mailto:blog@zyphix.in" style={{ textDecoration: 'none' }}>
            <button style={{ background: W, color: '#065F46', fontSize: 14, fontWeight: 800, padding: '13px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              Contribute an article <ArrowRight size={15} />
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
