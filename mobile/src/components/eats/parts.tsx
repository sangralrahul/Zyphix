/**
 * Zyphix Eats building blocks — Zomato-style restaurant cards, dish circles, filter chips,
 * menu rows with the ADD button overlapping the dish photo.
 */
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { confirm, tintFor, initials } from '@/components/account/kit';
import { Ico, K, RatingPill, VegMark as KitVegMark, type IconName } from '@/components/kit';
import { Tap } from '@/components/ui';
import { MENU, type MenuItem, type Restaurant } from '@/data/eats';
import type { Partner } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { COUPONS } from '@/lib/coupons';
import { C, inr } from '@/lib/theme';

export const feeLabel = (fee: number) => (fee === 0 ? 'Free delivery' : `${inr(fee)} delivery`);
export const etaMins = (r: Restaurant) => parseInt(r.eta, 10) || 30;
export const isPureVeg = (r: Restaurant) => { const m = MENU.filter(x => x.restaurantId === r.id); return m.length > 0 && m.every(x => x.isVeg); };
const openRestaurant = (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } });

/** A real coupon line for a restaurant (coupons apply to every kitchen). */
export function offerFor(r: Restaurant) {
  if (r.deliveryFee === 0) return { title: 'FREE DELIVERY', sub: 'on this kitchen', code: null as string | null };
  const c = r.minOrder >= 199 ? COUPONS.find(x => x.code === 'SAVE10')! : COUPONS.find(x => x.code === 'FREESHIP')!;
  return c.type === 'FREESHIP'
    ? { title: 'FREE DELIVERY', sub: `above ${inr(c.minOrder)} · ${c.code}`, code: c.code }
    : { title: `${c.value}% OFF`, sub: `up to ${inr(c.maxDiscount ?? 0)} · ${c.code}`, code: c.code };
}

/* ── Favourites (in-memory, per session) ─────────────────────────────────── */
const favs = new Set<string>();
const subs = new Set<() => void>();
let favVersion = 0;
const toggleFav = (id: string) => { favs.has(id) ? favs.delete(id) : favs.add(id); favVersion++; subs.forEach(f => f()); };
export function useFav(id: string): [boolean, () => void] {
  useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb); }; }, () => favVersion, () => favVersion);
  return [favs.has(id), () => toggleFav(id)];
}

export function Rating({ value, small }: { value: number; small?: boolean }) {
  return <RatingPill rating={value} size={small ? 'sm' : 'md'} />;
}
export const VegMark = KitVegMark;

/* ── Filter chip (Zomato) ───────────────────────────────────────────────── */
export function FilterChip({ label, icon, active, onPress, caret, count }: { label: string; icon?: IconName; active?: boolean; onPress: () => void; caret?: boolean; count?: number }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }}
      style={({ pressed }) => [e.chip, active && e.chipOn, pressed && { opacity: 0.7 }]}>
      {icon ? <Ico name={icon} size={14} color={active ? C.greenDeep : K.ink} /> : null}
      <Text style={[e.chipTxt, active && { color: C.greenDeep }]}>{label}</Text>
      {count ? <View style={e.chipCount}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{count}</Text></View> : null}
      {caret ? <Ico name="chevron-down" size={13} color={K.meta} /> : null}
      {active && !caret && !count ? <Ico name="close" size={14} color={C.greenDeep} /> : null}
    </Pressable>
  );
}

/* ── "What's on your mind?" dish circle ─────────────────────────────────── */
export function DishCircle({ label, image, active, onPress, size = 78 }: { label: string; image: string; active?: boolean; onPress: () => void; size?: number }) {
  return (
    <Tap onPress={onPress} style={{ width: size + 8, alignItems: 'center' }} accessibilityLabel={`${label} restaurants`} accessibilityState={{ selected: !!active }}>
      <View style={[e.dishRing, { width: size + 6, height: size + 6, borderRadius: (size + 6) / 2 }, active && { borderColor: C.green }]}>
        <Image source={image} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: K.imgBg }} contentFit="cover" recyclingKey={`dish-${label}`} transition={180} cachePolicy="memory-disk" />
      </View>
      <Text style={[e.dishLbl, active && { color: C.greenDeep, fontWeight: '800' }]} numberOfLines={1}>{label}</Text>
    </Tap>
  );
}

