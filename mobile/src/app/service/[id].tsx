import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Field, addrIcon, useLightStatusBar } from '@/components/account/kit';
import { CollapsingTopBar, ParallaxImage } from '@/components/eats/TopBar';
import { Ico, K, type IconName } from '@/components/kit';
import { Button, Empty } from '@/components/ui';
import { SERVICES, TIME_SLOTS } from '@/data/book';
import { photo } from '@/data/media';
import { Api, type Address } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { C } from '@/lib/theme';

const IMG_H = 250;
const INCLUDED = [
  'A verified professional visits at the slot you pick',
  'They inspect the job and explain what needs doing',
  'Price confirmed with you before any work starts',
  'Pay the pro once the job is done',
  '7-day guarantee on the work',
];
const DAYS = [0, 1, 2] as const;
type Day = (typeof DAYS)[number];

/** '2:00 PM' → minutes since midnight. */
function slotMinutes(slot: string) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3]!.toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}
const dateOf = (offset: number) => new Date(Date.now() + offset * 86_400_000);
const dayLabel = (offset: number) => dateOf(offset).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
const dayName = (d: Day) => (d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : dayLabel(d));

type Guest = { name: string; phone: string; line1: string; city: string; pincode: string; email: string };

function Card({ title, icon, children }: { title: string; icon: IconName; children: React.ReactNode }) {
  return (
    <View style={st.card}>
      <View style={st.cardHead}>
        <View style={st.cardIcon}><Ico name={icon} size={16} color={C.greenDeep} /></View>
        <Text style={st.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

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
  const [day, setDay] = useState<Day>(todayOpen.length ? 0 : 1);
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
  const slotOk = (sl: string) => day !== 0 || slotMinutes(sl) >= nowMin + 60;

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
        address: { ...address, notes: `${dayName(day)} ${slot}${notes.trim() ? ' · ' + notes.trim() : ''}` },
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: K.page }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive"
        contentContainerStyle={{ paddingBottom: 130 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <ParallaxImage y={y} height={IMG_H + insets.top}>
          <Image source={photo(s.photo, 960)} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} cachePolicy="memory-disk" />
          <LinearGradient colors={['rgba(5,8,14,.45)', 'rgba(5,8,14,0)']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        </ParallaxImage>

        <View style={st.head}>
          <Text style={st.kicker}>{s.category.toUpperCase()}</Text>
          <Text style={st.title}>{s.title}</Text>
          <Text style={st.blurb}>{s.blurb}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            <View style={st.chip}><Ico name="shield-checkmark" size={13} color={C.greenDeep} /><Text style={st.chipTxt}>Price confirmed before work starts</Text></View>
            <View style={[st.chip, { backgroundColor: '#EEF2FF' }]}><Ico name="wallet" size={13} color="#4338CA" /><Text style={[st.chipTxt, { color: '#4338CA' }]}>Pay after the job</Text></View>
          </View>
        </View>

        <Card title="What's included" icon="list">
          <View style={{ gap: 11 }}>
            {INCLUDED.map(t => (
              <View key={t} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Ico name="checkmark-circle" size={18} color={C.green} />
                <Text style={{ flex: 1, fontSize: 14, lineHeight: 19, color: '#1F2937' }}>{t}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card title="When should the pro come?" icon="calendar">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {DAYS.map(d => {
              const on = day === d;
              const disabled = d === 0 && todayOpen.length === 0;
              const dt = dateOf(d);
              return (
                <Pressable key={d} disabled={disabled} onPress={() => { setDay(d); if (slot && d === 0 && slotMinutes(slot) < nowMin + 60) setSlot(null); }}
                  accessibilityRole="button" accessibilityState={{ selected: on, disabled }} accessibilityLabel={`${dayName(d)}${disabled ? ', fully booked' : ''}`}
                  style={[st.day, on && st.dayOn, disabled && { opacity: 0.45 }]}>
                  <Text style={[st.dayTop, on && { color: C.greenDeep }]}>{d === 0 ? 'Today' : d === 1 ? 'Tmrw' : dt.toLocaleDateString('en-IN', { weekday: 'short' })}</Text>
                  <Text style={[st.dayNum, on && { color: C.greenDeep }]}>{dt.getDate()}</Text>
                  <Text style={[st.dayTop, { fontSize: 10.5 }, on && { color: C.greenDeep }]}>{disabled ? 'Full' : dt.toLocaleDateString('en-IN', { month: 'short' })}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={st.lbl}>Select start time of service</Text>
          <View style={st.slots}>
            {TIME_SLOTS.map(sl => {
              const ok = slotOk(sl);
              const on = slot === sl && ok;
              return (
                <Pressable key={sl} disabled={!ok} onPress={() => { setSlot(sl); setErrors(e => ({ ...e, slot: undefined })); }}
                  accessibilityRole="button" accessibilityState={{ selected: on, disabled: !ok }}
                  style={[st.slot, on && st.slotOn, !ok && st.slotOff]}>
                  <Text style={[{ fontSize: 13.5, fontWeight: '700', color: on ? C.greenDeep : ok ? K.ink : '#B0B6BF' }, !ok && { textDecorationLine: 'line-through' }]}>{sl}</Text>
                </Pressable>
              );
            })}
          </View>
          {errors.slot ? <Text style={st.err}>{errors.slot}</Text> : null}
        </Card>

        <Card title="Where should we come?" icon="location">
          {user ? (
            addresses.isLoading ? (
              <View style={[st.addr, { height: 72, backgroundColor: '#F3F5F9', borderColor: '#F3F5F9' }]} />
            ) : (
              <View style={{ gap: 10 }}>
                {list.map(a => {
                  const on = chosen?.id === a.id;
                  return (
                    <Pressable key={a.id} onPress={() => { setAddrId(a.id); setErrors(e => ({ ...e, address: undefined })); }} accessibilityRole="radio" accessibilityState={{ checked: on }}
                      style={[st.addr, on && { borderColor: C.green, backgroundColor: '#F4FBF7' }]}>
                      <View style={[st.addrIcon, on && { backgroundColor: '#DDF5E8' }]}><Ico name={addrIcon(a.label)} size={17} color={on ? C.greenDeep : K.meta} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14.5, fontWeight: '800', color: K.ink }}>{a.label || 'Address'}{a.isDefault ? <Text style={{ color: '#9CA3AF', fontWeight: '500' }}>  · Default</Text> : null}</Text>
                        <Text style={{ fontSize: 12.5, color: K.meta, marginTop: 1 }} numberOfLines={2}>{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</Text>
                      </View>
                      <View style={[st.radio, on && { borderColor: C.green }]}>{on ? <View style={st.radioDot} /> : null}</View>
                    </Pressable>
                  );
                })}
                <Pressable onPress={() => router.push('/address-edit')} style={st.addNew} accessibilityRole="button">
                  <Ico name="add" size={18} color={C.green} />
                  <Text style={{ color: C.green, fontWeight: '800', fontSize: 14 }}>Add a new address</Text>
                </Pressable>
                {errors.address ? <Text style={st.err}>{errors.address}</Text> : null}
              </View>
            )
          ) : (
            <View style={{ gap: 12 }}>
              <Pressable onPress={() => router.push('/sign-in')} style={st.signin}>
                <Ico name="person-circle-outline" size={22} color={C.green} />
                <Text style={{ fontSize: 13, color: K.meta, flex: 1 }}>Have an account? Sign in to use saved addresses.</Text>
                <Text style={{ color: C.green, fontWeight: '800' }}>Sign in</Text>
              </Pressable>
              <Field label="Full name" value={guest.name} onChangeText={set('name')} error={errors.name} autoComplete="name" textContentType="name" />
              <Field label="Phone" value={guest.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
              <Field label="House / flat, street" value={guest.line1} onChangeText={set('line1')} error={errors.line1} autoComplete="street-address" textContentType="fullStreetAddress" />
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <Field label="City" value={guest.city} onChangeText={set('city')} error={errors.city} style={{ flex: 1 }} textContentType="addressCity" />
                <Field label="Pincode" value={guest.pincode} onChangeText={v => set('pincode')(v.replace(/\D/g, '').slice(0, 6))} error={errors.pincode} keyboardType="number-pad" style={{ flex: 1 }} textContentType="postalCode" />
              </View>
              <Field label="Email" value={guest.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
            </View>
          )}
        </Card>

        <Card title="Anything the pro should know?" icon="chatbox-ellipses">
          <Field label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="E.g. kitchen tap leaking, 2nd floor, no lift" multiline maxLength={300} />
        </Card>

        <View style={st.priceNote}>
          <Ico name="information-circle" size={18} color="#B45309" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#92400E' }}>Nothing is charged to book</Text>
            <Text style={{ fontSize: 12.5, color: '#92400E', marginTop: 2 }}>The professional confirms the price after a look. You pay them once the job is done.</Text>
          </View>
        </View>
      </Animated.ScrollView>

      <CollapsingTopBar y={y} title={s.title} fadeAt={IMG_H - 20} />
      <View style={[st.footer, { paddingBottom: insets.bottom + 12 }]}>
        {errors.form ? <Text style={[st.err, { marginBottom: 8 }]}>{errors.form}</Text> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: 12, color: K.meta, fontWeight: '600' }} numberOfLines={1}>{s.title} visit · price on inspection</Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: slot && slotOk(slot) ? K.ink : '#B45309' }} numberOfLines={1}>{slot && slotOk(slot) ? `${dayName(day)}, ${slot}` : 'Pick a slot'}</Text>
          </View>
          <Button title="Book now" onPress={confirmBooking} loading={busy} style={{ paddingHorizontal: 26, height: 50, borderRadius: 14 }} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  head: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, paddingHorizontal: 18, paddingTop: 20, paddingBottom: 18 },
  kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, color: C.green },
  title: { fontSize: 26, fontWeight: '900', color: K.ink, letterSpacing: -0.6, marginTop: 4 },
  blurb: { fontSize: 14, color: K.meta, marginTop: 2 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E7F7EF', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  chipTxt: { fontSize: 12, fontWeight: '800', color: C.greenDeep },
  card: { backgroundColor: '#fff', marginTop: 10, paddingHorizontal: 18, paddingVertical: 18 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  cardIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '900', color: K.ink, letterSpacing: -0.3 },
  day: { width: 72, height: 78, borderRadius: 14, borderWidth: 1.5, borderColor: '#E1E4EA', alignItems: 'center', justifyContent: 'center' },
  dayOn: { borderColor: C.green, backgroundColor: '#ECFAF3' },
  dayTop: { fontSize: 12, fontWeight: '700', color: K.meta },
  dayNum: { fontSize: 22, fontWeight: '900', color: K.ink, marginVertical: 1 },
  lbl: { fontSize: 13, fontWeight: '700', color: K.meta, marginTop: 18, marginBottom: 10 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '31.6%', height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: '#E1E4EA', alignItems: 'center', justifyContent: 'center' },
  slotOn: { backgroundColor: '#ECFAF3', borderColor: C.green },
  slotOff: { backgroundColor: '#F6F7F9', borderColor: '#F6F7F9' },
  err: { color: C.red, fontSize: 13, marginTop: 8, fontWeight: '600' },
  addr: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: '#E1E4EA' },
  addrIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C4CAD3', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: C.green },
  addNew: { height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: '#CDE9DA', borderStyle: 'dashed', flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  signin: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, backgroundColor: '#F3F5F9' },
  priceNote: { flexDirection: 'row', gap: 10, margin: 16, padding: 14, borderRadius: 14, backgroundColor: '#FFF7E6', borderWidth: 1, borderColor: '#FCD9A0' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: K.line, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 8 },
});
