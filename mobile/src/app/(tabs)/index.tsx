import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ServiceSwitcher } from '@/components/home/ServiceSwitcher';
import { AppHeader, FloatingCart, Ico, K, OfferCarousel, RatingPill, SectionTitle, useFloatBottom } from '@/components/kit';
import { CatGrid, hasPhoto, norm, pct, photosFirst, Rail, useCategoryThumbs } from '@/components/now/blocks';
import { useCategories, useRefresh } from '@/components/now/useCatalog';
import { Tap } from '@/components/ui';
import { SERVICES } from '@/data/book';
import { MENU, RESTAURANTS } from '@/data/eats';
import { photo } from '@/data/media';
import type { Product } from '@/lib/api';
import { C } from '@/lib/theme';

const REFRESH_KEYS = [['categories'], ['products']] as const;

export default function Home() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 520);
  const floatBottom = useFloatBottom();
  const cats = useCategories();
  const all = cats.data ?? [];
  const gridCats = all.slice(0, 8);
  const fresh = all.find(c => norm(c.name) === norm('Fruits & Veg'));
  const railCats = useMemo(() => (fresh && !gridCats.includes(fresh) ? [...gridCats, fresh] : gridCats), [all]); // eslint-disable-line react-hooks/exhaustive-deps
  const thumbs = useCategoryThumbs(railCats);
  const { refreshing, onRefresh } = useRefresh(REFRESH_KEYS);

  const lists = railCats.map(c => thumbs[c.name]?.products ?? []);
  const loading = cats.isLoading || (railCats.length > 0 && railCats.every(c => thumbs[c.name]?.loading));
  const flat = lists.flat();

  // Bestsellers: round-robin across aisles, real photos only. Deals: biggest discounts.
  const best: Product[] = [];
  for (let i = 0; i < 10 && best.length < 12; i++) for (const l of lists) { const p = l.filter(hasPhoto)[i]; if (p && best.length < 12) best.push(p); }
  const bestIds = new Set(best.map(p => p.id));
  const deals = photosFirst(flat.filter(p => pct(p) > 0 && !bestIds.has(p.id))).sort((a, b) => Number(hasPhoto(b)) - Number(hasPhoto(a)) || pct(b) - pct(a)).slice(0, 12);
  const freshList = fresh ? (thumbs[fresh.name]?.products ?? []).slice(0, 12) : [];

  const groceryPic = flat.find(hasPhoto)?.image;
  const dish = MENU.find(m => /biryani/i.test(m.name))?.image ?? MENU[0]?.image;
  const svc = SERVICES.find(s => /clean/i.test(s.title)) ?? SERVICES[0];

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: K.page }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: floatBottom + 120 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" colors={[C.green]} />}>
        <AppHeader bottomPad={18}>
          <ServiceSwitcher grocery={groceryPic} dish={dish} service={svc ? photo(svc.photo, 240) : undefined} />
        </AppHeader>

        <OfferCarousel products={flat} />

        <SectionTitle title="Shop by category" onAction={() => router.navigate('/now')} />
        <CatGrid cats={gridCats} thumbs={thumbs} width={w} loading={cats.isLoading} />
        {cats.isError ? <Text style={st.error}>Couldn’t load the store. Pull down to retry.</Text> : null}

        <Rail title="Bestsellers" sub="Most loved in your neighbourhood" products={best} loading={loading} onSeeAll={() => router.navigate('/now')} />
        <Rail title="Deals of the day" sub="Biggest price drops right now" products={deals} loading={loading} />
        {fresh ? (
          <Rail title="Fresh fruits & vegetables" products={freshList} loading={loading}
            onSeeAll={() => router.push({ pathname: '/category/[name]', params: { name: fresh.name } })} />
        ) : null}

        <SectionTitle title="Order food" sub="From kitchens near you" onAction={() => router.navigate('/eats')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {RESTAURANTS.slice(0, 8).map(r => (
            <Tap key={r.id} onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: r.id } })} style={st.rest} scale={0.97}>
              <View style={st.restImg}>
                <Image source={r.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} recyclingKey={r.id} />
                {r.deliveryFee === 0 ? <View style={st.restTag}><Text style={st.restTagTxt}>FREE DELIVERY</Text></View> : null}
              </View>
              <View style={{ padding: 9, gap: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={st.restName} numberOfLines={1}>{r.name}</Text>
                  <RatingPill rating={r.rating} size="sm" />
                </View>
                <Text style={st.meta} numberOfLines={1}>{r.cuisineType}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ico name="time-outline" size={12} color={K.meta} />
                  <Text style={st.meta}>{r.eta}s</Text>
                </View>
              </View>
            </Tap>
          ))}
        </ScrollView>

        <SectionTitle title="Book a pro" sub="Verified professionals, price confirmed upfront" onAction={() => router.navigate('/book')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
          {SERVICES.slice(0, 8).map(s => (
            <Tap key={s.id} onPress={() => router.push({ pathname: '/service/[id]', params: { id: s.id } })} style={{ width: 72, alignItems: 'center' }} scale={0.94}>
              <View style={st.proRing}>
                <Image source={photo(s.photo, 200)} style={st.proImg} contentFit="cover" transition={150} recyclingKey={s.id} />
              </View>
              <Text style={st.proName} numberOfLines={2}>{s.title}</Text>
            </Tap>
          ))}
        </ScrollView>

        <View style={st.footer}>
          <Text style={st.footBig}>zyphix</Text>
          <Text style={st.footTxt}>Zyphix · The SuperLocal app</Text>
          <Text style={[st.footTxt, { fontSize: 11 }]}>v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
        </View>
      </ScrollView>
      <FloatingCart kind="now" bottom={floatBottom} />
    </View>
  );
}

const st = StyleSheet.create({
  error: { fontSize: 13, color: K.meta, textAlign: 'center', marginTop: 12 },
  rest: { width: 176, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line, overflow: 'hidden' },
  restImg: { width: '100%', aspectRatio: 16 / 10, backgroundColor: '#EEF1F5' },
  restTag: { position: 'absolute', left: 0, bottom: 8, backgroundColor: C.green, borderTopRightRadius: 6, borderBottomRightRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  restTagTxt: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.3 },
  restName: { flex: 1, fontSize: 14, fontWeight: '800', color: K.ink },
  meta: { fontSize: 12, color: K.meta, fontWeight: '500' },
  proRing: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff', borderWidth: 1, borderColor: K.line, padding: 3 },
  proImg: { width: '100%', height: '100%', borderRadius: 30 },
  proName: { fontSize: 11.5, fontWeight: '600', color: K.ink, textAlign: 'center', marginTop: 6, lineHeight: 14 },
  footer: { alignItems: 'center', marginTop: 36, gap: 2, paddingHorizontal: 16 },
  footBig: { fontSize: 44, fontWeight: '900', color: '#D5DAE1', letterSpacing: -2 },
  footTxt: { fontSize: 12.5, color: '#9AA3AF', fontWeight: '600' },
});
