export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '@/assets/global.css',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // Elimina '@nuxtjs/dotenv'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  router: {
    middleware: ['auth'], // Añade tu middleware aquí
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL // Usando la variable de entorno
    }
  }
});
