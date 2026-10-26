import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Extrapolation, FadeIn, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { noOutline } from '@/components/account/kit';
import { FloatingCart, Ico, K, RatingPill } from '@/components/kit';
import { FilterChip, MenuRow, VegMark, etaMins, feeLabel, isPureVeg, useFav } from '@/components/eats/parts';
import { Sheet } from '@/components/eats/Sheet';
import { Empty, Tap } from '@/components/ui';
import { MENU, RESTAURANTS, type MenuItem } from '@/data/eats';
import { useCart } from '@/lib/cart';
import { COUPONS } from '@/lib/coupons';
import { C, inr } from '@/lib/theme';

const COURSES: [RegExp, string][] = [
  [/biryani/i, 'Biryani'], [/pizza/i, 'Pizzas'], [/pasta/i, 'Pasta'], [/burger/i, 'Burgers'], [/momo/i, 'Momos'],
  [/dosa|idli/i, 'South Indian'], [/kebab|tikka/i, 'Starters'], [/naan|roti|paratha/i, 'Breads'],
  [/chai|coffee|lassi|shake/i, 'Beverages'], [/jamun|katli|halwa|kheer/i, 'Desserts'], [/bowl|salad/i, 'Bowls'], [/maggi/i, 'Snacks'],
];
const courseOf = (m: MenuItem) => COURSES.find(([re]) => re.test(m.name))?.[1] ?? 'Main course';
const OFFERS = COUPONS.filter(c => ['WELCOME50', 'SAVE10', 'FREESHIP', 'SAVE20'].includes(c.code));
const offerTitle = (c: (typeof COUPONS)[number]) => c.type === 'FLAT' ? `Flat ${inr(c.value)} OFF` : c.type === 'PERCENT' ? `${c.value}% OFF up to ${inr(c.maxDiscount ?? 0)}` : 'Free delivery';

