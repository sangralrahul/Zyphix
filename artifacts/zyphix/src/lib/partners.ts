import { useEffect, useState } from 'react';

export type PartnerType = 'store' | 'restaurant' | 'service' | 'delivery';
export type PartnerListing = {
  id: string; type: PartnerType; name: string; city: string; locality: string;
  category: string; tags: string; joinedAt: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';
const cache = new Map<string, PartnerListing[]>();

/** Live partner directory (registrations from the sign-up forms). Public fields only. */
export async function fetchPartners(type: PartnerType, city?: string): Promise<PartnerListing[]> {
  const key = `${type}|${city ?? ''}`;
  if (cache.has(key)) return cache.get(key)!;
  const q = new URLSearchParams({ type }); if (city) q.set('city', city);
  const res = await fetch(`${API_BASE}/api/partners?${q}`, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`partners ${res.status}`);
  const list = (await res.json()) as PartnerListing[];
  cache.set(key, list);
  return list;
}

export function usePartners(type: PartnerType, city?: string) {
  const [list, setList] = useState<PartnerListing[]>(() => cache.get(`${type}|${city ?? ''}`) ?? []);
  const [loading, setLoading] = useState(!cache.has(`${type}|${city ?? ''}`));
  useEffect(() => {
    let alive = true;
    fetchPartners(type, city).then(l => { if (alive) { setList(l); setLoading(false); } }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [type, city]);
  return { partners: list, loading };
}

export const tagList = (tags: string) => tags.split(',').map(t => t.trim()).filter(Boolean);
