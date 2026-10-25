import { Platform } from 'react-native';

/** Zyphix design tokens — same brand as zyphix.in (green #0DA366, ink #05080E). */
export const C = {
  green: '#0DA366',
  greenDeep: '#077A46',
  greenSoft: '#E7F7EF',
  mint: '#34D399',
  ink: '#05080E',
  ink2: '#0B1220',
  text: '#0B0F19',
  text2: '#4B5563',
  text3: '#9CA3AF',
  line: '#E6E8EC',
  bg: '#FFFFFF',
  bgSoft: '#F6F7F9',
  red: '#DC2626',
  amber: '#F59E0B',
  white: '#FFFFFF',
} as const;

export const R = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;
export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, x3: 32, x4: 40 } as const;

/** Type scale (system font: SF Pro on iOS, Roboto on Android). */
export const T = {
  display: { fontSize: 34, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -1 },
  h1: { fontSize: 28, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.6 },
  h2: { fontSize: 22, lineHeight: 26, fontWeight: '700' as const, letterSpacing: -0.4 },
  h3: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: '600' as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  tiny: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const, letterSpacing: 0.4 },
  /** Serif italic accent, like the website headlines. */
  accent: { fontFamily: Platform.select({ ios: 'Georgia-Italic', default: 'serif' }), fontStyle: 'italic' as const, fontWeight: '400' as const },
} as const;

export const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  default: { elevation: 3 },
});

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
