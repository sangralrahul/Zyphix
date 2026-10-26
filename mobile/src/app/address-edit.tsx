import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, Field } from '@/components/account/kit';
import { Ico, K, type IconName } from '@/components/kit';
import { Button } from '@/components/ui';
import { Api, type Address } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C } from '@/lib/theme';

const LABELS = ['Home', 'Work', 'Other'];
const LABEL_ICON: Record<string, IconName> = { Home: 'home', Work: 'briefcase', Other: 'location' };
type Form = { label: string; name: string; phone: string; line1: string; line2: string; city: string; pincode: string; isDefault: boolean };
type Errs = Partial<Record<keyof Form | 'form', string>>;

function validate(f: Form): Errs {
  const e: Errs = {};
  if (f.name.trim().length < 2) e.name = 'Enter the receiver’s name';
  if (!/^\+?\d[\d\s-]{8,14}$/.test(f.phone.trim())) e.phone = 'Enter a valid phone number';
  if (f.line1.trim().length < 5) e.line1 = 'Enter house / flat and street';
  if (f.city.trim().length < 2) e.city = 'Enter the city';
  if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = 'Pincode must be 6 digits';
  return e;
}

function AddressForm({ initial, id, first }: { initial: Form; id?: string; first: boolean }) {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [f, setF] = useState<Form>(initial);
  const [errs, setErrs] = useState<Errs>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => { setF(p => ({ ...p, [k]: v })); setErrs(e => ({ ...e, [k]: undefined, form: undefined })); };
  const customLabel = !LABELS.slice(0, 2).includes(f.label);

  async function save() {
    const e = validate(f);
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const body: Partial<Address> & { line1: string } = {
      label: f.label.trim() || 'Other', name: f.name.trim(), phone: f.phone.trim(), line1: f.line1.trim(), line2: f.line2.trim(),
      city: f.city.trim(), pincode: f.pincode.trim(), isDefault: f.isDefault || first,
    };
    try {
      const saved = id ? await Api.updateAddress(id, body) : await Api.addAddress(body);
      if (body.isDefault && saved?.id) await Api.setDefault(saved.id).catch(() => null);
      await qc.invalidateQueries({ queryKey: ['addresses'] });
      router.back();
    } catch (err) {
      setErrs({ form: err instanceof Error ? err.message : 'Could not save. Try again.' });
    } finally { setBusy(false); }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: K.page }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 0}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }}>
        <View style={st.card}>
          <Text style={st.h}>Save address as</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LABELS.map(l => {
              const on = l === 'Other' ? customLabel : f.label === l;
              return (
                <Pressable key={l} onPress={() => set('label')(l)} accessibilityRole="radio" accessibilityState={{ checked: on }} style={[st.lblChip, on && st.lblChipOn]}>
                  <Ico name={LABEL_ICON[l]!} size={15} color={on ? C.greenDeep : '#374151'} />
                  <Text style={[st.lblTxt, on && { color: C.greenDeep }]}>{l}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={[st.card, { gap: 14 }]}>
          <Text style={st.h}>Address details</Text>
          <Field label="House / flat, building, street" value={f.line1} onChangeText={set('line1')} error={errs.line1} autoComplete="street-address" textContentType="streetAddressLine1" />
          <Field label="Area / landmark (optional)" value={f.line2} onChangeText={set('line2')} textContentType="streetAddressLine2" />
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <Field label="City" value={f.city} onChangeText={set('city')} error={errs.city} style={{ flex: 1 }} textContentType="addressCity" />
            <Field label="Pincode" value={f.pincode} onChangeText={v => set('pincode')(v.replace(/\D/g, '').slice(0, 6))} error={errs.pincode}
              keyboardType="number-pad" maxLength={6} style={{ flex: 1 }} textContentType="postalCode" />
          </View>
        </View>
        <View style={[st.card, { gap: 14 }]}>
          <Text style={st.h}>Receiver details</Text>
          <Field label="Receiver’s name" value={f.name} onChangeText={set('name')} error={errs.name} autoComplete="name" textContentType="name" />
          <Field label="Phone" value={f.phone} onChangeText={set('phone')} error={errs.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
        </View>
        <View style={[st.card, st.toggle]}>
          <View style={st.tIcon}><Ico name="star" size={16} color={C.greenDeep} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: K.ink }}>Make this my default</Text>
            <Text style={{ fontSize: 12.5, color: K.meta, marginTop: 1 }}>{first ? 'Your first address is the default.' : 'Used first at checkout.'}</Text>
          </View>
          <Switch value={f.isDefault || first} disabled={first || initial.isDefault} onValueChange={v => set('isDefault')(v)}
            trackColor={{ true: C.green, false: '#D1D5DB' }} thumbColor={C.white} ios_backgroundColor="#D1D5DB" />
        </View>
        {errs.form ? <Text style={{ color: C.red, fontWeight: '600' }}>{errs.form}</Text> : null}
      </ScrollView>
      <View style={[st.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button title={id ? 'Save changes' : 'Save address'} onPress={save} loading={busy} style={{ height: 52, borderRadius: 14 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

export default function AddressEdit() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const q = useQuery({ queryKey: ['addresses', user?.id], queryFn: Api.addresses, enabled: !!user });
  const title = id ? 'Edit address' : 'New address';

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: K.page }}>
        <Stack.Screen options={{ title }} />
        <EmptyState icon="location-outline" title="Sign in to save addresses" action="Sign in" onAction={() => router.replace('/sign-in')} />
      </View>
    );
  }
  if (q.isLoading) return <View style={{ flex: 1, backgroundColor: K.page }}><Stack.Screen options={{ title }} /></View>;
  const existing = id ? q.data?.find(a => a.id === id) : undefined;
  if (id && !existing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: K.page }}>
        <Stack.Screen options={{ title }} />
        <EmptyState icon="alert-circle-outline" title="Address not found" body="It may have been deleted." action="Close" onAction={() => router.back()} />
      </View>
    );
  }
  const initial: Form = existing
    ? { label: existing.label || 'Home', name: existing.name, phone: existing.phone, line1: existing.line1, line2: existing.line2 ?? '', city: existing.city, pincode: existing.pincode, isDefault: existing.isDefault }
    : { label: 'Home', name: user.name ?? '', phone: user.phone ?? '', line1: '', line2: '', city: '', pincode: '', isDefault: false };

  return (
    <>
      <Stack.Screen options={{ title }} />
      <AddressForm key={id ?? 'new'} initial={initial} id={id} first={!id && (q.data?.length ?? 0) === 0} />
    </>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14, gap: 10 },
  h: { fontSize: 15, fontWeight: '900', color: K.ink },
  lblChip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1.5, borderColor: '#E1E4EA', backgroundColor: '#fff' },
  lblChipOn: { borderColor: C.green, backgroundColor: '#ECFAF3' },
  lblTxt: { fontSize: 13.5, fontWeight: '700', color: '#374151' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: K.line },
});
