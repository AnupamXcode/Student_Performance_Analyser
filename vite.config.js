import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path for GitHub Pages subpath deployment
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
