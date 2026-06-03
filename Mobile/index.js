import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// 1. Direct environment variable lookup
if (process.env.EXPO_PUBLIC_STORYBOOK === 'true') {
  
  // Point straight into the explicit .rnstorybook config entry
  require('./.rnstorybook/index');

} else {

  // 2. Default Expo Router workspace entry point
  const { registerRootComponent } = require('expo');
  const { ExpoRoot } = require('expo-router');
  
  const ctx = require.context('./app');
  
  function App() {
    return <ExpoRoot context={ctx} />;
  }
  
  registerRootComponent(App);
}