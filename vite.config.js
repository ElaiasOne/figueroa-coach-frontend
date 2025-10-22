// frontend_figueroa_coach/vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      // permite cualquier túnel, subdominio o IP
      '.localhost.run',
      '.loca.lt',
      '.trycloudflare.com',
      '.lhr.life',
      '.ngrok.io',
      'localhost',
      '127.0.0.1',
      '192.168.0.9'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
