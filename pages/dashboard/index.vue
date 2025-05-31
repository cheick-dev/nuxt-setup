<script setup lang="ts">
import { Button } from "@/components/ui/button";
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});

const user = useSupabaseUser();
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <NuxtLink to="/dashboard/profile"> View Profile </NuxtLink>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div>
        <div>
          <p>Welcome Back</p>
          <p>
            {{ user?.email }}
          </p>
        </div>
        <div>
          <p>Your last login was on {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>

      <div>
        <div>
          <p>Products</p>
          <p>Manage your products</p>
        </div>
        <div>
          <p>You have 0 products in your account.</p>
        </div>
        <divFooter>
          <NuxtLink to="/dashboard/products">View All</NuxtLink>
        </divFooter>
      </div>

      <div>
        <div>
          <p>Donations</p>
          <p>Manage your donations</p>
        </div>
        <div>
          <p>You have 0 donations in your account.</p>
        </div>
        <divFooter>
          <NuxtLink to="/dashboard/donations">View All</NuxtLink>
        </divFooter>
      </div>
    </div>
  </div>
</template>
