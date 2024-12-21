import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/appointment-api': {
        target: 'http://api-appointment:3002',  // Changed to match docker-compose service name, removed /api
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
