import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Plus, Minus, Trash2 } from 'lucide-react-native';

interface CartCardProps {
  imageUri: string;
  name: string;
  price: number;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
}

export function CartCard({
  imageUri,
  name,
  price,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: CartCardProps) {
  return (
    <View className="flex-row items-center bg-card p-4 rounded-[24px] mb-3 border border-border">
      <Image source={{ uri: imageUri }} className="w-20 h-20 rounded-[16px] bg-muted" />
      
      <View className="flex-1 ml-4 justify-between h-20 py-0.5">
        <View className="flex-row justify-between items-start">
          <Text numberOfLines={1} className="text-base font-bold text-card-foreground flex-1 pr-2">
            {name}
          </Text>
          {onRemove && (
            <Pressable onPress={onRemove} className="p-1">
              <Trash2 size={16} className="text-destructive active:opacity-60" />
            </Pressable>
          )}
        </View>
        
        <View className="flex-row justify-between items-end">
          <Text className="text-base font-black text-primary">
            {price * quantity} ETB
          </Text>
          
          {/* Controls */}
          <View className="flex-row items-center bg-muted border border-input rounded-[12px] p-1">
            <Pressable onPress={onDecrement} className="p-1.5 rounded-lg active:opacity-50">
              <Minus size={14} className="text-muted-foreground" />
            </Pressable>
            <Text className="text-sm font-bold text-foreground mx-3.5 w-4 text-center">
              {quantity}
            </Text>
            <Pressable onPress={onIncrement} className="p-1.5 rounded-lg active:opacity-50">
              <Plus size={14} className="text-muted-foreground" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}