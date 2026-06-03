// app/(auth)/recovery.tsx
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, KeyRound, Mail, ArrowRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🌟 Enforcing your exact reusable atomic components
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';

export default function AccountRecoveryScreen() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    if (!contact.trim()) return;
    setIsSending(true);
    
    // Smooth transition sequence into verification layout route
    setTimeout(() => {
      setIsSending(false);
      router.push('/(auth)/otp-verify');
    }, 800);
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} className="flex-1 bg-background">
      {/* Dynamic Context Header Row */}
      <View className="px-6 h-14 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-muted"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 pt-6 justify-between pb-4">
        <View>
          {/* Graphical Tactile Reset Element using Theme Badges */}
          <View className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <KeyRound size={30} className="text-primary" />
          </View>

          {/* Informational Semantics Header Block */}
          <View className="mb-8">
            <Text className="text-2xl font-extrabold text-foreground tracking-tight mb-3">
              Reset Password
            </Text>
            <Text className="text-base text-muted-foreground leading-relaxed">
              Enter your registered phone number or email to recover your account safely.
            </Text>
          </View>

          {/* Form Interactive Core using your strict CustomInput design pattern */}
          <View className="gap-1.5 w-full">
            <Text className="text-foreground text-sm font-semibold ml-1 mb-1">
              Email or Phone Number
            </Text>
            <CustomInput
              value={contact}
              onChangeText={setContact}
              placeholder="Enter your email or phone"
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={<Mail size={18} className="text-muted-foreground" />}
            />
          </View>
        </View>

        {/* Dynamic Theme Actions Base Layout Footer */}
        <View className="pt-8 pb-2">
          <CustomButton
            label="Send Recovery Code"
            onPress={handleSendCode}
            isLoading={isSending}
            variant="primary"
            rightIcon={<ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />}
            className={!contact.trim() ? 'opacity-60' : ''}
          />

          <View className="flex-row items-center justify-center mt-5">
            <Text className="text-sm text-muted-foreground">
              Remember your password?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/sign-in')}>
              <Text className="text-sm font-bold text-primary underline">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}