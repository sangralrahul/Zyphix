import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ScrollViewInstance } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { noOutline } from '@/components/account/kit';
import { AddressRow, AvatarButton, FloatingCart, Ico, K, OfferCarousel, RatingPill, useFloatBottom } from '@/components/kit';
import { DishCircle, FilterChip, FoodAdd, PartnerCard, PickCard, PICK_W, RestaurantCard, VegMark, etaMins } from '@/components/eats/parts';
import { ALL, DISHES, FLAG_LABELS, NO_FLAGS, SORTS, applyFilters, type Flags, type SortKey } from '@/components/eats/filters';
import { Sheet } from '@/components/eats/Sheet';
import { Button, Tap } from '@/components/ui';
import { MENU, RESTAURANTS } from '@/data/eats';
import { Api } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { COUPONS } from '@/lib/coupons';
import { C, inr } from '@/lib/theme';

const EATS_COUPONS = COUPONS.filter(c => ['WELCOME50', 'SAVE10', 'FREESHIP', 'SAVE20'].includes(c.code));
const OFFER_IMAGES = ['m8', 'm5', 'm16', 'm24', 'm18', 'm1', 'm21', 'm13', 'm22', 'm15', 'm11', 'm7'].map(id => MENU.find(m => m.id === id)!.image);
const PICKS = [...RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 6);
const WORDS = ['biryani', 'pizza', 'masala dosa', 'momos', 'paneer', 'burger', 'chai'];

/** Centered, letter-spaced section heading with rules on both sides (Zomato). */
function ZHead({ title }: { title: string }) {
  return (
    <View style={st.zhead}>
      <View style={st.zline} />
      <Text style={st.zheadTxt}>{title}</Text>
      <View style={st.zline} />
    </View>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const [i, setI] = useState(0);
  React.useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % WORDS.length), 2200); return () => clearInterval(t); }, []);
  return (
    <View style={st.search}>
      <Ico name="search" size={19} color={C.green} />
      <TextInput value={value} onChangeText={onChange} placeholder={`Search “${WORDS[i]}”`} placeholderTextColor="#8A919C"
        style={st.searchInput} returnKeyType="search" autoCorrect={false} accessibilityLabel="Search restaurants or dishes" />
      {value.length > 0 ? (
        <Pressable onPress={() => onChange('')} hitSlop={10} accessibilityLabel="Clear search"><Ico name="close-circle" size={18} color="#9CA3AF" /></Pressable>
      ) : null}
      <View style={st.searchDiv} />
      <Ico name="mic-outline" size={19} color={C.green} />
    </View>
  );
}

