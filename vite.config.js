import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/manifest.json', dest: '.' },
        { src: 'public/background.js', dest: '.' },
        { src: 'public/inject.js', dest: '.' },
        { src: 'public/asistan1.png', dest: '.' },      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        'asistan-ui': resolve(__dirname, 'src/asistan-ui.jsx'), // Giriş dosyasını doğru tanımla
      },
      output: {
        entryFileNames: '[name].js', // Çıkış dosyasını asistan-ui.js olarak ayarla
        assetFileNames: 'assets/[name].[ext]', // CSS ve diğer varlıkları assets klasörüne koy
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});