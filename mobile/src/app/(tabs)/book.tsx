import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, noOutline, useTabBottom } from '@/components/account/kit';
import { BannerCarousel, ServiceCard, ServiceTile, WideServiceCard, openService, svc } from '@/components/book/parts';
import { AddressRow, AvatarButton, Ico, K, type IconName } from '@/components/kit';
import { Tap } from '@/components/ui';
import { SERVICES } from '@/data/book';
import { photo } from '@/data/media';
import { Api } from '@/lib/api';
import { C } from '@/lib/theme';

const GRID = ['sv3', 'sv5', 'sv1', 'sv2', 'sv4', 'sv7', 'sv6', 'sv8', 'sv9'];
const MOST_BOOKED = ['sv3', 'sv5', 'sv1', 'sv2', 'sv6', 'sv4'];
const SECTIONS: { title: string; sub: string; ids: string[] }[] = [
  { title: 'Cleaning', sub: 'Kitchen, bathroom and full-home deep clean', ids: ['sv3'] },
  { title: 'Repairs & installation', sub: 'Plumbing, electrical, carpentry and small fixes', ids: ['sv1', 'sv2', 'sv7', 'sv10'] },
  { title: 'Appliances', sub: 'AC and water purifier service', ids: ['sv5', 'sv6'] },
  { title: 'Home & kitchen', sub: 'Painting, cooks and local shifting', ids: ['sv4', 'sv8', 'sv9'] },
];
const PROMISES: { icon: IconName; t: string }[] = [
  { icon: 'shield-checkmark', t: 'Verified\nprofessionals' },
  { icon: 'pricetag', t: 'Price agreed\nbefore work' },
  { icon: 'calendar', t: 'Free\nrescheduling' },
];
const STEPS = [
  { icon: 'calendar-outline' as IconName, t: 'Pick a service and a slot', d: 'Today or tomorrow, at a time that suits you.' },
  { icon: 'person-outline' as IconName, t: 'A verified pro comes over', d: 'They take a look and confirm the price with you first.' },
  { icon: 'wallet-outline' as IconName, t: 'Pay when the job is done', d: 'Pay the pro directly once you’re happy.' },
];
const WORDS = ['AC service', 'plumber', 'home cleaning', 'electrician', 'painter', 'carpenter'];
const version = Constants.expoConfig?.version ?? '1.0.0';

