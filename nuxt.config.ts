// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss',
  ],
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiUrl: '', // .env NUXT_PUBLIC_API_URL
    }
  },
})
