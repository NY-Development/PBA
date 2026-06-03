import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin, MessageSquarePlus, UserPlus2, ShieldCheck, Award } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface SellerProfileHeaderProps {
  name: string;
  location: string;
  memberSince: string;
  isVerified?: boolean;
  isQualityChecked?: boolean;
  storyQuote?: string;
  onMessagePress: () => void;
  onFollowPress: () => void;
  isFollowing?: boolean;
}

export function SellerProfileHeader({
  name,
  location,
  memberSince,
  isVerified = true,
  isQualityChecked = true,
  storyQuote,
  onMessagePress,
  onFollowPress,
  isFollowing = false,
}: SellerProfileHeaderProps) {
  return (
    <View className="bg-background w-full rounded-t-[40px] px-6 pb-6 pt-2 -mt-10 shadow-xl">
      <View className="w-12 h-1 bg-border rounded-full self-center mb-6" />

      <Text className="text-2xl font-black text-foreground mb-1.5">
        {name}
      </Text>
      
      <View className="flex-row items-center flex-wrap gap-x-2 mb-4">
        <View className="flex-row items-center">
          <MapPin size={14} className="text-primary" fill="currentColor" />
          <Text className="text-xs text-muted-foreground font-semibold ml-1">{location}</Text>
        </View>
        <Text className="text-border">•</Text>
        <Text className="text-xs text-muted-foreground font-medium">Member since {memberSince}</Text>
      </View>

      {/* Trust Badges Bar */}
      <View className="flex-row gap-2 mb-6 flex-wrap">
        {isVerified && (
          <View className="flex-row items-center bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-[8px]">
            <ShieldCheck size={12} className="text-accent" />
            <Text className="text-[10px] font-black text-accent ml-1 tracking-wider uppercase">
              Fayda Verified
            </Text>
          </View>
        )}
        {isQualityChecked && (
          <View className="flex-row items-center bg-muted border border-border px-2.5 py-1 rounded-[8px]">
            <Award size={12} className="text-muted-foreground" />
            <Text className="text-[10px] font-black text-muted-foreground ml-1 tracking-wider uppercase">
              Quality Checked
            </Text>
          </View>
        )}
      </View>

      {/* Our Story Block Quote */}
      {storyQuote && (
        <View className="border-l-[3px] border-primary pl-4 mb-6">
          <Text className="text-sm font-bold text-foreground mb-1">Our Story</Text>
          <Text className="text-xs leading-5 text-muted-foreground italic font-medium">
            "{storyQuote}"
          </Text>
        </View>
      )}

      {/* Communication Action Triggers */}
      <View className="flex-row gap-3">
        <Pressable 
          onPress={onMessagePress}
          className="flex-1 flex-row items-center justify-center bg-muted py-3.5 rounded-[16px] active:opacity-80"
        >
          <MessageSquarePlus size={18} className="text-muted-foreground" fill="currentColor" />
          <Text className="text-sm font-bold text-muted-foreground ml-2">Message</Text>
        </Pressable>

        <Pressable 
          onPress={onFollowPress}
          className={cn(
            "flex-1 flex-row items-center justify-center py-3.5 rounded-[16px] active:opacity-90 shadow-sm",
            isFollowing ? "bg-muted" : "bg-primary"
          )}
        >
          <UserPlus2 size={18} color={isFollowing ? "var(--muted-foreground)" : "var(--primary-foreground)"} />
          <Text className={cn(
            "text-sm font-bold ml-2",
            isFollowing ? "text-muted-foreground" : "text-primary-foreground"
          )}>
            {isFollowing ? 'Following' : `Follow ${name.split(' ')[0]}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}