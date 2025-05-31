<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header de recherche -->
    <SearchHeader
      v-model:search="searchQuery"
      @search="handleSearch"
      @toggle-filters="isFilterDrawerOpen = !isFilterDrawerOpen"
      :active-filters-count="activeFiltersCount"
    />

    <!-- Contenu principal -->
    <div class="flex-1 flex">
      <!-- Sidebar de filtres (desktop) -->
      <div
        class="hidden lg:block w-80 border-r border-gray-200 bg-white p-6 overflow-y-auto"
      >
        <SearchFilters
          v-model:filters="filters"
          :stores="stores"
          :locations="locations"
          @update:filters="handleFiltersUpdate"
        />
      </div>

      <!-- Drawer de filtres (mobile) -->
      <Sheet v-model:open="isFilterDrawerOpen">
        <SheetContent side="left" class="w-full max-w-sm sm:max-w-md p-0">
          <div class="flex flex-col h-full">
            <div
              class="p-4 border-b border-gray-200 flex items-center justify-between"
            >
              <h2 class="text-lg font-semibold">Filtres</h2>
              <Button
                variant="ghost"
                size="sm"
                @click="isFilterDrawerOpen = false"
              >
                <X class="w-4 h-4" />
              </Button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <SearchFilters
                v-model:filters="filters"
                :stores="stores"
                :locations="locations"
                @update:filters="handleFiltersUpdate"
              />
            </div>
            <div class="p-4 border-t border-gray-200">
              <div class="flex gap-2">
                <Button variant="outline" class="flex-1" @click="resetFilters">
                  Réinitialiser
                </Button>
                <Button class="flex-1" @click="applyFilters">
                  Appliquer ({{ filteredProducts.length }})
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <!-- Zone de résultats -->
      <div class="flex-1 p-4 md:p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto space-y-6">
          <!-- Résumé des filtres actifs -->
          <ActiveFilters
            :filters="filters"
            @remove="removeFilter"
            @save-search="saveSearch"
          />

          <!-- État de chargement -->
          <div v-if="isLoading">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <SkeletonProductCard v-for="i in 8" :key="i" />
            </div>
          </div>

          <!-- Résultats -->
          <div v-else-if="filteredProducts.length > 0">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <ProductCard
                v-for="product in paginatedProducts"
                :key="product.id"
                :product="product"
              />
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex justify-center">
              <div v-if="isLoadingMore" class="flex items-center space-x-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                <span class="text-sm text-gray-500">Chargement...</span>
              </div>
              <Button
                v-else-if="hasMoreProducts"
                variant="outline"
                @click="loadMore"
                class="mx-auto"
              >
                Voir plus de résultats
              </Button>
              <div v-else class="text-sm text-gray-500">Fin des résultats</div>
            </div>
          </div>

          <!-- Aucun résultat -->
          <NoResults v-else :search-query="searchQuery" @reset="resetFilters" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { X, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
//   import { useToast } from '@/components/ui/use-toast'
import { toast } from "vue-sonner";

import SearchHeader from "@/components/SearchHeader";
import SearchFilters from "@/components/SearchFilters";
import ActiveFilters from "@/components/ActiveFilters";
import ProductCard from "~/components/ProductCard.vue";
import SkeletonProductCard from "@/components/SkeletonProductCard";
import NoResults from "@/components/NoResults";

//   const { toast } = useToast()

// État
const searchQuery = ref("");
const isFilterDrawerOpen = ref(false);
const isLoading = ref(true);
const isLoadingMore = ref(false);
const page = ref(1);
const itemsPerPage = ref(12);

// Filtres
const filters = ref({
  price: {
    min: 0,
    max: 2000,
  },
  stores: [],
  location: null,
  depositDeadline: null,
  certifiedOnly: false,
  freeShipping: false,
  negotiable: false,
});

// Données simulées
const products = ref([]);
const stores = ref([
  { id: "1", name: "Ma Boutique Bio", certified: true },
  { id: "2", name: "Tech Store", certified: true },
  { id: "3", name: "Fashion Corner", certified: false },
  { id: "4", name: "Home Decor", certified: true },
  { id: "5", name: "Sports & Loisirs", certified: false },
]);
const locations = ref([
  { id: "1", name: "Paris", zipCode: "75000" },
  { id: "2", name: "Lyon", zipCode: "69000" },
  { id: "3", name: "Marseille", zipCode: "13000" },
  { id: "4", name: "Bordeaux", zipCode: "33000" },
  { id: "5", name: "Lille", zipCode: "59000" },
]);

// Calculs
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
      product.price >= filters.value.price.min &&
      product.price <= filters.value.price.max
  );

  // Filtre par boutique
  if (filters.value.stores.length > 0) {
    result = result.filter((product) =>
      filters.value.stores.includes(product.storeId)
    );
  }

  // Filtre par localisation
  if (filters.value.location) {
    result = result.filter(
      (product) => product.location === filters.value.location
    );
  }

  // Filtre par délai de dépôt
  if (filters.value.depositDeadline) {
    const deadline = new Date(filters.value.depositDeadline);
    result = result.filter((product) => {
      const depositDate = new Date(product.depositDate);
      return depositDate <= deadline;
    });
  }

  // Filtre par vendeur certifié
  if (filters.value.certifiedOnly) {
    result = result.filter((product) => {
      const store = stores.value.find((s) => s.id === product.storeId);
      return store && store.certified;
    });
  }

  // Filtre par livraison gratuite
  if (filters.value.freeShipping) {
    result = result.filter((product) => product.freeShipping);
  }

  // Filtre par négociable
  if (filters.value.negotiable) {
    result = result.filter((product) => product.negotiable);
  }

  return result;
});

