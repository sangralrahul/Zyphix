import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingCart, Ico, K } from '@/components/kit';
import { CardSkeleton, EmptyState, sortProducts, SortChips, tint, useCategoryThumbs, type SortKey } from '@/components/now/blocks';
import { useCategories } from '@/components/now/useCatalog';
import { ProductCard } from '@/components/ui';
import { API_BASE, Api, type Product } from '@/lib/api';
import { C } from '@/lib/theme';

const PAGE = 40;
const RAIL = 84;
const ITEM_H = 96;
const GAP = 8;

export default function CategoryScreen() {
  const { name: raw } = useLocalSearchParams<{ name: string }>();
  const name = String(raw ?? '');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cats = useCategories();
  const catList = useMemo(() => cats.data ?? [], [cats.data]);
  const thumbs = useCategoryThumbs(catList);
  const railRef = useRef<FlatList>(null);
  const [sort, setSort] = useState<SortKey>('relevance');

  const q = useInfiniteQuery({
    queryKey: ['products', { category: name, page: 'infinite' }],
    queryFn: ({ pageParam }) => Api.products({ category: name, limit: PAGE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last: Product[], pages) => (last.length < PAGE ? undefined : pages.length * PAGE),
    enabled: !!name,
  });
  const items = useMemo(() => sortProducts(q.data?.pages.flat() ?? [], sort), [q.data, sort]);
  const cardW = Math.floor((Math.min(width, 520) - RAIL - GAP * 3) / 2);

  const selectedIndex = catList.findIndex(c => c.name === name);
  useEffect(() => {
    if (selectedIndex > 3) railRef.current?.scrollToIndex({ index: selectedIndex, viewPosition: 0.35, animated: true });
  }, [selectedIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{
        title: name,
        headerTitleStyle: { fontWeight: '800', fontSize: 17 },
        headerRight: () => (
          <Pressable onPress={() => router.push('/search')} hitSlop={10} accessibilityLabel="Search" style={{ paddingHorizontal: 6 }}>
            <Ico name="search" size={22} />
          </Pressable>
        ),
      }} />
      <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: K.line }}>
        <FlatList
          ref={railRef}
          data={catList}
          keyExtractor={c => c.name}
          style={st.rail}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, i) => ({ length: ITEM_H, offset: ITEM_H * i, index: i })}
          onScrollToIndexFailed={() => {}}
          renderItem={({ item }) => {
            const on = item.name === name;
            const pic = thumbs[item.name]?.pics[0];
            const img = pic ?? (item.image ? (item.image.startsWith('/') ? API_BASE + item.image : item.image) : undefined);
            return (
              <Pressable onPress={() => { setSort('relevance'); router.setParams({ name: item.name }); }} style={[st.railItem, on && st.railOn]}
                accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={item.name}>
                {on ? <View style={st.railBar} /> : null}
                <View style={[st.railImg, { backgroundColor: tint(item.color, on ? '2E' : '1F') }]}>
                  {img ? <Image source={img} style={pic ? { width: 44, height: 44 } : StyleSheet.absoluteFill} contentFit={pic ? 'contain' : 'cover'} recyclingKey={item.name} />
                    : <Text style={{ fontSize: 26 }}>{item.icon || '🛒'}</Text>}
                </View>
                <Text style={[st.railLabel, on && { color: K.ink, fontWeight: '800' }]} numberOfLines={2}>{item.name}</Text>
              </Pressable>
            );
          }}
        />

        <View style={{ flex: 1, backgroundColor: K.page }}>
          <View style={st.sortBar}>
            <SortChips value={sort} onChange={k => setSort(k === sort ? 'relevance' : k)} inset={GAP} />
          </View>
          {q.isLoading ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, padding: GAP }}>
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} width={cardW} />)}
            </View>
          ) : (
            <FlatList
              key={name}
              data={items}
              numColumns={2}
              keyExtractor={p => p.id}
              contentContainerStyle={{ padding: GAP, paddingBottom: insets.bottom + 100 }}
              columnWrapperStyle={{ gap: GAP }}
              ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
              renderItem={({ item }) => <ProductCard p={item} width={cardW} />}
              onEndReached={() => { if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage(); }}
              onEndReachedThreshold={0.6}
              initialNumToRender={6}
              windowSize={7}
              removeClippedSubviews
              refreshControl={<RefreshControl refreshing={q.isRefetching && !q.isFetchingNextPage} onRefresh={() => { q.refetch(); }} colors={[C.green]} />}
              ListFooterComponent={q.isFetchingNextPage ? <ActivityIndicator color={C.green} style={{ marginVertical: 20 }} /> : undefined}
              ListEmptyComponent={q.isError
                ? <EmptyState icon="cloud-offline-outline" title="Couldn’t load products" body="Check your connection and try again." action="Retry" onAction={() => q.refetch()} />
                : <EmptyState icon="basket-outline" title="Restocking this aisle" body="Try another category in the meantime." />}
            />
          )}
        </View>
      </View>
      <FloatingCart kind="now" bottom={insets.bottom + 14} />
    </View>
  );
}

const st = StyleSheet.create({
  rail: { width: RAIL, flexGrow: 0, backgroundColor: K.page },
  railItem: { height: ITEM_H, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, gap: 5 },
  railOn: { backgroundColor: '#fff' },
  railBar: { position: 'absolute', left: 0, top: 12, bottom: 12, width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: C.green },
  railImg: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  railLabel: { fontSize: 11, lineHeight: 13, fontWeight: '600', color: K.meta, textAlign: 'center' },
  sortBar: { paddingVertical: 8, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: K.line },
});
