// supabase/functions/annonces/lib/get.ts
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function handleGetAnnonce(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase.from("annonces").select("*").eq("id", id).single();
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 404 });
    }
    return new Response(JSON.stringify({ annonce: data }), { status: 200 });
}