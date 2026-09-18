import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend manzili. Frontend /api va /rasmlar so'rovlarini shu yerga uzatadi,
// shuning uchun brauzer uchun hammasi bitta manzildan keladi va CORS kerak emas.
const BACKEND = 'http://localhost:5277'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': BACKEND,
      '/rasmlar': BACKEND,
    },
  },
})
