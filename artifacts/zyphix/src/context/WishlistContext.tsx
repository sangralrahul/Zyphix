import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type WishItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  origPrice: number | null;
  image: string;
  weight: string;
  addedAt: string;
};

interface WishlistCtx {
  items: WishItem[];
  has: (id: string) => boolean;
  toggle: (item: Omit<WishItem, 'addedAt'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = 'zyphix_wishlist_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>(() => {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const has = useCallback((id: string) => items.some(i => i.id === id), [items]);

  const toggle = useCallback((item: Omit<WishItem, 'addedAt'>) => {
    setItems(prev => prev.some(i => i.id === item.id)
      ? prev.filter(i => i.id !== item.id)
      : [{ ...item, addedAt: new Date().toISOString() }, ...prev]
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistCtx>(() => ({
    items, has, toggle, remove, clear, count: items.length,
  }), [items, has, toggle, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return c;
}
