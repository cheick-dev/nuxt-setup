<!-- components/dashboard/StoreDashboard.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Store Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard label="Produits en vente" :value="stats.products" />
      <StatsCard label="Ventes totales" :value="format(stats.salesAmount)" />
      <StatsCard label="Commandes" :value="stats.orders" />
    </div>
  </div>
</template>

<script setup>
import StatsCard from "./StatsCard.vue";
import { ref, onMounted } from "vue";
import { format } from "@/utils/format";

const stats = ref({ products: 0, salesAmount: 0, orders: 0 });

onMounted(async () => {
  const res = await $fetch("/api/store/stats");
  stats.value = res;
});
</script>
