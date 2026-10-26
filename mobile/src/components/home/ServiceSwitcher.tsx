import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { K } from '@/components/kit';
import { Tap } from '@/components/ui';
import { C } from '@/lib/theme';

type Card = { href: '/now' | '/eats' | '/book'; title: string; tag: string; image?: string; cover?: boolean; bg: string };

/** Swiggy-style service switcher that sits on the green band: Groceries / Food / Services. */
export function ServiceSwitcher({ grocery, dish, service }: { grocery?: string; dish?: string; service?: string }) {
  const cards: Card[] = [
    { href: '/now', title: 'Groceries', tag: '30 MINS', image: grocery, bg: '#FFF7E6' },
    { href: '/eats', title: 'Food', tag: 'LOCAL KITCHENS', image: dish, cover: true, bg: '#FFF0EE' },
    { href: '/book', title: 'Services', tag: 'VERIFIED PROS', image: service, cover: true, bg: '#EEF4FF' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 14 }}>
      {cards.map(c => (
        <View key={c.href} style={{ flex: 1 }}>
        <Tap onPress={() => router.navigate(c.href)} style={st.card} scale={0.96} accessibilityRole="button" accessibilityLabel={c.title}>
          <Text style={st.title}>{c.title}</Text>
          <View style={st.tag}><Text style={st.tagTxt} numberOfLines={1}>{c.tag}</Text></View>
          <View style={[st.blob, { backgroundColor: c.bg }]} />
          {c.image ? (
            c.cover
              ? <Image source={c.image} style={st.round} contentFit="cover" transition={150} />
              : <Image source={c.image} style={st.cut} contentFit="contain" transition={150} />
          ) : null}
        </Tap>
        </View>
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  card: { height: 116, backgroundColor: '#fff', borderRadius: 16, padding: 10, overflow: 'hidden' },
  title: { fontSize: 15, fontWeight: '900', color: K.ink, letterSpacing: -0.3 },
  tag: { alignSelf: 'flex-start', marginTop: 4, backgroundColor: '#E9F8F1', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, maxWidth: '100%' },
  tagTxt: { fontSize: 8.5, fontWeight: '900', color: C.greenDeep, letterSpacing: 0.3 },
  blob: { position: 'absolute', right: -18, bottom: -18, width: 86, height: 86, borderRadius: 43 },
  cut: { position: 'absolute', right: 4, bottom: 4, width: 62, height: 62 },
  round: { position: 'absolute', right: 6, bottom: 6, width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: '#fff' },
});
