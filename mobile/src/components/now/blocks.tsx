/**
 * Blinkit-style building blocks for the grocery screens (Home, Now, Category, Search, Product, Cart):
 * pastel category tiles grouped by aisle, product rails with a peeking 3rd card, 2-col grids,
 * sort chips and shimmer skeletons.
 */
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Ico, K, SectionTitle, type IconName } from '@/components/kit';
import { useCategoryRails } from '@/components/now/useCatalog';
import { ProductCard, Tap } from '@/components/ui';
import { API_BASE, type Category, type Product } from '@/lib/api';
import { C } from '@/lib/theme';

/* ── Catalogue helpers ───────────────────────────────────────────────────── */
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export const hasPhoto = (p: Product) => p.imageStatus === 'ready' && !!p.image;
/** Real product photos first, placeholders last (stable within each group). */
export const photosFirst = (list: Product[]) => [...list.filter(hasPhoto), ...list.filter(p => !hasPhoto(p))];
export const pct = (p: Product) => (p.origPrice && p.origPrice > p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0);

/** Blinkit aisles. Names are matched loosely ("Atta Rice & Dal" ≈ "Atta, Rice & Dal"). */
export const AISLES: { title: string; names: string[] }[] = [
  { title: 'Grocery & Kitchen', names: ['Fruits & Veg', 'Dairy & Eggs', 'Atta Rice & Dal', 'Oils & Ghee', 'Masalas & Spices', 'Bakery & Biscuits', 'Breakfast & Soya', 'Dry Fruits & Nuts', 'Sauces Spreads & Ketchup'] },
  { title: 'Snacks & Drinks', names: ['Snacks & Munchies', 'Cold Drinks & Juices', 'Tea & Coffee', 'Chocolates & Sweets', 'Ice Creams', 'Noodles & Pasta', 'Ready to Cook & Eat', 'Frozen Food'] },
  { title: 'Beauty & Personal Care', names: ['Personal Care', 'Beauty & Cosmetics', 'Baby Care', 'Health & Wellness', 'Pharmacy'] },
  { title: 'Household & More', names: ['Household', 'Pet Care', 'Meat & Seafood', 'Paan Corner'] },
];
export function groupByAisle(cats: Category[]) {
  const byKey = new Map(cats.map(c => [norm(c.name), c]));
  const used = new Set<string>();
  const groups = AISLES.map(a => ({
    title: a.title,
    cats: a.names.map(n => byKey.get(norm(n))).filter((c): c is Category => { if (!c || used.has(c.name)) return false; used.add(c.name); return true; }),
  }));
  const rest = cats.filter(c => !used.has(c.name));
  if (rest.length) groups.push({ title: 'More to explore', cats: rest });
  return groups.filter(g => g.cats.length > 0);
}

/** Top tabs on the Now band → category (matched loosely against the live list). */
export const NOW_TABS: { key: string; label: string; icon: IconName; match?: string }[] = [
  { key: 'all', label: 'All', icon: 'apps' },
  { key: 'fruits', label: 'Fruits & Veg', icon: 'nutrition', match: 'Fruits & Veg' },
  { key: 'dairy', label: 'Dairy & Eggs', icon: 'egg', match: 'Dairy & Eggs' },
  { key: 'snacks', label: 'Snacks', icon: 'fast-food', match: 'Snacks & Munchies' },
  { key: 'drinks', label: 'Cold Drinks', icon: 'beer', match: 'Cold Drinks & Juices' },
  { key: 'bakery', label: 'Bakery', icon: 'pizza', match: 'Bakery & Biscuits' },
  { key: 'atta', label: 'Atta & Dal', icon: 'leaf', match: 'Atta Rice & Dal' },
  { key: 'tea', label: 'Tea & Coffee', icon: 'cafe', match: 'Tea & Coffee' },
  { key: 'care', label: 'Personal Care', icon: 'sparkles', match: 'Personal Care' },
  { key: 'home', label: 'Household', icon: 'home', match: 'Household' },
  { key: 'icecream', label: 'Ice Creams', icon: 'ice-cream', match: 'Ice Creams' },
  { key: 'pharmacy', label: 'Pharmacy', icon: 'medkit', match: 'Pharmacy' },
];

