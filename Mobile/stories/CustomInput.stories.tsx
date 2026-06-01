import React from 'react';
import { View } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { Search, MapPin, EyeOff } from 'lucide-react-native';

export default {
  title: 'Components/CustomInput',
  component: CustomInput,
  decorators: [(Story: any) => <View className="p-6 gap-4 bg-background justify-center flex-1">{Story()}</View>],
};

export const PlaceholderOnly = {
  args: {
    placeholder: 'Enter your name...',
  },
};

export const SearchWithIcons = {
  args: {
    placeholder: 'Search pantry or sellers...',
    leftIcon: <Search size={20} color="var(--muted-foreground)" />,
    rightIcon: <MapPin size={20} color="var(--primary)" />,
  },
};

export const FilledPasswordState = {
  args: {
    value: 'secret_peanut_butter_recipe',
    secureTextEntry: true,
    rightIcon: <EyeOff size={18} color="var(--muted-foreground)" />,
  },
};