import React from 'react';
import { View } from 'react-native';
import { CustomAccordion } from '@/components/CustomAccordion';
import { Text } from '@/components/ui/text';

export default {
  title: 'Components/CustomAccordion',
  component: CustomAccordion,
  decorators: [(Story: any) => <View className="p-6 bg-card flex-1">{Story()}</View>],
};

export const CollapsibleProductDetails = {
  args: {
    title: 'Ingredients & Production Method',
    children: (
      <Text className="text-muted-foreground text-sm leading-6">
        Contains 100% locally sourced organic peanuts, organic wild honey, and salt. 
        Slow stone-ground by hand in small artisanal batches to maintain original essential nutrient fats. No artificial preservatives.
      </Text>
    ),
  },
};