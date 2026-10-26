import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, LinearTransition, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ico, K, useDefaultAddress } from '@/components/kit';
import { BillCard } from '@/components/now/BillCard';
import { CouponSheet } from '@/components/now/CouponSheet';
import { EmptyState, photosFirst, Rail } from '@/components/now/blocks';
import { kindLabel, priceCart, useHasOrders, withCoupon } from '@/components/now/checkoutMath';
import { AddButton, Tap } from '@/components/ui';
import { Api } from '@/lib/api';
import { useCart, type Kind } from '@/lib/cart';
import { C, inr } from '@/lib/theme';

export default function CartScreen() {
  const params = useLocalSearchParams<{ kind?: string; coupon?: string }>();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const hasOrders = useHasOrders();
  const { user, address } = useDefaultAddress();
  const [picked, setPicked] = useState<Kind>(params.kind === 'eats' ? 'eats' : 'now');
  const [code, setCode] = useState<string | null>(params.coupon ? String(params.coupon).toUpperCase() : null);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState<{ code: string; saved: number; free: boolean } | null>(null);

  const hasNow = cart.now.length > 0, hasEats = cart.eats.length > 0;
  const kind: Kind = picked === 'now' && !hasNow && hasEats ? 'eats' : picked === 'eats' && !hasEats && hasNow ? 'now' : picked;
  const lines = cart[kind];
  const restaurant = kind === 'eats' ? cart.eatsRestaurant : null;
  const m = priceCart(kind, lines, restaurant?.id);
  const cp = withCoupon(m, code, hasOrders);
  const firstId = kind === 'now' ? lines[0]?.id : undefined;
  const related = useQuery({ queryKey: ['related', firstId], queryFn: () => Api.related(firstId!), enabled: !!firstId });
  const inCart = new Set(lines.map(l => l.id));
  const suggestions = photosFirst((related.data ?? []).filter(p => !inCart.has(p.id))).slice(0, 10);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t); }, [toast]);

  const apply = (c: string) => {
    setCode(c);
    setSheet(false);
    const r = withCoupon(m, c, hasOrders);
    if (r.ok) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setToast({ code: c, saved: r.couponDiscount + r.deliveryWaived, free: r.deliveryWaived > 0 && r.couponDiscount === 0 });
    }
  };

  if (lines.length === 0) {
    return (
      <View style={[st.fill, { justifyContent: 'center' }]}>
        <Stack.Screen options={{ title: 'My Cart', headerLeft: CloseBtn }} />
        <EmptyState icon="cart-outline" title="Your cart is empty" body="Add groceries from Zyphix Now or a meal from Zyphix Eats — it’ll show up here."
          action="Start shopping" onAction={() => { router.back(); router.navigate(kind === 'eats' ? '/eats' : '/now'); }} />
      </View>
    );
  }

  const count = cart.count(kind);
  const addrLabel = address ? `Delivering to ${address.label || 'Home'}` : user ? 'Add a delivery address' : 'Delivery address';
  const addrLine = address ? [address.line1, address.city].filter(Boolean).join(', ') : user ? 'Save one to check out faster' : 'You’ll add it at checkout · or sign in';
  const changeAddr = () => router.push(address ? '/addresses' : user ? '/address-edit' : '/sign-in');

  return (
    <View style={st.fill}>
      <Stack.Screen options={{ title: kind === 'eats' && restaurant ? restaurant.name : 'My Cart', headerTitleStyle: { fontWeight: '800' }, headerLeft: CloseBtn }} />
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 170, gap: 12 }} showsVerticalScrollIndicator={false}>
        {hasNow && hasEats ? (
          <View style={st.segment} accessibilityRole="tablist">
            {(['now', 'eats'] as Kind[]).map(k => (
              <Pressable key={k} onPress={() => setPicked(k)} style={[st.segBtn, kind === k && st.segOn]} accessibilityRole="tab" accessibilityState={{ selected: kind === k }}>
                <Text style={[st.segTxt, kind === k && { color: K.ink }]}>{kindLabel(k)} · {cart.count(k)}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {cp.totalSaved > 0 ? (
          <Animated.View entering={FadeIn} style={st.saving}>
            <Text style={st.savingTxt}>You’re saving <Text style={{ fontWeight: '900' }}>{inr(cp.totalSaved)}</Text> on this order</Text>
          </Animated.View>
        ) : null}

        <View style={st.card}>
          <View style={st.shipHead}>
            <View style={st.clock}><Ico name={kind === 'eats' ? 'restaurant' : 'time'} size={20} color={C.green} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.shipTitle}>Delivery in {m.etaMinutes} minutes</Text>
              <Text style={st.shipSub}>{kind === 'eats' && restaurant ? `From ${restaurant.name} · ` : ''}Shipment of {count} item{count === 1 ? '' : 's'}</Text>
            </View>
          </View>
          {lines.map(l => (
            <Animated.View key={l.id} entering={FadeIn} exiting={FadeOut} layout={LinearTransition} style={st.line}>
              <View style={st.thumb}>
                {l.image ? <Image source={l.image} style={kind === 'eats' ? StyleSheet.absoluteFill : { position: 'absolute', top: 6, left: 6, right: 6, bottom: 6 }} contentFit={kind === 'eats' ? 'cover' : 'contain'} recyclingKey={l.id} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={st.lName} numberOfLines={2}>{l.name}</Text>
                {l.weight ? <Text style={st.lWeight}>{l.weight}</Text> : null}
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'baseline' }}>
                  <Text style={st.lPrice}>{inr(l.price)}</Text>
                  {l.origPrice && l.origPrice > l.price ? <Text style={st.strike}>{inr(l.origPrice)}</Text> : null}
                </View>
              </View>
              <AddButton kind={kind} item={l} restaurant={restaurant ?? undefined} compact />
            </Animated.View>
          ))}
          <Pressable onPress={() => { router.back(); router.navigate(kind === 'eats' && restaurant ? { pathname: '/restaurant/[id]', params: { id: restaurant.id } } : '/now'); }} style={st.more} accessibilityRole="button">
            <Ico name="add-circle" size={18} color={C.green} />
            <Text style={st.moreTxt}>Add more items</Text>
          </Pressable>
        </View>

        {m.belowMin ? (
          <View style={st.warn}>
            <Ico name="alert-circle" size={18} color="#D97706" />
            <Text style={st.warnTxt}>{restaurant?.name ?? 'This restaurant'} has a minimum order of {inr(m.minOrder)}. Add {inr(m.minOrder - m.subtotal)} more to check out.</Text>
          </View>
        ) : null}

        {kind === 'now' && (related.isLoading || suggestions.length > 0) ? (
          <View style={[st.card, { paddingHorizontal: 0, paddingBottom: 14 }]}>
            <Rail title="You might also like" products={suggestions} loading={related.isLoading} style={{ marginTop: -10 }} />
          </View>
        ) : null}

        {/* Coupon row */}
        <Tap onPress={() => setSheet(true)} scale={0.99} style={st.coupon} accessibilityRole="button" accessibilityLabel={cp.ok ? `Coupon ${code} applied` : 'Apply coupon'}>
          <View style={st.ticket}><Ico name="ticket" size={18} color={K.blue} /></View>
          {cp.coupon ? (
            <View style={{ flex: 1 }}>
              <Text style={st.couponTitle}>{cp.ok ? `‘${cp.coupon.code}’ applied` : `${cp.coupon.code} not applied`}</Text>
              <Text style={[st.couponSub, !cp.ok && { color: '#C2410C' }]}>{cp.ok ? (cp.couponDiscount ? `You save ${inr(cp.couponDiscount)}` : 'Free delivery on this order') : cp.ev?.reason}</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text style={st.couponTitle}>Apply coupon</Text>
              <Text style={st.couponSub}>Save more with offers on this order</Text>
            </View>
          )}
          {cp.coupon ? (
            <Pressable onPress={() => setCode(null)} hitSlop={10} accessibilityLabel="Remove coupon"><Text style={st.remove}>Remove</Text></Pressable>
          ) : <Ico name="chevron-forward" size={18} color={K.meta} />}
        </Tap>

        <BillCard subtotal={m.subtotal} savings={m.savings} delivery={cp.delivery} deliveryBase={m.delivery || (kind === 'now' ? 25 : 0)}
          couponCode={cp.ok ? cp.coupon?.code : null} couponDiscount={cp.couponDiscount} total={cp.total} hint={m.freeHint && !cp.deliveryWaived ? m.freeHint : undefined} />

        <View style={st.card}>
          <Text style={st.policyT}>Cancellation policy</Text>
          <Text style={st.policy}>Orders can’t be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.</Text>
        </View>
      </ScrollView>

      {/* Bottom bar: address strip + pay button */}
      <View style={[st.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable onPress={changeAddr} style={st.addr} accessibilityRole="button">
          <View style={st.addrIco}><Ico name={address ? 'home' : 'location'} size={16} color={C.greenDeep} /></View>
          <View style={{ flex: 1 }}>
            <Text style={st.addrT} numberOfLines={1}>{addrLabel}</Text>
            <Text style={st.addrS} numberOfLines={1}>{addrLine}</Text>
          </View>
          <Text style={st.change}>{address ? 'Change' : user ? 'Add' : 'Sign in'}</Text>
        </Pressable>
        <Tap onPress={m.belowMin ? undefined : () => router.push({ pathname: '/checkout', params: { kind, ...(cp.ok && code ? { coupon: code } : {}) } })}
          style={[st.pay, m.belowMin && { opacity: 0.5 }]} scale={0.98} accessibilityRole="button" accessibilityState={{ disabled: m.belowMin }} accessibilityLabel={`Proceed to pay ${inr(cp.total)}`}>
          <View>
            <Text style={st.payAmt}>{inr(cp.total)}</Text>
            <Text style={st.payTot}>TOTAL</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={st.payCta}>Proceed to pay</Text>
            <Ico name="chevron-forward" size={18} color="#fff" />
          </View>
        </Tap>
      </View>

      <CouponSheet visible={sheet} onClose={() => setSheet(false)} subtotal={m.subtotal} hasOrders={hasOrders} applied={cp.ok ? code : null} onApply={apply} />

      {toast ? (
        <Animated.View entering={FadeInDown.springify().damping(16)} exiting={FadeOutUp} style={st.toastWrap} pointerEvents="none">
          <Animated.View entering={ZoomIn.delay(80)} style={st.toast}>
            <View style={st.toastIco}><Ico name="checkmark" size={26} color="#fff" /></View>
            <Text style={st.toastCode}>‘{toast.code}’ applied</Text>
            <Text style={st.toastSave}>{toast.free ? 'Free delivery unlocked' : `You saved ${inr(toast.saved)}`}</Text>
            <Text style={st.toastSub}>with this coupon code</Text>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}

function CloseBtn() {
  return (
    <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Close cart" style={{ paddingRight: 12, paddingVertical: 4 }}>
      <Ico name="arrow-back" size={22} />
    </Pressable>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: K.page },
  segment: { flexDirection: 'row', backgroundColor: '#E6E9EF', borderRadius: 12, padding: 3 },
  segBtn: { flex: 1, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: '#fff' },
  segTxt: { fontSize: 13, fontWeight: '800', color: K.meta },
  saving: { backgroundColor: '#E5F3FF', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  savingTxt: { color: '#1D4ED8', fontSize: 13.5, fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, paddingHorizontal: 12, paddingTop: 12 },
  shipHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 6 },
  clock: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F3F6', alignItems: 'center', justifyContent: 'center' },
  shipTitle: { fontSize: 16, fontWeight: '800', color: K.ink },
  shipSub: { fontSize: 12, color: K.meta, marginTop: 1 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  thumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: K.imgBg, borderWidth: 1, borderColor: '#EEF0F3', overflow: 'hidden' },
  lName: { fontSize: 13, fontWeight: '600', color: K.ink, lineHeight: 17 },
  lWeight: { fontSize: 12, color: K.meta },
  lPrice: { fontSize: 14, fontWeight: '800', color: K.ink },
  strike: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 46, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: K.line },
  moreTxt: { fontSize: 13.5, fontWeight: '800', color: C.green },
  warn: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#FFF8E6', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FDE7B0' },
  warnTxt: { flex: 1, fontSize: 12.5, color: K.ink, fontWeight: '600' },
  coupon: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14 },
  ticket: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center' },
  couponTitle: { fontSize: 14, fontWeight: '800', color: K.ink },
  couponSub: { fontSize: 12, color: K.meta, marginTop: 1, fontWeight: '500' },
  remove: { color: '#DC2626', fontWeight: '800', fontSize: 13 },
  policyT: { fontSize: 14, fontWeight: '800', color: K.ink },
  policy: { fontSize: 12, color: K.meta, lineHeight: 17, marginTop: 4, marginBottom: 12 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingHorizontal: 12, paddingTop: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 8 },
  addr: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, paddingHorizontal: 4 },
  addrIco: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#E9F8F1', alignItems: 'center', justifyContent: 'center' },
  addrT: { fontSize: 13.5, fontWeight: '800', color: K.ink },
  addrS: { fontSize: 12, color: K.meta },
  change: { fontSize: 13, fontWeight: '800', color: C.green },
  pay: { height: 56, borderRadius: 14, backgroundColor: C.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  payAmt: { color: '#fff', fontSize: 16, fontWeight: '900' },
  payTot: { color: 'rgba(255,255,255,.85)', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  payCta: { color: '#fff', fontSize: 16, fontWeight: '900' },
  toastWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5,8,14,.35)' },
  toast: { width: 270, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 22, paddingHorizontal: 18, alignItems: 'center', gap: 4 },
  toastIco: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  toastCode: { fontSize: 14, fontWeight: '700', color: K.meta },
  toastSave: { fontSize: 22, fontWeight: '900', color: K.ink, textAlign: 'center' },
  toastSub: { fontSize: 13, color: K.meta },
});
