import { useInfiniteQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader, CategoryTabs, FloatingCart, K, OfferCarousel, SearchPill, SectionTitle, useFloatBottom } from '@/components/kit';
import { CardSkeleton, CatGrid, EmptyState, groupByAisle, norm, NOW_TABS, Rail, sortProducts, SortChips, useCategoryThumbs, type SortKey } from '@/components/now/blocks';
import { useCategories, useRefresh } from '@/components/now/useCatalog';
import { ProductCard } from '@/components/ui';
import { Api, type Product } from '@/lib/api';
import { C } from '@/lib/theme';

const PAGE = 40;
const GAP = 10;
const REFRESH_KEYS = [['categories'], ['products']] as const;
const AnimatedFlatList = Animated.FlatList<Product>;

export default function NowScreen() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 520);
  const insets = useSafeAreaInsets();
  const floatBottom = useFloatBottom();
  const cats = useCategories();
  const all = useMemo(() => cats.data ?? [], [cats.data]);
  const thumbs = useCategoryThumbs(all);
  const groups = useMemo(() => groupByAisle(all), [all]);
  const { refreshing, onRefresh } = useRefresh(REFRESH_KEYS);
  const listRef = useRef<FlatList<Product>>(null);

  // Tabs that exist in the live catalogue.
  const tabs = useMemo(() => {
    const names = new Map(all.map(c => [norm(c.name), c.name]));
    return NOW_TABS.filter(t => !t.match || names.has(norm(t.match))).map(t => ({ ...t, category: t.match ? names.get(norm(t.match)) : undefined }));
  }, [all]);
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState<SortKey>('relevance');
  const category = tabs.find(t => t.key === tab)?.category;

  const q = useInfiniteQuery({
    queryKey: ['products', { category, page: 'infinite' }],
    queryFn: ({ pageParam }) => Api.products({ category, limit: PAGE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last: Product[], pages) => (last.length < PAGE ? undefined : pages.length * PAGE),
    enabled: !!category,
  });
  const items = useMemo(() => (category ? sortProducts(q.data?.pages.flat() ?? [], sort) : []), [category, q.data, sort]);
  const cardW = Math.floor((w - 32 - GAP) / 2);

  const pick = (k: string) => {
    setTab(k);
    setSort('relevance');
    if (y.value > headerH.value) listRef.current?.scrollToOffset({ offset: headerH.value - pinnedH, animated: false });
  };

  // Compact band (search + tabs) pins once the big header scrolls away.
  const y = useSharedValue(0);
  const headerH = useSharedValue(400);
  const pinnedH = insets.top + 128;
  const onScroll = useAnimatedScrollHandler(e => { y.value = e.contentOffset.y; });
  const pinStyle = useAnimatedStyle(() => {
    const at = headerH.value - pinnedH;
    return {
      opacity: interpolate(y.value, [at - 10, at + 10], [0, 1], 'clamp'),
      transform: [{ translateY: y.value < at - 10 ? -400 : 0 }],
    };
  });

  const rails = all.slice(0, 8);
  const header = (
    <View>
      <View onLayout={e => { headerH.value = e.nativeEvent.layout.height; }}>
        <AppHeader bottomPad={0} searchWords={['milk', 'atta', 'chips', 'paneer', 'coke', 'bread', 'eggs']}>
          <CategoryTabs items={tabs} value={tab} onChange={pick} />
        </AppHeader>
      </View>
      {tab === 'all' ? (
        <View>
          <OfferCarousel products={Object.values(thumbs).flatMap(t => t.products ?? []).slice(0, 120)} />
          {cats.isLoading ? <CatGrid cats={[]} loading width={w} style={{ marginTop: 22 }} /> : null}
          {cats.isError ? <EmptyState icon="cloud-offline-outline" title="Couldn’t load the store" body="Check your connection and pull down to try again." action="Retry" onAction={() => cats.refetch()} /> : null}
          {groups.map(g => (
            <View key={g.title}>
              <SectionTitle title={g.title} />
              <CatGrid cats={g.cats} thumbs={thumbs} width={w} />
            </View>
          ))}
          {rails.map(c => (
            <Rail key={c.name} title={c.name} products={thumbs[c.name]?.products} loading={thumbs[c.name]?.loading}
              onSeeAll={() => router.push({ pathname: '/category/[name]', params: { name: c.name } })} />
          ))}
        </View>
      ) : (
        <View style={{ paddingTop: 14, paddingBottom: 12, backgroundColor: K.page }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 16, marginBottom: 10, gap: 6 }}>
            <Text style={st.gridTitle}>{category}</Text>
            {items.length ? <Text style={st.count}>{items.length}{q.hasNextPage ? '+' : ''} items</Text> : null}
          </View>
          <SortChips value={sort} onChange={k => setSort(k === sort ? 'relevance' : k)} />
        </View>
      )}
    </View>
  );

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: K.page }}>
      <AnimatedFlatList
        ref={listRef as never}
        data={items}
        key="now-list"
        numColumns={2}
        keyExtractor={p => p.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        ListHeaderComponent={header}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        renderItem={({ item }) => <ProductCard p={item} width={cardW} />}
        onEndReached={() => { if (category && q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage(); }}
        onEndReachedThreshold={0.7}
        initialNumToRender={6}
        windowSize={7}
        contentContainerStyle={{ paddingBottom: floatBottom + 96 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" colors={[C.green]} />}
        ListEmptyComponent={category ? (q.isLoading
          ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: 16 }}>{[0, 1, 2, 3].map(i => <CardSkeleton key={i} width={cardW} />)}</View>
          : <EmptyState icon={q.isError ? 'cloud-offline-outline' : 'basket-outline'} title={q.isError ? 'Couldn’t load products' : 'Restocking this aisle'} body={q.isError ? 'Check your connection and try again.' : 'Try another category in the meantime.'} action={q.isError ? 'Retry' : undefined} onAction={() => q.refetch()} />)
          : undefined}
        ListFooterComponent={q.isFetchingNextPage ? <ActivityIndicator color={C.green} style={{ marginVertical: 20 }} /> : undefined}
      />

      <Animated.View pointerEvents="box-none" style={[st.pinned, pinStyle]}>
        <LinearGradient colors={K.band} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 8 }}>
          <SearchPill style={{ marginHorizontal: 16, height: 44 }} />
          <CategoryTabs items={tabs} value={tab} onChange={pick} />
        </LinearGradient>
      </Animated.View>
      <FloatingCart kind="now" bottom={floatBottom} />
    </View>
  );
}

const st = StyleSheet.create({
  pinned: { position: 'absolute', top: 0, left: 0, right: 0, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  gridTitle: { fontSize: 18, fontWeight: '800', color: K.ink, letterSpacing: -0.3 },
  count: { fontSize: 12, color: K.meta, fontWeight: '600' },
});
