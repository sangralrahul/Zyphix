/**
 * Zyphix commerce kit — Blinkit / Zepto / Zomato style building blocks shared by every tab.
 * Bright, dense, utility-first: header band with delivery time + address + search, offer carousel,
 * category tabs, floating cart pill, badges.
 */
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Tap } from '@/components/ui';
import { Api, type Product } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart, type Kind } from '@/lib/cart';
import { COUPONS, type Coupon } from '@/lib/coupons';
import { C } from '@/lib/theme';

export const K = {
  page: '#F3F5F9',
  card: '#FFFFFF',
  line: '#E8EBF0',
  meta: '#6B7280',
  ink: '#0B0F19',
  blue: '#2563EB',
  rating: '#1BA672',
  orange: '#F97316',
  band: ['#0B9A5F', '#12B76A', '#34D399'] as const,
  imgBg: '#F7F8FA',
};

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export const Ico = ({ name, size = 18, color = K.ink, style }: { name: IconName; size?: number; color?: string; style?: any }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);

/* ── Animated search placeholder ─────────────────────────────────────────── */
const DEFAULT_WORDS = ['milk', 'bread', 'atta', 'chips', 'paneer', 'eggs', 'coffee', 'bananas'];
export function SearchPill({ words = DEFAULT_WORDS, prefix = 'Search', onPress, style }: { words?: string[]; prefix?: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % words.length), 2200); return () => clearInterval(t); }, [words.length]);
  return (
    <Tap onPress={onPress ?? (() => router.push('/search'))} scale={0.99} style={[s.search, style]} accessibilityRole="search" accessibilityLabel={`${prefix} ${words[i]}`}>
      <Ico name="search" size={19} color={K.ink} />
      <View style={{ flex: 1, height: 20, overflow: 'hidden', flexDirection: 'row' }}>
        <Text style={s.searchTxt}>{prefix} </Text>
        <View style={{ flex: 1, height: 20, overflow: 'hidden' }}>
          <Animated.Text key={i} entering={SlideInDown.duration(260)} exiting={SlideOutUp.duration(200)} style={[s.searchTxt, { position: 'absolute', left: 0, top: 0 }]} numberOfLines={1}>“{words[i]}”</Animated.Text>
        </View>
      </View>
      <View style={s.searchDivider} />
      <Ico name="mic-outline" size={19} color={K.ink} />
    </Tap>
  );
}

/* ── Address line (default saved address) ────────────────────────────────── */
export function useDefaultAddress() {
  const { user } = useAuth();
  const q = useQuery({ queryKey: ['addresses', user?.id], queryFn: Api.addresses, enabled: !!user, staleTime: 60_000 });
  const a = q.data?.find(x => x.isDefault) ?? q.data?.[0];
  return { user, address: a };
}

export function AddressRow({ light = true, onPress }: { light?: boolean; onPress?: () => void }) {
  const { user, address } = useDefaultAddress();
  const label = address ? (address.label || 'Home') : user ? 'Add address' : 'Set location';
  const line = address ? [address.line1, address.city].filter(Boolean).join(', ') : user ? 'Tap to add a delivery address' : 'Sign in to use your saved addresses';
  const go = onPress ?? (() => router.push(user ? (address ? '/addresses' : '/address-edit') : '/sign-in'));
  const fg = light ? '#fff' : K.ink;
  return (
    <Pressable onPress={go} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '100%' }}>
      <Text style={{ color: fg, fontSize: 14, fontWeight: '800', flexShrink: 0 }} numberOfLines={1}>{label}</Text>
      <Text style={{ color: light ? 'rgba(255,255,255,.85)' : K.meta, fontSize: 13, fontWeight: '500', flexShrink: 1 }} numberOfLines={1}> · {line}</Text>
      <Ico name="chevron-down" size={14} color={fg} />
    </Pressable>
  );
}

export function AvatarButton({ light = true }: { light?: boolean }) {
  const { user } = useAuth();
  const initial = (user?.name || user?.email || '').trim().charAt(0).toUpperCase();
  return (
    <Tap onPress={() => router.push('/account')} style={[s.avatar, !light && { backgroundColor: '#EEF1F5' }]} accessibilityLabel="Account">
      {initial ? <Text style={{ color: light ? '#fff' : K.ink, fontWeight: '800', fontSize: 15 }}>{initial}</Text> : <Ico name="person" size={18} color={light ? '#fff' : K.ink} />}
    </Tap>
  );
}

