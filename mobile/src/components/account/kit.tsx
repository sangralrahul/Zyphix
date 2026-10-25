import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, R, S, T } from '@/lib/theme';

/** Two-button confirm that also works on web (RN-web's Alert is a no-op). */
export function confirm(title: string, message: string, ok: string, onOk: () => void, destructive = false) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: ok, style: destructive ? 'destructive' : 'default', onPress: onOk },
  ]);
}

/** Bottom offset for floating bars on tab screens (iOS tab bar overlays content; Android's sits outside it). */
export function useTabBottom() {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'ios' ? insets.bottom + 60 : 12;
}

/** Light status bar while a screen with a dark hero is focused. */
export function useLightStatusBar() {
  useFocusEffect(useCallback(() => {
    setStatusBarStyle('light', true);
    return () => setStatusBarStyle('dark', true);
  }, []));
}

export function openLink(url: string) {
  WebBrowser.openBrowserAsync(url, { controlsColor: C.green, toolbarColor: C.bg }).catch(() => {});
}

export const initials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || 'Z';

/** Coloured initials tile (no photo available). Colour is stable per name. */
const TINTS = ['#0DA366', '#2563EB', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#059669', '#DC2626'];
export function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length]!;
}

export function Avatar({ name, size = 48, radius, style }: { name: string; size?: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const tint = tintFor(name || 'Z');
  return (
    <View style={[{ width: size, height: size, borderRadius: radius ?? size / 2, backgroundColor: `${tint}1F`, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Text style={{ color: tint, fontWeight: '800', fontSize: size * 0.38 }}>{initials(name)}</Text>
    </View>
  );
}

/** Settings-style row. */
export function Row({ title, subtitle, onPress, danger, right, last }: { title: string; subtitle?: string; onPress?: () => void; danger?: boolean; right?: React.ReactNode; last?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [k.row, pressed && { backgroundColor: C.bgSoft }]}>
      <View style={{ flex: 1 }}>
        <Text style={[T.body, { fontWeight: '500', color: danger ? C.red : C.text }]}>{title}</Text>
        {subtitle ? <Text style={[T.small, { color: C.text2 }]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right ?? (danger ? null : <Text style={k.chev}>›</Text>)}
      {!last && <View style={k.sep} />}
    </Pressable>
  );
}

export function Group({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: S.xxl }}>
      {title ? <Text style={[T.tiny, k.groupTitle]}>{title.toUpperCase()}</Text> : null}
      <View style={k.group}>{children}</View>
    </View>
  );
}

/** Labelled text field. */
export function Field({ label, error, style, ...rest }: TextInputProps & { label: string; error?: string | null; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={[T.small, { fontWeight: '600', color: C.text2 }]}>{label}</Text>
      <TextInput placeholderTextColor={C.text3} {...rest}
        style={[k.input, rest.editable === false && { backgroundColor: C.bgSoft, color: C.text2 }, !!error && { borderColor: C.red }, rest.multiline && { height: 88, paddingTop: 12, textAlignVertical: 'top' }]} />
      {error ? <Text style={[T.small, { color: C.red }]}>{error}</Text> : null}
    </View>
  );
}

export const k = StyleSheet.create({
  row: { minHeight: 56, paddingHorizontal: S.lg, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  chev: { fontSize: 22, color: C.text3, marginTop: -2 },
  sep: { position: 'absolute', left: S.lg, right: 0, bottom: 0, height: StyleSheet.hairlineWidth, backgroundColor: C.line },
  group: { marginHorizontal: S.lg, backgroundColor: C.bg, borderRadius: R.md, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, overflow: 'hidden' },
  groupTitle: { color: C.text3, marginHorizontal: S.xl, marginBottom: 8 },
  input: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, fontSize: 16, color: C.text, backgroundColor: C.bg },
});
