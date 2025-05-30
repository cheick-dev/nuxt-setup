<script setup lang="ts">
import { Button } from "@/components/ui/button";
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

async function resetPassword() {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: `${window.location.origin}/auth/update-password`,
      }
    );

    if (resetError) throw resetError;
    success.value = true;
  } catch (e: any) {
    error.value = e.message || "An error occurred during password reset";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NuxtLayout name="auth">
    <template #title>Reset password</template>
    <template #description>Enter your email to reset your password</template>

    <div class="grid gap-6">
      <form @submit.prevent="resetPassword" class="space-y-4">
        <div class="grid gap-2">
          <p for="email" class="text-sm font-medium leading-none">Email</p>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="name@example.com"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div
          v-if="error"
          class="p-3 bg-destructive/10 text-destructive text-sm rounded-md"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="p-3 bg-success/10 text-success text-sm rounded-md"
        >
          Check your email for the password reset link
        </div>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "Sending reset link..." : "Send Reset Link" }}
        </Button>
      </form>

      <div class="text-center text-sm">
        Remember your password?
        <NuxtLink
          to="/auth/login"
          class="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
