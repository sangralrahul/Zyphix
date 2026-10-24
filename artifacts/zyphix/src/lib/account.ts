/**
 * Zyphix accounts — typed client for the Worker's /api/auth, /api/me and /api/orders
 * routes. Every call sends the `zsid` session cookie (credentials: 'include'), which the
 * Worker sets for .zyphix.in so one sign-in works on now., eats., book. and auth.zyphix.in.
 */
import type { Order } from '@/context/CartContext';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

export type AccountUser = { id: string; email: string; name: string; phone: string };
export type SavedAddress = {
  id: string; label: string; name: string; phone: string; line1: string; line2: string;
  city: string; pincode: string; isDefault: boolean; createdAt?: string;
};
export type AddressInput = Partial<Omit<SavedAddress, 'id' | 'createdAt'>> & { line1: string };
export type RemoteOrder = {
  id: string; createdAt: string; status: string; items: Order['items']; subtotal: number; deliveryFee: number;
  discount: number; total: number; paymentMode: string; address: Partial<Order['address']>; etaMinutes: number;
  email: string | null; userId: string | null;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { accept: 'application/json', ...(init.body ? { 'content-type': 'application/json' } : {}), ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({})) as any;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? `request failed (${res.status})`);
  return data as T;
}
const post = <T,>(path: string, body: unknown, method = 'POST') => call<T>(path, { method, body: JSON.stringify(body) });

/* ── session ── */

/** Current user from the session cookie, or null when signed out (never throws). */
export async function me(): Promise<AccountUser | null> {
  try { return (await call<{ user: AccountUser }>('/api/me')).user; } catch { return null; }
}

/** Server-side OTP check: the Worker verifies with the email-otp function and sets the session cookie. */
export async function verifyOtp(input: { email: string; otp: string; token: string; name?: string }): Promise<AccountUser> {
  return (await post<{ user: AccountUser }>('/api/auth/verify', input)).user;
}

export async function logout(): Promise<void> {
  try { await post('/api/auth/logout', {}); } catch { /* cookie is cleared client-side regardless */ }
}

export async function updateProfile(patch: { name?: string; phone?: string }): Promise<AccountUser> {
  return (await post<{ user: AccountUser }>('/api/me', patch, 'PATCH')).user;
}

/* ── addresses ── */

export const listAddresses = () => call<SavedAddress[]>('/api/me/addresses');
export const addAddress = (a: AddressInput) => post<SavedAddress>('/api/me/addresses', a);
export const updateAddress = (id: string, a: Partial<AddressInput>) => post<SavedAddress>(`/api/me/addresses/${encodeURIComponent(id)}`, a, 'PATCH');
export const deleteAddress = (id: string) => call<{ success: boolean }>(`/api/me/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' });
export const setDefaultAddress = (id: string) => post<SavedAddress[]>(`/api/me/addresses/${encodeURIComponent(id)}/default`, {});

/* ── orders ── */

/** Stores an order (guest or signed-in). Returns the server id/createdAt. */
export const createOrder = (order: Order) => post<{ id: string; createdAt: string }>('/api/orders', order);
export const myOrders = () => call<RemoteOrder[]>('/api/me/orders');
export async function getOrderRemote(id: string): Promise<RemoteOrder | null> {
  try { return await call<RemoteOrder>(`/api/orders/${encodeURIComponent(id)}`); } catch { return null; }
}

/** Shape a server order like the local `Order` type so existing UI can render it. */
export function toLocalOrder(r: RemoteOrder): Order {
  const a = r.address ?? {};
  return {
    id: r.id, createdAt: r.createdAt, items: r.items ?? [], subtotal: r.subtotal, deliveryFee: r.deliveryFee,
    couponDiscount: r.discount, total: r.total,
    address: { name: a.name ?? '', phone: a.phone ?? '', line1: a.line1 ?? '', city: a.city ?? '', pincode: a.pincode ?? '', notes: a.notes },
    paymentMode: r.paymentMode === 'ONLINE' ? 'ONLINE' : 'COD', status: 'CONFIRMED', etaMinutes: r.etaMinutes,
  };
}

/* ── auth site URL ── */

export const AUTH_SITE = 'https://auth.zyphix.in';

const isZyphixHost = (h: string) => h === 'zyphix.in' || h.endsWith('.zyphix.in');

/**
 * Where to send a visitor to sign in. On production hosts that is auth.zyphix.in with
 * `next` set to the page to return to; on localhost / preview hosts the same app renders
 * the auth site via `?site=auth`, so we stay on the current origin.
 */
export function authUrl(next?: string): string {
  if (typeof window === 'undefined') return `${AUTH_SITE}/`;
  const target = next ?? window.location.href;
  const host = window.location.hostname.toLowerCase();
  if (isZyphixHost(host)) return `${AUTH_SITE}/?next=${encodeURIComponent(target)}`;
  return `${window.location.origin}/?site=auth&next=${encodeURIComponent(target)}`;
}

/** Only allow redirects back to https://*.zyphix.in or the current origin. */
export function safeNext(raw: string | null | undefined, fallback = 'https://zyphix.in/account'): string {
  if (!raw) return fallback;
  try {
    const u = new URL(raw, typeof window !== 'undefined' ? window.location.origin : AUTH_SITE);
    const sameOrigin = typeof window !== 'undefined' && u.origin === window.location.origin;
    if (sameOrigin || (u.protocol === 'https:' && isZyphixHost(u.hostname))) return u.toString();
  } catch { /* fall through */ }
  return fallback;
}
