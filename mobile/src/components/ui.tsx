import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Clip } from '@/data/media';
import type { Product } from '@/lib/api';
import { useCart, type Kind } from '@/lib/cart';
import { C, R, S, T, inr, shadow } from '@/lib/theme';

/* ── Pressable with a gentle scale (feels native) ── */
export function Tap({ style, children, scale = 0.97, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; scale?: number; children: React.ReactNode }) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable {...rest} onPressIn={e => { s.value = withSpring(scale, { damping: 20, stiffness: 400 }); rest.onPressIn?.(e); }}
      onPressOut={e => { s.value = withSpring(1, { damping: 20, stiffness: 400 }); rest.onPressOut?.(e); }}>
      <Animated.View style={[style, anim]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ── Buttons ── */
export function Button({ title, onPress, variant = 'primary', loading, disabled, style, icon }: { title: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'dark'; loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>; icon?: React.ReactNode }) {
  const bg = variant === 'primary' ? C.green : variant === 'dark' ? C.ink : variant === 'secondary' ? C.bg : 'transparent';
  const fg = variant === 'primary' || variant === 'dark' ? C.white : C.text;
  return (
    <Tap onPress={disabled || loading ? undefined : onPress} accessibilityRole="button" accessibilityState={{ disabled: !!disabled }}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.5 : 1 }, variant === 'secondary' && styles.btnOutline, style]}>
      {loading ? <ActivityIndicator color={fg} /> : <View style={styles.row}>{icon}<Text style={[T.bodyStrong, { color: fg, fontSize: 16 }]}>{title}</Text></View>}
    </Tap>
  );
}

/* ── Section header ── */
export function SectionHeader({ title, action, onAction, style }: { title: string; action?: string; onAction?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.sectionHead, style]}>
      <Text style={T.h2}>{title}</Text>
      {action && <Pressable onPress={onAction} hitSlop={10}><Text style={[T.bodyStrong, { color: C.green }]}>{action}</Text></Pressable>}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: C.ink, borderColor: C.ink }]}>
      <Text style={[T.small, { fontWeight: '600', color: active ? C.white : C.text }]}>{label}</Text>
    </Pressable>
  );
}

/* ── Quantity stepper / ADD button ── */
export function AddButton({ kind, item, restaurant, compact, large }: { kind: Kind; item: { id: string; name: string; brand?: string; price: number; origPrice?: number | null; image?: string; weight?: string }; restaurant?: { id: string; name: string }; compact?: boolean; /** Bigger button for product pages / sticky bars. */ large?: boolean }) {
  const cart = useCart();
  const q = cart.qty(kind, item.id);
  if (q === 0) {
    return (
      <Tap onPress={() => cart.add(kind, item, restaurant)} style={[styles.add, compact && { height: 32, minWidth: 64 }, large && styles.addLarge]} accessibilityLabel={`Add ${item.name}`}>
        <Text style={[styles.addText, large && { fontSize: 16 }]}>ADD</Text>
      </Tap>
    );
  }
  return (
    <Animated.View entering={FadeIn.duration(150)} style={[styles.stepper, compact && { height: 32, minWidth: 84 }, large && styles.addLarge]}>
      <Pressable hitSlop={8} onPress={() => cart.remove(kind, item.id)} accessibilityLabel="Remove one"><Text style={styles.stepTxt}>−</Text></Pressable>
      <Text style={[styles.stepTxt, { fontSize: 15 }]}>{q}</Text>
      <Pressable hitSlop={8} onPress={() => cart.add(kind, item, restaurant)} accessibilityLabel="Add one"><Text style={styles.stepTxt}>+</Text></Pressable>
    </Animated.View>
  );
}

/* ── Product card (2 or 3 per row) ── */
export function ProductCard({ p, width }: { p: Product; width: number }) {
  const off = p.origPrice && p.origPrice > p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0;
  return (
    <Tap onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} style={[styles.card, { width }]} scale={0.98}>
      <View style={styles.cardImg}>
        <Image source={p.image} style={StyleSheet.absoluteFill} contentFit="contain" transition={200} recyclingKey={p.id} cachePolicy="memory-disk" />
        {off > 0 && <View style={styles.offTag}><Text style={styles.offText}>{off}% OFF</Text></View>}
      </View>
      <Text style={[T.tiny, { color: C.text3, marginTop: 8 }]} numberOfLines={1}>{p.weight || p.brand}</Text>
      <Text style={[T.small, { fontWeight: '600', color: C.text, minHeight: 36 }]} numberOfLines={2}>{p.name}</Text>
      <View style={[styles.rowBetween, { marginTop: 6 }]}>
        <View>
          <Text style={[T.bodyStrong]}>{inr(p.price)}</Text>
          {off > 0 && <Text style={[T.tiny, { color: C.text3, textDecorationLine: 'line-through', fontWeight: '400' }]}>{inr(p.origPrice!)}</Text>}
        </View>
        <AddButton kind="now" item={p} compact />
      </View>
    </Tap>
  );
}