/* ── Big restaurant card (Zomato) ───────────────────────────────────────── */
export function RestaurantCard({ r }: { r: Restaurant }) {
  const [fav, toggle] = useFav(r.id);
  const off = offerFor(r);
  const badge = r.tags.find(t => t.toLowerCase() !== 'free delivery');
  return (
    <Tap onPress={() => openRestaurant(r.id)} style={e.card} scale={0.985} accessibilityLabel={`${r.name}, rated ${r.rating}, ${r.eta}`}>
      <View style={e.cardImg}>
        <Image source={r.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} recyclingKey={r.id} cachePolicy="memory-disk" />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.72)']} style={[StyleSheet.absoluteFill, { top: '45%' }]} />
        {badge ? <View style={e.badge}><Text style={e.badgeTxt}>{badge.toUpperCase()}</Text></View> : null}
        <Pressable onPress={toggle} hitSlop={8} style={e.heart} accessibilityRole="button" accessibilityLabel={fav ? 'Remove from favourites' : 'Save to favourites'}>
          <Ico name={fav ? 'heart' : 'heart-outline'} size={19} color={fav ? '#EF4444' : '#fff'} />
        </Pressable>
        <View style={e.offerOnImg}>
          <Text style={e.offerBig}>{off.title}</Text>
          <Text style={e.offerSmall}>{off.sub}</Text>
        </View>
        <View style={e.etaOnImg}>
          <Ico name="time" size={12} color={C.green} />
          <Text style={{ fontSize: 12, fontWeight: '800', color: K.ink }}>{etaMins(r)} mins</Text>
        </View>
      </View>
      <View style={{ padding: 12, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={e.name} numberOfLines={1}>{r.name}</Text>
          <RatingPill rating={r.rating} />
        </View>
        <Text style={e.cuisine} numberOfLines={1}>{r.cuisine}</Text>
        <View style={e.dash} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Meta icon="bicycle" text={feeLabel(r.deliveryFee)} color={r.deliveryFee === 0 ? C.greenDeep : undefined} />
          <Meta icon="bag-handle-outline" text={`${inr(r.minOrder)} min order`} />
          {isPureVeg(r) ? <Meta icon="leaf" text="Pure veg" color="#16A34A" /> : null}
        </View>
      </View>
    </Tap>
  );
}

function Meta({ icon, text, color }: { icon: IconName; text: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ico name={icon} size={14} color={color ?? K.meta} />
      <Text style={{ fontSize: 12.5, fontWeight: '600', color: color ?? '#374151' }}>{text}</Text>
    </View>
  );
}

/* ── Compact card for "Recommended for you" ─────────────────────────────── */
export const PICK_W = 142;
export function PickCard({ r }: { r: Restaurant }) {
  return (
    <Tap onPress={() => openRestaurant(r.id)} style={{ width: PICK_W }} scale={0.97} accessibilityLabel={`${r.name}, rated ${r.rating}`}>
      <View style={e.pickImg}>
        <Image source={r.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} recyclingKey={`pick-${r.id}`} cachePolicy="memory-disk" />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.65)']} style={[StyleSheet.absoluteFill, { top: '50%' }]} />
        <View style={{ position: 'absolute', left: 8, bottom: 8 }}><RatingPill rating={r.rating} size="sm" /></View>
        {r.deliveryFee === 0 ? <Text style={e.pickFree}>FREE DEL.</Text> : null}
      </View>
      <Text style={e.pickName} numberOfLines={1}>{r.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
        <Ico name="time-outline" size={12} color={K.meta} />
        <Text style={{ fontSize: 12, color: K.meta, fontWeight: '600' }} numberOfLines={1}>{etaMins(r)} mins · {r.cuisineType}</Text>
      </View>
    </Tap>
  );
}

/** A restaurant that registered on partner.zyphix.in (no photo or menu yet). */
export function PartnerCard({ p }: { p: Partner }) {
  const tint = tintFor(p.name);
  return (
    <View style={e.partner}>
      <View style={[e.partnerTile, { backgroundColor: `${tint}18` }]}>
        <Text style={{ color: tint, fontWeight: '900', fontSize: 26 }}>{initials(p.name)}</Text>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '700', color: K.ink, marginTop: 8 }} numberOfLines={1}>{p.name}</Text>
      <Text style={{ fontSize: 12, color: K.meta }} numberOfLines={1}>{[p.category, p.locality || p.city].filter(Boolean).join(' · ') || 'Restaurant'}</Text>
      <View style={e.soon}><Text style={{ fontSize: 9.5, fontWeight: '900', color: C.greenDeep, letterSpacing: 0.4 }}>MENU COMING SOON</Text></View>
    </View>
  );
}

