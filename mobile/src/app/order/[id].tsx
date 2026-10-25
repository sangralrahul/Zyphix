import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SFSymbol } from 'expo-symbols';

import { OrderRoute } from '@/components/now/OrderRoute';
import { BillSummary, Icon, type MaterialName } from '@/components/now/shared';
import { Button, Empty } from '@/components/ui';
import { Api, type Order } from '@/lib/api';
import { getLocalOrder, saveLocalOrder } from '@/lib/orderCache';
import { C, R, S, T, inr } from '@/lib/theme';

type Step = { key: string; label: string; sub: string; at: number; ios: SFSymbol; md: MaterialName };
type Flavour = 'now' | 'eats' | 'book';

const flavourOf = (id?: string | null): Flavour => { const s = String(id ?? ''); return s.startsWith('ZEA') ? 'eats' : s.startsWith('ZBK') ? 'book' : 'now'; };

/** Client-side estimate of where an order is, as a fraction of its ETA. */
function stepsFor(f: Flavour): Step[] {
  if (f === 'eats') return [
    { key: 'placed', label: 'Order placed', sub: 'The restaurant has your order', at: 0, ios: 'checkmark.circle.fill', md: 'check_circle' },
    { key: 'preparing', label: 'Preparing', sub: 'Your food is being cooked fresh', at: 0.08, ios: 'flame.fill', md: 'soup_kitchen' },
    { key: 'onway', label: 'On the way', sub: 'Your rider is heading to you', at: 0.6, ios: 'bicycle', md: 'two_wheeler' },
    { key: 'delivered', label: 'Delivered', sub: 'Enjoy your meal', at: 1, ios: 'house.fill', md: 'home' },
  ];
  if (f === 'book') return [
    { key: 'placed', label: 'Booking confirmed', sub: 'We’ve received your request', at: 0, ios: 'checkmark.circle.fill', md: 'check_circle' },
    { key: 'assigned', label: 'Pro assigned', sub: 'A verified professional is assigned', at: 0.15, ios: 'person.fill.checkmark', md: 'verified' },
    { key: 'onway', label: 'On the way', sub: 'Your pro is heading over', at: 0.6, ios: 'figure.walk', md: 'directions_walk' },
    { key: 'delivered', label: 'Arrived', sub: 'Your pro has arrived', at: 1, ios: 'house.fill', md: 'home' },
  ];
  return [
    { key: 'placed', label: 'Order placed', sub: 'We’ve received your order', at: 0, ios: 'checkmark.circle.fill', md: 'check_circle' },
    { key: 'packed', label: 'Packed', sub: 'Your items are packed and sealed', at: 0.25, ios: 'shippingbox.fill', md: 'inventory_2' },
    { key: 'onway', label: 'On the way', sub: 'Your rider is heading to you', at: 0.45, ios: 'bicycle', md: 'two_wheeler' },
    { key: 'delivered', label: 'Delivered', sub: 'Enjoy!', at: 1, ios: 'house.fill', md: 'home' },
  ];
}

async function loadOrder(id: string): Promise<Order & { offline?: boolean }> {
  try {
    const o = await Api.order(id);
    saveLocalOrder(o);
    return o;
  } catch (e) {
    const local = await getLocalOrder(id);
    if (local) return { ...local, offline: true };
    throw e;
  }
}

