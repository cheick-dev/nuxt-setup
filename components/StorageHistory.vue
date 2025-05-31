<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent class="max-w-4xl max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Historique d'entreposage</DialogTitle>
        <DialogDescription>
          Détail des frais et facturation pour ce produit
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
        <!-- Résumé -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
        >
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ totalDays }}</div>
            <div class="text-sm text-gray-500">Jours total</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ freeDaysUsed }}
            </div>
            <div class="text-sm text-gray-500">Jours gratuits</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ formatCurrency(totalFees) }}
            </div>
            <div class="text-sm text-gray-500">Total facturé</div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">Chronologie</h3>

          <div class="relative">
            <!-- Ligne de timeline -->
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div class="space-y-6">
              <!-- Événement de dépôt -->
              <div class="relative flex items-start space-x-4">
                <div
                  class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Package class="w-4 h-4 text-blue-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="font-medium text-gray-900">Produit déposé</p>
                    <Badge variant="secondary">Gratuit</Badge>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(product.deposit_date) }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Début de la période gratuite de
                    {{ product.free_days || 7 }} jours
                  </p>
                </div>
              </div>

              <!-- Fin période gratuite -->
              <div
                v-if="daysStored > (product.free_days || 7)"
                class="relative flex items-start space-x-4"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle class="w-4 h-4 text-yellow-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="font-medium text-gray-900">
                      Fin période gratuite
                    </p>
                    <Badge variant="outline">Transition</Badge>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(freePerioEnd) }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Début facturation
                    {{ formatCurrency(product.daily_fee || 2) }}/jour
                  </p>
                </div>
              </div>

              <!-- Facturations -->
              <div
                v-for="billing in billingHistory"
                :key="billing.id"
                class="relative flex items-start space-x-4"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <Euro class="w-4 h-4 text-red-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="font-medium text-gray-900">
                      Facturation automatique
                    </p>
                    <Badge variant="destructive">{{
                      formatCurrency(billing.amount)
                    }}</Badge>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(billing.date) }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ billing.days_billed }} jour(s) ×
                    {{ formatCurrency(billing.daily_rate) }}
                  </p>
                </div>
              </div>

              <!-- Aujourd'hui -->
              <div class="relative flex items-start space-x-4">
                <div
                  class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <Clock class="w-4 h-4 text-green-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="font-medium text-gray-900">Aujourd'hui</p>
                    <Badge variant="outline">{{ daysStored }} jours</Badge>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(new Date()) }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Statut actuel:
                    {{ isOverdue ? "Période payante" : "Période gratuite" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau détaillé -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">Détail des frais</h3>

          <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left font-medium text-gray-900">
                    Date
                  </th>
                  <th class="px-4 py-3 text-left font-medium text-gray-900">
                    Période
                  </th>
                  <th class="px-4 py-3 text-left font-medium text-gray-900">
                    Jours
                  </th>
                  <th class="px-4 py-3 text-left font-medium text-gray-900">
                    Tarif
                  </th>
                  <th class="px-4 py-3 text-right font-medium text-gray-900">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <!-- Période gratuite -->
                <tr>
                  <td class="px-4 py-3">
                    {{ formatDate(product.deposit_date) }}
                  </td>
                  <td class="px-4 py-3">
                    <Badge
                      variant="secondary"
                      class="bg-green-100 text-green-800"
                    >
                      Gratuit
                    </Badge>
                  </td>
                  <td class="px-4 py-3">
                    {{ Math.min(daysStored, product.free_days || 7) }}
                  </td>
                  <td class="px-4 py-3">{{ formatCurrency(0) }}/jour</td>
                  <td class="px-4 py-3 text-right font-medium text-green-600">
                    {{ formatCurrency(0) }}
                  </td>
                </tr>

                <!-- Période payante -->
                <tr v-if="isOverdue">
                  <td class="px-4 py-3">{{ formatDate(freePerioEnd) }}</td>
                  <td class="px-4 py-3">
                    <Badge variant="destructive"> Payant </Badge>
                  </td>
                  <td class="px-4 py-3">{{ overduedays }}</td>
                  <td class="px-4 py-3">
                    {{ formatCurrency(product.daily_fee || 2) }}/jour
                  </td>
                  <td class="px-4 py-3 text-right font-medium text-red-600">
                    {{ formatCurrency(overduedays * (product.daily_fee || 2)) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="4" class="px-4 py-3 font-medium text-gray-900">
                    Total
                  </td>
                  <td class="px-4 py-3 text-right font-bold text-gray-900">
                    {{ formatCurrency(totalFees) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('close')"> Fermer </Button>
        <Button @click="downloadReport">
          <Download class="w-4 h-4 mr-2" />
          Télécharger le rapport
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed } from "vue";
import { Package, AlertTriangle, Euro, Clock, Download } from "lucide-vue-next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Emits
defineEmits(["close"]);

// const { toast } = useToast();

// Calculs (réutilisés du composant parent)
const daysStored = computed(() => {
  const depositDate = new Date(props.product.deposit_date);
  const today = new Date();
  const diffTime = Math.abs(today - depositDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const freeDaysUsed = computed(() => {
  return Math.min(daysStored.value, props.product.free_days || 7);
});

const isOverdue = computed(
  () => daysStored.value > (props.product.free_days || 7)
);

const overduedays = computed(() => {
  return isOverdue.value
    ? daysStored.value - (props.product.free_days || 7)
    : 0;
});

const totalDays = computed(() => daysStored.value);

const totalFees = computed(() => {
  return overduedays.value * (props.product.daily_fee || 2);
});

const freePerioEnd = computed(() => {
  const depositDate = new Date(props.product.deposit_date);
  depositDate.setDate(depositDate.getDate() + (props.product.free_days || 7));
  return depositDate;
});

// Historique de facturation simulé
const billingHistory = computed(() => {
  if (!isOverdue.value) return [];

  // Simulation d'un historique de facturation
  return [
    {
      id: 1,
      date: freePerioEnd.value,
      amount: overduedays.value * (props.product.daily_fee || 2),
      days_billed: overduedays.value,
      daily_rate: props.product.daily_fee || 2,
    },
  ];
});

// Fonctions utilitaires
const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const downloadReport = () => {
  toast({
    title: "Rapport téléchargé",
    description: "Le rapport d'entreposage a été téléchargé",
  });
};
</script>
