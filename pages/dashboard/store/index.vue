<template>
  <div class="flex bg-gray-50">
    <!-- Contenu principal -->
    <div class="flex-1 p-4 lg:p-6 mb-10 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Edge Function Simulator -->
        <EdgeFunctionSimulator />

        <!-- Produits en entreposage -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Produits en dépôt</h2>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StorageTracker
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "store",
  title: "Suivi d'entreposage",
});
import { ref } from "vue";

import StorageTracker from "@/components/StorageTracker";
import EdgeFunctionSimulator from "@/components/EdgeFunctionSimulator";

// Données simulées
const products = ref([
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    deposit_date: "2024-01-15",
    free_days: 7,
    daily_fee: 2,
    extra_fees: 6,
    status: "stored",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    deposit_date: "2024-01-20",
    free_days: 7,
    daily_fee: 3,
    extra_fees: 0,
    status: "stored",
  },
  {
    id: 3,
    title: "Samsung Galaxy S24",
    deposit_date: "2024-01-10",
    free_days: 7,
    daily_fee: 2,
    extra_fees: 12,
    status: "stored",
  },
]);
</script>
