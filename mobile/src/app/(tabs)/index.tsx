import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ServiceCards } from '@/components/home/ServiceCards';
import { CategoryGrid, Icon, ProductRail, SearchPill, useTabCartBottom, type MaterialName } from '@/components/now/shared';
import { discountPct, useCategories, useCategoryRails, useRefresh } from '@/components/now/useCatalog';
import { CartBar, HeroVideo, SectionHeader, Tap } from '@/components/ui';
import { CLIPS } from '@/data/media';
import type { Product } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C, R, S, T } from '@/lib/theme';
import type { SFSymbol } from 'expo-symbols';

const REFRESH_KEYS = [['categories'], ['products']] as const;

const LINKS: { title: string; sub: string; url: string; ios: SFSymbol; md: MaterialName }[] = [
  { title: 'Partner with Zyphix', sub: 'List your store, kitchen or service', url: 'https://partner.zyphix.in', ios: 'storefront', md: 'storefront' },
  { title: 'Advertise on Zyphix', sub: 'Reach shoppers in your neighbourhood', url: 'https://advertise.zyphix.in', ios: 'megaphone', md: 'campaign' },
  { title: 'Help & support', sub: 'Orders, payments and account help', url: 'https://support.zyphix.in', ios: 'questionmark.circle', md: 'help' },
];

export default function Home() {
  const { user } = useAuth();
  const cartBottom = useTabCartBottom();
  const cats = useCategories();
  const railCats = (cats.data ?? []).slice(0, 8);
  const rails = useCategoryRails(railCats);
  const { refreshing, onRefresh } = useRefresh(REFRESH_KEYS);

  const railsLoading = cats.isLoading || (railCats.length > 0 && rails.every(r => r.isLoading));
  const all = rails.map(r => r.data ?? []);
  const deals = all.flat().filter(p => discountPct(p) > 0).sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 12);
  // Round-robin across categories so "Popular" isn't all one aisle.
  const dealIds = new Set(deals.map(d => d.id));
  const popular: Product[] = [];
  for (let i = 0; i < 10 && popular.length < 12; i++) for (const list of all) { const p = list[i]; if (p && !dealIds.has(p.id) && popular.length < 12) popular.push(p); }

  const firstName = user?.name?.split(' ')[0];

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: cartBottom + 96 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.white} colors={[C.green]} />}>
        <HeroVideo clip={CLIPS.heroCity} height={350}>
          <View style={{ flex: 1 }}>
            <View style={s.brandRow}>
              <Text style={s.wordmark}>zyphix</Text>
              <Tap onPress={() => router.push('/account')} style={s.avatar} accessibilityLabel="Account">
                {firstName ? <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>{firstName[0]!.toUpperCase()}</Text>
                  : <Icon ios="person.fill" md="person" size={18} color={C.white} />}
              </Tap>
            </View>
          </View>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={s.kicker}>{firstName ? `HI ${firstName.toUpperCase()} · ` : ''}THE SUPERLOCAL APP</Text>
            <Text style={s.title}>Your neighbourhood, <Text style={[T.accent, { color: C.mint }]}>delivered</Text>.</Text>
            <SearchPill dark placeholder="Search milk, bread, snacks…" style={{ marginTop: S.lg }} />
          </Animated.View>
        </HeroVideo>

        <ServiceCards />

        <SectionHeader title="Shop by category" action="See all" onAction={() => router.push('/now')} />
        <CategoryGrid cats={railCats} loading={cats.isLoading} />
        {cats.isError && <Text style={s.error}>Couldn’t load the catalogue. Pull down to retry.</Text>}

        <ProductRail title="Deals for you" products={deals} loading={railsLoading} />
        <ProductRail title="Popular near you" products={popular} loading={railsLoading} />

        <Animated.View entering={FadeInDown.duration(400)} style={{ paddingHorizontal: S.xl, marginTop: S.x3 }}>
          <Tap onPress={() => router.push('/orders')} style={s.track} accessibilityRole="button" accessibilityLabel="Track your orders">
            <Image source={CLIPS.rider.poster} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient colors={['rgba(5,8,14,.92)', 'rgba(5,8,14,.55)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
            <View style={{ padding: S.xl, gap: 6, maxWidth: 260 }}>
              <View style={s.liveDot}><View style={s.liveInner} /><Text style={[T.tiny, { color: C.mint }]}>LIVE</Text></View>
              <Text style={[T.h2, { color: C.white }]}>Track every order <Text style={[T.accent, { color: C.mint }]}>live</Text></Text>
              <Text style={[T.small, { color: 'rgba(255,255,255,.8)' }]}>Follow each step from packing to your door.</Text>
              <View style={s.trackBtn}><Text style={[T.small, { fontWeight: '700', color: C.ink }]}>Your orders</Text><Icon ios="chevron.right" md="chevron_right" size={14} color={C.ink} /></View>
            </View>
          </Tap>
        </Animated.View>

        <SectionHeader title="More from Zyphix" />
        <View style={s.links}>
          {LINKS.map((l, i) => (
            <Tap key={l.url} onPress={() => WebBrowser.openBrowserAsync(l.url).catch(() => {})} scale={0.99}
              style={[s.linkRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line }]} accessibilityRole="link">
              <View style={s.linkIcon}><Icon ios={l.ios} md={l.md} size={20} color={C.greenDeep} /></View>
              <View style={{ flex: 1 }}>
                <Text style={T.bodyStrong}>{l.title}</Text>
                <Text style={[T.small, { color: C.text2 }]}>{l.sub}</Text>
              </View>
              <Icon ios="arrow.up.right" md="north_east" size={16} color={C.text3} />
            </Tap>
          ))}
        </View>
        <Text style={s.footer}>Zyphix · The SuperLocal app</Text>
      </ScrollView>
      <CartBar kind="now" bottom={cartBottom} />
    </View>
  );
}

const s = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { color: C.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center' },
  kicker: { ...T.tiny, color: C.mint, letterSpacing: 1.4, marginBottom: 8 },
  title: { ...T.display, fontSize: 38, lineHeight: 42, color: C.white },
  error: { ...T.small, color: C.text2, textAlign: 'center', marginTop: S.md },
  track: { borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.ink, minHeight: 190, justifyContent: 'center' },
  liveDot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.mint },
  trackBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, backgroundColor: C.white, borderRadius: R.pill, paddingHorizontal: 14, height: 36, marginTop: 8 },
  links: { marginHorizontal: S.xl, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.lg, minHeight: 64, backgroundColor: C.bg },
  linkIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center' },
  footer: { ...T.small, color: C.text3, textAlign: 'center', marginTop: S.x3 },
});