export default function OrderScreen() {
  const { id: raw } = useLocalSearchParams<{ id: string }>();
  const id = String(raw ?? '');
  const insets = useSafeAreaInsets();
  const q = useQuery({ queryKey: ['order', id], queryFn: () => loadOrder(id), enabled: !!id, refetchInterval: 60_000, retry: 0 });
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const goHome = () => { if (router.canDismiss()) router.dismissAll(); router.replace('/'); };
  const help = () => WebBrowser.openBrowserAsync('https://support.zyphix.in').catch(() => {});

  const o = q.data;
  if (!o) {
    return (
      <View style={[st.fill, { justifyContent: 'center' }]}>
        <Stack.Screen options={{ title: 'Order' }} />
        {q.isError
          ? <Empty title="Couldn’t load this order" body="Check your connection and try again." action="Retry" onAction={() => q.refetch()} />
          : <ActivityIndicator color={C.green} />}
        {q.isError && <Button title="Back to home" variant="secondary" onPress={goHome} style={{ marginHorizontal: S.x3 }} />}
      </View>
    );
  }

  const flavour = flavourOf(o.id || id);
  const steps = stepsFor(flavour);
  const created = Date.parse(o.createdAt) || now;
  const etaMs = Math.max(1, o.etaMinutes || 30) * 60_000;
  const status = (o.status || '').toLowerCase();
  const cancelled = status === 'cancelled' || status === 'canceled';
  const serverDone = status === 'delivered' || status === 'completed';
  const progress = serverDone ? 1 : cancelled ? 0 : Math.min(1, Math.max(0, (now - created) / etaMs));
  const current = steps.reduce((acc, s, i) => (progress >= s.at ? i : acc), 0);
  const done = progress >= 1;
  const remainingMs = Math.max(0, created + etaMs - now);
  const mins = Math.floor(remainingMs / 60_000), secs = Math.floor((remainingMs % 60_000) / 1000);
  const arriveAt = new Date(created + etaMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const savings = o.items.reduce((a, l) => a + Math.max(0, (l.origPrice ?? l.price) - l.price) * l.qty, 0);
  const itemTotal = o.items.reduce((a, l) => a + l.price * l.qty, 0);
  const addr = o.address ?? {};
  const fromLabel = flavour === 'eats' ? 'Kitchen' : flavour === 'book' ? 'Pro' : 'Store';
  const fromIcon = flavour === 'eats' ? { ios: 'fork.knife' as SFSymbol, md: 'restaurant' as MaterialName } : flavour === 'book' ? { ios: 'wrench.and.screwdriver.fill' as SFSymbol, md: 'handyman' as MaterialName } : { ios: 'storefront.fill' as SFSymbol, md: 'storefront' as MaterialName };

  return (
    <View style={st.fill}>
      <Stack.Screen options={{ title: `Order #${o.id.slice(-6)}` }} />
      <ScrollView contentContainerStyle={{ padding: S.xl, paddingBottom: insets.bottom + 120, gap: S.lg }}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); }} colors={[C.green]} />}>
        {/* ETA header */}
        <Animated.View entering={FadeInDown.duration(400)} style={st.etaCard}>
          {cancelled ? (
            <>
              <Text style={[T.tiny, { color: C.red }]}>ORDER CANCELLED</Text>
              <Text style={[T.h2, { color: C.white, marginTop: 4 }]}>This order was cancelled</Text>
            </>
          ) : done ? (
            <>
              <Text style={[T.tiny, { color: C.mint, letterSpacing: 1 }]}>{serverDone ? 'DELIVERED' : 'ESTIMATED · SHOULD HAVE ARRIVED'}</Text>
              <Text style={[T.h1, { color: C.white, marginTop: 4 }]}>{flavour === 'book' ? 'Your pro should be there' : 'Your order should be with you'}</Text>
              <Text style={[T.small, { color: 'rgba(255,255,255,.75)', marginTop: 4 }]}>Something not right? Tap “Need help?” below.</Text>
            </>
          ) : (
            <>
              <Text style={[T.tiny, { color: C.mint, letterSpacing: 1 }]}>ESTIMATED ARRIVAL · {arriveAt}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <Text style={st.countdown}>{mins}:{String(secs).padStart(2, '0')}</Text>
                <Text style={[T.body, { color: 'rgba(255,255,255,.8)' }]}>min left</Text>
              </View>
              <Text style={[T.bodyStrong, { color: C.white, marginTop: 2 }]}>{steps[current]!.label} · <Text style={{ fontWeight: '400', color: 'rgba(255,255,255,.75)' }}>{steps[current]!.sub}</Text></Text>
            </>
          )}
          {o.offline && <Text style={st.offline}>Offline — showing the copy saved on this phone</Text>}
        </Animated.View>

        {!cancelled && <OrderRoute progress={progress} from={fromLabel} fromIcon={fromIcon} done={done} />}

        {/* Timeline */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.md }}>
            <Text style={T.h3}>Status</Text>
            <View style={st.estTag}><Text style={st.estTxt}>{serverDone || cancelled ? 'UPDATED' : 'ESTIMATED'}</Text></View>
          </View>
          {steps.map((s, i) => (
            <TimelineStep key={s.key} step={s} reached={!cancelled && i <= current} active={!cancelled && !done && i === current} last={i === steps.length - 1}
              nextReached={!cancelled && i < current} />
          ))}
        </View>

        {/* Items */}
        <View style={st.card}>
          <Text style={[T.h3, { marginBottom: S.sm }]}>{o.items.length} item{o.items.length === 1 ? '' : 's'}</Text>
          {o.items.map((l, i) => (
            <View key={`${l.id}-${i}`} style={[st.item, i > 0 && st.itemBorder]}>
              <View style={st.thumb}>{!!l.image && <Image source={l.image} style={StyleSheet.absoluteFill} contentFit={flavour === 'eats' ? 'cover' : 'contain'} />}</View>
              <View style={{ flex: 1 }}>
                <Text style={[T.small, { fontWeight: '600', color: C.text }]} numberOfLines={2}>{l.name}</Text>
                <Text style={[T.small, { color: C.text3 }]}>{l.weight ? `${l.weight} · ` : ''}Qty {l.qty}</Text>
              </View>
              <Text style={T.bodyStrong}>{inr(l.price * l.qty)}</Text>
            </View>
          ))}
        </View>

        <BillSummary bill={{ itemTotal, savings, delivery: o.deliveryFee, total: o.total }} />

        {/* Address + payment */}
        <View style={st.card}>
          <View style={st.metaRow}>
            <Icon ios="mappin.circle.fill" md="location_on" size={18} color={C.green} />
            <View style={{ flex: 1 }}>
              <Text style={T.bodyStrong}>{addr.name || 'Delivery address'}{addr.phone ? ` · ${addr.phone}` : ''}</Text>
              <Text style={[T.small, { color: C.text2 }]}>{[addr.line1, addr.city, addr.pincode].filter(Boolean).join(', ')}</Text>
              {!!addr.notes && <Text style={[T.small, { color: C.text3 }]}>Note: {addr.notes}</Text>}
            </View>
          </View>
          <View style={[st.metaRow, { marginTop: S.md }]}>
            <Icon ios="banknote.fill" md="payments" size={18} color={C.green} />
            <Text style={[T.body, { flex: 1 }]}>{o.paymentMode === 'COD' ? 'Cash on delivery' : o.paymentMode} · {inr(o.total)}</Text>
          </View>
          <Text style={[T.small, { color: C.text3, marginTop: S.md }]}>Order ID {o.id}</Text>
        </View>

        <Pressable onPress={help} style={({ pressed }) => [st.help, pressed && { opacity: 0.7 }]} accessibilityRole="link">
          <Icon ios="questionmark.bubble.fill" md="support_agent" size={20} color={C.greenDeep} />
          <View style={{ flex: 1 }}>
            <Text style={T.bodyStrong}>Need help?</Text>
            <Text style={[T.small, { color: C.text2 }]}>Chat with Zyphix support about this order</Text>
          </View>
          <Icon ios="arrow.up.right" md="north_east" size={16} color={C.text3} />
        </Pressable>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <Button title="Back to home" variant="dark" onPress={goHome} />
      </View>
    </View>
  );
}

