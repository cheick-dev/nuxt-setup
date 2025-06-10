export type AuthInfos = {
    email: string;
    full_name?: string;
    password: string;
    role?: string;
};

const baseUrl = 'https://pnkaolisosupgteikyyz.supabase.co/functions/v1';

export const supabaseService = {
    // Auth
    async signup({ email, password, full_name, role }: AuthInfos) {
        const supabase = useSupabaseClient();
        const config = useRuntimeConfig();

        const response = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.public.supabaseKey}`,
            },
            body: JSON.stringify({ email, password, full_name, role }),
        });

        const data = await response.json();

        if (data.session?.access_token && data.session?.refresh_token) {
            await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            });
        }

        return data;
    },

    async signin({ email, password }: AuthInfos) {

        const supabase = useSupabaseClient();
        const config = useRuntimeConfig();

        const response = await fetch(`${baseUrl}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.public.supabaseKey}`,
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.error?.includes("Email not confirmed")) {
            await supabase.auth.resend({
                type: 'signup',
                email: email,
            });
        }

        if (data.session?.access_token && data.session?.refresh_token) {
            await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            });
        }

        return data;
    },

    async getMe() {
        const supabase = useSupabaseClient();
        const session = await supabase.auth.getSession();

        const token = session.data?.session?.access_token;
        if (!token) {
            throw new Error('Session introuvable');
        }

        const response = await fetch(`${baseUrl}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.json();
    },

    async updateMe(payload: AuthInfos) {
        const supabase = useSupabaseClient();
        const config = useRuntimeConfig();
        const session = await supabase.auth.getSession();

        const token = session.data?.session?.access_token;
        if (!token) {
            throw new Error('Session introuvable');
        }

        const response = await fetch(`${baseUrl}/auth/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return response.json();
    },

    // Products
    async createProduct(payload: any) {
        const supabase = useSupabaseClient();
        const session = await supabase.auth.getSession();

        const token = session.data?.session?.access_token;
        if (!token) {
            throw new Error('Session introuvable');
        }

        const response = await fetch(`${baseUrl}/create-product`, {
            method: 'POST',
            headers: {
                // "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`,
            },
            body: payload,
        });

        const data = await response.json();
        return data;
    },
    async getAllProducts() {

        const response = await fetch(`${baseUrl}/get-all-products`)

        const data = await response.json();
        return data.products;
    },
};


