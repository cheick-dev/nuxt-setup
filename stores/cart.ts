// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabaseService } from "@/services/supabaseService"

export type ProductImage = {
    id: string
    url: string
    created_at: string
    product_id: string
}

export type Product = {
    id: string
    title: string
    price: number
    barcode: string | null
    user_id: string
    created_at: string
    is_active: boolean
    store_id: string
    description: string
    expires_at: string | null
    deposit_delay: number
    listing_fee: number | null
    storage_fee_day: number | null
    delivery_option: any[]
}

export type CartItem = {
    id: string
    quantity: number
    images: string[]
    product: Product
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const handleRequest = async <T>(fn: () => Promise<T>): Promise<T | null> => {
        loading.value = true
        error.value = null
        try {
            return await fn()
        } catch (err: any) {
            error.value = err.message || 'Une erreur est survenue'
            console.error('CartStore error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    const fetchCart = async () => {
        const response = await handleRequest(() => supabaseService.getMyCart())
        if (response) items.value = response
    }

    const addToCart = async (product_id: string, quantity = 1) => {
        await handleRequest(() => supabaseService.addToCart({ product_id, quantity }))
        await fetchCart()
    }

    const updateQuantity = async (id: string, quantity: number) => {
        await handleRequest(() => supabaseService.updateCartItem({ id, quantity }))
        await fetchCart()
    }

    const removeFromCart = async (id: string) => {
        const response = await handleRequest(() => supabaseService.removeFromCart(id))
        if (response) {
            items.value = items.value.filter(item => item.id !== id)
            await fetchCart()
        }
    }

    const isInCart = (productId: string) =>
        computed(() => items.value.some(item => item.product.id === productId))

    return {
        items,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        isInCart
    }
})
