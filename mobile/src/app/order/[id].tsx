import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ico, K, type IconName } from '@/components/kit';
import { BillCard } from '@/components/now/BillCard';
import { EmptyState } from '@/components/now/blocks';
import { TrackMap } from '@/components/now/TrackMap';
import { Tap } from '@/components/ui';
import { Api, type Order } from '@/lib/api';
import { getLocalOrder, saveLocalOrder } from '@/lib/orderCache';
import { C, inr } from '@/lib/theme';

type Step = { key: string; label: string; sub: string; at: number; icon: IconName };
type Flavour = 'now' | 'eats' | 'book';

const flavourOf = (id?: string | null): Flavour => { const s = String(id ?? ''); return s.startsWith('ZEA') ? 'eats' : s.startsWith('ZBK') ? 'book' : 'now'; };

/** Client-side estimate of where an order is, as a fraction of its ETA. */
function stepsFor(f: Flavour): Step[] {
  if (f === 'eats') return [
    { key: 'placed', label: 'Order placed', sub: 'The restaurant has your order', at: 0, icon: 'receipt' },
    { key: 'preparing', label: 'Preparing', sub: 'Your food is being cooked fresh', at: 0.08, icon: 'flame' },
    { key: 'onway', label: 'On the way', sub: 'Your rider is heading to you', at: 0.6, icon: 'bicycle' },
    { key: 'delivered', label: 'Delivered', sub: 'Enjoy your meal', at: 1, icon: 'home' },
  ];
  if (f === 'book') return [
    { key: 'placed', label: 'Booking confirmed', sub: 'We’ve received your request', at: 0, icon: 'receipt' },
    { key: 'assigned', label: 'Pro assigned', sub: 'A verified professional is assigned', at: 0.15, icon: 'shield-checkmark' },
    { key: 'onway', label: 'On the way', sub: 'Your pro is heading over', at: 0.6, icon: 'walk' },
    { key: 'delivered', label: 'Arrived', sub: 'Your pro has arrived', at: 1, icon: 'home' },
  ];
  return [
    { key: 'placed', label: 'Order placed', sub: 'We’ve received your order', at: 0, icon: 'receipt' },
    { key: 'packed', label: 'Packing', sub: 'A store near you is packing your items', at: 0.15, icon: 'cube' },
    { key: 'onway', label: 'On the way', sub: 'Your rider is heading to you', at: 0.45, icon: 'bicycle' },
    { key: 'delivered', label: 'Delivered', sub: 'Enjoy!', at: 1, icon: 'home' },
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
          ? <EmptyState icon="receipt-outline" title="Couldn’t load this order" body="Check your connection and try again." action="Retry" onAction={() => q.refetch()} />
          : <ActivityIndicator color={C.green} />}
        {q.isError ? <Pressable onPress={goHome} style={{ alignSelf: 'center', padding: 12 }}><Text style={{ color: C.green, fontWeight: '800' }}>Back to home</Text></Pressable> : null}
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
  const remainingMin = Math.max(1, Math.ceil((created + etaMs - now) / 60_000));
  const arriveAt = new Date(created + etaMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const savings = o.items.reduce((a, l) => a + Math.max(0, (l.origPrice ?? l.price) - l.price) * l.qty, 0);
  const itemTotal = o.items.reduce((a, l) => a + l.price * l.qty, 0);
  const count = o.items.reduce((a, l) => a + l.qty, 0);
  const addr = o.address ?? {};
  const fromLabel = flavour === 'eats' ? 'Kitchen' : flavour === 'book' ? 'Pro' : 'Store';
  const fromIcon: IconName = flavour === 'eats' ? 'restaurant' : flavour === 'book' ? 'construct' : 'storefront';
  const what = flavour === 'book' ? 'Your pro' : 'Your order';
  const bandColors = cancelled ? (['#7F1D1D', '#B91C1C'] as const) : (['#0B8F55', '#0DA366', '#22C17E'] as const);

  return (
    <View style={st.fill}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); }} colors={[C.green]} tintColor="#fff" />}>
        {/* Green status band */}
        <LinearGradient colors={bandColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[st.band, { paddingTop: insets.top + 8 }]}>
          <View style={st.bandTop}>
            <Pressable onPress={goHome} hitSlop={10} style={st.bandBtn} accessibilityLabel="Close and go home"><Ico name="close" size={20} color="#fff" /></Pressable>
            <Text style={st.bandId}>Order #{o.id.slice(-6)}</Text>
            <Pressable onPress={help} hitSlop={10} style={[st.bandBtn, { width: 'auto', paddingHorizontal: 12 }]} accessibilityLabel="Help"><Text style={st.helpTxt}>Help</Text></Pressable>
          </View>

          <Animated.View entering={FadeInDown.duration(380)} style={{ alignItems: 'center', marginTop: 10 }}>
            {cancelled ? (
              <>
                <Text style={st.big}>Order cancelled</Text>
                <Text style={st.sub}>Any amount paid will be refunded if applicable</Text>
              </>
            ) : done ? (
              <>
                <Text style={st.kicker}>{serverDone ? 'DELIVERED' : 'ESTIMATED'}</Text>
                <Text style={st.big}>{flavour === 'book' ? 'Your pro should be there' : 'Order delivered'}</Text>
                <Text style={st.sub}>Something not right? Tap Help.</Text>
              </>
            ) : (
              <>
                <Text style={st.kicker}>{steps[current]!.label.toUpperCase()}</Text>
                <Text style={st.big}>{flavour === 'book' ? 'Pro arriving' : 'Arriving'} in {remainingMin} min{remainingMin === 1 ? '' : 's'}</Text>
                <View style={st.onTime}><Text style={st.onTimeTxt}>On time · by {arriveAt}</Text></View>
              </>
            )}
          </Animated.View>

          {!cancelled ? <StepBar steps={steps} current={current} progress={progress} done={done} /> : null}
        </LinearGradient>

        <View style={{ padding: 12, gap: 12, marginTop: -18 }}>
          {!cancelled ? (
            <View style={st.card}>
              <TrackMap progress={progress} from={fromLabel} fromIcon={fromIcon} done={done} />
              <View style={st.statusRow}>
                <View style={st.statusIco}><Ico name={steps[current]!.icon} size={18} color={C.green} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.statusT}>{done ? `${what} has arrived` : steps[current]!.sub}</Text>
                  <Text style={st.statusS}>{done ? 'Thanks for ordering with Zyphix' : 'Live estimate based on your order time'}</Text>
                </View>
              </View>
            </View>
          ) : null}
          {o.offline ? <Text style={st.offline}>Offline — showing the copy saved on this phone</Text> : null}

          {/* Order summary */}
          <View style={st.card}>
            <Text style={st.cardT}>Order summary</Text>
            <Text style={st.cardS}>{count} item{count === 1 ? '' : 's'} in this order</Text>
            {o.items.map((l, i) => (
              <View key={`${l.id}-${i}`} style={[st.item, i > 0 && st.itemBorder]}>
                <View style={st.thumb}>{l.image ? <Image source={l.image} style={flavour === 'eats' ? StyleSheet.absoluteFill : { position: 'absolute', top: 4, left: 4, right: 4, bottom: 4 }} contentFit={flavour === 'eats' ? 'cover' : 'contain'} /> : null}</View>
                <View style={{ flex: 1 }}>
                  <Text style={st.iName} numberOfLines={2}>{l.name}</Text>
                  <Text style={st.iMeta}>{l.weight ? `${l.weight} · ` : ''}{l.qty} × {inr(l.price)}</Text>
                </View>
                <Text style={st.iPrice}>{inr(l.price * l.qty)}</Text>
              </View>
            ))}
          </View>

          <BillCard subtotal={itemTotal} savings={savings} delivery={o.deliveryFee} couponCode={(o as { couponCode?: string }).couponCode ?? null} couponDiscount={o.discount || 0} total={o.total} />

          {/* Address + payment */}
          <View style={st.card}>
            <InfoRow icon="location" title={addr.name ? `${addr.name}${addr.phone ? ` · ${addr.phone}` : ''}` : 'Delivery address'} sub={[addr.line1, addr.city, addr.pincode].filter(Boolean).join(', ')} note={addr.notes ? `Note: ${addr.notes}` : undefined} />
            <View style={st.div} />
            <InfoRow icon="cash-outline" title={o.paymentMode === 'COD' ? 'Cash on delivery' : o.paymentMode} sub={`Pay ${inr(o.total)} when it arrives`} />
            <View style={st.div} />
            <InfoRow icon="receipt-outline" title={`Order ID ${o.id}`} sub={new Date(created).toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} />
          </View>

          <Tap onPress={help} scale={0.99} style={st.help} accessibilityRole="link">
            <View style={st.helpIco}><Ico name="chatbubble-ellipses" size={18} color={C.greenDeep} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.cardT}>Need help with this order?</Text>
              <Text style={st.cardS}>Chat with Zyphix support</Text>
            </View>
            <Ico name="chevron-forward" size={18} color={K.meta} />
          </Tap>
        </View>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <Tap onPress={goHome} style={st.homeBtn} scale={0.98} accessibilityRole="button">
          <Ico name="home" size={18} color="#fff" />
          <Text style={st.homeTxt}>Back to home</Text>
        </Tap>
      </View>
    </View>
  );
}

