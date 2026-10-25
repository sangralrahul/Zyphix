import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar, useLightStatusBar, useTabBottom } from '@/components/account/kit';
import { ServiceIcon } from '@/components/book/ServiceIcon';
import { HeroVideo, SectionHeader, Tap, styles as ui } from '@/components/ui';
import { SERVICES } from '@/data/book';
import { CLIPS, photo } from '@/data/media';
import { Api } from '@/lib/api';
import { C, R, S, T } from '@/lib/theme';

const PROMISES = [
  { t: 'ID & police-verified pros', d: 'Every professional is checked before their first job.' },
  { t: 'Price shown before you confirm', d: 'The pro quotes after a look — nothing starts until you say yes.' },
  { t: 'Reschedule free', d: 'Plans change. Move your slot at no cost.' },
  { t: "Credit if we're late", d: 'If your pro misses the slot, you get credit on your next booking.' },
  { t: '7-day guarantee', d: "Something not right? We'll send someone back to fix it." },
];
const STEPS = [
  { t: 'Pick a service and a slot', d: 'Choose today or tomorrow and a time that suits you.' },
  { t: 'A verified pro comes over', d: 'They take a look and confirm the price with you first.' },
  { t: 'Pay when the job is done', d: 'Pay the pro directly once you’re happy with the work.' },
];

export default function Book() {
  useLightStatusBar();
  const { width } = useWindowDimensions();
  const tabBottom = useTabBottom();
  const pros = useQuery({ queryKey: ['partners', 'service'], queryFn: () => Api.partners('service') });
  const cardW = Math.floor((Math.min(width, 600) - S.lg * 2 - 12) / 2);

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: tabBottom + 24 }} showsVerticalScrollIndicator={false}>
        <HeroVideo clip={CLIPS.cleaning} height={300}>
          <Text style={st.kicker}>ZYPHIX BOOK</Text>
          <Text style={[T.display, { color: C.white }]}>
            Home services, done by <Text style={[T.accent, { color: C.mint }]}>verified</Text> pros.
          </Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,.8)', marginTop: 8 }]}>Plumbers, electricians, cleaning and more — at a time you pick.</Text>
        </HeroVideo>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={232} decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12, paddingTop: S.lg }}>
          {PROMISES.map(p => (
            <View key={p.t} style={st.promise}>
              <View style={[ui.row, { alignItems: 'flex-start' }]}>
                <View style={st.tick}><Text style={{ color: C.white, fontSize: 11, fontWeight: '900' }}>✓</Text></View>
                <Text style={[T.bodyStrong, { flex: 1 }]}>{p.t}</Text>
              </View>
              <Text style={[T.small, { color: C.text2, marginTop: 4 }]}>{p.d}</Text>
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="What do you need?" style={{ marginTop: S.xxl }} />
        <View style={st.grid}>
          {SERVICES.map((s, i) => (
            <Animated.View key={s.id} entering={FadeInDown.delay(Math.min(i, 6) * 40).duration(280)}>
              <Tap onPress={() => router.push({ pathname: '/service/[id]', params: { id: s.id } })} style={[st.card, { width: cardW }]} scale={0.97}
                accessibilityLabel={`${s.title}: ${s.blurb}`}>
                <View style={st.cardImg}>
                  <Image source={photo(s.photo, 480)} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} recyclingKey={s.id} cachePolicy="memory-disk" />
                  <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.25)']} style={StyleSheet.absoluteFill} />
                  <View style={{ position: 'absolute', top: 8, left: 8 }}><ServiceIcon sf={s.sf} title={s.title} size={32} /></View>
                </View>
                <View style={{ padding: 10, gap: 2 }}>
                  <Text style={T.bodyStrong} numberOfLines={1}>{s.title}</Text>
                  <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{s.blurb}</Text>
                </View>
              </Tap>
            </Animated.View>
          ))}
        </View>

        <SectionHeader title="How it works" />
        <View style={st.steps}>
          {STEPS.map((s, i) => (
            <View key={s.t} style={st.step}>
              <View style={{ alignItems: 'center' }}>
                <View style={st.num}><Text style={{ color: C.white, fontWeight: '800' }}>{i + 1}</Text></View>
                {i < STEPS.length - 1 && <View style={st.line} />}
              </View>
              <View style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? S.xl : 0 }}>
                <Text style={T.h3}>{s.t}</Text>
                <Text style={[T.small, { color: C.text2, marginTop: 2 }]}>{s.d}</Text>
              </View>
            </View>
          ))}
        </View>

        {(pros.data?.length ?? 0) > 0 && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <SectionHeader title="Pros near you" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12 }}>
              {pros.data!.map(p => (
                <View key={p.id} style={st.pro}>
                  <Avatar name={p.name} size={52} />
                  <Text style={[T.bodyStrong, { marginTop: 8 }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{p.category || 'Home services'}</Text>
                  {(p.locality || p.city) ? <Text style={[T.small, { color: C.text3 }]} numberOfLines={1}>{p.locality || p.city}</Text> : null}
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  kicker: { color: C.mint, fontWeight: '800', fontSize: 12, letterSpacing: 1.6, marginBottom: 8 },
  promise: { width: 220, padding: 14, borderRadius: R.md, backgroundColor: C.greenSoft },
  tick: { width: 20, height: 20, borderRadius: 10, marginTop: 1, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: S.lg },
  card: { borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.bg, overflow: 'hidden' },
  cardImg: { aspectRatio: 4 / 3, backgroundColor: C.bgSoft },
  steps: { marginHorizontal: S.lg, padding: S.xl, borderRadius: R.lg, backgroundColor: C.bgSoft },
  step: { flexDirection: 'row', gap: 14 },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 2, backgroundColor: C.line, marginVertical: 4 },
  pro: { width: 150, borderRadius: R.md, borderWidth: 1, borderColor: C.line, padding: 12, alignItems: 'flex-start' },
});
