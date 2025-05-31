<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center space-x-2">
          <ShoppingCart class="w-5 h-5 text-blue-600" />
          <span>Réserver ce produit</span>
        </DialogTitle>
        <DialogDescription>
          Sécurisez votre achat avec un acompte
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Informations du produit -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 truncate">
                {{ product.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatCurrency(product.price) }}
              </p>
              <Badge variant="secondary" class="mt-2">
                {{ product.type === "webshop" ? "WebShop" : "Interne" }}
              </Badge>
            </div>
          </div>
        </div>

        <!-- Détails de la réservation -->
        <div class="space-y-4">
          <div
            class="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <AlertTriangle class="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div class="text-sm">
              <p class="font-medium text-yellow-900">
                Acompte non remboursable
              </p>
              <p class="text-yellow-700">
                L'acompte ne sera pas remboursé en cas d'annulation
              </p>
            </div>
          </div>

          <!-- Montants -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Prix du produit</span>
              <span class="font-medium">{{
                formatCurrency(product.price)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600"
                >Acompte ({{ depositPercentage }}%)</span
              >
              <span class="font-medium text-blue-600">{{
                formatCurrency(depositAmount)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Reste à payer</span>
              <span class="font-medium">{{
                formatCurrency(remainingAmount)
              }}</span>
            </div>
            <hr />
            <div class="flex justify-between items-center text-lg">
              <span class="font-medium">À payer maintenant</span>
              <span class="font-bold text-blue-600">{{
                formatCurrency(depositAmount)
              }}</span>
            </div>
          </div>

          <!-- Durée de blocage -->
          <div
            class="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <Clock class="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div class="text-sm">
              <p class="font-medium text-blue-900">Durée de réservation</p>
              <p class="text-blue-700">
                {{ reservationDuration }}h pour finaliser l'achat
              </p>
            </div>
          </div>

          <!-- Conditions -->
          <div class="text-xs text-gray-500 space-y-1">
            <p>• Le produit sera bloqué pendant {{ reservationDuration }}h</p>
            <p>• Vous devrez finaliser l'achat avant expiration</p>
            <p>• Le vendeur sera notifié de votre réservation</p>
            <p>• L'acompte sera déduit du prix final</p>
          </div>
        </div>

        <!-- Erreur -->
        <div
          v-if="error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <XCircle class="w-4 h-4 text-red-600" />
            <span class="text-sm text-red-700">{{ error }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <Button
            @click="processReservation"
            :disabled="isProcessing"
            class="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <template v-if="isProcessing">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Traitement en cours...
            </template>
            <template v-else>
              <CreditCard class="w-4 h-4 mr-2" />
              Payer {{ formatCurrency(depositAmount) }}
            </template>
          </Button>

          <Button
            variant="outline"
            @click="$emit('close')"
            class="w-full"
            :disabled="isProcessing"
          >
            Annuler
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  ShoppingCart,
  AlertTriangle,
  Clock,
  CreditCard,
  Loader2,
  XCircle,
} from "lucide-vue-next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "vue-sonner";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "reserved"]);

// État
const isProcessing = ref(false);
const error = ref("");

// Configuration
const depositPercentage = 20; // 20% d'acompte
const reservationDuration = 24; // 24h de blocage

// Calculs
const depositAmount = computed(() => {
  return (props.product.price * depositPercentage) / 100;
});

const remainingAmount = computed(() => {
  return props.product.price - depositAmount.value;
});

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const processReservation = async () => {
  error.value = "";
  isProcessing.value = true;

  try {
    // Vérifier si le produit est toujours disponible
    if (props.product.status !== "en_stock") {
      throw new Error("Ce produit n'est plus disponible à la réservation");
    }

    // Simuler l'intégration Stripe
    const paymentResult = await simulateStripePayment({
      amount: depositAmount.value,
      productId: props.product.id,
      description: `Acompte pour ${props.product.title}`,
    });

    if (paymentResult.success) {
      // Créer la réservation
      const reservation = {
        id: crypto.randomUUID(),
        productId: props.product.id,
        userId: "current-user-id", // À remplacer par l'ID utilisateur réel
        depositAmount: depositAmount.value,
        remainingAmount: remainingAmount.value,
        expiresAt: new Date(Date.now() + reservationDuration * 60 * 60 * 1000),
        paymentId: paymentResult.paymentId,
        status: "active",
        createdAt: new Date(),
      };

      // Sauvegarder en base (simulation)
      console.log("Réservation créée:", reservation);

      // Notifier le parent
      emit("reserved", {
        product: props.product,
        reservation: reservation,
      });

      // Notification de succès
      toast({
        title: "Réservation confirmée !",
        description: `Produit réservé pour ${reservationDuration}h. Vous avez payé ${formatCurrency(
          depositAmount.value
        )} d'acompte.`,
      });

      // Notification au vendeur (simulation)
      setTimeout(() => {
        toast({
          title: "Vendeur notifié",
          description: "Le vendeur a été informé de votre réservation",
        });
      }, 1000);

      emit("close");
    }
  } catch (err) {
    error.value = err.message;

    toast({
      title: "Erreur de réservation",
      description: err.message,
      variant: "destructive",
    });
  } finally {
    isProcessing.value = false;
  }
};

// Simulateur Stripe
const simulateStripePayment = async (paymentData) => {
  // Simulation d'un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulation d'un taux de succès de 95%
  const success = Math.random() > 0.05;

  if (!success) {
    throw new Error(
      "Paiement refusé. Veuillez vérifier vos informations bancaires."
    );
  }

  return {
    success: true,
    paymentId: `pi_${crypto.randomUUID().slice(0, 24)}`,
    amount: paymentData.amount,
    currency: "eur",
  };
};
</script>
