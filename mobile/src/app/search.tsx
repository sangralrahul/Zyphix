import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Icon, useStackBottom } from '@/components/now/shared';
import { CartBar, Chip, Empty, ProductCard, ProductSkeleton } from '@/components/ui';
import { Api } from '@/lib/api';
import { C, R, S, T } from '@/lib/theme';

const RECENT_KEY = 'zyphix.search.recent';
const TRENDING = ['Milk', 'Bread', 'Eggs', 'Paneer', 'Atta', 'Maggi', 'Chips', 'Coffee', 'Ghee', 'Biscuits'];
const GAP = 12;

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const bottom = useStackBottom();
  const [text, setText] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const q = useDebounced(text.trim(), 300);

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

  const cardW = Math.floor((width - S.xl * 2 - GAP) / 2);
  const searching = q.length >= 2;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={st.bar}>
        <View style={st.inputWrap}>
          <Icon ios="magnifyingglass" md="search" size={18} color={C.text2} />
          <TextInput
            autoFocus
            value={text}
            onChangeText={setText}
            placeholder="Search for atta, dal, coke and more"
            placeholderTextColor={C.text3}
            style={st.input}
            returnKeyType="search"
            onSubmitEditing={() => remember(text)}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="never"
            accessibilityLabel="Search products"
          />
          {text.length > 0 && (
            <Pressable onPress={() => setText('')} hitSlop={12} accessibilityLabel="Clear search" style={st.clear}>
              <Icon ios="xmark" md="close" size={13} color={C.white} />
            </Pressable>
          )}
        </View>
      </View>

      {!searching ? (
        <Animated.ScrollView entering={FadeIn} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: S.xl, gap: S.xl }}>
          {recent.length > 0 && (
            <View>
              <View style={st.headRow}>
                <Text style={T.h3}>Recent searches</Text>
                <Pressable onPress={clearRecent} hitSlop={10}><Text style={[T.small, { color: C.green, fontWeight: '600' }]}>Clear</Text></Pressable>
              </View>
              {recent.map(r => (
                <Pressable key={r} onPress={() => pick(r)} style={({ pressed }) => [st.recentRow, pressed && { backgroundColor: C.bgSoft }]}>
                  <Icon ios="clock.arrow.circlepath" md="history" size={18} color={C.text3} />
                  <Text style={[T.body, { flex: 1 }]}>{r}</Text>
                  <Icon ios="arrow.up.left" md="north_west" size={16} color={C.text3} />
                </Pressable>
              ))}
            </View>
          )}
          <View>
            <View style={st.headRow}>
              <Text style={T.h3}>Trending</Text>
              <Icon ios="chart.line.uptrend.xyaxis" md="trending_up" size={18} color={C.green} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: S.sm }}>
              {TRENDING.map(t => <Chip key={t} label={t} onPress={() => pick(t)} />)}
            </View>
          </View>
        </Animated.ScrollView>
      ) : results.isLoading ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, padding: S.xl }}>
          {Array.from({ length: 4 }, (_, i) => <ProductSkeleton key={i} width={cardW} />)}
        </View>
      ) : (
        <FlatList
          data={results.data ?? []}
          keyExtractor={p => p.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={() => remember(q)}
          contentContainerStyle={{ padding: S.xl, paddingTop: S.sm, paddingBottom: bottom + 96 }}
          columnWrapperStyle={{ gap: GAP }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          renderItem={({ item }) => <ProductCard p={item} width={cardW} />}
          ListHeaderComponent={results.data && results.data.length > 0
            ? <Text style={[T.small, { color: C.text2, marginBottom: S.md }]}>{results.data.length >= 60 ? 'Top results' : `${results.data.length} result${results.data.length === 1 ? '' : 's'}`} for “{q}”</Text>
            : undefined}
          ListEmptyComponent={results.isError
            ? <Empty title="Search isn’t available" body="Check your connection and try again." action="Retry" onAction={() => results.refetch()} />
            : <Empty title={`No results for “${q}”`} body="Try a different spelling or a more general word." />}
        />
      )}
      <CartBar kind="now" bottom={bottom} />
    </View>
  );
}

const st = StyleSheet.create({
  bar: { paddingHorizontal: S.xl, paddingTop: S.sm, paddingBottom: S.md, backgroundColor: C.bg },
  inputWrap: { height: 50, borderRadius: R.md, backgroundColor: C.bgSoft, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.md, gap: S.sm },
  input: { flex: 1, height: '100%', ...T.body, color: C.text, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}) },
  clear: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.text3, alignItems: 'center', justifyContent: 'center' },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.sm },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, minHeight: 44, borderRadius: R.sm, paddingHorizontal: 4 },
});
