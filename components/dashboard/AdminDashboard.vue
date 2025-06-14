<!-- components/dashboard/AdminDashboard.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard label="Transactions totales" :value="stats.total" />
      <StatsCard
        label="Ventes totales (FCFA)"
        :value="format(stats.totalAmount)"
      />
      <StatsCard label="Utilisateurs inscrits" :value="stats.totalUsers" />
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Transactions récentes</h2>
      <ul class="space-y-2">
        <li
          v-for="txn in recent"
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

const stats = ref({ total: 0, totalAmount: 0, totalUsers: 0 });
const recent = ref([]);

onMounted(async () => {
  const res = await $fetch("/api/admin/stats");
  stats.value = res.stats;
  recent.value = res.recentTransactions;
});
</script>
