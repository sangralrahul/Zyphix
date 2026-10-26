import React, { useState } from 'react';
import { motion } from '@/lib/motion';
import { ArrowRight, Clock, Mail } from 'lucide-react';
import { Kicker, Reveal, GlowButton } from '@/ui/cinema';
import { Accent } from '@/ui/motion2';
import { landscape, type Photo } from '@/data/media';
import { InnerPage, InnerHero, Band, panel } from './home/Inner';
import { Display } from './home/shared';

/* ────────────────────────────────────────────────────────────────────────────
   Blog index — article list with photo covers and a category filter.
──────────────────────────────────────────────────────────────────────────── */

interface Post {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readMin: number;
  cover: Photo;
  featured?: boolean;
}

const POSTS: Post[] = [
  {
    slug: 'why-corner-stores-are-the-last-mile-advantage',
    category: 'Insights',
    title: 'Why Corner Stores Are the Last-Mile Advantage',
    excerpt: 'Neighbourhood stores already sit within walking distance of almost every home. Here is why we believe empowering them, not replacing them, is the winning strategy for local delivery.',
    author: 'Rahul, Founder', date: '8 April 2025', readMin: 5, featured: true,
    cover: landscape('shopOwner', 0),
  },
  {
    slug: 'beyond-the-big-cities-the-untapped-delivery-market',
    category: 'Market',
    title: 'Beyond the Big Cities: The Delivery Market Others Missed',
    excerpt: 'Quick commerce has focused on a handful of very large cities. Smaller cities and towns have the same appetite for convenience, and far fewer options.',
    author: 'Zyphix Research', date: '4 April 2025', readMin: 4,
    cover: landscape('city', 0),
  },
  {
    slug: '30-minutes-or-less-the-logistics-behind-quick-commerce',
    category: 'Operations',
    title: '30 Minutes or Less: The Logistics Behind Quick Commerce',
    excerpt: 'Delivering groceries in half an hour takes more than fast riders. It needs the right nearby store, live inventory and route planning working in sync.',
    author: 'Zyphix Team', date: '28 March 2025', readMin: 6,
    cover: landscape('rider', 0),
  },
  {
    slug: 'zero-commission-myth-or-model',
    category: 'Business',
    title: 'Zero Commission: Myth or Viable Business Model?',
    excerpt: 'Every delivery platform claims to be on the merchant’s side. We break down how Zyphix’s unit economics actually work, and why lower commissions are sustainable at scale.',
    author: 'Rahul, Founder', date: '20 March 2025', readMin: 7,
    cover: landscape('teamOffice', 0),
  },
  {
    slug: 'building-local-lessons-from-the-ground',
    category: 'Story',
    title: 'Building Local: Lessons from the Ground',
    excerpt: 'Patchy connectivity, seasonal demand swings and a fiercely loyal local customer base. Building Zyphix street by street has taught us things no course could.',
    author: 'Zyphix Team', date: '12 March 2025', readMin: 5,
    cover: landscape('produce', 1),
  },
  {
    slug: 'superlocal-vs-hyperlocal-whats-the-difference',
    category: 'Product',
    title: 'SuperLocal vs Hyperlocal: What’s the Difference?',
    excerpt: 'Hyperlocal delivery is a means. SuperLocal is a philosophy: building the complete digital layer for a neighbourhood’s economy. Here is how Zyphix thinks about it.',
    author: 'Zyphix Research', date: '5 March 2025', readMin: 4,
    cover: landscape('phone', 0),
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];

function Cover({ post, className = '' }: { post: Post; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <img src={post.cover.src} alt={post.cover.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" />
      <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{post.category}</span>
    </div>
  );
}

export function Blog() {
  const [cat, setCat] = useState('All');
  const featured = POSTS.find(p => p.featured)!;
  const rest = POSTS.filter(p => !p.featured && (cat === 'All' || p.category === cat));

  return (
    <InnerPage title="Blog">
      <InnerHero
        photo={landscape('produce', 0)}
        height="min-h-[60svh] md:min-h-[64svh]"
        kicker="Zyphix blog"
        parts={['Stories from the', { accent: 'SuperLocal', green: true }, 'frontier.']}
        sub="Notes on neighbourhood commerce, local delivery and building a SuperLocal app street by street."
      />

      <Band>
        {/* Featured */}
        {(cat === 'All' || featured.category === cat) && (
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className={`${panel} group grid overflow-hidden md:grid-cols-2`}>
            <Cover post={featured} className="min-h-[240px] md:min-h-[400px]" />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-100">Featured</span>
              <h2 className="mt-5 text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-gray-900 md:text-[36px]">{featured.title}</h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-gray-600">{featured.excerpt}</p>
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  <p className="text-[14px] font-semibold text-gray-900">{featured.author}</p>
                  <p className="text-[13px] text-gray-500">{featured.date} · {featured.readMin} min read</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0DA366] text-white transition-transform group-hover:translate-x-0.5"><ArrowRight size={17} /></span>
              </div>
            </div>
          </motion.article>
        )}

        {/* Filter + list */}
        <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[32px] font-semibold tracking-[-0.035em] text-gray-900 md:text-[40px]">Latest articles</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`h-10 rounded-full border px-4 text-[13.5px] font-medium transition ${cat === c ? 'border-transparent bg-[#05080E] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05, duration: .4 }}
              className={`${panel} group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(11,18,32,.2)]`}>
              <Cover post={post} className="aspect-[16/10]" />
              <div className="flex flex-1 flex-col p-6">
                <span className="flex items-center gap-1.5 text-[13px] text-gray-500"><Clock size={13} />{post.readMin} min read</span>
                <h3 className="mt-3 text-balance text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-gray-900">{post.title}</h3>
                <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.6] text-gray-600">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-[13px] text-gray-500">{post.author} · {post.date}</p>
                  <ArrowRight size={16} className="text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        {rest.length === 0 && <p className="mt-6 text-[15px] text-gray-500">No more articles in this category yet.</p>}
      </Band>

      {/* Contribute */}
      <Band tone="dark">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal><Kicker light>Write for us</Kicker></Reveal>
            <Reveal delay={0.05}><Display light>Have a perspective on <Accent green>local</Accent> commerce?</Display></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-white/65">We publish pieces on neighbourhood commerce, logistics and building beyond the biggest cities. Pitch us an idea.</p></Reveal>
          </div>
          <Reveal delay={0.15} className="shrink-0"><GlowButton href="mailto:hello@zyphix.in?subject=Blog%20contribution"><Mail size={17} /> Contribute an article</GlowButton></Reveal>
        </div>
      </Band>
    </InnerPage>
  );
}

export default Blog;
