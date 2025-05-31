<template>
  <div v-if="isExpired" class="relative overflow-hidden">
    <!-- Bandeau "Expirée" -->
    <div
      class="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 transform rotate-45 translate-x-1/4 translate-y-1/4 shadow-md"
    >
      <span class="text-xs font-bold">EXPIRÉE</span>
    </div>

    <!-- Overlay semi-transparent -->
    <div
      class="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center"
    >
      <div
        class="bg-white bg-opacity-90 rounded-lg p-4 max-w-xs text-center shadow-lg"
      >
        <XCircle class="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h3 class="font-bold text-gray-900">Annonce expirée</h3>
        <p class="text-sm text-gray-600 mt-1">
          Cette annonce n'est plus disponible depuis le
          {{ formatDate(expiryDate) }}
        </p>
        <Button
          variant="outline"
          size="sm"
          class="mt-3"
          @click="$emit('republish')"
        >
          <RefreshCw class="w-3 h-3 mr-1" />
          Republier
        </Button>
      </div>
    </div>

    <!-- Contenu original (avec effet flou) -->
    <div class="filter blur-sm">
      <slot></slot>
    </div>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { XCircle, RefreshCw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const props = defineProps({
  expiryDate: {
    type: [Date, String],
    required: true,
  },
});

defineEmits(["republish"]);

// Calculs
const isExpired = computed(() => {
  const today = new Date();
  const expiryDate = new Date(props.expiryDate);
  return expiryDate < today;
});

// Fonctions
const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};
</script>
