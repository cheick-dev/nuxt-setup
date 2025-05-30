export default defineNuxtPlugin(() => {
    interface AuthResponse {
        user: any;
        profile: any;
    }

    const user = useState('auth_user', () => null)
    const token = useState<string | null>('auth_token', () => null)

    const setSession = (session: {
        user: any,
        access_token: string,
        refresh_token: string
    }) => {
        user.value = session.user
        token.value = session.access_token
        localStorage.setItem('access_token', session.access_token)
        localStorage.setItem('refresh_token', session.refresh_token)
    }

    const clearSession = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }

    const restoreSession = async () => {
        const savedToken = localStorage.getItem('access_token')
        if (!savedToken) return
        try {
            const { user: u, profile } = await $fetch<AuthResponse>('/api/auth/me', {
                headers: { Authorization: `Bearer ${savedToken}` }
            })
            user.value = { ...u, profile }
            token.value = savedToken
        } catch (e) {
            clearSession()
        }
    }

    return {
        provide: {
            auth: {
                user,
                token,
                setSession,
                clearSession,
                restoreSession
            }
        }
    }
})
