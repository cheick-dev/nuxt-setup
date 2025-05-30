<script setup lang="ts">
import { Button } from "@/components/ui/button";
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

async function updatePassword() {
  loading.value = true;
  error.value = "";
  success.value = false;

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    loading.value = false;
    return;
  }

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (updateError) throw updateError;
    success.value = true;

    // Redirect after successful password reset
    setTimeout(() => {
      navigateTo("/dashboard");
    }, 2000);
  } catch (e: any) {
    error.value = e.message || "An error occurred while updating your password";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NuxtLayout name="auth">
    <template #title>Update password</template>
    <template #description>Enter your new password</template>

    <div class="grid gap-6">
      <form @submit.prevent="updatePassword" class="space-y-4">
        <div class="grid gap-2">
          <p for="password" class="text-sm font-medium leading-none">
            New Password
          </p>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div class="grid gap-2">
          <p for="confirmPassword" class="text-sm font-medium leading-none">
            Confirm Password
          </p>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
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
          Password updated successfully. Redirecting...
        </div>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "Updating password..." : "Update Password" }}
        </Button>
      </form>
    </div>
  </NuxtLayout>
</template>
