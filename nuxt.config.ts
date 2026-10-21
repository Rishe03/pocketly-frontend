export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-pg'],
  nuxtPg: {
    // @ts-ignore
    connectionString: process.env.NUXT_DATABASE_URL,
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-04-03',
})