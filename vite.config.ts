import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/weeklog/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '${path.resolve(__dirname, 'src/styles/variables')}' as *;`,
      },
    },
  },
})
