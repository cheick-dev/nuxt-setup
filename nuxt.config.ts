// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },

    modules: ["@nuxtjs/supabase", 'shadcn-nuxt', '@vueuse/nuxt', '@pinia/nuxt'],

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
        PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
        public: {
            authApiBase: process.env.AUTH_FUNCTION_URL,
            supabaseKey: process.env.SUPABASE_KEY,
            payStacPuclicKey: process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        }
    }
});