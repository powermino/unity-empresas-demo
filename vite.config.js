import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Para GitHub Pages em subpasta, defina VITE_BASE=/nome-do-repo/
    base: env.VITE_BASE || '/',
    plugins: [react()],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      // Three.js fica em um chunk próprio carregado sob demanda (import dinâmico no Hero)
      chunkSizeWarningLimit: 1100,
    },
  }
})
