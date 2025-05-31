<template>
  <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
    <div class="flex items-center">
      <span class="text-sm font-medium text-gray-700 mr-2"
        >Filtres actifs:</span
      >
    </div>

    <!-- Prix -->
    <Badge
      v-if="isPriceFiltered"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span
        >Prix: {{ formatCurrency(filters.price.min) }} -
        {{ formatCurrency(filters.price.max) }}</span
      >
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'price')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Boutiques -->
    <Badge
      v-if="filters.stores.length > 0"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span>Boutiques: {{ storeNames }}</span>
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'stores')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Localisation -->
    <Badge
      v-if="filters.location"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span>Lieu: {{ locationName }}</span>
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'location')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Délai de dépôt -->
    <Badge
      v-if="filters.depositDeadline"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span>Dépôt avant: {{ formatDate(filters.depositDeadline) }}</span>
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'depositDeadline')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Vendeur certifié -->
    <Badge
      v-if="filters.certifiedOnly"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span>Vendeurs certifiés</span>
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'certifiedOnly')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Livraison gratuite -->
    <Badge
      v-if="filters.freeShipping"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span>Livraison gratuite</span>
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'freeShipping')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Prix négociable -->
    <Badge
      v-if="filters.negotiable"
      variant="outline"
      class="flex items-center gap-1 bg-gray-50"
    >
      <span>Prix négociable</span>
      <Button
        variant="ghost"
        size="sm"
        class="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
        @click="$emit('remove', 'negotiable')"
      >
        <X class="h-3 w-3" />
      </Button>
    </Badge>

    <!-- Sauvegarder la recherche -->
    <Button
      variant="ghost"
      size="sm"
      class="ml-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      @click="$emit('save-search')"
    >
      <Bookmark class="w-4 h-4 mr-1" />
      <span class="text-sm">Sauvegarder la recherche</span>
    </Button>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import { X, Bookmark } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const props = defineProps({
  filters: {
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

defineEmits(["remove", "save-search"]);

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
const hasActiveFilters = computed(() => {
  return (
    isPriceFiltered.value ||
    filters.value.stores.length > 0 ||
    filters.value.location ||
    filters.value.depositDeadline ||
    filters.value.certifiedOnly ||
    filters.value.freeShipping ||
    filters.value.negotiable
  );
});

const isPriceFiltered = computed(() => {
  return props.filters.price.min > 0 || props.filters.price.max < 2000;
});

const storeNames = computed(() => {
  if (!props.filters.stores.length) return "";

  const names = props.filters.stores.map((storeId) => {
    const store = allStores.value.find((s) => s.id === storeId);
    return store ? store.name : storeId;
  });

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names[0]} +${names.length - 1}`;
});

const locationName = computed(() => {
  if (!props.filters.location) return "";

  const location = allLocations.value.find(
    (l) => l.id === props.filters.location
  );
  return location ? location.name : props.filters.location;
});

// Alias pour les filtres
const filters = computed(() => props.filters);

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
};
</script>
