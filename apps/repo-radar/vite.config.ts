import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // The @repo-radar/* packages are Yarn workspace links, so Vite serves them
  // from source and skips pre-bundling automatically — no config needed.
})
