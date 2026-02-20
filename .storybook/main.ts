import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
    },
    build: {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        external: ['vite-plugin-pwa'],
      },
    },
  }),
};

export default config;
