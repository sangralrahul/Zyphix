import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { CATEGORY_TINTS, categoryImage, useStackBottom } from '@/components/now/shared';
import { useCategories } from '@/components/now/useCatalog';
import { CartBar, Empty, ProductCard, ProductSkeleton } from '@/components/ui';
import { Api, type Product } from '@/lib/api';
import { C, S, T } from '@/lib/theme';

const PAGE = 40;
const RAIL = 88;
const GAP = 10;

export default function CategoryScreen() {
  const { name: raw } = useLocalSearchParams<{ name: string }>();
  const name = String(raw ?? '');
  const { width } = useWindowDimensions();
  const bottom = useStackBottom();
  const cats = useCategories();
  const railRef = useRef<FlatList>(null);

  const q = useInfiniteQuery({
    queryKey: ['products', { category: name, page: 'infinite' }],
    queryFn: ({ pageParam }) => Api.products({ category: name, limit: PAGE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last: Product[], pages) => (last.length < PAGE ? undefined : pages.length * PAGE),
    enabled: !!name,
  });
  const items = q.data?.pages.flat() ?? [];
  const cardW = Math.floor((width - RAIL - S.md * 2 - GAP) / 2);

  const catList = cats.data ?? [];
  const selectedIndex = catList.findIndex(c => c.name === name);
  useEffect(() => {
    if (selectedIndex > 2) railRef.current?.scrollToIndex({ index: selectedIndex, viewPosition: 0.4, animated: true });
  }, [selectedIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ title: name }} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Left category rail */}
        <FlatList
          ref={railRef}
          data={catList}
          keyExtractor={c => c.name}
          style={st.rail}
          contentContainerStyle={{ paddingBottom: bottom + 80 }}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, i) => ({ length: 96, offset: 96 * i, index: i })}
          onScrollToIndexFailed={() => {}}
          renderItem={({ item, index }) => {
            const active = item.name === name;
            return (
              <Pressable onPress={() => router.setParams({ name: item.name })} style={[st.railItem, active && st.railItemActive]}
                accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={item.name}>
                {active && <View style={st.railBar} />}
                <View style={[st.railImg, { backgroundColor: CATEGORY_TINTS[index % CATEGORY_TINTS.length] }, active && { borderColor: C.green }]}>
                  <Image source={categoryImage(item)} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={item.name} cachePolicy="memory-disk" />
                </View>
                <Text style={[st.railLabel, active && { color: C.greenDeep, fontWeight: '700' }]} numberOfLines={2}>{item.name}</Text>
              </Pressable>
            );
          }}
        />

        {/* Product grid */}
        {q.isLoading ? (
          <View style={st.gridPad}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
              {Array.from({ length: 6 }, (_, i) => <ProductSkeleton key={i} width={cardW} />)}
            </View>
          </View>
        ) : (
          <FlatList
            key={name}
            data={items}
            numColumns={2}
            keyExtractor={p => p.id}
            style={{ flex: 1 }}
            contentContainerStyle={[st.gridPad, { paddingBottom: bottom + 96 }]}
            columnWrapperStyle={{ gap: GAP }}
            ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
            renderItem={({ item }) => <ProductCard p={item} width={cardW} />}
            onEndReached={() => { if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage(); }}
            onEndReachedThreshold={0.6}
            initialNumToRender={8}
            windowSize={7}
            removeClippedSubviews
            refreshControl={<RefreshControl refreshing={q.isRefetching && !q.isFetchingNextPage} onRefresh={() => { q.refetch(); }} colors={[C.green]} />}
            ListHeaderComponent={items.length > 0 ? <Text style={[T.small, { color: C.text2, marginBottom: S.sm }]}>{name}</Text> : undefined}
            ListFooterComponent={q.isFetchingNextPage ? <ActivityIndicator color={C.green} style={{ marginVertical: S.xl }} /> : undefined}
            ListEmptyComponent={q.isError
              ? <Empty title="Couldn’t load products" body="Check your connection and try again." action="Retry" onAction={() => q.refetch()} />
              : <Empty title="Nothing here yet" body="This aisle is being restocked. Try another category." />}
          />
        )}
      </View>
      <CartBar kind="now" bottom={bottom} />
    </View>
  );
}

const st = StyleSheet.create({
  rail: { width: RAIL, flexGrow: 0, backgroundColor: C.bgSoft, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: C.line },
  railItem: { height: 96, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, gap: 4 },
  railItemActive: { backgroundColor: C.bg },
  railBar: { position: 'absolute', right: 0, top: 14, bottom: 14, width: 4, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: C.green },
  railImg: { width: 52, height: 52, borderRadius: 26, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  railLabel: { fontSize: 11, lineHeight: 13, fontWeight: '500', color: C.text2, textAlign: 'center' },
  gridPad: { padding: S.md },
});

