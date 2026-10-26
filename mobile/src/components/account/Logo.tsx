import React from 'react';
import { View } from 'react-native';

import { C } from '@/lib/theme';

/** Zyphix mark: green rounded square with two slanted white bars ("//"). */
export function Logo({ size = 56, ring }: { size?: number; ring?: boolean }) {
  const bw = size * 0.13, bh = size * 0.56;
  return (
    <View style={[{ width: size, height: size, borderRadius: size * 0.28, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: size * 0.1 }, ring && { borderWidth: 3, borderColor: '#fff' }]}>
      <View style={{ width: bw, height: bh, borderRadius: bw / 2, backgroundColor: '#fff', transform: [{ skewX: '-20deg' }] }} />
      <View style={{ width: bw, height: bh, borderRadius: bw / 2, backgroundColor: '#fff', transform: [{ skewX: '-20deg' }] }} />
    </View>
  );
}

