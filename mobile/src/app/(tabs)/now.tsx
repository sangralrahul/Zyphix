import { router } from 'expo-router';
import React from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryGrid, NOW_PROMISES, ProductRail, PromiseRow, SearchPill, useTabCartBottom } from '@/components/now/shared';
import { useCategories, useCategoryRails, useRefresh } from '@/components/now/useCatalog';
import { CartBar, Empty, HeroVideo, SectionHeader } from '@/components/ui';
import { CLIPS } from '@/data/media';
import { C, S, T, shadow } from '@/lib/theme';

const HERO = 180;
const REFRESH_KEYS = [['categories'], ['products']] as const;

export default function NowScreen() {
  const insets = useSafeAreaInsets();
  const cartBottom = useTabCartBottom();
  const cats = useCategories();
  const railCats = (cats.data ?? []).slice(0, 8);
  const rails = useCategoryRails(railCats);
  const { refreshing, onRefresh } = useRefresh(REFRESH_KEYS);

  // The inline search bar sits under the hero; once it scrolls away a compact bar pins to the top.
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => { y.value = e.contentOffset.y; });
  const pinAt = HERO + S.lg - 8;
  const pinned = useAnimatedStyle(() => ({
    opacity: interpolate(y.value, [pinAt, pinAt + 16], [0, 1], 'clamp'),
    // Fully off-screen until needed so it never steals taps from the hero.
    transform: [{ translateY: y.value < pinAt ? -200 : interpolate(y.value, [pinAt, pinAt + 16], [-8, 0], 'clamp') }],
  }));

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: C.bg }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: cartBottom + 96 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.white} colors={[C.green]} />}>
        <HeroVideo clip={CLIPS.groceryShelf} height={HERO}>
          <Text style={st.kicker}>ZYPHIX NOW</Text>
          <Text style={st.title}>Groceries in <Text style={[T.accent, { color: C.mint }]}>30</Text> minutes</Text>
        </HeroVideo>

        <View style={st.searchWrap}>
          <SearchPill />
        </View>
        <PromiseRow items={NOW_PROMISES} style={{ marginTop: S.md }} />

        <SectionHeader title="Shop by category" style={{ marginTop: S.xl }} />
        <CategoryGrid cats={cats.data ?? []} loading={cats.isLoading} />
        {cats.isError && <Empty title="Couldn’t load the store" body="Check your connection and pull down to try again." />}

        {railCats.map((c, i) => (
          <ProductRail key={c.name} title={c.name} products={rails[i]?.data} loading={rails[i]?.isLoading}
            onSeeAll={() => router.push({ pathname: '/category/[name]', params: { name: c.name } })} />
        ))}
      </Animated.ScrollView>

      <Animated.View pointerEvents="box-none" style={[st.pinned, { paddingTop: insets.top + 8 }, pinned]}>
        <SearchPill />
      </Animated.View>
      <CartBar kind="now" bottom={cartBottom} />
    </View>
  );
}

const st = StyleSheet.create({
  kicker: { ...T.tiny, color: C.mint, letterSpacing: 1.4, marginBottom: 6 },
  title: { ...T.h1, fontSize: 30, lineHeight: 34, color: C.white },
  searchWrap: { paddingHorizontal: S.xl, paddingTop: S.lg },
  pinned: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: S.xl, paddingBottom: S.md, backgroundColor: C.bg, ...shadow },
});