export default function Eats() {
  const insets = useSafeAreaInsets();
  const floatBottom = useFloatBottom();
  const cart = useCart();
  useFocusEffect(useCallback(() => { setStatusBarStyle('dark', true); }, []));
  const scroll = useRef<ScrollViewInstance>(null);
  const listY = useRef(0);
  const browseY = useRef(0);
  const stickyH = useRef(120);
  const [q, setQ] = useState('');
  const [flags, setFlags] = useState<Flags>(NO_FLAGS);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [dish, setDish] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState<{ flags: Flags; sort: SortKey }>({ flags: NO_FLAGS, sort: 'relevance' });
  const partners = useQuery({ queryKey: ['partners', 'restaurant'], queryFn: () => Api.partners('restaurant') });

  const activeCount = Object.values(flags).filter(Boolean).length + (sort !== 'relevance' ? 1 : 0);
  const list = useMemo(() => applyFilters(ALL, flags, sort, dish), [flags, sort, dish]);
  const filtered = activeCount > 0 || !!dish;
  const jump = () => setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, browseY.current + listY.current - stickyH.current + 8), animated: true }), 60);
  const toggle = (k: keyof Flags) => { setFlags(f => ({ ...f, [k]: !f[k] })); jump(); };
  const pickDish = (label: string) => { setDish(d => (d === label ? null : label)); jump(); };
  const clearAll = () => { setFlags(NO_FLAGS); setSort('relevance'); setDish(null); };

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return null;
    const rs = RESTAURANTS.filter(r => `${r.name} ${r.cuisine} ${r.cuisineType}`.toLowerCase().includes(query));
    const ds = MENU.filter(m => `${m.name} ${m.desc}`.toLowerCase().includes(query)).slice(0, 12);
    return { rs, ds };
  }, [query]);

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: K.page }}>
      <ScrollView ref={scroll} stickyHeaderIndices={[1]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: floatBottom + (cart.count('eats') ? 96 : 28) }}>
        {/* 0 — location header */}
        <View style={[st.top, { paddingTop: insets.top + 10 }]}>
          <View style={st.pin}><Ico name="location" size={20} color={C.green} /></View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={st.brand}>ZYPHIX EATS</Text>
            <AddressRow light={false} />
          </View>
          <AvatarButton light={false} />
        </View>

        {/* 1 — sticky search + filters */}
        <View style={st.sticky} onLayout={ev => { stickyH.current = ev.nativeEvent.layout.height; }}>
          <SearchBox value={q} onChange={setQ} />
          {!results ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 10 }}>
              <FilterChip label="Filters" icon="options-outline" count={activeCount || undefined} active={activeCount > 0} caret={!activeCount}
                onPress={() => { setDraft({ flags, sort }); setSheet(true); }} />
              {dish ? <FilterChip label={dish} icon="restaurant-outline" active onPress={() => setDish(null)} /> : null}
              {FLAG_LABELS.map(f => <FilterChip key={f.key} label={f.label} active={flags[f.key]} onPress={() => toggle(f.key)} />)}
            </ScrollView>
          ) : null}
        </View>

        {/* 2 — content */}
        {results ? (
          <Animated.View entering={FadeIn.duration(160)} key="results" style={{ minHeight: 600, paddingTop: 8 }}>
            {results.rs.length === 0 && results.ds.length === 0 ? (
              <View style={st.empty}>
                <View style={st.emptyIcon}><Ico name="search" size={30} color={C.green} /></View>
                <Text style={st.emptyTitle}>No match for “{q.trim()}”</Text>
                <Text style={st.emptyBody}>Try a dish like biryani, dosa or paneer — or a restaurant name.</Text>
              </View>
            ) : null}
            {results.rs.length > 0 ? <Text style={st.resHead}>RESTAURANTS</Text> : null}
            {results.rs.map(r => (
              <Tap key={r.id} onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: r.id } })} style={st.resRow} scale={0.98}>
                <Image source={r.image} style={st.resImg} contentFit="cover" recyclingKey={`rs-${r.id}`} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={st.resName} numberOfLines={1}>{r.name}</Text>
                  <Text style={st.resMeta} numberOfLines={1}>{r.cuisine}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <RatingPill rating={r.rating} size="sm" />
                    <Text style={st.resMeta}>{etaMins(r)} mins</Text>
                  </View>
                </View>
                <Ico name="chevron-forward" size={18} color="#9CA3AF" />
              </Tap>
            ))}
            {results.ds.length > 0 ? <Text style={st.resHead}>DISHES</Text> : null}
            {results.ds.map(d => {
              const r = RESTAURANTS.find(x => x.id === d.restaurantId)!;
              return (
                <View key={d.id} style={st.resRow}>
                  <Image source={d.image} style={st.resImg} contentFit="cover" recyclingKey={`ds-${d.id}`} />
                  <Pressable style={{ flex: 1, gap: 3 }} onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: r.id } })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><VegMark veg={d.isVeg} /><Text style={[st.resName, { flex: 1 }]} numberOfLines={1}>{d.name}</Text></View>
                    <Text style={st.resMeta} numberOfLines={1}>{r.name} · {etaMins(r)} mins</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: K.ink }}>{inr(d.price)}</Text>
                  </Pressable>
                  <FoodAdd item={d} restaurant={{ id: r.id, name: r.name }} compact />
                </View>
              );
            })}
          </Animated.View>
        ) : (
          <View key="browse" onLayout={ev => { browseY.current = ev.nativeEvent.layout.y; }}>
            <OfferCarousel coupons={EATS_COUPONS} images={OFFER_IMAGES} kind="eats" height={140} />

            <ZHead title="WHAT'S ON YOUR MIND?" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
              {Array.from({ length: Math.ceil(DISHES.length / 2) }, (_, col) => (
                <View key={col} style={{ gap: 14, marginRight: 6 }}>
                  {DISHES.slice(col * 2, col * 2 + 2).map(d => <DishCircle key={d.label} label={d.label} image={d.image} active={dish === d.label} onPress={() => pickDish(d.label)} />)}
                </View>
              ))}
            </ScrollView>

            <ZHead title="RECOMMENDED FOR YOU" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={PICK_W + 12} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {PICKS.map(r => <PickCard key={r.id} r={r} />)}
            </ScrollView>

            {(partners.data?.length ?? 0) > 0 ? (
              <Animated.View entering={FadeInDown.duration(300)}>
                <ZHead title="NEW ON ZYPHIX" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                  {partners.data!.map(p => <PartnerCard key={p.id} p={p} />)}
                </ScrollView>
              </Animated.View>
            ) : null}

            <View onLayout={ev => { listY.current = ev.nativeEvent.layout.y; }}>
              <ZHead title={filtered ? `${list.length} RESTAURANT${list.length === 1 ? '' : 'S'}${dish ? ` · ${dish.toUpperCase()}` : ''}` : `ALL ${RESTAURANTS.length} RESTAURANTS`} />
            </View>
            {list.length === 0 ? (
              <View style={st.empty}>
                <View style={st.emptyIcon}><Ico name="restaurant-outline" size={30} color={C.green} /></View>
                <Text style={st.emptyTitle}>No restaurants match</Text>
                <Text style={st.emptyBody}>Try removing a filter or two.</Text>
                <Button title="Clear all filters" onPress={clearAll} style={{ marginTop: 14, alignSelf: 'stretch' }} />
              </View>
            ) : list.map((r, i) => (
              <Animated.View key={`${dish}-${sort}-${r.id}`} entering={FadeInDown.delay(Math.min(i, 4) * 40).duration(260)}>
                <RestaurantCard r={r} />
              </Animated.View>
            ))}
            {filtered && list.length > 0 ? (
              <Pressable onPress={clearAll} style={{ alignSelf: 'center', padding: 10 }}><Text style={{ color: C.green, fontWeight: '800' }}>Clear filters · see all restaurants</Text></Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>

      <FloatingCart kind="eats" bottom={floatBottom} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title="Filters and sorting"
        footer={<>
          <View style={{ flex: 1 }}><Button title="Clear all" variant="secondary" style={{ height: 50, borderRadius: 14 }} onPress={() => setDraft({ flags: NO_FLAGS, sort: 'relevance' })} /></View>
          <View style={{ flex: 1.4 }}><Button title="Apply" style={{ height: 50, borderRadius: 14 }} onPress={() => { setFlags(draft.flags); setSort(draft.sort); setSheet(false); jump(); }} /></View>
        </>}>
        <ScrollView contentContainerStyle={{ padding: 18, gap: 4 }}>
          <Text style={st.sheetH}>Sort by</Text>
          {SORTS.map(s => {
            const on = draft.sort === s.key;
            return (
              <Pressable key={s.key} onPress={() => setDraft(d => ({ ...d, sort: s.key }))} style={st.sheetRow} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                <Text style={[st.sheetTxt, on && { fontWeight: '800' }]}>{s.label}</Text>
                <View style={[st.radio, on && { borderColor: C.green }]}>{on ? <View style={st.radioDot} /> : null}</View>
              </Pressable>
            );
          })}
          <Text style={[st.sheetH, { marginTop: 14 }]}>Show only</Text>
          {FLAG_LABELS.map(f => {
            const on = draft.flags[f.key];
            return (
              <Pressable key={f.key} onPress={() => setDraft(d => ({ ...d, flags: { ...d.flags, [f.key]: !on } }))} style={st.sheetRow} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ico name={f.icon} size={16} color={on ? C.green : K.meta} />
                  <Text style={[st.sheetTxt, on && { fontWeight: '800' }]}>{f.label}</Text>
                </View>
                <View style={[st.check, on && { backgroundColor: C.green, borderColor: C.green }]}>{on ? <Ico name="checkmark" size={14} color="#fff" /> : null}</View>
              </Pressable>
            );
          })}
        </ScrollView>
      </Sheet>
    </View>
  );
}

const st = StyleSheet.create({
  top: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 4 },
  pin: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 11, fontWeight: '900', color: C.green, letterSpacing: 1.2 },
  sticky: { backgroundColor: '#fff', paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: K.line },
  search: { marginHorizontal: 16, height: 48, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E1E4EA', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  searchInput: { flex: 1, fontSize: 15, color: K.ink, height: '100%', fontWeight: '500', ...noOutline },
  searchDiv: { width: 1, height: 22, backgroundColor: K.line },
  zhead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, marginTop: 26, marginBottom: 14 },
  zline: { flex: 1, height: 1, backgroundColor: '#DDE1E7' },
  zheadTxt: { fontSize: 12.5, fontWeight: '800', color: '#5B6472', letterSpacing: 1.6 },
  empty: { alignItems: 'center', paddingHorizontal: 32, paddingVertical: 28 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: K.ink, textAlign: 'center' },
  emptyBody: { fontSize: 13.5, color: K.meta, textAlign: 'center', marginTop: 4 },
  resHead: { fontSize: 12, fontWeight: '800', color: '#5B6472', letterSpacing: 1.4, marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  resRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line },
  resImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: K.imgBg },
  resName: { fontSize: 15, fontWeight: '800', color: K.ink },
  resMeta: { fontSize: 12.5, color: K.meta },
  sheetH: { fontSize: 13, fontWeight: '800', color: K.meta, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  sheetRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTxt: { fontSize: 15, color: K.ink, fontWeight: '500' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C4CAD3', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: C.green },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#C4CAD3', alignItems: 'center', justifyContent: 'center' },
});
