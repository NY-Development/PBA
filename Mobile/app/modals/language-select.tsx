import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';

export default function LanguageSelectModal() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <Text className="text-lg font-bold text-foreground">Language</Text>
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full active:bg-muted">
          <X size={22} className="text-foreground" />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground text-sm">Language selection coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}
