import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import React from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard, ProductSkeleton, SectionHeader, Tap } from '@/components/ui';
import { PHOTO } from '@/data/media';
import { API_BASE, type Category, type Product } from '@/lib/api';
import { C, R, S, T, inr } from '@/lib/theme';

/* ── Icon: SF Symbol on iOS, Material Symbol on Android/web ── */
export type MaterialName = AndroidSymbol;
export function Icon({ ios, md, size = 20, color = C.text, style }: { ios: SFSymbol; md: MaterialName; size?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  return <SymbolView name={{ ios, android: md, web: md }} size={size} tintColor={color} style={style} />;
}

/** Bottom offset for the floating CartBar on tab screens (iOS tab bar floats over content). */
export function useTabCartBottom() {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'ios' ? insets.bottom + 60 : 12;
}
/** Bottom offset for CartBar / sticky bars on stack screens. */
export function useStackBottom() {
  const insets = useSafeAreaInsets();
  return insets.bottom + 12;
}

/* ── Category imagery ── */
const FALLBACK: Record<string, string> = {
  'Fruits & Veg': PHOTO.produce,
  'Dairy & Eggs': PHOTO.dairy,
  'Snacks & Munchies': PHOTO.snacks,
  'Bakery & Biscuits': PHOTO.snacks,
  'Chocolates & Sweets': PHOTO.snacks,
};
export function categoryImage(c: Pick<Category, 'name' | 'image'>) {
  if (c.image) return c.image.startsWith('/') ? `${API_BASE}${c.image}` : c.image;
  return FALLBACK[c.name] ?? PHOTO.grocery;
}
export const CATEGORY_TINTS = ['#EAF7F0', '#EEF4FF', '#FFF4E8', '#F6EEFF', '#FFEFF3', '#EAF6FB', '#FFF8E1', '#F1F5F9'];

/** Square category tile (image on a soft tint + 2-line label), Blinkit style. */
export function CategoryTile({ c, width, index, onPress }: { c: Category; width: number; index: number; onPress?: () => void }) {
  const tint = CATEGORY_TINTS[index % CATEGORY_TINTS.length];
  return (
    <Tap onPress={onPress ?? (() => router.push({ pathname: '/category/[name]', params: { name: c.name } }))} style={{ width }} accessibilityRole="button" accessibilityLabel={c.name}>
      <View style={[sx.catImg, { width, height: width, backgroundColor: tint }]}>
        <Image source={categoryImage(c)} placeholder={{ uri: PHOTO.grocery }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} recyclingKey={c.name} cachePolicy="memory-disk" />
      </View>
      <Text style={sx.catLabel} numberOfLines={2}>{c.name}</Text>
    </Tap>
  );
}

/** Grid of category tiles (fixed columns, wraps). */
export function CategoryGrid({ cats, columns = 4, loading, style }: { cats: Category[]; columns?: number; loading?: boolean; style?: StyleProp<ViewStyle> }) {
  const [w, setW] = React.useState(0);
  const gap = S.md;
  const tile = w > 0 ? Math.floor((w - gap * (columns - 1)) / columns) : 0;
  return (
    <View style={[sx.grid, { gap, paddingHorizontal: S.xl }, style]}>
      <View style={StyleSheet.absoluteFill} onLayout={e => setW(e.nativeEvent.layout.width - S.xl * 2)} pointerEvents="none" />
      {tile > 0 && (loading
        ? Array.from({ length: columns * 2 }, (_, i) => <View key={i} style={{ width: tile }}><View style={[sx.catImg, { width: tile, height: tile, backgroundColor: C.bgSoft }]} /><View style={sx.skelLine} /></View>)
        : cats.map((c, i) => <CategoryTile key={c.name} c={c} width={tile} index={i} />))}
    </View>
  );
}

/* ── Horizontal product rail ── */
export const RAIL_CARD = 148;
export function ProductRail({ title, products, loading, onSeeAll, style }: { title: string; products?: Product[]; loading?: boolean; onSeeAll?: () => void; style?: StyleProp<ViewStyle> }) {
  if (!loading && (!products || products.length === 0)) return null;
  const data = loading ? [] : products!;
  return (
    <View style={style}>
      <SectionHeader title={title} action={onSeeAll ? 'See all' : undefined} onAction={onSeeAll} />
      {loading ? (
        <View style={{ flexDirection: 'row', gap: S.md, paddingHorizontal: S.xl }}>
          {[0, 1, 2].map(i => <ProductSkeleton key={i} width={RAIL_CARD} />)}
        </View>
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={p => p.id}
          renderItem={({ item }) => <ProductCard p={item} width={RAIL_CARD} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: S.xl, gap: S.md }}
          snapToInterval={RAIL_CARD + S.md}
          decelerationRate="fast"
          getItemLayout={(_, i) => ({ length: RAIL_CARD + S.md, offset: S.xl + (RAIL_CARD + S.md) * i, index: i })}
          initialNumToRender={4}
          windowSize={5}
        />
      )}
    </View>
  );
}

