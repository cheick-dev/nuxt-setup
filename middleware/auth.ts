// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async () => {
    const supabase = useSupabaseClient()
    const session = await supabase.auth.getSession()

    if (!session.data.session) {
        return navigateTo('/auth/login')
    }
})
