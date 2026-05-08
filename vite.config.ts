import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json') as {
  description: string;
  version: string;
};

function readCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return process.env.VITE_COMMIT_SHA ?? 'local';
  }
}

export default defineConfig({
  base: '/openphoto-studio/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'OpenPhoto Studio',
        short_name: 'OpenPhoto',
        description: packageJson.description,
        theme_color: '#111827',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/openphoto-studio/',
        scope: '/openphoto-studio/',
        icons: [
          {
            src: 'pwa-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,wasm,json}'],
        navigateFallback: '/openphoto-studio/index.html'
      }
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION ?? packageJson.version),
    __COMMIT_SHA__: JSON.stringify(readCommit()),
    __REPOSITORY_URL__: JSON.stringify(
      process.env.VITE_REPOSITORY_URL ?? 'https://github.com/baditaflorin/openphoto-studio'
    ),
    __PAYPAL_URL__: JSON.stringify(
      process.env.VITE_PAYPAL_URL ?? 'https://www.paypal.com/paypalme/florinbadita'
    )
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack')) return 'query';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react')) return 'react';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    globals: true
  }
});
