// components/features/auth/SignInForm.tsx
import React, { useState } from 'react';
import { View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Languages, Mail, Eye, EyeOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

// 🌟 Enforcing your reusable atomic components
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';

// 🌟 Auth Integrations
import { useLoginMutation } from '@/src/hooks/auth/useAuthMutation';
import { signInSchema } from '@/src/types/validation/auth.schema';

export function SignInForm() {
  const router = useRouter();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: () => {
      // Assuming /(auth)/home is the post-login destination in this file
      router.replace('/(auth)/home');
    },
    onError: (error) => {
      setErrors({ form: error.response?.data?.message || 'Login failed. Please try again.' });
    }
  });

  const handleLogin = () => {
    try {
      const validData = signInSchema.parse({ identity, password });
      setErrors({});
      login(validData);
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
      {/* Header Container */}
      <View className="flex-row items-center justify-start px-6 pt-2">
        <Pressable 
          onPress={() => router.push('/modals/language-select')}
          className="h-10 w-10 rounded-full bg-card border border-border items-center justify-center active:opacity-70"
        >
          <Languages size={20} className="text-foreground" />
        </Pressable>
      </View>

      {/* Main Content Node */}
      <View className="flex-1 px-6 pt-4 justify-center">
        
        {/* Visual Brand Block */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl text-primary font-bold">🍯</Text>
          </View>
          <Text className="text-foreground tracking-tight text-3xl font-extrabold text-center mb-2">
            Welcome Back
          </Text>
          <Text className="text-muted-foreground text-base text-center max-w-[280px]">
            Login to access the best local peanut butter from Ethiopia.
          </Text>
        </View>

        {/* Form Interactive Context Tree */}
        <View className="gap-5 w-full">
          
          {errors.form && (
            <Text className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2 rounded-md">
              {errors.form}
            </Text>
          )}

          {/* Identity Field Input */}
          <View className="gap-1.5">
            <Text className="text-foreground text-sm font-semibold ml-1">
              Email or Phone Number
            </Text>
            <CustomInput
              value={identity}
              onChangeText={(text) => {
                setIdentity(text);
                if (errors.identity) setErrors({ ...errors, identity: '' });
              }}
              placeholder="Enter your email or phone"
              autoCapitalize="none"
              keyboardType="email-address"
              rightIcon={<Mail size={18} className="text-muted-foreground opacity-60" />}
              containerClassName={errors.identity ? 'border-destructive' : ''}
            />
            {errors.identity && <Text className="text-destructive text-xs ml-1">{errors.identity}</Text>}
          </View>

          {/* Password Input Block */}
          <View className="gap-1.5">
            <Text className="text-foreground text-sm font-semibold ml-1">
              Password
            </Text>
            <CustomInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
              secureTextEntry={secureText}
              autoCapitalize="none"
              containerClassName={errors.password ? 'border-destructive' : ''}
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

            {/* Forgot Password Safe Trigger */}
            <View className="flex-row justify-end mt-1">
              <Pressable onPress={() => router.push('/(auth)/recovery')}>
                <Text className="text-sm font-medium text-primary">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Core Login CTA Entry */}
          <CustomButton
            label="Login"
            isLoading={isPending}
            variant="primary"
            className="mt-2"
            onPress={handleLogin}
          />
        </View>

        {/* Separator Section */}
        <View className="flex-row items-center gap-3 w-full my-8">
          <View className="h-px bg-border flex-1" />
          <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Or continue with
          </Text>
          <View className="h-px bg-border flex-1" />
        </View>

        {/* Third-Party Authentication Grid */}
        <View className="flex-row gap-4 w-full justify-center mb-6">
          <Pressable className="flex-1 max-w-[140px] h-12 rounded-xl border border-border bg-card items-center justify-center active:bg-muted/50">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7AjzI3XZtG2cnPpjzLWLYFBaCyDmtY9OF3RSe29cwmMbG4G-n0vMXVh6SrZUhSV_2ASnUt2FaMYL89nKZ1UOgfEXZ3YNllSQhBeNVszdqVBTgn5KrvWb5WbPj0BKRGnMkTy2FrSJqvGe2YzP3czkqpjbhgYV4nTU0ep3NLklHgzZr_SpHwMx9_bU6c9_8i6Y1PCnJdOk_VelCMhEWh1QQPzfCBFs1QPCRz6KSOgoy1qVULaKMUQEdY27RceeZXFWvmagYQcwuZwq2' }}
              className="w-5 h-5 object-contain"
            />
          </Pressable>
          <Pressable className="flex-1 max-w-[140px] h-12 rounded-xl border border-border bg-card items-center justify-center active:bg-muted/50">
            <Text className="text-foreground font-black text-lg"></Text>
          </Pressable>
        </View>

        {/* Routing Backplane Footer */}
        <View className="flex-row justify-center items-center gap-1.5 py-4">
          <Text className="text-muted-foreground text-sm font-medium">
            Don't have an account?
          </Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text className="text-primary font-bold text-sm underline">
              Sign Up
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}