/* ── Green header band (Home / Now) ──────────────────────────────────────── */
export function AppHeader({ eyebrow = 'Delivery in', title = '30 minutes', searchWords, searchPrefix, children, bottomPad = 14 }: { eyebrow?: string; title?: string; searchWords?: string[]; searchPrefix?: string; children?: React.ReactNode; bottomPad?: number }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={K.band} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 10, paddingBottom: bottomPad }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ico name="flash" size={12} color="#FDE68A" />
            <Text style={{ color: 'rgba(255,255,255,.9)', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 }}>{eyebrow}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '900', letterSpacing: -0.8 }}>{title}</Text>
          <AddressRow />
        </View>
        <AvatarButton />
      </View>
      <SearchPill words={searchWords} prefix={searchPrefix} style={{ marginHorizontal: 16, marginTop: 14 }} />
      {children}
    </LinearGradient>
  );
}

/* ── Light header (Eats / Book — Zomato / Urban Company) ────────────────── */
export function LightHeader({ title, searchWords, searchPrefix, onSearch, children }: { title?: string; searchWords?: string[]; searchPrefix?: string; onSearch?: () => void; children?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: '#fff', paddingTop: insets.top + 8, paddingBottom: 12 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={s.pinWrap}><Ico name="location" size={18} color={C.green} /></View>
        <View style={{ flex: 1, minWidth: 0 }}>
          {title ? <Text style={{ fontSize: 12, fontWeight: '700', color: C.green, letterSpacing: 0.4 }}>{title.toUpperCase()}</Text> : null}
          <AddressRow light={false} />
        </View>
        <AvatarButton light={false} />
      </View>
      <SearchPill words={searchWords} prefix={searchPrefix} onPress={onSearch} style={{ marginHorizontal: 16, marginTop: 12, borderWidth: 1, borderColor: K.line, ...Platform.select({ default: {} }) }} />
      {children}
    </View>
  );
}

