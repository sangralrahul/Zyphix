import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { confirm } from '@/components/account/kit';
import { Button, Empty, styles as ui } from '@/components/ui';
import { Api, type Address } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C, R, S, T } from '@/lib/theme';

export default function Addresses() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const key = ['addresses', user?.id];
  const q = useQuery({ queryKey: key, queryFn: Api.addresses, enabled: !!user });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Empty title="Sign in to save addresses" body="Keep home, work and more handy for faster checkout." action="Sign in" onAction={() => router.push('/sign-in')} />
      </View>
    );
  }

  async function run(id: string, fn: () => Promise<unknown>) {
    setBusyId(id); setErr(null);
    try { await fn(); await qc.invalidateQueries({ queryKey: ['addresses'] }); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Something went wrong. Try again.'); }
    finally { setBusyId(null); }
  }

  const list = [...(q.data ?? [])].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

  const renderItem = ({ item: a, index }: { item: Address; index: number }) => (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 5) * 40).duration(240)} layout={LinearTransition} style={[st.card, a.isDefault && { borderColor: C.green }]}>
      <View style={ui.rowBetween}>
        <View style={ui.row}>
          <Text style={T.h3}>{a.label || 'Address'}</Text>
          {a.isDefault && <View style={st.badge}><Text style={st.badgeTxt}>DEFAULT</Text></View>}
        </View>
      </View>
      <Text style={[T.body, { marginTop: 4 }]}>{a.name}{a.phone ? ` · ${a.phone}` : ''}</Text>
      <Text style={[T.small, { color: C.text2 }]}>{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</Text>
      <View style={[ui.row, { gap: 18, marginTop: 12, opacity: busyId === a.id ? 0.4 : 1 }]}>
        <Pressable hitSlop={8} disabled={!!busyId} onPress={() => router.push({ pathname: '/address-edit', params: { id: a.id } })}><Text style={st.act}>Edit</Text></Pressable>
        {!a.isDefault && <Pressable hitSlop={8} disabled={!!busyId} onPress={() => run(a.id, () => Api.setDefault(a.id))}><Text style={st.act}>Set as default</Text></Pressable>}
        <Pressable hitSlop={8} disabled={!!busyId} onPress={() => confirm('Delete this address?', [a.line1, a.city].filter(Boolean).join(', '), 'Delete', () => run(a.id, () => Api.deleteAddress(a.id)), true)}>
          <Text style={[st.act, { color: C.red }]}>Delete</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bgSoft }}>
      <FlatList
        data={list}
        keyExtractor={a => a.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: S.lg, gap: 12, paddingBottom: insets.bottom + 100 }}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); }} tintColor={C.green} colors={[C.green]} />}
        ListHeaderComponent={err ? <Text style={{ color: C.red }}>{err}</Text> : undefined}
        ListEmptyComponent={q.isLoading ? (
          <View style={{ gap: 12 }}>{[0, 1].map(i => <View key={i} style={[st.card, { height: 120, backgroundColor: C.bg, borderColor: C.bg }]} />)}</View>
        ) : q.isError ? (
          <Empty title="Couldn't load addresses" body="Check your connection and try again." action="Retry" onAction={() => q.refetch()} />
        ) : (
          <Empty title="No saved addresses yet" body="Add one now and checkout gets a lot quicker." />
        )}
      />
      <View style={[st.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button title="Add address" onPress={() => router.push('/address-edit')} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: C.bg, borderRadius: R.md, padding: S.lg, borderWidth: 1.5, borderColor: C.line },
  badge: { backgroundColor: C.greenSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  badgeTxt: { color: C.greenDeep, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  act: { color: C.green, fontWeight: '700', fontSize: 14 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: S.lg, paddingTop: 12, backgroundColor: C.bgSoft },
});
