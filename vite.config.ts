import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/dashboard-superhosting', // Add this line
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    watch: {
      usePolling: true
    },
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  build: {
    outDir: 'dist', // optional, but recommended, specify the build directory
  }
});