/* ── Category tabs on the band (Zepto / Blinkit) ─────────────────────────── */
export type TabItem = { key: string; label: string; icon: IconName };
export function CategoryTabs({ items, value, onChange, light = true }: { items: TabItem[]; value: string; onChange: (k: string) => void; light?: boolean }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, gap: 4, paddingTop: 14 }}>
      {items.map(t => {
        const on = t.key === value;
        const fg = light ? (on ? '#fff' : 'rgba(255,255,255,.78)') : on ? K.ink : K.meta;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={{ alignItems: 'center', paddingHorizontal: 10, minWidth: 64 }} accessibilityState={{ selected: on }}>
            <Ico name={t.icon} size={22} color={fg} />
            <Text style={{ color: fg, fontSize: 11.5, fontWeight: on ? '800' : '600', marginTop: 4 }} numberOfLines={1}>{t.label}</Text>
            <View style={{ height: 3, width: 28, borderRadius: 2, marginTop: 6, backgroundColor: on ? (light ? '#fff' : C.green) : 'transparent' }} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ── Offer carousel built from the real coupons ──────────────────────────── */
const GRADS: [string, string][] = [['#FF7A1A', '#FFB547'], ['#7C3AED', '#A78BFA'], ['#2563EB', '#60A5FA'], ['#E11D48', '#FB7185'], ['#0B9A5F', '#34D399'], ['#0F172A', '#334155']];
const headline = (c: Coupon) => c.type === 'FLAT' ? `₹${c.value} OFF` : c.type === 'PERCENT' ? `${c.value}% OFF` : 'FREE DELIVERY';

export function OfferCarousel({ coupons = COUPONS, products = [], images, height = 150, kind = 'now' }: { coupons?: Coupon[]; products?: Product[]; /** Optional image URLs for the collage (e.g. dish photos on Eats); overrides `products`. */ images?: string[]; height?: number; kind?: Kind }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 520) - 32;
  const ref = useRef<FlatList<Coupon>>(null);
  const [idx, setIdx] = useState(0);
  const touching = useRef(false);
  const imgs = useMemo(() => images ? images.map((u, i) => ({ id: `img${i}`, image: u })) : products.filter(p => p.imageStatus === 'ready' && p.image).slice(0, 18).map(p => ({ id: p.id, image: p.image })), [products, images]);
  useEffect(() => {
    const t = setInterval(() => {
      if (touching.current || coupons.length < 2) return;
      const next = (idx + 1) % coupons.length;
      ref.current?.scrollToOffset({ offset: next * (w + 10), animated: true });
      setIdx(next);
    }, 3500);
    return () => clearInterval(t);
  }, [idx, coupons.length, w]);
  return (
    <View style={{ marginTop: 14 }}>
      <FlatList
        ref={ref}
        data={coupons}
        horizontal
        keyExtractor={c => c.code}
        showsHorizontalScrollIndicator={false}
        snapToInterval={w + 10}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        onScrollBeginDrag={() => { touching.current = true; }}
        onMomentumScrollEnd={e => { touching.current = false; setIdx(Math.round(e.nativeEvent.contentOffset.x / (w + 10))); }}
        renderItem={({ item: c, index }) => {
          const g = GRADS[index % GRADS.length];
          const pics = imgs.slice((index * 3) % Math.max(imgs.length, 1), (index * 3) % Math.max(imgs.length, 1) + 3);
          return (
            <Tap onPress={() => router.push({ pathname: '/cart', params: { kind, coupon: c.code } })} scale={0.985} style={{ width: w, height, borderRadius: 18, overflow: 'hidden' }}>
              <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,.12)' }} />
              <View style={{ flex: 1, padding: 16, justifyContent: 'space-between', width: '62%' }}>
                <View>
                  <Text style={{ color: 'rgba(255,255,255,.9)', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>{c.firstOrderOnly ? 'NEW USER OFFER' : 'OFFER'}</Text>
                  <Text style={{ color: '#fff', fontSize: 26, lineHeight: 29, fontWeight: '900', letterSpacing: -0.6, marginTop: 2 }}>{headline(c)}</Text>
                  <Text style={{ color: 'rgba(255,255,255,.92)', fontSize: 12, fontWeight: '600', marginTop: 2 }} numberOfLines={2}>{c.desc}</Text>
                </View>
                <View style={{ alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Ico name="pricetag" size={12} color={g[0]} />
                  <Text style={{ color: g[0], fontSize: 12, fontWeight: '900', letterSpacing: 0.5 }}>{c.code}</Text>
                </View>
              </View>
              <View style={{ position: 'absolute', right: 10, bottom: 10, top: 10, width: '36%' }}>
                {pics.map((p, k) => (
                  <View key={p.id + k} style={[s.offerPic, { right: k * 22, top: 6 + k * 24, transform: [{ rotate: `${(k - 1) * 8}deg` }], zIndex: 3 - k }, images && { padding: 3 }]}>
                    <Image source={p.image} style={{ width: '100%', height: '100%', borderRadius: images ? 11 : 0 }} contentFit={images ? 'cover' : 'contain'} />
                  </View>
                ))}
              </View>
            </Tap>
          );
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 8 }}>
        {coupons.map((c, i) => <View key={c.code} style={{ height: 5, width: i === idx ? 16 : 5, borderRadius: 3, backgroundColor: i === idx ? K.ink : '#CBD2DC' }} />)}
      </View>
    </View>
  );
}

/* ── Section title (Blinkit) ─────────────────────────────────────────────── */
export function SectionTitle({ title, sub, action = 'see all', onAction, style }: { title: string; sub?: string; action?: string | null; onAction?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 22, marginBottom: 10 }, style]}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: K.ink, letterSpacing: -0.3 }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 12, color: K.meta, marginTop: 1 }}>{sub}</Text> : null}
      </View>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: C.green, fontWeight: '800', fontSize: 13 }}>{action}</Text>
          <Ico name="chevron-forward" size={14} color={C.green} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ── Badges ──────────────────────────────────────────────────────────────── */
