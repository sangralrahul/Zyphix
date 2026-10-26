import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WebFrame from '@/components/WebFrame';
import { AuthProvider, useAuth } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { C } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60_000, gcTime: 30 * 60_000, retry: 1 } },
});

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: C.green, background: C.bg, card: C.bg, text: C.text, border: C.line } };

function Root() {
  const { ready } = useAuth();
  useEffect(() => { if (ready) SplashScreen.hideAsync().catch(() => {}); }, [ready]);
  return (
    <Stack screenOptions={{ headerTintColor: C.text, headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal', contentStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: '', headerTransparent: true }} />
      <Stack.Screen name="category/[name]" options={{ title: '' }} />
      <Stack.Screen name="search" options={{ title: 'Search', animation: 'fade' }} />
      <Stack.Screen name="restaurant/[id]" options={{ title: '', headerTransparent: true }} />
      <Stack.Screen name="service/[id]" options={{ title: '', headerTransparent: true }} />
      <Stack.Screen name="cart" options={{ title: 'Your cart', presentation: 'modal' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
      <Stack.Screen name="order/[id]" options={{ title: 'Order', headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="orders" options={{ title: 'Your orders' }} />
      <Stack.Screen name="addresses" options={{ title: 'Saved addresses' }} />
      <Stack.Screen name="address-edit" options={{ title: 'Address', presentation: 'modal' }} />
      <Stack.Screen name="sign-in" options={{ title: '', presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <ThemeProvider value={theme}>
                <StatusBar style="auto" />
                <WebFrame>
                  <Root />
                </WebFrame>
              </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
