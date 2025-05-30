// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },

    modules: ["@nuxtjs/supabase", 'shadcn-nuxt'],

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
        // The private keys which are only available within server-side
        apiSecret: '123',
        // Keys within public, will be also exposed to the client-side
        public: {
            authApiBase: process.env.AUTH_FUNCTION_URL,
            supabaseKey: process.env.SUPABASE_KEY,

        }
    }
});