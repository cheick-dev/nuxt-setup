<template>
  <div class="flex flex-col items-center justify-center py-16">
    <div
      class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
    >
      <Search class="w-12 h-12 text-gray-400" />
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h2>

    <p class="text-gray-500 text-center max-w-md mb-6">
      <template v-if="searchQuery">
        Nous n'avons trouvé aucun résultat pour
        <strong>"{{ searchQuery }}"</strong>.
      </template>
      <template v-else>
        Aucun produit ne correspond aux filtres sélectionnés.
      </template>
      <br />
      Essayez de modifier vos critères de recherche.
    </p>

    <Button @click="$emit('reset')">
      <RefreshCw class="w-4 h-4 mr-2" />
      Réinitialiser les filtres
    </Button>

    <div class="mt-8 space-y-2 text-sm text-gray-500">
      <p class="font-medium">Suggestions :</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Vérifiez l'orthographe des mots-clés</li>
        <li>Utilisez des termes plus généraux</li>
        <li>Réduisez le nombre de filtres</li>
        <li>Essayez une autre catégorie</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Search, RefreshCw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

defineEmits(["reset"]);
</script>
