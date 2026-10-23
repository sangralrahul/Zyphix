import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Mail, BookOpen } from 'lucide-react';
import { SitePage, PageHero, btnSecondary, card, G, INK, HEAD_FONT } from '@/components/layout/SiteChrome';

/* ────────────────────────────────────────────────────────────────────────────
   Blog index — article data with soft green placeholder art (no remote images).
──────────────────────────────────────────────────────────────────────────── */

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
  featured?: boolean;
}

const POSTS: Post[] = [
  {
    slug: 'why-kirana-stores-are-indias-last-mile-advantage',
    category: 'Insights', catColor: '#065F46', catBg: '#D1FAE5',
    title: "Why Kirana Stores Are India’s Last-Mile Advantage",
    excerpt: "India has 12 million kirana stores — one of the densest retail networks on Earth. Here’s why we believe empowering them, not replacing them, is the winning strategy for hyperlocal delivery.",
    author: 'Rahul, Founder', date: '8 April 2025', readMin: 5, featured: true,
  },
  {
    slug: 'tier2-india-the-untapped-delivery-market',
    category: 'Market', catColor: '#1E40AF', catBg: '#DBEAFE',
    title: 'Tier-2 India: The Untapped Delivery Market Big Tech Missed',
    excerpt: "While Swiggy and Zomato focussed on metros, India’s 400+ Tier-2 cities with millions of urban residents have been underserved. We ran the numbers — and the opportunity is enormous.",
    author: 'Zyphix Research', date: '4 April 2025', readMin: 4,
  },
  {
    slug: '30-minutes-or-less-the-logistics-behind-quick-commerce',
    category: 'Operations', catColor: '#7C3AED', catBg: '#EDE9FE',
    title: '30 Minutes or Less: The Logistics Behind Quick Commerce',
    excerpt: 'Delivering groceries in half an hour requires more than fast riders. It demands warehouse placement, inventory intelligence, and route optimisation working in perfect sync.',
    author: 'Zyphix Team', date: '28 March 2025', readMin: 6,
  },
  {
    slug: 'zero-commission-myth-or-model',
    category: 'Business', catColor: '#EA580C', catBg: '#FFEDD5',
    title: 'Zero Commission: Myth or Viable Business Model?',
    excerpt: "Every delivery platform claims to be on the merchant’s side. We break down how Zyphix’s unit economics actually work — and why lower commissions are sustainable at scale.",
    author: 'Rahul, Founder', date: '20 March 2025', readMin: 7,
  },
  {
    slug: 'building-in-jk-lessons-from-tier-2',
    category: 'Story', catColor: '#065F46', catBg: '#D1FAE5',
    title: 'Building in Tier-2 India: Lessons from the Ground',
    excerpt: 'Connectivity challenges, seasonal demand swings, and a fiercely loyal local customer base. Building Zyphix for Tier-2 India has taught us things no MBA course could.',
    author: 'Zyphix Team', date: '12 March 2025', readMin: 5,
  },
  {
    slug: 'superlocal-vs-hyperlocal-whats-the-difference',
    category: 'Product', catColor: '#1E40AF', catBg: '#DBEAFE',
    title: "SuperLocal vs Hyperlocal: What’s the Difference?",
    excerpt: "Hyperlocal delivery is a means. SuperLocal is a philosophy — building the complete digital layer for a neighbourhood’s economy. Here’s how Zyphix thinks about it.",
    author: 'Zyphix Research', date: '5 March 2025', readMin: 4,
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];

/** Soft green gradient placeholder in place of cover images. */
function CoverArt({ post, className = '' }: { post: Post; className?: string }) {
  return (
    <div aria-hidden className={`relative overflow-hidden ${className}`} style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 55%, #A7F3D0 100%)' }}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40" />
      <div className="absolute -bottom-12 left-6 h-36 w-36 rounded-full bg-emerald-300/30" />
      <span className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-emerald-700"><BookOpen size={18} /></span>
      <span className="absolute bottom-5 left-5 text-[12px] font-bold uppercase tracking-wider text-emerald-800/70">{post.category}</span>
    </div>
  );
}

function CategoryBadge({ category, catColor, catBg }: Pick<Post, 'category' | 'catColor' | 'catBg'>) {
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: catColor, background: catBg }}>{category}</span>;
}

export function Blog() {
  const [cat, setCat] = useState('All');
  const featured = POSTS.find(p => p.featured)!;
  const rest = POSTS.filter(p => !p.featured && (cat === 'All' || p.category === cat));

  return (
    <SitePage title="Blog">
      <PageHero eyebrow="Zyphix blog" title="Stories from India's SuperLocal frontier." sub="Insights on kirana commerce, hyperlocal delivery and building for Tier-2 India." />

      <section className="mx-auto max-w-[1180px] px-5 py-16 md:py-20">
        {/* Featured */}
        {(cat === 'All' || featured.category === cat) && (
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className={`${card} grid overflow-hidden md:grid-cols-2`}>
            <CoverArt post={featured} className="min-h-[220px] md:min-h-[340px]" />
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">Featured</span>
                <CategoryBadge {...featured} />
              </div>
              <h2 className="mt-4 text-[1.5rem] font-black tracking-[-0.03em] leading-[1.15] text-gray-900 md:text-[1.9rem]" style={{ fontFamily: HEAD_FONT }}>{featured.title}</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-gray-600">{featured.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900">{featured.author}</p>
                  <p className="text-[12.5px] text-gray-500">{featured.date} · {featured.readMin} min read</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: G }}><ArrowRight size={17} /></span>
              </div>
            </div>
          </motion.article>
        )}

        {/* Filter + list */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[1.4rem] font-black tracking-tight text-gray-900" style={{ fontFamily: HEAD_FONT }}>Latest articles</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${cat === c ? 'border-transparent text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                style={cat === c ? { background: G } : undefined}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05, duration: .4 }}
              className={`${card} flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,32,.08)]`}>
              <CoverArt post={post} className="h-[150px]" />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <CategoryBadge {...post} />
                  <span className="flex items-center gap-1 text-[12px] text-gray-400"><Clock size={12} />{post.readMin} min</span>
                </div>
                <h3 className="mt-3 text-[17px] font-extrabold leading-snug tracking-tight text-gray-900">{post.title}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-gray-600 line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[12.5px] text-gray-500">{post.author} · {post.date}</p>
                  <ArrowRight size={15} style={{ color: G }} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        {rest.length === 0 && <p className="mt-6 text-[14px] text-gray-500">No more articles in this category yet.</p>}
      </section>

      {/* Contribute */}
      <section className="mx-auto max-w-[1180px] px-5 pb-20 md:pb-24">
        <div className="flex flex-col gap-6 rounded-[32px] p-8 text-white md:flex-row md:items-center md:justify-between md:p-12" style={{ background: INK }}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-400">Write for us</p>
            <h2 className="mt-3 text-[1.8rem] font-black tracking-[-0.03em] leading-[1.1] md:text-[2.2rem]" style={{ fontFamily: HEAD_FONT }}>Have a perspective on local commerce?</h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/65">We publish pieces on kirana commerce, logistics and building for India beyond the metros. Pitch us an idea.</p>
          </div>
          <a href="mailto:hello@zyphix.in?subject=Blog%20contribution" className={`${btnSecondary} shrink-0`}><Mail size={16} /> Contribute an article</a>
        </div>
      </section>
    </SitePage>
  );
}

export default Blog;
