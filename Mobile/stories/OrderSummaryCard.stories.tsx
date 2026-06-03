import React from 'react';
import { View } from 'react-native';
import { OrderSummaryCard } from '@/components/common/OrderSummaryCard';

export default {
  title: 'Components/OrderSummaryCard',
  component: OrderSummaryCard,
  decorators: [(Story: any) => <View className="p-4 bg-muted flex-1 justify-center">{Story()}</View>],
};

export const ActiveCheckoutCalculations = {
  args: {
    subtotal: 1400,
    discount: 150,
    deliveryFee: 100,
    onCheckoutPress: () => console.log('Navigating to gateway...'),
    ctaLabel: 'Confirm & Pay Now',
  },
};