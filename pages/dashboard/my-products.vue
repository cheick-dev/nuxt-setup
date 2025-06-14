<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});

import { Package, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import HomeProductCard from "@/components/home/HomeProductCard.vue";
import SkeletonProductCard from "@/components/SkeletonProductCard.vue";

import { supabaseService } from "@/services/supabaseService";

const isLoading = ref(true);
const sortBy = ref("newest");
const products = ref([]);

const currentPage = ref(1);
const perPage = 6;

const totalPages = computed(() => Math.ceil(products.value.length / perPage));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return products.value.slice(start, end);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

onMounted(async () => {
  const result = await supabaseService.getMyProducts();
  products.value = result;
  isLoading.value = false;
});
</script>

<template>
  <div class="flex-1">
    <!-- En-tête -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
    >
      <h2 class="text-2xl font-bold text-gray-900">Mes annonces</h2>

      <div class="flex items-center mt-3 sm:mt-0">
        <Label for="sort" class="mr-2 text-sm">Trier par:</Label>
        <Select v-model="sortBy" class="w-40">
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
            <SelectItem value="popular">Popularité</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Grille produits -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <SkeletonProductCard v-for="i in perPage" :key="i" />
    </div>

    <div v-else-if="products.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <HomeProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination -->
      <div class="mt-12 flex justify-center">
        <div class="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>

          <Button
            v-for="page in totalPages"
            :key="page"
            variant="outline"
            size="sm"
            :class="{
              'bg-green-50 text-green-600': currentPage === page,
            }"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>

          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Package class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Aucun produit trouvé
      </h3>
      <p class="text-gray-500">Essayez de modifier vos filtres de recherche</p>
    </div>
  </div>
</template>
