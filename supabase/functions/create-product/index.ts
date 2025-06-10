// supabase/functions/create-product/index.ts
import { serve } from 'https://deno.land/x/sift@0.6.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { multiParser } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'

serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
            global: { headers: { Authorization: req.headers.get('Authorization')! } },
        }
    )

    // Authentification
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Utilisateur non authentifié' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // Parse le multipart/form-data
    const form = await multiParser(req)

    if (!form) {
        return new Response(JSON.stringify({ error: 'Erreur de parsing du formulaire' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const title = form.fields?.title
    const description = form.fields?.description
    const price = form.fields?.price
    const delivery_option = form.fields?.delivery_option
    const store_id = form.fields?.store_id
    const deposit_delay = form.fields?.deposit_delay
    const listing_fee = form.fields?.listing_fee
    const storage_fee_day = form.fields?.storage_fee_day
    const expires_at = form.fields?.expires_at

    // Validation basique
    if (!title || !description || !price || !store_id) {
        return new Response(
            JSON.stringify({ error: 'Champs requis manquants' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }

    try {
        // Insérer le product
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert([
                {
                    title,
                    description,
                    price: parseFloat(price),
                    delivery_option: delivery_option ? delivery_option.split(',') : [],
                    store_id,
                    user_id: user.id,
                    deposit_delay: deposit_delay ? parseInt(deposit_delay) : null,
                    listing_fee: listing_fee ? parseFloat(listing_fee) : null,
                    storage_fee_day: storage_fee_day ? parseFloat(storage_fee_day) : null,
                    expires_at: expires_at ? new Date(expires_at).toISOString() : null,
                },
            ])
            .select()
            .single()

        if (productError) throw productError

        // Upload images
        const imageFiles = form.files?.images
            ? Array.isArray(form.files.images)
                ? form.files.images
                : [form.files.images]
            : []

        const uploadedImageUrls: string[] = []

        for (const image of imageFiles) {
            const fileExt = image.filename?.split('.').pop()
            const filePath = `products/${product.id}/${crypto.randomUUID()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('product_images')
                .upload(filePath, image.content!, {
                    contentType: image.contentType,
                    upsert: true,
                })

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase.storage
                .from('product_images')
                .getPublicUrl(filePath)

            uploadedImageUrls.push(publicUrlData.publicUrl)

            // Insérer dans product_images
            const { error: imageInsertError } = await supabase
                .from('product_images')
                .insert([
                    {
                        product_id: product.id,
                        url: publicUrlData.publicUrl,
                    },
                ])

            if (imageInsertError) throw imageInsertError
        }

        // Réponse succès
        return new Response(
            JSON.stringify({
                message: 'Produit créé avec succès',
                product_id: product.id,
                images: uploadedImageUrls,
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    } catch (err) {
        console.error('Erreur:', err)
        return new Response(
            JSON.stringify({ error: 'Erreur serveur lors de la création du produit' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
})
