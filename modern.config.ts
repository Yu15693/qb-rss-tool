import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'webpack', // Set to 'experimental-rspack' to enable rspack ⚡️🦀
    }),
  ],
  server: {
    port: 3000,
  },
  tools: {
    webpack: {
      resolve: {
        fallback: {
          http: false,
          https: false,
        },
      },
    },
  },
  output: {
    polyfill: 'usage',
    disableNodePolyfill: false,
    disableSourceMap: process.env.NODE_ENV === 'production',
  },
});
