import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Order } from './api';

/**
 * Keeps a device copy of orders placed from this phone so the tracking screen
 * still works offline or if the order lookup fails.
 */
const key = (id: string) => `zyphix.order.${id}`;

export async function saveLocalOrder(o: Order) {
  try { await AsyncStorage.setItem(key(o.id), JSON.stringify(o)); } catch { /* best effort */ }
}

export async function getLocalOrder(id: string): Promise<Order | null> {
  try {
    const raw = await AsyncStorage.getItem(key(id));
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch { return null; }
}
