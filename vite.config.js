import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Stub Node.js modules used by tau-prolog's readline-sync dependency
      // (only needed for Node.js CLI REPL, not used in browser)
      'readline-sync': path.resolve('./src/core/prolog/readline-sync-stub.js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
