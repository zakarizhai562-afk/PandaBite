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
  server: {
    watch: {
      // assets/ holds raw source art (not served -- public/ is what the app
      // actually loads) and can contain large/locked files like a zip an
      // external tool has open, which crashes Vite's watcher with EBUSY.
      // Nothing in the app needs a rebuild when this folder changes.
      ignored: ['**/assets/**'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
