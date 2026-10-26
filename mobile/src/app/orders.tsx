import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ico, K, type IconName } from '@/components/kit';
import { EmptyState } from '@/components/account/kit';
import { Tap } from '@/components/ui';
import { Api, type Order } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C, inr } from '@/lib/theme';

const STATUS: Record<string, { label: string; fg: string; bg: string }> = {
  placed: { label: 'Placed', fg: '#1D4ED8', bg: '#EFF6FF' },
  confirmed: { label: 'Confirmed', fg: '#1D4ED8', bg: '#EFF6FF' },
  preparing: { label: 'Preparing', fg: '#B45309', bg: '#FFF7E6' },
  packed: { label: 'Packed', fg: '#B45309', bg: '#FFF7E6' },
  out_for_delivery: { label: 'On the way', fg: '#B45309', bg: '#FFF7E6' },
  delivered: { label: 'Delivered', fg: C.greenDeep, bg: C.greenSoft },
  completed: { label: 'Completed', fg: C.greenDeep, bg: C.greenSoft },
  cancelled: { label: 'Cancelled', fg: C.red, bg: '#FEF2F2' },
};
const statusOf = (s: string) => STATUS[s] ?? { label: s.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()), fg: '#4B5563', bg: '#F3F5F9' };
const kindOf = (id: string) => (id.startsWith('ZBK') ? 'Book' : id.startsWith('ZEA') ? 'Eats' : 'Now');
const KIND: Record<string, { icon: IconName; fg: string; bg: string; label: string }> = {
  Now: { icon: 'basket', fg: C.greenDeep, bg: '#E7F7EF', label: 'Zyphix Now' },
  Eats: { icon: 'restaurant', fg: '#C2410C', bg: '#FFF1E6', label: 'Zyphix Eats' },
  Book: { icon: 'construct', fg: '#4338CA', bg: '#EEF2FF', label: 'Zyphix Book' },
};
const when = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

function OrderRow({ o, index }: { o: Order; index: number }) {
  const s = statusOf(o.status);
  const items = o.items ?? [];
  const summary = items.slice(0, 2).map(i => `${i.qty > 1 ? `${i.qty} × ` : ''}${i.name}`).join(', ') + (items.length > 2 ? ` +${items.length - 2} more` : '');
  const kind = kindOf(o.id);
  const k = KIND[kind]!;
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 35).duration(240)}>
      <Tap onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} style={st.card} scale={0.98} accessibilityLabel={`Order ${o.id}, ${s.label}`}>
        <View style={st.top}>
          <View style={[st.kindIcon, { backgroundColor: k.bg }]}><Ico name={k.icon} size={20} color={k.fg} /></View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={st.kindLbl}>{k.label}</Text>
            <Text style={st.meta} numberOfLines={1}>{when(o.createdAt)}</Text>
          </View>
          <View style={[st.status, { backgroundColor: s.bg }]}><Text style={[st.statusTxt, { color: s.fg }]}>{s.label}</Text></View>
        </View>
        <View style={st.body}>
          {items.some(i => i.image) ? (
            <View style={{ flexDirection: 'row', marginRight: 4 }}>
              {items.filter(i => i.image).slice(0, 3).map((i, n) => (
                <View key={i.id} style={[st.thumb, { marginLeft: n ? -10 : 0, zIndex: 3 - n }]}><Image source={i.image} style={{ width: 30, height: 30 }} contentFit="contain" /></View>
              ))}
            </View>
          ) : null}
          <Text style={st.summary} numberOfLines={2}>{summary || 'Order'}</Text>
        </View>
        <View style={st.foot}>
          <View>
            <Text style={st.total}>{kind === 'Book' && o.total === 0 ? 'Price quoted on visit' : inr(o.total)}</Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>#{o.id}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text style={{ color: C.green, fontWeight: '800', fontSize: 13 }}>View details</Text>
            <Ico name="chevron-forward" size={14} color={C.green} />
          </View>
        </View>
      </Tap>
    </Animated.View>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const q = useQuery({ queryKey: ['myOrders', user?.id], queryFn: Api.myOrders, enabled: !!user });

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: K.page }}>
        <EmptyState icon="receipt-outline" title="Sign in to see your orders" body="Orders you place while signed in show up here." action="Sign in" onAction={() => router.push('/sign-in')} />
      </View>
    );
  }
  const data = [...(q.data ?? [])].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  return (
    <FlatList
      style={{ backgroundColor: K.page }}
      data={data}
      keyExtractor={o => o.id}
      renderItem={({ item, index }) => <OrderRow o={item} index={index} />}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 20, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); }} tintColor={C.green} colors={[C.green]} />}
      ListEmptyComponent={q.isLoading ? (
        <View style={{ gap: 12 }}>{[0, 1, 2].map(i => <View key={i} style={[st.card, { height: 140, opacity: 0.6 }]} />)}</View>
      ) : q.isError ? (
        <EmptyState icon="cloud-offline-outline" title="Couldn't load your orders" body="Pull down to try again." action="Retry" onAction={() => q.refetch()} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="bag-handle-outline" title="No orders yet" body="Groceries in minutes, food from local kitchens, or a verified pro at home." action="Start shopping" onAction={() => router.navigate('/')} />
        </View>
      )}
    />
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingBottom: 10 },
  kindIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  kindLbl: { fontSize: 15, fontWeight: '800', color: K.ink },
  meta: { fontSize: 12, color: K.meta, marginTop: 1 },
  status: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusTxt: { fontSize: 11.5, fontWeight: '800' },
  body: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingBottom: 12 },
  thumb: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F7F8FA', borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  summary: { flex: 1, fontSize: 13.5, color: '#374151', fontWeight: '500' },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#F0F2F5', backgroundColor: '#FCFCFD' },
  total: { fontSize: 15, fontWeight: '800', color: K.ink },
});
