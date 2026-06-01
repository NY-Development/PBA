import React from 'react';
import { View } from 'react-native';
import { CartCard } from '@/components/CartCard';

export default {
  title: 'Components/CartCard',
  component: CartCard,
  decorators: [(Story: any) => <View className="p-4 bg-background flex-1 justify-center">{Story()}</View>],
};

export const SingleItemInCart = {
  args: {
    imageUri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    name: 'Spicy Honey Peanut Butter',
    price: 350,
    quantity: 2,
    onIncrement: () => console.log('Plus Clicked'),
    onDecrement: () => console.log('Minus Clicked'),
    onRemove: () => console.log('Remove Clicked'),
  },
};