import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'sass:color'; @use 'variables' as *;`,
        loadPaths: [path.resolve(__dirname, 'src/styles')],
      },
    },
  },
})
