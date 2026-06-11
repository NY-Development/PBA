import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ChevronRight, ChevronLeft, CreditCard, Camera, FileText, CheckCircle2, ShoppingBag, Landmark } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVerifyCBEMutation, useVerifyTelebirrMutation } from '@/src/hooks/payment/usePaymentMutation';
import { cbePaymentSchema, telebirrPaymentSchema, CBEPaymentInput, TelebirrPaymentInput } from '@/src/types/validation/checkout.schema';
import { extractPaymentData } from '@/src/services/ai/paymentExtraction';
import TextRecognition from '@infinitered/react-native-mlkit-text-recognition';
import { cn } from '@/lib/utils';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

type Step = 'MEANS' | 'INPUT' | 'CONFIRM' | 'SUCCESS';

export default function CheckoutScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [step, setStep] = useState<Step>('MEANS');
  const [paymentMethod, setPaymentMethod] = useState<'CBE' | 'TELEBIRR' | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const verifyCBE = useVerifyCBEMutation();
  const verifyTelebirr = useVerifyTelebirrMutation();

  const cbeForm = useForm<CBEPaymentInput>({
    resolver: zodResolver(cbePaymentSchema),
    defaultValues: { order_id: orderId || '' }
  });

  const telebirrForm = useForm<TelebirrPaymentInput>({
    resolver: zodResolver(telebirrPaymentSchema)
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleScanReceipt = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow camera access to scan your receipt.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setIsScanning(true);
      try {
        const textResult = await TextRecognition.recognizeText(result.assets[0].uri);
        const rawOcrText = textResult.text;
        
        if (!rawOcrText) {
          throw new Error("No text detected in the image.");
        }

        const extracted = await extractPaymentData(rawOcrText, paymentMethod === 'CBE' ? 'cbe' : 'telebirr');
        
        if (paymentMethod === 'CBE') {
          if (extracted.reference) cbeForm.setValue('reference', extracted.reference);
          if (extracted.accountSuffix) cbeForm.setValue('accountSuffix', extracted.accountSuffix);
        } else {
          if (extracted.transactionId) telebirrForm.setValue('transactionId', extracted.transactionId);
          if (extracted.phoneNumber) telebirrForm.setValue('phoneNumber', extracted.phoneNumber);
          if (extracted.amount) telebirrForm.setValue('amount', extracted.amount);
        }
        
        Alert.alert("Success", "Data extracted from receipt. Please verify before submitting.");
      } catch (error) {
        console.error(error);
        Alert.alert("Scan Failed", "Could not extract data from the receipt. Please enter manually.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  const onConfirmPayment = async () => {
    try {
      if (paymentMethod === 'CBE') {
        const data = cbeForm.getValues();
        await verifyCBE.mutateAsync(data);
      } else {
        const data = telebirrForm.getValues();
        await verifyTelebirr.mutateAsync(data);
      }
      setStep('SUCCESS');
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Verification failed");
    }
  };

  // ==========================================
  // STEPS RENDERERS
  // ==========================================

  const renderMeansStep = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 px-6 pt-6">
      <Text className="text-2xl font-bold text-slate-900 mb-2">Payment Method</Text>
      <Text className="text-sm text-slate-500 mb-8">Choose how you paid for your order</Text>

      <TouchableOpacity 
        onPress={() => { setPaymentMethod('CBE'); setStep('INPUT'); }}
        className={cn(
          "bg-white p-6 rounded-3xl mb-4 flex-row items-center border border-slate-100",
          "shadow-sm shadow-slate-200"
        )}
      >
        <View className="bg-blue-50 p-4 rounded-2xl mr-4">
          <Landmark size={28} color="#005b96" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-slate-900">Commercial Bank of Ethiopia</Text>
          <Text className="text-xs text-slate-500">Fast Bank Transfer</Text>
        </View>
        <ChevronRight size={20} color="#cbd5e1" />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => { setPaymentMethod('TELEBIRR'); setStep('INPUT'); }}
        className={cn(
          "bg-white p-6 rounded-3xl mb-4 flex-row items-center border border-slate-100",
          "shadow-sm shadow-slate-200"
        )}
      >
        <View className="bg-orange-50 p-4 rounded-2xl mr-4">
          <ShoppingBag size={28} color="#ec5b13" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-slate-900">Telebirr</Text>
          <Text className="text-xs text-slate-500">Mobile Money</Text>
        </View>
        <ChevronRight size={20} color="#cbd5e1" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderInputStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1 px-6 pt-6">
      <TouchableOpacity onPress={() => setStep('MEANS')} className="mb-4 flex-row items-center">
        <ChevronLeft size={20} color="#64748b" />
        <Text className="text-slate-500 ml-1">Go back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-slate-900 mb-2">Verify Payment</Text>
      <Text className="text-sm text-slate-500 mb-6">Enter transfer details or scan receipt</Text>

      <TouchableOpacity 
        onPress={handleScanReceipt}
        disabled={isScanning}
        className="bg-slate-900 flex-row items-center justify-center p-4 rounded-2xl mb-8 active:opacity-80"
      >
        {isScanning ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Camera size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Scan Receipt with AI</Text>
          </>
        )}
      </TouchableOpacity>

      <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200">
        {paymentMethod === 'CBE' ? (
          <>
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Transfer Details</Text>
            
            <Text className="text-sm font-medium text-slate-700 mb-2">Transaction Reference</Text>
            <Controller
              control={cbeForm.control}
              name="reference"
              render={({ field: { onChange, value } }) => (
                <View className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                  <FileText size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
                  <Text className="ml-8 text-slate-900">
                    {/* Simplified for demo, usually a TextInput */}
                    {value || "Enter Reference"}
                  </Text>
                </View>
              )}
            />

            <Text className="text-sm font-medium text-slate-700 mb-2">Account Suffix (Last 4 digits)</Text>
            <Controller
              control={cbeForm.control}
              name="accountSuffix"
              render={({ field: { onChange, value } }) => (
                <View className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                  <CreditCard size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
                  <Text className="ml-8 text-slate-900">
                    {value || "9012"}
                  </Text>
                </View>
              )}
            />
          </>
        ) : (
          <Text className="text-slate-500 italic">Telebirr Form Fields...</Text>
        )}

        <TouchableOpacity 
          onPress={() => setStep('CONFIRM')}
          className="bg-orange-600 p-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-200"
        >
          <Text className="text-white font-bold text-lg">Next Step</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderConfirmStep = () => (
    <Animated.View entering={FadeIn} className="flex-1 px-6 pt-6 justify-center items-center">
      <View className="bg-white w-full p-8 rounded-[40px] items-center border border-slate-100 shadow-xl shadow-slate-300">
        <View className="bg-blue-50 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} color="#005b96" />
        </View>
        <Text className="text-2xl font-bold text-slate-900 mb-2">Ready to Verify?</Text>
        <Text className="text-center text-slate-500 mb-10 px-4">
          We will check the transaction reference against the bank records to confirm your payment.
        </Text>

        <TouchableOpacity 
          onPress={onConfirmPayment}
          disabled={verifyCBE.isPending || verifyTelebirr.isPending}
          className="bg-slate-900 w-full p-4 rounded-2xl flex-row items-center justify-center mb-4"
        >
          {(verifyCBE.isPending || verifyTelebirr.isPending) ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Verify Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setStep('INPUT')}>
          <Text className="text-slate-400 font-medium">Edit Details</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderSuccessStep = () => (
    <Animated.View entering={FadeIn} className="flex-1 px-6 pt-6 justify-center items-center">
      <View className="items-center">
        <Animated.View entering={FadeIn.delay(200)}>
          <CheckCircle2 size={120} color="#22c55e" />
        </Animated.View>
        <Text className="text-3xl font-bold text-slate-900 mt-8 mb-2">Payment Verified!</Text>
        <Text className="text-center text-slate-500 mb-12">
          Your order is now being processed and you will receive a notification soon.
        </Text>
        <TouchableOpacity 
          onPress={() => router.push('/(main)/home')}
          className="bg-orange-600 px-12 py-4 rounded-full items-center justify-center shadow-lg shadow-orange-200"
        >
          <Text className="text-white font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: 'Checkout Payment', headerShown: false }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {step === 'MEANS' && renderMeansStep()}
        {step === 'INPUT' && renderInputStep()}
        {step === 'CONFIRM' && renderConfirmStep()}
        {step === 'SUCCESS' && renderSuccessStep()}
      </ScrollView>

      {/* Progress Indicator */}
      <View className="px-6 py-4 flex-row justify-center space-x-2">
        {(['MEANS', 'INPUT', 'CONFIRM', 'SUCCESS'] as Step[]).map((s, i) => (
          <View 
            key={s} 
            className={cn(
              "h-1.5 rounded-full",
              step === s ? "w-8 bg-orange-600" : "w-4 bg-slate-200",
              i > (['MEANS', 'INPUT', 'CONFIRM', 'SUCCESS'] as Step[]).indexOf(step) && "bg-slate-200",
              i < (['MEANS', 'INPUT', 'CONFIRM', 'SUCCESS'] as Step[]).indexOf(step) && "bg-orange-200"
            )} 
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
