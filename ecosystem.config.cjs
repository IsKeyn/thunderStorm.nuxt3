module.exports = {
  apps: [
    {
      name: 'nuxt-inshprod',
      // Путь к скомпилированному серверу Nuxt 3
      script: '.output/server/index.mjs',

      // МАГИЯ ДЛЯ 2-ЯДЕРНОГО VPS:
      // 'max' заставит PM2 запустить 2 процесса (по одному на ядро)
      // и автоматически балансировать нагрузку между ними!
      instances: 'max',
      exec_mode: 'cluster',

      // Перезапускать процесс, если он съел больше 512 МБ RAM (защита от утечек)
      max_memory_restart: '512M',

      // Переменные окружения (перенесены из package.json для надежности)
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1',
        NUXT_PUBLIC_THEME: 'InSilentHill',
        NUXT_PUBLIC_URL: 'insilenthill.ru',
        NUXT_PUBLIC_API_URL: 'https://backend.insilenthill.ru',
        NUXT_PUBLIC_SESSION_COOKIE_NAME: 'insilenthill_session',
        NUXT_PUBLIC_HAS_WEB_SOCKED_SERVER: 'true',
        NUXT_PUBLIC_REVERB_KEY: 'jsgmx2bq1web3rckobkl',
        NUXT_PUBLIC_REVERB_HOST: 'backend.insilenthill.ru',
        NUXT_PUBLIC_REVERB_PORT: '443',
        NUXT_PUBLIC_REVERB_SCHEME: 'https',
        NUXT_PUBLIC_CRYPTO_PASS: 'ddDD-fT23',
        NUXT_PUBLIC_YM_COUNTER_ID: '53288371'
      }
    }
  ]
};
