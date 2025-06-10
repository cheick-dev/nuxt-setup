<template>
  <Card class="overflow-hidden hover:shadow-md transition-shadow">
    <div class="p-6 space-y-4">
      <!-- En-tête avec statut -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-900 truncate">{{ store.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">
            ID: {{ store.id.slice(0, 8) }}...
          </p>
        </div>
        <Badge
          :variant="store.is_active ? 'default' : 'secondary'"
          :class="
            store.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          "
        >
          {{ store.is_active ? "Actif" : "Inactif" }}
        </Badge>
      </div>

      <!-- Informations -->
      <div class="space-y-2">
        <div class="flex items-start space-x-2">
          <MapPin class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p class="text-sm text-gray-600">{{ store.address }}</p>
        </div>

        <div class="flex items-center space-x-2">
          <Phone class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <p class="text-sm text-gray-600">{{ store.phone }}</p>
        </div>

        <div class="flex items-center space-x-2">
          <User class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <p class="text-sm text-gray-600">{{ managerName }}</p>
        </div>
      </div>

      <!-- Métadonnées -->
      <div
        class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t"
      >
        <span>Créé le {{ formatDate(store.created_at) }}</span>
        <div class="flex items-center space-x-1">
          <Calendar class="w-3 h-3" />
          <span>{{ timeAgo(store.created_at) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          @click="$emit('edit', store)"
          class="flex-1"
        >
          <Edit class="w-3 h-3 mr-1" />
          Modifier
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="$emit('toggle-status', store)"
          :class="
            store.is_active
              ? 'text-red-600 hover:bg-red-50'
              : 'text-green-600 hover:bg-green-50'
          "
        >
          <component
            :is="store.is_active ? EyeOff : Eye"
            class="w-3 h-3 mr-1"
          />
          {{ store.is_active ? "Désactiver" : "Activer" }}
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="$emit('delete', store)"
          class="text-red-600 hover:bg-red-50"
        >
          <Trash2 class="w-3 h-3" />
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from "vue";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

defineEmits(["edit", "toggle-status", "delete"]);

// Nom du gestionnaire (simulé)
const managerName = computed(() => {
  // Dans une vraie app, on ferait un join avec la table profiles
  return "Gestionnaire assigné";
});

// Fonctions utilitaires
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const timeAgo = (dateString) => {
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
