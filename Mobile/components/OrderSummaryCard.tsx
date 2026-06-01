import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { CustomButton } from './CustomButton';

interface OrderSummaryCardProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  onCheckoutPress: () => void;
  ctaLabel?: string;
}

export function OrderSummaryCard({
  subtotal,
  discount,
  deliveryFee,
  onCheckoutPress,
  ctaLabel = 'Proceed to Checkout',
}: OrderSummaryCardProps) {
  const finalTotal = subtotal + deliveryFee - discount;

  return (
    <View className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
      <Text className="text-lg font-bold text-card-foreground mb-4">Order Summary</Text>
      
      <View className="gap-y-3 mb-5">
        <View className="flex-row justify-between">
          <Text className="text-sm font-medium text-muted-foreground">Subtotal</Text>
          <Text className="text-sm font-semibold text-card-foreground">{subtotal} ETB</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-sm font-medium text-muted-foreground">Discount</Text>
          <Text className="text-sm font-semibold text-success">-{discount} ETB</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-sm font-medium text-muted-foreground">Delivery Fee</Text>
          <Text className="text-sm font-semibold text-card-foreground">{deliveryFee} ETB</Text>
        </View>
        
        <View className="h-[1px] bg-border my-1" />
        
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-card-foreground">Total Amount</Text>
          <Text className="text-xl font-black text-primary">{finalTotal} ETB</Text>
        </View>
      </View>

      <CustomButton label={ctaLabel} onPress={onCheckoutPress} />
    </View>
  );
}