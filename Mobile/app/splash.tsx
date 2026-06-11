import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SplashLogoView } from '@/components/features/auth/SplashLogoView';
import { useAuthStore } from '@/src/stores/useAuthStore';

export default function SplashPage() {
  const router = useRouter();

  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Wait for splash animation then redirect based on auth state
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (user?.role === 'maker' || user?.role === 'seller') {
          router.replace('/(seller)/home');
        } else {
          router.replace('/(main)/home');
        }
      } else {
        router.replace('/(auth)/landing');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return <SplashLogoView />;
}