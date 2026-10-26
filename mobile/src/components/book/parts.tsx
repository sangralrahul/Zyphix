/** Zyphix Book building blocks — Urban Company-style service tiles, banners and cards. */
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Ico, K } from '@/components/kit';
import { Tap } from '@/components/ui';
import { SERVICES, type Service } from '@/data/book';
import { photo } from '@/data/media';
import { C } from '@/lib/theme';

export const openService = (id: string) => router.push({ pathname: '/service/[id]', params: { id } });
export const svc = (id: string) => SERVICES.find(s => s.id === id)!;

/** Grid tile: soft grey tile with a round service photo, label underneath. */
export function ServiceTile({ s, width }: { s: Service; width: number }) {
  return (
    <Tap onPress={() => openService(s.id)} style={{ width, alignItems: 'center' }} scale={0.95} accessibilityLabel={`${s.title}: ${s.blurb}`}>
      <View style={[b.tile, { width, height: Math.round(width * 0.78) }]}>
        <Image source={photo(s.photo, 240)} style={b.tileImg} contentFit="cover" recyclingKey={`t-${s.id}`} transition={180} cachePolicy="memory-disk" />
      </View>
      <Text style={b.tileLbl} numberOfLines={2}>{s.title}</Text>
    </Tap>
  );
}

const BANNERS = [
  { id: 'sv3', title: 'Home cleaning,\ndone right', sub: 'Deep clean · kitchen · bathroom', grad: ['rgba(7,40,28,.92)', 'rgba(7,40,28,0)'] as const },
  { id: 'sv5', title: 'AC service\nbefore it’s hot', sub: 'Service · gas refill · install', grad: ['rgba(14,32,74,.92)', 'rgba(14,32,74,0)'] as const },
  { id: 'sv1', title: 'Leaks fixed,\ntoday', sub: 'Taps · fittings · pipes', grad: ['rgba(60,24,8,.9)', 'rgba(60,24,8,0)'] as const },
  { id: 'sv4', title: 'Fresh walls,\nzero mess', sub: 'Rooms · touch-ups · textures', grad: ['rgba(48,16,72,.9)', 'rgba(48,16,72,0)'] as const },
];

/** Auto-advancing photo banners (Urban Company home). */
export function BannerCarousel() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 520) - 32;
  const ref = useRef<FlatList<(typeof BANNERS)[number]>>(null);
  const [idx, setIdx] = useState(0);
  const touching = useRef(false);
  useEffect(() => {
    const t = setInterval(() => {
      if (touching.current) return;
      const next = (idx + 1) % BANNERS.length;
      ref.current?.scrollToOffset({ offset: next * (w + 10), animated: true });
      setIdx(next);
    }, 3800);
    return () => clearInterval(t);
  }, [idx, w]);
  return (
    <View>
      <FlatList ref={ref} data={BANNERS} horizontal keyExtractor={x => x.id} showsHorizontalScrollIndicator={false}
        snapToInterval={w + 10} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        onScrollBeginDrag={() => { touching.current = true; }}
        onMomentumScrollEnd={e => { touching.current = false; setIdx(Math.round(e.nativeEvent.contentOffset.x / (w + 10))); }}
        renderItem={({ item }) => {
          const s = svc(item.id);
          return (
            <Tap onPress={() => openService(s.id)} scale={0.985} style={[b.banner, { width: w }]} accessibilityLabel={`${item.title.replace('\n', ' ')} — book ${s.title}`}>
              <Image source={photo(s.photo, 960)} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} cachePolicy="memory-disk" />
              <LinearGradient colors={item.grad} start={{ x: 0, y: 0.5 }} end={{ x: 0.85, y: 0.5 }} style={StyleSheet.absoluteFill} />
              <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
                <View>
                  <Text style={b.bannerKicker}>{s.category.toUpperCase()}</Text>
                  <Text style={b.bannerTitle}>{item.title}</Text>
                  <Text style={b.bannerSub}>{item.sub}</Text>
                </View>
                <View style={b.bannerBtn}><Text style={{ color: K.ink, fontWeight: '800', fontSize: 13 }}>Book now</Text><Ico name="arrow-forward" size={14} color={K.ink} /></View>
              </View>
            </Tap>
          );
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 10 }}>
        {BANNERS.map((x, i) => <View key={x.id} style={{ height: 5, width: i === idx ? 16 : 5, borderRadius: 3, backgroundColor: i === idx ? K.ink : '#CBD2DC' }} />)}
      </View>
    </View>
  );
}

