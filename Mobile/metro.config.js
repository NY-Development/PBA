const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withStorybook } = require('@storybook/react-native/withStorybook');

// 1. Get the baseline Expo configuration
let config = getDefaultConfig(__dirname);

// 2. Wrap it with NativeWind v4 (points to your global CSS input)
config = withNativeWind(config, { input: './global.css' });

// 3. Chain it with the Storybook v10 configuration wrapper
module.exports = withStorybook(config, {
  // Update this line to look at the correct EXPO_PUBLIC environment key
  enabled: process.env.EXPO_PUBLIC_STORYBOOK === 'true',
  
  // Explicitly tell Storybook to use your .rnstorybook folder configuration
  configPath: './.rnstorybook', 
});