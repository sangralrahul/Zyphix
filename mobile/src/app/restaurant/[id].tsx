import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLightStatusBar } from '@/components/account/kit';
import { FoodAdd, Rating, VegMark, feeLabel } from '@/components/eats/parts';
import { CollapsingTopBar, ParallaxImage } from '@/components/eats/TopBar';
import { CartBar, Empty, styles as ui } from '@/components/ui';
import { MENU, RESTAURANTS, type MenuItem } from '@/data/eats';
import { useCart } from '@/lib/cart';
import { C, R, S, T, inr, shadow } from '@/lib/theme';

const IMG_H = 280;

function ItemRow({ m, restaurant, last }: { m: MenuItem; restaurant: { id: string; name: string }; last: boolean }) {
  const best = m.tag === 'Bestseller';
  const off = m.origPrice && m.origPrice > m.price ? m.origPrice : null;
  return (
    <View style={[st.item, !last && st.itemSep]}>
      <View style={{ flex: 1, paddingRight: 14, gap: 4 }}>
        <View style={ui.row}>
          <VegMark veg={m.isVeg} />
          {best && <Text style={st.best}>★ Bestseller</Text>}
          {!best && m.tag ? <Text style={[st.best, { color: '#2563EB' }]}>{m.tag}</Text> : null}
        </View>
        <Text style={T.h3}>{m.name}</Text>
        <Text style={T.bodyStrong}>
          {inr(m.price)}{off ? <Text style={st.mrp}>  {inr(off)}</Text> : null}
        </Text>
        <Text style={[T.small, { color: C.text2 }]} numberOfLines={3}>{m.desc}</Text>
      </View>
      <View style={{ width: 128, alignItems: 'center' }}>
        <Image source={m.image} style={st.itemImg} contentFit="cover" recyclingKey={m.id} transition={200} cachePolicy="memory-disk" />
        <View style={{ marginTop: -18 }}><FoodAdd item={m} restaurant={restaurant} /></View>
      </View>
    </View>
  );
}

