import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { Api, type Category, type Product } from '@/lib/api';

/** Shared query keys so Home, Now and detail screens reuse each other's cache. */
export const qk = {
  categories: ['categories'] as const,
  railProducts: (category: string) => ['products', { category, limit: 10 }] as const,
  product: (id: string) => ['product', id] as const,
};

export function useCategories() {
  return useQuery({ queryKey: qk.categories, queryFn: Api.categories });
}

/** First 10 products for each of the given categories (one request per category, cached). */
export function useCategoryRails(cats: Category[]) {
  return useQueries({
    queries: cats.map(c => ({ queryKey: qk.railProducts(c.name), queryFn: () => Api.products({ category: c.name, limit: 10 }) })),
  });
}

export const discountPct = (p: Product) => (p.origPrice && p.origPrice > p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0);

/** Pull-to-refresh helper: refetches active queries matching the given key prefixes. */
export function useRefresh(keys: readonly (readonly unknown[])[]) {
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await Promise.all(keys.map(k => qc.refetchQueries({ queryKey: k as unknown[], type: 'active' }))); } finally { setRefreshing(false); }
  }, [qc, keys]);
  return { refreshing, onRefresh };
}

/** Looks through cached product lists for a product (instant product pages). */
export function useCachedProduct(id: string): Product | undefined {
  const qc = useQueryClient();
  for (const [, data] of qc.getQueriesData<Product[] | { pages: Product[][] }>({ queryKey: ['products'] })) {
    const list = Array.isArray(data) ? data : data?.pages?.flat();
    const hit = list?.find(p => p.id === id);
    if (hit) return hit;
  }
  for (const [, data] of qc.getQueriesData<Product[]>({ queryKey: ['search'] })) {
    const hit = Array.isArray(data) ? data.find(p => p.id === id) : undefined;
    if (hit) return hit;
  }
  return undefined;
}
