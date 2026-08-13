// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss',
      'floating-vue/nuxt',
  ],
  devtools: { enabled: true },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'floating-vue/dist/style.css',
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
    apiSecret: '123', // Приватный ключ (сюда попадет NUXT_API_SECRET)

    // Keys within public are also exposed client-side
    public: {
      theme: 'KeynTR',
      url: '', // NUXT_PUBLIC_API_URL
      apiUrl: '', // NUXT_PUBLIC_API_URL
      sessionCookieName: '', // NUXT_PUBLIC_SESSION_COOKIE_NAME
      hasWebSockedServer: '', // NUXT_HAS_WEB_SOCKED_SERVER
      reverbKey: '', // NUXT_PUBLIC_REVERB_KEY,
      reverbHost: '', // NUXT_PUBLIC_REVERB_HOST,
      reverbPort: '', // NUXT_PUBLIC_REVERB_PORT,
      reverbScheme: '', // NUXT_PUBLIC_REVERB_SCHEME,
      cryptoPass: '', // NUXT_CRYPTO_PASS,
      ymCounterId: '', // NUXT_YM_COUNTER_ID,
    }
  },
})
