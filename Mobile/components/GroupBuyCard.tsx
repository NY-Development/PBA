import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Users, Clock, ArrowRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface GroupBuyCardProps {
  imageUri: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  spotsTotal: number;
  spotsFilled: number;
  timeLeft: string;
  members: Array<{ id: string; avatarUrl?: string; initials: string }>;
  onJoinPress: () => void;
}

export function GroupBuyCard({
  imageUri,
  title,
  originalPrice,
  discountedPrice,
  discountPercent,
  spotsTotal,
  spotsFilled,
  timeLeft,
  members,
  onJoinPress,
}: GroupBuyCardProps) {
  const progressPercent = Math.min((spotsFilled / spotsTotal) * 100, 100);

  return (
    <View className="bg-card rounded-[24px] p-5 mb-4 border border-border shadow-sm">
      {/* Top Meta Tags Row */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
          <Users size={14} className="text-primary" />
          <Text className="text-xs font-bold text-primary ml-1.5">
            Group Deal • {spotsFilled}/{spotsTotal} Joined
          </Text>
        </View>

        <View className="flex-row items-center bg-muted px-3 py-1.5 rounded-full">
          <Clock size={14} className="text-muted-foreground" />
          <Text className="text-xs font-semibold text-muted-foreground ml-1.5">{timeLeft}</Text>
        </View>
      </View>

      {/* Main Core Info */}
      <View className="flex-row items-center mb-4">
        <Image source={{ uri: imageUri }} className="w-20 h-20 rounded-[16px] bg-muted" />
        <View className="flex-1 ml-4">
          <Text numberOfLines={1} className="text-base font-bold text-card-foreground">
            {title}
          </Text>
          
          {/* Price Layout */}
          <View className="flex-row items-center mt-1.5">
            <Text className="text-primary font-black text-lg">
              {discountedPrice} ETB
            </Text>
            <Text className="text-xs text-muted-foreground line-through ml-2">
              {originalPrice} ETB
            </Text>
            <View className="bg-muted px-2 py-0.5 rounded-md ml-2.5">
              <Text className="text-[11px] font-bold text-foreground">
                {discountPercent}% OFF
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Custom Progress Bar Tracker */}
      <View className="mb-4">
        <View className="h-2 bg-muted rounded-full overflow-hidden">
          <View 
            className="h-full bg-accent rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Footer Element */}
      <View className="flex-row items-center justify-between pt-2 border-t border-border">
        {/* Avatars */}
        <View className="flex-row items-center pl-2">
          {members.slice(0, 4).map((member, index) => (
            <View 
              key={member.id} 
              className={cn(
                "w-8 h-8 rounded-full border-2 border-card items-center justify-center bg-muted",
                index > 0 && "-ml-2.5"
              )}
            >
              {member.avatarUrl ? (
                <Image source={{ uri: member.avatarUrl }} className="w-full h-full rounded-full" />
              ) : (
                <Text className="text-[10px] font-bold text-muted-foreground">
                  {member.initials}
                </Text>
              )}
            </View>
          ))}
          {spotsTotal - spotsFilled > 0 && (
            <Text className="text-xs font-semibold text-muted-foreground ml-2">
              +{spotsTotal - spotsFilled} left
            </Text>
          )}
        </View>

        {/* Action Toggle */}
        <Pressable 
          onPress={onJoinPress} 
          className="flex-row items-center bg-secondary px-4 py-2.5 rounded-[12px] active:opacity-90"
        >
          <Text className="text-xs font-bold text-secondary-foreground mr-1.5">
            Join Deal
          </Text>
          <ArrowRight size={14} className="text-secondary-foreground" />
        </Pressable>
      </View>
    </View>
  );
}