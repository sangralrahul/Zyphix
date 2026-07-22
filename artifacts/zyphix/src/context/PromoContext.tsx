import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type WalletTxn = {
  id: string;
  createdAt: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  reason: string;
  orderId?: string;
};

interface PromoCtx {
  // Coupons
  appliedCoupon: string | null;
  applyCoupon: (code: string | null) => void;

  // Wallet
  walletBalance: number;
  walletTxns: WalletTxn[];
  useWalletAtCheckout: boolean;
  setUseWalletAtCheckout: (b: boolean) => void;
  creditWallet: (amount: number, reason: string, orderId?: string) => void;
  debitWallet: (amount: number, reason: string, orderId?: string) => void;

  // Order history flag (for first-order-only coupons)
  hasPreviousOrders: boolean;
  recordOrderPlaced: () => void;

  // Referral
  referralCode: string;
}

const Ctx = createContext<PromoCtx | null>(null);

const K_COUPON      = 'zyphix_coupon_v1';
const K_WALLET_BAL  = 'zyphix_wallet_bal_v1';
const K_WALLET_TXN  = 'zyphix_wallet_txn_v1';
const K_USE_WALLET  = 'zyphix_use_wallet_v1';
const K_HAS_ORDERS  = 'zyphix_has_orders_v1';
const K_SIGNUP_BON  = 'zyphix_signup_bonus_v1';
const K_REF_CODE    = 'zyphix_ref_code_v1';

const SIGNUP_BONUS = 50;

function readLS<T>(k: string, fallback: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function writeLS<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function makeRefCode() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZYP${rand}`;
}

export function PromoProvider({ children }: { children: React.ReactNode }) {
  const [appliedCoupon, setAppliedCoupon]       = useState<string | null>(() => readLS<string | null>(K_COUPON, null));
  const [walletBalance, setWalletBalance]       = useState<number>(() => readLS<number>(K_WALLET_BAL, 0));
  const [walletTxns, setWalletTxns]             = useState<WalletTxn[]>(() => readLS<WalletTxn[]>(K_WALLET_TXN, []));
  const [useWalletAtCheckout, setUseWalletAtCheckout] = useState<boolean>(() => readLS<boolean>(K_USE_WALLET, false));
  const [hasPreviousOrders, setHasPreviousOrders]     = useState<boolean>(() => readLS<boolean>(K_HAS_ORDERS, false));
  const [referralCode]                          = useState<string>(() => {
    const existing = readLS<string | null>(K_REF_CODE, null);
    if (existing) return existing;
    const fresh = makeRefCode();
    writeLS(K_REF_CODE, fresh);
    return fresh;
  });

  // Auto-credit sign-up bonus on first ever visit
  useEffect(() => {
    const bonusGiven = readLS<boolean>(K_SIGNUP_BON, false);
    if (!bonusGiven) {
      const txn: WalletTxn = {
        id: 'W' + Date.now().toString(36).toUpperCase(),
        createdAt: new Date().toISOString(),
        type: 'CREDIT',
        amount: SIGNUP_BONUS,
        reason: 'Welcome bonus 🎉',
      };
      setWalletBalance(SIGNUP_BONUS);
      setWalletTxns([txn]);
      writeLS(K_SIGNUP_BON, true);
    }
  }, []);

  useEffect(() => { writeLS(K_COUPON, appliedCoupon); }, [appliedCoupon]);
  useEffect(() => { writeLS(K_WALLET_BAL, walletBalance); }, [walletBalance]);
  useEffect(() => { writeLS(K_WALLET_TXN, walletTxns); }, [walletTxns]);
  useEffect(() => { writeLS(K_USE_WALLET, useWalletAtCheckout); }, [useWalletAtCheckout]);
  useEffect(() => { writeLS(K_HAS_ORDERS, hasPreviousOrders); }, [hasPreviousOrders]);

  const applyCoupon = useCallback((code: string | null) => {
    setAppliedCoupon(code ? code.trim().toUpperCase() : null);
  }, []);

  const pushTxn = useCallback((txn: WalletTxn) => {
    setWalletTxns(prev => [txn, ...prev].slice(0, 100));
  }, []);

  const creditWallet = useCallback((amount: number, reason: string, orderId?: string) => {
    if (amount <= 0) return;
    setWalletBalance(b => b + amount);
    pushTxn({
      id: 'W' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase(),
      createdAt: new Date().toISOString(), type: 'CREDIT', amount, reason, orderId,
    });
  }, [pushTxn]);

  const debitWallet = useCallback((amount: number, reason: string, orderId?: string) => {
    if (amount <= 0) return;
    setWalletBalance(b => Math.max(0, b - amount));
    pushTxn({
      id: 'W' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase(),
      createdAt: new Date().toISOString(), type: 'DEBIT', amount, reason, orderId,
    });
  }, [pushTxn]);

  const recordOrderPlaced = useCallback(() => setHasPreviousOrders(true), []);

  const value = useMemo(() => ({
    appliedCoupon, applyCoupon,
    walletBalance, walletTxns, useWalletAtCheckout, setUseWalletAtCheckout,
    creditWallet, debitWallet,
    hasPreviousOrders, recordOrderPlaced,
    referralCode,
  }), [appliedCoupon, applyCoupon, walletBalance, walletTxns, useWalletAtCheckout,
      creditWallet, debitWallet, hasPreviousOrders, recordOrderPlaced, referralCode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePromo() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePromo must be used inside <PromoProvider>');
  return v;
}

/** Max wallet ₹ usable on a given bill (up to 20% of grand). */
export function maxWalletUsable(grandBeforeWallet: number, balance: number) {
  return Math.min(balance, Math.floor(grandBeforeWallet * 0.2));
}

/** Cashback earned per order (2% of paid amount, min 0, max 100). */
export function cashbackFor(paidAmount: number) {
  return Math.min(100, Math.floor(paidAmount * 0.02));
}
