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
    <View 
      className={cn(
        'flex-row items-center bg-card border border-input rounded-[16px] px-4 py-3.5 native:focused:border-ring',
        containerClassName
      )}
    >
      {/* Visual containers for icons pass proper color formatting to children */}
      {leftIcon && <View className="mr-3 text-muted-foreground">{leftIcon}</View>}
      
      <TextInput
        // NativeWind modifier handles the placeholder color dynamically from global.css
        className={cn(
          'flex-1 text-base text-foreground font-medium text-left placeholder:text-muted-foreground',
          className
        )}
        {...props}
      />
      
      {rightIcon && <View className="ml-3 text-muted-foreground">{rightIcon}</View>}
    </View>
  );
}
