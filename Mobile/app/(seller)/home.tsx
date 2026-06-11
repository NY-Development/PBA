import React from 'react';
import { View} from 'react-native';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { CustomButton } from '@/components/common/CustomButton';
import { useRouter } from 'expo-router';

export default function MainHomeScreen() {

  const {logout} = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/sign-in');
  }

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground text-lg font-semibold">Home</Text>
      <CustomButton onPress={handleLogout} label="Logout" className='bg-destructive'/>
    </View>
  );
}
