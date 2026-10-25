import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { confirm, tintFor, initials } from '@/components/account/kit';
import { AddButton, Tap, styles as ui } from '@/components/ui';
import type { MenuItem, Restaurant } from '@/data/eats';
import type { Partner } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { C, R, S, T, inr, shadow } from '@/lib/theme';

export const feeLabel = (fee: number) => (fee === 0 ? 'Free delivery' : `${inr(fee)} delivery`);
const openRestaurant = (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } });

export function Rating({ value, small }: { value: number; small?: boolean }) {
  return (
    <View style={[e.rating, small && { paddingHorizontal: 5, height: 20 }]}>
      <Text style={[e.ratingTxt, small && { fontSize: 11 }]}>★ {value.toFixed(1)}</Text>
    </View>
  );
}

/** Veg / non-veg mark (the square-with-dot used on Indian menus). */
export function VegMark({ veg }: { veg: boolean }) {
  const c = veg ? '#16A34A' : '#B91C1C';
  return (
    <View style={[e.veg, { borderColor: c }]} accessibilityLabel={veg ? 'Vegetarian' : 'Non-vegetarian'}>
      <View style={[e.vegDot, { backgroundColor: c }, !veg && e.triangle]} />
    </View>
  );
}

/** Full-width restaurant card (16:9 photo). */
export function RestaurantCard({ r }: { r: Restaurant }) {
  const free = r.deliveryFee === 0;
  const tags = r.tags.filter(t => t.toLowerCase() !== 'free delivery');
  return (
    <Tap onPress={() => openRestaurant(r.id)} style={e.card} scale={0.985} accessibilityLabel={`${r.name}, ${r.cuisineType}`}>
      <View style={e.cardImg}>
        <Image source={r.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} recyclingKey={r.id} cachePolicy="memory-disk" />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.55)']} style={[StyleSheet.absoluteFill, { top: '55%' }]} />
        {free && <View style={e.freeTag}><Text style={e.freeTxt}>FREE DELIVERY</Text></View>}
        <View style={e.tagRow}>
          {tags.slice(0, 2).map(t => <View key={t} style={e.tag}><Text style={e.tagTxt}>{t}</Text></View>)}
        </View>
      </View>
      <View style={{ paddingHorizontal: 4, paddingTop: 10, gap: 3 }}>
        <View style={ui.rowBetween}>
          <Text style={[T.h3, { flex: 1 }]} numberOfLines={1}>{r.name}</Text>
          <Rating value={r.rating} />
        </View>
        <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{r.cuisine}</Text>
        <Text style={[T.small, { color: C.text, fontWeight: '600' }]}>
          {r.eta} <Text style={{ color: C.text3 }}>·</Text> Min {inr(r.minOrder)} <Text style={{ color: C.text3 }}>·</Text>{' '}
          <Text style={{ color: free ? C.greenDeep : C.text }}>{feeLabel(r.deliveryFee)}</Text>
        </Text>
      </View>
    </Tap>
  );
}

export const PICK_W = 248;
/** Compact card for horizontal rails. */
export function PickCard({ r }: { r: Restaurant }) {
  return (
    <Tap onPress={() => openRestaurant(r.id)} style={{ width: PICK_W }} scale={0.97}>
      <View style={[e.cardImg, { aspectRatio: 16 / 10 }]}>
        <Image source={r.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} recyclingKey={`pick-${r.id}`} cachePolicy="memory-disk" />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.7)']} style={[StyleSheet.absoluteFill, { top: '40%' }]} />
        <Text style={e.pickEta}>{r.eta}</Text>
      </View>
      <View style={[ui.rowBetween, { marginTop: 8, gap: 8 }]}>
        <Text style={[T.bodyStrong, { flex: 1 }]} numberOfLines={1}>{r.name}</Text>
        <Rating value={r.rating} small />
      </View>
      <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{r.cuisineType} · {feeLabel(r.deliveryFee)}</Text>
    </Tap>
  );
}

/** A restaurant that registered on partner.zyphix.in (no photo or menu yet). */
export function PartnerCard({ p }: { p: Partner }) {
  const tint = tintFor(p.name);
  return (
    <View style={e.partner}>
      <View style={[e.partnerTile, { backgroundColor: `${tint}18` }]}>
        <Text style={{ color: tint, fontWeight: '800', fontSize: 26 }}>{initials(p.name)}</Text>
      </View>
      <Text style={[T.bodyStrong, { marginTop: 8 }]} numberOfLines={1}>{p.name}</Text>
      <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{[p.category, p.locality || p.city].filter(Boolean).join(' · ') || 'Restaurant'}</Text>
      <View style={e.soon}><Text style={[T.tiny, { color: C.greenDeep }]}>MENU COMING SOON</Text></View>
    </View>
  );
}

/**
 * ADD for food. Food comes from one kitchen per order, so adding from a different restaurant
 * asks before replacing the current food cart.
 */
export function FoodAdd({ item, restaurant }: { item: MenuItem; restaurant: { id: string; name: string } }) {
  const cart = useCart();
  const line = { id: item.id, name: item.name, brand: restaurant.name, price: item.price, origPrice: item.origPrice, image: item.image };
  if (cart.qty('eats', item.id) > 0) return <AddButton kind="eats" item={line} restaurant={restaurant} compact />;
  const onAdd = () => {
    const cur = cart.eatsRestaurant;
    if (cur && cur.id !== restaurant.id && cart.count('eats') > 0) {
      confirm('Start a new food cart?', `Your cart has dishes from ${cur.name}. Adding this will replace them with your order from ${restaurant.name}.`, 'Replace cart',
        () => { cart.clear('eats'); cart.add('eats', line, restaurant); }, true);
      return;
    }
    cart.add('eats', line, restaurant);
  };
  return (
    <Tap onPress={onAdd} style={[ui.add, { height: 34, minWidth: 84, backgroundColor: C.bg }, shadow]} accessibilityLabel={`Add ${item.name}`}>
      <Text style={ui.addText}>ADD</Text>
    </Tap>
  );
}

export const e = StyleSheet.create({
  rating: { height: 24, paddingHorizontal: 7, borderRadius: 7, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  ratingTxt: { color: C.white, fontWeight: '800', fontSize: 12 },
  veg: { width: 15, height: 15, borderWidth: 1.5, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
  triangle: { borderRadius: 1, transform: [{ rotate: '45deg' }] },
  card: { marginHorizontal: S.lg, marginBottom: S.xxl },
  cardImg: { aspectRatio: 16 / 9, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.bgSoft },
  freeTag: { position: 'absolute', top: 10, left: 0, backgroundColor: C.green, paddingHorizontal: 8, paddingVertical: 4, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  freeTxt: { color: C.white, fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },
  tagRow: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', gap: 6 },
  tag: { backgroundColor: 'rgba(255,255,255,.92)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagTxt: { color: C.text, fontSize: 11, fontWeight: '700' },
  pickEta: { position: 'absolute', left: 10, bottom: 8, color: C.white, fontWeight: '800', fontSize: 13 },
  partner: { width: 168, borderRadius: R.md, borderWidth: 1, borderColor: C.line, padding: 12, backgroundColor: C.bg },
  partnerTile: { height: 84, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  soon: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: C.greenSoft, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
});
