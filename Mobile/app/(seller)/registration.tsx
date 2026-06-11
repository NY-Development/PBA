import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ChevronRight, ChevronLeft, Store, FileText, Mail, Hash, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVendorRegisterMutation } from '@/src/hooks/vendor/useVendorMutation';
import { vendorRegisterSchema, VendorRegisterInput } from '@/src/types/validation/seller.schema';
import { cn } from '@/lib/utils';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

type Step = 'BASIC' | 'LEGAL' | 'DOCS' | 'PENDING';

export default function VendorRegistrationScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('BASIC');
  const vendorRegister = useVendorRegisterMutation();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<VendorRegisterInput>({
    resolver: zodResolver(vendorRegisterSchema),
  });

  const logo = watch('logo');
  const banner = watch('banner');
  const license = watch('license');

  // ==========================================
  // HANDLERS
  // ==========================================

  const pickImage = async (field: 'logo' | 'banner' | 'license') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      setValue(field, {
        uri: asset.uri,
        name: asset.fileName || `${field}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      });
    }
  };

  const onSubmit = async (data: VendorRegisterInput) => {
    if (!data.logo || !data.banner || !data.license) {
      Alert.alert("Missing Documents", "Please upload all required documents.");
      return;
    }

    try {
      await vendorRegister.mutateAsync(data as any);
      setStep('PENDING');
    } catch (error: any) {
      Alert.alert("Registration Failed", error.response?.data?.message || "Something went wrong");
    }
  };

  // ==========================================
  // STEPS RENDERERS
  // ==========================================

  const renderBasicStep = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 px-6 pt-6">
      <Text className="text-2xl font-bold text-slate-900 mb-2">Store Profile</Text>
      <Text className="text-sm text-slate-500 mb-8">Tell us about your company and what you sell</Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">Store Name</Text>
          <Controller
            control={control}
            name="store_name"
            render={({ field: { onChange, value } }) => (
              <View className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center">
                <Store size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your store name"
                  className="flex-1 ml-3 text-slate-900"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.store_name && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.store_name.message}</Text>}
        </View>

        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <View className="bg-white border border-slate-200 rounded-2xl p-4 min-h-[120px]">
                <TextInput
                  placeholder="Tell customers about your store..."
                  className="flex-1 text-slate-900"
                  multiline
                  textAlignVertical="top"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.description && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</Text>}
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => setStep('LEGAL')}
        className="bg-orange-600 p-4 rounded-2xl items-center justify-center mt-auto mb-10"
      >
        <Text className="text-white font-bold text-lg">Next: Legal Info</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderLegalStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1 px-6 pt-6">
      <TouchableOpacity onPress={() => setStep('BASIC')} className="mb-4 flex-row items-center">
        <ChevronLeft size={20} color="#64748b" />
        <Text className="text-slate-500 ml-1">Store Profile</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-slate-900 mb-2">Legal & Financial</Text>
      <Text className="text-sm text-slate-500 mb-8">Enter your business identifiers for payouts</Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">Payout Email</Text>
          <Controller
            control={control}
            name="payout_email"
            render={({ field: { onChange, value } }) => (
              <View className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center">
                <Mail size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Where should we send payments?"
                  className="flex-1 ml-3 text-slate-900"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.payout_email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.payout_email.message}</Text>}
        </View>

        <View>
          <Text className="text-sm font-medium text-slate-700 mb-2">TIN Number</Text>
          <Controller
            control={control}
            name="tin_number"
            render={({ field: { onChange, value } }) => (
              <View className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center">
                <Hash size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Tax Identification Number"
                  className="flex-1 ml-3 text-slate-900"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.tin_number && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.tin_number.message}</Text>}
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => setStep('DOCS')}
        className="bg-orange-600 p-4 rounded-2xl items-center justify-center mt-auto mb-10"
      >
        <Text className="text-white font-bold text-lg">Next: Verification Documents</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDocsStep = () => (
    <Animated.View entering={SlideInRight} className="flex-1 px-6 pt-6">
      <TouchableOpacity onPress={() => setStep('LEGAL')} className="mb-4 flex-row items-center">
        <ChevronLeft size={20} color="#64748b" />
        <Text className="text-slate-500 ml-1">Legal Info</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-slate-900 mb-2">Upload Documents</Text>
      <Text className="text-sm text-slate-500 mb-8">We need these to verify your business identity</Text>

      <ScrollView showsVerticalScrollIndicator={false} className="space-y-6">
        {/* LOGO */}
        <View>
          <Text className="text-sm font-semibold text-slate-700 mb-3">Company Logo</Text>
          <TouchableOpacity 
            onPress={() => pickImage('logo')}
            className="h-32 border-2 border-dashed border-slate-200 rounded-3xl bg-white items-center justify-center overflow-hidden"
          >
            {logo ? (
              <Image source={{ uri: logo.uri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="items-center">
                <ImageIcon size={32} color="#94a3b8" />
                <Text className="text-xs text-slate-400 mt-2">Upload Square Logo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* BANNER */}
        <View>
          <Text className="text-sm font-semibold text-slate-700 mb-3">Store Banner</Text>
          <TouchableOpacity 
            onPress={() => pickImage('banner')}
            className="h-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white items-center justify-center overflow-hidden"
          >
            {banner ? (
              <Image source={{ uri: banner.uri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="items-center">
                <Upload size={24} color="#94a3b8" />
                <Text className="text-xs text-slate-400 mt-1">Upload Banner Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* LICENSE */}
        <View className="mb-10">
          <Text className="text-sm font-semibold text-slate-700 mb-3">Business License (PDF/Image)</Text>
          <TouchableOpacity 
            onPress={() => pickImage('license')}
            className={cn(
              "p-6 border-2 border-dashed rounded-3xl items-center justify-center bg-white",
              license ? "border-green-200 bg-green-50" : "border-slate-200"
            )}
          >
            {license ? (
              <View className="flex-row items-center">
                <CheckCircle2 size={24} color="#22c55e" />
                <Text className="text-green-700 font-medium ml-3">License Uploaded</Text>
              </View>
            ) : (
              <View className="items-center">
                <FileText size={32} color="#94a3b8" />
                <Text className="text-xs text-slate-400 mt-2">Tap to upload document</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          disabled={vendorRegister.isPending}
          className="bg-slate-900 p-5 rounded-2xl items-center justify-center mb-10"
        >
          {vendorRegister.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const renderPendingStep = () => (
    <Animated.View entering={FadeIn} className="flex-1 px-10 items-center justify-center">
      <View className="bg-orange-50 p-10 rounded-full mb-8">
        <CheckCircle2 size={80} color="#ec5b13" />
      </View>
      <Text className="text-3xl font-bold text-slate-900 text-center mb-4">Application Sent!</Text>
      <Text className="text-center text-slate-500 mb-12">
        Your vendor application has been submitted successfully. Our team will review your documents and notify you via email.
      </Text>
      <TouchableOpacity 
        onPress={() => router.push('/(main)/home')}
        className="bg-slate-900 px-12 py-4 rounded-full"
      >
        <Text className="text-white font-bold">Return to App</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: 'Vendor Registration', headerShown: false }} />
      
      {/* Header bar */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {step === 'BASIC' && 'Step 1 of 3'}
          {step === 'LEGAL' && 'Step 2 of 3'}
          {step === 'DOCS' && 'Step 3 of 3'}
          {step === 'PENDING' && 'Complete'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-slate-400 font-medium">Cancel</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {step === 'BASIC' && renderBasicStep()}
        {step === 'LEGAL' && renderLegalStep()}
        {step === 'DOCS' && renderDocsStep()}
        {step === 'PENDING' && renderPendingStep()}
      </View>
    </SafeAreaView>
  );
}
