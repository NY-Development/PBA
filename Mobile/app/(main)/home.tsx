import React from 'react';
import { View} from 'react-native';
import { Text } from '@/components/ui/text';

export default function MainHomeScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground text-lg font-semibold">Home</Text>
    </View>
  );
}
