import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { kindLabel, priceCart } from '@/components/now/checkoutMath';
import { BillSummary, Icon } from '@/components/now/shared';
import { AddButton, Button, Empty } from '@/components/ui';
import { useCart, type Kind } from '@/lib/cart';
import { C, R, S, T, inr, shadow } from '@/lib/theme';

export default function CartScreen() {
  const params = useLocalSearchParams<{ kind?: string }>();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const [picked, setPicked] = useState<Kind>(params.kind === 'eats' ? 'eats' : 'now');

  const hasNow = cart.now.length > 0, hasEats = cart.eats.length > 0;
  // If the requested cart is empty but the other isn't, show the other one.
  const kind: Kind = picked === 'now' && !hasNow && hasEats ? 'eats' : picked === 'eats' && !hasEats && hasNow ? 'now' : picked;
  const lines = cart[kind];
  const restaurant = kind === 'eats' ? cart.eatsRestaurant : null;
  const m = priceCart(kind, lines, restaurant?.id);

  if (lines.length === 0) {
    return (
      <View style={[st.fill, { justifyContent: 'center' }]}>
        <Stack.Screen options={{ title: 'Your cart' }} />
        <View style={st.emptyIcon}><Icon ios="cart" md="shopping_cart" size={40} color={C.green} /></View>
        <Empty title="Your cart is empty" body="Add groceries from Zyphix Now or a meal from Zyphix Eats." action="Start shopping"
          onAction={() => { router.back(); router.navigate(kind === 'eats' ? '/eats' : '/now'); }} />
      </View>
    );
  }

  return (
    <View style={st.fill}>
      <Stack.Screen options={{ title: kind === 'eats' && restaurant ? restaurant.name : 'Your cart' }} />
      <ScrollView contentContainerStyle={{ padding: S.xl, paddingBottom: insets.bottom + 130, gap: S.lg }}>
        {hasNow && hasEats && (
          <View style={st.segment} accessibilityRole="tablist">
            {(['now', 'eats'] as Kind[]).map(k => (
              <Pressable key={k} onPress={() => setPicked(k)} style={[st.segBtn, kind === k && st.segActive]} accessibilityRole="tab" accessibilityState={{ selected: kind === k }}>
                <Text style={[T.small, { fontWeight: '700', color: kind === k ? C.text : C.text2 }]}>{kindLabel(k)} · {cart.count(k)}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={st.etaCard}>
          <Icon ios={kind === 'eats' ? 'fork.knife' : 'bolt.fill'} md={kind === 'eats' ? 'restaurant' : 'bolt'} size={18} color={C.greenDeep} />
          <View style={{ flex: 1 }}>
            <Text style={T.bodyStrong}>Delivery in about {m.etaMinutes} minutes</Text>
            <Text style={[T.small, { color: C.text2 }]}>{kind === 'eats' && restaurant ? `From ${restaurant.name}` : 'Packed by a store near you'}</Text>
          </View>
        </View>

        <View style={st.card}>
          {lines.map((l, i) => (
            <Animated.View key={l.id} entering={FadeIn} exiting={FadeOut} layout={LinearTransition} style={[st.line, i > 0 && st.lineBorder]}>
              <View style={st.thumb}>{!!l.image && <Image source={l.image} style={StyleSheet.absoluteFill} contentFit={kind === 'eats' ? 'cover' : 'contain'} recyclingKey={l.id} />}</View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[T.small, { fontWeight: '600', color: C.text }]} numberOfLines={2}>{l.name}</Text>
                {!!l.weight && <Text style={[T.small, { color: C.text3 }]}>{l.weight}</Text>}
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'baseline' }}>
                  <Text style={T.bodyStrong}>{inr(l.price * l.qty)}</Text>
                  {!!l.origPrice && l.origPrice > l.price && <Text style={st.strike}>{inr(l.origPrice * l.qty)}</Text>}
                </View>
              </View>
              <AddButton kind={kind} item={l} restaurant={restaurant ?? undefined} compact />
            </Animated.View>
          ))}
          <Pressable onPress={() => { router.back(); router.navigate(kind === 'eats' && restaurant ? { pathname: '/restaurant/[id]', params: { id: restaurant.id } } : '/now'); }}
            style={[st.line, st.lineBorder, { minHeight: 48 }]}>
            <Icon ios="plus.circle.fill" md="add_circle" size={20} color={C.green} />
            <Text style={[T.bodyStrong, { color: C.green }]}>Add more items</Text>
          </Pressable>
        </View>

        {m.belowMin && (
          <View style={st.warn}>
            <Icon ios="exclamationmark.circle.fill" md="error" size={18} color={C.amber} />
            <Text style={[T.small, { flex: 1, color: C.text }]}>{restaurant?.name ?? 'This restaurant'} has a minimum order of {inr(m.minOrder)}. Add {inr(m.minOrder - m.subtotal)} more to check out.</Text>
          </View>
        )}

        <BillSummary bill={m.bill} freeDeliveryHint={m.freeHint} />
        <Text style={[T.small, { color: C.text3, textAlign: 'center' }]}>Pay with cash on delivery. Prices include taxes.</Text>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={[T.small, { color: C.text2 }]}>To pay</Text>
          <Text style={T.h2}>{inr(m.bill.total)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Proceed to checkout" disabled={m.belowMin}
            onPress={() => router.push({ pathname: '/checkout', params: { kind } })} />
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: C.bgSoft },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  segment: { flexDirection: 'row', backgroundColor: '#ECEEF1', borderRadius: R.md, padding: 3 },
  segBtn: { flex: 1, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segActive: { backgroundColor: C.bg, ...shadow },
  etaCard: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.bg, borderRadius: R.lg, padding: S.lg, borderWidth: 1, borderColor: C.line },
  card: { backgroundColor: C.bg, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, paddingHorizontal: S.lg },
  line: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  lineBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  thumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F7F8FA', overflow: 'hidden' },
  strike: { ...T.small, color: C.text3, textDecorationLine: 'line-through' },
  warn: { flexDirection: 'row', gap: S.sm, alignItems: 'center', backgroundColor: '#FFF8E6', borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: '#FDE7B0' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: S.lg, paddingHorizontal: S.xl, paddingTop: S.md, backgroundColor: C.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
});
