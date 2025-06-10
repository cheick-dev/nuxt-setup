import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { handleCreateAnnonce } from "./lib/create.ts";
import { handleUpdateAnnonce } from "./lib/update.ts";
import { handleDeleteAnnonce } from "./lib/delete.ts";
import { handleGetAnnonce } from "./lib/get.ts";

serve(async (req) => {
    const { pathname, method } = new URL(req.url);

    // Create client with service role for elevated access
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (method === "POST" && pathname === "/create") {
        return handleCreateAnnonce(req, supabase);
    }

    if (method === "PUT" && pathname.startsWith("/update/")) {
        const id = pathname.split("/").pop();
        return handleUpdateAnnonce(req, supabase, id!);
    }

    if (method === "DELETE" && pathname.startsWith("/delete/")) {
        const id = pathname.split("/").pop();
        return handleDeleteAnnonce(supabase, id!);
    }

    if (method === "GET" && pathname.startsWith("/get/")) {
        const id = pathname.split("/").pop();
        return handleGetAnnonce(supabase, id!);
    }

    return new Response("Not Found", { status: 404 });
});