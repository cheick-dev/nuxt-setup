<template>
  <Card class="border-orange-200 bg-orange-50">
    <div class="p-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"
        >
          <Clock class="w-5 h-5 text-orange-600" />
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-orange-900">Produit réservé</h3>
            <Badge variant="secondary" class="bg-orange-100 text-orange-800">
              Réservé
            </Badge>
          </div>
          <p class="text-sm text-orange-700 mt-1">
            Temps restant pour finaliser l'achat
          </p>
        </div>
      </div>

      <!-- Minuteur -->
      <div class="mt-4 space-y-3">
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-900 font-mono">
            {{ formatTime(timeRemaining) }}
          </div>
          <div class="text-xs text-orange-600 mt-1">
            Expire le {{ formatDate(reservation.expiresAt) }}
          </div>
        </div>

        <!-- Barre de progression -->
        <div class="space-y-2">
          <Progress
            :value="progressPercentage"
            class="h-2"
            :class="progressBarClass"
          />
          <div class="flex justify-between text-xs text-orange-600">
            <span>Réservé</span>
            <span>{{ Math.round(progressPercentage) }}%</span>
            <span>Expiration</span>
          </div>
        </div>

        <!-- Détails financiers -->
        <div class="bg-white rounded-lg p-3 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Acompte payé</span>
            <span class="font-medium text-green-600">{{
              formatCurrency(reservation.depositAmount)
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Reste à payer</span>
            <span class="font-medium">{{
              formatCurrency(reservation.remainingAmount)
            }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2">
          <Button
            @click="finalizePayment"
            :disabled="isExpired || isProcessing"
            class="flex-1 bg-green-600 hover:bg-green-700"
          >
            <template v-if="isProcessing">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Traitement...
            </template>
            <template v-else>
              <CreditCard class="w-4 h-4 mr-2" />
              Finaliser ({{ formatCurrency(reservation.remainingAmount) }})
            </template>
          </Button>

          <Button
            variant="outline"
            @click="cancelReservation"
            :disabled="isProcessing"
            class="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>

        <!-- Message d'expiration -->
        <div
          v-if="isExpired"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <AlertTriangle class="w-4 h-4 text-red-600" />
            <span class="text-sm text-red-700 font-medium"
              >Réservation expirée</span
            >
          </div>
          <p class="text-xs text-red-600 mt-1">
            Le produit est de nouveau disponible à la vente
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Clock, CreditCard, X, AlertTriangle, Loader2 } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "vue-sonner";

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["expired", "finalized", "cancelled"]);

// const { toast } = useToast();

// État
const timeRemaining = ref(0);
const isProcessing = ref(false);
let timer = null;

// Calculs
const isExpired = computed(() => timeRemaining.value <= 0);

const progressPercentage = computed(() => {
  const totalDuration =
    new Date(props.reservation.expiresAt) -
    new Date(props.reservation.createdAt);
  const elapsed = totalDuration - timeRemaining.value;
  return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
});

const progressBarClass = computed(() => {
  if (progressPercentage.value >= 90) return "progress-red";
  if (progressPercentage.value >= 70) return "progress-orange";
  return "progress-green";
});

// Fonctions
const updateTimer = () => {
  const now = new Date();
  const expiry = new Date(props.reservation.expiresAt);
  timeRemaining.value = Math.max(0, expiry - now);

  if (timeRemaining.value <= 0 && timer) {
    clearInterval(timer);
    emit("expired", props.reservation);

    toast({
      title: "Réservation expirée",
      description: "Le produit est de nouveau disponible",
      variant: "destructive",
    });
  }
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const finalizePayment = async () => {
  isProcessing.value = true;

  try {
    // Simuler le paiement final
    const paymentResult = await simulateStripePayment({
      amount: props.reservation.remainingAmount,
      productId: props.product.id,
      reservationId: props.reservation.id,
      description: `Paiement final pour ${props.product.title}`,
    });

    if (paymentResult.success) {
      emit("finalized", {
        reservation: props.reservation,
        finalPayment: paymentResult,
      });

      toast({
        title: "Achat finalisé !",
        description: `Vous avez acheté ${
          props.product.title
        } pour ${formatCurrency(props.product.price)}`,
      });
    }
  } catch (error) {
    toast({
      title: "Erreur de paiement",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    isProcessing.value = false;
  }
};

const cancelReservation = () => {
  if (
    confirm(
      "Êtes-vous sûr de vouloir annuler cette réservation ? L'acompte ne sera pas remboursé."
    )
  ) {
    emit("cancelled", props.reservation);

    toast({
      title: "Réservation annulée",
      description: "L'acompte ne sera pas remboursé",
      variant: "destructive",
    });
  }
};

// Simulateur Stripe pour paiement final
const simulateStripePayment = async (paymentData) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const success = Math.random() > 0.05;

  if (!success) {
    throw new Error("Paiement refusé. Veuillez réessayer.");
  }

  return {
    success: true,
    paymentId: `pi_${crypto.randomUUID().slice(0, 24)}`,
    amount: paymentData.amount,
    currency: "eur",
  };
};

// Lifecycle
onMounted(() => {
  updateTimer();
  timer = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.progress-green :deep(.progress-indicator) {
  background-color: #10b981;
}

.progress-orange :deep(.progress-indicator) {
  background-color: #f59e0b;
}

.progress-red :deep(.progress-indicator) {
  background-color: #ef4444;
}
</style>
