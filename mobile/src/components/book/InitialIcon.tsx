import React from 'react';
import { Text, View } from 'react-native';

import { tintFor } from '@/components/account/kit';

export function InitialIcon({ title, size = 36 }: { title: string; size?: number }) {
  const tint = tintFor(title);
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: size * 0.3, backgroundColor: `${tint}22` }} />
      <Text style={{ color: tint, fontWeight: '800', fontSize: size * 0.45 }}>{title.trim()[0]?.toUpperCase() ?? '•'}</Text>
    </View>
  );
}
