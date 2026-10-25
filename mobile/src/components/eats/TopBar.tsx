import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, S, T, shadow } from '@/lib/theme';

/**
 * Floating back button over a photo header; a white bar with the title fades in once the
 * photo scrolls away (collapsing header, like Swiggy / Urban Company).
 */
export function CollapsingTopBar({ y, title, fadeAt, right }: { y: SharedValue<number>; title: string; fadeAt: number; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const bar = useAnimatedStyle(() => ({ opacity: interpolate(y.value, [fadeAt - 60, fadeAt], [0, 1], Extrapolation.CLAMP) }));
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={[StyleSheet.absoluteFill, { bottom: undefined, height: insets.top + 56 }]} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: C.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line }, bar]} pointerEvents="none">
        <View style={{ flex: 1, paddingTop: insets.top, justifyContent: 'center', paddingHorizontal: 64 }}>
          <Text style={[T.h3, { textAlign: 'center' }]} numberOfLines={1}>{title}</Text>
        </View>
      </Animated.View>
      <View style={{ position: 'absolute', top: insets.top + 6, left: S.md, right: S.md, flexDirection: 'row', justifyContent: 'space-between' }} pointerEvents="box-none">
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" hitSlop={6} style={st.btn}>
          <Text style={st.chev}>‹</Text>
        </Pressable>
        {right}
      </View>
    </View>
  );
}

/** Photo header that stretches on pull-down and drifts slower than the content (parallax). */
export function ParallaxImage({ y, height, children }: { y: SharedValue<number>; height: number; children: React.ReactNode }) {
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value < 0 ? y.value / 2 : y.value * 0.45 },
      { scale: y.value < 0 ? 1 + -y.value / height : 1 },
    ],
  }));
  return <Animated.View style={[{ height, overflow: 'hidden', backgroundColor: C.ink }, style]}>{children}</Animated.View>;
}

const st = StyleSheet.create({
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', ...shadow },
  chev: { fontSize: 30, lineHeight: 32, color: C.text, marginTop: -3, marginLeft: -2, fontWeight: '400' },
});