/**
 * ADD for food (Zomato): white box with green "ADD" that turns into a green stepper.
 * Food comes from one kitchen per order, so adding from a different restaurant asks first.
 */
export function FoodAdd({ item, restaurant, compact }: { item: MenuItem; restaurant: { id: string; name: string }; /** Smaller box for list rows. */ compact?: boolean }) {
  const cart = useCart();
  const line = { id: item.id, name: item.name, brand: restaurant.name, price: item.price, origPrice: item.origPrice, image: item.image };
  const q = cart.qty('eats', item.id);
  if (q > 0) {
    return (
      <Animated.View entering={FadeIn.duration(140)} style={[e.addBox, e.stepper, compact && e.addCompact]}>
        <Pressable onPress={() => cart.remove('eats', item.id)} hitSlop={8} style={e.stepBtn} accessibilityLabel={`Remove one ${item.name}`}><Ico name="remove" size={18} color="#fff" /></Pressable>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>{q}</Text>
        <Pressable onPress={() => cart.add('eats', line, restaurant)} hitSlop={8} style={e.stepBtn} accessibilityLabel={`Add one more ${item.name}`}><Ico name="add" size={18} color="#fff" /></Pressable>
      </Animated.View>
    );
  }
  const onAdd = () => {
    const cur = cart.eatsRestaurant;
    if (cur && cur.id !== restaurant.id && cart.count('eats') > 0) {
      confirm('Replace cart items?', `Your cart has dishes from ${cur.name}. Adding this will replace them with your order from ${restaurant.name}.`, 'Replace',
        () => { cart.clear('eats'); cart.add('eats', line, restaurant); }, true);
      return;
    }
    cart.add('eats', line, restaurant);
  };
  return (
    <Tap onPress={onAdd} style={[e.addBox, compact && e.addCompact]} accessibilityLabel={`Add ${item.name}`}>
      <Text style={[e.addTxt, compact && { fontSize: 14 }]}>ADD</Text>
      <Text style={e.addPlus}>+</Text>
    </Tap>
  );
}

