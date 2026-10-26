import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, addrIcon, confirm } from '@/components/account/kit';
import { Ico, K, type IconName } from '@/components/kit';
import { Api, type Address } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C } from '@/lib/theme';

function Action({ icon, label, onPress, danger, disabled }: { icon: IconName; label: string; onPress: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <Pressable hitSlop={6} disabled={disabled} onPress={onPress} accessibilityRole="button" style={({ pressed }) => [st.act, pressed && { opacity: 0.6 }]}>
      <Ico name={icon} size={15} color={danger ? C.red : C.greenDeep} />
      <Text style={[st.actTxt, danger && { color: C.red }]}>{label}</Text>
    </Pressable>
  );
}

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
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: K.page }}>
        <Stack.Screen options={{ title: 'Address book' }} />
        <EmptyState icon="location-outline" title="Sign in to save addresses" body="Keep home, work and more handy for faster checkout." action="Sign in" onAction={() => router.push('/sign-in')} />
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
    <Animated.View entering={FadeInDown.delay(Math.min(index, 5) * 40).duration(240)} layout={LinearTransition} style={[st.card, a.isDefault && { borderColor: '#9FDDBF' }]}>
      <View style={st.row}>
        <View style={[st.icon, a.isDefault && { backgroundColor: '#E7F7EF' }]}><Ico name={addrIcon(a.label)} size={19} color={a.isDefault ? C.greenDeep : '#374151'} /></View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={st.label}>{a.label || 'Address'}</Text>
            {a.isDefault && <View style={st.badge}><Text style={st.badgeTxt}>DEFAULT</Text></View>}
          </View>
          <Text style={st.addr}>{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</Text>
          <Text style={st.meta}>{a.name}{a.phone ? ` · ${a.phone}` : ''}</Text>
        </View>
      </View>
      <View style={[st.actions, { opacity: busyId === a.id ? 0.4 : 1 }]}>
        <Action icon="create-outline" label="Edit" disabled={!!busyId} onPress={() => router.push({ pathname: '/address-edit', params: { id: a.id } })} />
        {!a.isDefault && <Action icon="checkmark-circle-outline" label="Set default" disabled={!!busyId} onPress={() => run(a.id, () => Api.setDefault(a.id))} />}
        <Action icon="trash-outline" label="Delete" danger disabled={!!busyId}
          onPress={() => confirm('Delete this address?', [a.line1, a.city].filter(Boolean).join(', '), 'Delete', () => run(a.id, () => Api.deleteAddress(a.id)), true)} />
      </View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: K.page }}>
      <Stack.Screen options={{ title: 'Address book' }} />
      <FlatList
        data={list}
        keyExtractor={a => a.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); }} tintColor={C.green} colors={[C.green]} />}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <Pressable onPress={() => router.push('/address-edit')} style={({ pressed }) => [st.addRow, pressed && { opacity: 0.7 }]} accessibilityRole="button">
              <View style={[st.icon, { backgroundColor: '#E7F7EF' }]}><Ico name="add" size={20} color={C.green} /></View>
              <Text style={{ flex: 1, fontSize: 15, fontWeight: '800', color: C.green }}>Add a new address</Text>
              <Ico name="chevron-forward" size={18} color={C.green} />
            </Pressable>
            {list.length > 0 ? <Text style={st.sec}>SAVED ADDRESSES</Text> : null}
            {err ? <Text style={{ color: C.red, fontWeight: '600' }}>{err}</Text> : null}
          </View>
        }
        ListEmptyComponent={q.isLoading ? (
          <View style={{ gap: 12 }}>{[0, 1].map(i => <View key={i} style={[st.card, { height: 128, opacity: 0.6 }]} />)}</View>
        ) : q.isError ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load addresses" body="Check your connection and try again." action="Retry" onAction={() => q.refetch()} />
        ) : (
          <EmptyState icon="map-outline" title="No saved addresses yet" body="Add one now and checkout gets a lot quicker." />
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: 12, padding: 14 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 16, fontWeight: '800', color: K.ink },
  badge: { backgroundColor: '#E7F7EF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  badgeTxt: { color: C.greenDeep, fontSize: 9.5, fontWeight: '900', letterSpacing: 0.5 },
  addr: { fontSize: 13.5, lineHeight: 19, color: '#374151', marginTop: 3 },
  meta: { fontSize: 12.5, color: K.meta, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 4, borderTopWidth: 1, borderTopColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 4 },
  act: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, height: 38 },
  actTxt: { fontSize: 13.5, fontWeight: '800', color: C.greenDeep },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line },
  sec: { fontSize: 12, fontWeight: '800', color: K.meta, letterSpacing: 1, marginTop: 6, marginLeft: 4 },
});
