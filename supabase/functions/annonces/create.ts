import { type Request } from "https://deno.land/std@0.224.0/http/server.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function handleCreateAnnonce(req: Request, supabase: SupabaseClient) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid user token" }), { status: 401 });
        }

        const body = await req.json();

        const {
            title,
            description,
            price,
            images,
            store_id,
            conditions,
            options,
            deposit_deadline
        } = body;

        const { data, error } = await supabase.from("annonces").insert({
            user_id: user.id,
            title,
            description,
            price,
            images,
            store_id,
            conditions,
            options,
            deposit_deadline
        }).select("*").single();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ annonce: data }), { status: 201 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Server Error", details: e.message }), { status: 500 });
    }
}