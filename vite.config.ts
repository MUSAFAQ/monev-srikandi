import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/monev-srikandi/', // <-- Sudah ditambahkan kutip penutup dan koma
  resolve: {
    dedupe: ['react', 'react-dom'], // Baris ajaib untuk mencegah error Hook
  }
})