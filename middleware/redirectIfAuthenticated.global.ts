export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path.startsWith('/auth')) {
        const supabase = useSupabaseClient()
        const { data } = await supabase.auth.getSession()

        if (data.session) {
            return navigateTo('/') // ou la route par défaut
        }
    }
})
