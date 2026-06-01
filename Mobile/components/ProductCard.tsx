import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart, Plus } from 'lucide-react-native';

interface ProductCardProps {
  imageUri: string;
  name: string;
  price: number;
  sellerName?: string;
  discount?: string;
  isLiked?: boolean;
  onAddPress?: () => void;
  onLikePress?: () => void;
  onCardPress?: () => void;
}

export function ProductCard({
  imageUri,
  name,
  price,
  sellerName,
  discount,
  isLiked = false,
  onAddPress,
  onLikePress,
  onCardPress
}: ProductCardProps) {
  return (
    <Pressable 
      onPress={onCardPress} 
      className="bg-card rounded-[16px] p-3 w-[48%] mb-4 border border-border shadow-sm active:opacity-95"
    >
      <View className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-muted">
        <Image source={{ uri: imageUri }} className="w-full h-full object-cover" />
        
        {/* Floating Discount Tag */}
        {discount && (
          <View className="absolute top-2 left-2 bg-primary px-2 py-0.5 rounded-md">
            <Text className="text-[10px] text-primary-foreground font-bold">{discount}</Text>
          </View>
        )}

        {/* Floating Like Button */}
        <Pressable 
          onPress={onLikePress}
          className="absolute top-2 right-2 bg-card/90 p-2 rounded-full shadow-sm active:scale-90"
        >
          <Heart size={16} color={isLiked ? '#D32F2F' : '#6B7280'} fill={isLiked ? '#D32F2F' : 'transparent'} />
        </Pressable>
      </View>

      {/* Meta Data */}
      <View className="mt-2.5 px-1">
        {sellerName && (
          <Text className="text-xs text-muted-foreground font-medium mb-0.5">{sellerName}</Text>
        )}
        <Text numberOfLines={2} className="text-sm font-bold text-card-foreground h-10 leading-5">
          {name}
        </Text>
        
        {/* Price Row */}
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-primary font-extrabold text-base">
            {price} ETB
          </Text>
          
          <Pressable 
            onPress={onAddPress}
            className="bg-primary p-2 rounded-full active:scale-95"
          >
            <Plus size={16} color="#FFF" strokeWidth={3} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}