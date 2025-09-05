import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Add other HTML entry points if you have them
      },
    },
  },
  // For development server history fallback
  server: {
    fs: {
      strict: false
    }
  }
})