/** Animated 4-step progress bar on the band. */
function StepBar({ steps, current, progress, done }: { steps: Step[]; current: number; progress: number; done: boolean }) {
  const [w, setW] = useState(0);
  const fill = useSharedValue(0);
  const shimmer = useSharedValue(0);
  // Visual fraction: snap to the reached step, then glide within the segment.
  const seg = steps.length - 1;
  const next = steps[Math.min(current + 1, seg)]!;
  const cur = steps[current]!;
  const within = next.at > cur.at ? (progress - cur.at) / (next.at - cur.at) : 0;
  const frac = done ? 1 : Math.min(1, (current + Math.max(0, Math.min(1, within)) * 0.9) / seg);
  useEffect(() => { fill.value = withTiming(frac, { duration: 800 }); }, [frac, fill]);
  useEffect(() => { shimmer.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false); }, [shimmer]);
  const inner = w - 32; // node row width
  const bar = useAnimatedStyle(() => ({ width: fill.value * Math.max(0, inner - 34) }));
  const glow = useAnimatedStyle(() => ({ opacity: done ? 0 : 0.6 * (1 - shimmer.value), transform: [{ scale: 1 + shimmer.value * 0.7 }] }));
  return (
    <View style={{ marginTop: 22 }} onLayout={e => setW(e.nativeEvent.layout.width)}>
      <View style={{ height: 34, justifyContent: 'center', marginHorizontal: 16 }}>
        <View style={[st.track, { left: 17, right: 17 }]} />
        <Animated.View style={[st.trackFill, { left: 17 }, bar]} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {steps.map((s, i) => {
            const reached = i <= current;
            const active = !done && i === current;
            return (
              <View key={s.key} style={{ width: 34, alignItems: 'center', justifyContent: 'center' }}>
                {active ? <Animated.View style={[st.glow, glow]} /> : null}
                <View style={[st.node, reached && st.nodeOn]}>
                  <Ico name={s.icon} size={16} color={reached ? C.green : 'rgba(255,255,255,.85)'} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View style={{ height: 16, marginTop: 6 }}>
        {w > 0 ? steps.map((s, i) => {
          const cx = 16 + 17 + (i * (inner - 34)) / seg;
          const LW = 84;
          const left = Math.max(10, Math.min(w - LW - 10, cx - LW / 2));
          const align = left === 10 ? 'left' : left === w - LW - 10 ? 'right' : 'center';
          return (
            <Text key={s.key} style={[st.nodeLbl, { left, width: LW, textAlign: align }, i <= current && { color: '#fff', fontWeight: '800' }]} numberOfLines={1}>{s.label}</Text>
          );
        }) : null}
      </View>
    </View>
  );
}

function InfoRow({ icon, title, sub, note }: { icon: IconName; title: string; sub?: string; note?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <View style={st.infoIco}><Ico name={icon} size={16} color="#374151" /></View>
      <View style={{ flex: 1 }}>
        <Text style={st.infoT}>{title}</Text>
        {sub ? <Text style={st.cardS}>{sub}</Text> : null}
        {note ? <Text style={[st.cardS, { color: '#9CA3AF' }]}>{note}</Text> : null}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: K.page },
  band: { paddingBottom: 38 },
  bandTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  bandBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,.18)', alignItems: 'center', justifyContent: 'center' },
  bandId: { color: 'rgba(255,255,255,.92)', fontSize: 14, fontWeight: '800' },
  helpTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  kicker: { color: 'rgba(255,255,255,.85)', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  big: { color: '#fff', fontSize: 28, lineHeight: 33, fontWeight: '900', letterSpacing: -0.6, marginTop: 4, textAlign: 'center', paddingHorizontal: 16 },
  sub: { color: 'rgba(255,255,255,.85)', fontSize: 13, fontWeight: '600', marginTop: 4 },
  onTime: { marginTop: 8, backgroundColor: 'rgba(255,255,255,.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  onTimeTxt: { color: '#fff', fontSize: 12.5, fontWeight: '800' },
  track: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,.3)' },
  trackFill: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: '#fff' },
  node: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#0B8F55', borderWidth: 2, borderColor: 'rgba(255,255,255,.45)', alignItems: 'center', justifyContent: 'center' },
  nodeOn: { backgroundColor: '#fff', borderColor: '#fff' },
  glow: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff' },
  nodeLbl: { position: 'absolute', top: 0, fontSize: 11, color: 'rgba(255,255,255,.78)', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12, paddingHorizontal: 2 },
  statusIco: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E9F8F1', alignItems: 'center', justifyContent: 'center' },
  statusT: { fontSize: 14, fontWeight: '800', color: K.ink },
  statusS: { fontSize: 12, color: K.meta, marginTop: 1 },
  offline: { fontSize: 12.5, color: '#B45309', fontWeight: '700', textAlign: 'center' },
  cardT: { fontSize: 15, fontWeight: '800', color: K.ink },
  cardS: { fontSize: 12.5, color: K.meta, marginTop: 2, lineHeight: 17 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  itemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: K.line },
  thumb: { width: 48, height: 48, borderRadius: 10, backgroundColor: K.imgBg, borderWidth: 1, borderColor: '#EEF0F3', overflow: 'hidden' },
  iName: { fontSize: 13, fontWeight: '600', color: K.ink },
  iMeta: { fontSize: 12, color: K.meta, marginTop: 2 },
  iPrice: { fontSize: 14, fontWeight: '800', color: K.ink },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: K.line, marginVertical: 12, marginLeft: 44 },
  infoIco: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F3F6', alignItems: 'center', justifyContent: 'center' },
  infoT: { fontSize: 14, fontWeight: '700', color: K.ink },
  help: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14 },
  helpIco: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E9F8F1', alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingTop: 10, backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: K.line },
  homeBtn: { height: 52, borderRadius: 14, backgroundColor: K.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  homeTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
