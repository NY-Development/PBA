// components/features/auth/LandingView.tsx
import React from 'react';
import { View, Image, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartHandshake, Users, ShieldCheck, ArrowRight, Activity } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

export function LandingView() {
  const router = useRouter();

  return (
    <ScrollView 
      className="flex-1 bg-background"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Visual Block */}
      <View className="relative w-full h-[45vh] bg-secondary">
        <Image 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDid7SkpQE0Fo3iWkbdkWu70L99GX77uB9t4HpOM87HdRTpGjlJrlIu7syRnDf5EhSZGrZ3SOC6I4HlY3aV2o7lJprTw7hqMm09x5LgUeHRoEu7qb42QAGnj09ADj0mHnNRY8Ev1UXN-zI2HQCGw3tk97w3Yo62V2Z4xdFxqtW8FHpMxiM8c7hZULw4yTtK1dgoQ00jGjl-7OM7lFJp6suuzKV5nbb8SEM4AxbnSEELd5RGdjrqWbMaz6uhDsLr072j6MFqygzopC8X' }}
          className="w-full h-full object-cover opacity-90"
        />
        {/* Soft Linear Contrast Protector */}
        <View className="absolute inset-0 bg-black/10" />

        {/* Brand Watermark Overlay */}
        <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
          <View className="flex-row items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Activity size={18} color="#e7931d" strokeWidth={3} />
            <Text className="font-black text-base tracking-tight text-white">
              NutriButter
            </Text>
          </View>
        </View>
      </View>

      {/* Overlapping Content Board Sheet */}
      <View className="flex-1 -mt-8 bg-background rounded-t-[2rem] px-6 pt-8 pb-8 shadow-2xl">
        {/* Hero Title Core Header */}
        <View className="flex-col gap-2 mb-8">
          <Text className="text-3xl font-black leading-tight tracking-tight text-foreground">
            Authentic Peanut Butter,{' '}
            <Text className="text-primary font-black">Community Prices</Text>
          </Text>
          <Text className="text-muted-foreground text-base font-medium leading-normal mt-1">
            Straight from Ethiopian producers to your table.
          </Text>
        </View>

        {/* Feature Value Matrix List */}
        <View className="flex-col gap-5 mb-8">
          
          {/* Proposition Row 1 */}
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
              <HeartHandshake size={22} className="text-primary" />
            </View>
            <View className="flex-1 flex-col">
              <Text className="text-sm font-bold text-foreground leading-tight">
                Support Local Makers
              </Text>
              <Text className="text-xs text-muted-foreground font-normal mt-0.5">
                Directly impact local livelihoods
              </Text>
            </View>
          </View>

          {/* Proposition Row 2 */}
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
              <Users size={22} className="text-primary" />
            </View>
            <View className="flex-1 flex-col">
              <Text className="text-sm font-bold text-foreground leading-tight">
                Save with Neighbors
              </Text>
              <Text className="text-xs text-muted-foreground font-normal mt-0.5">
                Group buying power for lower prices
              </Text>
            </View>
          </View>

          {/* Proposition Row 3 */}
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
              <ShieldCheck size={22} className="text-primary" />
            </View>
            <View className="flex-1 flex-col">
              <Text className="text-sm font-bold text-foreground leading-tight">
                Verified Quality
              </Text>
              <Text className="text-xs text-muted-foreground font-normal mt-0.5">
                Tested for safety and authentic taste
              </Text>
            </View>
          </View>

        </View>

        {/* Persistent Functional Interventions Layer */}
        <View className="flex-col gap-4 mt-auto">
          <Pressable 
            onPress={() => router.push('/(auth)/sign-up')}
            className="flex-row w-full items-center justify-center rounded-xl h-14 bg-primary shadow-lg shadow-primary/20 active:opacity-90 active:scale-[0.99] transition-transform"
          >
            <Text className="text-white text-base font-bold tracking-wide text-center">
              Get Started
            </Text>
            <View className="absolute right-6">
              <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />
            </View>
          </Pressable>

          <View className="flex-row items-center justify-center gap-1.5 py-2">
            <Text className="text-muted-foreground text-sm font-medium">
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/sign-in')}>
              <Text className="text-primary font-bold text-sm underline">
                Log In
              </Text>
            </Pressable>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}