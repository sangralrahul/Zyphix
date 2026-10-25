import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Field } from '@/components/account/kit';
import { Button, Empty } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { C, S, T } from '@/lib/theme';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [errs, setErrs] = useState<{ name?: string; phone?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Empty title="Sign in to edit your profile" action="Sign in" onAction={() => router.push('/sign-in')} />
      </View>
    );
  }
  const dirty = name.trim() !== (user.name ?? '') || phone.trim() !== (user.phone ?? '');

  async function save() {
    const e: typeof errs = {};
    if (name.trim().length < 2) e.name = 'Enter your name';
    if (phone.trim() && !/^\+?\d[\d\s-]{8,14}$/.test(phone.trim())) e.phone = 'Enter a valid phone number';
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true); setSaved(false);
    try { await updateProfile({ name: name.trim(), phone: phone.trim() }); setSaved(true); }
    catch (err) { setErrs({ form: err instanceof Error ? err.message : 'Could not save. Try again.' }); }
    finally { setBusy(false); }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: S.xl, gap: S.lg, paddingBottom: insets.bottom + S.xl }}>
        <View style={{ alignItems: 'center', marginBottom: S.md }}>
          <Avatar name={name || user.email} size={84} />
        </View>
        <Field label="Name" value={name} onChangeText={t => { setName(t); setSaved(false); setErrs({}); }} error={errs.name} autoComplete="name" textContentType="name" />
        <Field label="Phone" value={phone} onChangeText={t => { setPhone(t); setSaved(false); setErrs({}); }} error={errs.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" placeholder="For delivery updates" />
        <View>
          <Field label="Email" value={user.email} editable={false} />
          <Text style={[T.small, { color: C.text3, marginTop: 6 }]}>Your email is how you sign in, so it can’t be changed here.</Text>
        </View>
        {errs.form ? <Text style={{ color: C.red }}>{errs.form}</Text> : null}
        {saved && !dirty ? <Text style={[T.small, { color: C.greenDeep, fontWeight: '600' }]}>Saved ✓</Text> : null}
        <Button title="Save changes" onPress={save} loading={busy} disabled={!dirty} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
