<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Auth {
  user: any;
  token: string | null;
  setSession: (session: {
    user: any;
    access_token: string;
    refresh_token: string;
  }) => void;
  clearSession: () => void;
  restoreSession: () => Promise<void>;
}

// import { useAuth } from "@/composables/useAuth";
import { supabaseService } from "@/services/supabaseService";

definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const showMagicLinkSent = ref(false);

async function signInWithPassword() {
  loading.value = true;
  error.value = "";
  showMagicLinkSent.value = false;

  try {
    const result = await supabaseService.signin({
      email: email.value,
      password: password.value,
    });
    console.log(result);

    if (result.error) {
      error.value = result.error;
    }
    if (result.error?.includes("Email not confirmed")) {
      // afficher un message clair à l'utilisateur
      error.value =
        "Vous devez confirmer votre adresse e-mail avant de vous connecter.";
    }
    await navigateTo("/dashboard");
  } catch (e: any) {
    error.value =
      e.message || "Une erreur est survenue lors de l'authentification";
  } finally {
    loading.value = false;
  }
}

async function signInWithMagicLink() {
  loading.value = true;
  error.value = "";
  showMagicLinkSent.value = false;

  try {
    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (magicLinkError) throw magicLinkError;
    showMagicLinkSent.value = true;
  } catch (e: any) {
    error.value = e.message || "An error occurred sending the magic link";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NuxtLayout name="auth">
    <!-- <template #title>Welcome back</template>
    <template #description>Sign in to your account to continue</template> -->

    <div class="grid gap-6">
      <form @submit.prevent="signInWithPassword" class="space-y-4 w-sm">
        <Card class="w-full">
          <CardHeader>
            <CardTitle class="text-xl"> Connexion </CardTitle>
            <CardDescription>
              Entrez vos informations de connexion
            </CardDescription>
            <div
              v-if="error"
              class="p-3 bg-destructive/10 text-destructive text-sm rounded-md"
            >
              {{ error }}
            </div>
          </CardHeader>
          <CardContent class="text-base">
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  v-model="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  v-model="password"
                />
              </div>
              <Button type="submit" class="w-full" :disabled="loading">
                Connexion
              </Button>
            </div>
            <div class="mt-4">
              <Button variant="outline" class="w-full" :disabled="loading">
                Github
              </Button>
              <div
                v-if="showMagicLinkSent"
                class="p-3 bg-success/10 text-success text-sm rounded-md"
              >
                Check your email for the magic link
              </div>
            </div>
            <div class="mt-4 text-center">
              Pas encore inscrit ?
              <NuxtLink to="/auth/register" class="underline">
                Inscription
              </NuxtLink>
            </div>
          </CardContent>
        </Card>

        <!-- <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "Signing in..." : "Sign In with Password" }}
        </Button> -->
      </form>
    </div>
  </NuxtLayout>
</template>
