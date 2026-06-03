// components/features/auth/SignUpRoleSelector.tsx
import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Languages, User, Phone, Mail, Lock, Eye, EyeOff, ShoppingBag, Store, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🌟 Enforcing your reusable atomic components
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';

export function SignUpRoleSelector() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'maker'>('buyer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} className="flex-1 bg-background">
      {/* Sticky Structural Header Module */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
        <Pressable 
          onPress={() => router.back()}
          className="size-10 items-center justify-center rounded-full active:bg-muted"
        >
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>
        <Text className="text-foreground text-lg font-bold tracking-tight">
          Sign Up
        </Text>
        <Pressable 
          onPress={() => router.push('/modals/language-select')}
          className="size-10 items-center justify-center rounded-full active:bg-muted"
        >
          <Languages size={20} className="text-foreground" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="px-6 pt-4">
          
          {/* Main Headline Title */}
          <View className="mb-6">
            <Text className="text-foreground tracking-tight text-2xl font-extrabold mb-1">
              Welcome to the Hub
            </Text>
            <Text className="text-muted-foreground text-base font-medium leading-normal">
              Join as a buyer to find fresh goods or a maker to sell your creations.
            </Text>
          </View>

          {/* Dual Interactive Role Visual Board */}
          <View className="mb-6">
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">
              I am a...
            </Text>
            <View className="flex-row gap-4">
              
              {/* Buyer Selector Element */}
              <Pressable 
                onPress={() => setRole('buyer')}
                className={`flex-1 flex-col items-center justify-center p-4 rounded-xl border-2 bg-card relative ${
                  role === 'buyer' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <View className="mb-2 p-3 rounded-full bg-primary/10">
                  <ShoppingBag size={24} className="text-primary" />
                </View>
                <Text className="text-foreground font-bold text-base">Buyer</Text>
                <Text className="text-muted-foreground text-xs text-center mt-0.5">Buy goods</Text>
                {role === 'buyer' && (
                  <View className="absolute top-2 right-2">
                    <CheckCircle2 size={18} color="#e7931d" fill="#e7931d" />
                  </View>
                )}
              </Pressable>

              {/* Maker Selector Element */}
              <Pressable 
                onPress={() => setRole('maker')}
                className={`flex-1 flex-col items-center justify-center p-4 rounded-xl border-2 bg-card relative ${
                  role === 'maker' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <View className="mb-2 p-3 rounded-full bg-primary/10">
                  <Store size={24} className="text-primary" />
                </View>
                <Text className="text-foreground font-bold text-base">Maker</Text>
                <Text className="text-muted-foreground text-xs text-center mt-0.5">Sell products</Text>
                {role === 'maker' && (
                  <View className="absolute top-2 right-2">
                    <CheckCircle2 size={18} color="#e7931d" fill="#e7931d" />
                  </View>
                )}
              </Pressable>

            </View>
          </View>

          {/* Primary Form Fields Block */}
          <View className="gap-5">
            
            {/* Full Name field */}
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Full Name</Text>
              <CustomInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Abebe Bikila"
                leftIcon={<User size={18} className="text-muted-foreground" />}
              />
            </View>

            {/* Phone Number Field */}
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Phone Number</Text>
              <CustomInput
                value={phone}
                onChangeText={setPhone}
                placeholder="911 234 567"
                keyboardType="phone-pad"
                leftIcon={
                  <View className="flex-row items-center gap-1 border-r border-border pr-2">
                    <Phone size={18} className="text-muted-foreground" />
                    <Text className="text-muted-foreground text-sm font-medium ml-1">+251</Text>
                  </View>
                }
              />
            </View>

            {/* Email Address Field */}
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Email Address</Text>
              <CustomInput
                value={email}
                onChangeText={setEmail}
                placeholder="abebe@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={18} className="text-muted-foreground" />}
              />
            </View>

            {/* Password input block */}
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Password</Text>
              <CustomInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={secureText}
                autoCapitalize="none"
                leftIcon={<Lock size={18} className="text-muted-foreground" />}
                rightIcon={
                  <Pressable onPress={() => setSecureText(!secureText)} className="p-1">
                    {secureText ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-primary" />
                    )}
                  </Pressable>
                }
              />
            </View>

            {/* Terms Layout Toggle */}
            <Pressable 
              onPress={() => setAgreeTerms(!agreeTerms)}
              className="flex-row items-start gap-3 my-2 active:opacity-80"
            >
              <View className={`w-5 h-5 rounded border items-center justify-center mt-0.5 ${
                agreeTerms ? 'bg-primary border-primary' : 'border-input bg-card'
              }`}>
                {agreeTerms && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-sm text-muted-foreground font-medium leading-tight flex-1">
                I agree to the <Text className="text-primary underline">Terms & Conditions</Text> and{' '}
                <Text className="text-primary underline">Privacy Policy</Text>.
              </Text>
            </Pressable>

          </View>
        </View>
      </ScrollView>

      {/* Persistent Base Action Sheet Layout */}
      <View className="absolute bottom-8 left-0 right-0 bg-background/95 border-t border-border p-6 pb-8">
        <CustomButton
          label="Create Account"
          onPress={() => router.push('/(auth)/otp-verify')}
          rightIcon={<ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />}
        />
        
        <View className="flex-row items-center justify-center gap-1 mt-4">
          <Text className="text-center text-sm font-medium text-muted-foreground">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/sign-in')}>
            <Text className="text-primary font-bold text-sm underline">Log In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}