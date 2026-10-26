import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Group, Row, confirm, openLink, useTabBottom } from '@/components/account/kit';
import { Logo } from '@/components/account/Logo';
import { Ico, K, type IconName } from '@/components/kit';
import { Button, Tap } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { C } from '@/lib/theme';

const version = Constants.expoConfig?.version ?? '1.0.0';

function OtherInfo() {
  return (
    <Group title="Other information">
      <Row icon="help-buoy-outline" title="Help centre" subtitle="FAQs and support" onPress={() => openLink('https://support.zyphix.in')} />
      <Row icon="storefront-outline" title="Partner with Zyphix" subtitle="List your store, kitchen or services" onPress={() => openLink('https://partner.zyphix.in')} />
      <Row icon="document-text-outline" title="Terms of service" onPress={() => openLink('https://zyphix.in/terms')} />
      <Row icon="lock-closed-outline" title="Privacy policy" onPress={() => openLink('https://zyphix.in/privacy')} />
      <Row icon="information-circle-outline" title="About Zyphix" subtitle={`The SuperLocal app · v${version}`} onPress={() => openLink('https://zyphix.in/about')} last />
    </Group>
  );
}

function Footer() {
  return (
    <View style={{ alignItems: 'center', marginTop: 28, gap: 6 }}>
      <Logo size={34} />
      <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>Zyphix · The SuperLocal app · v{version}</Text>
    </View>
  );
}

function Quick({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <Tap onPress={onPress} style={st.quick} scale={0.96} accessibilityLabel={label}>
        <View style={st.quickIcon}><Ico name={icon} size={22} color={K.ink} /></View>
        <Text style={st.quickTxt}>{label}</Text>
      </Tap>
    </View>
  );
}

export default function Account() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBottom = useTabBottom();
  useFocusEffect(useCallback(() => { setStatusBarStyle('dark', true); }, []));
  const name = user ? user.name || user.email.split('@')[0]! : '';
  const initial = name.trim().charAt(0).toUpperCase() || 'Z';

  return (
    <ScrollView style={{ backgroundColor: K.page }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: tabBottom + 28 }} showsVerticalScrollIndicator={false}>
      <Text style={st.h1}>{user ? 'My account' : 'Account'}</Text>

      {user ? (
        <>
          <Animated.View entering={FadeInDown.duration(280)}>
            <Tap onPress={() => router.push('/profile')} style={st.card} scale={0.985} accessibilityLabel="Edit profile">
              <LinearGradient colors={['#0B9A5F', '#34D399']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.avatar}>
                <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900' }}>{initial}</Text>
              </LinearGradient>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={st.name} numberOfLines={1}>{user.name || 'Add your name'}</Text>
                <Text style={st.meta} numberOfLines={1}>{user.email}</Text>
                {user.phone ? <Text style={st.meta} numberOfLines={1}>{user.phone}</Text> : null}
              </View>
              <View style={st.edit}><Ico name="pencil" size={15} color={C.greenDeep} /></View>
            </Tap>
          </Animated.View>

          <View style={st.quickRow}>
            <Quick icon="bag-handle-outline" label="Your orders" onPress={() => router.push('/orders')} />
            <Quick icon="location-outline" label="Addresses" onPress={() => router.push('/addresses')} />
            <Quick icon="chatbubbles-outline" label="Help & support" onPress={() => openLink('https://support.zyphix.in')} />
          </View>

          <Group title="Your information">
            <Row icon="receipt-outline" title="Your orders" subtitle="Track, view details and get help" onPress={() => router.push('/orders')} />
            <Row icon="map-outline" title="Address book" subtitle="Home, work and more" onPress={() => router.push('/addresses')} />
            <Row icon="person-outline" title="Profile" subtitle="Name and phone number" onPress={() => router.push('/profile')} last />
          </Group>
        </>
      ) : (
        <>
          <Animated.View entering={FadeInDown.duration(280)} style={st.outCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={st.outIcon}><Ico name="person" size={26} color={C.green} /></View>
              <View style={{ flex: 1 }}>
                <Text style={st.name}>Your profile</Text>
                <Text style={st.meta}>Sign in to see your orders and saved addresses</Text>
              </View>
            </View>
            <Button title="Sign in" onPress={() => router.push('/sign-in')} style={{ marginTop: 16, height: 50, borderRadius: 14 }} />
            <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 10 }}>No password — we email you a 6-digit code.</Text>
          </Animated.View>
          <View style={st.quickRow}>
            <Quick icon="bag-handle-outline" label="Your orders" onPress={() => router.push('/sign-in')} />
            <Quick icon="location-outline" label="Addresses" onPress={() => router.push('/sign-in')} />
            <Quick icon="chatbubbles-outline" label="Help & support" onPress={() => openLink('https://support.zyphix.in')} />
          </View>
        </>
      )}
      <OtherInfo />
      {user ? (
        <Group>
          <Row icon="log-out-outline" title="Log out" danger last onPress={() => confirm('Log out?', 'You can sign back in any time with your email.', 'Log out', () => { signOut(); }, true)} />
        </Group>
      ) : null}
      <Footer />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: '900', color: K.ink, letterSpacing: -0.5, paddingHorizontal: 16, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, padding: 16, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: K.line },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '900', color: K.ink, letterSpacing: -0.3 },
  meta: { fontSize: 13, color: K.meta, marginTop: 1 },
  edit: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
  quickRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 12 },
  quick: { alignItems: 'center', gap: 8, paddingVertical: 14, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: K.line },
  quickIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  quickTxt: { fontSize: 12.5, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  outCard: { marginHorizontal: 16, padding: 16, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: K.line },
  outIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center' },
});
