import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingCart, Ico, K, TimerChip } from '@/components/kit';
import { EmptyState, photosFirst, Rail } from '@/components/now/blocks';
import { discountPct, qk, useCachedProduct } from '@/components/now/useCatalog';
import { Tap } from '@/components/ui';
import { Api, type Product } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { C, inr } from '@/lib/theme';

export default function ProductScreen() {
  const { id: raw } = useLocalSearchParams<{ id: string }>();
  const id = String(raw ?? '');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cached = useCachedProduct(id);
  const [open, setOpen] = useState(false);

  const q = useQuery({ queryKey: qk.product(id), queryFn: () => Api.product(id), initialData: cached, enabled: !!id });
  const related = useQuery({ queryKey: ['related', id], queryFn: () => Api.related(id), enabled: !!id });
  const p = q.data;

  const top = (
    <View style={[st.topBar, { top: insets.top + 6 }]} pointerEvents="box-none">
      <Tap onPress={() => router.back()} style={st.round} accessibilityLabel="Back"><Ico name="arrow-back" size={20} /></Tap>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Tap onPress={() => router.push('/search')} style={st.round} accessibilityLabel="Search"><Ico name="search" size={19} /></Tap>
        {p ? <Tap onPress={() => Share.share({ message: `${p.name} on Zyphix — ${inr(p.price)}` }).catch(() => {})} style={st.round} accessibilityLabel="Share"><Ico name="share-social-outline" size={19} /></Tap> : null}
      </View>
    </View>
  );

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
        <Stack.Screen options={{ headerShown: false }} />
        {q.isError ? <EmptyState icon="cube-outline" title="Product not found" body="It may be out of stock or no longer listed." action="Go back" onAction={() => router.back()} />
          : <ActivityIndicator color={C.green} />}
        {top}
      </View>
    );
  }

  const off = discountPct(p);
  const imgH = Math.min(width, 430);
  const barH = 76 + insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: K.page }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: barH + 90 }} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never">
        <View style={[st.hero, { height: imgH + insets.top }]}>
          <Animated.View entering={FadeIn.duration(250)} style={{ position: 'absolute', left: 28, right: 28, top: insets.top + 56, bottom: 34 }}>
            <Image source={p.image} style={StyleSheet.absoluteFill} contentFit="contain" transition={200} recyclingKey={p.id} cachePolicy="memory-disk" />
          </Animated.View>
          <View style={st.dots}><View style={[st.dot, st.dotOn]} /></View>
        </View>

        <Animated.View entering={FadeInDown.duration(300)} style={st.info}>
          <TimerChip />
          <Text style={st.name}>{p.name}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {p.weight ? <View style={st.weight}><Text style={st.weightTxt}>{p.weight}</Text></View> : null}
            <Pressable onPress={() => router.push({ pathname: '/category/[name]', params: { name: p.category } })} style={st.catLink} hitSlop={6}>
              <Text style={st.catLinkTxt}>{p.category}</Text><Ico name="chevron-forward" size={12} color={C.greenDeep} />
            </Pressable>
          </View>

          <View style={st.priceCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={st.price}>{inr(p.price)}</Text>
              {off > 0 ? <Text style={st.mrp}>MRP {inr(p.origPrice!)}</Text> : null}
              {off > 0 ? <View style={st.offPill}><Text style={st.offPillTxt}>{off}% OFF</Text></View> : null}
            </View>
            <Text style={st.tax}>(Inclusive of all taxes)</Text>
          </View>
        </Animated.View>

        <Animated.View layout={LinearTransition} style={st.details}>
          <Pressable onPress={() => setOpen(o => !o)} style={st.detailsHead} accessibilityRole="button" accessibilityState={{ expanded: open }}>
            <Text style={st.detailsTitle}>{open ? 'Hide product details' : 'View product details'}</Text>
            <Ico name={open ? 'chevron-up' : 'chevron-down'} size={16} color={C.green} />
          </Pressable>
          {open ? (
            <Animated.View entering={FadeIn} style={{ paddingTop: 4 }}>
              <Row label="Brand" value={p.brand} />
              <Row label="Category" value={p.category} />
              {p.weight ? <Row label="Unit" value={p.weight} /> : null}
              {p.storeName ? <Row label="Sold by" value={p.storeName} /> : null}
              <Text style={st.disclaimer}>Packed by a partner store near you and delivered by Zyphix Now. Images are for representation; check the pack for full ingredients and details.</Text>
            </Animated.View>
          ) : null}
        </Animated.View>

        <View style={st.promises}>
          {[{ i: 'flash' as const, t: 'Superfast delivery', s: 'In about 30 minutes' }, { i: 'pricetags' as const, t: 'Best prices & offers', s: 'Coupons at checkout' }, { i: 'cash-outline' as const, t: 'Cash on delivery', s: 'Pay when it arrives' }].map(x => (
            <View key={x.t} style={st.promise}>
              <View style={st.promiseIco}><Ico name={x.i} size={16} color={C.greenDeep} /></View>
              <Text style={st.promiseT} numberOfLines={2}>{x.t}</Text>
            </View>
          ))}
        </View>

        <Rail title="Similar products" products={photosFirst((related.data ?? []) as Product[])} loading={related.isLoading} />
      </ScrollView>

      {top}
      <FloatingCart kind="now" bottom={barH + 10} />
      <View style={[st.bar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={st.barWeight} numberOfLines={1}>{p.weight || p.brand}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={st.barPrice}>{inr(p.price)}</Text>
            {off > 0 ? <Text style={st.barMrp}>MRP {inr(p.origPrice!)}</Text> : null}
          </View>
          <Text style={st.tax}>Inclusive of all taxes</Text>
        </View>
        <BigAdd p={p} />
      </View>
    </View>
  );
}

function BigAdd({ p }: { p: Product }) {
  const cart = useCart();
  const n = cart.qty('now', p.id);
  if (n === 0) {
    return (
      <Tap onPress={() => cart.add('now', p)} style={st.bigAdd} accessibilityLabel={`Add ${p.name} to cart`}>
        <Text style={st.bigAddTxt}>Add to cart</Text>
      </Tap>
    );
  }
  return (
    <Animated.View entering={FadeIn.duration(150)} style={[st.bigAdd, { justifyContent: 'space-between', paddingHorizontal: 6 }]}>
      <Pressable onPress={() => cart.remove('now', p.id)} hitSlop={8} style={st.stepBtn} accessibilityLabel="Remove one"><Ico name="remove" size={20} color="#fff" /></Pressable>
      <Text style={st.bigAddTxt}>{n}</Text>
      <Pressable onPress={() => cart.add('now', p)} hitSlop={8} style={st.stepBtn} accessibilityLabel="Add one"><Ico name="add" size={20} color="#fff" /></Pressable>
    </Animated.View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <Text style={{ fontSize: 12, color: K.meta, fontWeight: '600' }}>{label}</Text>
      <Text style={{ fontSize: 14, color: K.ink, fontWeight: '600', marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  topBar: { position: 'absolute', left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  hero: { backgroundColor: '#fff' },
  dots: { position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D7DCE3' },
  dotOn: { width: 16, backgroundColor: K.ink },
  info: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  name: { fontSize: 20, lineHeight: 25, fontWeight: '800', color: K.ink, letterSpacing: -0.3, marginTop: 8 },
  weight: { backgroundColor: '#F1F3F6', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  weightTxt: { fontSize: 12, fontWeight: '700', color: '#374151' },
  catLink: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#E9F8F1', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  catLinkTxt: { fontSize: 12, fontWeight: '700', color: C.greenDeep },
  priceCard: { marginTop: 14, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: K.line, backgroundColor: '#FBFCFD' },
  price: { fontSize: 22, fontWeight: '900', color: K.ink },
  mrp: { fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through', fontWeight: '500' },
  offPill: { backgroundColor: '#E9F8F1', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  offPillTxt: { fontSize: 12, fontWeight: '900', color: C.greenDeep },
  tax: { fontSize: 11, color: K.meta, marginTop: 2 },
  details: { marginTop: 10, marginHorizontal: 12, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1, borderColor: K.line },
  detailsHead: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 46 },
  detailsTitle: { fontSize: 14, fontWeight: '800', color: C.green },
  disclaimer: { fontSize: 12, color: K.meta, lineHeight: 17, paddingVertical: 10 },
  promises: { flexDirection: 'row', gap: 8, marginHorizontal: 12, marginTop: 10 },
  promise: { flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line, padding: 10, alignItems: 'center', gap: 6 },
  promiseIco: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E9F8F1', alignItems: 'center', justifyContent: 'center' },
  promiseT: { fontSize: 11, fontWeight: '700', color: K.ink, textAlign: 'center' },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 8 },
  barWeight: { fontSize: 12, color: K.meta, fontWeight: '600' },
  barPrice: { fontSize: 18, fontWeight: '900', color: K.ink },
  barMrp: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  bigAdd: { height: 50, minWidth: 156, borderRadius: 12, backgroundColor: C.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  bigAddTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },
  stepBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
});