function Block({ title, sub, children, style }: { title?: string; sub?: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[st.block, style]}>
      {title ? (
        <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
          <Text style={st.h}>{title}</Text>
          {sub ? <Text style={st.sub}>{sub}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export default function Book() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabBottom = useTabBottom();
  useFocusEffect(useCallback(() => { setStatusBarStyle('dark', true); }, []));
  const pros = useQuery({ queryKey: ['partners', 'service'], queryFn: () => Api.partners('service') });
  const [q, setQ] = useState('');
  const [w, setW] = useState(0);
  useEffect(() => { const t = setInterval(() => setW(v => (v + 1) % WORDS.length), 2200); return () => clearInterval(t); }, []);
  const tileW = Math.floor((Math.min(width, 600) - 32 - 2 * 12) / 3);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => query ? SERVICES.filter(s => `${s.title} ${s.blurb} ${s.category}`.toLowerCase().includes(query)) : null, [query]);

  return (
    <View collapsable={false} style={{ flex: 1, backgroundColor: K.page }}>
      <ScrollView stickyHeaderIndices={[1]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBottom + 28 }}>
        <View style={[st.top, { paddingTop: insets.top + 10 }]}>
          <View style={st.pin}><Ico name="location" size={20} color={C.green} /></View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={st.brand}>ZYPHIX BOOK</Text>
            <AddressRow light={false} />
          </View>
          <AvatarButton light={false} />
        </View>

        <View style={st.sticky}>
          <View style={st.search}>
            <Ico name="search" size={19} color={K.ink} />
            <TextInput value={q} onChangeText={setQ} placeholder={`Search for “${WORDS[w]}”`} placeholderTextColor="#8A919C" style={st.searchInput}
              returnKeyType="search" autoCorrect={false} accessibilityLabel="Search services" />
            {q ? <Pressable onPress={() => setQ('')} hitSlop={10} accessibilityLabel="Clear search"><Ico name="close-circle" size={18} color="#9CA3AF" /></Pressable> : null}
          </View>
        </View>

        {results ? (
          <Animated.View key="results" entering={FadeIn.duration(150)} style={{ padding: 16, gap: 10, minHeight: 500 }}>
            {results.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <View style={st.emptyIcon}><Ico name="construct-outline" size={30} color={C.green} /></View>
                <Text style={{ fontSize: 17, fontWeight: '800', color: K.ink }}>No service for “{q.trim()}”</Text>
                <Text style={{ fontSize: 13.5, color: K.meta, marginTop: 4, textAlign: 'center' }}>Try plumber, electrician, cleaning or AC.</Text>
              </View>
            ) : results.map(s => (
              <Tap key={s.id} onPress={() => openService(s.id)} style={st.resRow} scale={0.98}>
                <Image source={photo(s.photo, 200)} style={st.resImg} contentFit="cover" recyclingKey={`r-${s.id}`} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: K.ink }}>{s.title}</Text>
                  <Text style={{ fontSize: 12.5, color: K.meta, marginTop: 2 }}>{s.blurb}</Text>
                </View>
                <Ico name="chevron-forward" size={18} color="#9CA3AF" />
              </Tap>
            ))}
          </Animated.View>
        ) : (
          <View key="browse">
            <Block style={{ paddingTop: 16 }}>
              <View style={st.grid}>
                {GRID.map((id, i) => (
                  <Animated.View key={id} entering={FadeInDown.delay(i * 30).duration(260)}>
                    <ServiceTile s={svc(id)} width={tileW} />
                  </Animated.View>
                ))}
              </View>
            </Block>

            <Block style={{ paddingTop: 16 }}>
              <BannerCarousel />
            </Block>

            <Block title="Most booked services">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={162} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                {MOST_BOOKED.map(id => <ServiceCard key={id} s={svc(id)} />)}
              </ScrollView>
            </Block>

            <View style={st.promise}>
              <Text style={st.promiseH}>The Zyphix promise</Text>
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                {PROMISES.map(p => (
                  <View key={p.t} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                    <View style={st.promiseIcon}><Ico name={p.icon} size={20} color={C.green} /></View>
                    <Text style={st.promiseTxt}>{p.t}</Text>
                  </View>
                ))}
              </View>
            </View>

            {SECTIONS.map(sec => (
              <Block key={sec.title} title={sec.title} sub={sec.sub}>
                {sec.ids.length === 1 ? <WideServiceCard s={svc(sec.ids[0]!)} /> : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                    {sec.ids.map(id => <ServiceCard key={id} s={svc(id)} width={196} ratio={4 / 3} />)}
                  </ScrollView>
                )}
              </Block>
            ))}

            <Block title="How it works">
              <View style={{ paddingHorizontal: 16, gap: 14 }}>
                {STEPS.map((s, i) => (
                  <View key={s.t} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View style={st.stepIcon}><Ico name={s.icon} size={18} color={K.ink} /><View style={st.stepNum}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{i + 1}</Text></View></View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14.5, fontWeight: '800', color: K.ink }}>{s.t}</Text>
                      <Text style={{ fontSize: 12.5, color: K.meta, marginTop: 1 }}>{s.d}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Block>

            {(pros.data?.length ?? 0) > 0 ? (
              <Block title="Pros near you" sub="Recently joined on Zyphix">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                  {pros.data!.map(p => (
                    <View key={p.id} style={st.pro}>
                      <Avatar name={p.name} size={48} />
                      <Text style={{ fontSize: 14, fontWeight: '800', color: K.ink, marginTop: 8 }} numberOfLines={1}>{p.name}</Text>
                      <Text style={{ fontSize: 12, color: K.meta }} numberOfLines={1}>{p.category || 'Home services'}</Text>
                      {(p.locality || p.city) ? <Text style={{ fontSize: 12, color: '#9CA3AF' }} numberOfLines={1}>{p.locality || p.city}</Text> : null}
                    </View>
                  ))}
                </ScrollView>
              </Block>
            ) : null}

            <Text style={st.footer}>Zyphix Book · The SuperLocal app · v{version}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  top: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 4 },
  pin: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 11, fontWeight: '900', color: C.green, letterSpacing: 1.2 },
  sticky: { backgroundColor: '#fff', paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: K.line },
  search: { marginHorizontal: 16, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#DDE1E7', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontSize: 15, color: K.ink, height: '100%', fontWeight: '500', ...noOutline },
  block: { backgroundColor: '#fff', paddingTop: 20, paddingBottom: 20, marginBottom: 8 },
  h: { fontSize: 19, fontWeight: '900', color: K.ink, letterSpacing: -0.4 },
  sub: { fontSize: 12.5, color: K.meta, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 10, paddingHorizontal: 16 },
  promise: { backgroundColor: '#ECFAF3', paddingVertical: 18, paddingHorizontal: 12, marginBottom: 8 },
  promiseH: { fontSize: 13, fontWeight: '900', color: C.greenDeep, letterSpacing: 0.8, textAlign: 'center', textTransform: 'uppercase' },
  promiseIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  promiseTxt: { fontSize: 12, lineHeight: 15, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  stepIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  stepNum: { position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: 9, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  pro: { width: 148, borderRadius: 14, borderWidth: 1, borderColor: K.line, padding: 12, backgroundColor: '#fff' },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  resRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: K.line },
  resImg: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#E5E9F0' },
  footer: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 16 },
});
