import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Ico, K, type IconName } from '@/components/kit';
import { C, inr } from '@/lib/theme';

/** Blinkit "Bill details" card. */
export function BillCard({ subtotal, savings, delivery, deliveryBase, couponCode, couponDiscount, total, hint, style }: {
  subtotal: number; savings: number; delivery: number; /** fee before a FREESHIP coupon */ deliveryBase?: number;
  couponCode?: string | null; couponDiscount?: number; total: number; hint?: string; style?: StyleProp<ViewStyle>;
}) {
  const base = deliveryBase ?? delivery;
  return (
    <View style={[st.card, style]}>
      <Text style={st.title}>Bill details</Text>
      <Row icon="document-text-outline" label="Items total" value={inr(subtotal)} strike={savings > 0 ? inr(subtotal + savings) : undefined} badge={savings > 0 ? `Saved ${inr(savings)}` : undefined} />
      <Row icon="bicycle-outline" label="Delivery charge" value={delivery === 0 ? 'FREE' : inr(delivery)} strike={delivery === 0 && base > 0 ? inr(base) : undefined} green={delivery === 0} />
      {hint ? <Text style={st.hint}>{hint}</Text> : null}
      {couponDiscount ? <Row icon="ticket-outline" label={couponCode ? `Coupon (${couponCode})` : 'Coupon discount'} value={`−${inr(couponDiscount)}`} green /> : null}
      <View style={st.div} />
      <View style={st.row}>
        <Text style={st.total}>Grand total</Text>
        <Text style={st.total}>{inr(total)}</Text>
      </View>
    </View>
  );
}

function Row({ icon, label, value, strike, badge, green }: { icon: IconName; label: string; value: string; strike?: string; badge?: string; green?: boolean }) {
  return (
    <View style={st.row}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <Ico name={icon} size={15} color="#374151" />
        <Text style={st.label}>{label}</Text>
        {badge ? <View style={st.badge}><Text style={st.badgeTxt}>{badge}</Text></View> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {strike ? <Text style={st.strike}>{strike}</Text> : null}
        <Text style={[st.value, green && { color: C.greenDeep }]}>{value}</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line, padding: 14 },
  title: { fontSize: 15, fontWeight: '800', color: K.ink, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 },
  label: { fontSize: 13, color: '#374151', fontWeight: '500' },
  value: { fontSize: 13, color: K.ink, fontWeight: '700' },
  strike: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  badge: { backgroundColor: '#E8F0FE', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 },
  badgeTxt: { fontSize: 10, fontWeight: '800', color: K.blue },
  hint: { fontSize: 11.5, color: '#C2410C', fontWeight: '600', marginLeft: 23, marginTop: -2, marginBottom: 2 },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: '#D9DEE5', marginVertical: 8 },
  total: { fontSize: 15, fontWeight: '900', color: K.ink },
});
