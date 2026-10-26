import React, { useEffect, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { C } from '@/lib/theme';

/**
 * Web preview of the Zyphix app. On a phone-sized browser it fills the screen;
 * on a laptop it shows the app inside a phone frame with a short note beside it.
 */
export default function WebFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || width < 760) return <View style={{ flex: 1, height: '100%' as any }}>{children}</View>;

  const h = Math.min(860, height - 48);
  const w = Math.round(h * 0.47);
  return (
    <View style={{ flex: 1, minHeight: '100%' as any, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 64, padding: 24 }}>
      <View style={{ maxWidth: 380, display: width < 1100 ? 'none' : 'flex' }}>
        <Text style={{ color: C.mint, fontSize: 12, fontWeight: '700', letterSpacing: 1.6 }}>ZYPHIX APP · PREVIEW</Text>
        <Text style={{ color: C.white, fontSize: 44, lineHeight: 48, fontWeight: '700', letterSpacing: -1.5, marginTop: 14 }}>
          The SuperLocal app, <Text style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontWeight: '400', color: C.mint }}>in your browser</Text>.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, lineHeight: 24, marginTop: 16 }}>
          This is the same app that ships to Android and iPhone — live catalogue, carts, checkout, Eats, Book and your account. Click around exactly as you would tap on a phone.
        </Text>
      </View>
      <View style={{ width: w + 24, height: h + 24, borderRadius: 54, backgroundColor: '#111', padding: 12, shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 60, shadowOffset: { width: 0, height: 30 } }}>
        <View style={{ flex: 1, borderRadius: 42, overflow: 'hidden', backgroundColor: C.bg, transform: [{ translateZ: 0 } as any] }}>
          {children}
        </View>
      </View>
    </View>
  );
}
