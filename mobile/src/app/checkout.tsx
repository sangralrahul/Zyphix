import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ico, K, type IconName } from '@/components/kit';
import { BillCard } from '@/components/now/BillCard';
import { EmptyState } from '@/components/now/blocks';
import { priceCart, useHasOrders, withCoupon } from '@/components/now/checkoutMath';
import { Tap } from '@/components/ui';
import { Api, ApiError, type Address, type Order, type OrderLine } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart, type Kind } from '@/lib/cart';
import { saveLocalOrder } from '@/lib/orderCache';
import { C, inr } from '@/lib/theme';

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
  const params = useLocalSearchParams<{ kind?: string; coupon?: string }>();
  const kind: Kind = params.kind === 'eats' ? 'eats' : 'now';
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const cart = useCart();
  const lines = cart[kind];
  const m = priceCart(kind, lines, kind === 'eats' ? cart.eatsRestaurant?.id : null);
  const hasOrders = useHasOrders();
  const cp = withCoupon(m, params.coupon ? String(params.coupon) : null, hasOrders);

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
      id, items, subtotal: m.subtotal, deliveryFee: cp.delivery, couponDiscount: cp.couponDiscount, walletUsed: 0, total: cp.total,
      ...(cp.ok && cp.coupon ? { couponCode: cp.coupon.code } : {}),
      address, paymentMode: 'COD', status: 'placed', etaMinutes: m.etaMinutes,
      ...(!user ? { email: form.email.trim().toLowerCase() } : {}),
    };
    setPlacing(true);
    setErrors({});
    try {
      const res = await Api.createOrder(payload);
      const order: Order = { id: res.id, createdAt: res.createdAt ?? new Date().toISOString(), status: 'placed', items, subtotal: m.subtotal, deliveryFee: cp.delivery, discount: cp.couponDiscount, total: cp.total, paymentMode: 'COD', address, etaMinutes: m.etaMinutes };
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
        <EmptyState icon="cart-outline" title="Nothing to check out" body="Your cart is empty." action="Back to shopping" onAction={() => router.back()} />
      </View>
    );
  }

  const count = lines.reduce((a, l) => a + l.qty, 0);
  const fieldErrors = Object.keys(errors).some(k => k !== 'submit' && errors[k as keyof Errors]);

  return (
    <KeyboardAvoidingView style={st.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <Stack.Screen options={{ title: 'Checkout', headerTitleStyle: { fontWeight: '800' } }} />
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 140, gap: 12 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Delivery summary */}
        <View style={st.eta}>
          <View style={st.etaIco}><Ico name={kind === 'eats' ? 'restaurant' : 'flash'} size={18} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={st.etaT}>Delivery in {m.etaMinutes} minutes</Text>
            <Text style={st.etaS}>{count} item{count === 1 ? '' : 's'}{kind === 'eats' && cart.eatsRestaurant ? ` from ${cart.eatsRestaurant.name}` : ' · packed by a store near you'}</Text>
          </View>
        </View>

        {/* Address */}
        <View style={st.card}>
          <CardHead icon="location" title="Delivery address" />
          {useSaved ? (
            <View style={{ gap: 8 }}>
              {saved.map(a => {
                const on = selected?.id === a.id;
                return (
                  <Tap key={a.id} onPress={() => setSelectedId(a.id)} scale={0.99} style={[st.opt, on && st.optOn]} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                    <Ico name={on ? 'radio-button-on' : 'radio-button-off'} size={20} color={on ? C.green : '#9CA3AF'} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={st.optT}>{a.label || 'Address'}</Text>
                        {a.isDefault ? <View style={st.def}><Text style={st.defTxt}>DEFAULT</Text></View> : null}
                      </View>
                      <Text style={st.optS} numberOfLines={2}>{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</Text>
                      <Text style={[st.optS, { color: '#9CA3AF' }]}>{a.name} · {a.phone}</Text>
                    </View>
                  </Tap>
                );
              })}
              <Pressable onPress={() => router.push('/address-edit')} style={st.addNew} accessibilityRole="button">
                <Ico name="add" size={18} color={C.green} />
                <Text style={st.addNewTxt}>Add new address</Text>
              </Pressable>
              {errors.address ? <Text style={st.err}>{errors.address}</Text> : null}
            </View>
          ) : user && addresses.isLoading ? (
            <Text style={st.optS}>Loading your saved addresses…</Text>
          ) : (
            <Animated.View entering={FadeIn} style={{ gap: 12 }}>
              {!user ? (
                <Pressable onPress={() => router.push('/sign-in')} style={st.signIn} accessibilityRole="link">
                  <Ico name="person-circle" size={22} color={C.greenDeep} />
                  <Text style={[st.optS, { flex: 1, color: K.ink }]}><Text style={{ fontWeight: '800', color: C.greenDeep }}>Sign in for faster checkout</Text> — saved addresses and order history.</Text>
                  <Ico name="chevron-forward" size={16} color={K.meta} />
                </Pressable>
              ) : null}
              <Field label="Full name" value={form.name} onChangeText={set('name')} error={errors.name} autoComplete="name" textContentType="name" />
              <Field label="Mobile number" value={form.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" maxLength={14} />
              {!user ? <Field label="Email (for order updates)" value={form.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" /> : null}
              <Field label="House / flat, street, area" value={form.line1} onChangeText={set('line1')} error={errors.line1} autoComplete="street-address" textContentType="fullStreetAddress" />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}><Field label="City" value={form.city} onChangeText={set('city')} error={errors.city} textContentType="addressCity" /></View>
                <View style={{ width: 130 }}><Field label="Pincode" value={form.pincode} onChangeText={v => set('pincode')(digits(v))} error={errors.pincode} keyboardType="number-pad" maxLength={6} textContentType="postalCode" autoComplete="postal-code" /></View>
              </View>
              {user ? (
                <Pressable onPress={() => router.push('/address-edit')} style={st.addNew}>
                  <Ico name="add" size={18} color={C.green} />
                  <Text style={st.addNewTxt}>Save an address to your account</Text>
                </Pressable>
              ) : null}
            </Animated.View>
          )}
          <View style={{ marginTop: 12 }}>
            <Field label="Delivery instructions (optional)" placeholder="e.g. Ring the bell, leave at the door" value={form.notes} onChangeText={set('notes')} maxLength={200} />
          </View>
        </View>

        {/* Payment */}
        <View style={st.card}>
          <CardHead icon="wallet" title="Payment method" />
          <View style={[st.opt, st.optOn]} accessibilityRole="radio" accessibilityState={{ checked: true }}>
            <View style={st.payIco}><Ico name="cash-outline" size={18} color={C.greenDeep} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.optT}>Cash on delivery</Text>
              <Text style={st.optS}>Pay by cash or UPI when your order arrives</Text>
            </View>
            <Ico name="radio-button-on" size={20} color={C.green} />
          </View>
          <View style={[st.opt, { opacity: 0.55, marginTop: 8 }]} accessibilityRole="radio" accessibilityState={{ checked: false, disabled: true }}>
            <View style={[st.payIco, { backgroundColor: '#F1F3F6' }]}><Ico name="card-outline" size={18} color={K.meta} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.optT}>Pay online</Text>
              <Text style={st.optS}>Cards, UPI and wallets</Text>
            </View>
            <View style={st.soon}><Text style={st.soonTxt}>COMING SOON</Text></View>
          </View>
        </View>

        {cp.ok && cp.coupon ? (
          <View style={st.couponOk}>
            <Ico name="ticket" size={16} color={K.blue} />
            <Text style={st.couponOkTxt}><Text style={{ fontWeight: '900' }}>{cp.coupon.code}</Text> applied · you save {cp.couponDiscount ? inr(cp.couponDiscount) : 'the delivery fee'}</Text>
          </View>
        ) : null}

        <BillCard subtotal={m.subtotal} savings={m.savings} delivery={cp.delivery} deliveryBase={m.delivery || (kind === 'now' ? 25 : 0)}
          couponCode={cp.ok ? cp.coupon?.code : null} couponDiscount={cp.couponDiscount} total={cp.total} hint={m.freeHint && !cp.deliveryWaived ? m.freeHint : undefined} />
        {m.belowMin ? <Text style={st.err}>Minimum order for {m.restaurant?.name ?? 'this restaurant'} is {inr(m.minOrder)}.</Text> : null}
        <Text style={st.fine}>By placing this order you agree to Zyphix’s terms. Prices include taxes.</Text>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + 10 }]}>
        {errors.submit ? <Text style={[st.err, { marginBottom: 8 }]}>{errors.submit}</Text> : null}
        {fieldErrors && !errors.submit ? <Text style={[st.err, { marginBottom: 8 }]}>Please fix the highlighted fields.</Text> : null}
        <Tap onPress={placing || m.belowMin ? undefined : place} style={[st.place, (m.belowMin || placing) && { opacity: 0.6 }]} scale={0.98} accessibilityRole="button" accessibilityState={{ disabled: m.belowMin, busy: placing }}>
          <View>
            <Text style={st.placeAmt}>{inr(cp.total)}</Text>
            <Text style={st.placeTot}>TOTAL · CASH</Text>
          </View>
          {placing ? <ActivityIndicator color="#fff" /> : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={st.placeCta}>Place order</Text>
              <Ico name="chevron-forward" size={18} color="#fff" />
            </View>
          )}
        </Tap>
      </View>
    </KeyboardAvoidingView>
  );
}

