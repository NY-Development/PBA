import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { biometricService } from "../../src/utils/biometrics";

export default function BiometricLoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animation layout allocations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check hardware validation layers
    const initBiometrics = async () => {
      const { isSupported, biometricType: type } = await biometricService.checkSupport();
      setIsBiometricSupported(isSupported);
      setBiometricType(type || "Biometric");
      
      const isEnabled = await biometricService.isBiometricsEnabled();
      
      // Auto-trigger biometric prompt instantly if supported AND enabled in settings
      if (isSupported && isEnabled) {
        handleBiometricAuth();
      } else if (isSupported && !isEnabled) {
        console.warn("[Biometrics] Hardware supported but not enabled for this user account.");
      }
    };

    initBiometrics();

    // Fire entrance layout transitions
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.10,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      const success = await biometricService.loginWithBiometrics(setAuth);
      
      if (success) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          router.replace("/(auth)/home");
        });
      }
    } catch (error) {
      Alert.alert("Authentication Failed", "Unable to log in via biometrics. Please use your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="default" />

      <Animated.View
        className="flex-1 justify-center items-center px-8"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Title Block Header */}
        <View className="items-center mb-16">
          <Text className="text-3xl font-black text-foreground tracking-tight mb-1.5">
            Secure Hub
          </Text>
          <Text className="text-sm font-semibold text-secondary uppercase tracking-widest">
            Identity Verification Gate
          </Text>
        </View>

        {/* Pulsing Scanner Target Area */}
        <Animated.View 
          className="mb-12"
          style={{ transform: [{ scale: pulseAnim }] }}
        >
          <TouchableOpacity
            className={`w-[150px] h-[150px] rounded-full bg-card items-center justify-center border-2 shadow-xl ${
              isLoading ? "border-muted" : "border-primary/20"
            }`}
            style={{
              shadowColor: "#ec7f13", // Maps structurally to your primary theme hex color
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isLoading ? 0 : 0.2,
              shadowRadius: 16,
              elevation: isLoading ? 0 : 8,
            }}
            onPress={handleBiometricAuth}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons
              name={biometricType === "Face ID" ? "scan" : "finger-print"}
              size={74}
              color={isLoading ? "var(--muted-foreground)" : "var(--primary)"}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Dynamic Instructional Layout Metadata */}
        <Text className="text-sm text-muted-foreground text-center px-6 mb-8 leading-5 font-medium">
          {isBiometricSupported
            ? `Verify your identity via ${biometricType} sensor parameters to unlock the storefront`
            : "Biometric validation channels profile unconfigured"}
        </Text>

        {/* Fallback Option Trigger CTA */}
        <TouchableOpacity 
          className="py-3 px-6 rounded-xl bg-card border border-border mb-12 active:opacity-80"
          onPress={() => router.replace("/(auth)/sign-in")}
          activeOpacity={0.8}
        >
          <Text className="text-primary text-sm font-bold">
            Use Email Password Alternative
          </Text>
        </TouchableOpacity>

        {/* Bottom Feature Badges Grid */}
        <View className="flex-row justify-around w-4/5 border-t border-border pt-8">
          <View className="items-center flex-row gap-1.5">
            <Ionicons name="shield-checkmark" size={18} color="var(--success)" />
            <Text className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Encrypted
            </Text>
          </View>
          <View className="items-center flex-row gap-1.5">
            <Ionicons name="flash" size={18} color="var(--primary)" />
            <Text className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Instant
            </Text>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}