import React from 'react';
import { View } from 'react-native';
import { ProductCard } from '@/components/common/ProductCard';

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
  decorators: [
    (Story: any) => (
      <View className="p-4 bg-background flex-1 flex-row flex-wrap justify-between">
        <Story />
      </View>
    ),
  ],
};

export const Standard = {
  args: {
    imageUri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    name: 'Pure Smooth Tradition',
    price: 300,
    sellerName: 'Almaz Kebede',
  },
};

export const WithDiscountAndLiked = {
  args: {
    imageUri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    name: 'Spicy Honey Peanut Butter',
    price: 350,
    sellerName: 'Almaz Kebede',
    discount: '10% OFF',
    isLiked: true,
  },
};

export const ExtremeLongTitle = {
  args: {
    imageUri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    name: 'Organic Roasted Crunchy Peanut Butter Infused With Artisanal Ethiopian Honey And Whole Cardamom Pods',
    price: 490,
    sellerName: 'Gojjam Fine Foods',
    discount: 'BOGO',
  },
};