function CardHead({ icon, title }: { icon: IconName; title: string }) {
  return (
    <View style={st.head}>
      <Ico name={icon} size={18} color={C.green} />
      <Text style={st.headT}>{title}</Text>
    </View>
  );
}

function Field({ label, error, ...rest }: TextInputProps & { label: string; error?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <Text style={st.label}>{label}</Text>
      <TextInput {...rest} onFocus={e => { setFocus(true); rest.onFocus?.(e); }} onBlur={e => { setFocus(false); rest.onBlur?.(e); }}
        placeholderTextColor="#9CA3AF" accessibilityLabel={label}
        style={[st.input, focus && { borderColor: C.green }, !!error && { borderColor: C.red }]} />
      {error ? <Text style={st.err}>{error}</Text> : null}
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: K.page },
  eta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14 },
  etaIco: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  etaT: { fontSize: 16, fontWeight: '800', color: K.ink },
  etaS: { fontSize: 12, color: K.meta, marginTop: 1 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  headT: { fontSize: 15, fontWeight: '800', color: K.ink },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: K.line, minHeight: 56 },
  optOn: { borderColor: C.green, backgroundColor: '#F3FBF7' },
  optT: { fontSize: 14, fontWeight: '800', color: K.ink },
  optS: { fontSize: 12.5, color: K.meta, lineHeight: 17 },
  def: { backgroundColor: '#E9F8F1', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  defTxt: { fontSize: 9.5, fontWeight: '900', color: C.greenDeep, letterSpacing: 0.5 },
  addNew: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 2 },
  addNewTxt: { fontSize: 13.5, fontWeight: '800', color: C.green },
  signIn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E9F8F1', borderRadius: 12, padding: 12 },
  payIco: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E9F8F1', alignItems: 'center', justifyContent: 'center' },
  soon: { backgroundColor: '#F1F3F6', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  soonTxt: { fontSize: 9, fontWeight: '900', color: K.meta, letterSpacing: 0.5 },
  couponOk: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E8F0FE', borderRadius: 12, padding: 12 },
  couponOkTxt: { flex: 1, fontSize: 13, color: '#1D4ED8', fontWeight: '600' },
  label: { fontSize: 12.5, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: K.line, paddingHorizontal: 12, fontSize: 15, color: K.ink, backgroundColor: '#fff', ...noOutline },
  err: { fontSize: 12.5, color: C.red, marginTop: 4, fontWeight: '600' },
  fine: { fontSize: 11.5, color: '#9CA3AF', textAlign: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingTop: 10, backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 8 },
  place: { height: 56, borderRadius: 14, backgroundColor: C.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  placeAmt: { color: '#fff', fontSize: 16, fontWeight: '900' },
  placeTot: { color: 'rgba(255,255,255,.85)', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  placeCta: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
