import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Copy, Check, Gift } from 'lucide-react';
import { usePromo } from '@/context/PromoContext';
import { COUPONS } from '@/data/coupons';
import { Button, FONT, IconTile } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

export function Wallet() {
  const { walletBalance, walletTxns, referralCode } = usePromo();
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    try { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="mx-auto w-full max-w-[880px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Wallet</h1>

      {/* Balance */}
      <div className={`${card} mt-4 flex items-center gap-3 p-4`}>
        <IconTile><WalletIcon size={18} /></IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-gray-500">Balance</p>
          <p className="text-[24px] font-semibold leading-tight tracking-[-0.01em] tabular-nums">₹{walletBalance.toLocaleString('en-IN')}</p>
          <p className="mt-0.5 text-[12px] text-gray-500">Use up to 20% of any order · 2% cashback on every order</p>
        </div>
        <Button href="/now" size="sm" variant="secondary" className="hidden sm:inline-flex">Shop</Button>
      </div>

      {/* Referral */}
      <div className={`${card} mt-3 flex items-center gap-3 p-4`}>
        <IconTile className="h-9 w-9 rounded-lg"><Gift size={16} /></IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold">Referral code</p>
          <p className="text-[12px] text-gray-500">Share this code with friends</p>
        </div>
        <button type="button" onClick={copyRef}
          className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold tracking-wide transition ${copied ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-[#E6E8EC] bg-white text-gray-900 hover:border-gray-300'}`}>
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> {referralCode}</>}
        </button>
      </div>

      {/* Coupons */}
      <div className={`${card} mt-3 p-4`}>
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold">Coupons</p>
          <Button href="/now" size="sm" variant="secondary" className="!h-8">Apply in cart</Button>
        </div>
        <div className="mt-3 divide-y divide-gray-100 rounded-lg border border-[#E6E8EC]">
          {COUPONS.map(c => (
            <div key={c.code} className="flex items-center gap-3 px-3 py-2.5">
              <span className="shrink-0 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11.5px] font-semibold tracking-wide text-emerald-700">{c.code}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{c.title}</p>
                <p className="truncate text-[12px] text-gray-500">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className={`${card} mt-3 p-4`}>
        <p className="text-[14px] font-semibold">Activity</p>
        {walletTxns.length === 0 ? (
          <p className="mt-3 rounded-lg bg-[#FAFAFA] px-3 py-6 text-center text-[13px] text-gray-500">No wallet activity yet.</p>
        ) : (
          <div className="mt-2 divide-y divide-gray-100">
            {walletTxns.map(t => {
              const credit = t.type === 'CREDIT';
              return (
                <div key={t.id} className="flex items-center gap-3 py-2.5">
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${credit ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-600'}`}>
                    {credit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{t.reason}</p>
                    <p className="truncate text-[12px] text-gray-500">{new Date(t.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}{t.orderId ? ` · ${t.orderId}` : ''}</p>
                  </div>
                  <span className={`text-[13.5px] font-semibold tabular-nums ${credit ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {credit ? '+' : '−'}₹{t.amount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
