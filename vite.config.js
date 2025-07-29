import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
],
build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // React app entry for content script
        content: 'src/content/content.js', // Content script
        background: 'src/background/background.js', // Background script
        popup: 'src/popup/popup.jsx' // Popup entry
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
