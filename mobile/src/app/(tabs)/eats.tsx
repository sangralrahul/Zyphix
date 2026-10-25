import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, useAnimatedReaction, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useLightStatusBar, useTabBottom } from '@/components/account/kit';
import { PartnerCard, PickCard, PICK_W, RestaurantCard, VegMark } from '@/components/eats/parts';
import { CartBar, Chip, Empty, HeroVideo, SectionHeader, Tap, styles as ui } from '@/components/ui';
import { CUISINES, MENU, RESTAURANTS } from '@/data/eats';
import { CLIPS, PHOTO } from '@/data/media';
import { Api } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { C, R, S, T, inr, shadow } from '@/lib/theme';

const HERO = 300;
const CUISINE_PHOTO: Record<string, string> = { 'North Indian': PHOTO.thali, Biryani: PHOTO.biryani, 'Chai & Snacks': PHOTO.streetFood };
/** Only cuisines that actually have kitchens (no dead-end filters). */
const LIVE_CUISINES = CUISINES.filter(c => c === 'All' || RESTAURANTS.some(r => r.cuisineType === c));
const TILES = LIVE_CUISINES.filter(c => c !== 'All').map(c => ({ name: c, image: CUISINE_PHOTO[c] ?? RESTAURANTS.find(r => r.cuisineType === c)!.image }));
const PICKS = [...RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 6);

function SearchField({ value, onChange, autoFocus }: { value: string; onChange: (s: string) => void; autoFocus?: boolean }) {
  return (
    <View style={st.search}>
      <Text style={st.searchIcon}>⌕</Text>
      <TextInput value={value} onChangeText={onChange} autoFocus={autoFocus} placeholder="Search restaurants or dishes" placeholderTextColor={C.text3}
        style={st.searchInput} returnKeyType="search" autoCorrect={false} clearButtonMode="never" accessibilityLabel="Search restaurants or dishes" />
      {value.length > 0 && (
        <Pressable onPress={() => onChange('')} hitSlop={10} accessibilityLabel="Clear search" style={st.clear}><Text style={{ color: C.white, fontSize: 12, fontWeight: '800' }}>✕</Text></Pressable>
      )}
    </View>
  );
}

