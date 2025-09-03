// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  // Runtime config para la API de Laravel
  runtimeConfig: {
    // Variables privadas del servidor (solo disponibles en el servidor)
    apiSecret: process.env.API_SECRET,
    
    // Variables públicas (disponibles en cliente y servidor)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/inventario',
      apiVersion: 'v1',
      APP_ENV: process.env.NODE_ENV || 'production'
    }
  },

  // Auto-import types y composables
  imports: {
    presets: [
      {
        from: '~/types/product',
        imports: ['Product', 'Rating'],
        type: true
      }
    ]
  },

  compatibilityDate: '2025-07-16'
})