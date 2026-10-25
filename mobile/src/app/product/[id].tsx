import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, NOW_PROMISES, ProductRail, PromiseRow } from '@/components/now/shared';
import { discountPct, qk, useCachedProduct } from '@/components/now/useCatalog';
import { AddButton, Button, Empty, Tap } from '@/components/ui';
import { Api } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { C, R, S, T, inr, shadow } from '@/lib/theme';

export default function ProductScreen() {
  const { id: raw } = useLocalSearchParams<{ id: string }>();
  const id = String(raw ?? '');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const cached = useCachedProduct(id);

  const q = useQuery({ queryKey: qk.product(id), queryFn: () => Api.product(id), initialData: cached, enabled: !!id });
  const related = useQuery({ queryKey: ['related', id], queryFn: () => Api.related(id), enabled: !!id });
  const p = q.data;

  if (!p) {
    return (
      <View style={[st.center, { paddingTop: insets.top + 60 }]}>
        {q.isError ? <Empty title="Product not found" body="It may be out of stock or no longer listed." action="Go back" onAction={() => router.back()} />
          : <ActivityIndicator color={C.green} />}
      </View>
    );
  }

  const off = discountPct(p);
  const inCart = cart.qty('now', p.id);
  const imgH = Math.min(width, 430);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never">
        <View style={[st.hero, { height: imgH + insets.top }]}>
          <Animated.View entering={FadeIn.duration(250)} style={[StyleSheet.absoluteFill, { top: insets.top + 36, bottom: 16 }]}>
            <Image source={p.image} style={StyleSheet.absoluteFill} contentFit="contain" transition={200} recyclingKey={p.id} cachePolicy="memory-disk" />
          </Animated.View>
          {off > 0 && <View style={[st.offTag, { top: insets.top + 56 }]}><Text style={st.offTxt}>{off}% OFF</Text></View>}
        </View>

        <Animated.View entering={FadeInDown.duration(350)} style={st.body}>
          <Text style={st.brand}>{p.brand}</Text>
          <Text style={T.h1}>{p.name}</Text>
          {!!p.weight && <Text style={[T.body, { color: C.text2, marginTop: 4 }]}>{p.weight}</Text>}

          <View style={st.priceRow}>
            <Text style={[T.h1, { fontSize: 26 }]}>{inr(p.price)}</Text>
            {off > 0 && <Text style={st.mrp}>MRP {inr(p.origPrice!)}</Text>}
            {off > 0 && <View style={st.saveTag}><Text style={st.saveTxt}>Save {inr(p.origPrice! - p.price)}</Text></View>}
          </View>
          <Text style={[T.small, { color: C.text3 }]}>Inclusive of all taxes</Text>

          <PromiseRow items={NOW_PROMISES} style={{ marginTop: S.xl, marginHorizontal: -S.xl }} />

          <View style={st.about}>
            <Text style={[T.h3, { marginBottom: S.sm }]}>About this item</Text>
            <InfoRow label="Brand" value={p.brand} />
            <InfoRow label="Category" value={p.category} onPress={() => router.push({ pathname: '/category/[name]', params: { name: p.category } })} />
            {!!p.weight && <InfoRow label="Pack size" value={p.weight} />}
            {!!p.storeName && <InfoRow label="Sold by" value={p.storeName} />}
            <Text style={[T.small, { color: C.text2, marginTop: S.md }]}>
              Packed fresh by a partner store near you and delivered by Zyphix Now. Images are for representation; check the pack for full ingredients and details.
            </Text>
          </View>
        </Animated.View>

        <ProductRail title="You might also like" products={related.data} loading={related.isLoading} />
      </ScrollView>

      {/* Sticky add bar */}
      <View style={[st.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{p.weight || p.brand}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={T.h2}>{inr(p.price)}</Text>
            {off > 0 && <Text style={[T.small, { color: C.text3, textDecorationLine: 'line-through' }]}>{inr(p.origPrice!)}</Text>}
          </View>
        </View>
        {inCart > 0 && (
          <Button title="Cart" variant="dark" onPress={() => router.push({ pathname: '/cart', params: { kind: 'now' } })} style={{ height: 50, paddingHorizontal: 18 }}
            icon={<Icon ios="cart.fill" md="shopping_cart" size={16} color={C.white} />} />
        )}
        <AddButton kind="now" item={p} large />
      </View>
    </View>
  );
}

function InfoRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  const inner = (
    <>
      <Text style={[T.body, { color: C.text2, width: 100 }]}>{label}</Text>
      <Text style={[T.body, { flex: 1, color: onPress ? C.greenDeep : C.text, fontWeight: onPress ? '600' : '400' }]}>{value}</Text>
      {onPress && <Icon ios="chevron.right" md="chevron_right" size={14} color={C.text3} />}
    </>
  );
  return onPress ? <Tap onPress={onPress} style={st.infoRow} scale={0.99}>{inner}</Tap> : <View style={st.infoRow}>{inner}</View>;
}

const st = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', backgroundColor: C.bg },
  hero: { backgroundColor: '#F7F8FA', borderBottomLeftRadius: R.xl, borderBottomRightRadius: R.xl, overflow: 'hidden' },
  offTag: { position: 'absolute', left: S.xl, backgroundColor: '#2563EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  offTxt: { color: C.white, fontWeight: '800', fontSize: 12 },
  body: { paddingHorizontal: S.xl, paddingTop: S.xl },
  brand: { ...T.tiny, color: C.green, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, marginTop: S.lg, flexWrap: 'wrap' },
  mrp: { ...T.body, color: C.text3, textDecorationLine: 'line-through' },
  saveTag: { backgroundColor: C.greenSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  saveTxt: { color: C.greenDeep, fontWeight: '700', fontSize: 12 },
  about: { marginTop: S.xl, padding: S.lg, borderRadius: R.lg, borderWidth: 1, borderColor: C.line },
  infoRow: { flexDirection: 'row', alignItems: 'center', minHeight: 36, gap: S.sm },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: S.md, paddingHorizontal: S.xl, paddingTop: S.md, backgroundColor: C.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line, ...shadow },
});
