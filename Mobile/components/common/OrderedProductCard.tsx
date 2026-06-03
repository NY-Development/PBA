import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { CustomButton } from './CustomButton';

interface OrderedProductCardProps {
  orderId: string;
  timeAgo: string;
  productImage: string;
  productName: string;
  spec: string;
  quantity: number;
  buyerName: string;
  buyerInitials: string;
  status: 'pending' | 'packing' | 'completed';
  ctaLabel?: string;
  onCtaPress?: () => void;
  onCallPress?: () => void;
}

export function OrderedProductCard({
  orderId,
  timeAgo,
  productImage,
  productName,
  spec,
  quantity,
  buyerName,
  buyerInitials,
  status,
  ctaLabel,
  onCtaPress,
  onCallPress,
}: OrderedProductCardProps) {
  return (
    <View className="bg-card rounded-[24px] p-5 mb-4 border border-border shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-muted px-3 py-1 rounded-full">
          <Text className="text-xs font-bold text-muted-foreground">#{orderId}</Text>
        </View>
        <Text className="text-xs text-muted-foreground font-medium">{timeAgo}</Text>
      </View>

      <View className="flex-row items-center mb-4">
        <Image source={{ uri: productImage }} className="w-20 h-20 rounded-[16px] bg-muted" />
        <View className="flex-1 ml-4">
          <Text className="text-base font-bold text-card-foreground">{productName}</Text>
          <Text className="text-xs text-muted-foreground font-medium mt-0.5">{spec}</Text>
          <Text className="text-lg font-black text-card-foreground mt-1">
            {quantity} <Text className="text-xs text-muted-foreground font-semibold">Qty</Text>
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-border pt-3.5 mb-4">
        <View className="flex-row items-center">
          <View className="w-9 h-9 rounded-full bg-accent/20 items-center justify-center">
            <Text className="text-xs font-bold text-accent-foreground">{buyerInitials}</Text>
          </View>
          <Text className="text-sm font-bold text-card-foreground ml-3">{buyerName}</Text>
        </View>
        <Pressable onPress={onCallPress} className="w-10 h-10 rounded-full bg-muted items-center justify-center active:scale-95">
          <Phone size={16} className="text-foreground" />
        </Pressable>
      </View>

      <View className="border-t border-border pt-4">
        {status === 'completed' ? (
          <View className="flex-row items-center justify-center bg-muted py-3 rounded-[16px]">
            <CheckCircle2 size={18} color="#4CAF50" />
            <Text className="ml-2 text-sm font-bold text-foreground">Order Completed</Text>
          </View>
        ) : (
          ctaLabel && (
            <CustomButton
              label={ctaLabel}
              onPress={onCtaPress || (() => {})}
              rightIcon={<ArrowRight size={18} color="var(--primary-foreground)" />}
              className="py-3.5"
            />
          )
        )}
      </View>
    </View>
  );
}