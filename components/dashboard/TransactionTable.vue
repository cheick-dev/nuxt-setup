/ components/ui/TransactionTable.vue
<template>
  <Card class="p-4 shadow-md rounded-2xl overflow-auto">
    <h3 class="text-lg font-semibold mb-4">Historique des transactions</h3>
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-sm text-muted-foreground">
          <th class="pb-2">Produit</th>
          <th class="pb-2">Montant</th>
          <th class="pb-2">Acheteur</th>
          <th class="pb-2">Statut</th>
          <th class="pb-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="txn in transactions" :key="txn.id" class="text-sm border-t">
          <td class="py-2">{{ txn.product_name || "N/A" }}</td>
          <td class="py-2">{{ txn.amount }} FCFA</td>
          <td class="py-2">{{ txn.buyer_name || "Inconnu" }}</td>
          <td class="py-2">{{ txn.status }}</td>
          <td class="py-2">{{ new Date(txn.paid_at).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>

<script setup>
import { Card } from "@/components/ui/card";

defineProps({
  transactions: Array,
});
</script>
