<!-- components/dashboard/CustomerDashboard.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Mon compte</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard label="Commandes" :value="stats.orders" />
      <StatsCard label="Dépenses totales" :value="format(stats.totalSpent)" />
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Mes achats</h2>
      <ul class="space-y-2">
        <li
          v-for="txn in transactions"
          :key="txn.id"
          class="border rounded-lg p-3 text-sm"
        >
          {{ txn.status }} - {{ format(txn.amount) }} -
          {{ new Date(txn.paid_at).toLocaleDateString() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import StatsCard from "./StatsCard.vue";
import { ref, onMounted } from "vue";
import { format } from "@/utils/format";

const stats = ref({ orders: 0, totalSpent: 0 });
const transactions = ref([]);

onMounted(async () => {
  const res = await $fetch("/api/customer/stats");
  stats.value = res.stats;
  transactions.value = res.transactions;
});
</script>