/* ── Search pill (opens /search) ── */
export function SearchPill({ placeholder = 'Search groceries, snacks, essentials', dark, style }: { placeholder?: string; dark?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={() => router.push('/search')} accessibilityRole="search" accessibilityLabel="Search"
      style={({ pressed }) => [sx.search, dark ? sx.searchDark : sx.searchLight, pressed && { opacity: 0.85 }, style]}>
      <Icon ios="magnifyingglass" md="search" size={18} color={dark ? 'rgba(255,255,255,.85)' : C.text2} />
      <Text style={[T.body, { color: dark ? 'rgba(255,255,255,.8)' : C.text3, flex: 1 }]} numberOfLines={1}>{placeholder}</Text>
    </Pressable>
  );
}

/* ── Bill summary ── */
export type Bill = { itemTotal: number; savings: number; delivery: number; total: number };
export function BillSummary({ bill, freeDeliveryHint, style }: { bill: Bill; freeDeliveryHint?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[sx.billCard, style]}>
      <Text style={[T.h3, { marginBottom: S.sm }]}>Bill summary</Text>
      <BillRow label="Item total" value={inr(bill.itemTotal + bill.savings)} />
      {bill.savings > 0 && <BillRow label="Product discount" value={`−${inr(bill.savings)}`} color={C.green} />}
      <BillRow label="Delivery fee" value={bill.delivery === 0 ? 'FREE' : inr(bill.delivery)} color={bill.delivery === 0 ? C.green : undefined} />
      {freeDeliveryHint && <Text style={[T.small, { color: C.text2, marginTop: 2 }]}>{freeDeliveryHint}</Text>}
      <View style={sx.billDivider} />
      <BillRow label="To pay" value={inr(bill.total)} strong />
      {bill.savings > 0 && (
        <View style={sx.saveBanner}><Text style={[T.small, { color: C.greenDeep, fontWeight: '700' }]}>You save {inr(bill.savings)} on this order</Text></View>
      )}
    </View>
  );
}
export function BillRow({ label, value, color, strong }: { label: string; value: string; color?: string; strong?: boolean }) {
  return (
    <View style={sx.billRow}>
      <Text style={[strong ? T.bodyStrong : T.body, { color: strong ? C.text : C.text2 }]}>{label}</Text>
      <Text style={[strong ? T.h3 : T.body, { color: color ?? C.text, fontWeight: strong ? '700' : '500' }]}>{value}</Text>
    </View>
  );
}

/* ── Delivery promise chips ── */
export function PromiseRow({ items, style, inset = S.xl }: { items: { ios: SFSymbol; md: MaterialName; label: string }[]; style?: StyleProp<ViewStyle>; /** horizontal padding of the scroller */ inset?: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style} contentContainerStyle={{ gap: S.sm, paddingHorizontal: inset }}>
      {items.map(it => (
        <View key={it.label} style={sx.promise}>
          <Icon ios={it.ios} md={it.md} size={15} color={C.greenDeep} />
          <Text style={[T.small, { color: C.text, fontWeight: '600' }]}>{it.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
export const NOW_PROMISES: { ios: SFSymbol; md: MaterialName; label: string }[] = [
  { ios: 'bolt.fill', md: 'bolt', label: '30-min delivery' },
  { ios: 'shippingbox.fill', md: 'local_shipping', label: `Free over ${inr(149)}` },
  { ios: 'banknote.fill', md: 'payments', label: 'Cash on delivery' },
];

export const sx = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  catImg: { borderRadius: R.md, overflow: 'hidden' },
  catLabel: { ...T.small, fontSize: 12, lineHeight: 15, fontWeight: '600', color: C.text, textAlign: 'center', marginTop: 6 },
  skelLine: { height: 10, borderRadius: 5, backgroundColor: C.bgSoft, marginTop: 8, width: '80%', alignSelf: 'center' },
  search: { height: 48, borderRadius: R.pill, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: S.lg },
  searchLight: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.line },
  searchDark: { backgroundColor: 'rgba(255,255,255,.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,.22)' },
  billCard: { backgroundColor: C.bg, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, padding: S.lg },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  billDivider: { height: StyleSheet.hairlineWidth, backgroundColor: C.line, marginVertical: S.sm },
  saveBanner: { marginTop: S.md, backgroundColor: C.greenSoft, borderRadius: R.sm, paddingVertical: 8, paddingHorizontal: S.md, alignItems: 'center' },
  promise: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.greenSoft, borderRadius: R.pill, paddingHorizontal: 12, height: 32 },
});
