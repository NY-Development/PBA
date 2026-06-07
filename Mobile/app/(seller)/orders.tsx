import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function SellerOrdersScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground text-lg font-semibold">Orders</Text>
    </View>
  );
}
