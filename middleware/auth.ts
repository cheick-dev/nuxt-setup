// export default defineNuxtRouteMiddleware(async (to) => {
//     //   const user = useSupabaseUser()
//     //   const supabase = useSupabaseClient()

//     const user = useState('auth_user')
//     if (!user.value) {
//         return navigateTo('/login')
//     }

//     //   // If user is not logged in, redirect to login page
//     //   if (!user.value) {
//     //     return navigateTo('/auth/login')
//     //   }

//     //   // Check if the user session is still valid
//     //   const { data, error } = await supabase.auth.getSession()
//     //   if (error || !data.session) {
//     //     return navigateTo('/auth/login')
//     //   }
// })

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async () => {
    const supabase = useSupabaseClient()
    const session = await supabase.auth.getSession()

    if (!session.data.session) {
        return navigateTo('/auth/login')
    }
})
