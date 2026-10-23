/**
 * Catalog data source for Zyphix Now.
 * Loads products + categories from the Worker API (/api/*, backed by D1 + R2).
 * Falls back to the bundled mockData if the API is unreachable (local dev, outages),
 * so the page never renders empty.
 */
import { useEffect, useState } from 'react';

export type Product = {
  id: string; name: string; brand: string; price: number; origPrice: number | null;
  category: string; weight: string; image: string; tag: string | null;
  storeName: string; distance: string; inStock?: boolean; imageStatus?: string;
};
export type Category = { name: string; icon: string; color: string; image: string };

type Catalog = { products: Product[]; categories: Category[]; source: 'api' | 'mock' };

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

let cached: Catalog | null = null;
let inflight: Promise<Catalog> | null = null;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export function loadCatalog(): Promise<Catalog> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const [products, categories] = await Promise.all([
        fetchJson<Product[]>('/api/products?limit=5000'),
        fetchJson<Category[]>('/api/categories'),
      ]);
      if (!products.length) throw new Error('empty catalog');
      cached = { products, categories, source: 'api' };
    } catch (err) {
      console.warn('[catalog] API unavailable, using bundled data:', (err as Error).message);
      // The bundled fallback is ~1 MB, so it is only downloaded when the API is actually unreachable.
      const mock = await import('@/data/mockData');
      cached = { products: mock.products as Product[], categories: mock.GROCERY_CATEGORIES as Category[], source: 'mock' };
    }
    return cached;
  })();
  return inflight;
}

/** React hook – returns an empty catalogue (loading=true) and swaps in API data once loaded. */
export function useCatalog(): Catalog & { loading: boolean } {
  const [state, setState] = useState<Catalog>(cached ?? { products: [], categories: [], source: 'mock' });
  const [loading, setLoading] = useState(!cached);
  useEffect(() => {
    let alive = true;
    loadCatalog().then(c => { if (alive) { setState(c); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { ...state, loading };
}
