// app/splash.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SplashLogoView } from '@/components/features/auth/SplashLogoView';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Standard production gate: simulate a splash hold before moving to onboarding
    const timer = setTimeout(() => {
      router.replace('/(auth)/landing');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <SplashLogoView />;
}