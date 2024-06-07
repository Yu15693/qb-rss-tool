import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  source: {
    globalVars: {
      __APP_NAME__: process.env.npm_package_name,
      __APP_VERSION__: process.env.npm_package_version,
      __APP_REPOSITORY__: process.env.npm_package_repository,
    },
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
      module: {
        rules: [
          // mdx
          {
            test: /\.mdx?$/,
            use: [
              {
                loader: '@mdx-js/loader',
                /** @type {import('@mdx-js/loader').Options} */
                options: {
                  /* jsxImportSource: …, otherOptions… */
                },
              },
            ],
          },
        ],
      },
    },
  },
  output: {
    polyfill: 'usage',
    disableNodePolyfill: false,
    disableSourceMap: process.env.NODE_ENV === 'production',
  },
});
