import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Same backend as zyphix.in (Cloudflare Worker + D1). */
export const API_BASE = 'https://zyphix.in';
/** Public (publishable) Supabase key used only to send the email OTP — same as the website. */
const SUPABASE_URL = 'https://awbccdtdszdxcxnsossy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YE-BT6c07paKhTvlCiItZw_Mm2k6z5A';

const TOKEN_KEY = 'zyphix.session';
let cachedToken: string | null | undefined;

export async function getToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;
  try {
    cachedToken = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(TOKEN_KEY);
  } catch { cachedToken = null; }
  return cachedToken;
}
export async function setToken(t: string | null) {
  cachedToken = t;
  if (Platform.OS === 'web') return;
  try {
    if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch { /* keychain unavailable — session lasts until app restart */ }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const token = await getToken();
  const { json, headers, ...rest } = init;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    method: rest.method ?? (json !== undefined ? 'POST' : 'GET'),
    headers: {
      accept: 'application/json',
      ...(json !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string> | undefined),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`);
  return data as T;
}

/** Sends the 6-digit code by email. Returns the verification token the server needs later. */
export async function sendOtp(email: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/email-otp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: SUPABASE_KEY, authorization: `Bearer ${SUPABASE_KEY}` },
    body: JSON.stringify({ action: 'send', email }),
  });
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok || !data?.success || !data?.token) throw new ApiError(res.status, data?.error ?? 'Could not send the code. Try again.');
  return data.token as string;
}

/* ── Types shared with the website/Worker ── */
export type Category = { name: string; icon?: string; color?: string; image?: string; sort?: number };
export type Product = {
  id: string; name: string; brand: string; price: number; origPrice: number | null; category: string;
  weight: string; image: string; tag?: string | null; storeName?: string; distance?: string; inStock?: boolean; imageStatus?: string;
};
export type User = { id: string; email: string; name: string; phone: string };
export type Address = {
  id: string; label: string; name: string; phone: string; line1: string; line2: string; city: string; pincode: string; isDefault: boolean;
};
export type OrderLine = { id: string; name: string; brand?: string; price: number; origPrice?: number | null; image?: string; weight?: string; qty: number };
export type Order = {
  id: string; createdAt: string; status: string; items: OrderLine[]; subtotal: number; deliveryFee: number; discount: number;
  total: number; paymentMode: string; address: Record<string, string>; etaMinutes: number;
};
export type Partner = { id: string; type: string; name: string; city: string; locality: string; category: string; tags: string; joinedAt: string };

/* ── Endpoints ── */
export const Api = {
  categories: () => api<Category[]>('/api/categories'),
  products: (p: { category?: string; q?: string; limit?: number; offset?: number } = {}) => {
    const qs = new URLSearchParams();
    if (p.category) qs.set('category', p.category);
    if (p.q) qs.set('q', p.q);
    qs.set('limit', String(p.limit ?? 60));
    if (p.offset) qs.set('offset', String(p.offset));
    return api<Product[]>(`/api/products?${qs.toString()}`);
  },
  product: (id: string) => api<Product>(`/api/products/${encodeURIComponent(id)}`),
  related: (id: string) => api<Product[]>(`/api/products/${encodeURIComponent(id)}/related`).catch(() => [] as Product[]),
  partners: (type: 'store' | 'restaurant' | 'service' | 'delivery') => api<Partner[]>(`/api/partners?type=${type}`).catch(() => [] as Partner[]),

  verify: (email: string, otp: string, token: string, name?: string) =>
    api<{ user: User; token: string }>('/api/auth/verify', { json: { email, otp, token, name, client: 'app' } }),
  logout: () => api('/api/auth/logout', { json: {} }).catch(() => null),
  me: () => api<{ user: User }>('/api/me').then(r => r.user),
  updateMe: (patch: { name?: string; phone?: string }) => api<{ user: User }>('/api/me', { method: 'PATCH', json: patch }).then(r => r.user),

  addresses: () => api<Address[]>('/api/me/addresses'),
  addAddress: (a: Partial<Address> & { line1: string }) => api<Address>('/api/me/addresses', { json: a }),
  updateAddress: (id: string, a: Partial<Address>) => api<Address>(`/api/me/addresses/${encodeURIComponent(id)}`, { method: 'PATCH', json: a }),
  deleteAddress: (id: string) => api(`/api/me/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  setDefault: (id: string) => api<Address[]>(`/api/me/addresses/${encodeURIComponent(id)}/default`, { json: {} }),

  createOrder: (o: Record<string, unknown>) => api<{ id: string; createdAt: string }>('/api/orders', { json: o }),
  order: (id: string) => api<Order>(`/api/orders/${encodeURIComponent(id)}`),
  myOrders: () => api<Order[]>('/api/me/orders'),
};
