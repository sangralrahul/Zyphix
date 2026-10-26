import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

import { C, S } from '@/lib/theme';

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

/** Removes the browser focus ring on text inputs in the web preview (no effect on iOS / Android). */
export const noOutline = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as object;

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

/** Settings-style row (Blinkit / Zomato profile): icon in a soft circle, title, optional subtitle, chevron. */
export function Row({ title, subtitle, onPress, danger, right, last, icon }: { title: string; subtitle?: string; onPress?: () => void; danger?: boolean; right?: React.ReactNode; last?: boolean; icon?: IconName }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [k.row, pressed && { backgroundColor: '#F6F7F9' }]}>
      {icon ? <View style={[k.rowIcon, danger && { backgroundColor: '#FEF2F2' }]}><Ionicons name={icon} size={18} color={danger ? C.red : '#374151'} /></View> : null}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: danger ? C.red : '#111827' }}>{title}</Text>
        {subtitle ? <Text style={{ fontSize: 12.5, color: '#6B7280', marginTop: 1 }} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right ?? (danger ? null : <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />)}
      {!last && <View style={[k.sep, icon && { left: S.lg + 48 }]} />}
    </Pressable>
  );
}

export function Group({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: S.xl }}>
      {title ? <Text style={k.groupTitle}>{title.toUpperCase()}</Text> : null}
      <View style={k.group}>{children}</View>
    </View>
  );
}

/** Labelled text field. */
export function Field({ label, error, style, ...rest }: TextInputProps & { label: string; error?: string | null; style?: StyleProp<ViewStyle> }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#4B5563' }}>{label}</Text>
      <TextInput placeholderTextColor="#9CA3AF" {...rest}
        onFocus={e => { setFocus(true); rest.onFocus?.(e); }} onBlur={e => { setFocus(false); rest.onBlur?.(e); }}
        style={[k.input, focus && { borderColor: C.green, backgroundColor: '#fff' }, rest.editable === false && { backgroundColor: '#F3F5F9', color: '#6B7280' }, !!error && { borderColor: C.red }, rest.multiline && { height: 88, paddingTop: 12, textAlignVertical: 'top' }]} />
      {error ? <Text style={{ fontSize: 12.5, color: C.red, fontWeight: '600' }}>{error}</Text> : null}
    </View>
  );
}

export const k = StyleSheet.create({
  row: { minHeight: 56, paddingHorizontal: S.lg, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  chev: { fontSize: 22, color: C.text3, marginTop: -2 },
  sep: { position: 'absolute', left: S.lg, right: 0, bottom: 0, height: StyleSheet.hairlineWidth, backgroundColor: '#E5E8ED' },
  group: { marginHorizontal: S.lg, backgroundColor: C.bg, borderRadius: 16, borderWidth: 1, borderColor: '#E8EBF0', overflow: 'hidden' },
  groupTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#6B7280', marginHorizontal: S.xl, marginBottom: 8 },
  input: { height: 50, borderRadius: 12, borderWidth: 1.5, borderColor: '#E1E4EA', paddingHorizontal: 14, fontSize: 16, color: C.text, backgroundColor: '#FAFBFC', ...noOutline },
});

/** Friendly empty / signed-out state with an icon in a soft green circle. */
export function EmptyState({ icon, title, body, action, onAction }: { icon: IconName; title: string; body?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 28 }}>
      <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: '#E7F7EF', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Ionicons name={icon} size={36} color={C.green} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '900', color: '#0B0F19', textAlign: 'center', letterSpacing: -0.3 }}>{title}</Text>
      {body ? <Text style={{ fontSize: 14, lineHeight: 20, color: '#6B7280', textAlign: 'center', marginTop: 6 }}>{body}</Text> : null}
      {action && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" style={({ pressed }) => ({ marginTop: 18, height: 48, paddingHorizontal: 28, borderRadius: 14, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const addrIcon = (label?: string): IconName => /work|office/i.test(label ?? '') ? 'briefcase' : /home/i.test(label ?? '') ? 'home' : 'location';