/** "Most booked" / section rail card. */
export function ServiceCard({ s, width = 150, ratio = 1 }: { s: Service; width?: number; ratio?: number }) {
  return (
    <Tap onPress={() => openService(s.id)} style={{ width }} scale={0.97} accessibilityLabel={`${s.title}: ${s.blurb}`}>
      <View style={[b.cardImg, { width, height: Math.round(width / ratio) }]}>
        <Image source={photo(s.photo, 480)} style={StyleSheet.absoluteFill} contentFit="cover" recyclingKey={`c-${s.id}-${width}`} transition={200} cachePolicy="memory-disk" />
      </View>
      <Text style={b.cardTitle} numberOfLines={1}>{s.title}</Text>
      <Text style={b.cardBlurb} numberOfLines={1}>{s.blurb}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 6 }}>
        <Text style={{ color: C.green, fontWeight: '800', fontSize: 13 }}>Book</Text>
        <Ico name="chevron-forward" size={13} color={C.green} />
      </View>
    </Tap>
  );
}

/** Full-width feature card for a section with a single service. */
export function WideServiceCard({ s }: { s: Service }) {
  return (
    <Tap onPress={() => openService(s.id)} style={b.wide} scale={0.985} accessibilityLabel={`${s.title}: ${s.blurb}`}>
      <Image source={photo(s.photo, 960)} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} cachePolicy="memory-disk" />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.75)']} style={[StyleSheet.absoluteFill, { top: '35%' }]} />
      <View style={{ position: 'absolute', left: 14, right: 14, bottom: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.3 }}>{s.title}</Text>
          <Text style={{ color: 'rgba(255,255,255,.88)', fontSize: 13, fontWeight: '600' }}>{s.blurb}</Text>
        </View>
        <View style={b.bannerBtn}><Text style={{ color: K.ink, fontWeight: '800', fontSize: 13 }}>Book</Text><Ico name="arrow-forward" size={14} color={K.ink} /></View>
      </View>
    </Tap>
  );
}

export const b = StyleSheet.create({
  tile: { borderRadius: 14, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  tileImg: { width: '62%', aspectRatio: 1, borderRadius: 999, backgroundColor: '#E5E9F0' },
  tileLbl: { fontSize: 12.5, lineHeight: 16, fontWeight: '600', color: '#1F2937', textAlign: 'center', marginTop: 6, minHeight: 32 },
  banner: { height: 172, borderRadius: 18, overflow: 'hidden', backgroundColor: '#1F2937' },
  bannerKicker: { color: 'rgba(255,255,255,.8)', fontSize: 10.5, fontWeight: '800', letterSpacing: 1.2 },
  bannerTitle: { color: '#fff', fontSize: 23, lineHeight: 27, fontWeight: '900', letterSpacing: -0.5, marginTop: 4 },
  bannerSub: { color: 'rgba(255,255,255,.85)', fontSize: 12.5, fontWeight: '600', marginTop: 4 },
  bannerBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  cardImg: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#E5E9F0' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: K.ink, marginTop: 8 },
  cardBlurb: { fontSize: 12, color: K.meta, marginTop: 1 },
  wide: { height: 190, borderRadius: 18, overflow: 'hidden', backgroundColor: '#1F2937', marginHorizontal: 16 },
});
