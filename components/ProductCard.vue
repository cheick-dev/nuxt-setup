<template>
  <Card class="overflow-hidden hover:shadow-md transition-shadow">
    <div class="relative">
      <!-- Image -->
      <div class="aspect-square bg-gray-100 overflow-hidden">
        <img
          :src="product.image"
          :alt="product.title"
          class="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <!-- Badges flottants -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <Badge
          v-if="isCertified"
          variant="secondary"
          class="bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle class="w-3 h-3 mr-1" />
          Certifié
        </Badge>
      </div>
    </div>

    <div class="p-4 space-y-2">
      <!-- Titre et prix -->
      <div class="flex justify-between items-start">
        <h3 class="font-medium text-gray-900 line-clamp-2">
          {{ product.title }}
        </h3>
        <span class="font-bold text-blue-600 whitespace-nowrap ml-2">{{
          formatCurrency(product.price)
        }}</span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Badges -->
      <div class="flex flex-wrap gap-1 pt-1">
        <Badge
          v-if="product.freeShipping"
          variant="outline"
          class="text-xs bg-blue-50 text-blue-700 border-blue-200"
        >
          <Truck class="w-3 h-3 mr-1" />
          Livraison gratuite
        </Badge>

        <Badge
          v-if="product.negotiable"
          variant="outline"
          class="text-xs bg-amber-50 text-amber-700 border-amber-200"
        >
          <MessageSquare class="w-3 h-3 mr-1" />
          Négociable
        </Badge>
      </div>

      <!-- Infos supplémentaires -->
      <div class="flex items-center justify-between pt-2 text-xs text-gray-500">
        <div class="flex items-center">
          <MapPin class="w-3 h-3 mr-1" />
          <span>{{ locationName }}</span>
        </div>

        <div>
          {{ formatTimeAgo(product.depositDate) }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed, inject } from "vue";
import { CheckCircle, Truck, MessageSquare, MapPin } from "lucide-vue-next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  stores: {
    type: Array,
    default: () => [],
  },
  locations: {
    type: Array,
    default: () => [],
  },
});

// Injecter les stores et locations depuis le parent si non fournis en props
const injectedStores = inject("stores", []);
const injectedLocations = inject("locations", []);

const allStores = computed(() =>
  props.stores.length ? props.stores : injectedStores
);
const allLocations = computed(() =>
  props.locations.length ? props.locations : injectedLocations
);

// Calculs
const isCertified = computed(() => {
  const store = allStores.value.find((s) => s.id === props.product.storeId);
  return store && store.certified;
});

const locationName = computed(() => {
  const location = allLocations.value.find(
    (l) => l.id === props.product.location
  );
  return location ? location.name : "Non spécifié";
});

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  }
};
</script>
