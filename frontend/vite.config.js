import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [vue(), commonjs()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  assetsInclude: [
    '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg',
    '**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.GIF', '**/*.SVG',
    '**/*.webp', '**/*.avif', '**/*.mp4', '**/*.mp3', '**/*.woff', '**/*.woff2'
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,  // changed port
    https: false, // SSL removed
    hmr: {
      protocol: 'ws', // switch from wss to ws since no SSL
      host: 'localhost' // adjust as needed for local dev
    }
  }
})
