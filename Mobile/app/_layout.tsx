// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { View, Pressable } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import '@/global.css';

export { ErrorBoundary } from 'expo-router';

export const stabilityConfig = {
  initialRouteName: 'splash',
};

export default function RootLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
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
  );
}