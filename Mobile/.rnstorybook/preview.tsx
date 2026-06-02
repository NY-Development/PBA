import type { Preview } from '@storybook/react-native';
import { withTailwind } from './withTailwind'; // Adjust this path to where you saved the file above

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  // Load your custom styling decorator here
  decorators: [withTailwind],
};

export default preview;