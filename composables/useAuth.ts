// export const useAuth = () => {
//     interface SignInResponse {
//         session: {
//             access_token: string;
//             refresh_token: string;
//         };
//         user: any;
//     }

//     interface MeResponse {
//         user: any;
//         profile: any;
//     }

//     const user = useState<any>('auth_user', () => null)
//     const token = useState<string | null>('auth_token', () => null)

//     const login = async (email: string, password: string) => {
//         const config = useRuntimeConfig()
//         const { session, user: u } = await $fetch<SignInResponse>(`${config.public.authApiBase}/signin`, {
//             method: 'POST',
//             body: { email, password }
//         })

//         user.value = u
//         token.value = session.access_token

//         localStorage.setItem('access_token', session.access_token)
//         localStorage.setItem('refresh_token', session.refresh_token)
//     }

//     const logout = () => {
//         user.value = null
//         token.value = null
//         localStorage.removeItem('access_token')
//         localStorage.removeItem('refresh_token')
//     }

//     const restoreUser = async () => {
//         const accessToken = localStorage.getItem('access_token')
//         if (!accessToken) return

//         try {
//             const config = useRuntimeConfig()
//             const { user: u, profile } = await $fetch<MeResponse>(`${config.public.authApiBase}/me`, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             })
//             user.value = { ...u, profile }
//             token.value = accessToken
//         } catch (e) {
//             logout()
//         }
//     }

//     return {
//         user,
//         token,
//         login,
//         logout,
//         restoreUser
//     }
// }