import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @repo-radar/ui is consumed straight from source, so Vite must compile it
  // rather than pre-bundle it as an external dependency.
  optimizeDeps: {
    exclude: ['@repo-radar/ui'],
  },
})