function TimelineStep({ step, reached, active, last, nextReached }: { step: Step; reached: boolean; active: boolean; last: boolean; nextReached: boolean }) {
  const fill = useSharedValue(0);
  const dot = useSharedValue(0);
  useEffect(() => { fill.value = withTiming(nextReached ? 1 : 0, { duration: 700 }); }, [nextReached, fill]);
  useEffect(() => { dot.value = withTiming(reached ? 1 : 0, { duration: 400 }); }, [reached, dot]);
  const lineStyle = useAnimatedStyle(() => ({ height: `${fill.value * 100}%` }));
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.85 + dot.value * 0.15 }], opacity: 0.35 + dot.value * 0.65 }));
  return (
    <View style={{ flexDirection: 'row', gap: S.md, minHeight: last ? 44 : 64 }}>
      <View style={{ alignItems: 'center', width: 32 }}>
        <Animated.View style={[st.stepDot, reached && { backgroundColor: C.green, borderColor: C.green }, active && st.stepActive, dotStyle]}>
          <Icon ios={step.ios} md={step.md} size={15} color={reached ? C.white : C.text3} />
        </Animated.View>
        {!last && (
          <View style={st.stepLine}>
            <Animated.View style={[{ width: '100%', backgroundColor: C.green }, lineStyle]} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, paddingTop: 5, paddingBottom: S.md }}>
        <Text style={[T.bodyStrong, { color: reached ? C.text : C.text3 }]}>{step.label}{active ? '  ' : ''}{active && <Text style={st.nowTag}>NOW</Text>}</Text>
        <Text style={[T.small, { color: reached ? C.text2 : C.text3 }]}>{step.sub}</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: C.bgSoft },
  etaCard: { backgroundColor: C.ink, borderRadius: R.lg, padding: S.xl },
  countdown: { fontSize: 44, lineHeight: 48, fontWeight: '800', color: C.white, letterSpacing: -1.5, fontVariant: ['tabular-nums'] },
  offline: { ...T.small, color: C.amber, marginTop: S.sm },
  card: { backgroundColor: C.bg, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, padding: S.lg },
  estTag: { backgroundColor: C.bgSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  estTxt: { fontSize: 10, fontWeight: '800', color: C.text2, letterSpacing: 0.6 },
  stepDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: C.line, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  stepActive: { borderColor: C.mint, borderWidth: 3 },
  stepLine: { flex: 1, width: 3, backgroundColor: C.line, borderRadius: 2, marginVertical: 2, overflow: 'hidden' },
  nowTag: { fontSize: 10, fontWeight: '800', color: C.green, letterSpacing: 0.8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  itemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#F7F8FA', overflow: 'hidden' },
  metaRow: { flexDirection: 'row', gap: S.md, alignItems: 'flex-start' },
  help: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.bg, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, padding: S.lg, minHeight: 64 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: S.xl, paddingTop: S.md, backgroundColor: C.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
});
