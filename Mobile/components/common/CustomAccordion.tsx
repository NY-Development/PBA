import React, { useState } from 'react';
import { View, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronDown } from 'lucide-react-native';
import { cn } from '@/lib/utils';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function CustomAccordion({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View className={cn('border-b border-border py-1', className)}>
      <Pressable onPress={toggleAccordion} className="flex-row items-center justify-between py-3.5">
        <Text className="text-base font-bold text-foreground">{title}</Text>
        <View className={cn('transition-transform duration-200', isOpen && 'rotate-180')}>
          <ChevronDown size={18} className="text-muted-foreground" />
        </View>
      </Pressable>
      {isOpen && <View className="pb-4 pt-1 px-1">{children}</View>}
    </View>
  );
}