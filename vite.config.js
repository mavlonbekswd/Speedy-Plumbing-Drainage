import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// NEXT_PUBLIC_ is accepted alongside VITE_ so the PostHog variable names from
// the PostHog dashboard work unchanged.
const ENV_PREFIX = ['VITE_', 'NEXT_PUBLIC_']

// Substitutes the <!--GOOGLE_TAG--> marker in index.html with the real gtag
// loader, but ONLY when both ids are present and well-formed.
//
// A tag pointing nowhere is worse than no tag, so a malformed id must never
// ship — but it must not take the site down either. This is a plumbing
// company's phone number and quote form; an unset marketing id is not a
// reason to fail the build and leave customers looking at a 404. Unset ids
// drop the tag and log a loud warning; the build carries on.
function googleTag(env, isBuild) {
  const checks = [
    ['VITE_GADS_ID', /^AW-\d{6,}$/, 'AW-1234567890'],
    ['VITE_GA4_ID', /^G-[A-Z0-9]{6,}$/, 'G-ABCDEF1234'],
  ]
  const problems = checks
    .filter(([key, re]) => !re.test(env[key] ?? ''))
    .map(([key, , example]) => `${key} is ${env[key] ? `malformed ("${env[key]}")` : 'unset'} — expected e.g. ${example}`)
  const enabled = problems.length === 0

  return {
    name: 'google-tag',
    configResolved() {
      if (enabled) return
      console.warn(
        `\n[google-tag] ${problems.join('; ')}.` +
          `\n[google-tag] Analytics is DISABLED for this ${isBuild ? 'build' : 'dev server'}; everything else works.` +
          '\n[google-tag] Set these in .env.local (local) or Vercel → Settings → Environment Variables, then redeploy.\n'
      )
    },
    transformIndexHtml(html) {
      const tag = enabled
        ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${env.VITE_GADS_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${env.VITE_GADS_ID}');
      gtag('config', '${env.VITE_GA4_ID}');
    </script>`
        : '<!-- Google tag omitted: VITE_GADS_ID / VITE_GA4_ID not configured. -->'
      return html.replace('<!--GOOGLE_TAG-->', tag)
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX)
  const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  return {
    envPrefix: ENV_PREFIX,
    plugins: [react(), tailwindcss(), googleTag(env, command === 'build')],
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
