import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('_SUPABASE_URL')!,
        Deno.env.get('_SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { pathname, method } = new URL(req.url)

    if (method === 'POST' && pathname === '/signup') {
        const { email, password, full_name, role } = await req.json()

        const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
            email,
            password
        })

        if (signUpError) return new Response(JSON.stringify({ error: signUpError.message }), { status: 400 })

        if (user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: user.user.id,
                email,
                full_name,
                role
            })

            if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400 })
        }

        return new Response(JSON.stringify({ user: user.user }), { status: 201 })
    }

    if (method === 'POST' && pathname === '/signin') {
        const { email, password } = await req.json()

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })

        return new Response(JSON.stringify({ session: data.session, user: data.user }), { status: 200 })
    }

    if (method === 'GET' && pathname === '/me') {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) return new Response(JSON.stringify({ error: 'Missing auth header' }), { status: 401 })

        const token = authHeader.replace('Bearer ', '')

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) return new Response(JSON.stringify({ error: error?.message || 'Unauthorized' }), { status: 401 })

        const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single()

        if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400 })

        return new Response(JSON.stringify({ user, profile }), { status: 200 })
    }

    if (method === 'PUT' && pathname === '/me') {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) return new Response(JSON.stringify({ error: 'Missing auth header' }), { status: 401 })

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) return new Response(JSON.stringify({ error: error?.message || 'Unauthorized' }), { status: 401 })

        const payload = await req.json()

        const { error: updateError } = await supabase.from('profiles').update(payload).eq('id', user.id)

        if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 400 })

        return new Response(JSON.stringify({ message: 'Profile updated' }), { status: 200 })
    }

    return new Response('Not found', { status: 404 })
})