export default function RestaurantScreen() {
  useLightStatusBar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const [vegOnly, setVegOnly] = useState(false);
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(ev => { y.value = ev.contentOffset.y; });

  const r = RESTAURANTS.find(x => x.id === id);
  if (!r) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: insets.top }}>
        <Stack.Screen options={{ headerShown: true, title: '' }} />
        <Empty title="Restaurant not found" body="It may have moved or closed for now." action="Browse restaurants" onAction={() => router.replace('/eats')} />
      </View>
    );
  }
  const restaurant = { id: r.id, name: r.name };
  const tags = r.tags.filter(t => t.toLowerCase() !== 'free delivery');
  const menu = MENU.filter(m => m.restaurantId === r.id && (!vegOnly || m.isVeg));
  const best = menu.filter(m => m.tag === 'Bestseller');
  const rest = menu.filter(m => m.tag !== 'Bestseller');
  const inCart = cart.eatsRestaurant?.id === r.id ? cart.subtotal('eats') : 0;
  const short = inCart > 0 && inCart < r.minOrder ? r.minOrder - inCart : 0;
  const barBottom = insets.bottom + 12;

  return (
    <View style={{ flex: 1, backgroundColor: C.bgSoft }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: barBottom + (cart.count('eats') ? 110 : 24) }}>
        <ParallaxImage y={y} height={IMG_H + insets.top}>
          <Image source={r.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} cachePolicy="memory-disk" />
          <LinearGradient colors={['rgba(5,8,14,.55)', 'rgba(5,8,14,0)', 'rgba(5,8,14,.35)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
        </ParallaxImage>

        <Animated.View entering={FadeInDown.duration(350)} style={st.info}>
          <Text style={T.h1}>{r.name}</Text>
          <Text style={[T.small, { color: C.text2, marginTop: 4 }]}>{r.cuisine}</Text>
          <View style={st.stats}>
            <View style={st.stat}><Rating value={r.rating} /><Text style={st.statLbl}>Rating</Text></View>
            <View style={st.statSep} />
            <View style={st.stat}><Text style={st.statVal}>{r.eta}</Text><Text style={st.statLbl}>Delivery</Text></View>
            <View style={st.statSep} />
            <View style={st.stat}><Text style={st.statVal}>{inr(r.minOrder)}</Text><Text style={st.statLbl}>Min order</Text></View>
            <View style={st.statSep} />
            <View style={st.stat}><Text style={[st.statVal, r.deliveryFee === 0 && { color: C.greenDeep }]}>{r.deliveryFee === 0 ? 'Free' : inr(r.deliveryFee)}</Text><Text style={st.statLbl}>Delivery fee</Text></View>
          </View>
          {tags.length > 0 && (
            <View style={[ui.row, { flexWrap: 'wrap', marginTop: 12, gap: 6 }]}>
              {tags.map(t => <View key={t} style={st.tag}><Text style={st.tagTxt}>{t}</Text></View>)}
            </View>
          )}
        </Animated.View>

        <View style={st.vegRow}>
          <View style={ui.row}>
            <VegMark veg />
            <Text style={T.bodyStrong}>Veg only</Text>
          </View>
          <Switch value={vegOnly} onValueChange={setVegOnly} trackColor={{ true: C.green, false: C.line }} thumbColor={C.white} ios_backgroundColor={C.line} accessibilityLabel="Show vegetarian dishes only" />
        </View>

        {menu.length === 0 && <View style={st.section}><Empty title="No veg dishes here yet" body="Turn off Veg only to see the full menu." /></View>}
        {best.length > 0 && (
          <View style={st.section}>
            <Text style={[T.h2, st.secTitle]}>Bestsellers</Text>
            {best.map((m, i) => <ItemRow key={m.id} m={m} restaurant={restaurant} last={i === best.length - 1} />)}
          </View>
        )}
        {rest.length > 0 && (
          <View style={st.section}>
            <Text style={[T.h2, st.secTitle]}>{best.length ? 'More on the menu' : 'Menu'} <Text style={{ color: C.text3, fontWeight: '500' }}>({rest.length})</Text></Text>
            {rest.map((m, i) => <ItemRow key={m.id} m={m} restaurant={restaurant} last={i === rest.length - 1} />)}
          </View>
        )}
        <Text style={[T.small, { color: C.text3, textAlign: 'center', marginTop: S.xl, paddingHorizontal: S.xxl }]}>
          Prices are set by the restaurant. {feeLabel(r.deliveryFee)} on this kitchen.
        </Text>
      </Animated.ScrollView>

      <CollapsingTopBar y={y} title={r.name} fadeAt={IMG_H - 40} />
      {short > 0 && (
        <View style={[st.minNote, { bottom: barBottom + 70 }]} pointerEvents="none">
          <Text style={[T.small, { color: C.text, fontWeight: '600' }]}>Add {inr(short)} more to reach the {inr(r.minOrder)} minimum</Text>
        </View>
      )}
      <CartBar kind="eats" bottom={barBottom} />
    </View>
  );
}

const st = StyleSheet.create({
  info: { marginTop: -48, marginHorizontal: S.lg, backgroundColor: C.bg, borderRadius: R.lg, padding: S.xl, ...shadow },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: S.lg, paddingTop: S.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { ...T.bodyStrong, height: 24, lineHeight: 24 },
  statLbl: { fontSize: 11, color: C.text3, fontWeight: '500' },
  statSep: { width: StyleSheet.hairlineWidth, height: 32, backgroundColor: C.line },
  tag: { backgroundColor: C.greenSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagTxt: { color: C.greenDeep, fontSize: 11, fontWeight: '700' },
  vegRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: S.lg, marginTop: S.lg, paddingHorizontal: S.lg, height: 56, backgroundColor: C.bg, borderRadius: R.md },
  section: { marginTop: S.md, backgroundColor: C.bg, paddingHorizontal: S.lg, paddingTop: S.lg },
  secTitle: { marginBottom: 4 },
  item: { flexDirection: 'row', paddingVertical: S.xl },
  itemSep: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  best: { color: '#D97706', fontSize: 12, fontWeight: '700' },
  mrp: { color: C.text3, textDecorationLine: 'line-through', fontWeight: '400', fontSize: 13 },
  itemImg: { width: 128, height: 118, borderRadius: R.md, backgroundColor: C.bgSoft },
  minNote: { position: 'absolute', alignSelf: 'center', backgroundColor: '#FFF7E6', borderColor: '#FCD9A0', borderWidth: 1, borderRadius: R.pill, paddingHorizontal: 14, paddingVertical: 6 },
});
