// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss',
      'nuxt-yandex-metrika',
  ],
  devtools: { enabled: true },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  yandexMetrika: {
    id: '53288371',
    // debug: process.env.NODE_ENV !== "production",
    // delay: 0,
    // cdn: false,
    // verification: null, // Verification in Yandex Webmaster
    options: {
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    },
  },
  ssr: true,
  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
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
    }
  },
  experimental: {
    payloadExtraction: false
  },
})
