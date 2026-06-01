import React from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '@/lib/utils';

interface CustomInputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function CustomInput({
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  ...props
}: CustomInputProps) {
  return (
    <View className={cn(
      'flex-row items-center bg-card border border-input rounded-[16px] px-4 py-3.5 native:focused:border-ring',
      containerClassName
    )}>
      {leftIcon && <View className="mr-3 text-muted-foreground">{leftIcon}</View>}
      
      <TextInput
        placeholderTextColor="rgba(14, 21, 14, 0.4)"
        className={cn(
          'flex-1 text-base text-foreground font-medium text-center',
          className
        )}
        {...props}
      />
      
      {rightIcon && <View className="ml-3 text-muted-foreground">{rightIcon}</View>}
    </View>
  );
}