import { SymbolView, type SFSymbol } from 'expo-symbols';
import React from 'react';
import { View } from 'react-native';

import { C } from '@/lib/theme';
import { InitialIcon } from './InitialIcon';

/** iOS: the service's SF Symbol on a soft tile. */
export function ServiceIcon({ sf, title, size = 36 }: { sf: string; title: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
      <SymbolView name={sf as SFSymbol} size={size * 0.55} tintColor={C.greenDeep} weight="semibold" fallback={<InitialIcon title={title} size={size} />} />
    </View>
  );
}
