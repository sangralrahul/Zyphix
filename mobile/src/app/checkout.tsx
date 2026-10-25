import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { priceCart } from '@/components/now/checkoutMath';
import { BillSummary, Icon } from '@/components/now/shared';
import { Button, Empty, Tap } from '@/components/ui';
import { Api, ApiError, type Address, type Order, type OrderLine } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart, type Kind } from '@/lib/cart';
import { saveLocalOrder } from '@/lib/orderCache';
import { C, R, S, T, inr } from '@/lib/theme';

type Form = { name: string; phone: string; email: string; line1: string; city: string; pincode: string; notes: string };
type Errors = Partial<Record<keyof Form | 'address' | 'submit', string>>;
// react-native-web draws a browser focus ring on inputs; we show our own green border instead.
const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {};
const EMPTY: Form = { name: '', phone: '', email: '', line1: '', city: '', pincode: '', notes: '' };

const digits = (s: string) => s.replace(/\D/g, '');
const cleanPhone = (s: string) => digits(s).slice(-10);

function validate(f: Form, needEmail: boolean): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Enter the receiver’s name';
  if (!/^[6-9]\d{9}$/.test(cleanPhone(f.phone)) || digits(f.phone).length < 10) e.phone = 'Enter a valid 10-digit mobile number';
  if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email for order updates';
  if (f.line1.trim().length < 5) e.line1 = 'Add house / flat number and street';
  if (f.city.trim().length < 2) e.city = 'Enter your city';
  if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = 'Enter 6 digits';
  return e;
}

