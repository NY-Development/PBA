import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { queryClient } from '@/src/config/queryClient';
import { useAuthStore } from '@/src/stores/useAuthStore';

// 🌟 Import your reusable Push Notification Context Manager 
import PushNotificationManager from '@/components/providers/PushNotificationManager';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const stabilityConfig = {
  initialRouteName: 'splash',
};

export default function RootLayout() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const segments = useSegments();
  const [authBootstrapped, setAuthBootstrapped] = useState(false);

  const currentGroup = (segments?.[0] as string) || '';
  const isProtectedGroup =
    currentGroup === '(main)' ||
    currentGroup === '(seller)';

  // Protected route guard: if no token, send user to login (except public routes).
  useEffect(() => {
    if (!authBootstrapped) return;
    if (!isAuthenticated && isProtectedGroup) {
      AsyncStorage.setItem('lastRoute', pathname || '/(auth)/landing').catch(() => {});
      router.replace('/(auth)/sign-in');
    }
  }, [authBootstrapped, isAuthenticated, isProtectedGroup, pathname, router]);

  // Persist last visited route (so splash can "resume" on reload).
  useEffect(() => {
    if (!authBootstrapped) return;
    if (!isAuthenticated) return;
    if (!pathname) return;
    if (!isProtectedGroup) return;
    AsyncStorage.setItem('lastRoute', pathname).catch(() => {});
  }, [authBootstrapped, isAuthenticated, pathname, isProtectedGroup]);

  useEffect(() => {
    (async () => {
      // Rehydrate logic check runs automatically via Zustand.
      // We explicitly check secure chip storage to clear initial loader indicators.
      const hasToken = await SecureStore.getItemAsync('token');
      setAuthBootstrapped(true);
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        {/* 🌟 Wrapped here so application deep-links fire inside a safe routing context */}
        {/* <PushNotificationManager> */}
          <View key={colorScheme} className="flex-1 bg-background relative">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            
            {/* Structural Application Router Core Grid */}
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade_from_bottom',
              }}
            >
              <Stack.Screen name="splash" options={{ animation: 'fade' }} />
              <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(main)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(seller)" options={{ gestureEnabled: true }} />
              <Stack.Screen 
                name="modals" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom' 
                }} 
              />
            </Stack>

            {/* Primitives Portal layer for dropdowns, tooltips, etc */}
            <PortalHost />

            {/* 🌟 GLOBAL INTERACTIVE THEME CONTROLLER OVERLAY */}
            <View 
              pointerEvents="box-none" 
              className="absolute top-12 right-6 z-[999] flex-row justify-end items-center"
            >
              <Pressable 
                onPress={toggleColorScheme}
                className="h-11 w-11 rounded-full bg-card/90 border border-border items-center justify-center shadow-md active:scale-95 transition-transform backdrop-blur-md"
              >
                {colorScheme === 'dark' ? (
                  <Sun size={20} color="#ec7f13" strokeWidth={2.5} />
                ) : (
                  <Moon size={20} color="#4B3621" strokeWidth={2.5} />
                )}
              </Pressable>
            </View>
          </View>
        {/* </PushNotificationManager> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}