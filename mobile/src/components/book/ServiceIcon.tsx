import React from 'react';

import { InitialIcon } from './InitialIcon';

/**
 * Android & web: a coloured initial tile. expo-symbols only renders Material Symbols on Android
 * (SF names fall back), and importing it would bundle the Material Symbols font — not worth it here.
 */
export function ServiceIcon({ title, size = 36 }: { sf: string; title: string; size?: number }) {
  return <InitialIcon title={title} size={size} />;
}
