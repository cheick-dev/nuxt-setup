<template>
  <Card class="p-6">
    <div class="space-y-6">
      <!-- Header avec badge statut -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Suivi d'entreposage</h3>
        <Badge :variant="storageStatus.variant" :class="storageStatus.class">
          <storageStatus.icon class="w-3 h-3 mr-1" />
          {{ storageStatus.label }}
        </Badge>
      </div>

      <!-- Informations principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="space-y-2">
          <Label class="text-sm text-gray-500">Date de dépôt</Label>
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4 text-gray-400" />
            <span class="font-medium">{{
              formatDate(product.deposit_date)
            }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <Label class="text-sm text-gray-500">Jours entreposés</Label>
          <div class="flex items-center space-x-2">
            <Clock class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-lg">{{ daysStored }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <Label class="text-sm text-gray-500">Jours gratuits restants</Label>
          <div class="flex items-center space-x-2">
            <Gift class="w-4 h-4 text-green-500" />
            <span
              :class="[
                'font-medium text-lg',
                freeDaysRemaining <= 0 ? 'text-red-600' : 'text-green-600',
              ]"
            >
              {{ Math.max(0, freeDaysRemaining) }}
            </span>
          </div>
        </div>

        <div class="space-y-2">
          <Label class="text-sm text-gray-500">Frais accumulés</Label>
          <div class="flex items-center space-x-2">
            <Euro class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-lg text-red-600">
              {{ formatCurrency(product.extra_fees || 0) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <Label class="text-sm font-medium">Période gratuite</Label>
          <span class="text-xs text-gray-500">
            {{ daysStored }}/{{ product.free_days || 7 }} jours
          </span>
        </div>

        <div class="relative">
          <Progress :value="progressPercentage" :class="progressBarClass" />

          <!-- Indicateur de dépassement -->
          <div
            v-if="isOverdue"
            class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
          />
        </div>

        <div class="flex justify-between text-xs text-gray-500">
          <span>Gratuit</span>
          <span v-if="isOverdue" class="text-red-600 font-medium">
            Dépassement: {{ overduedays }} jour(s)
          </span>
          <span>{{ product.free_days || 7 }} jours</span>
        </div>
      </div>

      <!-- Frais journaliers -->
      <div
        v-if="daysStored > (product.free_days || 7)"
        class="p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <div class="flex items-start space-x-3">
          <AlertTriangle class="w-5 h-5 text-red-600 mt-0.5" />
          <div class="flex-1">
            <h4 class="font-medium text-red-900">
              Frais d'entreposage appliqués
            </h4>
            <p class="text-sm text-red-700 mt-1">
              Frais journalier:
              <span class="font-medium"
                >{{ formatCurrency(product.daily_fee || 2) }}/jour</span
              >
            </p>
            <p class="text-xs text-red-600 mt-2">
              Prochaine facturation: {{ formatDate(nextBillingDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Projection des frais -->
      <div
        v-if="freeDaysRemaining <= 2 && freeDaysRemaining > 0"
        class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
      >
        <div class="flex items-start space-x-3">
          <AlertCircle class="w-5 h-5 text-yellow-600 mt-0.5" />
          <div class="flex-1">
            <h4 class="font-medium text-yellow-900">
              Attention: Fin de période gratuite
            </h4>
            <p class="text-sm text-yellow-700 mt-1">
              Dans {{ freeDaysRemaining }} jour(s), des frais de
              <span class="font-medium"
                >{{ formatCurrency(product.daily_fee || 2) }}/jour</span
              >
              seront appliqués.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          @click="showHistory = true"
          class="flex-1 sm:flex-none"
        >
          <History class="w-4 h-4 mr-2" />
          Voir l'historique
        </Button>

        <Button
          v-if="isOverdue"
          variant="destructive"
          size="sm"
          @click="processPayment"
          :disabled="processingPayment"
          class="flex-1 sm:flex-none"
        >
          <template v-if="processingPayment">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            Traitement...
          </template>
          <template v-else>
            <CreditCard class="w-4 h-4 mr-2" />
            Régler les frais
          </template>
        </Button>

        <Button
          variant="default"
          size="sm"
          @click="requestPickup"
          class="flex-1 sm:flex-none"
        >
          <Package class="w-4 h-4 mr-2" />
          Demander le retrait
        </Button>
      </div>
    </div>

    <!-- Modal Historique -->
    <StorageHistory
      v-if="showHistory"
      :product="product"
      @close="showHistory = false"
    />
  </Card>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Calendar,
  Clock,
  Gift,
  Euro,
  AlertTriangle,
  AlertCircle,
  History,
  CreditCard,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import StorageHistory from "~/components/storage/StorageHistory.vue";

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// État local
const showHistory = ref(false);
const processingPayment = ref(false);
// const { toast } = useToast();

// Calculs
const daysStored = computed(() => {
  const depositDate = new Date(props.product.deposit_date);
  const today = new Date();
  const diffTime = Math.abs(today - depositDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const freeDaysRemaining = computed(() => {
  const freeDays = props.product.free_days || 7;
  return freeDays - daysStored.value;
});

const isOverdue = computed(() => freeDaysRemaining.value <= 0);

const overduedays = computed(() => {
  return isOverdue.value ? Math.abs(freeDaysRemaining.value) : 0;
});

const progressPercentage = computed(() => {
  const freeDays = props.product.free_days || 7;
  const percentage = (daysStored.value / freeDays) * 100;
  return Math.min(percentage, 100);
});

const progressBarClass = computed(() => {
  if (progressPercentage.value >= 100) return "progress-red";
  if (progressPercentage.value >= 80) return "progress-yellow";
  return "progress-green";
});

const storageStatus = computed(() => {
  if (isOverdue.value) {
    return {
      label: "Payant",
      variant: "destructive",
      class: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    };
  }

  if (freeDaysRemaining.value <= 2) {
    return {
      label: "Fin proche",
      variant: "secondary",
      class: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle,
    };
  }

  return {
    label: "Gratuit",
    variant: "secondary",
    class: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  };
});

const nextBillingDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today;
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

// Actions
const processPayment = async () => {
  processingPayment.value = true;

  try {
    // Simulation du paiement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Paiement effectué",
      description: `Frais d'entreposage de ${formatCurrency(
        props.product.extra_fees
      )} réglés`,
    });

    // Réinitialiser les frais après paiement
    // Dans une vraie app, cela mettrait à jour la base de données
  } catch (error) {
    toast({
      title: "Erreur de paiement",
      description: "Impossible de traiter le paiement",
      variant: "destructive",
    });
  } finally {
    processingPayment.value = false;
  }
};

const requestPickup = async () => {
  toast({
    title: "Demande de retrait envoyée",
    description: "Vous serez contacté pour organiser le retrait",
  });
};
</script>

<style scoped>
.progress-green :deep(.progress-indicator) {
  background-color: #10b981;
}

.progress-yellow :deep(.progress-indicator) {
  background-color: #f59e0b;
}

.progress-red :deep(.progress-indicator) {
  background-color: #ef4444;
}
</style>
