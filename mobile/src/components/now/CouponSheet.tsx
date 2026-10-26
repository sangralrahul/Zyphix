import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ico, K } from '@/components/kit';
import { COUPONS, evaluateCoupon, findCoupon } from '@/lib/coupons';
import { C, inr } from '@/lib/theme';

const headline = (type: string, value: number) => (type === 'FLAT' ? `₹${value} OFF` : type === 'PERCENT' ? `${value}% OFF` : 'FREE DELIVERY');

/** Blinkit-style bottom sheet listing the real coupons with live eligibility for this cart. */
export function CouponSheet({ visible, onClose, subtotal, hasOrders, applied, onApply }: {
  visible: boolean; onClose: () => void; subtotal: number; hasOrders: boolean; applied?: string | null; onApply: (code: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const tryCode = () => {
    const c = findCoupon(code);
    if (!c) { setErr('This code isn’t valid. Check the spelling and try again.'); return; }
    const ev = evaluateCoupon(c, subtotal, hasOrders);
    if (!ev.ok) { setErr(ev.reason ?? 'Not applicable on this cart'); return; }
    setErr(null); setCode(''); onApply(c.code);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible ? (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View entering={FadeIn.duration(180)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,8,14,.55)' }]}>
            <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close coupons" />
          </Animated.View>
          <Pressable onPress={onClose} style={st.close} accessibilityLabel="Close"><Ico name="close" size={20} color="#fff" /></Pressable>
          <Animated.View entering={SlideInDown.springify().damping(20)} style={[st.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={st.title}>Coupons & offers</Text>
            <View style={st.inputRow}>
              <TextInput value={code} onChangeText={t => { setCode(t.toUpperCase()); setErr(null); }} placeholder="Enter coupon code" placeholderTextColor="#9CA3AF"
                autoCapitalize="characters" autoCorrect={false} style={st.input} onSubmitEditing={tryCode} returnKeyType="done" accessibilityLabel="Coupon code" />
              <Pressable onPress={tryCode} disabled={!code.trim()} hitSlop={8}><Text style={[st.applyTxt, !code.trim() && { color: '#B8C0CC' }]}>APPLY</Text></Pressable>
            </View>
            {err ? <Text style={st.err}>{err}</Text> : null}
            <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={{ gap: 10, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
              {COUPONS.map(c => {
                const ev = evaluateCoupon(c, subtotal, hasOrders);
                const on = applied === c.code;
                const save = ev.ok ? (ev.shippingWaived ? 'Free delivery on this order' : `Save ${inr(ev.itemDiscount)} on this order`) : null;
                return (
                  <View key={c.code} style={[st.card, !ev.ok && { opacity: 0.92 }]}>
                    <View style={[st.stub, { backgroundColor: ev.ok ? C.green : '#C9D0DA' }]} />
                    <View style={{ flex: 1, padding: 12, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
                          <Text style={st.code}>{c.code}</Text>
                          <View style={[st.badge, !ev.ok && { backgroundColor: '#F1F3F6' }]}><Text style={[st.badgeTxt, !ev.ok && { color: K.meta }]}>{headline(c.type, c.value)}</Text></View>
                        </View>
                        {on ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}><Ico name="checkmark-circle" size={16} color={C.green} /><Text style={[st.applyTxt, { fontSize: 13 }]}>APPLIED</Text></View>
                        ) : (
                          <Pressable onPress={() => ev.ok && onApply(c.code)} disabled={!ev.ok} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Apply ${c.code}`}>
                            <Text style={[st.applyTxt, { fontSize: 13 }, !ev.ok && { color: '#B8C0CC' }]}>APPLY</Text>
                          </Pressable>
                        )}
                      </View>
                      {save ? <Text style={st.save}>{save}</Text> : null}
                      <Text style={st.desc}>{c.desc}</Text>
                      {!ev.ok && ev.reason ? (
                        <View style={st.reason}><Ico name="information-circle" size={13} color="#C2410C" /><Text style={st.reasonTxt}>{ev.reason}</Text></View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      ) : null}
    </Modal>
  );
}

const st = StyleSheet.create({
  sheet: { backgroundColor: K.page, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 16, paddingTop: 18 },
  close: { alignSelf: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(5,8,14,.75)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '800', color: K.ink, marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: K.line, paddingHorizontal: 14, height: 50, gap: 10 },
  input: { flex: 1, height: '100%', fontSize: 15, fontWeight: '700', color: K.ink, letterSpacing: 0.5, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}) },
  applyTxt: { color: C.green, fontWeight: '900', fontSize: 14, letterSpacing: 0.4 },
  err: { color: '#C2410C', fontSize: 12.5, fontWeight: '600', marginTop: 6 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line, overflow: 'hidden' },
  stub: { width: 6 },
  badge: { backgroundColor: '#E9F8F1', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeTxt: { fontSize: 10.5, fontWeight: '900', color: C.greenDeep, letterSpacing: 0.3 },
  code: { fontSize: 15, fontWeight: '900', color: K.ink, letterSpacing: 0.6 },
  save: { fontSize: 12.5, fontWeight: '800', color: C.greenDeep },
  desc: { fontSize: 12, color: K.meta, lineHeight: 17 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#FFF4EC', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, marginTop: 2 },
  reasonTxt: { fontSize: 11.5, fontWeight: '700', color: '#C2410C' },
});
