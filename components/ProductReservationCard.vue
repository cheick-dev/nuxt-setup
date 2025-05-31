<template>
  <Card class="overflow-hidden hover:shadow-md transition-shadow">
    <div class="p-4 space-y-4">
      <!-- Header avec statut -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-900 truncate">
            {{ product.title }}
          </h3>
          <p class="text-sm text-gray-500 line-clamp-2 mt-1">
            {{ product.description }}
          </p>
        </div>
        <StatusBadge :status="product.status" />
      </div>

      <!-- Prix -->
      <div class="text-lg font-bold text-gray-900">
        {{ formatCurrency(product.price) }}
      </div>

      <!-- Réservation active -->
      <ReservationTimer
        v-if="activeReservation"
        :reservation="activeReservation"
        :product="product"
        @expired="handleReservationExpired"
        @finalized="handleReservationFinalized"
        @cancelled="handleReservationCancelled"
      />

      <!-- Bouton de réservation -->
      <div v-else-if="product.status === 'en_stock'" class="space-y-2">
        <Button
          @click="showReservationModal = true"
          class="w-full bg-blue-600 hover:bg-blue-700"
        >
          <ShoppingCart class="w-4 h-4 mr-2" />
          Réserver ce produit
        </Button>
        <p class="text-xs text-gray-500 text-center">
          Acompte de {{ depositPercentage }}% • Blocage
          {{ reservationDuration }}h
        </p>
      </div>

      <!-- Produit non disponible -->
      <div v-else class="text-center py-2">
        <Badge variant="secondary" class="bg-gray-100 text-gray-600">
          {{ getStatusLabel(product.status) }}
        </Badge>
      </div>
    </div>

    <!-- Modal de réservation -->
    <ReservationModal
      v-if="showReservationModal"
      :product="product"
      @close="showReservationModal = false"
      @reserved="handleProductReserved"
    />
  </Card>
</template>

<script setup>
import { ref, computed } from "vue";
import { ShoppingCart } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";

import StatusBadge from "@/components/StatusBadge.vue";
import ReservationModal from "@/components/ReservationModal.vue";
import ReservationTimer from "~/components/ReservationTimer.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["product-updated", "reservation-created"]);

// const { toast } = useToast();

// État
const showReservationModal = ref(false);
const activeReservation = ref(null);

// Configuration
const depositPercentage = 20;
const reservationDuration = 24;

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const getStatusLabel = (status) => {
  const labels = {
    reserve: "Réservé",
    vendu: "Vendu",
    archive: "Archivé",
  };
  return labels[status] || status;
};

const handleProductReserved = ({ product, reservation }) => {
  activeReservation.value = reservation;

  // Mettre à jour le statut du produit
  emit("product-updated", {
    ...product,
    status: "reserve",
  });

  emit("reservation-created", reservation);
};

const handleReservationExpired = (reservation) => {
  activeReservation.value = null;

  // Remettre le produit en stock
  emit("product-updated", {
    ...props.product,
    status: "en_stock",
  });
};

const handleReservationFinalized = ({ reservation, finalPayment }) => {
  activeReservation.value = null;

  // Marquer le produit comme vendu
  emit("product-updated", {
    ...props.product,
    status: "vendu",
  });

  toast({
    title: "Félicitations !",
    description: "Votre achat a été finalisé avec succès",
  });
};

const handleReservationCancelled = (reservation) => {
  activeReservation.value = null;

  // Remettre le produit en stock
  emit("product-updated", {
    ...props.product,
    status: "en_stock",
  });
};

// Simuler une réservation existante pour la démo
const simulateActiveReservation = () => {
  if (props.product.status === "reserve" && props.product.id === 2) {
    activeReservation.value = {
      id: "demo-reservation",
      productId: props.product.id,
      userId: "current-user",
      depositAmount: (props.product.price * 20) / 100,
      remainingAmount: props.product.price - (props.product.price * 20) / 100,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2h pour la démo
      status: "active",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // Créé il y a 30min
    };
  }
};

simulateActiveReservation();
</script>
