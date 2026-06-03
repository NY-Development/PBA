import React from 'react';
import { View } from 'react-native';
import { CustomButton } from '@/components/common/CustomButton';
import { ArrowRight, ShoppingBag } from 'lucide-react-native';

export default {
  title: 'Components/CustomButton',
  component: CustomButton,
  decorators: [(Story: any) => <View className="p-6 gap-4 bg-background justify-center flex-1">{Story()}</View>],
};

export const PrimaryWithRightIcon = {
  args: {
    label: 'Start Packing',
    variant: 'primary',
    rightIcon: <ArrowRight size={18} color="var(--primary-foreground)" />,
    onPress: () => console.log('Primary pressed'),
  },
};

export const LeftIconSecondary = {
  args: {
    label: 'Add to Basket',
    variant: 'secondary',
    leftIcon: <ShoppingBag size={18} color="var(--secondary-foreground)" />,
    onPress: () => console.log('Secondary pressed'),
  },
};

export const OutlineStyle = {
  args: {
    label: 'Back to Shop',
    variant: 'outline',
    onPress: () => console.log('Outline pressed'),
  },
};

export const AsyncLoadingState = {
  args: {
    label: 'Processing Secure Checkout',
    variant: 'primary',
    isLoading: true,
    onPress: () => console.log('Loading pressed'),
  },
};