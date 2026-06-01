import React from 'react';
import { View, ScrollView } from 'react-native';
import { GroupBuyCard } from '@/components/GroupBuyCard';

export default {
  title: 'Components/GroupBuyCard',
  component: GroupBuyCard,
  decorators: [(Story: any) => <ScrollView className="p-4 bg-background flex-1">{Story()}</ScrollView>],
};

const mockMembers = [
  { id: '1', initials: 'AB' },
  { id: '2', initials: 'HM' },
  { id: '3', initials: 'KB' },
];

export const FreshDeal = {
  args: {
    imageUri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    title: 'Gojjam Crunchy 500g (Pack of 3)',
    originalPrice: 960,
    discountedPrice: 720,
    discountPercent: 25,
    spotsTotal: 10,
    spotsFilled: 3,
    timeLeft: '23h 15m remaining',
    members: mockMembers,
    onJoinPress: () => console.log('Join clicked'),
  },
};

export const AlmostFull = {
  args: {
    imageUri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
    title: 'Chocolate Swirl Premium Spread',
    originalPrice: 400,
    discountedPrice: 280,
    discountPercent: 30,
    spotsTotal: 5,
    spotsFilled: 4,
    timeLeft: '1h 45m remaining',
    members: [...mockMembers, { id: '4', initials: 'YT' }],
    onJoinPress: () => console.log('Join clicked'),
  },
};