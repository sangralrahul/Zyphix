import { router } from 'expo-router';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, Field } from '@/components/account/kit';
import { Ico, K } from '@/components/kit';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { C } from '@/lib/theme';

export default function Profile() {
  const { user } = useAuth();
  // Keyed on the user so the form starts from the loaded profile (also after a cold start / refresh).
  return <ProfileForm key={user?.id ?? 'guest'} />;
}

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [errs, setErrs] = useState<{ name?: string; phone?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: K.page }}>
        <EmptyState icon="person-outline" title="Sign in to edit your profile" action="Sign in" onAction={() => router.push('/sign-in')} />
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

  const initial = (name || user.email).trim().charAt(0).toUpperCase();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: K.page }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }}>
        <View style={st.head}>
          <LinearGradient colors={['#0B9A5F', '#34D399']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.avatar}>
            <Text style={{ color: '#fff', fontSize: 34, fontWeight: '900' }}>{initial}</Text>
          </LinearGradient>
          <Text style={{ fontSize: 19, fontWeight: '900', color: K.ink, marginTop: 10 }} numberOfLines={1}>{name.trim() || 'Your name'}</Text>
          <Text style={{ fontSize: 13, color: K.meta }} numberOfLines={1}>{user.email}</Text>
        </View>
        <View style={[st.card, { gap: 14 }]}>
          <Text style={st.h}>Personal details</Text>
          <Field label="Name" value={name} onChangeText={t => { setName(t); setSaved(false); setErrs({}); }} error={errs.name} autoComplete="name" textContentType="name" />
          <Field label="Phone" value={phone} onChangeText={t => { setPhone(t); setSaved(false); setErrs({}); }} error={errs.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" placeholder="For delivery updates" />
          <View>
            <Field label="Email" value={user.email} editable={false} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 }}>
              <Ico name="lock-closed" size={12} color="#9CA3AF" />
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Your email is how you sign in, so it can’t be changed here.</Text>
            </View>
          </View>
        </View>
        {errs.form ? <Text style={{ color: C.red, fontWeight: '600' }}>{errs.form}</Text> : null}
        {saved && !dirty ? (
          <View style={st.saved}><Ico name="checkmark-circle" size={16} color={C.greenDeep} /><Text style={{ color: C.greenDeep, fontWeight: '800', fontSize: 13.5 }}>Profile saved</Text></View>
        ) : null}
      </ScrollView>
      <View style={[st.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button title="Save changes" onPress={save} loading={busy} disabled={!dirty} style={{ height: 52, borderRadius: 14 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  head: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, paddingVertical: 20 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14 },
  h: { fontSize: 15, fontWeight: '900', color: K.ink },
  saved: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', backgroundColor: '#E7F7EF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: K.line },
});
