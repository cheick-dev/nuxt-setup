<template>
  <Toaster />
  <NuxtLayout>
    <ClientOnly>
      <Toaster />
    </ClientOnly>

    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
useHead({
  script: [
    {
      src: "https://js.paystack.co/v1/inline.js",
      async: true,
    },
  ],
});
</script>
