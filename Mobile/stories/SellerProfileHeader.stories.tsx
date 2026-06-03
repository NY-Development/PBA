import React from 'react';
import { ScrollView, View } from 'react-native';
import { SellerProfileHeader } from '@/components/common/SellerProfileHeader';

export default {
  title: 'Components/SellerProfileHeader',
  component: SellerProfileHeader,
  decorators: [
    (Story: any) => (
      <ScrollView className="bg-muted flex-1 pt-12">
        <View className="h-40 bg-accent/20 w-full" /> {/* Simulates cover image area */}
        <Story />
      </ScrollView>
    )
  ],
};

export const DefaultProfile = {
  args: {
    name: 'Almaz Kebede',
    location: 'Gojjam, Ethiopia',
    memberSince: '2015',
    isVerified: true,
    isQualityChecked: true,
    storyQuote: "Peanut butter isn't just food; it's a memory of sun-dried peanuts and traditional stone grinding techniques passed down from my grandmother.",
    isFollowing: false,
    onMessagePress: () => console.log('Message pressed'),
    onFollowPress: () => console.log('Follow pressed'),
  },
};

export const AlternateFollowingState = {
  args: {
    name: 'Chala Bekele',
    location: 'Harar, Ethiopia',
    memberSince: '2019',
    isVerified: true,
    isQualityChecked: false,
    storyQuote: 'Pure dark roast sesame and peanut purees directly sourced from smallholder plots.',
    isFollowing: true,
    onMessagePress: () => console.log('Message pressed'),
    onFollowPress: () => console.log('Follow pressed'),
  },
};