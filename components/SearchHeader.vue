<template>
  <header
    class="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm"
  >
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center">
        <!-- Logo (visible sur desktop) -->
        <div class="hidden md:flex items-center mr-4">
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <Store class="w-5 h-5 text-white" />
          </div>
          <span class="ml-2 text-xl font-bold text-gray-900">WebShop</span>
        </div>

        <!-- Barre de recherche -->
        <div class="flex-1 relative">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <Input
              v-model="localSearch"
              placeholder="Recherche un produit, une marque..."
              class="pl-10 pr-10"
              @keyup.enter="emitSearch"
            />
            <Button
              v-if="localSearch"
              variant="ghost"
              size="sm"
              class="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              @click="clearSearch"
            >
              <X class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Bouton de filtres -->
        <Button
          variant="outline"
          class="ml-2 relative"
          @click="$emit('toggle-filters')"
        >
          <SlidersHorizontal class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Filtres</span>
          <Badge
            v-if="activeFiltersCount > 0"
            class="absolute -top-2 -right-2 bg-blue-600"
          >
            {{ activeFiltersCount }}
          </Badge>
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { Search, SlidersHorizontal, X, Store } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const props = defineProps({
  search: {
    type: String,
    default: "",
  },
  activeFiltersCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:search", "search", "toggle-filters"]);

const localSearch = ref(props.search);

watch(
  () => props.search,
  (newValue) => {
    localSearch.value = newValue;
  }
);

watch(localSearch, (newValue) => {
  emit("update:search", newValue);
});

const emitSearch = () => {
  emit("search");
};

const clearSearch = () => {
  localSearch.value = "";
  emit("update:search", "");
  emit("search");
};
</script>
