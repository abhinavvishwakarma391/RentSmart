import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('plotly.js') || id.includes('react-plotly.js')) {
            return 'plotly-vendor';
          }
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'leaflet-vendor';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
