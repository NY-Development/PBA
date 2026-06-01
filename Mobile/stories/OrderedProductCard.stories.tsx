import React from 'react';
import { ScrollView } from 'react-native';
import { OrderedProductCard } from '@/components/OrderedProductCard';

export default {
  title: 'Components/OrderedProductCard',
  component: OrderedProductCard,
  decorators: [(Story: any) => <ScrollView className="p-4 bg-background flex-1">{Story()}</ScrollView>],
};

export const ActionRequiredState = {
  args: {
    orderId: '1042',
    timeAgo: '10 min ago',
    productImage: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    productName: 'Smooth Peanut Butter',
    spec: '1kg Jar',
    quantity: 5,
    buyerName: 'Abebe Bikila',
    buyerInitials: 'AB',
    status: 'pending',
    ctaLabel: 'Start Packing',
    onCtaPress: () => console.log('CTA Pressed'),
    onCallPress: () => console.log('Call Pressed'),
  },
};

export const DispatchedState = {
  args: {
    orderId: '1041',
    timeAgo: '1 hr ago',
    productImage: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    productName: 'Crunchy Peanut Butter',
    spec: '500g Jar',
    quantity: 12,
    buyerName: 'Hana Mele',
    buyerInitials: 'HM',
    status: 'packing',
    ctaLabel: 'Send for Delivery',
    onCtaPress: () => console.log('CTA Pressed'),
    onCallPress: () => console.log('Call Pressed'),
  },
};

export const HistoricallyCompletedState = {
  args: {
    orderId: '1040',
    timeAgo: '3 hrs ago',
    productImage: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    productName: 'Mixed Box Variant',
    spec: 'Variety Pack',
    quantity: 2,
    buyerName: 'Kebede Alemu',
    buyerInitials: 'KA',
    status: 'completed',
    onCallPress: () => console.log('Call Pressed'),
  },
};