/** Category → up to two real product photos (from the cached rail queries), else the category image. */
export function useCategoryThumbs(cats: Category[]) {
  const rails = useCategoryRails(cats);
  const sig = rails.map(r => r.dataUpdatedAt).join(',');
  return useMemo(() => {
    const out: Record<string, { pics: string[]; products: Product[] | undefined; loading: boolean }> = {};
    cats.forEach((c, i) => {
      const data = rails[i]?.data;
      const pics = (data ?? []).filter(hasPhoto).map(p => p.image);
      const uniq = [...new Set(pics)].slice(0, 2);
      out[c.name] = { pics: uniq, products: data ? photosFirst(data) : undefined, loading: !!rails[i]?.isLoading };
    });
    return out;
  }, [cats, sig]); // eslint-disable-line react-hooks/exhaustive-deps
}

export const tint = (hex?: string, alpha = '1F') => (hex && /^#[0-9a-f]{6}$/i.test(hex) ? hex + alpha : '#EEF1F5');
const catPhoto = (c: Category) => (c.image ? (c.image.startsWith('/') ? `${API_BASE}${c.image}` : c.image) : undefined);

/* ── Pastel category tile (Blinkit) ──────────────────────────────────────── */
export function CatTile({ c, width, pics = [], onPress }: { c: Category; width: number; pics?: string[]; onPress?: () => void }) {
  const photo = catPhoto(c);
  return (
    <Tap onPress={onPress ?? (() => router.push({ pathname: '/category/[name]', params: { name: c.name } }))} style={{ width }} scale={0.95} accessibilityRole="button" accessibilityLabel={c.name}>
      <View style={[st.tile, { width, height: width, backgroundColor: tint(c.color) }]}>
        {pics.length > 0 ? (
          <>
            {pics[1] ? <Image source={pics[1]} style={[st.tileBack, { width: width * 0.52, height: width * 0.52 }]} contentFit="contain" recyclingKey={pics[1]} /> : null}
            <Image source={pics[0]} style={{ position: 'absolute', right: 6, bottom: 6, width: width * (pics[1] ? 0.66 : 0.78), height: width * (pics[1] ? 0.66 : 0.78) }} contentFit="contain" recyclingKey={pics[0]} transition={150} />
          </>
        ) : photo ? (
          <Image source={photo} style={{ position: 'absolute', top: 7, left: 7, right: 7, bottom: 7, borderRadius: 12 }} contentFit="cover" recyclingKey={c.name} transition={150} />
        ) : (
          <Text style={{ fontSize: width * 0.42 }}>{c.icon || '🛒'}</Text>
        )}
      </View>
      <Text style={st.tileName} numberOfLines={2}>{c.name}</Text>
    </Tap>
  );
}

export function CatGrid({ cats, thumbs, columns = 4, width, loading, style }: { cats: Category[]; thumbs?: Record<string, { pics: string[] }>; columns?: number; width: number; loading?: boolean; style?: StyleProp<ViewStyle> }) {
  const gap = 10;
  const tileW = Math.floor((width - 32 - gap * (columns - 1)) / columns);
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, columnGap: gap, rowGap: 14 }, style]}>
      {loading
        ? Array.from({ length: columns * 2 }, (_, i) => <View key={i} style={{ width: tileW }}><Shimmer style={{ width: tileW, height: tileW, borderRadius: 16 }} /><Shimmer style={{ height: 10, width: '70%', alignSelf: 'center', marginTop: 8, borderRadius: 5 }} /></View>)
        : cats.map(c => <CatTile key={c.name} c={c} width={tileW} pics={thumbs?.[c.name]?.pics} />)}
    </View>
  );
}

/* ── Shimmer skeleton ────────────────────────────────────────────────────── */
export function Shimmer({ style }: { style?: StyleProp<ViewStyle> }) {
  const o = useSharedValue(0.55);
  useEffect(() => { o.value = withRepeat(withTiming(1, { duration: 700 }), -1, true); }, [o]);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ backgroundColor: '#E6E9EF' }, style, a]} />;
}
export function CardSkeleton({ width }: { width: number }) {
  return (
    <View style={[st.skelCard, { width }]}>
      <Shimmer style={{ aspectRatio: 1, borderRadius: 10 }} />
      <Shimmer style={{ height: 10, width: '45%', borderRadius: 5, marginTop: 16 }} />
      <Shimmer style={{ height: 12, width: '92%', borderRadius: 6, marginTop: 8 }} />
      <Shimmer style={{ height: 12, width: '55%', borderRadius: 6, marginTop: 6 }} />
    </View>
  );
}

