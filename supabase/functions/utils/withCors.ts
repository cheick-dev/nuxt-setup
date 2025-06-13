// utils/withCors.ts
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // En production, remplace par le vrai domaine
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
}

export async function withCors(handler: (req: Request) => Promise<Response> | Response) {
    return async (req: Request): Promise<Response> => {
        if (req.method === "OPTIONS") {
            return new Response("ok", {
                headers: corsHeaders,
            })
        }

        const response = await handler(req)

        // Cloner les headers de la réponse d'origine et ajouter les CORS
        const newHeaders = new Headers(response.headers)
        for (const [key, value] of Object.entries(corsHeaders)) {
            newHeaders.set(key, value)
        }

        return new Response(await response.text(), {
            status: response.status,
            headers: newHeaders,
        })
    }
}


//   usage

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { withCors } from "../utils/withCors.ts" // adapte le chemin si nécessaire

serve(withCors(async (req) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: { Authorization: req.headers.get("Authorization")! },
            },
        }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // Le reste de ta logique comme GET, POST, etc.
    // ...

    return new Response(JSON.stringify({ message: "OK" }))
}))
