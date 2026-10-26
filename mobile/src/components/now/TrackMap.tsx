import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Ico, K, type IconName } from '@/components/kit';
import { C } from '@/lib/theme';

/**
 * Map-like illustration (no map SDK): a street grid, the store/kitchen pin, your home pin,
 * a dotted route and a rider that glides along it with a pulsing halo.
 */
export function TrackMap({ progress, from, fromIcon, done }: { progress: number; from: string; fromIcon: IconName; done: boolean }) {
  const [w, setW] = useState(0);
  const p = useSharedValue(0);
  const pulse = useSharedValue(0);
  useEffect(() => { p.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 900, easing: Easing.out(Easing.cubic) }); }, [progress, p]);
  useEffect(() => { pulse.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) }), -1, false); }, [pulse]);

  const L = 46, R = 46; // route endpoints (pin centres) from the edges
  const track = Math.max(0, w - L - R);
  const rider = useAnimatedStyle(() => ({ transform: [{ translateX: L - 19 + p.value * track }] }));
  const fill = useAnimatedStyle(() => ({ width: p.value * track }));
  const halo = useAnimatedStyle(() => ({ opacity: done ? 0 : 0.4 * (1 - pulse.value), transform: [{ scale: 1 + pulse.value * 1.3 }] }));

  return (
    <View style={st.wrap} onLayout={e => setW(e.nativeEvent.layout.width)}>
      {/* streets + blocks */}
      {[22, 74, 142].map(t => <View key={`h${t}`} style={[st.street, { top: t, left: 0, right: 0, height: 9 }]} />)}
      {[0.14, 0.38, 0.63, 0.86].map(l => <View key={`v${l}`} style={[st.street, { left: `${l * 100}%`, top: 0, bottom: 0, width: 9 }]} />)}
      <View style={[st.park, { top: 36, left: '18%', width: 52, height: 32 }]} />
      <View style={[st.park, { top: 88, left: '67%', width: 44, height: 46 }]} />
      <View style={[st.block, { top: 90, left: '41%', width: 56, height: 22 }]} />
      <View style={[st.water, { top: 152, left: '20%', width: 70, height: 20 }]} />

      {/* route */}
      <View style={[st.route, { left: L, right: R }]}>
        {Array.from({ length: Math.max(0, Math.floor(track / 10)) }, (_, i) => <View key={i} style={st.dash} />)}
      </View>
      <Animated.View style={[st.routeFill, { left: L }, fill]} />

      {/* pins */}
      <View style={[st.pinWrap, { left: L - 22 }]}>
        <View style={[st.pin, { backgroundColor: K.ink }]}><Ico name={fromIcon} size={18} color="#fff" /></View>
        <Text style={st.pinLabel}>{from}</Text>
      </View>
      <View style={[st.pinWrap, { right: R - 22 }]}>
        <View style={[st.pin, { backgroundColor: C.green }]}><Ico name="home" size={18} color="#fff" /></View>
        <Text style={st.pinLabel}>You</Text>
      </View>

      {/* rider */}
      <Animated.View style={[st.riderWrap, rider]}>
        <Animated.View style={[st.halo, halo]} />
        <View style={[st.rider, done && { backgroundColor: C.greenDeep }]}>
          <Ico name={done ? 'checkmark' : 'bicycle'} size={20} color="#fff" />
        </View>
      </Animated.View>
    </View>
  );
}

const MID = 100;
const st = StyleSheet.create({
  wrap: { height: 190, borderRadius: 16, backgroundColor: '#EAF0EC', overflow: 'hidden' },
  street: { position: 'absolute', backgroundColor: 'rgba(255,255,255,.85)' },
  park: { position: 'absolute', borderRadius: 8, backgroundColor: 'rgba(13,163,102,.16)' },
  block: { position: 'absolute', borderRadius: 4, backgroundColor: 'rgba(5,8,14,.06)' },
  water: { position: 'absolute', borderRadius: 10, backgroundColor: 'rgba(37,99,235,.14)' },
  route: { position: 'absolute', top: MID - 2, height: 4, flexDirection: 'row', gap: 4, overflow: 'hidden' },
  dash: { width: 6, height: 4, borderRadius: 2, backgroundColor: 'rgba(5,8,14,.28)' },
  routeFill: { position: 'absolute', top: MID - 2.5, height: 5, borderRadius: 3, backgroundColor: C.green },
  pinWrap: { position: 'absolute', top: MID - 22, width: 44, alignItems: 'center' },
  pin: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  pinLabel: { marginTop: 4, fontSize: 11, fontWeight: '800', color: K.ink, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1, overflow: 'hidden' },
  riderWrap: { position: 'absolute', top: MID - 19 - 34, left: 0, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 38, height: 38, borderRadius: 19, backgroundColor: C.green },
  rider: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
});
