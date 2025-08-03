import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

// Ortam değişkeninden hedef platformu oku (web veya extension)
const isExtension = process.env.BUILD_TARGET === 'extension';

export default defineConfig({
  plugins: [
    react(),
    // Sadece uzantı için kopyala
    viteStaticCopy({
      targets: isExtension
        ? [
            { src: 'public/manifest.json', dest: '.' },
            { src: 'public/background.js', dest: '.' },
            { src: 'public/inject.js', dest: '.' },
            { src: 'public/asistan1.png', dest: '.' },
          ]
        : [],
    }),
  ],
  build: {
    rollupOptions: {
      input: isExtension
        ? {
            'asistan-ui': resolve(__dirname, 'src/asistan-ui.jsx'), // Uzantı giriş
          }
        : {
            main: resolve(__dirname, 'index.html'), // Web giriş
          },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: isExtension ? 'dist-extension' : 'dist-web',
    emptyOutDir: true,
  },
});
