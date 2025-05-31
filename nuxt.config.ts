// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },

    modules: ["@nuxtjs/supabase", 'shadcn-nuxt', '@vueuse/nuxt'],

    css: ['~/assets/css/main.css'],

    vite: {
        plugins: [tailwindcss()],
    },

    supabase: {
        redirectOptions: {
            login: '/auth/login',
            callback: '/auth/confirm',
            exclude: ['/', '/auth/*'],
        }
    },

    runtimeConfig: {

        public: {
            authApiBase: process.env.AUTH_FUNCTION_URL,
            supabaseKey: process.env.SUPABASE_KEY,

        }
    }
});