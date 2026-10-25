import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Two carts, like the website: groceries (Zyphix Now) and food (Zyphix Eats, one restaurant at a time).
 * Persisted on the device so a cart survives closing the app.
 */
export type Line = { id: string; name: string; brand?: string; price: number; origPrice?: number | null; image?: string; weight?: string; qty: number };
export type Kind = 'now' | 'eats';
type State = { now: Line[]; eats: Line[]; eatsRestaurant: { id: string; name: string } | null };

type CartCtx = State & {
  qty: (kind: Kind, id: string) => number;
  add: (kind: Kind, item: Omit<Line, 'qty'>, restaurant?: { id: string; name: string }) => void;
  remove: (kind: Kind, id: string) => void;
  clear: (kind: Kind) => void;
  count: (kind: Kind) => number;
  subtotal: (kind: Kind) => number;
  savings: (kind: Kind) => number;
};

const KEY = 'zyphix.cart.v1';
const EMPTY: State = { now: [], eats: [], eatsRestaurant: null };
const Ctx = createContext<CartCtx | null>(null);
const tap = () => { if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {}); };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(raw => { if (raw) try { setState({ ...EMPTY, ...JSON.parse(raw) }); } catch {} }).finally(() => setLoaded(true));
  }, []);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, [state, loaded]);

  const add = useCallback<CartCtx['add']>((kind, item, restaurant) => {
    tap();
    setState(s => {
      let base = s;
      // Food comes from one kitchen per order — switching restaurant starts a new food cart.
      if (kind === 'eats' && restaurant && s.eatsRestaurant && s.eatsRestaurant.id !== restaurant.id) base = { ...s, eats: [], eatsRestaurant: restaurant };
      const list = base[kind];
      const hit = list.find(l => l.id === item.id);
      const next = hit ? list.map(l => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l)) : [...list, { ...item, qty: 1 }];
      return { ...base, [kind]: next, ...(kind === 'eats' && restaurant ? { eatsRestaurant: restaurant } : {}) };
    });
  }, []);

  const remove = useCallback<CartCtx['remove']>((kind, id) => {
    tap();
    setState(s => {
      const next = s[kind].flatMap(l => (l.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []));
      return { ...s, [kind]: next, ...(kind === 'eats' && next.length === 0 ? { eatsRestaurant: null } : {}) };
    });
  }, []);

  const clear = useCallback((kind: Kind) => setState(s => ({ ...s, [kind]: [], ...(kind === 'eats' ? { eatsRestaurant: null } : {}) })), []);

  const value = useMemo<CartCtx>(() => ({
    ...state,
    add, remove, clear,
    qty: (k, id) => state[k].find(l => l.id === id)?.qty ?? 0,
    count: k => state[k].reduce((a, l) => a + l.qty, 0),
    subtotal: k => state[k].reduce((a, l) => a + l.price * l.qty, 0),
    savings: k => state[k].reduce((a, l) => a + Math.max(0, (l.origPrice ?? l.price) - l.price) * l.qty, 0),
  }), [state, add, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}

/** Delivery fee rules (same as the website: free from ₹149 for groceries). */
export function deliveryFee(kind: Kind, subtotal: number, restaurantFee = 0) {
  if (kind === 'now') return subtotal >= 149 || subtotal === 0 ? 0 : 25;
  return restaurantFee;
}
