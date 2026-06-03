import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import '@/global.css'; // Direct path to your global Tailwind CSS sheet

export const withTailwind = (StoryFn: React.ComponentType) => {
  // Access the current color scheme context to force NativeWind to re-evaluate styles on switch
  const { colorScheme } = useColorScheme();

  return (
    <View 
      key={colorScheme} 
      style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' }}
    >
      <StoryFn />
    </View>
  );
};