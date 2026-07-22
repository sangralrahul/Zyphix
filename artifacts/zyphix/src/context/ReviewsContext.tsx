import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1..5
  text: string;
  createdAt: string;
};

interface ReviewsCtx {
  all: Review[];
  forProduct: (productId: string) => Review[];
  summary: (productId: string) => { avg: number; count: number };
  add: (r: Omit<Review, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
}

const Ctx = createContext<ReviewsCtx | null>(null);
const KEY = 'zyphix_reviews_v1';

const SEED: Review[] = [];

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [all, setAll] = useState<Review[]>(() => {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : SEED; } catch { return SEED; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
  }, [all]);

  const forProduct = useCallback((productId: string) => all.filter(r => r.productId === productId), [all]);

  const summary = useCallback((productId: string) => {
    const list = all.filter(r => r.productId === productId);
    if (!list.length) return { avg: 0, count: 0 };
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
    return { avg: Math.round(avg * 10) / 10, count: list.length };
  }, [all]);

  const add = useCallback((r: Omit<Review, 'id' | 'createdAt'>) => {
    setAll(prev => [{
      ...r,
      id: 'r_' + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const remove = useCallback((id: string) => setAll(prev => prev.filter(r => r.id !== id)), []);

  const value = useMemo<ReviewsCtx>(() => ({ all, forProduct, summary, add, remove }), [all, forProduct, summary, add, remove]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReviews() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useReviews must be used inside <ReviewsProvider>');
  return c;
}
