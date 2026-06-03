import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // Use '../' to look outside the .rnstorybook folder
  stories: [
    '../stories/**/*.stories.?(ts|tsx|js|jsx)',
    '../components/**/*.stories.?(ts|tsx|js|jsx)'
  ],
  deviceAddons: [
    '@storybook/addon-ondevice-controls', 
    '@storybook/addon-ondevice-actions'
  ],
};

export default main;