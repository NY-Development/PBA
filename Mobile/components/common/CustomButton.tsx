import React from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  className?: string;
}

export function CustomButton({
  label,
  onPress,
  leftIcon,
  rightIcon,
  variant = 'primary',
  isLoading = false,
  className,
}: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={cn(
        'flex-row items-center justify-between px-5 py-4 rounded-[16px] active:opacity-90',
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'outline' && 'border border-input bg-transparent',
        isLoading && 'opacity-70',
        className
      )}
    >
      <View className="w-6 items-start justify-center">
        {!isLoading && leftIcon ? leftIcon : null}
      </View>

      <View className="flex-1 items-center justify-center mx-2">
        {isLoading ? (
          <ActivityIndicator color={variant === 'primary' ? 'var(--primary-foreground)' : 'var(--secondary-foreground)'} size="small" />
        ) : (
          <Text className={cn(
            'text-base font-semibold tracking-wide',
            variant === 'primary' && 'text-primary-foreground',
            variant === 'secondary' && 'text-secondary-foreground',
            variant === 'outline' && 'text-foreground'
          )}>
            {label}
          </Text>
        )}
      </View>

      <View className="w-6 items-end justify-center">
        {!isLoading && rightIcon ? rightIcon : null}
      </View>
    </Pressable>
  );
}