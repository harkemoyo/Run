import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Use port 3000
    strictPort: true, // Don't try to find another port if 3000 is in use
    open: true, // Automatically open the app in the default browser
  },
  // Fix for Leaflet marker icons
  define: {
    'process.env': {}
  },
  // Optimize dependencies for faster builds
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-leaflet', 'leaflet']
  },
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
