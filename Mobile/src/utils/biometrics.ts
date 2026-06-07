import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import api from '../api/client';

const BIO_ENABLED_KEY = 'user_biometric_enabled';
const BIO_CREDENTIALS_KEY = 'user_biometric_credentials';

export const biometricService = {
  /**
   * Evaluates if the running device hardware features biometric capability 
   * and contains enrolled biometric indices.
   */
  checkSupport: async (): Promise<{ isSupported: boolean; biometricType: string }> => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return { isSupported: false, biometricType: '' };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return { isSupported: false, biometricType: '' };
    }

    const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return { isSupported: true, biometricType: 'Face ID' };
    } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return { isSupported: true, biometricType: 'Fingerprint' };
    }
    
    return { isSupported: true, biometricType: 'Biometric' };
  },

  /**
   * Persists biometric registration records inside hardware-backed secure storage.
   * Call this when a user toggles 'Enable Biometrics' inside their settings.
   */
  enableBiometrics: async (email: string, refreshToken: string): Promise<boolean> => {
    try {
      const { isSupported } = await biometricService.checkSupport();
      if (!isSupported) {
        Alert.alert('Not Supported', 'Biometric hardware verification is unavailable or missing enrolled indices.');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authorize Biometrics for Secure Access',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await SecureStore.setItemAsync(BIO_ENABLED_KEY, 'true');
        await SecureStore.setItemAsync(BIO_CREDENTIALS_KEY, JSON.stringify({ email, refreshToken }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to write biometric registration keys:', error);
      return false;
    }
  },

  /**
   * Removes local credential hashes from the secure hardware vault.
   */
  disableBiometrics: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(BIO_ENABLED_KEY);
    await SecureStore.deleteItemAsync(BIO_CREDENTIALS_KEY);
  },

  /**
   * Checks if biometric authentication has been explicitly configured by the user.
   */
  isBiometricsEnabled: async (): Promise<boolean> => {
    const enabled = await SecureStore.getItemAsync(BIO_ENABLED_KEY);
    return enabled === 'true';
  },

  /**
   * Fires the hardware biometric gate, decrypts stored refresh token pairings,
   * and requests a clean session bundle from your Express database router.
   */
  loginWithBiometrics: async (setAuth: Function): Promise<boolean> => {
    try {
      const isEnabled = await biometricService.isBiometricsEnabled();
      if (!isEnabled) return false;

      const credentialsRaw = await SecureStore.getItemAsync(BIO_CREDENTIALS_KEY);
      if (!credentialsRaw) return false;

      const credentials = JSON.parse(credentialsRaw);

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in with Biometrics',
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        // Authenticate directly against your Express endpoint using the secure token hash
        const response = await api.post('/auth/login-biometric', {
          email: credentials.email,
          securePayloadToken: credentials.refreshToken,
        });

        const { user, accessToken, refreshToken } = response.data;
        
        // Populate your global Zustand authentication instance store variables
        setAuth(user, accessToken, refreshToken);

        // Keep local token targets fresh inside hardware memory bounds
        await SecureStore.setItemAsync(BIO_CREDENTIALS_KEY, JSON.stringify({ email: user.email, refreshToken }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric network token evaluation pipeline failure:', error);
      return false;
    }
  }
};