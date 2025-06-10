// composables/useUserProfile.ts
import { useSupabaseUser } from '#imports'
import { ref, watchEffect } from 'vue'
import { supabaseService } from "@/services/supabaseService";

const userProfile = ref<any>(null)
const isProfileLoading = ref(false)
const profileError = ref<Error | null>(null)

export const useUserProfile = () => {
    const user = useSupabaseUser()

    const fetchUserProfile = async () => {
        if (!user.value) {
            userProfile.value = null
            return
        }

        isProfileLoading.value = true

        const result = await supabaseService.getMe();

        if (result.error) {
            profileError.value = result.error;
            userProfile.value = null
        } else {
            userProfile.value = result.profile
        }

        isProfileLoading.value = false
    }

    // Réagir à l'authentification ou déconnexion
    watchEffect(() => {
        if (user.value) {
            fetchUserProfile()
        } else {
            userProfile.value = null
        }
    })

    return {
        userProfile,
        isProfileLoading,
        profileError,
        refetchUserProfile: fetchUserProfile
    }
}
