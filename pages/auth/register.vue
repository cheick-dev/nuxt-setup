<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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

import { supabaseService } from "@/services/supabaseService";
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const full_name = ref("");
const role = ref("customer");
const loading = ref(false);
const error = ref("");

const handleSignup = async () => {
  loading.value = true;
  error.value = "";

  try {
    const result = await supabaseService.signup({
      email: email.value,
      password: password.value,
      full_name: full_name.value,
      role: role.value,
    });
    if (result.error) {
      error.value = result.error;
    }
    if (result.user) console.log(result);

    // auth.setSession(result);
    await navigateTo("/dashboard");
  } catch (e: any) {
    error.value = e.message || "Une erreur est survenue lors de l'inscription";
  } finally {
    loading.value = false;
  }

  // Handle the result (e.g., show a message, redirect, etc.)
};
</script>

<template>
  <NuxtLayout name="auth">
    <div class="grid gap-6 w-full">
      <Card class="w-sm">
        <CardHeader>
          <CardTitle class="text-xl"> Inscription </CardTitle>
          <CardDescription>
            Entrez vos informations d'inscription
          </CardDescription>
          <div
            v-if="error"
            class="p-4 bg-destructive/10 text-destructive text-sm rounded-sm"
          >
            {{ error }}
          </div>
        </CardHeader>
        <CardContent class="text-base">
          <form @submit.prevent="handleSignup" class="w-full space-y-4">
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="first-name">Nom et prénom</Label>
                <Input
                  id="first-name"
                  placeholder="Max Robinson"
                  v-model="full_name"
                  required
                />
              </div>
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  v-model="email"
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
              <Button :disabled="loading" type="submit" class="w-full">
                Creer un compte
              </Button>
            </div>
          </form>
          <CardFooter class="text-center flex flex-col gap-2 mt-4 w-full">
            <Button variant="outline" class="w-full"> Github </Button>
            <div class="mt-4 text-center">
              Déjà inscrit ?
              <NuxtLink to="/auth/login" class="underline">
                Connexion
              </NuxtLink>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
