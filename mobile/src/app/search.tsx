import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingCart, Ico, K, SectionTitle } from '@/components/kit';
import { CardSkeleton, CatGrid, EmptyState, photosFirst, useCategoryThumbs } from '@/components/now/blocks';
import { useCategories } from '@/components/now/useCatalog';
import { ProductCard } from '@/components/ui';
import { Api } from '@/lib/api';
import { C } from '@/lib/theme';

const RECENT_KEY = 'zyphix.search.recent';
const TRENDING = ['Milk', 'Bread', 'Eggs', 'Paneer', 'Atta', 'Maggi', 'Chips', 'Coffee', 'Ghee', 'Biscuits', 'Curd', 'Butter'];
const GAP = 10;

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 520);
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const q = useDebounced(text.trim(), 300);
  const cats = useCategories();
  const popular = useMemo(() => (cats.data ?? []).slice(0, 8), [cats.data]);
  const thumbs = useCategoryThumbs(popular);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then(r => { if (r) try { setRecent(JSON.parse(r)); } catch {} }).catch(() => {});
  }, []);

  const remember = (term: string) => {
    const t = term.trim();
    if (t.length < 2) return;
    setRecent(prev => {
      const next = [t, ...prev.filter(x => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };
  const clearRecent = () => { setRecent([]); AsyncStorage.removeItem(RECENT_KEY).catch(() => {}); };
  const pick = (term: string) => { setText(term); remember(term); Keyboard.dismiss(); };

  const results = useQuery({
    queryKey: ['search', q],
    queryFn: () => Api.products({ q, limit: 60 }),
    enabled: q.length >= 2,
    placeholderData: prev => prev,
  });
  const data = useMemo(() => photosFirst(results.data ?? []), [results.data]);
  const cardW = Math.floor((w - 32 - GAP) / 2);
  const searching = q.length >= 2;

  return (
    <View style={{ flex: 1, backgroundColor: K.page }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[st.bar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Back" style={st.back}>
          <Ico name="arrow-back" size={22} />
        </Pressable>
        <View style={st.inputWrap}>
          <Ico name="search" size={18} color={K.meta} />
          <TextInput
            autoFocus
            value={text}
            onChangeText={setText}
            placeholder='Search "milk", "atta", "chips"…'
            placeholderTextColor="#9CA3AF"
            style={st.input}
            returnKeyType="search"
            onSubmitEditing={() => remember(text)}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search products"
          />
          {text.length > 0 ? (
            <Pressable onPress={() => setText('')} hitSlop={12} accessibilityLabel="Clear search">
              <Ico name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          ) : <Ico name="mic-outline" size={20} color={K.meta} />}
        </View>
      </View>

      {!searching ? (
        <Animated.View entering={FadeIn} style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
            {recent.length > 0 ? (
              <View style={st.section}>
                <View style={st.headRow}>
                  <Text style={st.h}>Recent searches</Text>
                  <Pressable onPress={clearRecent} hitSlop={10}><Text style={st.clear}>clear all</Text></Pressable>
                </View>
                <View style={st.chips}>
                  {recent.map(r => (
                    <Pressable key={r} onPress={() => pick(r)} style={({ pressed }) => [st.chip, pressed && { opacity: 0.7 }]}>
                      <Ico name="time-outline" size={14} color={K.meta} />
                      <Text style={st.chipTxt}>{r}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
            <View style={st.section}>
              <View style={st.headRow}><Text style={st.h}>Trending near you</Text></View>
              <View style={st.chips}>
                {TRENDING.map(t => (
                  <Pressable key={t} onPress={() => pick(t)} style={({ pressed }) => [st.chip, pressed && { opacity: 0.7 }]}>
                    <Ico name="trending-up" size={14} color={C.green} />
                    <Text style={st.chipTxt}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {popular.length ? (
              <>
                <SectionTitle title="Popular categories" style={{ marginTop: 18 }} />
                <CatGrid cats={popular} thumbs={thumbs} width={w} />
              </>
            ) : null}
          </ScrollView>
        </Animated.View>
      ) : results.isLoading ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, padding: 16 }}>
          {Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} width={cardW} />)}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={p => p.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={() => remember(q)}
          contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: insets.bottom + 100 }}
          columnWrapperStyle={{ gap: GAP }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          renderItem={({ item }) => <ProductCard p={item} width={cardW} />}
          ListHeaderComponent={data.length > 0
            ? <Text style={st.resCount}>Showing {data.length >= 60 ? 'top results' : `${data.length} result${data.length === 1 ? '' : 's'}`} for <Text style={{ color: K.ink, fontWeight: '800' }}>“{q}”</Text></Text>
            : undefined}
          ListEmptyComponent={results.isError
            ? <EmptyState icon="cloud-offline-outline" title="Search isn’t available" body="Check your connection and try again." action="Retry" onAction={() => results.refetch()} />
            : <EmptyState icon="search" title={`No results for “${q}”`} body="Check the spelling or try a more general word like “milk” or “snacks”." />}
        />
      )}
      <FloatingCart kind="now" bottom={insets.bottom + 14} />
    </View>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: K.line },
  back: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.green, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, height: '100%', fontSize: 15, fontWeight: '500', color: K.ink, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}) },
  section: { paddingHorizontal: 16, paddingTop: 18 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  h: { fontSize: 16, fontWeight: '800', color: K.ink },
  clear: { color: C.green, fontWeight: '800', fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: K.line },
  chipTxt: { fontSize: 13, fontWeight: '600', color: K.ink },
  resCount: { fontSize: 13, color: K.meta, marginBottom: 12, marginTop: 8 },
});
