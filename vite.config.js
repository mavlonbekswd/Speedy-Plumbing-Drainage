import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// NEXT_PUBLIC_ is accepted alongside VITE_ so the PostHog variable names from
// the PostHog dashboard work unchanged.
const ENV_PREFIX = ['VITE_', 'NEXT_PUBLIC_']

// index.html embeds %VITE_GADS_ID% / %VITE_GA4_ID%. A missing or malformed id
// would ship a tag pointing nowhere while the page source looks tagged, so a
// production build refuses to run; dev only warns.
function requireGoogleIds(env, isBuild) {
  const checks = [
    ['VITE_GADS_ID', /^AW-\d{6,}$/, 'AW-1234567890'],
    ['VITE_GA4_ID', /^G-[A-Z0-9]{6,}$/, 'G-ABCDEF1234'],
  ]
  return {
    name: 'require-google-ids',
    configResolved() {
      const problems = checks
        .filter(([key, re]) => !re.test(env[key] ?? ''))
        .map(([key, , example]) => `${key} is ${env[key] ? `malformed ("${env[key]}")` : 'unset'} — expected e.g. ${example}`)
      if (!problems.length) return
      const message = `[google-tag] ${problems.join('; ')}. Set it in .env.local or the Vercel project env.`
      if (isBuild) throw new Error(message)
      console.warn(message)
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX)
  const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  return {
    envPrefix: ENV_PREFIX,
    plugins: [react(), tailwindcss(), requireGoogleIds(env, command === 'build')],
    server: {
      port: Number(process.env.PORT) || 5173,
      // Mirrors the /ingest rewrites in vercel.json.
      proxy: {
        '/ingest/static': {
          target: posthogHost.replace('.i.posthog.com', '-assets.i.posthog.com'),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
        '/ingest': {
          target: posthogHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
      },
    },
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
  }
})
