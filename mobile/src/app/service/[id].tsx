import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Field, useLightStatusBar } from '@/components/account/kit';
import { CollapsingTopBar, ParallaxImage } from '@/components/eats/TopBar';
import { Button, Empty, styles as ui } from '@/components/ui';
import { SERVICES, TIME_SLOTS } from '@/data/book';
import { photo } from '@/data/media';
import { Api, type Address } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C, R, S, T, shadow } from '@/lib/theme';

const IMG_H = 260;
const INCLUDED = [
  'A verified professional visits at the slot you pick',
  'They inspect the job and explain what needs doing',
  'Price confirmed with you before any work starts',
  'Pay the pro once the job is done',
  '7-day guarantee on the work',
];

/** '2:00 PM' → minutes since midnight. */
function slotMinutes(slot: string) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3]!.toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}
const dayLabel = (offset: number) => {
  const d = new Date(Date.now() + offset * 86_400_000);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

type Guest = { name: string; phone: string; line1: string; city: string; pincode: string; email: string };

export default function ServiceScreen() {
  useLightStatusBar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(ev => { y.value = ev.contentOffset.y; });

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  // A slot is bookable today if it starts at least an hour from now.
  const todayOpen = TIME_SLOTS.filter(s => slotMinutes(s) >= nowMin + 60);
  const [day, setDay] = useState<0 | 1>(todayOpen.length ? 0 : 1);
  const [slot, setSlot] = useState<string | null>(null);
  const [addrId, setAddrId] = useState<string | null>(null);
  const [guest, setGuest] = useState<Guest>({ name: '', phone: '', line1: '', city: '', pincode: '', email: '' });
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Guest | 'slot' | 'address' | 'form', string>>>({});
  const [busy, setBusy] = useState(false);

  const addresses = useQuery({ queryKey: ['addresses', user?.id], queryFn: Api.addresses, enabled: !!user });
  const list = addresses.data ?? [];
  const chosen: Address | undefined = list.find(a => a.id === addrId) ?? list.find(a => a.isDefault) ?? list[0];

  const s = SERVICES.find(x => x.id === id);
  if (!s) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Stack.Screen options={{ headerShown: true, title: '' }} />
        <Empty title="Service not found" action="See all services" onAction={() => router.replace('/book')} />
      </View>
    );
  }

  const set = (k: keyof Guest) => (v: string) => { setGuest(g => ({ ...g, [k]: v })); setErrors(e => ({ ...e, [k]: undefined, form: undefined })); };
  const dayName = day === 0 ? 'Today' : 'Tomorrow';
  const slotOk = (sl: string) => day === 1 || slotMinutes(sl) >= nowMin + 60;

  async function confirmBooking() {
    const e: typeof errors = {};
    if (!slot || !slotOk(slot)) e.slot = 'Pick a time slot';
    let address: Record<string, string>;
    if (user) {
      if (!chosen) e.address = 'Add an address for the visit';
      address = chosen ? { name: chosen.name || user.name, phone: chosen.phone || user.phone, line1: [chosen.line1, chosen.line2].filter(Boolean).join(', '), city: chosen.city, pincode: chosen.pincode } : {};
    } else {
      if (guest.name.trim().length < 2) e.name = 'Enter your name';
      if (!/^\+?\d[\d\s-]{8,14}$/.test(guest.phone.trim())) e.phone = 'Enter a valid phone number';
      if (guest.line1.trim().length < 5) e.line1 = 'Enter your house / street';
      if (guest.city.trim().length < 2) e.city = 'Enter your city';
      if (!/^\d{6}$/.test(guest.pincode.trim())) e.pincode = '6-digit pincode';
      if (!/^\S+@\S+\.\S+$/.test(guest.email.trim())) e.email = 'We send your booking details here';
      address = { name: guest.name.trim(), phone: guest.phone.trim(), line1: guest.line1.trim(), city: guest.city.trim(), pincode: guest.pincode.trim() };
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const orderId = `ZBK${Date.now().toString(36).toUpperCase()}`;
      const r = await Api.createOrder({
        id: orderId,
        items: [{ id: s!.id, name: `${s!.title} visit`, price: 0, qty: 1 }],
        subtotal: 0, deliveryFee: 0, couponDiscount: 0, walletUsed: 0, total: 0,
        paymentMode: 'COD', status: 'placed', etaMinutes: 60,
        address: { ...address, notes: `${dayName} ${slot}${notes.trim() ? ' · ' + notes.trim() : ''}` },
        ...(user ? {} : { email: guest.email.trim().toLowerCase() }),
      });
      router.replace({ pathname: '/order/[id]', params: { id: r.id ?? orderId } });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Could not book right now. Try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive"
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <ParallaxImage y={y} height={IMG_H + insets.top}>
          <Image source={photo(s.photo, 960)} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} cachePolicy="memory-disk" />
          <LinearGradient colors={['rgba(5,8,14,.5)', 'rgba(5,8,14,0)', 'rgba(5,8,14,.75)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={{ position: 'absolute', left: S.xl, right: S.xl, bottom: S.lg + R.xl }}>
            <Text style={[T.tiny, { color: C.mint, letterSpacing: 1.4 }]}>{s.category.toUpperCase()}</Text>
            <Text style={[T.h1, { color: C.white, marginTop: 4 }]}>{s.title}</Text>
            <Text style={[T.body, { color: 'rgba(255,255,255,.85)' }]}>{s.blurb}</Text>
          </View>
        </ParallaxImage>

        <View style={st.body}>
          <Text style={T.h2}>What&apos;s included</Text>
          <View style={{ gap: 10, marginTop: S.md }}>
            {INCLUDED.map(t => (
              <View key={t} style={[ui.row, { alignItems: 'flex-start' }]}>
                <View style={st.tick}><Text style={{ color: C.white, fontSize: 10, fontWeight: '900' }}>✓</Text></View>
                <Text style={[T.body, { flex: 1 }]}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[T.h2, st.h]}>Choose a day</Text>
          <View style={[ui.row, { gap: 10 }]}>
            {([0, 1] as const).map(d => {
              const on = day === d;
              const disabled = d === 0 && todayOpen.length === 0;
              return (
                <Pressable key={d} disabled={disabled} onPress={() => { setDay(d); if (slot && d === 0 && slotMinutes(slot) < nowMin + 60) setSlot(null); }}
                  accessibilityRole="button" accessibilityState={{ selected: on, disabled }}
                  style={[st.day, on && st.dayOn, disabled && { opacity: 0.45 }]}>
                  <Text style={[T.bodyStrong, on && { color: C.greenDeep }]}>{d === 0 ? 'Today' : 'Tomorrow'}</Text>
                  <Text style={[T.small, { color: on ? C.greenDeep : C.text2 }]}>{disabled ? 'Fully booked' : dayLabel(d)}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[T.h2, st.h]}>Pick a time</Text>
          <View style={st.slots}>
            {TIME_SLOTS.map(sl => {
              const ok = slotOk(sl);
              const on = slot === sl && ok;
              return (
                <Pressable key={sl} disabled={!ok} onPress={() => { setSlot(sl); setErrors(e => ({ ...e, slot: undefined })); }}
                  accessibilityRole="button" accessibilityState={{ selected: on, disabled: !ok }}
                  style={[st.slot, on && st.slotOn, !ok && st.slotOff]}>
                  <Text style={[T.small, { fontWeight: '600', color: on ? C.white : ok ? C.text : C.text3 }, !ok && { textDecorationLine: 'line-through' }]}>{sl}</Text>
                </Pressable>
              );
            })}
          </View>
          {errors.slot ? <Text style={st.err}>{errors.slot}</Text> : null}

          <Text style={[T.h2, st.h]}>Where should we come?</Text>
          {user ? (
            addresses.isLoading ? (
              <View style={[st.addr, { height: 76, backgroundColor: C.bgSoft, borderColor: C.bgSoft }]} />
            ) : (
              <View style={{ gap: 10 }}>
                {list.map(a => {
                  const on = chosen?.id === a.id;
                  return (
                    <Pressable key={a.id} onPress={() => { setAddrId(a.id); setErrors(e => ({ ...e, address: undefined })); }} accessibilityRole="radio" accessibilityState={{ checked: on }}
                      style={[st.addr, on && { borderColor: C.green, backgroundColor: '#F4FBF7' }]}>
                      <View style={[st.radio, on && { borderColor: C.green }]}>{on && <View style={st.radioDot} />}</View>
                      <View style={{ flex: 1 }}>
                        <Text style={T.bodyStrong}>{a.label || 'Address'}{a.isDefault ? <Text style={{ color: C.text3, fontWeight: '400' }}>  · Default</Text> : null}</Text>
                        <Text style={[T.small, { color: C.text2 }]} numberOfLines={2}>{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</Text>
                      </View>
                    </Pressable>
                  );
                })}
                <Pressable onPress={() => router.push('/address-edit')} style={st.addNew} accessibilityRole="button">
                  <Text style={[T.bodyStrong, { color: C.green }]}>+ Add a new address</Text>
                </Pressable>
                {errors.address ? <Text style={st.err}>{errors.address}</Text> : null}
              </View>
            )
          ) : (
            <View style={{ gap: 12 }}>
              <Pressable onPress={() => router.push('/sign-in')} style={st.signin}>
                <Text style={[T.small, { color: C.text2, flex: 1 }]}>Have an account? Sign in to use saved addresses.</Text>
                <Text style={[T.bodyStrong, { color: C.green }]}>Sign in</Text>
              </Pressable>
              <Field label="Full name" value={guest.name} onChangeText={set('name')} error={errors.name} autoComplete="name" textContentType="name" />
              <Field label="Phone" value={guest.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
              <Field label="House / flat, street" value={guest.line1} onChangeText={set('line1')} error={errors.line1} autoComplete="street-address" textContentType="fullStreetAddress" />
              <View style={[ui.row, { gap: 12, alignItems: 'flex-start' }]}>
                <Field label="City" value={guest.city} onChangeText={set('city')} error={errors.city} style={{ flex: 1 }} textContentType="addressCity" />
                <Field label="Pincode" value={guest.pincode} onChangeText={v => set('pincode')(v.replace(/\D/g, '').slice(0, 6))} error={errors.pincode} keyboardType="number-pad" style={{ flex: 1 }} textContentType="postalCode" />
              </View>
              <Field label="Email" value={guest.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
            </View>
          )}

          <Field label="Notes for the pro (optional)" value={notes} onChangeText={setNotes} placeholder="E.g. kitchen tap leaking, 2nd floor, no lift" multiline style={{ marginTop: S.xl }} maxLength={300} />

          <View style={st.priceNote}>
            <Text style={[T.bodyStrong]}>Price confirmed by the professional before work starts</Text>
            <Text style={[T.small, { color: C.text2, marginTop: 2 }]}>Nothing is charged to book. You pay the pro after the job.</Text>
          </View>
        </View>
      </Animated.ScrollView>

      <CollapsingTopBar y={y} title={s.title} fadeAt={IMG_H - 40} />
      <View style={[st.footer, { paddingBottom: insets.bottom + 12 }]}>
        {errors.form ? <Text style={[st.err, { marginBottom: 8 }]}>{errors.form}</Text> : null}
        <View style={[ui.rowBetween, { gap: 12 }]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={[T.small, { color: C.text2 }]}>{s.title} visit</Text>
            <Text style={T.bodyStrong} numberOfLines={1}>{slot && slotOk(slot) ? `${dayName}, ${slot}` : 'Pick a slot'}</Text>
          </View>
          <Button title="Confirm booking" onPress={confirmBooking} loading={busy} style={{ paddingHorizontal: 22 }} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  body: { backgroundColor: C.bg, borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, marginTop: -R.xl, padding: S.xl },
  h: { marginTop: S.x3, marginBottom: S.md },
  tick: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  day: { flex: 1, height: 64, borderRadius: R.md, borderWidth: 1.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  dayOn: { borderColor: C.green, backgroundColor: C.greenSoft },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '31.6%', height: 46, borderRadius: 12, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  slotOn: { backgroundColor: C.green, borderColor: C.green },
  slotOff: { backgroundColor: C.bgSoft, borderColor: C.bgSoft },
  err: { color: C.red, fontSize: 13, marginTop: 6 },
  addr: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: R.md, borderWidth: 1.5, borderColor: C.line },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.text3, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.green },
  addNew: { height: 50, borderRadius: R.md, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  signin: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: R.md, backgroundColor: C.bgSoft },
  priceNote: { marginTop: S.xl, padding: S.lg, borderRadius: R.md, backgroundColor: '#FFF7E6', borderWidth: 1, borderColor: '#FCD9A0' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.bg, paddingHorizontal: S.xl, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line, ...shadow },
});
