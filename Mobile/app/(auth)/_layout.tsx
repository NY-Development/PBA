import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" options={{ animation: 'fade' }} />
      <Stack.Screen name="landing" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="recovery" />
      <Stack.Screen name="sign-in-biometric" />
    </Stack>
  );
}