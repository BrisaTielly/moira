import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // O navegador só conhece /api; o Vite repassa ao backend .NET (perfil http do launchSettings).
    proxy: {
      '/api': 'http://localhost:5152',
    },
  },
})
