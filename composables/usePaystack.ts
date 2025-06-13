export const usePaystackPayment = () => {
    const config = useRuntimeConfig()
    const pay = ({
        email,
        amount, // en kobo = Naira * 100
        metadata = {},
        onSuccess,
        onClose
    }: {
        email: string
        amount: number
        metadata?: any
        onSuccess: (ref: string) => void
        onClose?: () => void
    }) => {
        const handler = (window as any).PaystackPop?.setup({
            key: config.public.payStacPuclicKey,
            email,
            amount,
            currency: 'XOF',
            metadata,
            callback: (response: any) => {
                // callback quand le paiement réussit
                onSuccess(response.reference)
            },
            onClose: () => {
                if (onClose) onClose()
            }
        })

        handler.openIframe()
    }

    return {
        pay
    }
}
