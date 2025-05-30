<script setup lang="ts">
import { Button } from "@/components/ui/button";
definePageMeta({
  layout: "auth",
});

const email = ref("");
</script>

<template>
  <NuxtLayout name="auth">
    <template #title>Check your email</template>
    <template #description
      >A confirmation link has been sent to your email address</template
    >

    <div
      class="flex flex-col items-center justify-center space-y-4 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <p class="text-center text-sm text-muted-foreground">
        Please check your email for a confirmation link. If you don't see it,
        check your spam folder.
      </p>
    </div>

    <div class="flex justify-center mt-4">
      <Button as="nuxt-link" to="/auth/login" variant="outline">
        Back to Login
      </Button>
    </div>
  </NuxtLayout>
</template>