const paginatedProducts = computed(() => {
  const end = page.value * itemsPerPage.value;
  return filteredProducts.value.slice(0, end);
});

const hasMoreProducts = computed(() => {
  return paginatedProducts.value.length < filteredProducts.value.length;
});

const activeFiltersCount = computed(() => {
  let count = 0;

  if (filters.value.stores.length > 0) count++;
  if (filters.value.location) count++;
  if (filters.value.depositDeadline) count++;
  if (filters.value.certifiedOnly) count++;
  if (filters.value.freeShipping) count++;
  if (filters.value.negotiable) count++;

  // Prix (seulement si différent des valeurs par défaut)
  if (filters.value.price.min > 0 || filters.value.price.max < 2000) count++;

  return count;
});

// Fonctions
const handleSearch = () => {
  isLoading.value = true;
  page.value = 1;

  // Simuler une recherche
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

const handleFiltersUpdate = () => {
  // Pour la version mobile, on ne recharge pas automatiquement
  if (window.innerWidth >= 1024) {
    handleSearch();
  }
};

const applyFilters = () => {
  isFilterDrawerOpen.value = false;
  handleSearch();
};

const resetFilters = () => {
  filters.value = {
    price: {
      min: 0,
      max: 2000,
    },
    stores: [],
    location: null,
    depositDeadline: null,
    certifiedOnly: false,
    freeShipping: false,
    negotiable: false,
  };

  handleSearch();
};

const removeFilter = (filterName) => {
  if (filterName === "price") {
    filters.value.price = { min: 0, max: 2000 };
  } else if (filterName === "stores") {
    filters.value.stores = [];
  } else if (filterName === "location") {
    filters.value.location = null;
  } else if (filterName === "depositDeadline") {
    filters.value.depositDeadline = null;
  } else if (filterName === "certifiedOnly") {
    filters.value.certifiedOnly = false;
  } else if (filterName === "freeShipping") {
    filters.value.freeShipping = false;
  } else if (filterName === "negotiable") {
    filters.value.negotiable = false;
  }

  handleSearch();
};

const loadMore = () => {
  isLoadingMore.value = true;

  // Simuler un chargement
  setTimeout(() => {
    page.value++;
    isLoadingMore.value = false;
  }, 800);
};

const saveSearch = () => {
  toast({
    title: "Recherche sauvegardée",
    description:
      "Vous recevrez des notifications pour les nouveaux produits correspondants",
  });
};

// Génération de données simulées
const generateMockProducts = () => {
  const mockProducts = [];
  const categories = ["Électronique", "Vêtements", "Maison", "Sport", "Livres"];
  const conditions = ["Neuf", "Comme neuf", "Bon état", "État moyen"];

  for (let i = 1; i <= 50; i++) {
    const storeId =
      stores.value[Math.floor(Math.random() * stores.value.length)].id;
    const locationId =
      locations.value[Math.floor(Math.random() * locations.value.length)].id;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const price = Math.floor(Math.random() * 1900) + 100;

    mockProducts.push({
      id: `product-${i}`,
      title: `Produit ${i} - ${category}`,
      description: `Description du produit ${i}. En ${condition}, idéal pour tous les usages.`,
      price: price,
      storeId: storeId,
      location: locationId,
      category: category,
      condition: condition,
      depositDate: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ).toISOString(),
      freeShipping: Math.random() > 0.5,
      negotiable: Math.random() > 0.7,
      image: `/placeholder.svg?height=300&width=300&text=Produit+${i}`,
    });
  }

  return mockProducts;
};

// Initialisation
onMounted(() => {
  // Simuler le chargement des données
  setTimeout(() => {
    products.value = generateMockProducts();
    isLoading.value = false;
  }, 1500);
});
</script>
