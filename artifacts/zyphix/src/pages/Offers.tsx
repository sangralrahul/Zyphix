import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, Ticket, Zap, Gift, Users, ArrowRight } from 'lucide-react';
import { offers } from '@/data/mockData';

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
  gradient: 'linear-gradient(135deg, #0D2040 0%, #0F1B35 100%)',
  glowColor: 'rgba(0,201,167,0.15)',
};

const OFFER_ICONS: Record<string, React.ReactNode> = {
  discount: <Tag className="h-5 w-5" />,
  delivery: <Zap className="h-5 w-5" />,
  referral: <Users className="h-5 w-5" />,
};

const OFFER_COLORS: Record<string, string> = {
  discount: '#00C9A7',
  delivery: '#F5A623',
  referral: '#A855F7',
};

const CATEGORIES = [
  { label: 'Grocery', icon: '🛒', deals: 12 },
  { label: 'Food', icon: '🍱', deals: 8 },
  { label: 'Services', icon: '📅', deals: 5 },
  { label: 'Kirana', icon: '🏪', deals: 15 },
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
      <div className="px-4 sm:px-8 lg:px-16 pt-6 pb-4"
        style={{ background: 'linear-gradient(180deg, rgba(165,85,247,0.06) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(165,85,247,0.15)', border: '1px solid rgba(165,85,247,0.3)' }}>
              <Tag className="h-6 w-6" style={{ color: '#A855F7' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Offers & Rewards</h1>
              <p className="text-sm" style={{ color: '#5A7A9A' }}>Save more on every order</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 pt-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Mega offer banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 cursor-pointer"
              style={{ background: MEGA_OFFER.gradient, border: '1px solid rgba(0,201,167,0.25)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 80% 50%, ${MEGA_OFFER.glowColor}, transparent 60%)` }} />
              <div className="absolute right-6 top-6 text-8xl opacity-10 pointer-events-none select-none">🏷️</div>
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
                  style={{ background: 'rgba(0,201,167,0.2)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.4)' }}>
                  🔥 {MEGA_OFFER.tag}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">{MEGA_OFFER.title}</h2>
                <p className="text-sm mb-5" style={{ color: '#5A7A9A' }}>{MEGA_OFFER.desc}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-base tracking-wider"
                    style={{ background: 'rgba(0,0,0,0.3)', color: '#00C9A7', border: '2px dashed rgba(0,201,167,0.5)' }}>
                    {MEGA_OFFER.code}
                  </div>
                  <button
                    onClick={() => copyCode(MEGA_OFFER.code)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: copiedCode === MEGA_OFFER.code ? '#00C9A7' : 'rgba(0,201,167,0.15)',
                      color: copiedCode === MEGA_OFFER.code ? '#0A0E1A' : '#00C9A7',
                      border: '1px solid rgba(0,201,167,0.4)',
                      boxShadow: copiedCode === MEGA_OFFER.code ? '0 4px 20px rgba(0,201,167,0.3)' : 'none',
                    }}>
                    {copiedCode === MEGA_OFFER.code ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Code</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Offer categories */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-4">
              <h2 className="text-xl font-black text-white">Browse by Category</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="rounded-2xl p-5 cursor-pointer group card-hover text-center"
                    style={{ background: '#0F1B35', border: '1px solid #1E3A6E' }}>
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                    <p className="font-bold text-white text-sm mb-0.5">{cat.label}</p>
                    <p className="text-[10px]" style={{ color: '#00C9A7' }}>{cat.deals} active deals</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Promo codes grid */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-5">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5A7A9A' }}>All Coupons</p>
              <h2 className="text-xl font-black text-white">Available Coupons</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => {
                const color = OFFER_COLORS[offer.type] || '#00C9A7';
                const icon = OFFER_ICONS[offer.type];
                return (
                  <motion.div key={offer.code} variants={fadeUp}>
                    <div
                      onClick={() => copyCode(offer.code)}
                      className="rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
                      style={{ background: '#0F1B35', border: `1px solid ${copiedCode === offer.code ? color : '#1E3A6E'}` }}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                        style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}0D, transparent 60%)` }} />
                      <div className="flex items-start gap-4 relative">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${color}20`, color }}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-base mb-1" style={{ color }}>{offer.code}</p>
                          <p className="text-sm text-white mb-3">{offer.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                              Valid till 31st Dec 2025
                            </span>
                            <button className="flex items-center gap-1 text-xs font-bold transition-colors"
                              style={{ color: copiedCode === offer.code ? '#00C9A7' : '#5A7A9A' }}>
                              {copiedCode === offer.code
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
            <div className="rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between"
              style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0F1B35 100%)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
                  🎁
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Refer Friends, Earn ₹100</h3>
                  <p className="text-sm" style={{ color: '#5A7A9A' }}>Share your code — you both get ₹100 credits when they order.</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shrink-0 transition-all hover:scale-105"
                style={{ background: '#A855F7', color: 'white', boxShadow: '0 4px 20px rgba(168,85,247,0.3)' }}>
                Share & Earn <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
