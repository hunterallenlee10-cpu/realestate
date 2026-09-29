// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// Fonts are the Google Fonts families (Instrument Serif + Hanken Grotesk), self-hosted from the
// installed Fontsource packages (latin subset) — no third-party font request, and Astro generates
// metric-matched fallbacks so the swap doesn't shift the layout.
// Private pitch site: static output, deployable to Netlify or Vercel.
// Every page also carries <meta name="robots" content="noindex, nofollow">
// (see src/layouts/Base.astro) plus an X-Robots-Tag header (netlify.toml / vercel.json).
export default defineConfig({
  // Used only for absolute link-preview (Open Graph) URLs. Netlify and Vercel provide the
  // deploy URL at build time; set SITE_URL to override (e.g. once there's a real domain).
  site:
    process.env.SITE_URL ??
    process.env.URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:4321'),
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    // The stylesheet is small; inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-display',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2'],
          },
          {
            weight: 400,
            style: 'italic',
            src: ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-body',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2'],
          },
        ],
      },
    },
  ],
  devToolbar: { enabled: false },
});
