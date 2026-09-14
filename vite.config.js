import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    // three/ is ~950kB raw (~263kB gzipped) and deliberately isolated: it is
    // lazy-loaded by SceneGate only on capable devices, so it never touches
    // the critical path. The default 500kB warning would flag it on every
    // build for a chunk that is already doing the right thing.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
})