export function ProductSkeleton({ width }: { width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.cardImg, { backgroundColor: C.bgSoft }]} />
      <View style={{ height: 12, width: '50%', backgroundColor: C.bgSoft, borderRadius: 6, marginTop: 10 }} />
      <View style={{ height: 14, width: '90%', backgroundColor: C.bgSoft, borderRadius: 6, marginTop: 8 }} />
    </View>
  );
}

/* ── Looping background video (muted). Shows the poster until the first frame. ── */
export function VideoBg({ clip, style, dim = 0.35 }: { clip: Clip; style?: StyleProp<ViewStyle>; dim?: number }) {
  const player = useVideoPlayer(clip.uri, p => { p.loop = true; p.muted = true; p.play(); });
  useEffect(() => () => { try { player.pause(); } catch {} }, [player]);
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Image source={clip.poster} style={StyleSheet.absoluteFill} contentFit="cover" />
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} />
      {dim > 0 && <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(5,8,14,${dim})` }]} />}
    </View>
  );
}

/* ── Floating cart bar (sits above the tab bar) ── */
export function CartBar({ kind, bottom = 12 }: { kind: Kind; bottom?: number }) {
  const cart = useCart();
  const n = cart.count(kind);
  if (n === 0) return null;
  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} style={[styles.cartBar, { bottom }]}>
      <Tap onPress={() => router.push({ pathname: '/cart', params: { kind } })} style={styles.cartBarInner}>
        <View>
          <Text style={[T.small, { color: 'rgba(255,255,255,.8)' }]}>{n} item{n === 1 ? '' : 's'}{kind === 'eats' && cart.eatsRestaurant ? ` · ${cart.eatsRestaurant.name}` : ''}</Text>
          <Text style={[T.h3, { color: C.white }]}>{inr(cart.subtotal(kind))}</Text>
        </View>
        <Text style={[T.bodyStrong, { color: C.white }]}>View cart  ›</Text>
      </Tap>
    </Animated.View>
  );
}

/* ── Empty / error states ── */
export function Empty({ title, body, action, onAction }: { title: string; body?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ alignItems: 'center', padding: S.x3, gap: 8 }}>
      <Text style={[T.h3, { textAlign: 'center' }]}>{title}</Text>
      {body && <Text style={[T.body, { color: C.text2, textAlign: 'center' }]}>{body}</Text>}
      {action && <Button title={action} onPress={onAction} style={{ marginTop: 12, alignSelf: 'stretch' }} />}
    </View>
  );
}

/* ── Dark hero header with video and gradient (used on Home / Now / Eats / Book) ── */
export function HeroVideo({ clip, height = 300, children }: { clip: Clip; height?: number; children?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: height + insets.top, backgroundColor: C.ink, overflow: 'hidden' }}>
      <VideoBg clip={clip} dim={0.25} />
      <LinearGradient colors={['rgba(5,8,14,.55)', 'rgba(5,8,14,0)', 'rgba(5,8,14,.85)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, paddingTop: insets.top + 8, paddingHorizontal: S.xl, paddingBottom: S.xl, justifyContent: 'flex-end' }}>{children}</View>
    </View>
  );
}

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btn: { height: 54, borderRadius: R.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: S.xl },
  btnOutline: { borderWidth: 1, borderColor: C.line },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: S.xl, marginTop: S.x3, marginBottom: S.md },
  chip: { paddingHorizontal: 14, height: 36, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  add: { height: 36, minWidth: 72, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.green, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center' },
  addText: { color: C.greenDeep, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  addLarge: { height: 50, minWidth: 148, borderRadius: R.md, paddingHorizontal: 18 },
  stepper: { height: 36, minWidth: 92, borderRadius: 10, backgroundColor: C.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  stepTxt: { color: C.white, fontWeight: '800', fontSize: 18 },
  card: { backgroundColor: C.bg, borderRadius: R.md, borderWidth: 1, borderColor: C.line, padding: 10 },
  cardImg: { aspectRatio: 1, borderRadius: 10, backgroundColor: '#FAFAFA', overflow: 'hidden' },
  offTag: { position: 'absolute', top: 6, left: 6, backgroundColor: '#2563EB', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  offText: { color: C.white, fontSize: 10, fontWeight: '800' },
  cartBar: { position: 'absolute', left: S.lg, right: S.lg, ...shadow },
  cartBarInner: { backgroundColor: C.green, borderRadius: R.lg, paddingHorizontal: S.xl, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