/* ── Product rail (3rd card peeks) ───────────────────────────────────────── */
export const RAIL_W = 138;
export function Rail({ title, sub, products, loading, onSeeAll, style }: { title: string; sub?: string; products?: Product[]; loading?: boolean; onSeeAll?: () => void; style?: StyleProp<ViewStyle> }) {
  if (!loading && (!products || products.length === 0)) return null;
  return (
    <View style={style}>
      <SectionTitle title={title} sub={sub} onAction={onSeeAll} />
      {loading ? (
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16 }}>{[0, 1, 2].map(i => <CardSkeleton key={i} width={RAIL_W} />)}</View>
      ) : (
        <FlatList
          horizontal
          data={products}
          keyExtractor={p => p.id}
          renderItem={({ item }) => <ProductCard p={item} width={RAIL_W} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 2 }}
          getItemLayout={(_, i) => ({ length: RAIL_W + 10, offset: 16 + (RAIL_W + 10) * i, index: i })}
          initialNumToRender={4}
          windowSize={5}
        />
      )}
    </View>
  );
}

/* ── 2-col grid helpers ──────────────────────────────────────────────────── */
export type SortKey = 'relevance' | 'price' | 'discount';
export const SORTS: { key: SortKey; label: string; icon: IconName }[] = [
  { key: 'relevance', label: 'Relevance', icon: 'swap-vertical' },
  { key: 'price', label: 'Price: low to high', icon: 'arrow-up' },
  { key: 'discount', label: 'Discount', icon: 'pricetags-outline' },
];
export function sortProducts(list: Product[], k: SortKey) {
  if (k === 'price') return [...list].sort((a, b) => a.price - b.price);
  if (k === 'discount') return [...list].sort((a, b) => pct(b) - pct(a));
  return photosFirst(list);
}
export function SortChips({ value, onChange, style, inset = 16 }: { value: SortKey; onChange: (k: SortKey) => void; style?: StyleProp<ViewStyle>; inset?: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style} contentContainerStyle={{ gap: 8, paddingHorizontal: inset }}>
      {SORTS.map(s => {
        const on = s.key === value;
        return (
          <Pressable key={s.key} onPress={() => onChange(s.key)} style={[st.chip, on && st.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Ico name={s.icon} size={13} color={on ? C.greenDeep : K.ink} />
            <Text style={[st.chipTxt, on && { color: C.greenDeep }]}>{s.label}</Text>
            {on && s.key !== 'relevance' ? <Ico name="close" size={13} color={C.greenDeep} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Light empty-state with a big icon bubble. */
export function EmptyState({ icon, title, body, action, onAction }: { icon: IconName; title: string; body?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 40, gap: 8 }}>
      <View style={st.emptyBubble}><Ico name={icon} size={40} color={C.green} /></View>
      <Text style={{ fontSize: 17, fontWeight: '800', color: K.ink, textAlign: 'center', marginTop: 8 }}>{title}</Text>
      {body ? <Text style={{ fontSize: 13, color: K.meta, textAlign: 'center', lineHeight: 19 }}>{body}</Text> : null}
      {action ? (
        <Tap onPress={onAction} style={st.emptyBtn}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{action}</Text></Tap>
      ) : null}
    </View>
  );
}

const st = StyleSheet.create({
  tile: { borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  tileBack: { position: 'absolute', left: 6, top: 6, opacity: 0.95 },
  tileName: { fontSize: 11, lineHeight: 14, fontWeight: '600', color: K.ink, textAlign: 'center', marginTop: 6, minHeight: 28 },
  skelCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line, padding: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: K.line, backgroundColor: '#fff' },
  chipOn: { borderColor: C.green, backgroundColor: '#E9F8F1' },
  chipTxt: { fontSize: 12.5, fontWeight: '700', color: K.ink },
  emptyBubble: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  emptyBtn: { marginTop: 14, backgroundColor: C.green, borderRadius: 12, paddingHorizontal: 22, height: 46, alignItems: 'center', justifyContent: 'center' },
});
