<template>
  <Card class="p-6">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Simulation Edge Function
        </h3>
        <Badge variant="outline" class="bg-blue-50 text-blue-700">
          <Zap class="w-3 h-3 mr-1" />
          Automatique
        </Badge>
      </div>

      <div class="text-sm text-gray-600">
        <p>
          Cette fonction s'exécute automatiquement chaque jour à minuit pour :
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Vérifier les produits avec plus de 7 jours d'entreposage</li>
          <li>Calculer les frais journaliers</li>
          <li>
            Mettre à jour le champ
            <code class="bg-gray-100 px-1 rounded">extra_fees</code>
          </li>
          <li>Envoyer des notifications aux vendeurs</li>
        </ul>
      </div>

      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-2">
          <Clock class="w-4 h-4 text-gray-500" />
          <span class="text-sm">Dernière exécution: {{ lastRun }}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          @click="runManualCheck"
          :disabled="isRunning"
        >
          <template v-if="isRunning">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            Exécution...
          </template>
          <template v-else>
            <Play class="w-4 h-4 mr-2" />
            Exécuter maintenant
          </template>
        </Button>
      </div>

      <!-- Résultats de la dernière exécution -->
      <div v-if="lastResults" class="space-y-3">
        <h4 class="font-medium text-gray-900">Derniers résultats</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">
              {{ lastResults.checked }}
            </div>
            <div class="text-xs text-blue-700">Produits vérifiés</div>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">
              {{ lastResults.billed }}
            </div>
            <div class="text-xs text-red-700">Produits facturés</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">
              {{ formatCurrency(lastResults.totalFees) }}
            </div>
            <div class="text-xs text-green-700">Frais générés</div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Zap, Clock, Play, Loader2 } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";

import { toast } from "vue-sonner";

// État
const isRunning = ref(false);
const lastRun = ref("");
const lastResults = ref(null);

// Simulation de l'Edge Function
const runManualCheck = async () => {
  isRunning.value = true;

  try {
    // Simulation du traitement
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Résultats simulés
    const results = {
      checked: Math.floor(Math.random() * 50) + 10,
      billed: Math.floor(Math.random() * 15) + 2,
      totalFees: (Math.floor(Math.random() * 15) + 2) * 2, // 2€ par jour
    };

    lastResults.value = results;
    lastRun.value = new Date().toLocaleString("fr-FR");

    toast({
      title: "Vérification terminée",
      description: `${
        results.billed
      } produit(s) facturé(s) pour ${formatCurrency(results.totalFees)}`,
    });

    // Simulation des notifications aux vendeurs
    if (results.billed > 0) {
      setTimeout(() => {
        toast({
          title: "Notifications envoyées",
          description: `${results.billed} vendeur(s) notifié(s) des frais d'entreposage`,
        });
      }, 1000);
    }
  } catch (error) {
    toast({
      title: "Erreur d'exécution",
      description: "Impossible d'exécuter la vérification",
      variant: "destructive",
    });
  } finally {
    isRunning.value = false;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// Initialisation
onMounted(() => {
  lastRun.value = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(
    "fr-FR"
  );
  lastResults.value = {
    checked: 42,
    billed: 8,
    totalFees: 16,
  };
});
</script>
