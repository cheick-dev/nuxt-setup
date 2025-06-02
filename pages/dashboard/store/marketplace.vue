<template>
  <div class="flex bg-gray-50">
    <!-- Contenu principal -->
    <!-- <main class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Marketplace</h1>
            <p class="text-sm text-gray-500">
              Découvrez nos produits disponibles
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <Badge variant="outline" class="bg-green-50 text-green-700">
              {{ availableProducts }} produit(s) disponible(s)
            </Badge>
            <Badge variant="outline" class="bg-orange-50 text-orange-700">
              {{ reservedProducts }} réservation(s) active(s)
            </Badge>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-6xl mx-auto">
         
          <Card class="p-4 mb-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <div class="relative">
                  <Search
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  />
                  <Input
                    v-model="searchQuery"
                    placeholder="Rechercher un produit..."
                    class="pl-10"
                  />
                </div>
              </div>

              <Select v-model="statusFilter">
                <SelectTrigger class="w-40">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="en_stock">Disponible</SelectItem>
                  <SelectItem value="reserve">Réservé</SelectItem>
                  <SelectItem value="vendu">Vendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

 
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductReservationCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @product-updated="updateProduct"
              @reservation-created="handleReservationCreated"
            />
          </div>

          
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
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
        </div>
      </div>
    </main> -->

    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Filtres -->
        <Card class="p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <Input
                  v-model="searchQuery"
                  placeholder="Rechercher un produit..."
                  class="pl-10"
                />
              </div>
            </div>

            <Select v-model="statusFilter">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="en_stock">Disponible</SelectItem>
                <SelectItem value="reserve">Réservé</SelectItem>
                <SelectItem value="vendu">Vendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <!-- Grille des produits -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductReservationCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @product-updated="updateProduct"
            @reservation-created="handleReservationCreated"
          />
        </div>

        <!-- Message si aucun produit -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
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
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "store",
  title: "Marketplace",
});

import { ref, computed } from "vue";
// import { Store, ShoppingBag, Heart, Search, Package } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "vue-sonner";

import ProductReservationCard from "@/components/ProductReservationCard";

// const { toast } = useToast();

// Filtres
const searchQuery = ref("");
const statusFilter = ref("all");

// Données des produits
const products = ref([
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    description:
      "Smartphone Apple 256GB, état excellent, avec tous les accessoires",
    price: 899.99,
    type: "webshop",
    status: "en_stock",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    description: "Ordinateur portable Apple, 8GB RAM, 256GB SSD, parfait état",
    price: 1299.99,
    type: "interne",
    status: "reserve", // Produit avec réservation active pour la démo
    created_at: "2024-01-20",
  },
  {
    id: 3,
    title: "Samsung Galaxy S24",
    description: "Smartphone Samsung 128GB, comme neuf, garantie 6 mois",
    price: 699.99,
    type: "webshop",
    status: "en_stock",
    created_at: "2024-01-10",
  },
  {
    id: 4,
    title: "iPad Pro 12.9",
    description: "Tablette Apple avec Apple Pencil, idéal pour le design",
    price: 999.99,
    type: "webshop",
    status: "vendu",
    created_at: "2024-01-05",
  },
]);

// Produits filtrés
const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== "all") {
    filtered = filtered.filter(
      (product) => product.status === statusFilter.value
    );
  }

  return filtered;
});

// Statistiques
const availableProducts = computed(() => {
  return products.value.filter((p) => p.status === "en_stock").length;
});

const reservedProducts = computed(() => {
  return products.value.filter((p) => p.status === "reserve").length;
});

// Fonctions
const updateProduct = (updatedProduct) => {
  const index = products.value.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products.value[index] = updatedProduct;
  }
};

const handleReservationCreated = (reservation) => {
  toast({
    title: "Notification vendeur",
    description: "Le vendeur a été notifié de votre réservation",
  });
};
</script>
