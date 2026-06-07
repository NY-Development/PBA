import React, { useEffect, PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

// Global Handler configuring cross-platform notification behaviors
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,     // Supports dynamic application badge counts
    shouldShowBanner: true,   // Required by Expo's updated native type definition
    shouldShowList: true,     // Required by Expo's updated native type definition
  }),
});

const PushNotificationManager: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();

  // Register for push notifications securely
  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#ff9514', // Custom premium Neon Orange branding accent
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Check if permissions are granted
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }

      // Get Expo Push Token cleanly using configured Expo Project profiles
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
          console.error('No project ID found. Please configure in your app.json profile.');
          return;
        }

        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
          })
        ).data;

        console.log('✅ Synchronized Expo Push Token:', token);
        return token;
      } catch (error) {
        console.error('Detailed Error getting push token:', error);
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
        }
      }
    } else {
      console.warn('Must use physical hardware device configurations for active Push Notification testing.');
    }

    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        // TODO: Fire an Axios endpoint patch here to save token to your Neon PostgreSQL User table
        // Example: api.patch('/auth/sync-push-token', { pushToken: token });
      }
    });

    // Notification received listener loop (Fires when app is active and foregrounded)
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 Notification Received in Foreground:', notification.request.content.data);
      },
    );

    // Notification tap listener loop (Handles background resume/deep linking operations)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, any>;
      console.log('🎯 Notification Interactive Action Tapped:', data);

      // Automatic Navigation Routine Route Handlers
      if (data?.type === 'ORDER_UPDATE' || data?.type === 'DISCOUNT_ALERT' || data?.screen === 'NotificationScreen') {
        router.push('/(main)/(tabs)/profile');
      }
    });

    // Clean up subscriptions on unmount to prevent duplicate listener registries and memory leaks
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove(); // ✨ Fixed: Cleans up the tap listener loop cleanly
    };
  }, [router]); // ✨ Fixed: Added router to the dependency array

  return <>{children}</>;
};

export default PushNotificationManager;