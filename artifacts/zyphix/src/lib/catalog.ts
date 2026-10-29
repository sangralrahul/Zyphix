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
  storeName?: string; distance?: string; inStock?: boolean; imageStatus?: string;
};
export type Category = { name: string; icon: string; color: string; image: string; group?: string | null };

type Catalog = { products: Product[]; categories: Category[]; source: 'api' | 'mock'; partial: boolean; total: number };

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

/* Two-phase load. Phase 1 is small (the top 8 products of every aisle, ~200 rows) so the
   page renders complete in one round trip; phase 2 brings the full catalogue and
   replaces it. Every mounted hook is told about both. */
let state: Catalog | null = null;
let inflight: Promise<Catalog> | null = null;
const listeners = new Set<(c: Catalog) => void>();
const publish = (c: Catalog) => { state = c; listeners.forEach(l => l(c)); };

async function fetchJson<T>(path: string): Promise<{ data: T; total: number }> {
  // Plain cors/anonymous fetch so it can be satisfied by the <link rel="preload" as="fetch"> in index.html.
  const res = await fetch(`${API_BASE}${path}`, { mode: 'cors', credentials: 'omit' });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  const data = await res.json() as T;
  return { data, total: Number(res.headers.get('x-total-count') ?? 0) };
}

export function loadCatalog(): Promise<Catalog> {
  if (state && !state.partial) return Promise.resolve(state);
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const [preview, categories] = await Promise.all([
        fetchJson<Product[]>('/api/products?preview=8'),
        fetchJson<Category[]>('/api/categories'),
      ]);
      if (preview.data.length) publish({ products: preview.data, categories: categories.data, source: 'api', partial: true, total: preview.total || preview.data.length });
      const full = await fetchJson<Product[]>('/api/products?limit=5000&compact=1');
      if (!full.data.length) throw new Error('empty catalog');
      // Swap in the full catalogue when the main thread is quiet, so the first screen stays responsive.
      await new Promise<void>(r => ((window as any).requestIdleCallback ? (window as any).requestIdleCallback(() => r(), { timeout: 1500 }) : setTimeout(r, 300)));
      publish({ products: full.data, categories: categories.data, source: 'api', partial: false, total: full.data.length });
    } catch (err) {
      console.warn('[catalog] API unavailable, using bundled data:', (err as Error).message);
      // The bundled fallback is ~1 MB, so it is only downloaded when the API is actually unreachable.
      const mock = await import('@/data/mockData');
      publish({ products: mock.products as Product[], categories: mock.GROCERY_CATEGORIES as Category[], source: 'mock', partial: false, total: mock.products.length });
    }
    inflight = null;
    return state!;
  })();
  return inflight;
}

/** React hook – empty (loading) → first-paint subset (partial) → full catalogue. */
export function useCatalog(): Catalog & { loading: boolean } {
  const [c, setC] = useState<Catalog>(state ?? { products: [], categories: [], source: 'mock', partial: true, total: 0 });
  useEffect(() => {
    listeners.add(setC);
    if (state) setC(state);
    loadCatalog();
    return () => { listeners.delete(setC); };
  }, []);
  return { ...c, loading: c.products.length === 0 };
}
