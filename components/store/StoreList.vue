<template>
  <div class="space-y-6">
    <!-- En-tête avec actions -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestion des stores</h2>
        <p class="text-gray-500">{{ stores.length }} store(s) au total</p>
      </div>

      <Button
        @click="$emit('create-store')"
        class="bg-green-600 hover:bg-green-700"
      >
        <Store class="w-4 h-4 mr-2" />
        Nouveau store
      </Button>
    </div>

    <!-- Filtres -->
    <Card class="p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <Input
              v-model="searchQuery"
              placeholder="Rechercher un store..."
              class="pl-10"
            />
          </div>
        </div>

        <Select v-model="statusFilter">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>

    <!-- Liste des stores -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StoreCard
        v-for="store in filteredStores"
        :key="store.id"
        :store="store"
        @edit="$emit('edit-store', store)"
        @toggle-status="handleToggleStatus"
        @delete="handleDelete"
      />
    </div>

    <!-- Message si aucun store -->
    <div v-if="filteredStores.length === 0" class="text-center py-12">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Store class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun store trouvé</h3>
      <p class="text-gray-500">
        {{
          searchQuery
            ? "Essayez de modifier votre recherche"
            : "Commencez par créer votre premier store"
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Store, Search } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "vue-sonner";

import StoreCard from "@/components/store/StoreCard.vue";

const props = defineProps({
  stores: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "create-store",
  "edit-store",
  "store-updated",
  "store-deleted",
]);

// État
const searchQuery = ref("");
const statusFilter = ref("all");

// Stores filtrés
const filteredStores = computed(() => {
  let result = [...props.stores];

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
    );
  }

  // Filtre par statut
  if (statusFilter.value !== "all") {
    const isActive = statusFilter.value === "active";
    result = result.filter((store) => store.is_active === isActive);
  }

  return result;
});

// Fonctions
const handleToggleStatus = async (store) => {
  try {
    // Simulation de la mise à jour
    const updatedStore = {
      ...store,
      is_active: !store.is_active,
    };

    emit("store-updated", updatedStore);

    toast("Statut mis à jour !", {
      description: `Le store "${store.name}" est maintenant ${
        updatedStore.is_active ? "actif" : "inactif"
      }`,
    });
  } catch (error) {
    toast("Erreur", {
      description: "Impossible de mettre à jour le statut",
    });
  }
};

const handleDelete = async (store) => {
  if (
    confirm(`Êtes-vous sûr de vouloir supprimer le store "${store.name}" ?`)
  ) {
    try {
      emit("store-deleted", store.id);

      toast("Store supprimé", {
        description: `Le store "${store.name}" a été supprimé`,
      });
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de supprimer le store",
      });
    }
  }
};
</script>
