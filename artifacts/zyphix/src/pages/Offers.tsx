import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, Zap, Users, ArrowRight } from 'lucide-react';
import { offers } from '@/data/mockData';

const G = '#0DA366';
const HEAD_FONT = "'Outfit', sans-serif";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const MEGA_OFFER = {
  code: 'ZYPHIX50',
  title: 'Flat 50% Off on First Grocery Order',
  desc: 'Valid on orders above ₹199. Max discount ₹100.',
  tag: 'MEGA DEAL',
};

const OFFER_ICONS: Record<string, React.ReactNode> = {
  discount: <Tag className="h-5 w-5" />,
  delivery: <Zap className="h-5 w-5" />,
  referral: <Users className="h-5 w-5" />,
};

const OFFER_STYLES: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  discount: { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', ring: 'border-emerald-400' },
  delivery: { bg: 'bg-orange-50',   text: 'text-orange-700',  border: 'border-orange-200',  ring: 'border-orange-400' },
  referral: { bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200',  ring: 'border-violet-400' },
};

const CATEGORIES = [
  { label: 'Grocery',  icon: '🛒', sub: 'Kirana & essentials' },
  { label: 'Food',     icon: '🍱', sub: 'Restaurants & dhabas' },
  { label: 'Services', icon: '📅', sub: 'Home & personal' },
  { label: 'Kirana',   icon: '🏪', sub: 'Stores near you' },
];

export function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="pb-24 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-200">
              <Tag className="h-6 w-6" style={{ color: G }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>Offers & Rewards</h1>
              <p className="text-sm text-gray-600">Save more on every order</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 pt-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Mega offer banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-[0_12px_40px_rgba(13,163,102,.25)]"
              style={{ background: `linear-gradient(145deg, ${G} 0%, #0A8C58 100%)` }}>
              <div className="absolute right-6 top-6 text-8xl opacity-15 pointer-events-none select-none">🏷️</div>
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-white/15 border border-white/30 text-white">
                  🔥 {MEGA_OFFER.tag}
                </div>
                <h2 className="text-2xl font-black tracking-[-0.03em] mb-2" style={{ fontFamily: HEAD_FONT }}>{MEGA_OFFER.title}</h2>
                <p className="text-sm mb-5 text-white/85">{MEGA_OFFER.desc}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-base tracking-wider bg-white/10 border-2 border-dashed border-white/60 text-white">
                    {MEGA_OFFER.code}
                  </div>
                  <button
                    onClick={() => copyCode(MEGA_OFFER.code)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${copiedCode === MEGA_OFFER.code ? 'bg-white text-emerald-700' : 'bg-white/15 border border-white/40 text-white hover:bg-white/25'}`}>
                    {copiedCode === MEGA_OFFER.code ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Code</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Offer categories */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-4">
              <h2 className="text-xl font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>Browse by Category</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="rounded-3xl p-5 cursor-pointer group text-center bg-white border border-gray-200 transition hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(11,18,32,.06)]">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                    <p className="font-bold text-gray-900 text-sm mb-0.5">{cat.label}</p>
                    <p className="text-[11px] text-gray-500">{cat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Promo codes grid */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-5">
              <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700 mb-1">All Coupons</p>
              <h2 className="text-xl font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>Available Coupons</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => {
                const s = OFFER_STYLES[offer.type] || OFFER_STYLES.discount;
                const icon = OFFER_ICONS[offer.type];
                const copied = copiedCode === offer.code;
                return (
                  <motion.div key={offer.code} variants={fadeUp}>
                    <div
                      onClick={() => copyCode(offer.code)}
                      className={`rounded-3xl p-5 cursor-pointer group relative overflow-hidden bg-white border transition hover:shadow-[0_8px_24px_rgba(11,18,32,.06)] ${copied ? s.ring : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4 relative">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.text}`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-black text-base mb-1 ${s.text}`} style={{ fontFamily: HEAD_FONT }}>{offer.code}</p>
                          <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                              Valid till 31st Dec 2025
                            </span>
                            <button className={`flex items-center gap-1 text-xs font-bold transition-colors ${copied ? 'text-emerald-700' : 'text-gray-500 group-hover:text-gray-900'}`}>
                              {copied
                                ? <><Check className="h-3.5 w-3.5" /> Copied</>
                                : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Refer & Earn CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between bg-white border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-violet-50 border border-violet-200">
                  🎁
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-[-0.02em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>Refer Friends, Earn ₹100</h3>
                  <p className="text-sm text-gray-600">Share your code — you both get ₹100 credits when they order.</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shrink-0 text-white transition hover:-translate-y-0.5 hover:opacity-95"
                style={{ background: G }}>
                Share & Earn <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
