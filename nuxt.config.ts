// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/image'],
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
})
