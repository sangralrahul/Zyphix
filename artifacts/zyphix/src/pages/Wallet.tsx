import React, { useState } from 'react';
import { Link } from 'wouter';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Copy, Check, Gift, Sparkles } from 'lucide-react';
import { usePromo } from '@/context/PromoContext';
import { COUPONS } from '@/data/coupons';

const G = '#0DA366';
const G_LIGHT = 'rgba(13,163,102,0.08)';
const G_BORDER = 'rgba(13,163,102,0.25)';

export function Wallet() {
  const { walletBalance, walletTxns, referralCode } = usePromo();
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    try { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '80vh', paddingBottom: 60 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '20px 4px' }}>

        {/* Balance card */}
        <div style={{
          background: `linear-gradient(135deg, ${G} 0%, #0A8C58 100%)`,
          borderRadius: 20, padding: 24, color: '#fff', boxShadow: '0 10px 30px rgba(13,163,102,.35)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.9, fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            <WalletIcon size={14} /> Zyphix Wallet
          </div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 40, marginTop: 6 }}>₹{walletBalance}</div>
          <div style={{ fontSize: 12.5, opacity: 0.9 }}>Use up to 20% of any order · Earn 2% cashback</div>
        </div>

        {/* Referral */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16, marginTop: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: G_LIGHT, color: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gift size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', fontSize: 14.5 }}>Refer &amp; Earn</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Share your code · You both get ₹50 on their first order</div>
          </div>
          <button onClick={copyRef}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', background: '#fff', border: `1.5px dashed ${G_BORDER}`, borderRadius: 10, color: G, fontWeight: 800, cursor: 'pointer', fontSize: 12.5 }}>
            {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> {referralCode}</>}
          </button>
        </div>

        {/* Available coupons */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16, marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={16} color={G} />
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', fontSize: 15 }}>Available Coupons</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {COUPONS.map(c => (
              <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1.5px dashed ${G_BORDER}`, borderRadius: 12, padding: 12, background: G_LIGHT }}>
                <div style={{ background: G, color: '#fff', fontWeight: 900, padding: '6px 10px', borderRadius: 8, fontSize: 12, letterSpacing: 0.5 }}>{c.code}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: 13.5 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: '#4B5563' }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/now">
            <a style={{ display: 'block', textAlign: 'center', marginTop: 12, padding: '11px', background: G, color: '#fff', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
              Shop &amp; Apply Coupons
            </a>
          </Link>
        </div>

        {/* Transactions */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: 16, padding: 16, marginTop: 14 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, color: '#111827', fontSize: 15, marginBottom: 10 }}>Recent Activity</div>
          {walletTxns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF', fontSize: 13 }}>No wallet activity yet.</div>
          ) : (
            walletTxns.map(t => (
              <div key={t.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px dashed #F3F4F6', alignItems: 'center' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.type === 'CREDIT' ? G_LIGHT : '#FEF2F2', color: t.type === 'CREDIT' ? G : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.type === 'CREDIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: 13.5 }}>{t.reason}</div>
                  <div style={{ fontSize: 11.5, color: '#6B7280' }}>{new Date(t.createdAt).toLocaleString()}{t.orderId ? ` · ${t.orderId}` : ''}</div>
                </div>
                <div style={{ fontWeight: 900, color: t.type === 'CREDIT' ? G : '#EF4444', fontFamily: "'Outfit',sans-serif" }}>
                  {t.type === 'CREDIT' ? '+' : '−'}₹{t.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