export default function Eats() {
  useLightStatusBar();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const tabBottom = useTabBottom();
  const cart = useCart();
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [stuck, setStuck] = useState(false);
  const partners = useQuery({ queryKey: ['partners', 'restaurant'], queryFn: () => Api.partners('restaurant') });

  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(ev => { y.value = ev.contentOffset.y; });
  useAnimatedReaction(() => y.value > HERO + insets.top - 40, (now, prev) => { if (now !== prev) scheduleOnRN(setStuck, now); });

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return null;
    const rs = RESTAURANTS.filter(r => `${r.name} ${r.cuisine} ${r.cuisineType}`.toLowerCase().includes(query));
    const ds = MENU.filter(m => `${m.name} ${m.desc}`.toLowerCase().includes(query)).slice(0, 12);
    return { rs, ds };
  }, [query]);
  const list = cuisine === 'All' ? RESTAURANTS : RESTAURANTS.filter(r => r.cuisineType === cuisine);
  const newOnes = partners.data ?? [];

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: C.bg }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: tabBottom + (cart.count('eats') ? 90 : 24) }} showsVerticalScrollIndicator={false}>
        <HeroVideo clip={CLIPS.cooking} height={HERO}>
          <Text style={st.kicker}>ZYPHIX EATS</Text>
          <Text style={[T.display, { color: C.white }]}>
            Your city&apos;s best kitchens, at your <Text style={[T.accent, { color: C.mint }]}>door</Text>.
          </Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,.8)', marginTop: 8 }]}>Local favourites, cooked fresh and brought over hot.</Text>
        </HeroVideo>

        <View style={st.searchWrap}><SearchField value={q} onChange={setQ} /></View>

        {results ? (
          // minHeight keeps the scroll position stable while typing in the pinned search bar.
          <Animated.View entering={FadeIn.duration(180)} key="results" style={{ minHeight: height }}>
            {results.rs.length === 0 && results.ds.length === 0 && (
              <Empty title={`Nothing for “${q.trim()}”`} body="Try a dish like biryani, dosa or paneer — or a restaurant name." />
            )}
            {results.rs.length > 0 && <SectionHeader title="Restaurants" style={{ marginTop: S.lg }} />}
            {results.rs.map(r => <RestaurantCard key={r.id} r={r} />)}
            {results.ds.length > 0 && <SectionHeader title="Dishes" style={{ marginTop: results.rs.length ? 0 : S.lg }} />}
            {results.ds.map(d => {
              const r = RESTAURANTS.find(x => x.id === d.restaurantId);
              return (
                <Tap key={d.id} onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: d.restaurantId } })} style={st.dish} scale={0.98}>
                  <Image source={d.image} style={st.dishImg} contentFit="cover" recyclingKey={d.id} transition={150} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={ui.row}><VegMark veg={d.isVeg} /><Text style={[T.bodyStrong, { flex: 1 }]} numberOfLines={1}>{d.name}</Text></View>
                    <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{r?.name} · {r?.eta}</Text>
                    <Text style={[T.small, { fontWeight: '700' }]}>{inr(d.price)}</Text>
                  </View>
                  <Text style={{ color: C.text3, fontSize: 22 }}>›</Text>
                </Tap>
              );
            })}
          </Animated.View>
        ) : (
          <View key="browse">
            <SectionHeader title="What's on your mind?" style={{ marginTop: S.lg }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 14 }}>
              {TILES.map(t => {
                const on = cuisine === t.name;
                return (
                  <Tap key={t.name} onPress={() => setCuisine(on ? 'All' : t.name)} style={{ width: 84, alignItems: 'center' }} accessibilityLabel={`${t.name} kitchens`} accessibilityState={{ selected: on }}>
                    <View style={[st.tile, on && { borderColor: C.green }]}>
                      <Image source={t.image} style={st.tileImg} contentFit="cover" recyclingKey={`c-${t.name}`} transition={200} />
                    </View>
                    <Text style={[T.small, { fontWeight: on ? '700' : '500', marginTop: 6, textAlign: 'center', color: on ? C.greenDeep : C.text }]} numberOfLines={1}>{t.name}</Text>
                  </Tap>
                );
              })}
            </ScrollView>

            <SectionHeader title="Tonight's picks" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={PICK_W + 12} decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12 }}>
              {PICKS.map(r => <PickCard key={r.id} r={r} />)}
            </ScrollView>

            {newOnes.length > 0 && (
              <Animated.View entering={FadeInDown.duration(300)}>
                <SectionHeader title="New on Zyphix" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12 }}>
                  {newOnes.map(p => <PartnerCard key={p.id} p={p} />)}
                </ScrollView>
              </Animated.View>
            )}

            <SectionHeader title={cuisine === 'All' ? 'All restaurants' : `${cuisine} kitchens`} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 8, paddingBottom: S.lg }}>
              {LIVE_CUISINES.map(c => <Chip key={c} label={c} active={cuisine === c} onPress={() => setCuisine(c)} />)}
            </ScrollView>
            {list.map((r, i) => (
              <Animated.View key={`${cuisine}-${r.id}`} entering={FadeInDown.delay(Math.min(i, 4) * 40).duration(260)}>
                <RestaurantCard r={r} />
              </Animated.View>
            ))}
          </View>
        )}
      </Animated.ScrollView>

      {stuck && (
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(120)} style={[st.stickyBar, { paddingTop: insets.top + 6 }]}>
          <SearchField value={q} onChange={setQ} />
        </Animated.View>
      )}
      <CartBar kind="eats" bottom={tabBottom} />
    </View>
  );
}

const st = StyleSheet.create({
  kicker: { color: C.mint, fontWeight: '800', fontSize: 12, letterSpacing: 1.6, marginBottom: 8 },
  searchWrap: { paddingHorizontal: S.lg, paddingTop: S.lg },
  search: { height: 50, borderRadius: R.md, backgroundColor: C.bgSoft, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  searchIcon: { fontSize: 22, color: C.text2, marginTop: -3 },
  searchInput: { flex: 1, fontSize: 16, color: C.text, height: '100%' },
  clear: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.text3, alignItems: 'center', justifyContent: 'center' },
  stickyBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: C.bg, paddingHorizontal: S.lg, paddingBottom: 10, ...shadow },
  tile: { width: 76, height: 76, borderRadius: 38, borderWidth: 2.5, borderColor: 'transparent', padding: 2 },
  tileImg: { flex: 1, borderRadius: 36, backgroundColor: C.bgSoft },
  dish: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: S.lg, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  dishImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: C.bgSoft },
});