export default function Checkout() {
  const params = useLocalSearchParams<{ kind?: string }>();
  const kind: Kind = params.kind === 'eats' ? 'eats' : 'now';
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const cart = useCart();
  const lines = cart[kind];
  const m = priceCart(kind, lines, kind === 'eats' ? cart.eatsRestaurant?.id : null);

  const addresses = useQuery({ queryKey: ['addresses', user?.id], queryFn: Api.addresses, enabled: !!user });
  // Pick up an address added on /address-edit when we come back.
  useFocusEffect(useCallback(() => { if (user) addresses.refetch(); }, [user])); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(() => ({ ...EMPTY, name: user?.name ?? '', phone: user?.phone ?? '' }));
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);

  const saved = addresses.data ?? [];
  const useSaved = !!user && saved.length > 0;
  const selected: Address | undefined = useSaved ? (saved.find(a => a.id === selectedId) ?? saved.find(a => a.isDefault) ?? saved[0]) : undefined;

  const set = (k: keyof Form) => (v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: undefined })); };

  async function place() {
    if (placing || lines.length === 0) return;
    let address: { name: string; phone: string; line1: string; city: string; pincode: string; notes?: string };
    if (useSaved) {
      if (!selected) { setErrors({ address: 'Choose a delivery address' }); return; }
      address = { name: selected.name, phone: selected.phone, line1: [selected.line1, selected.line2].filter(Boolean).join(', '), city: selected.city, pincode: selected.pincode, ...(form.notes.trim() ? { notes: form.notes.trim() } : {}) };
    } else {
      const e = validate(form, !user);
      setErrors(e);
      if (Object.keys(e).length > 0) { if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}); return; }
      address = { name: form.name.trim(), phone: cleanPhone(form.phone), line1: form.line1.trim(), city: form.city.trim(), pincode: form.pincode.trim(), ...(form.notes.trim() ? { notes: form.notes.trim() } : {}) };
    }
    if (m.belowMin) { setErrors({ submit: `Minimum order is ${inr(m.minOrder)}` }); return; }

    const prefix = kind === 'eats' ? 'ZEA' : 'ZNW';
    const id = `${prefix}${Date.now().toString(36).toUpperCase()}`;
    const items: OrderLine[] = lines.map(l => ({ id: l.id, name: l.name, brand: l.brand, price: l.price, origPrice: l.origPrice ?? null, image: l.image, weight: l.weight, qty: l.qty }));
    const payload = {
      id, items, subtotal: m.subtotal, deliveryFee: m.delivery, couponDiscount: 0, walletUsed: 0, total: m.bill.total,
      address, paymentMode: 'COD', status: 'placed', etaMinutes: m.etaMinutes,
      ...(!user ? { email: form.email.trim().toLowerCase() } : {}),
    };
    setPlacing(true);
    setErrors({});
    try {
      const res = await Api.createOrder(payload);
      const order: Order = { id: res.id, createdAt: res.createdAt ?? new Date().toISOString(), status: 'placed', items, subtotal: m.subtotal, deliveryFee: m.delivery, discount: 0, total: m.bill.total, paymentMode: 'COD', address, etaMinutes: m.etaMinutes };
      await saveLocalOrder(order);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      cart.clear(kind);
      router.replace({ pathname: '/order/[id]', params: { id: res.id } });
    } catch (err) {
      setErrors({ submit: err instanceof ApiError ? err.message : 'Couldn’t reach Zyphix. Check your connection and try again.' });
      setPlacing(false);
    }
  }

  if (lines.length === 0 && !placing) {
    return (
      <View style={[st.fill, { justifyContent: 'center' }]}>
        <Empty title="Nothing to check out" body="Your cart is empty." action="Back to shopping" onAction={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={st.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <Stack.Screen options={{ title: 'Checkout' }} />
      <ScrollView contentContainerStyle={{ padding: S.xl, paddingBottom: insets.bottom + 130, gap: S.lg }} keyboardShouldPersistTaps="handled">
        {/* Address */}
        <View style={st.card}>
          <View style={st.cardHead}>
            <Icon ios="mappin.circle.fill" md="location_on" size={20} color={C.green} />
            <Text style={[T.h3, { flex: 1 }]}>Delivery address</Text>
          </View>

          {useSaved ? (
            <View style={{ gap: S.sm }}>
              {saved.map(a => {
                const on = selected?.id === a.id;
                return (
                  <Tap key={a.id} onPress={() => setSelectedId(a.id)} scale={0.99} style={[st.addr, on && st.addrOn]} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                    <Icon ios={on ? 'largecircle.fill.circle' : 'circle'} md={on ? 'radio_button_checked' : 'radio_button_unchecked'} size={20} color={on ? C.green : C.text3} />
                    <View style={{ flex: 1 }}>
                      <Text style={T.bodyStrong}>{a.label || 'Address'}{a.isDefault ? <Text style={st.defTag}>  DEFAULT</Text> : null}</Text>
                      <Text style={[T.small, { color: C.text2 }]} numberOfLines={2}>{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</Text>
                      <Text style={[T.small, { color: C.text3 }]}>{a.name} · {a.phone}</Text>
                    </View>
                  </Tap>
                );
              })}
              <Pressable onPress={() => router.push('/address-edit')} style={st.addNew} accessibilityRole="button">
                <Icon ios="plus" md="add" size={18} color={C.green} />
                <Text style={[T.bodyStrong, { color: C.green }]}>Add new address</Text>
              </Pressable>
              {errors.address && <Text style={st.err}>{errors.address}</Text>}
            </View>
          ) : user && addresses.isLoading ? (
            <Text style={[T.small, { color: C.text2 }]}>Loading your saved addresses…</Text>
          ) : (
            <Animated.View entering={FadeIn} style={{ gap: S.md }}>
              {!user && (
                <Pressable onPress={() => router.push('/sign-in')} style={st.signIn} accessibilityRole="link">
                  <Icon ios="person.crop.circle" md="account_circle" size={20} color={C.greenDeep} />
                  <Text style={[T.small, { flex: 1, color: C.text }]}><Text style={{ fontWeight: '700', color: C.greenDeep }}>Sign in for faster checkout</Text> — saved addresses and order history.</Text>
                  <Icon ios="chevron.right" md="chevron_right" size={14} color={C.text3} />
                </Pressable>
              )}
              <Field label="Full name" value={form.name} onChangeText={set('name')} error={errors.name} autoComplete="name" textContentType="name" />
              <Field label="Mobile number" value={form.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={14} />
              {!user && <Field label="Email (for order updates)" value={form.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />}
              <Field label="House / flat, street, area" value={form.line1} onChangeText={set('line1')} error={errors.line1} autoComplete="street-address" textContentType="fullStreetAddress" />
              <View style={{ flexDirection: 'row', gap: S.md }}>
                <View style={{ flex: 1 }}><Field label="City" value={form.city} onChangeText={set('city')} error={errors.city} textContentType="addressCity" /></View>
                <View style={{ width: 130 }}><Field label="Pincode" value={form.pincode} onChangeText={v => set('pincode')(digits(v))} error={errors.pincode} keyboardType="number-pad" maxLength={6} textContentType="postalCode" autoComplete="postal-code" /></View>
              </View>
              {user && (
                <Pressable onPress={() => router.push('/address-edit')} style={st.addNew}>
                  <Icon ios="plus" md="add" size={18} color={C.green} />
                  <Text style={[T.bodyStrong, { color: C.green }]}>Save an address to your account</Text>
                </Pressable>
              )}
            </Animated.View>
          )}
          <View style={{ marginTop: S.md }}>
            <Field label="Delivery instructions (optional)" value={form.notes} onChangeText={set('notes')} maxLength={200} />
          </View>
        </View>

        {/* Payment */}
        <View style={st.card}>
          <View style={st.cardHead}>
            <Icon ios="creditcard.fill" md="payments" size={20} color={C.green} />
            <Text style={T.h3}>Payment</Text>
          </View>
          <View style={[st.addr, st.addrOn]} accessibilityRole="radio" accessibilityState={{ checked: true }}>
            <Icon ios="largecircle.fill.circle" md="radio_button_checked" size={20} color={C.green} />
            <View style={{ flex: 1 }}>
              <Text style={T.bodyStrong}>Cash on delivery</Text>
              <Text style={[T.small, { color: C.text2 }]}>Pay by cash or UPI when your order arrives</Text>
            </View>
          </View>
          <View style={[st.addr, { opacity: 0.5, marginTop: S.sm }]} accessibilityRole="radio" accessibilityState={{ checked: false, disabled: true }}>
            <Icon ios="circle" md="radio_button_unchecked" size={20} color={C.text3} />
            <View style={{ flex: 1 }}>
              <Text style={T.bodyStrong}>Pay online</Text>
              <Text style={[T.small, { color: C.text2 }]}>Cards, UPI and wallets</Text>
            </View>
            <View style={st.soon}><Text style={st.soonTxt}>COMING SOON</Text></View>
          </View>
        </View>

        <BillSummary bill={m.bill} freeDeliveryHint={m.freeHint} />
        {m.belowMin && <Text style={st.err}>Minimum order for {m.restaurant?.name ?? 'this restaurant'} is {inr(m.minOrder)}.</Text>}
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + 12 }]}>
        {errors.submit && <Text style={[st.err, { marginBottom: S.sm }]}>{errors.submit}</Text>}
        {Object.keys(errors).some(k => k !== 'submit' && errors[k as keyof Errors]) && !errors.submit && (
          <Text style={[st.err, { marginBottom: S.sm }]}>Please fix the highlighted fields.</Text>
        )}
        <Button title={`Place order · ${inr(m.bill.total)}`} loading={placing} disabled={m.belowMin} onPress={place} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, error, ...rest }: TextInputProps & { label: string; error?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <Text style={st.label}>{label}</Text>
      <TextInput {...rest} onFocus={e => { setFocus(true); rest.onFocus?.(e); }} onBlur={e => { setFocus(false); rest.onBlur?.(e); }}
        placeholderTextColor={C.text3} accessibilityLabel={label}
        style={[st.input, focus && { borderColor: C.green }, !!error && { borderColor: C.red }]} />
      {!!error && <Text style={st.err}>{error}</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: C.bgSoft },
  card: { backgroundColor: C.bg, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, padding: S.lg },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginBottom: S.md },
  addr: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md, borderRadius: R.md, borderWidth: 1, borderColor: C.line, minHeight: 56 },
  addrOn: { borderColor: C.green, backgroundColor: '#F4FBF7' },
  defTag: { fontSize: 10, fontWeight: '800', color: C.greenDeep, letterSpacing: 0.6 },
  addNew: { flexDirection: 'row', alignItems: 'center', gap: S.sm, minHeight: 44, paddingHorizontal: 4 },
  signIn: { flexDirection: 'row', alignItems: 'center', gap: S.sm, backgroundColor: C.greenSoft, borderRadius: R.md, padding: S.md },
  label: { ...T.small, fontWeight: '600', color: C.text2, marginBottom: 6 },
  input: { height: 48, borderRadius: R.sm, borderWidth: 1, borderColor: C.line, paddingHorizontal: S.md, ...T.body, color: C.text, backgroundColor: C.bg, ...noOutline },
  err: { ...T.small, color: C.red, marginTop: 4 },
  soon: { backgroundColor: C.bgSoft, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  soonTxt: { fontSize: 9, fontWeight: '800', color: C.text2, letterSpacing: 0.5 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: S.xl, paddingTop: S.md, backgroundColor: C.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
});
