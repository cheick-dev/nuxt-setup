<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Contenu principal -->
    <main>
      <!-- Section Hero -->
      <section
        class="relative bg-gradient-to-r from-green-50 to-green-100 py-16 md:py-24"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Découvrez des produits uniques et durables
              </h1>
              <p class="text-lg text-gray-600 mb-6">
                Notre marketplace met en relation acheteurs et vendeurs
                responsables pour une consommation plus éthique et durable.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <Button size="lg" class="bg-green-600 hover:bg-green-700">
                  Explorer les produits
                </Button>
                <Button variant="outline" size="lg"> Devenir vendeur </Button>
              </div>
            </div>
            <div class="md:w-1/2 hidden md:block">
              <!-- src="/images.jpg?height=400&width=600&text=Marketplace+Hero" -->
              <img
                src="/hero.jpg"
                alt="Marketplace Hero"
                class="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Filtres et produits -->
      <section class="py-12 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Sidebar filtres -->
            <div class="md:w-64 flex-shrink-0">
              <div
                class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24"
              >
                <h3 class="font-medium text-lg mb-4">Filtres</h3>

                <!-- Recherche -->
                <div class="mb-6">
                  <Label for="search">Recherche</Label>
                  <div class="relative mt-1">
                    <Search
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    />
                    <Input
                      id="search"
                      v-model="searchQuery"
                      placeholder="Rechercher..."
                      class="pl-10"
                    />
                  </div>
                </div>

                <!-- Prix -->
                <div class="mb-6">
                  <Label class="mb-2 block">Prix</Label>
                  <Slider
                    v-model="priceRange"
                    :min="0"
                    :max="2000"
                    :step="10"
                    :minStepsBetweenThumbs="1"
                    class="mb-4"
                  />
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">{{
                      formatCurrency(priceRange[0])
                    }}</span>
                    <span class="text-sm text-gray-500">{{
                      formatCurrency(priceRange[1])
                    }}</span>
                  </div>
                </div>

                <!-- État -->
                <div class="mb-6">
                  <Label class="mb-2 block">État</Label>
                  <Select v-model="condition">
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les états" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les états</SelectItem>
                      <SelectItem value="new">Neuf</SelectItem>
                      <SelectItem value="like_new">Comme neuf</SelectItem>
                      <SelectItem value="good">Bon état</SelectItem>
                      <SelectItem value="fair">État moyen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Options -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <Switch
                      v-model:checked="certifiedOnly"
                      id="certified-only"
                    />
                    <Label for="certified-only">Vendeurs certifiés</Label>
                  </div>

                  <div class="flex items-center space-x-2">
                    <Switch v-model:checked="freeShipping" id="free-shipping" />
                    <Label for="free-shipping">Livraison gratuite</Label>
                  </div>
                </div>

                <Button class="w-full mt-6">Appliquer les filtres</Button>
              </div>
            </div>

            <!-- Produits -->
            <div class="flex-1">
              <!-- En-tête des résultats -->
              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
              >
                <h2 class="text-2xl font-bold text-gray-900">Nos produits</h2>

                <div class="flex items-center mt-3 sm:mt-0">
                  <Label for="sort" class="mr-2 text-sm">Trier par:</Label>
                  <Select v-model="sortBy" class="w-40">
                    <SelectTrigger id="sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récents</SelectItem>
                      <SelectItem value="price_asc">Prix croissant</SelectItem>
                      <SelectItem value="price_desc"
                        >Prix décroissant</SelectItem
                      >
                      <SelectItem value="popular">Popularité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <!-- Grille de produits -->
              <div
                v-if="isLoading"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <SkeletonProductCard v-for="i in 6" :key="i" />
              </div>

              <div
                v-else-if="filteredProducts.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <HomeProductCard
                  v-for="product in filteredProducts"
                  :key="product.id"
                  :product="product"
                />
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
                <p class="text-gray-500">
                  Essayez de modifier vos filtres de recherche
                </p>
              </div>

              <!-- Pagination -->
              <div class="mt-12 flex justify-center">
                <div class="flex space-x-1">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    class="bg-green-50 text-green-600"
                    >1</Button
                  >
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

import { Package, Search, ChevronLeft, ChevronRight } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import HomeProductCard from "@/components/home/HomeProductCard.vue";
import SkeletonProductCard from "@/components/SkeletonProductCard";

import { supabaseService } from "@/services/supabaseService";

// État
const isLoading = ref(true);
const searchQuery = ref("");
const priceRange = ref([0, 2000]);
const condition = ref("all");
const sortBy = ref("newest");
const certifiedOnly = ref(false);
const freeShipping = ref(false);
const selectedCategories = ref({});

const products = ref([]);

// Initialiser les catégories sélectionnées
onMounted(async () => {
  const result = await supabaseService.getAllProducts();
  products.value = result;
  isLoading.value = false;
});

// Produits filtrés
const filteredProducts = computed(() => {
  let result = [...products.value];

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Filtre par prix
  result = result.filter(
    (product) =>
      product.price >= priceRange.value[0] &&
      product.price <= priceRange.value[1]
  );

  // Filtre par catégorie
  const selectedCategoryIds = Object.entries(selectedCategories.value)
    .filter(([_, isSelected]) => isSelected)
    .map(([id]) => Number(id));

  if (selectedCategoryIds.length > 0) {
    result = result.filter((product) =>
      selectedCategoryIds.includes(product.categoryId)
    );
  }

  // Filtre par état
  if (condition.value !== "all") {
    result = result.filter((product) => product.condition === condition.value);
  }

  // Filtre par vendeur certifié
  if (certifiedOnly.value) {
    result = result.filter((product) => product.certified);
  }

  // Filtre par livraison gratuite
  if (freeShipping.value) {
    result = result.filter((product) => product.freeShipping);
  }

  // Tri
  if (sortBy.value === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "newest") {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy.value === "popular") {
    result.sort((a, b) => b.popularity - a.popularity);
  }

  return result;
});

// Fonctions utilitaires
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
</script>
