import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type CartLine = {
  id: string;
  name: string;
  brand: string;
  price: number;
  origPrice: number | null;
  image: string;
  weight: string;
  qty: number;
};

type Snapshot = Omit<CartLine, 'qty'>;

interface CartCtx {
  items: CartLine[];
  qty: (id: string) => number;
  add: (p: Snapshot) => void;
  remove: (id: string) => void;
  setQty: (id: string, q: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'zyphix_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const qty = useCallback((id: string) => items.find(i => i.id === id)?.qty || 0, [items]);

  const add = useCallback((p: Snapshot) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === p.id);
      if (idx >= 0) {
        const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy;
      }
      return [...prev, { ...p, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx < 0) return prev;
      const copy = [...prev];
      if (copy[idx].qty <= 1) copy.splice(idx, 1);
      else copy[idx] = { ...copy[idx], qty: copy[idx].qty - 1 };
      return copy;
    });
  }, []);

  const setQty = useCallback((id: string, q: number) => {
    setItems(prev => {
      if (q <= 0) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: q } : i);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { totalItems, subtotal } = useMemo(() => ({
    totalItems: items.reduce((a, i) => a + i.qty, 0),
    subtotal: items.reduce((a, i) => a + i.price * i.qty, 0),
  }), [items]);

  return (
    <Ctx.Provider value={{ items, qty, add, remove, setQty, clear, totalItems, subtotal }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside <CartProvider>');
  return c;
}

/* ---- Order helpers (localStorage-based) ---- */
export type Order = {
  id: string;
  createdAt: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  couponCode?: string | null;
  couponDiscount?: number;   // ₹ off items
  walletUsed?: number;       // ₹ paid from wallet
  cashbackEarned?: number;   // ₹ credited back to wallet
  total: number;             // final ₹ paid via COD/Online
  address: { name: string; phone: string; line1: string; city: string; pincode: string; notes?: string };
  paymentMode: 'COD' | 'ONLINE';
  status: 'CONFIRMED';
  etaMinutes: number;
};

const ORDERS_KEY = 'zyphix_orders_v1';

export function saveOrder(o: Order) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const arr: Order[] = raw ? JSON.parse(raw) : [];
    arr.unshift(o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
  } catch {}
}

export function getOrder(id: string): Order | null {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const arr: Order[] = raw ? JSON.parse(raw) : [];
    return arr.find(o => o.id === id) || null;
  } catch { return null; }
}

export function listOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