type Section = { key: string; title: string; items: MenuItem[] };

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const r = RESTAURANTS.find(x => x.id === id);
  const [diet, setDiet] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [bestOnly, setBestOnly] = useState(false);
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [fav, toggleFav] = useFav(id ?? '');
  const scroll = useRef<Animated.ScrollView>(null);
  const secY = useRef<Record<string, number>>({});
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(ev => { y.value = ev.contentOffset.y; });
  const titleStyle = useAnimatedStyle(() => ({ opacity: interpolate(y.value, [40, 90], [0, 1], Extrapolation.CLAMP) }));
  const barShadow = useAnimatedStyle(() => ({ borderBottomColor: y.value > 20 ? K.line : 'transparent' }));

  const sections = useMemo<Section[]>(() => {
    if (!r) return [];
    const query = q.trim().toLowerCase();
    const items = MENU.filter(m => m.restaurantId === r.id
      && (diet === 'all' || (diet === 'veg' ? m.isVeg : !m.isVeg))
      && (!bestOnly || m.tag === 'Bestseller')
      && (!query || `${m.name} ${m.desc}`.toLowerCase().includes(query)));
    if (query) return items.length ? [{ key: 'results', title: `Results for “${q.trim()}”`, items }] : [];
    const out: Section[] = [];
    // Bestsellers first, then the best deals — up to three dishes.
    const deal = (m: MenuItem) => (m.origPrice && m.origPrice > m.price ? 1 - m.price / m.origPrice : 0);
    const recommended = [...items.filter(m => m.tag === 'Bestseller'), ...items.filter(m => m.tag !== 'Bestseller').sort((a, b) => deal(b) - deal(a))].slice(0, 3);
    if (recommended.length && items.length > 2) out.push({ key: 'rec', title: 'Recommended', items: recommended });
    const byCourse = new Map<string, MenuItem[]>();
    items.forEach(m => { const c = courseOf(m); byCourse.set(c, [...(byCourse.get(c) ?? []), m]); });
    byCourse.forEach((v, k) => out.push({ key: k, title: k, items: v }));
    return out;
  }, [r, diet, bestOnly, q]);

  if (!r) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: insets.top }}>
        <Stack.Screen options={{ headerShown: true, title: '' }} />
        <Empty title="Restaurant not found" body="It may have moved or closed for now." action="Browse restaurants" onAction={() => router.replace('/eats')} />
      </View>
    );
  }
  const restaurant = { id: r.id, name: r.name };
  const inCart = cart.eatsRestaurant?.id === r.id ? cart.subtotal('eats') : 0;
  const short = inCart > 0 && inCart < r.minOrder ? r.minOrder - inCart : 0;
  const hasCart = cart.count('eats') > 0;
  const barBottom = insets.bottom + 12;
  const topH = insets.top + 52;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/eats'));
  const share = () => { Share.share({ message: `${r.name} on Zyphix Eats — https://zyphix.in/eats` }).catch(() => {}); };
  const veg = isPureVeg(r);
  const total = MENU.filter(m => m.restaurantId === r.id).length;

  return (
    <View style={{ flex: 1, backgroundColor: K.page }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: topH, paddingBottom: barBottom + (hasCart ? 150 : 90) }}>
        {/* Info */}
        <Animated.View entering={FadeInDown.duration(320)} style={st.info}>
          {veg ? <View style={st.pureVeg}><Ico name="leaf" size={11} color="#16A34A" /><Text style={st.pureVegTxt}>PURE VEG</Text></View> : null}
          <Text style={st.name}>{r.name}</Text>
          <Text style={st.cuisine} numberOfLines={2}>{r.cuisine}</Text>
          <View style={st.ratingRow}>
            <RatingPill rating={r.rating} />
            <Text style={st.ratingLbl}>Zyphix rating</Text>
          </View>
          <View style={st.deliveryBox}>
            <View style={st.dRow}>
              <Ico name="time" size={15} color={C.green} />
              <Text style={st.dStrong}>{etaMins(r)} mins</Text>
              <Text style={st.dMeta}>· Delivery to your door</Text>
            </View>
            <View style={st.dSep} />
            <View style={st.dRow}>
              <Ico name="bicycle" size={15} color={r.deliveryFee === 0 ? C.green : K.meta} />
              <Text style={[st.dStrong, r.deliveryFee === 0 && { color: C.greenDeep }]}>{feeLabel(r.deliveryFee)}</Text>
              <Text style={st.dMeta}>· {inr(r.minOrder)} minimum order</Text>
            </View>
          </View>
        </Animated.View>

        {/* Offers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingTop: 14 }}>
          {OFFERS.map(c => (
            <Tap key={c.code} onPress={() => router.push({ pathname: '/cart', params: { kind: 'eats', coupon: c.code } })} style={st.offer} scale={0.97} accessibilityLabel={`${offerTitle(c)}, code ${c.code}`}>
              <View style={st.offerIcon}><Ico name={c.type === 'FREESHIP' ? 'bicycle' : 'pricetag'} size={16} color="#fff" /></View>
              <View style={{ flex: 1 }}>
                <Text style={st.offerTitle} numberOfLines={1}>{offerTitle(c)}</Text>
                <Text style={st.offerSub} numberOfLines={1}>Use {c.code} · above {inr(c.minOrder)}</Text>
              </View>
            </Tap>
          ))}
        </ScrollView>

        {/* Toggles */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 16, paddingBottom: 4 }}>
          {!veg ? (
            <>
              <Pressable onPress={() => setDiet(d => (d === 'veg' ? 'all' : 'veg'))} style={[st.diet, diet === 'veg' && st.dietOnVeg]} accessibilityRole="switch" accessibilityState={{ checked: diet === 'veg' }}>
                <VegMark veg />
                <Text style={st.dietTxt}>Veg</Text>
                <View style={[st.track, diet === 'veg' && { backgroundColor: '#16A34A' }]}><View style={[st.knob, diet === 'veg' && { marginLeft: 12 }]} /></View>
              </Pressable>
              <Pressable onPress={() => setDiet(d => (d === 'nonveg' ? 'all' : 'nonveg'))} style={[st.diet, diet === 'nonveg' && st.dietOnNon]} accessibilityRole="switch" accessibilityState={{ checked: diet === 'nonveg' }}>
                <VegMark veg={false} />
                <Text style={st.dietTxt}>Non-veg</Text>
                <View style={[st.track, diet === 'nonveg' && { backgroundColor: '#B91C1C' }]}><View style={[st.knob, diet === 'nonveg' && { marginLeft: 12 }]} /></View>
              </Pressable>
            </>
          ) : null}
          <FilterChip label="Bestseller" icon="star-outline" active={bestOnly} onPress={() => setBestOnly(b => !b)} />
        </ScrollView>

        {/* Menu */}
        {sections.length === 0 ? (
          <View style={[st.section, { paddingVertical: 8 }]}>
            <Empty title="Nothing here" body={q ? `No dish matches “${q.trim()}”.` : 'No dishes match these filters.'} action="Show full menu" onAction={() => { setDiet('all'); setBestOnly(false); setQ(''); }} />
          </View>
        ) : sections.map(sec => {
          const isClosed = closed[sec.key];
          return (
            <View key={sec.key} style={st.section} onLayout={ev => { secY.current[sec.key] = ev.nativeEvent.layout.y; }}>
              <Pressable onPress={() => setClosed(c => ({ ...c, [sec.key]: !c[sec.key] }))} style={st.secHead} accessibilityRole="button" accessibilityState={{ expanded: !isClosed }}>
                <Text style={st.secTitle}>{sec.title} <Text style={st.secCount}>({sec.items.length})</Text></Text>
                <Ico name={isClosed ? 'chevron-down' : 'chevron-up'} size={20} color={K.ink} />
              </Pressable>
              {!isClosed ? sec.items.map((m, i) => <MenuRow key={`${sec.key}-${m.id}`} m={m} restaurant={restaurant} last={i === sec.items.length - 1} />) : null}
            </View>
          );
        })}
        <Text style={st.legal}>Prices are set by the restaurant. {feeLabel(r.deliveryFee)} on this kitchen. {total} dishes on the menu.</Text>
      </Animated.ScrollView>

      {/* Top bar */}
      <Animated.View style={[st.bar, { paddingTop: insets.top, height: topH }, barShadow]}>
        <Pressable onPress={back} hitSlop={8} style={st.barBtn} accessibilityRole="button" accessibilityLabel="Back"><Ico name="chevron-back" size={24} color={K.ink} /></Pressable>
        {searching ? (
          <Animated.View entering={FadeIn.duration(150)} style={st.barSearch}>
            <Ico name="search" size={17} color={C.green} />
            <TextInput value={q} onChangeText={setQ} autoFocus placeholder={`Search in ${r.name}`} placeholderTextColor="#8A919C" style={{ flex: 1, fontSize: 15, color: K.ink, height: '100%', ...noOutline }} returnKeyType="search" accessibilityLabel="Search this menu" />
            <Pressable onPress={() => { setQ(''); setSearching(false); }} hitSlop={8} accessibilityLabel="Close search"><Ico name="close" size={18} color={K.meta} /></Pressable>
          </Animated.View>
        ) : (
          <>
            <Animated.Text style={[st.barTitle, titleStyle]} numberOfLines={1}>{r.name}</Animated.Text>
            <Pressable onPress={() => setSearching(true)} hitSlop={8} style={st.barBtn} accessibilityRole="button" accessibilityLabel="Search menu"><Ico name="search" size={21} color={K.ink} /></Pressable>
            <Pressable onPress={toggleFav} hitSlop={8} style={st.barBtn} accessibilityRole="button" accessibilityLabel={fav ? 'Remove from favourites' : 'Save to favourites'}><Ico name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#EF4444' : K.ink} /></Pressable>
            <Pressable onPress={share} hitSlop={8} style={st.barBtn} accessibilityRole="button" accessibilityLabel="Share"><Ico name="share-social-outline" size={21} color={K.ink} /></Pressable>
          </>
        )}
      </Animated.View>

      {short > 0 ? (
        <View style={[st.minNote, { bottom: barBottom + 132 }]} pointerEvents="none">
          <Ico name="information-circle" size={14} color="#B45309" />
          <Text style={{ fontSize: 12.5, color: '#92400E', fontWeight: '700' }}>Add {inr(short)} more for the {inr(r.minOrder)} minimum</Text>
        </View>
      ) : null}
      {sections.length > 1 ? (
        <Tap onPress={() => setMenuOpen(true)} style={[st.fab, { bottom: barBottom + (hasCart ? 76 : 8) }]} accessibilityLabel="Jump to a menu section">
          <Ico name="restaurant" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Menu</Text>
        </Tap>
      ) : null}
      <FloatingCart kind="eats" bottom={barBottom} />

      <Sheet visible={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <ScrollView contentContainerStyle={{ paddingVertical: 6 }}>
          {sections.map(sec => (
            <Pressable key={sec.key} style={st.jumpRow} onPress={() => {
              setMenuOpen(false);
              setClosed(c => ({ ...c, [sec.key]: false }));
              setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, (secY.current[sec.key] ?? 0) - topH - 4), animated: true }), 80);
            }}>
              <Text style={{ fontSize: 15.5, fontWeight: '700', color: K.ink }}>{sec.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: K.meta }}>{sec.items.length}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}