export function OffRibbon({ pct }: { pct: number }) {
  return (
    <View style={s.ribbon}>
      <Text style={s.ribbonTxt}>{pct}%</Text>
      <Text style={s.ribbonTxt}>OFF</Text>
    </View>
  );
}
export function TimerChip({ label = '30 MINS' }: { label?: string }) {
  return (
    <View style={s.timer}><Ico name="time-outline" size={10} color="#374151" /><Text style={s.timerTxt}>{label}</Text></View>
  );
}
export function RatingPill({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <View style={[s.rating, size === 'sm' && { paddingHorizontal: 5, paddingVertical: 2 }]}>
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: size === 'sm' ? 11 : 13 }}>{rating.toFixed(1)}</Text>
      <Ico name="star" size={size === 'sm' ? 9 : 11} color="#fff" />
    </View>
  );
}
export function VegMark({ veg }: { veg: boolean }) {
  const col = veg ? '#16A34A' : '#B91C1C';
  return (
    <View style={{ width: 14, height: 14, borderWidth: 1.5, borderColor: col, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}>
      {veg ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: col }} /> : <View style={{ width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: col }} />}
    </View>
  );
}

/* ── Floating cart pill (Blinkit / Zepto) ────────────────────────────────── */
export function FloatingCart({ kind, bottom = 16 }: { kind: Kind; bottom?: number }) {
  const cart = useCart();
  const n = cart.count(kind);
  const lines = cart[kind];
  if (n === 0) return null;
  const thumbs = lines.filter(l => l.image).slice(-3);
  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} exiting={FadeOutDown} style={{ position: 'absolute', left: 0, right: 0, bottom, alignItems: 'center' }} pointerEvents="box-none">
      <Tap onPress={() => router.push({ pathname: '/cart', params: { kind } })} style={s.fcart} accessibilityLabel={`View cart, ${n} items`}>
        <View style={{ flexDirection: 'row' }}>
          {thumbs.length ? thumbs.map((l, i) => (
            <View key={l.id} style={[s.fthumb, { marginLeft: i ? -12 : 0, zIndex: 3 - i }]}>
              <Image source={l.image} style={{ width: 30, height: 30 }} contentFit="contain" />
            </View>
          )) : <View style={s.fthumb}><Ico name="bag-handle" size={18} color={C.green} /></View>}
        </View>
        <View style={{ marginLeft: 10, marginRight: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>View cart</Text>
          <Text style={{ color: 'rgba(255,255,255,.85)', fontSize: 12, fontWeight: '600' }}>{n} item{n === 1 ? '' : 's'}{kind === 'eats' && cart.eatsRestaurant ? ` · ${cart.eatsRestaurant.name}` : ''}</Text>
        </View>
        <View style={s.fchev}><Ico name="chevron-forward" size={16} color={C.green} /></View>
      </Tap>
    </Animated.View>
  );
}

/** Bottom offset for floating elements on tab screens (above the tab bar). */
export function useFloatBottom() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'web') return 12;
  return Platform.OS === 'ios' ? insets.bottom + 58 : 12;
}

const s = StyleSheet.create({
  search: { height: 48, borderRadius: 14, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  searchTxt: { color: '#6B7280', fontSize: 15, fontWeight: '500', lineHeight: 20 },
  searchDivider: { width: 1, height: 22, backgroundColor: K.line },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,.35)' },
  pinWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  offerPic: { position: 'absolute', width: 72, height: 72, borderRadius: 14, backgroundColor: '#fff', padding: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  ribbon: { position: 'absolute', top: 0, left: 8, backgroundColor: K.blue, paddingHorizontal: 5, paddingTop: 3, paddingBottom: 5, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, alignItems: 'center', zIndex: 2 },
  ribbonTxt: { color: '#fff', fontSize: 9.5, lineHeight: 11, fontWeight: '900' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', backgroundColor: '#F1F3F6', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  timerTxt: { fontSize: 9.5, fontWeight: '800', color: '#374151', letterSpacing: 0.2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: K.rating, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 },
  fcart: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.green, borderRadius: 30, paddingLeft: 8, paddingRight: 8, paddingVertical: 8, shadowColor: '#0B5D3B', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  fthumb: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.green, overflow: 'hidden' },
  fchev: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
