<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- En-tête -->
      <div
        class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p class="text-gray-600 capitalize">{{ roleLabels[currentRole] }}</p>
        </div>
        <select
          v-model="currentRole"
          @change="fetchDashboard"
          class="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="admin">Administrateur</option>
          <option value="store">Boutique</option>
          <option value="customer">Client</option>
        </select>
      </div>

      <!-- Métriques principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="metric in currentMetrics"
          :key="metric.label"
          class="bg-white p-6 rounded-lg shadow-sm border-l-4"
          :class="metric.borderColor"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ metric.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ metric.value }}</p>
            </div>
            <component
              :is="metric.icon"
              :class="metric.iconColor"
              class="w-8 h-8"
            />
          </div>
        </div>
      </div>

      <!-- Graphique principal -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">{{ chartConfig.title }}</h3>
        <div class="h-64">
          <SimpleChart
            :data="chartConfig.data"
            :color="chartConfig.color"
            :type="chartConfig.type"
          />
        </div>
      </div>

      <!-- Tableau des données -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">{{ tableConfig.title }}</h3>

        <!-- Tableau pour Admin et Store -->
        <div v-if="currentRole !== 'customer'" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 text-gray-700">Produit</th>
                <th class="text-left py-3 text-gray-700">Ventes</th>
                <th class="text-left py-3 text-gray-700">Revenus</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tableConfig.data"
                :key="item.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 font-medium">{{ item.name }}</td>
                <td class="py-3 text-gray-600">{{ item.sales }}</td>
                <td class="py-3 font-medium text-green-600">
                  {{ formatMoney(item.revenue) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Liste pour Customer -->
        <div v-else class="space-y-3">
          <div
            v-for="purchase in tableConfig.data"
            :key="purchase.id"
            class="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <p class="font-medium">{{ purchase.product }}</p>
              <p class="text-sm text-gray-600">{{ purchase.date }}</p>
            </div>
            <p class="font-bold text-blue-600">
              {{ formatMoney(purchase.amount) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-vue-next";
import SimpleChart from "@/components/dashboard/StatsBox.vue";
import { supabaseService } from "~/services/supabaseService";
// import { useSupabaseClient } from "@supabase/auth-helpers-vue";
// supabaseService

const currentRole = ref("store");

const currentMetrics = ref([]);
// const stats = ref([]);
const chartConfig = ref({ title: "", type: "bar", color: "", data: [] });
const tableConfig = ref({ title: "", data: [] });

const roleLabels = {
  admin: "Administrateur",
  store: "Gestionnaire de Boutique",
  customer: "Client",
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
};

const fetchDashboard = async () => {
  try {
    const { stats } = await supabaseService.getStats();
    // console.log(res);
    // stats.value = res.;

    if (stats.role === "store") {
      currentMetrics.value = [
        {
          label: "Produits",
          value: stats.products,
          icon: Package,
          iconColor: "text-blue-500",
          borderColor: "border-l-blue-500",
        },
        {
          label: "Ventes",
          value: stats.sales,
          icon: ShoppingCart,
          iconColor: "text-green-500",
          borderColor: "border-l-green-500",
        },
        {
          label: "Revenu Total",
          value: formatMoney(stats.total_revenue),
          icon: DollarSign,
          iconColor: "text-yellow-500",
          borderColor: "border-l-yellow-500",
        },
      ];

      chartConfig.value = {
        title: "Dernières transactions",
        type: "bar",
        color: "#10b981",
        data: stats.last_transactions.map((tx) => ({
          label: new Date(tx.paid_at).toLocaleDateString("fr-FR"),
          value: tx.amount,
        })),
      };

      tableConfig.value = {
        title: "Historique des Transactions",
        data: stats.last_transactions.map((tx, i) => ({
          id: i + 1,
          name: `Transaction #${i + 1}`,
          sales: 1,
          revenue: tx.amount,
        })),
      };
    }
  } catch (e) {
    console.error(e);
  }
};

// Appel initial et réactif sur changement de rôle
watch(currentRole, fetchDashboard, { immediate: true });
</script>
