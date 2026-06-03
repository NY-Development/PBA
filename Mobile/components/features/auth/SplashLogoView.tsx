// components/features/auth/SplashLogoView.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Globe } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

export function SplashLogoView() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Clean native implementation of the CSS 'pulse-slow' animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [scaleAnim]);

  return (
    <View className="flex-1 bg-background justify-between items-center px-6 pt-12 pb-12">
      {/* Structural Spacer for Vertical Balance */}
      <View className="h-4" />

      {/* Main Content Node */}
      <Animated.View 
        style={{ transform: [{ scale: scaleAnim }] }} 
        className="items-center gap-6"
      >
        {/* Custom SVG Peanut Design Canvas */}
        <View className="w-32 h-48 justify-center items-center shadow-2xl">
          <Svg width="100%" height="100%" viewBox="0 0 100 160">
            {/* Organic Stylized Peanut Shell Body */}
            <Path 
              d="M50 150 C 20 150, 10 120, 10 100 C 10 85, 25 75, 35 70 C 25 65, 15 50, 15 35 C 15 15, 30 5, 50 5 C 70 5, 85 15, 85 35 C 85 50, 75 65, 65 70 C 75 75, 90 85, 90 100 C 90 120, 80 150, 50 150 Z" 
              fill="#d47311" 
            />
            {/* Integrated Internal Heart Core Cutout */}
            <Path 
              d="M50 125 C 50 125, 30 110, 30 95 C 30 85, 38 80, 45 80 C 48 80, 50 82, 50 82 C 50 82, 52 80, 55 80 C 62 80, 70 85, 70 95 C 70 110, 50 125, 50 125 Z" 
              fill="#f8f7f6" 
            />
          </Svg>
        </View>

        {/* Text Stack Hierarchy */}
        <View className="items-center gap-1.5 text-center">
          <Text className="text-foreground tracking-tight text-3xl font-extrabold text-center">
            Peanut Community
          </Text>
          <Text className="text-sm text-muted-foreground font-medium text-center">
            Roasted with love
          </Text>
        </View>
      </Animated.View>

      {/* Bottom Production Footprint Badge */}
      <View className="w-full justify-center items-center native:pb-6">
        <View className="flex-row h-10 items-center justify-center gap-x-2 rounded-full bg-card/80 border border-primary/20 shadow-sm pl-4 pr-5">
          <Globe size={18} className="text-primary" strokeWidth={2.5} />
          <Text className="text-foreground text-xs font-bold tracking-wider uppercase">
            Handmade in Ethiopia
          </Text>
        </View>
      </View>
    </View>
  );
}