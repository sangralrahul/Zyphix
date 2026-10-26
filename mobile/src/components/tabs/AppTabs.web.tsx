import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useCart } from '@/lib/cart';
import { C } from '@/lib/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const icon = (on: IconName, off: IconName) => ({ color, focused }: { color: unknown; focused: boolean }) => <Ionicons name={focused ? on : off} size={23} color={String(color)} />;

/** Web preview of the app: same five tabs, rendered as a bottom tab bar like on a phone. */
export default function AppTabs() {
  const cart = useCart();
  const badge = (n: number) => (n > 0 ? Math.min(n, 99) : undefined);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.green,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { height: 64, paddingTop: 6, paddingBottom: 8, borderTopColor: C.line, backgroundColor: 'rgba(255,255,255,0.97)' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarBadgeStyle: { backgroundColor: C.green, fontSize: 10 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen name="now" options={{ title: 'Now', tabBarIcon: icon('basket', 'basket-outline'), tabBarBadge: badge(cart.count('now')) }} />
      <Tabs.Screen name="eats" options={{ title: 'Eats', tabBarIcon: icon('restaurant', 'restaurant-outline'), tabBarBadge: badge(cart.count('eats')) }} />
      <Tabs.Screen name="book" options={{ title: 'Book', tabBarIcon: icon('construct', 'construct-outline') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: icon('person-circle', 'person-circle-outline') }} />
    </Tabs>
  );
}
