<template>
  <Card class="overflow-hidden hover:shadow-md transition-shadow">
    <div class="relative">
      <!-- Image -->
      <div class="aspect-square bg-gray-100 overflow-hidden">
        <img
          :src="product.images[0]"
          :alt="product.title"
          class="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <!-- Badges flottants -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <Badge
          v-if="product.certified"
          variant="secondary"
          class="bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle class="w-3 h-3 mr-1" />
          Certifié
        </Badge>
      </div>
    </div>

    <div class="p-4 space-y-2">
      <!-- Catégorie -->
      <div class="text-xs text-gray-500">{{ product.category }}</div>

      <!-- Titre et prix -->
      <div class="flex justify-between items-start">
        <h3 class="font-medium text-gray-900 line-clamp-2">
          {{ product.title }}
        </h3>
        <span class="font-bold text-green-600 whitespace-nowrap ml-2">{{
          formatCurrency(product.price)
        }}</span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Évaluation -->
      <div class="flex items-center">
        <div class="flex">
          <Star
            v-for="i in 5"
            :key="i"
            :class="[
              'w-4 h-4',
              i <= Math.floor(product.rating)
                ? 'text-yellow-400'
                : 'text-gray-300',
              i === Math.ceil(product.rating) && product.rating % 1 > 0
                ? 'text-yellow-400'
                : '',
            ]"
          />
        </div>
        <span class="text-xs text-gray-500 ml-1">
          ({{ product.reviewCount }})
        </span>
      </div>

      <!-- Badges -->
      <div class="flex flex-wrap gap-1 pt-1">
        <Badge
          v-if="product.freeShipping"
          variant="outline"
          class="text-xs bg-blue-50 text-blue-700 border-blue-200"
        >
          <Truck class="w-3 h-3 mr-1" />
          Livraison gratuite
        </Badge>

        <Badge variant="outline" class="text-xs">
          {{ getConditionLabel(product.condition) }}
        </Badge>
      </div>

      <!-- Bouton -->
      <Button class="w-full mt-2 bg-green-600 hover:bg-green-700">
        <ShoppingCart class="w-4 h-4 mr-2" />
        Ajouter au panier
      </Button>
    </div>
  </Card>
</template>

<script setup>
import { CheckCircle, Truck, Star, ShoppingCart } from "lucide-vue-next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const getConditionLabel = (condition) => {
  const conditions = {
    new: "Neuf",
    like_new: "Comme neuf",
    good: "Bon état",
    fair: "État moyen",
  };

  return conditions[condition] || condition;
};
</script>
