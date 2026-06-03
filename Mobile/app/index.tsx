// app/index.tsx
import { Redirect } from 'expo-router';

export default function IndexEntry() {
  // Production enhancement: If you have an authenticated session token saved 
  // in secure storage later, you can intercept it here and bypass onboarding.
  return <Redirect href="/splash" />;
}