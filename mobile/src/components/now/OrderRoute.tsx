import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import type { SFSymbol } from 'expo-symbols';

import { Icon, type MaterialName } from '@/components/now/shared';
import { C, R, S, T } from '@/lib/theme';

const DOT = 36;

/**
 * Stylised route from the store/kitchen to your door: a progress line with a rider dot that
 * glides along it (pure Views + Reanimated, no maps or SVG).
 */
export function OrderRoute({ progress, from, fromIcon, done }: { progress: number; from: string; fromIcon: { ios: SFSymbol; md: MaterialName }; done: boolean }) {
  const [w, setW] = useState(0);
  const p = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => { p.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 900, easing: Easing.out(Easing.cubic) }); }, [progress, p]);
  useEffect(() => { pulse.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false); }, [pulse]);

  const track = Math.max(0, w - DOT);
  const fill = useAnimatedStyle(() => ({ width: p.value * track }));
  const rider = useAnimatedStyle(() => ({ transform: [{ translateX: p.value * track }] }));
  const halo = useAnimatedStyle(() => ({ opacity: done ? 0 : 0.45 * (1 - pulse.value), transform: [{ scale: 1 + pulse.value * 1.2 }] }));

  return (
    <View style={st.wrap}>
      {/* faint street grid */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {[18, 52, 96].map(t => <View key={`h${t}`} style={[st.street, { top: t, left: 0, right: 0, height: 6 }]} />)}
        {[0.18, 0.46, 0.74].map(l => <View key={`v${l}`} style={[st.street, { left: `${l * 100}%`, top: 0, bottom: 0, width: 6 }]} />)}
        <View style={[st.block, { top: 30, left: '22%', width: 46, height: 16 }]} />
        <View style={[st.block, { top: 64, left: '52%', width: 60, height: 24 }]} />
      </View>

      <View style={st.row}>
        <Pin ios={fromIcon.ios} md={fromIcon.md} label={from} />
        <Pin ios="house.fill" md="home" label="You" right />
      </View>

      <View style={st.trackArea} onLayout={e => setW(e.nativeEvent.layout.width)}>
        <View style={st.line} />
        <Animated.View style={[st.lineFill, fill]} />
        <Animated.View style={[st.riderWrap, rider]}>
          <Animated.View style={[st.halo, halo]} />
          <View style={[st.rider, done && { backgroundColor: C.greenDeep }]}>
            <Icon ios={done ? 'checkmark' : 'bicycle'} md={done ? 'check' : 'two_wheeler'} size={18} color={C.white} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

function Pin({ ios, md, label, right }: { ios: SFSymbol; md: MaterialName; label: string; right?: boolean }) {
  return (
    <View style={[st.pin, right && { flexDirection: 'row-reverse' }]}>
      <View style={st.pinIcon}><Icon ios={ios} md={md} size={16} color={C.ink} /></View>
      <Text style={[T.small, { fontWeight: '700', color: C.text }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { height: 150, borderRadius: R.lg, backgroundColor: '#EEF3EF', overflow: 'hidden', padding: S.lg, justifyContent: 'space-between' },
  street: { position: 'absolute', backgroundColor: 'rgba(255,255,255,.75)' },
  block: { position: 'absolute', borderRadius: 4, backgroundColor: 'rgba(13,163,102,.10)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: S.md },
  pin: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.bg, borderRadius: R.pill, paddingRight: 12, paddingLeft: 4, height: 32, maxWidth: '60%' },
  pinIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center' },
  trackArea: { height: DOT, justifyContent: 'center' },
  line: { position: 'absolute', left: DOT / 2, right: DOT / 2, height: 4, borderRadius: 2, backgroundColor: 'rgba(5,8,14,.12)' },
  lineFill: { position: 'absolute', left: DOT / 2, height: 4, borderRadius: 2, backgroundColor: C.green },
  riderWrap: { position: 'absolute', left: 0, width: DOT, height: DOT, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: C.green },
  rider: { width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.white },
});
