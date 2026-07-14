// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss',
  ],
  devtools: { enabled: true },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  ssr: true,
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },
  vite: {
    optimizeDeps: {
      include: ['laravel-echo', 'pusher-js'],
    },
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      theme: 'KeynTR',
      url: '', // .env NUXT_PUBLIC_API_URL
      apiUrl: '', // .env NUXT_PUBLIC_API_URL
      sessionCookieName: '', // .env NUXT_PUBLIC_SESSION_COOKIE_NAME
      hasWebSockedServer: process.env.NUXT_HAS_WEB_SOCKED_SERVER,
      reverbKey: process.env.NUXT_PUBLIC_REVERB_KEY,
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST,
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT,
      reverbScheme: process.env.NUXT_PUBLIC_REVERB_SCHEME,
      cryptoPass: process.env.NUXT_CRYPTO_PASS,
      ymCounterId: process.env.NUXT_YM_COUNTER_ID,
    }
  },
})