/** Zomato menu row: details left, photo right with ADD overlapping its bottom edge. */
export function MenuRow({ m, restaurant, last }: { m: MenuItem; restaurant: { id: string; name: string }; last?: boolean }) {
  const best = m.tag === 'Bestseller';
  const offTag = m.tag && !best ? m.tag : null;
  return (
    <View style={[e.item, !last && e.itemSep]}>
      <View style={{ flex: 1, paddingRight: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <VegMark veg={m.isVeg} />
          {best ? (
            <View style={e.bestTag}><Ico name="star" size={10} color="#E8590C" /><Text style={e.bestTxt}>Bestseller</Text></View>
          ) : null}
        </View>
        <Text style={e.itemName}>{m.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <Text style={e.itemPrice}>{inr(m.price)}</Text>
          {m.origPrice && m.origPrice > m.price ? <Text style={e.itemMrp}>{inr(m.origPrice)}</Text> : null}
        </View>
        {offTag ? (
          <View style={e.offRow}><Ico name="pricetag" size={11} color={K.blue} /><Text style={e.offTxt}>{offTag}</Text></View>
        ) : null}
        <Text style={e.itemDesc} numberOfLines={2}>{m.desc}</Text>
      </View>
      <View style={{ width: 128, alignItems: 'center' }}>
        <Image source={m.image} style={e.itemImg} contentFit="cover" recyclingKey={m.id} transition={200} cachePolicy="memory-disk" />
        <View style={{ marginTop: -20 }}><FoodAdd item={m} restaurant={restaurant} /></View>
      </View>
    </View>
  );
}

export const e = StyleSheet.create({
  chip: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, borderRadius: 10, borderWidth: 1, borderColor: '#DDE1E7', backgroundColor: '#fff' },
  chipOn: { borderColor: C.green, backgroundColor: '#ECFAF3' },
  chipTxt: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  chipCount: { minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  dishRing: { borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  dishLbl: { fontSize: 12.5, fontWeight: '600', color: '#374151', marginTop: 5, textAlign: 'center' },
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: K.line, overflow: 'hidden' },
  cardImg: { aspectRatio: 16 / 9, backgroundColor: K.imgBg, overflow: 'hidden' },
  badge: { position: 'absolute', top: 12, left: 0, backgroundColor: 'rgba(11,15,25,.78)', paddingHorizontal: 8, paddingVertical: 4, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  badgeTxt: { color: '#fff', fontWeight: '800', fontSize: 10, letterSpacing: 0.6 },
  heart: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,.28)', alignItems: 'center', justifyContent: 'center' },
  offerOnImg: { position: 'absolute', left: 12, bottom: 10 },
  offerBig: { color: '#fff', fontSize: 19, fontWeight: '900', letterSpacing: -0.3 },
  offerSmall: { color: 'rgba(255,255,255,.9)', fontSize: 11.5, fontWeight: '700', marginTop: -1 },
  etaOnImg: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 },
  name: { flex: 1, fontSize: 18, fontWeight: '800', color: K.ink, letterSpacing: -0.3 },
  cuisine: { fontSize: 13, color: K.meta, marginTop: 2 },
  dash: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#E1E4EA', marginVertical: 10 },
  pickImg: { width: PICK_W, height: PICK_W, borderRadius: 16, overflow: 'hidden', backgroundColor: K.imgBg },
  pickName: { fontSize: 14, fontWeight: '800', color: K.ink, marginTop: 7 },
  pickFree: { position: 'absolute', top: 8, left: 8, backgroundColor: C.green, color: '#fff', fontSize: 9.5, fontWeight: '900', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', letterSpacing: 0.3 },
  partner: { width: 160, borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 10, backgroundColor: '#fff' },
  partnerTile: { height: 80, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  soon: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: C.greenSoft, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  addBox: { width: 104, height: 38, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.green, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  addCompact: { width: 84, height: 34 },
  addTxt: { color: C.green, fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
  addPlus: { position: 'absolute', top: 1, right: 7, color: C.green, fontWeight: '800', fontSize: 13 },
  stepper: { backgroundColor: C.green, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  stepBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', paddingVertical: 18 },
  itemSep: { borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: '#E1E4EA' },
  bestTag: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FFF1E6', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  bestTxt: { color: '#E8590C', fontSize: 11, fontWeight: '800' },
  itemName: { fontSize: 16.5, lineHeight: 21, fontWeight: '700', color: K.ink, marginTop: 6 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: K.ink },
  itemMrp: { fontSize: 13, color: '#9CA3AF', textDecorationLine: 'line-through' },
  offRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  offTxt: { color: K.blue, fontSize: 12, fontWeight: '800' },
  itemDesc: { fontSize: 13, lineHeight: 18, color: K.meta, marginTop: 6 },
  itemImg: { width: 128, height: 128, borderRadius: 16, backgroundColor: K.imgBg },
});
