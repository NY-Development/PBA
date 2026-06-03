// app/(auth)/otp-verify.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🌟 Enforcing your reusable atom molecules strictly
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Keep target reference typed to TextInput since CustomInput forwards props down to it
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleInputChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = cleanText.slice(-1);
    setCode(newCode);

    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = code.every((char) => char !== '');

  const handleVerify = () => {
    if (!isComplete) return;
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      router.replace('/(main)/home');
    }, 1000);
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} className="flex-1 bg-background">
      {/* Custom Transactional App Bar */}
      <View className="px-6 py-2 flex-row items-center">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center active:bg-muted"
        >
          <ArrowLeft size={24} className="text-primary" />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-6 justify-between pb-4">
        <View>
          {/* Status Indicator Icon */}
          <View className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-8 relative">
            <MessageSquare size={28} className="text-primary" />
            <View className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-peanut-orange rounded-full border-2 border-card" />
          </View>

          {/* Heading block */}
          <Text className="text-2xl font-extrabold text-foreground mb-3">
            Verify Your Number
          </Text>
          <Text className="text-base text-muted-foreground mb-10">
            We sent a 6-digit code to{' '}
            <Text className="font-semibold text-foreground">+251 911 234 567</Text>
          </Text>

          {/* 6 Grid Split Box Inputs utilizing CustomInput exclusively */}
          <View className="flex-row justify-between gap-2 mb-8">
            {code.map((char, index) => (
              <View key={index} className="w-12">
                <CustomInput
                  ref={(el) => {
                    // Extracting internal TextInput ref access cleanly for the forward focus driver
                    if (el) {
                      inputRefs.current[index] = el as unknown as TextInput;
                    }
                  }}
                  value={char}
                  onChangeText={(text) => handleInputChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  placeholder="-"
                  containerClassName="px-0 py-0 h-14 justify-center items-center rounded-[12px]"
                  className="text-center font-bold text-lg text-foreground p-0 m-0 w-full"
                />
              </View>
            ))}
          </View>

          {/* Dynamic Resend Container */}
          <View className="items-center">
            {timeLeft > 0 ? (
              <Text className="text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <Text className="font-semibold text-tertiary">Resend in {timeLeft}s</Text>
              </Text>
            ) : (
              <Pressable onPress={() => setTimeLeft(45)}>
                <Text className="text-sm font-bold text-primary underline">
                  Resend Now
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Action Call Button via CustomButton component */}
        <View className="pb-4">
          <CustomButton
            label="Verify & Continue"
            onPress={handleVerify}
            isLoading={isVerifying}
            className={!isComplete ? 'opacity-50' : ''}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}