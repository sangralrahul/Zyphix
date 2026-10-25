import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Icon } from '@/components/now/shared';
import { Tap, VideoBg } from '@/components/ui';
import { CLIPS, PHOTO } from '@/data/media';
import { C, R, S, T } from '@/lib/theme';

/** The three Zyphix products as big tappable cards (Now full-width with video, Eats + Book side by side). */
export function ServiceCards() {
  return (
    <View style={{ paddingHorizontal: S.xl, gap: S.md, marginTop: S.xl }}>
      <Animated.View entering={FadeInDown.duration(380).delay(60)}>
        <Tap onPress={() => router.push('/now')} style={[st.card, { height: 196 }]} accessibilityRole="button" accessibilityLabel="Zyphix Now, groceries">
          <VideoBg clip={CLIPS.vegMarket} dim={0.1} />
          <LinearGradient colors={['rgba(5,8,14,0)', 'rgba(5,8,14,.82)']} style={StyleSheet.absoluteFill} />
          <View style={st.badge}><Icon ios="bolt.fill" md="bolt" size={12} color={C.ink} /><Text style={st.badgeTxt}>30 MIN</Text></View>
          <View style={st.body}>
            <Text style={st.kicker}>ZYPHIX NOW</Text>
            <Text style={st.title}>Groceries & essentials</Text>
            <View style={st.rowBetween}>
              <Text style={st.sub}>Fresh produce, snacks, daily needs</Text>
              <View style={st.go}><Icon ios="arrow.right" md="arrow_forward" size={16} color={C.ink} /></View>
            </View>
          </View>
        </Tap>
      </Animated.View>
      <View style={{ flexDirection: 'row', gap: S.md }}>
        <Animated.View entering={FadeInDown.duration(380).delay(120)} style={{ flex: 1 }}>
          <Tap onPress={() => router.push('/eats')} style={[st.card, { height: 188 }]} accessibilityRole="button" accessibilityLabel="Zyphix Eats, food delivery">
            <Image source={PHOTO.thali} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <LinearGradient colors={['rgba(5,8,14,0)', 'rgba(5,8,14,.85)']} locations={[0.25, 1]} style={StyleSheet.absoluteFill} />
            <View style={st.body}>
              <Text style={st.kicker}>ZYPHIX EATS</Text>
              <Text style={st.titleSm}>Food from local kitchens</Text>
            </View>
          </Tap>
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(380).delay(180)} style={{ flex: 1 }}>
          <Tap onPress={() => router.push('/book')} style={[st.card, { height: 188 }]} accessibilityRole="button" accessibilityLabel="Zyphix Book, home services">
            <Image source={CLIPS.cleaning.poster} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <LinearGradient colors={['rgba(5,8,14,0)', 'rgba(5,8,14,.85)']} locations={[0.25, 1]} style={StyleSheet.absoluteFill} />
            <View style={st.body}>
              <Text style={st.kicker}>ZYPHIX BOOK</Text>
              <Text style={st.titleSm}>Verified home services</Text>
            </View>
          </Tap>
        </Animated.View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.ink2 },
  body: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: S.lg, gap: 2 },
  kicker: { ...T.tiny, color: C.mint, letterSpacing: 1.2 },
  title: { ...T.h2, color: C.white },
  titleSm: { ...T.h3, color: C.white },
  sub: { ...T.small, color: 'rgba(255,255,255,.8)', flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: S.md, marginTop: 2 },
  go: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: S.md, left: S.md, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.mint, borderRadius: R.pill, paddingHorizontal: 10, height: 24 },
  badgeTxt: { fontSize: 11, fontWeight: '800', color: C.ink, letterSpacing: 0.6 },
});
