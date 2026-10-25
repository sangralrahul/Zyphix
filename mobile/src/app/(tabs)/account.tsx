import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Group, Row, confirm, openLink, useLightStatusBar, useTabBottom } from '@/components/account/kit';
import { Button, VideoBg } from '@/components/ui';
import { CLIPS } from '@/data/media';
import { useAuth } from '@/lib/auth';
import { C, R, S, T, shadow } from '@/lib/theme';

const version = Constants.expoConfig?.version ?? '1.0.0';

function HelpRows() {
  return (
    <>
      <Group title="Help">
        <Row title="Help centre" subtitle="support.zyphix.in" onPress={() => openLink('https://support.zyphix.in')} />
        <Row title="Partner with Zyphix" subtitle="List your store, kitchen or services" onPress={() => openLink('https://partner.zyphix.in')} last />
      </Group>
      <Group title="Legal">
        <Row title="Terms of service" onPress={() => openLink('https://zyphix.in/terms')} />
        <Row title="Privacy policy" onPress={() => openLink('https://zyphix.in/privacy')} last />
      </Group>
    </>
  );
}

function Footer() {
  return <Text style={[T.small, { color: C.text3, textAlign: 'center', marginTop: S.x3 }]}>Zyphix · The SuperLocal app · v{version}</Text>;
}

function SignedOut() {
  useLightStatusBar();
  const insets = useSafeAreaInsets();
  const tabBottom = useTabBottom();
  return (
    <ScrollView style={{ backgroundColor: C.bgSoft }} contentContainerStyle={{ paddingBottom: tabBottom + 24 }} showsVerticalScrollIndicator={false}>
      <View style={[st.hero, { paddingTop: insets.top + 80 }]}>
        <VideoBg clip={CLIPS.nightCity} dim={0.3} />
        <LinearGradient colors={['rgba(5,8,14,.3)', 'rgba(5,8,14,.9)']} style={StyleSheet.absoluteFill} />
        <Text style={st.kicker}>YOUR ACCOUNT</Text>
        <Text style={[T.display, { color: C.white }]}>
          One account for <Text style={[T.accent, { color: C.mint }]}>everything</Text> nearby.
        </Text>
        <Text style={[T.body, { color: 'rgba(255,255,255,.8)', marginTop: 10 }]}>Groceries, food and home services — track every order and keep your addresses in one place.</Text>
        <Button title="Sign in with email" onPress={() => router.push('/sign-in')} style={{ marginTop: S.xxl }} />
        <Text style={[T.small, { color: 'rgba(255,255,255,.6)', marginTop: 10, textAlign: 'center' }]}>No password — we email you a 6-digit code.</Text>
      </View>
      <HelpRows />
      <Footer />
    </ScrollView>
  );
}

export default function Account() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBottom = useTabBottom();
  if (!user) return <SignedOut />;
  const name = user.name || user.email.split('@')[0]!;

  return (
    <ScrollView style={{ backgroundColor: C.bgSoft }} contentContainerStyle={{ paddingTop: insets.top + S.lg, paddingBottom: tabBottom + 24 }} showsVerticalScrollIndicator={false}>
      <Text style={[T.h1, { paddingHorizontal: S.xl }]}>Account</Text>
      <Animated.View entering={FadeInDown.duration(300)} style={st.card}>
        <Avatar name={name} size={60} />
        <View style={{ flex: 1 }}>
          <Text style={T.h2} numberOfLines={1}>{user.name || 'Add your name'}</Text>
          <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{user.email}</Text>
          {user.phone ? <Text style={[T.small, { color: C.text2 }]}>{user.phone}</Text> : null}
        </View>
        <Text onPress={() => router.push('/profile')} style={[T.bodyStrong, { color: C.green }]} accessibilityRole="button">Edit</Text>
      </Animated.View>

      <Group>
        <Row title="Your orders" subtitle="Track orders and get help" onPress={() => router.push('/orders')} />
        <Row title="Saved addresses" onPress={() => router.push('/addresses')} />
        <Row title="Profile" subtitle="Name and phone" onPress={() => router.push('/profile')} last />
      </Group>
      <HelpRows />
      <Group>
        <Row title="Sign out" danger last onPress={() => confirm('Sign out?', 'You can sign back in any time with your email.', 'Sign out', () => { signOut(); }, true)} />
      </Group>
      <Footer />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: C.ink, paddingHorizontal: S.xl, paddingBottom: S.x3, overflow: 'hidden', borderBottomLeftRadius: R.xl, borderBottomRightRadius: R.xl },
  kicker: { color: C.mint, fontWeight: '800', fontSize: 12, letterSpacing: 1.6, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: S.lg, marginTop: S.lg, padding: S.lg, backgroundColor: C.bg, borderRadius: R.lg, ...shadow },
});
