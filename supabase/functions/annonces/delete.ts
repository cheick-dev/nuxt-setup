import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function handleDeleteAnnonce(supabase: SupabaseClient, id: string) {
    const { error } = await supabase.from("annonces").delete().eq("id", id);
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}