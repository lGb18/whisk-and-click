import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    visualizer({
      open: true, // This automatically opens the visualization in your browser
      filename: 'bundle-stats.html', // Optional: changes the output file name
      gzipSize: true, // Shows sizes after gzip compression (more realistic)
      brotliSize: true, 
    })], 
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
