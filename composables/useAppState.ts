// composables/useAppState.ts
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userProfile = ref(null)
const currentStore = ref(null)
const cart = ref<any[]>([])

export const useAppState = () => {
    return {
        isLoggedIn,
        userProfile,
        currentStore,
        cart
    }
}
