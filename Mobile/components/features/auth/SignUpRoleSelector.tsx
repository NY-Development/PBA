import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Languages, User, Phone, Mail, Lock, Eye, EyeOff, ShoppingBag, Store, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

// Atomic UI components
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';

// Auth Integrations
import { useSignUpMutation } from '@/src/hooks/auth/useAuthMutation';
import { signUpSchema } from '@/src/types/validation/auth.schema';


export function SignUpRoleSelector() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'maker'>('buyer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: signUp, isPending } = useSignUpMutation({
    onSuccess: (data) => {
      // Safely fires after registration - user now goes to OTP verification
      router.push({
        pathname: '/(auth)/otp-verify',
        params: { identity: email }
      });
    },
    onError: (error) => {
      // Type-safe extraction thanks to ApiError handling in hook definition
      setErrors({ form: error.response?.data?.message || 'Registration failed. Please try again.' });
    }
  });

  const handleSignUp = () => {
    try {
      const validData = signUpSchema.parse({
        role,
        firstName,
        lastName,
        phone: `+251${phone}`, // Structural structural match for Ethiopian phone criteria
        email,
        password,
        agreeTerms,
      });
      setErrors({});
      signUp(validData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) formattedErrors[err.path[0].toString()] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} className="flex-1 bg-background">
      {/* Header */}
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
          <View className="mb-6">
            <Text className="text-foreground tracking-tight text-2xl font-extrabold mb-1">
              Welcome to the Hub
            </Text>
            <Text className="text-muted-foreground text-base font-medium leading-normal">
              Join as a buyer to find fresh goods or a maker to sell your creations.
            </Text>
          </View>

          {errors.form && (
            <Text className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2 rounded-md mb-4">
              {errors.form}
            </Text>
          )}

          {/* Role Choice Engine */}
          <View className="mb-6">
            <Text className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">
              I am a...
            </Text>
            <View className="flex-row gap-4">
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

          {/* Input Fields Container */}
          <View className="gap-5">
            <View className="flex-row gap-4">
              <View className="flex-1 gap-1.5">
                <Text className="text-foreground text-sm font-semibold">First Name</Text>
                <CustomInput
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) setErrors({ ...errors, firstName: '' });
                  }}
                  placeholder="Abebe"
                  containerClassName={errors.firstName ? 'border-destructive' : ''}
                  leftIcon={<User size={18} className="text-muted-foreground" />}
                />
                {errors.firstName && <Text className="text-destructive text-xs ml-1">{errors.firstName}</Text>}
              </View>

              <View className="flex-1 gap-1.5">
                <Text className="text-foreground text-sm font-semibold">Last Name</Text>
                <CustomInput
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName) setErrors({ ...errors, lastName: '' });
                  }}
                  placeholder="Bikila"
                  containerClassName={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && <Text className="text-destructive text-xs ml-1">{errors.lastName}</Text>}
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Phone Number</Text>
              <CustomInput
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="911 234 567"
                keyboardType="phone-pad"
                containerClassName={errors.phone ? 'border-destructive' : ''}
                leftIcon={
                  <View className="flex-row items-center gap-1 border-r border-border pr-2">
                    <Phone size={18} className="text-muted-foreground" />
                    <Text className="text-muted-foreground text-sm font-medium ml-1">+251</Text>
                  </View>
                }
              />
              {errors.phone && <Text className="text-destructive text-xs ml-1">{errors.phone}</Text>}
            </View>

            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Email Address</Text>
              <CustomInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="abebe@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerClassName={errors.email ? 'border-destructive' : ''}
                leftIcon={<Mail size={18} className="text-muted-foreground" />}
              />
              {errors.email && <Text className="text-destructive text-xs ml-1">{errors.email}</Text>}
            </View>

            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-semibold">Password</Text>
              <CustomInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••••"
                secureTextEntry={secureText}
                autoCapitalize="none"
                containerClassName={errors.password ? 'border-destructive' : ''}
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
              {errors.password && <Text className="text-destructive text-xs ml-1">{errors.password}</Text>}
            </View>

            <View>
              <Pressable 
                onPress={() => {
                  setAgreeTerms(!agreeTerms);
                  if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
                }}
                className="flex-row items-start gap-3 my-2 active:opacity-80"
              >
                <View className={`w-5 h-5 rounded border items-center justify-center mt-0.5 ${
                  agreeTerms ? 'bg-primary border-primary' : (errors.agreeTerms ? 'border-destructive bg-destructive/10' : 'border-input bg-card')
                }`}>
                  {agreeTerms && <Text className="text-white text-xs font-bold">✓</Text>}
                </View>
                <Text className="text-sm text-muted-foreground font-medium leading-tight flex-1">
                  I agree to the <Text className="text-primary underline">Terms & Conditions</Text> and{' '}
                  <Text className="text-primary underline">Privacy Policy</Text>.
                </Text>
              </Pressable>
              {errors.agreeTerms && <Text className="text-destructive text-xs ml-8">{errors.agreeTerms}</Text>}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Button Dock */}
      <View className="absolute bottom-8 left-0 right-0 bg-background/95 border-t border-border p-6 pb-8">
        <CustomButton
          label="Create Account"
          onPress={handleSignUp}
          isLoading={isPending}
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