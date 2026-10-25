import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Empty, Tap, styles as ui } from '@/components/ui';
import { Api, type Order } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C, R, S, T, inr } from '@/lib/theme';

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
const statusOf = (s: string) => STATUS[s] ?? { label: s.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()), fg: C.text2, bg: C.bgSoft };
const kindOf = (id: string) => (id.startsWith('ZBK') ? 'Book' : id.startsWith('ZEA') ? 'Eats' : 'Now');
const when = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

function OrderRow({ o, index }: { o: Order; index: number }) {
  const s = statusOf(o.status);
  const items = o.items ?? [];
  const summary = items.slice(0, 2).map(i => `${i.qty > 1 ? `${i.qty} × ` : ''}${i.name}`).join(', ') + (items.length > 2 ? ` +${items.length - 2} more` : '');
  const kind = kindOf(o.id);
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 35).duration(240)}>
      <Tap onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} style={st.card} scale={0.98} accessibilityLabel={`Order ${o.id}, ${s.label}`}>
        <View style={ui.rowBetween}>
          <View style={ui.row}>
            <View style={st.kind}><Text style={st.kindTxt}>{kind.toUpperCase()}</Text></View>
            <Text style={[T.small, { color: C.text3 }]}>#{o.id}</Text>
          </View>
          <View style={[st.status, { backgroundColor: s.bg }]}><Text style={[st.statusTxt, { color: s.fg }]}>{s.label}</Text></View>
        </View>
        <Text style={[T.bodyStrong, { marginTop: 10 }]} numberOfLines={2}>{summary || 'Order'}</Text>
        <View style={[ui.rowBetween, { marginTop: 8 }]}>
          <Text style={[T.small, { color: C.text2 }]}>{when(o.createdAt)}</Text>
          <Text style={T.bodyStrong}>{kind === 'Book' && o.total === 0 ? 'Quote on visit' : inr(o.total)}  <Text style={{ color: C.text3 }}>›</Text></Text>
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Empty title="Sign in to see your orders" body="Orders you place while signed in show up here." action="Sign in" onAction={() => router.push('/sign-in')} />
      </View>
    );
  }
  const data = [...(q.data ?? [])].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  return (
    <FlatList
      style={{ backgroundColor: C.bgSoft }}
      data={data}
      keyExtractor={o => o.id}
      renderItem={({ item, index }) => <OrderRow o={item} index={index} />}
      contentContainerStyle={{ padding: S.lg, gap: 12, paddingBottom: insets.bottom + S.xl, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); }} tintColor={C.green} colors={[C.green]} />}
      ListEmptyComponent={q.isLoading ? (
        <View style={{ gap: 12 }}>{[0, 1, 2].map(i => <View key={i} style={[st.card, { height: 112, borderColor: C.bg }]} />)}</View>
      ) : q.isError ? (
        <Empty title="Couldn't load your orders" body="Pull down to try again." action="Retry" onAction={() => q.refetch()} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Empty title="No orders yet" body="Groceries in minutes, food from local kitchens, or a verified pro at home." action="Start shopping" onAction={() => router.navigate('/')} />
        </View>
      )}
    />
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: C.bg, borderRadius: R.md, padding: S.lg, borderWidth: 1, borderColor: C.line },
  kind: { backgroundColor: C.ink, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  kindTxt: { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  status: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.pill },
  statusTxt: { fontSize: 12, fontWeight: '700' },
});