const st = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderBottomWidth: 1 },
  barBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  barTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: K.ink, marginLeft: 2 },
  barSearch: { flex: 1, height: 40, marginRight: 10, borderRadius: 12, backgroundColor: '#F3F5F9', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  info: { backgroundColor: '#fff', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderBottomWidth: 1, borderColor: K.line },
  pureVeg: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF3', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginBottom: 6 },
  pureVegTxt: { fontSize: 10, fontWeight: '900', color: '#16A34A', letterSpacing: 0.6 },
  name: { fontSize: 26, fontWeight: '900', color: K.ink, letterSpacing: -0.6, textAlign: 'center' },
  cuisine: { fontSize: 13.5, color: K.meta, marginTop: 4, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  ratingLbl: { fontSize: 12.5, color: K.meta, fontWeight: '600', textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  deliveryBox: { alignSelf: 'stretch', marginTop: 16, backgroundColor: '#F6F7FA', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4 },
  dRow: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 38 },
  dStrong: { fontSize: 13.5, fontWeight: '800', color: K.ink },
  dMeta: { fontSize: 13, color: K.meta, flexShrink: 1 },
  dSep: { height: 1, backgroundColor: '#E6E9EF' },
  offer: { width: 262, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line },
  offerIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: K.blue, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 14, fontWeight: '800', color: K.ink },
  offerSub: { fontSize: 11.5, fontWeight: '600', color: K.meta, marginTop: 1 },
  diet: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#DDE1E7', backgroundColor: '#fff' },
  dietOnVeg: { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
  dietOnNon: { borderColor: '#B91C1C', backgroundColor: '#FEF2F2' },
  dietTxt: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  track: { width: 26, height: 14, borderRadius: 7, backgroundColor: '#D1D5DB', justifyContent: 'center', paddingHorizontal: 1 },
  knob: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' },
  section: { marginTop: 12, backgroundColor: '#fff', paddingHorizontal: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: K.line },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 2 },
  secTitle: { fontSize: 19, fontWeight: '900', color: K.ink, letterSpacing: -0.3 },
  secCount: { fontSize: 15, fontWeight: '600', color: K.meta },
  legal: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 18, paddingHorizontal: 28 },
  minNote: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF7E6', borderColor: '#FCD9A0', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  fab: { position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#1F2430', borderRadius: 24, paddingHorizontal: 16, height: 46, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 6 },
  jumpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, height: 50 },
});
