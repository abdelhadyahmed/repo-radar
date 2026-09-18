import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @repo-radar/ui and @repo-radar/store are consumed straight from source, so Vite must compile them
  // rather than pre-bundle them as external dependencies.
  optimizeDeps: {
    exclude: ['@repo-radar/ui', '@repo-radar/store'],
  },
})
