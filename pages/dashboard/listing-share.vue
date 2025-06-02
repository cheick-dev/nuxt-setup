<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Contenu principal -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Partager mon annonce
            </h1>
            <p class="text-sm text-gray-500">
              Générez un lien court et un QR code pour partager facilement
            </p>
          </div>

          <Button variant="outline" @click="goBack">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Annonce avec bandeau si expirée -->
          <ExpiredListingBanner
            :expiry-date="listing.expiryDate"
            @republish="handleRepublish"
          >
            <Card class="p-6">
              <div class="flex items-start space-x-4">
                <div class="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                  <img
                    v-if="listing.images && listing.images.length > 0"
                    :src="listing.images[0].url"
                    alt="Aperçu du produit"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900 truncate">
                      {{ listing.title }}
                    </h2>
                    <ExpirationBadge :expiry-date="listing.expiryDate" />
                  </div>
                  <p class="text-lg font-bold text-blue-600 mt-1">
                    {{ formatCurrency(listing.price) }}
                  </p>
                  <p class="text-sm text-gray-600 mt-2 line-clamp-2">
                    {{ listing.description }}
                  </p>
                </div>
              </div>
            </Card>
          </ExpiredListingBanner>

          <!-- Interface de partage -->
          <ShareListing :listing="listing" />

          <!-- Simulateur Edge Function -->
          <EdgeFunctionExpirationSimulator />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//   import { useToast } from '@/components/ui/use-toast'
import { toast } from "vue-sonner";

import ShareListing from "~/components/ShareListing";
import ExpirationBadge from "~/components/ExpirationBadge";
import ExpiredListingBanner from "~/components/ExpiredListingBanner";
import EdgeFunctionExpirationSimulator from "@/components/EdgeFunctionExpirationSimulator";

//   const { toast } = useToast()

// Données simulées de l'annonce
const listing = ref({
  id: "123",
  title: "iPhone 14 Pro Max 256GB",
  description:
    "Smartphone Apple en excellent état, avec tous les accessoires d'origine. Aucune rayure, batterie en parfait état. Vendu avec boîte, chargeur et écouteurs.",
  price: 899.99,
  status: "published",
  // Expiration dans 30 jours à partir d\'aujourd\'ui
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  // Pour tester l\'expiration, décommentez la ligne ci-dessous
  // expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  images: [
    { id: 1, url: "/placeholder.svg?height=200&width=200", name: "image1.jpg" },
    { id: 2, url: "/placeholder.svg?height=200&width=200", name: "image2.jpg" },
  ],
  created_at: new Date().toISOString(),
});

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const goBack = () => {
  // Simulation de navigation
  console.log("Retour à la liste des annonces");
};

const handleRepublish = () => {
  // Simuler la republication
  listing.value = {
    ...listing.value,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published",
  };

  toast({
    title: "Annonce republiée",
    description: "Votre annonce a été republiée pour 30 jours",
  });
};
</script>
